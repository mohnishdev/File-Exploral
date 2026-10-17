import {
  MAX_SVG_BYTES,
  MAX_SVG_PATHS,
  type VectorizationResult,
} from "./types";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const allowedElements = new Set(["svg", "g", "path", "rect", "circle", "ellipse", "polygon", "polyline", "line"]);
const allowedAttributes = new Set([
  "xmlns", "width", "height", "viewBox", "d", "fill", "fill-rule", "fill-opacity",
  "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit",
  "stroke-opacity", "opacity", "transform", "x", "y", "x1", "y1", "x2", "y2",
  "cx", "cy", "r", "rx", "ry", "points", "shape-rendering",
]);

function sanitizeElement(source: Element, targetDocument: XMLDocument): Element | undefined {
  if (!allowedElements.has(source.localName) || source.namespaceURI !== SVG_NAMESPACE) return undefined;
  const target = targetDocument.createElementNS(SVG_NAMESPACE, source.localName);
  for (const attribute of Array.from(source.attributes)) {
    if (!allowedAttributes.has(attribute.name) || /^on/i.test(attribute.name)) continue;
    if (/url\s*\(|javascript:|data:/i.test(attribute.value)) continue;
    target.setAttribute(attribute.name, attribute.value);
  }
  for (const child of Array.from(source.children)) {
    const sanitized = sanitizeElement(child, targetDocument);
    if (sanitized) target.appendChild(sanitized);
  }
  return target;
}

export function sanitizeAndInspectSvg(svg: string): VectorizationResult {
  if (new Blob([svg]).size > MAX_SVG_BYTES) {
    throw new Error("This image produced an SVG that is too complex to safely preview. Try Low detail, fewer colors, or a smaller PNG.");
  }

  const parser = new DOMParser();
  const parsed = parser.parseFromString(svg, "image/svg+xml");
  if (parsed.querySelector("parsererror")) {
    throw new Error("The vector engine returned an invalid SVG. Try different settings or another image.");
  }

  const sourceRoot = parsed.documentElement;
  if (sourceRoot.localName !== "svg" || sourceRoot.namespaceURI !== SVG_NAMESPACE) {
    throw new Error("The vector engine returned an unsupported SVG result.");
  }
  const sanitizedRoot = sanitizeElement(sourceRoot, document.implementation.createDocument(SVG_NAMESPACE, "svg"));
  if (!sanitizedRoot) throw new Error("The SVG result could not be safely prepared for preview.");

  const viewBox = sanitizedRoot.getAttribute("viewBox");
  const dimensions = viewBox?.trim().split(/[ ,]+/).map(Number);
  if (!viewBox || !dimensions || dimensions.length !== 4 || dimensions.some((value) => !Number.isFinite(value))) {
    throw new Error("The vector engine returned an SVG with invalid dimensions.");
  }

  sanitizedRoot.setAttribute("width", String(dimensions[2]));
  sanitizedRoot.setAttribute("height", String(dimensions[3]));
  sanitizedRoot.setAttribute("viewBox", dimensions.join(" "));
  const pathCount = sanitizedRoot.querySelectorAll("path").length;
  if (pathCount === 0) throw new Error("No vector shapes were found. Try a different threshold or a simpler image.");
  if (pathCount > MAX_SVG_PATHS) {
    throw new Error("This image produced too many vector shapes. Try Low detail, fewer colors, or a smaller PNG.");
  }

  const serialized = new XMLSerializer().serializeToString(sanitizedRoot);
  if (new Blob([serialized]).size > MAX_SVG_BYTES) {
    throw new Error("This image produced an SVG that is too complex to safely preview. Try Low detail, fewer colors, or a smaller PNG.");
  }
  return {
    svg: serialized,
    pathCount,
    viewBox: dimensions.join(" "),
    width: dimensions[2],
    height: dimensions[3],
  };
}
