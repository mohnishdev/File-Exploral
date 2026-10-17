"use client";

import { useEffect, useMemo, useRef, useState } from "react";
/* Blob URLs are local previews and must not be passed through Next's image optimizer. */
/* eslint @next/next/no-img-element: "off" */
import {
  Crop, FlipHorizontal, FlipVertical, LockKeyhole, RotateCw,
} from "lucide-react";
import { UploadDropzone } from "./UploadDropzone";
import { DownloadButton } from "./DownloadButton";
import { Card } from "@/components/ui/Card";
import { compressImage } from "@/lib/image/compress";
import { renderImage, loadImage, releaseImage, defaultFormatForFile } from "@/lib/image/convert";
import { cropImage } from "@/lib/image/crop";
import { resizeImage, getResizedDimensions } from "@/lib/image/resize";
import { rotateImage } from "@/lib/image/rotate";
import { extensionForFormat, formatBytes, formatLabel, reductionPercent, validateImageFile } from "@/lib/image/validation";
import type { ImageFormat, ImageResult, ImageSource } from "@/lib/image/types";

type Props = { slug: string };

const formats: { value: ImageFormat; label: string }[] = [
  { value: "image/jpeg", label: "JPG" },
  { value: "image/png", label: "PNG" },
  { value: "image/webp", label: "WebP" },
];

const sourceFormats: Record<string, ImageFormat> = {
  "png-to-jpg": "image/jpeg",
  "jpg-to-png": "image/png",
  "png-to-webp": "image/webp",
  "jpg-to-webp": "image/webp",
  "webp-to-png": "image/png",
  "webp-to-jpg": "image/jpeg",
};

const ratios = [
  { name: "Free", value: 0 },
  { name: "1:1", value: 1 },
  { name: "4:3", value: 4 / 3 },
  { name: "3:2", value: 3 / 2 },
  { name: "16:9", value: 16 / 9 },
];

export function ImageToolWorkspace({ slug }: Props) {
  const [file, setFile] = useState<File>();
  const [source, setSource] = useState<ImageSource>();
  const [sourceUrl, setSourceUrl] = useState("");
  const [result, setResult] = useState<ImageResult>();
  const [resultUrl, setResultUrl] = useState("");
  const [quality, setQuality] = useState(0.86);
  const [outputFormat, setOutputFormat] = useState<ImageFormat>("image/jpeg");
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [percentage, setPercentage] = useState(75);
  const [lockRatio, setLockRatio] = useState(true);
  const [resizeMode, setResizeMode] = useState<"dimensions" | "percentage">("dimensions");
  const [cropRegion, setCropRegion] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [cropRatio, setCropRatio] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const objectUrls = useRef(new Set<string>());
  const sourceRef = useRef<ImageSource | undefined>(undefined);
  const operationRef = useRef(0);

  const isRotator = slug === "image-rotator";
  const isCropper = slug === "image-cropper";
  const isResizer = slug === "image-resizer";
  const isCompressor = slug === "image-compressor";
  const targetFormat = sourceFormats[slug] ?? outputFormat;
  const isJpegTarget = targetFormat === "image/jpeg";
  const accept = useMemo(() => {
    if (slug.startsWith("png-to")) return ["image/png", ".png"];
    if (slug.startsWith("jpg-to")) return ["image/jpeg", ".jpg", ".jpeg"];
    if (slug.startsWith("webp-to")) return ["image/webp", ".webp"];
    return ["image/jpeg", "image/png", "image/webp", ".jpg", ".jpeg", ".png", ".webp"];
  }, [slug]);

  useEffect(() => () => {
    if (sourceRef.current) releaseImage(sourceRef.current);
    objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
    objectUrls.current.clear();
  }, []);

  function makeUrl(blob: Blob) {
    const url = URL.createObjectURL(blob);
    objectUrls.current.add(url);
    return url;
  }

  function clearResult() {
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
      objectUrls.current.delete(resultUrl);
    }
    setResult(undefined);
    setResultUrl("");
  }

  async function handleFile(nextFile: File) {
    const operationId = ++operationRef.current;
    setError("");
    setStatus("Opening image…");
    setBusy(true);
    try {
      const validation = validateImageFile(nextFile);
      if (validation) throw new Error(validation);
      const decoded = await loadImage(nextFile);
      if (operationId !== operationRef.current) {
        releaseImage(decoded);
        return;
      }
      if (sourceRef.current) releaseImage(sourceRef.current);
      if (sourceUrl) {
        URL.revokeObjectURL(sourceUrl);
        objectUrls.current.delete(sourceUrl);
      }
      clearResult();
      setSource(decoded);
      sourceRef.current = decoded;
      setFile(nextFile);
      setSourceUrl(makeUrl(nextFile));
      setWidth(decoded.width);
      setHeight(decoded.height);
      setCropRegion({ x: 0, y: 0, width: 100, height: 100 });
      setRotation(0);
      setFlipX(false);
      setFlipY(false);
      setOutputFormat(slug === "image-compressor" && defaultFormatForFile(nextFile) === "image/png" ? "image/webp" : defaultFormatForFile(nextFile));
      setStatus("");
    } catch (caught) {
      if (operationId === operationRef.current) {
        setError(caught instanceof Error ? caught.message : "This image could not be opened.");
        setStatus("");
      }
    } finally {
      if (operationId === operationRef.current) setBusy(false);
    }
  }

  function reset() {
    operationRef.current += 1;
    if (sourceRef.current) releaseImage(sourceRef.current);
    sourceRef.current = undefined;
    if (sourceUrl) {
      URL.revokeObjectURL(sourceUrl);
      objectUrls.current.delete(sourceUrl);
    }
    clearResult();
    setSource(undefined);
    setFile(undefined);
    setSourceUrl("");
    setError("");
    setStatus("");
    setBusy(false);
    setRotation(0);
    setFlipX(false);
    setFlipY(false);
  }

  function updateCropRatio(ratio: number) {
    setCropRatio(ratio);
    if (!source || !ratio) {
      setCropRegion({ x: 0, y: 0, width: 100, height: 100 });
      return;
    }
    const sourceRatio = source.width / source.height;
    const region = sourceRatio > ratio
      ? { x: 0, y: 0, width: Math.round(100 * ratio / sourceRatio), height: 100 }
      : { x: 0, y: 0, width: 100, height: Math.round(100 * sourceRatio / ratio) };
    setCropRegion(region);
  }

  async function run() {
    if (!source || !file) return;
    const operationId = ++operationRef.current;
    clearResult();
    setError("");
    setBusy(true);
    setStatus("Processing image…");
    try {
      let nextResult: ImageResult;
      if (isResizer) {
        const dimensions = getResizedDimensions(source, {
          width: Math.max(1, width),
          height: Math.max(1, height),
          percentage,
          lockRatio,
          mode: resizeMode,
        });
        nextResult = await resizeImage(source, dimensions.width, dimensions.height, outputFormat, quality);
      } else if (isCompressor) {
        nextResult = await compressImage(source, outputFormat, quality);
      } else if (isCropper) {
        const crop = {
          x: Math.round((cropRegion.x / 100) * source.width),
          y: Math.round((cropRegion.y / 100) * source.height),
          width: Math.max(1, Math.round((cropRegion.width / 100) * source.width)),
          height: Math.max(1, Math.round((cropRegion.height / 100) * source.height)),
        };
        nextResult = await cropImage(source, crop, outputFormat, quality);
      } else if (isRotator) {
        nextResult = await rotateImage(source, defaultFormatForFile(file), rotation, flipX, flipY);
      } else {
        nextResult = await renderImage(source, { format: targetFormat, quality });
      }
      if (operationId !== operationRef.current) return;
      setResult(nextResult);
      setResultUrl(makeUrl(nextResult.blob));
      setStatus("Done. Your file is ready to download.");
    } catch (caught) {
      if (operationId === operationRef.current) {
        setError(caught instanceof Error ? caught.message : "The image could not be processed. Try another file or output setting.");
        setStatus("");
      }
    } finally {
      if (operationId === operationRef.current) setBusy(false);
    }
  }

  const outputName = file
    ? `${file.name.replace(/\.[^.]+$/, "")}.${extensionForFormat(result?.format ?? targetFormat)}`
    : "image";

  return (
    <Card className="interactive-workspace">
      <div className="workspace-heading">
        <div className="workspace-icon"><Crop size={20} /></div>
        <div><strong>{slug.replaceAll("-", " ")}</strong><span>Processed locally in your browser</span></div>
        {file && <button className="text-button reset-button" type="button" onClick={reset}>Reset</button>}
      </div>

      {!file && <UploadDropzone accept={accept} onFile={handleFile} disabled={busy} />}
      {!file && status && <p className="workflow-status" role="status">{status}</p>}
      {!file && error && <p className="upload-error" role="alert">{error}</p>}

      {file && source && (
        <div className="image-workflow">
          <div className="image-preview-card">
            <img src={sourceUrl} alt={`Preview of ${file.name}`} className="image-preview" />
            <div className="image-preview-meta"><span>{file.name}</span><span>{source.width} × {source.height}</span><span>{formatBytes(file.size)}</span></div>
          </div>

          {isResizer && <div className="image-options">
            <div className="option-tabs"><button type="button" className={resizeMode === "dimensions" ? "active" : ""} onClick={() => setResizeMode("dimensions")}>Dimensions</button><button type="button" className={resizeMode === "percentage" ? "active" : ""} onClick={() => setResizeMode("percentage")}>Percentage</button></div>
            {resizeMode === "dimensions" ? <div className="dimension-fields">
              <label>Width <input type="number" min="1" max="30000" value={width} onChange={(event) => { const value = Number(event.target.value); setWidth(value); if (lockRatio && source.height) setHeight(Math.max(1, Math.round(value * source.height / source.width))); }} /></label>
              <button className={`ratio-lock${lockRatio ? " active" : ""}`} type="button" aria-pressed={lockRatio} onClick={() => setLockRatio(!lockRatio)}><LockKeyhole size={15} /> Lock ratio</button>
              <label>Height <input type="number" min="1" max="30000" value={height} onChange={(event) => { const value = Number(event.target.value); setHeight(value); if (lockRatio && source.width) setWidth(Math.max(1, Math.round(value * source.width / source.height))); }} /></label>
            </div> : <label className="range-control">Resize to {percentage}%<input type="range" min="10" max="200" value={percentage} onChange={(event) => setPercentage(Number(event.target.value))} /></label>}
            <label className="select-control">Output format <select value={outputFormat} onChange={(event) => setOutputFormat(event.target.value as ImageFormat)}>{formats.map((format) => <option key={format.value} value={format.value}>{format.label}</option>)}</select></label>
          </div>}

          {isCompressor && <div className="image-options">
            <label className="range-control">Quality <strong>{Math.round(quality * 100)}%</strong><input type="range" min="10" max="100" value={Math.round(quality * 100)} onChange={(event) => setQuality(Number(event.target.value) / 100)} /></label>
            <label className="select-control">Output format <select value={outputFormat} onChange={(event) => setOutputFormat(event.target.value as ImageFormat)}>{formats.map((format) => <option key={format.value} value={format.value}>{format.label}</option>)}</select></label>
          </div>}

          {isCropper && <div className="image-options">
            <div className="crop-preview-frame" style={{ aspectRatio: `${source.width} / ${source.height}` }}><img src={sourceUrl} alt="Image crop preview" /><div className="crop-selection" style={{ left: `${cropRegion.x}%`, top: `${cropRegion.y}%`, width: `${cropRegion.width}%`, height: `${cropRegion.height}%` }} /></div>
            <div className="ratio-presets" aria-label="Crop aspect ratio">{ratios.map((ratio) => <button type="button" className={cropRatio === ratio.value ? "active" : ""} key={ratio.name} onClick={() => updateCropRatio(ratio.value)}>{ratio.name}</button>)}</div>
            <div className="crop-fields">
              {(["x", "y", "width", "height"] as const).map((field) => <label key={field}>{field === "x" ? "Left" : field === "y" ? "Top" : field === "width" ? "Width" : "Height"} %<input type="number" min="1" max="100" value={cropRegion[field]} onChange={(event) => {
                const nextValue = Math.max(0, Math.min(100, Number(event.target.value)));
                const nextRegion = { ...cropRegion, [field]: nextValue };
                if (field === "x") nextRegion.width = Math.min(nextRegion.width, 100 - nextValue);
                if (field === "y") nextRegion.height = Math.min(nextRegion.height, 100 - nextValue);
                if (field === "width") nextRegion.x = Math.min(nextRegion.x, 100 - nextValue);
                if (field === "height") nextRegion.y = Math.min(nextRegion.y, 100 - nextValue);
                setCropRegion(nextRegion);
              }} /></label>)}
            </div>
            <label className="select-control">Output format <select value={outputFormat} onChange={(event) => setOutputFormat(event.target.value as ImageFormat)}>{formats.map((format) => <option key={format.value} value={format.value}>{format.label}</option>)}</select></label>
          </div>}

          {isRotator && <div className="rotate-controls" aria-label="Image adjustments">
            {[90, 180, 270].map((degrees) => <button type="button" key={degrees} onClick={() => setRotation(degrees)}><RotateCw size={16} /> {degrees}°</button>)}
            <button type="button" aria-pressed={flipX} className={flipX ? "active" : ""} onClick={() => setFlipX(!flipX)}><FlipHorizontal size={16} /> Flip horizontal</button>
            <button type="button" aria-pressed={flipY} className={flipY ? "active" : ""} onClick={() => setFlipY(!flipY)}><FlipVertical size={16} /> Flip vertical</button>
          </div>}

          {(isJpegTarget || slug.includes("webp")) && !isResizer && !isCropper && !isRotator && <label className="range-control">Quality <strong>{Math.round(quality * 100)}%</strong><input type="range" min="10" max="100" value={Math.round(quality * 100)} onChange={(event) => setQuality(Number(event.target.value) / 100)} /></label>}
          {isCropper && <label className="range-control">Quality <strong>{Math.round(quality * 100)}%</strong><input type="range" min="10" max="100" value={Math.round(quality * 100)} onChange={(event) => setQuality(Number(event.target.value) / 100)} /></label>}

          <div className="workflow-actions">
            <button type="button" className="button button--primary" onClick={run} disabled={busy}>{busy ? "Processing…" : isCompressor ? "Compress image" : isResizer ? "Resize image" : isCropper ? "Crop image" : isRotator ? "Apply changes" : `Convert to ${formatLabel(targetFormat)}`}</button>
            {status && <p role="status" className="workflow-status">{status}</p>}
            {error && <p role="alert" className="upload-error">{error}</p>}
          </div>

          {result && resultUrl && <div className="result-card">
            <div className="result-heading"><span className="result-success">Ready to download</span><span>{formatLabel(result.format)} · {result.width} × {result.height}</span></div>
            <img src={resultUrl} alt={`Processed ${formatLabel(result.format)} result`} className="image-preview result-preview" />
            <div className="size-comparison"><span>Original <strong>{formatBytes(file.size)}</strong></span><span>New file <strong>{formatBytes(result.blob.size)}</strong></span>{isCompressor && <span className={reductionPercent(file.size, result.blob.size) >= 0 ? "size-saving" : "size-increase"}>{reductionPercent(file.size, result.blob.size) >= 0 ? `${reductionPercent(file.size, result.blob.size)}% smaller` : `${Math.abs(reductionPercent(file.size, result.blob.size))}% larger`}</span>}</div>
            <DownloadButton href={resultUrl} filename={outputName} format={formatLabel(result.format)} size={formatBytes(result.blob.size)} />
          </div>}
        </div>
      )}
      <p className="workspace-footnote">Your image stays in this browser tab. It is not sent to our servers.</p>
    </Card>
  );
}
