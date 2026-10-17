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

function optimizePathMarkup(root: Element, targetDocument: XMLDocument): void {
  const children = Array.from(root.children);
  const optimizedChildren = targetDocument.createDocumentFragment();
  let colorGroup: SVGGElement | undefined;
  let groupFill = "";

  // Group only adjacent paths so their SVG paint order stays unchanged.
  const flushColorGroup = () => {
    if (!colorGroup) return;
    optimizedChildren.appendChild(colorGroup);
    colorGroup = undefined;
    groupFill = "";
  };

  for (const child of children) {
    if (child.localName !== "path") {
      flushColorGroup();
      optimizedChildren.appendChild(child);
      continue;
    }

    const fill = child.getAttribute("fill") ?? "";
    if (child.getAttribute("stroke") === fill && child.getAttribute("stroke-width") === "0") {
      child.removeAttribute("stroke");
      child.removeAttribute("stroke-width");
    }
    if (child.getAttribute("opacity") === "1") child.removeAttribute("opacity");

    const rgb = /^rgb\((\d+),(\d+),(\d+)\)$/.exec(fill);
    const normalizedFill = rgb
      ? `#${rgb.slice(1).map((channel) => Number(channel).toString(16).padStart(2, "0")).join("")}`
      : fill;
    child.setAttribute("fill", normalizedFill);

    if (!colorGroup || groupFill !== normalizedFill) {
      flushColorGroup();
      colorGroup = targetDocument.createElementNS(SVG_NAMESPACE, "g") as SVGGElement;
      colorGroup.setAttribute("fill", normalizedFill);
      groupFill = normalizedFill;
    }
    child.removeAttribute("fill");
    colorGroup.appendChild(child);
  }
  flushColorGroup();
  root.replaceChildren(optimizedChildren);
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
  const sanitizedDocument = document.implementation.createDocument(SVG_NAMESPACE, "svg");
  const sanitizedRoot = sanitizeElement(sourceRoot, sanitizedDocument);
  if (!sanitizedRoot) throw new Error("The SVG result could not be safely prepared for preview.");
  optimizePathMarkup(sanitizedRoot, sanitizedDocument);

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
