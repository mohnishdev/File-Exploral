"use client";

/* The original and generated images use short-lived local object URLs that must not pass through Next's image optimizer. */
/* eslint @next/next/no-img-element: "off" */

import { useEffect, useRef, useState } from "react";
import { ArrowLeftRight, Image as ImageIcon, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { DownloadButton } from "./DownloadButton";
import { UploadDropzone } from "./UploadDropzone";
import { Card } from "@/components/ui/Card";
import { formatBytes } from "@/lib/image/validation";
import {
  defaultVectorizationOptions,
  MAX_VECTOR_DIMENSION,
  MAX_VECTOR_FILE_SIZE,
  MAX_VECTOR_PIXELS,
  type VectorizationOptions,
  type VectorizationResult,
} from "@/lib/vectorize/types";
import { imageTracerEngine } from "@/lib/vectorize/workerClient";

type PreviewTab = "original" | "vector";

const progressStages = [
  "Preparing image…",
  "Analyzing colors…",
  "Tracing…",
  "Optimizing SVG…",
];

export function PngToSvgWorkspace() {
  const [file, setFile] = useState<File>();
  const [sourceUrl, setSourceUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [result, setResult] = useState<VectorizationResult>();
  const [options, setOptions] = useState<VectorizationOptions>(defaultVectorizationOptions);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [previewTab, setPreviewTab] = useState<PreviewTab>("original");
  const [zoom, setZoom] = useState(1);
  const objectUrls = useRef(new Set<string>());
  const operationId = useRef(0);
  const workerController = useRef<AbortController | undefined>(undefined);
  const resetTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => {
    operationId.current += 1;
    workerController.current?.abort();
    if (resetTimer.current) window.clearTimeout(resetTimer.current);
    objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
    objectUrls.current.clear();
  }, []);

  function makeUrl(blob: Blob) {
    const url = URL.createObjectURL(blob);
    objectUrls.current.add(url);
    return url;
  }

  function releaseUrls() {
    objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
    objectUrls.current.clear();
  }

  function updateOptions(patch: Partial<VectorizationOptions>) {
    setOptions((current) => ({ ...current, ...patch }));
    setStatus("");
    setError("");
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
      objectUrls.current.delete(resultUrl);
      setResultUrl("");
      setResult(undefined);
    }
  }

  async function selectFile(nextFile: File) {
    const currentOperation = ++operationId.current;
    setError("");
    setStatus("Checking PNG…");
    setBusy(true);
    try {
      if (nextFile.type !== "image/png" || !nextFile.name.toLowerCase().endsWith(".png")) {
        throw new Error("Choose a valid PNG file. Other image formats are not supported by this tool.");
      }
      if (nextFile.size === 0) throw new Error("This file is empty. Choose a valid PNG image.");
      if (nextFile.size > MAX_VECTOR_FILE_SIZE) {
        throw new Error("This PNG is larger than the 20 MB limit. Use a smaller file to keep vectorization responsive.");
      }

      const header = new DataView(await nextFile.slice(0, 24).arrayBuffer());
      const signature = new Uint8Array(header.buffer, 0, Math.min(8, header.byteLength));
      const validSignature = signature.length === 8 &&
        signature[0] === 137 && signature[1] === 80 && signature[2] === 78 && signature[3] === 71 &&
        signature[4] === 13 && signature[5] === 10 && signature[6] === 26 && signature[7] === 10;
      if (!validSignature || header.byteLength < 24 || header.getUint32(12) !== 0x49484452) {
        throw new Error("This PNG could not be opened. It may be damaged or use an unsupported encoding.");
      }
      const headerWidth = header.getUint32(16);
      const headerHeight = header.getUint32(20);
      if (
        headerWidth === 0 ||
        headerHeight === 0 ||
        headerWidth > MAX_VECTOR_DIMENSION ||
        headerHeight > MAX_VECTOR_DIMENSION ||
        headerWidth * headerHeight > MAX_VECTOR_PIXELS
      ) {
        throw new Error("This PNG exceeds the supported dimensions (12,000 px per side and 20 megapixels). Resize it and try again.");
      }

      let width = 0;
      let height = 0;
      try {
        const bitmap = await createImageBitmap(nextFile);
        width = bitmap.width;
        height = bitmap.height;
        bitmap.close();
      } catch {
        throw new Error("This PNG could not be opened. It may be damaged or use an unsupported encoding.");
      }
      if (currentOperation !== operationId.current) return;
      if (
        width === 0 ||
        height === 0 ||
        width > MAX_VECTOR_DIMENSION ||
        height > MAX_VECTOR_DIMENSION ||
        width * height > MAX_VECTOR_PIXELS
      ) {
        throw new Error("This PNG exceeds the supported dimensions (12,000 px per side and 20 megapixels). Resize it and try again.");
      }

      releaseUrls();
      setFile(nextFile);
      setDimensions({ width, height });
      setSourceUrl(makeUrl(nextFile));
      setResult(undefined);
      setResultUrl("");
      setPreviewTab("original");
      setZoom(1);
      setStatus("");
    } catch (caught) {
      if (currentOperation === operationId.current) {
        setError(caught instanceof Error ? caught.message : "This PNG could not be opened.");
        setStatus("");
      }
    } finally {
      if (currentOperation === operationId.current) setBusy(false);
    }
  }

  function reset() {
    operationId.current += 1;
    if (resetTimer.current) window.clearTimeout(resetTimer.current);
    resetTimer.current = undefined;
    workerController.current?.abort();
    workerController.current = undefined;
    releaseUrls();
    setFile(undefined);
    setSourceUrl("");
    setResultUrl("");
    setResult(undefined);
    setDimensions({ width: 0, height: 0 });
    setBusy(false);
    setStatus("");
    setError("");
    setPreviewTab("original");
    setZoom(1);
  }

  async function convert() {
    if (!file) return;
    const currentOperation = ++operationId.current;
    setBusy(true);
    setError("");
    setStatus(progressStages[0]);
    const controller = new AbortController();
    workerController.current?.abort();
    workerController.current = controller;
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
      objectUrls.current.delete(resultUrl);
      setResultUrl("");
    }
    setResult(undefined);
    try {
      const nextResult = await imageTracerEngine.vectorize(file, options, setStatus, controller.signal);
      if (currentOperation !== operationId.current) return;
      const resultBlob = new Blob([nextResult.svg], { type: "image/svg+xml;charset=utf-8" });
      setResult(nextResult);
      setResultUrl(makeUrl(resultBlob));
      setPreviewTab("vector");
      setStatus("Complete");
    } catch (caught) {
      if (currentOperation === operationId.current) {
        setError(caught instanceof Error ? caught.message : "Vectorization failed. Try another PNG or simpler settings.");
        setStatus("");
      }
    } finally {
      if (workerController.current === controller) workerController.current = undefined;
      if (currentOperation === operationId.current) setBusy(false);
    }
  }

  function scheduleResetAfterDownload() {
    if (resetTimer.current) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => {
      resetTimer.current = undefined;
      reset();
    }, 1000);
  }

  return (
    <Card className="interactive-workspace vector-workspace">
      <div className="workspace-status">
        <span className={`status-indicator${busy ? " is-processing" : ""}`} />
        <span>{busy ? status : "PNG is processed locally in your browser"}</span>
        {file && <button type="button" className="workspace-reset" onClick={reset}><RotateCcw size={13} /> {busy ? "Cancel" : "Reset"}</button>}
      </div>

      {!file ? (
        <UploadDropzone accept={["image/png", ".png"]} onFile={(nextFile) => { void selectFile(nextFile); }} onError={() => { setError(""); setStatus(""); }} maxSize={MAX_VECTOR_FILE_SIZE} disabled={busy} />
      ) : (
        <div className="vector-tool-body">
          <div className="vector-source-summary">
            {sourceUrl && <img src={sourceUrl} alt={`Original PNG preview: ${file.name}`} />}
            <div className="vector-source-meta">
              <strong title={file.name}>{file.name}</strong>
              <span>{dimensions.width} × {dimensions.height} px</span>
              <span>{formatBytes(file.size)} · PNG</span>
            </div>
            <button type="button" className="workspace-reset vector-change-file" onClick={reset}>Change file</button>
          </div>

          <fieldset className="vector-mode">
            <legend>Vector style</legend>
            <label className={options.mode === "monochrome" ? "is-selected" : ""}>
              <input type="radio" name="vector-mode" value="monochrome" checked={options.mode === "monochrome"} onChange={() => updateOptions({ mode: "monochrome" })} disabled={busy} />
              <span><strong>Black &amp; white</strong><small>Logos, signatures, and line art</small></span>
            </label>
            <label className={options.mode === "color" ? "is-selected" : ""}>
              <input type="radio" name="vector-mode" value="color" checked={options.mode === "color"} onChange={() => updateOptions({ mode: "color" })} disabled={busy} />
              <span><strong>Color</strong><small>Icons and flat illustrations</small></span>
            </label>
          </fieldset>

          <div className="vector-settings">
            {options.mode === "color" ? (
              <label>Colors
                <select value={options.colors} onChange={(event) => updateOptions({ colors: event.target.value === "auto" ? "auto" : Number(event.target.value) as 2 | 4 | 8 | 16 | 32 })} disabled={busy}>
                  <option value="auto">Auto</option><option value="2">2 colors</option><option value="4">4 colors</option><option value="8">8 colors</option><option value="16">16 colors</option><option value="32">32 colors</option>
                </select>
              </label>
            ) : (
              <label className="vector-range-label">Threshold <strong>{options.threshold}</strong>
                <input type="range" min="40" max="230" value={options.threshold} onChange={(event) => updateOptions({ threshold: Number(event.target.value) })} aria-label={`Black and white threshold ${options.threshold}`} disabled={busy} />
                <small>Controls which pixels become black or white.</small>
              </label>
            )}
            <label>Detail
              <select value={options.detail} onChange={(event) => updateOptions({ detail: event.target.value as VectorizationOptions["detail"] })} disabled={busy}>
                <option value="low">Low · simpler paths</option><option value="medium">Medium · balanced</option><option value="high">High · finer detail</option>
              </select>
            </label>
          </div>

          <details className="vector-advanced">
            <summary>Advanced settings</summary>
            <label className="vector-range-label">Smoothing <strong>{options.smoothing}%</strong>
              <input type="range" min="0" max="100" value={options.smoothing} onChange={(event) => updateOptions({ smoothing: Number(event.target.value) })} aria-label={`Smoothing ${options.smoothing} percent`} disabled={busy} />
              <small>Softens small irregularities before tracing.</small>
            </label>
            <label className="vector-checkbox"><input type="checkbox" checked={options.removeBackground} onChange={(event) => updateOptions({ removeBackground: event.target.checked })} disabled={busy} /> Remove a flat background connected to the image edges</label>
          </details>

          <p className="vector-guidance">Best for logos, icons, signatures, and flat artwork. Photos and gradients are simplified into color shapes and may create large, less-faithful SVGs.</p>
          <button type="button" className="button button--primary vector-convert" onClick={() => void convert()} disabled={busy}>
            {busy ? "Tracing image…" : result ? "Convert again" : "Convert to SVG"}
          </button>
          {busy && <div className="vector-progress" role="status" aria-live="polite"><span className="vector-progress-bar" /><span>{status}</span></div>}
          {status === "Complete" && !busy && result && <p className="workspace-success" role="status">Vector paths are ready to preview and download.</p>}
          {error && <p className="workspace-error" role="alert">{error}</p>}

          {result && resultUrl && (
            <section className="vector-result" aria-label="Vectorization result">
              <div className="vector-comparison-heading"><div><span className="eyebrow">COMPARE</span><h2>Original and vector</h2></div><div className="vector-zoom" aria-label="Preview zoom"><button type="button" aria-label="Zoom out" onClick={() => setZoom((value) => Math.max(0.5, value - 0.25))}><ZoomOut size={15} /></button><span>{Math.round(zoom * 100)}%</span><button type="button" aria-label="Zoom in" onClick={() => setZoom((value) => Math.min(2, value + 0.25))}><ZoomIn size={15} /></button></div></div>
              <div className="vector-mobile-tabs" role="tablist" aria-label="Choose preview">
                <button type="button" role="tab" aria-selected={previewTab === "original"} aria-controls="vector-preview-panel" className={previewTab === "original" ? "is-active" : ""} onClick={() => setPreviewTab("original")}>Original PNG</button>
                <button type="button" role="tab" aria-selected={previewTab === "vector"} aria-controls="vector-preview-panel" className={previewTab === "vector" ? "is-active" : ""} onClick={() => setPreviewTab("vector")}>Result SVG</button>
              </div>
              <div className="vector-preview-grid" id="vector-preview-panel" role="tabpanel" aria-label={previewTab === "original" ? "Original PNG preview" : "Result SVG preview"}>
                <div className={`vector-preview-card${previewTab === "original" ? " is-mobile-active" : ""}`}>
                  <h3><ImageIcon size={15} /> Original PNG</h3>
                  <div className="vector-preview-canvas"><img src={sourceUrl} alt="Original PNG" style={{ transform: `scale(${zoom})` }} /></div>
                  <p>{dimensions.width} × {dimensions.height} px · {formatBytes(file.size)} · PNG</p>
                </div>
                <div className={`vector-preview-card${previewTab === "vector" ? " is-mobile-active" : ""}`}>
                  <h3><ShapesIcon /> Result SVG</h3>
                  <div className="vector-preview-canvas"><img src={resultUrl} alt={`Generated SVG preview with ${result.pathCount} vector paths`} style={{ transform: `scale(${zoom})` }} /></div>
                  <p>{result.width} × {result.height} viewBox · {formatBytes(new Blob([result.svg]).size)} · SVG</p>
                </div>
              </div>
              <div className="vector-result-stats">
                <span><strong>{result.pathCount.toLocaleString()}</strong> vector paths</span>
                <span><strong>{result.viewBox}</strong> viewBox</span>
                <span><strong>{formatBytes(new Blob([result.svg]).size)}</strong> SVG size</span>
              </div>
              <div className="vector-download">
                <DownloadButton href={resultUrl} filename={`${file.name.replace(/\.png$/i, "")}.svg`} format="SVG" size={formatBytes(new Blob([result.svg]).size)} onDownload={scheduleResetAfterDownload} />
                <span>Downloading clears this image and its preview from the page.</span>
              </div>
              <button type="button" className="vector-another" onClick={reset}><ArrowLeftRight size={15} /> Convert another PNG</button>
            </section>
          )}
        </div>
      )}
      {!error && !file && <p className="vector-upload-note">PNG only · Up to 20 MB and 20 megapixels · No upload to a server</p>}
      {!file && error && <p className="workspace-error" role="alert">{error}</p>}
    </Card>
  );
}

function ShapesIcon() {
  return <svg aria-hidden="true" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 3.5h5v5H2zM9.5 8 13 2l3.5 6zM3 11h4v3H3z" /></svg>;
}
