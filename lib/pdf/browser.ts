import { PDFDocument, degrees } from "pdf-lib";
import type { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";
import { MAX_IMAGE_BYTES } from "@/lib/image/validation";

export const MAX_PDF_BYTES = 150 * 1024 * 1024;
export const MAX_PDF_PAGES = 500;

export type BrowserPdfDocument = {
  document: PDFDocumentProxy;
  destroy: () => Promise<void>;
};

function pdfBlob(bytes: Uint8Array) {
  return new Blob([Uint8Array.from(bytes).buffer], { type: "application/pdf" });
}

export function validatePdfFile(file: File) {
  const validType = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!validType) throw new Error("Choose a PDF file.");
  if (!file.size) throw new Error("This PDF is empty.");
  if (file.size > MAX_PDF_BYTES) throw new Error("This PDF is larger than the 150 MB browser-processing limit.");
}

export async function openPdf(file: File): Promise<BrowserPdfDocument> {
  validatePdfFile(file);
  if (typeof Worker === "undefined") {
    throw new Error("This browser does not support PDF processing in a worker.");
  }
  let destroyLoadingTask: (() => Promise<void>) | undefined;
  try {
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
      import.meta.url,
    ).toString();
    const loadingTask = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
    destroyLoadingTask = () => loadingTask.destroy();
    const document = await loadingTask.promise;
    if (document.numPages > MAX_PDF_PAGES) {
      await loadingTask.destroy();
      destroyLoadingTask = undefined;
      throw new Error(`This PDF exceeds the ${MAX_PDF_PAGES}-page browser-processing limit.`);
    }
    return { document, destroy: () => loadingTask.destroy() };
  } catch (error) {
    if (destroyLoadingTask) void destroyLoadingTask();
    if (error instanceof Error && error.message.includes("page browser-processing limit")) throw error;
    throw new Error("This PDF could not be opened. It may be corrupted, encrypted, or use unsupported features.");
  }
}

export async function loadPdfLib(file: File) {
  validatePdfFile(file);
  try {
    return await PDFDocument.load(await file.arrayBuffer());
  } catch {
    throw new Error("This PDF could not be edited. It may be corrupted or password-protected.");
  }
}

export async function mergePdfs(files: File[]): Promise<Blob> {
  if (files.length < 2) throw new Error("Choose at least two PDF files to merge.");
  const merged = await PDFDocument.create();
  for (const file of files) {
    const document = await loadPdfLib(file);
    if (merged.getPageCount() + document.getPageCount() > MAX_PDF_PAGES) {
      throw new Error(`The merged document exceeds the ${MAX_PDF_PAGES}-page browser limit.`);
    }
    const pages = await merged.copyPages(document, document.getPageIndices());
    pages.forEach((page) => merged.addPage(page));
  }
  return pdfBlob(await merged.save());
}

export async function extractPdfPages(file: File, pageNumbers: number[]): Promise<Blob> {
  const source = await loadPdfLib(file);
  const uniquePages = [...new Set(pageNumbers)].sort((a, b) => a - b);
  if (!uniquePages.length) throw new Error("Select at least one valid page.");
  if (uniquePages.some((page) => page < 1 || page > source.getPageCount())) {
    throw new Error(`Enter page numbers between 1 and ${source.getPageCount()}.`);
  }
  const extracted = await PDFDocument.create();
  const pages = await extracted.copyPages(source, uniquePages.map((page) => page - 1));
  pages.forEach((page) => extracted.addPage(page));
  return pdfBlob(await extracted.save());
}

export async function saveEditedPdf(
  file: File,
  pageOrder: number[],
  rotations: Record<number, number>,
): Promise<Blob> {
  const source = await loadPdfLib(file);
  const output = await PDFDocument.create();
  const pages = await output.copyPages(source, pageOrder);
  pages.forEach((page, index) => {
    const originalIndex = pageOrder[index];
    const rotation = rotations[originalIndex] ?? 0;
    if (rotation) page.setRotation(degrees((page.getRotation().angle + rotation) % 360));
    output.addPage(page);
  });
  return pdfBlob(await output.save());
}

export async function repackPdf(file: File): Promise<Blob> {
  const document = await loadPdfLib(file);
  const bytes = await document.save({ useObjectStreams: true });
  return pdfBlob(bytes);
}

export async function renderPdfPage(
  document: PDFDocumentProxy,
  pageNumber: number,
  scale: number,
): Promise<HTMLCanvasElement> {
  const page = await document.getPage(pageNumber);
  const viewport = page.getViewport({ scale });
  const canvas = window.document.createElement("canvas");
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) throw new Error("Your browser could not create a PDF preview.");
  await page.render({ canvas, canvasContext: context, viewport }).promise;
  page.cleanup();
  return canvas;
}

export async function downloadRenderedPages(
  document: PDFDocumentProxy,
  pageNumbers: number[],
  format: "image/jpeg" | "image/png",
  quality: number,
  scale: number,
): Promise<Blob> {
  if (!pageNumbers.length) throw new Error("Select at least one page to convert.");
  const zip = (await import("jszip")).default;
  const archive = new zip();
  for (const pageNumber of pageNumbers) {
    const canvas = await renderPdfPage(document, pageNumber, scale);
    const imageBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => blob ? resolve(blob) : reject(new Error(`Page ${pageNumber} could not be exported.`)),
        format,
        quality,
      );
    });
    archive.file(`page-${String(pageNumber).padStart(3, "0")}.${format === "image/png" ? "png" : "jpg"}`, imageBlob);
    canvas.width = 0;
    canvas.height = 0;
  }
  return await archive.generateAsync({ type: "blob" });
}

export async function imagesToPdf(
  files: File[],
  options: { orientation: "portrait" | "landscape" | "auto"; margin: number; fit: "contain" | "cover" },
): Promise<Blob> {
  if (!files.length) throw new Error("Choose at least one image.");
  if (files.some((file) => file.size > MAX_IMAGE_BYTES)) throw new Error("An image exceeds the 100 MB browser-processing limit.");
  const pdf = await PDFDocument.create();
  for (const file of files) {
    const imageBytes = await file.arrayBuffer();
    const extension = file.name.split(".").pop()?.toLowerCase();
    let image;
    try {
      image = extension === "jpg" || extension === "jpeg" || file.type === "image/jpeg"
        ? await pdf.embedJpg(imageBytes)
        : await pdf.embedPng(imageBytes);
    } catch {
      throw new Error(`${file.name} could not be added. Use valid JPG or PNG files.`);
    }
    const imageWidth = image.width;
    const imageHeight = image.height;
    const orientation = options.orientation === "auto"
      ? (imageWidth >= imageHeight ? "landscape" : "portrait")
      : options.orientation;
    const pageSize: [number, number] = orientation === "landscape" ? [792, 612] : [612, 792];
    const page = pdf.addPage(pageSize);
    const margin = Math.max(0, Math.min(100, options.margin));
    const areaWidth = pageSize[0] - margin * 2;
    const areaHeight = pageSize[1] - margin * 2;
    const scale = options.fit === "contain"
      ? Math.min(areaWidth / imageWidth, areaHeight / imageHeight)
      : Math.max(areaWidth / imageWidth, areaHeight / imageHeight);
    const drawWidth = imageWidth * scale;
    const drawHeight = imageHeight * scale;
    page.drawImage(image, {
      x: (pageSize[0] - drawWidth) / 2,
      y: (pageSize[1] - drawHeight) / 2,
      width: drawWidth,
      height: drawHeight,
    });
  }
  return pdfBlob(await pdf.save());
}
