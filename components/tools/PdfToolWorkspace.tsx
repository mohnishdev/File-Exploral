"use client";

/* Blob URLs are local document previews and must not be passed through Next's image optimizer. */
/* eslint @next/next/no-img-element: "off" */
import { useEffect, useRef, useState } from "react";
import {
  ArrowDown, ArrowRightLeft, ArrowUp, FilePlus2, LoaderCircle, RotateCw, Trash2, ZoomIn, ZoomOut,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { DownloadButton } from "./DownloadButton";
import { FilePreview } from "./FilePreview";
import { UploadDropzone } from "./UploadDropzone";
import { getTool } from "@/lib/tools";
import { openPdf, loadPdfLib, renderPdfPage, mergePdfs, extractPdfPages, saveEditedPdf, repackPdf, downloadRenderedPages, imagesToPdf, validatePdfFile } from "@/lib/pdf/browser";
import type { BrowserPdfDocument } from "@/lib/pdf/browser";
import { formatBytes } from "@/lib/image/validation";

type Props = { slug: string };
type Output = { url: string; blob: Blob; filename: string; format: string };
type EditorPage = { index: number; thumbnail?: string };

function parsePageRange(value: string, count: number) {
  const pages = new Set<number>();
  for (const part of value.split(",")) {
    const range = part.trim().split("-");
    if (range.length > 2 || !range[0]) throw new Error("Enter pages such as 1, 3-5, 8.");
    const start = Number(range[0]);
    const end = range.length === 2 ? Number(range[1]) : start;
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end < start || end > count) {
      throw new Error(`Enter page numbers from 1 to ${count}.`);
    }
    for (let page = start; page <= end; page += 1) pages.add(page);
  }
  return [...pages].sort((a, b) => a - b);
}

export function PdfToolWorkspace({ slug }: Props) {
  const workspaceTool = getTool(slug);
  const WorkspaceIcon = workspaceTool?.icon ?? FilePlus2;
  const [file, setFile] = useState<File>();
  const [files, setFiles] = useState<File[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [document, setDocument] = useState<BrowserPdfDocument>();
  const documentRef = useRef<BrowserPdfDocument | undefined>(undefined);
  const activeOperation = useRef(0);
  const previewRequest = useRef(0);
  const urls = useRef(new Set<string>());
  const thumbnailUrls = useRef(new Set<string>());
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [previewUrl, setPreviewUrl] = useState("");
  const [editorPages, setEditorPages] = useState<EditorPage[]>([]);
  const [selectedPages, setSelectedPages] = useState("1");
  const [zoom, setZoom] = useState(1.15);
  const [rotation, setRotation] = useState<Record<number, number>>({});
  const [quality, setQuality] = useState(0.88);
  const [resolution, setResolution] = useState(1.5);
  const [orientation, setOrientation] = useState<"portrait" | "landscape" | "auto">("auto");
  const [margin, setMargin] = useState(24);
  const [fit, setFit] = useState<"contain" | "cover">("contain");
  const [output, setOutput] = useState<Output>();
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const isEditor = slug === "pdf-editor";
  const isMerge = slug === "pdf-merge";
  const isSplit = slug === "pdf-split";
  const isCompress = slug === "pdf-compress";
  const isPdfToImage = slug === "pdf-to-jpg" || slug === "pdf-to-png";
  const isImagesToPdf = slug === "jpg-to-pdf" || slug === "png-to-pdf";
  const outputFormat = slug === "pdf-to-png" ? "image/png" : "image/jpeg";

  useEffect(() => () => {
    if (documentRef.current) void documentRef.current.destroy();
    urls.current.forEach((url) => URL.revokeObjectURL(url));
    urls.current.clear();
  }, []);

  function createUrl(blob: Blob) {
    const url = URL.createObjectURL(blob);
    urls.current.add(url);
    return url;
  }

  function clearOutput() {
    if (output) {
      URL.revokeObjectURL(output.url);
      urls.current.delete(output.url);
    }
    setOutput(undefined);
  }

  function replacePreview(blob?: Blob) {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      urls.current.delete(previewUrl);
    }
    if (blob) {
      const nextUrl = createUrl(blob);
      setPreviewUrl(nextUrl);
    } else {
      setPreviewUrl("");
    }
  }

  async function loadFile(nextFile: File) {
    const loadId = ++activeOperation.current;
    clearOutput();
    setError("");
    setNotice("");
    setBusy(true);
    setProgress("Opening PDF in your browser…");
    try {
      const nextDoc = await openPdf(nextFile);
      if (loadId !== activeOperation.current) {
        await nextDoc.destroy();
        return;
      }
      thumbnailUrls.current.forEach((url) => {
        URL.revokeObjectURL(url);
        urls.current.delete(url);
      });
      thumbnailUrls.current.clear();
      replacePreview();
      if (documentRef.current) void documentRef.current.destroy();
      documentRef.current = nextDoc;
      setDocument(nextDoc);
      setFile(nextFile);
      setPageCount(nextDoc.document.numPages);
      setPageNumber(1);
      setSelectedPages(nextDoc.document.numPages === 1 ? "1" : `1-${nextDoc.document.numPages}`);
      setRotation({});
      if (isEditor) {
        setEditorPages(Array.from({ length: nextDoc.document.numPages }, (_, index) => ({ index })));
        await makeThumbnails(nextDoc);
      }
      if (isEditor || isPdfToImage || isSplit) void renderPreview(nextDoc, 1, zoom);
      if (loadId === activeOperation.current) setProgress("");
    } catch (caught) {
      if (loadId !== activeOperation.current) return;
      setError(caught instanceof Error ? caught.message : "This PDF could not be opened.");
      setProgress("");
    } finally {
      if (loadId === activeOperation.current) setBusy(false);
    }
  }

  async function makeThumbnails(doc: BrowserPdfDocument) {
    const pageList: EditorPage[] = Array.from({ length: doc.document.numPages }, (_, index) => ({ index }));
    const count = Math.min(doc.document.numPages, 60);
    for (let index = 0; index < count; index += 1) {
      if (documentRef.current !== doc) return;
      try {
        const canvas = await renderPdfPage(doc.document, index + 1, 0.22);
        const blob = await canvasBlob(canvas, "image/jpeg", 0.65);
        const thumbnail = createUrl(blob);
        thumbnailUrls.current.add(thumbnail);
        pageList[index] = { index, thumbnail };
        canvas.width = 0;
        canvas.height = 0;
        setEditorPages([...pageList]);
      } catch {
        // Keep the page entry usable even when an individual thumbnail cannot render.
      }
    }
  }

  function canvasBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
    return new Promise((resolve, reject) => canvas.toBlob(
      (blob) => blob ? resolve(blob) : reject(new Error("The page preview could not be created.")),
      type,
      quality,
    ));
  }

  function setResult(blob: Blob, filename: string, formatLabel: string, operationId: number) {
    if (operationId !== activeOperation.current) return;
    clearOutput();
    setOutput({ url: createUrl(blob), blob, filename, format: formatLabel });
    setProgress("Finished. Your download is ready.");
  }

  async function runOperation() {
    const operationId = ++activeOperation.current;
    setBusy(true);
    setError("");
    setNotice("");
    setProgress("Processing in your browser…");
    try {
      if (isMerge) {
        const blob = await mergePdfs(files);
        setResult(blob, "merged-document.pdf", "PDF", operationId);
      } else if (isSplit) {
        if (!file) throw new Error("Choose a PDF to split.");
        const pages = parsePageRange(selectedPages, pageCount);
        const blob = await extractPdfPages(file, pages);
        setResult(blob, "selected-pages.pdf", "PDF", operationId);
      } else if (isCompress) {
        if (!file) throw new Error("Choose a PDF to optimize.");
        const blob = await repackPdf(file);
        setResult(blob, "optimized-document.pdf", "PDF", operationId);
        setNotice("This re-saves PDF structure with object streams. It does not recompress embedded images, so the result may not be smaller.");
      } else if (isEditor) {
        if (!file) throw new Error("Choose a PDF to edit.");
        const blob = await saveEditedPdf(file, editorPages.map((page) => page.index), rotation);
        setResult(blob, "edited-document.pdf", "PDF", operationId);
      } else if (isPdfToImage) {
        if (!file) throw new Error("Choose a PDF to convert.");
        if (!document) throw new Error("Reopen the PDF before converting its pages.");
        const pages = parsePageRange(selectedPages, pageCount);
        const blob = await downloadRenderedPages(document.document, pages, outputFormat, quality, resolution);
        setResult(blob, `${slug}-pages.zip`, "ZIP", operationId);
      } else if (isImagesToPdf) {
        if (!imageFiles.length) throw new Error("Choose at least one image.");
        const blob = await imagesToPdf(imageFiles, { orientation, margin, fit });
        setResult(blob, "images.pdf", "PDF", operationId);
      }
    } catch (caught) {
      if (operationId === activeOperation.current) {
        setError(caught instanceof Error ? caught.message : "The document could not be processed. Check the file and try again.");
        setProgress("");
      }
    } finally {
      if (operationId === activeOperation.current) setBusy(false);
    }
  }

  async function renderPreview(doc: BrowserPdfDocument, number: number, scale: number) {
    if (documentRef.current !== doc) return;
    const requestId = ++previewRequest.current;
    setError("");
    try {
      const canvas = await renderPdfPage(doc.document, number, scale);
      const blob = await canvasBlob(canvas, "image/png");
      canvas.width = 0;
      canvas.height = 0;
      if (documentRef.current !== doc || requestId !== previewRequest.current) return;
      replacePreview(blob);
    } catch (caught) {
      if (documentRef.current === doc && requestId === previewRequest.current) {
        setError(caught instanceof Error ? caught.message : "This page preview could not be rendered.");
      }
    }
  }

  function navigateToPage(number: number) {
    const pageTotal = isEditor ? editorPages.length : pageCount;
    const nextPage = Math.max(1, Math.min(pageTotal, number));
    setPageNumber(nextPage);
    const originalPage = isEditor ? editorPages[nextPage - 1]?.index + 1 : nextPage;
    if (document && originalPage) void renderPreview(document, originalPage, zoom);
  }

  function changeZoom(nextZoom: number) {
    const clampedZoom = Math.max(.5, Math.min(2.5, nextZoom));
    setZoom(clampedZoom);
    if (document) void renderPreview(document, pageNumber, clampedZoom);
  }

  function reset() {
    activeOperation.current += 1;
    previewRequest.current += 1;
    if (documentRef.current) void documentRef.current.destroy();
    documentRef.current = undefined;
    urls.current.forEach((url) => URL.revokeObjectURL(url));
    urls.current.clear();
    thumbnailUrls.current.clear();
    setDocument(undefined);
    setFile(undefined);
    setFiles([]);
    setImageFiles([]);
    setPageCount(0);
    setPageNumber(1);
    setPreviewUrl("");
    setEditorPages([]);
    setOutput(undefined);
    setBusy(false);
    setRotation({});
    setError("");
    setNotice("");
    setProgress("");
  }

  function reorderPages(fromIndex: number, toIndex: number) {
    const activeOriginalPage = editorPages[pageNumber - 1]?.index;
    const next = [...editorPages];
    const [page] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, page);
    setEditorPages(next);
    const nextPage = next.findIndex((entry) => entry.index === activeOriginalPage) + 1;
    if (nextPage > 0) setPageNumber(nextPage);
  }

  function deleteEditorPage(originalIndex: number) {
    const next = editorPages.filter((entry) => entry.index !== originalIndex);
    setEditorPages(next);
    const nextPageNumber = Math.min(pageNumber, next.length);
    setPageNumber(nextPageNumber);
    const current = next[nextPageNumber - 1];
    if (document && current) void renderPreview(document, current.index + 1, zoom);
  }

  async function acceptMultiplePdfs(selected: FileList | File[] | null) {
    if (!selected) return;
    const operationId = ++activeOperation.current;
    const selectedFiles = Array.from(selected);
    try {
      selectedFiles.forEach(validatePdfFile);
      setError("");
      const allFiles = [...files, ...selectedFiles];
      const counts = await Promise.all(allFiles.map(async (pdf) => (await loadPdfLib(pdf)).getPageCount()));
      if (operationId !== activeOperation.current) return;
      setFiles(allFiles);
      setNotice(allFiles.map((pdf, index) => `${pdf.name}: ${counts[index]} ${counts[index] === 1 ? "page" : "pages"}`).join(" · "));
    } catch (caught) {
      if (operationId === activeOperation.current) setError(caught instanceof Error ? caught.message : "One or more PDF files could not be opened.");
    }
  }

  async function acceptImages(selected: FileList | File[] | null) {
    if (!selected) return;
    const selectedFiles = Array.from(selected);
    const allowedExtension = /\.(jpe?g|png)$/i;
    if (selectedFiles.some((image) => !["image/jpeg", "image/png"].includes(image.type) && !allowedExtension.test(image.name))) {
      setError("Choose JPG or PNG images.");
      return;
    }
    if (selectedFiles.some((image) => image.size > 100 * 1024 * 1024)) {
      setError("An image exceeds the 100 MB browser-processing limit.");
      return;
    }
    setError("");
    setImageFiles((current) => [...current, ...selectedFiles]);
  }

  return (
    <Card className={`interactive-workspace pdf-workspace${isEditor ? " pdf-editor-workspace" : ""}`}>
      <div className="workspace-heading">
        <div className="workspace-icon"><WorkspaceIcon size={20} /></div>
        <div><strong>{workspaceTool?.shortName ?? "PDF tool"}</strong><span>PDFs stay in your browser</span></div>
        {(file || files.length > 0 || imageFiles.length > 0) && <button className="text-button reset-button" type="button" onClick={reset}>Reset</button>}
      </div>

      {!file && !isMerge && !isImagesToPdf && <UploadDropzone
        accept={[".pdf", "application/pdf"]}
        onFile={(nextFile) => void loadFile(nextFile)}
        disabled={busy}
        title="Drop a PDF to get started"
        description="PDF · or choose from your device"
      />}

      {isMerge && <section className="pdf-merge-panel">
        <UploadDropzone
          accept={[".pdf", "application/pdf"]}
          onFiles={(selected) => void acceptMultiplePdfs(selected)}
          multiple
          disabled={busy}
          title="Drop PDFs to combine"
          description="Choose two or more PDF files · drag to set their order"
        />
        <div className="sortable-file-list" onDragOver={(event) => event.preventDefault()}>
          {files.map((pdf, index) => <div className="sortable-file" key={`${pdf.name}-${pdf.size}-${index}`} draggable onDragStart={(event) => event.dataTransfer.setData("text/plain", String(index))} onDrop={(event) => { if (event.dataTransfer.files.length) return; const from = Number(event.dataTransfer.getData("text/plain")); if (!Number.isInteger(from) || from < 0 || from >= files.length) return; const next = [...files]; const [entry] = next.splice(from, 1); next.splice(index, 0, entry); setFiles(next); }}><span className="drag-handle" aria-hidden="true">⠿</span><FilePreview name={pdf.name} size={pdf.size} type="pdf" /><button type="button" className="icon-button" aria-label={`Remove ${pdf.name}`} onClick={() => setFiles(files.filter((_, itemIndex) => itemIndex !== index))}><Trash2 size={15} /></button></div>)}
        </div>
        {files.length >= 2 && <button type="button" className="button button--primary" disabled={busy} onClick={() => void runOperation()}>{busy ? "Merging…" : "Merge PDFs"}</button>}
      </section>}

      {isImagesToPdf && <section className="pdf-merge-panel">
        <UploadDropzone
          accept={[".jpg", ".jpeg", ".png", "image/jpeg", "image/png"]}
          onFiles={(selected) => void acceptImages(selected)}
          multiple
          disabled={busy}
          title="Drop images to create a PDF"
          description="JPG or PNG · drag thumbnails below to arrange pages"
        />
        <div className="sortable-file-list">
          {imageFiles.map((image, index) => <div className="sortable-file" key={`${image.name}-${image.size}-${index}`} draggable onDragStart={(event) => event.dataTransfer.setData("text/plain", String(index))} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { const from = Number(event.dataTransfer.getData("text/plain")); const next = [...imageFiles]; const [entry] = next.splice(from, 1); next.splice(index, 0, entry); setImageFiles(next); }}><span className="drag-handle" aria-hidden="true">⠿</span><FilePreview name={image.name} size={image.size} type="image" /><button type="button" className="icon-button" aria-label={`Remove ${image.name}`} onClick={() => setImageFiles(imageFiles.filter((_, itemIndex) => itemIndex !== index))}><Trash2 size={15} /></button></div>)}
        </div>
        {imageFiles.length > 0 && <div className="pdf-option-grid">
          <label>Page orientation<select value={orientation} onChange={(event) => setOrientation(event.target.value as typeof orientation)}><option value="auto">Match image</option><option value="portrait">Portrait</option><option value="landscape">Landscape</option></select></label>
          <label>Margins (points)<input type="number" min="0" max="100" value={margin} onChange={(event) => setMargin(Number(event.target.value))} /></label>
          <label>Image fit<select value={fit} onChange={(event) => setFit(event.target.value as typeof fit)}><option value="contain">Fit whole image</option><option value="cover">Fill page</option></select></label>
        </div>}
        {imageFiles.length > 0 && <button type="button" className="button button--primary" disabled={busy} onClick={() => void runOperation()}>{busy ? "Creating PDF…" : "Create PDF"}</button>}
      </section>}

      {file && document && (isEditor || isSplit || isPdfToImage) && <div className={`pdf-document-view${isEditor ? " pdf-document-editor" : ""}`}>
        {isEditor && <aside className="pdf-thumbnails" aria-label="PDF page thumbnails">
          <div className="pdf-thumbnails-header"><strong>Pages</strong><span>{editorPages.length}</span></div>
          {editorPages.map((page, index) => <div className={`pdf-thumbnail${pageNumber === index + 1 ? " active" : ""}`} key={page.index} draggable onDragStart={(event) => event.dataTransfer.setData("text/plain", String(index))} onDragOver={(event) => event.preventDefault()} onDrop={(event) => reorderPages(Number(event.dataTransfer.getData("text/plain")), index)}>
            <button type="button" onClick={() => navigateToPage(index + 1)} aria-label={`Go to page ${index + 1}`}>{page.thumbnail ? <img src={page.thumbnail} alt="" /> : <span className="thumbnail-loading"><LoaderCircle size={14} /></span>}<span>Page {index + 1}</span></button>
            <div><button type="button" className="icon-button" aria-label={`Rotate page ${index + 1}`} onClick={() => setRotation({ ...rotation, [page.index]: ((rotation[page.index] ?? 0) + 90) % 360 })}><RotateCw size={13} /></button><button type="button" className="icon-button" aria-label={`Delete page ${index + 1}`} onClick={() => deleteEditorPage(page.index)}><Trash2 size={13} /></button></div>
          </div>)}
        </aside>}
        <section className="pdf-viewer">
          <div className="pdf-toolbar">
            <div className="pdf-page-nav"><button className="icon-button" disabled={pageNumber <= 1} onClick={() => navigateToPage(pageNumber - 1)} aria-label="Previous page"><ArrowUp size={15} /></button><span><input aria-label="Current page" type="number" min="1" max={isEditor ? editorPages.length : pageCount} value={pageNumber} onChange={(event) => navigateToPage(Number(event.target.value))} /> / {isEditor ? editorPages.length : pageCount}</span><button className="icon-button" disabled={pageNumber >= (isEditor ? editorPages.length : pageCount)} onClick={() => navigateToPage(pageNumber + 1)} aria-label="Next page"><ArrowDown size={15} /></button></div>
            {isEditor && <div className="pdf-zoom"><button className="icon-button" aria-label="Zoom out" onClick={() => changeZoom(zoom - .15)}><ZoomOut size={15} /></button><span>{Math.round(zoom * 100)}%</span><button className="icon-button" aria-label="Zoom in" onClick={() => changeZoom(zoom + .15)}><ZoomIn size={15} /></button></div>}
          </div>
          <div className="pdf-canvas-area">{previewUrl ? <img className="pdf-page-preview" src={previewUrl} alt={`PDF page ${pageNumber}`} style={{ transform: `rotate(${rotation[isEditor ? editorPages[pageNumber - 1]?.index ?? 0 : pageNumber - 1] ?? 0}deg)` }} /> : <span className="thumbnail-loading"><LoaderCircle size={19} /> Rendering page…</span>}</div>
        </section>
      </div>}

      {file && document && isSplit && <section className="pdf-operation-options">
        <label>Pages to extract<input value={selectedPages} onChange={(event) => setSelectedPages(event.target.value)} aria-describedby="split-help" /></label>
        <p id="split-help">Enter pages separated by commas or ranges, for example 1, 3-5, 8.</p>
        <button type="button" className="button button--primary" disabled={busy} onClick={() => void runOperation()}>{busy ? "Extracting…" : "Extract pages"}</button>
      </section>}

      {file && document && isPdfToImage && <section className="pdf-operation-options">
        <div className="pdf-option-grid">
          <label>Pages to convert<input value={selectedPages} onChange={(event) => setSelectedPages(event.target.value)} /></label>
          <label>Resolution<select value={resolution} onChange={(event) => setResolution(Number(event.target.value))}><option value={1}>Standard (72 DPI)</option><option value={1.5}>High (108 DPI)</option><option value={2}>Very high (144 DPI)</option></select></label>
          {outputFormat === "image/jpeg" && <label>JPG quality<input type="range" min="30" max="100" value={Math.round(quality * 100)} onChange={(event) => setQuality(Number(event.target.value) / 100)} /></label>}
        </div>
        <p>Selected pages are rendered locally and bundled into one ZIP download.</p>
        <button type="button" className="button button--primary" disabled={busy} onClick={() => void runOperation()}>{busy ? "Rendering pages…" : `Convert to ${slug === "pdf-to-png" ? "PNG" : "JPG"}`}</button>
      </section>}

      {file && isCompress && <section className="pdf-operation-options">
        <div className="file-size-row"><FilePreview name={file.name} size={file.size} type="pdf" /></div>
        <p>Browser-side structural re-saving is available. Embedded images and scanned pages are not downsampled or recompressed by this operation.</p>
        <button type="button" className="button button--primary" disabled={busy} onClick={() => void runOperation()}>{busy ? "Optimizing…" : "Optimize PDF structure"}</button>
      </section>}

      {file && isEditor && <section className="editor-download-bar"><p>Reorder by dragging thumbnails. Page changes are applied when you download.</p><button type="button" className="button button--primary" disabled={busy || editorPages.length === 0} onClick={() => void runOperation()}>{busy ? "Saving…" : "Download edited PDF"}</button></section>}

      {isMerge && files.length === 1 && <p className="upload-error" role="status">Add one more PDF to merge.</p>}
      {progress && <p className="workflow-status" role="status">{progress}</p>}
      {notice && <p className="pdf-notice" role="status">{notice}</p>}
      {error && <p className="upload-error" role="alert">{error}</p>}

      {output && <section className="pdf-result" aria-label="Before and after file details">
        <div className="pdf-result-heading"><div><strong>Ready to download</strong><p>{output.filename} · {output.format}</p></div><span>{formatBytes(output.blob.size)}</span></div>
        <div className="pdf-before-after">
          <article className="pdf-file-stage">
            <span className="result-stage-label">Before</span>
            <h3>{isMerge ? "Files to combine" : isImagesToPdf ? "Images to arrange" : "Original file"}</h3>
            {file
              ? <FilePreview name={file.name} size={file.size} type={isImagesToPdf ? "image" : "pdf"} />
              : <div className="pdf-stage-summary"><strong>{isMerge ? `${files.length} PDF files` : `${imageFiles.length} images`}</strong><span>{formatBytes((isMerge ? files : imageFiles).reduce((total, item) => total + item.size, 0))} total</span></div>}
          </article>
          <span className="pdf-transform-icon" aria-hidden="true"><ArrowRightLeft size={17} /></span>
          <article className="pdf-file-stage pdf-file-stage--result">
            <span className="result-stage-label">After</span>
            <h3>{output.format} file</h3>
            <FilePreview name={output.filename} size={output.blob.size} type={output.format === "PDF" ? "pdf" : output.format === "ZIP" ? "file" : "image"} />
          </article>
        </div>
        {isCompress && file && <div className="size-comparison"><span>Size change</span><strong className={output.blob.size <= file.size ? "size-saving" : "size-increase"}>{output.blob.size <= file.size ? `${Math.round((1 - output.blob.size / file.size) * 100)}% smaller` : `${Math.round((output.blob.size / file.size - 1) * 100)}% larger`}</strong></div>}
        <DownloadButton href={output.url} filename={output.filename} format={output.format} size={formatBytes(output.blob.size)} />
      </section>}
      <p className="workspace-footnote">Files stay in this browser session and are not sent to our servers.</p>
    </Card>
  );
}
