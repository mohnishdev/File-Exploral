import type { ImageFormat, ImageResult, ImageSource } from "./types";
import { MAX_IMAGE_PIXELS } from "./validation";

export async function loadImage(file: File): Promise<ImageSource> {
  if (typeof createImageBitmap !== "function") {
    throw new Error("This browser does not support local image processing. Try an up-to-date browser.");
  }
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error("This image could not be opened. It may be corrupted or use an unsupported encoding.");
  }
  if (bitmap.width * bitmap.height > MAX_IMAGE_PIXELS) {
    bitmap.close();
    throw new Error("This image has too many pixels for safe browser processing.");
  }
  if (bitmap.width === 0 || bitmap.height === 0) {
    bitmap.close();
    throw new Error("This image has invalid dimensions.");
  }
  return { bitmap, width: bitmap.width, height: bitmap.height };
}

export function releaseImage(source?: ImageSource) {
  source?.bitmap.close();
}

export async function renderImage(
  source: ImageSource,
  options: {
    format: ImageFormat;
    quality?: number;
    width?: number;
    height?: number;
    rotation?: number;
    flipX?: boolean;
    flipY?: boolean;
    crop?: { x: number; y: number; width: number; height: number };
    background?: string;
  },
): Promise<ImageResult> {
  const crop = options.crop ?? { x: 0, y: 0, width: source.width, height: source.height };
  const rotation = ((options.rotation ?? 0) % 360 + 360) % 360;
  const swapsDimensions = rotation === 90 || rotation === 270;
  const naturalWidth = swapsDimensions ? crop.height : crop.width;
  const naturalHeight = swapsDimensions ? crop.width : crop.height;
  const width = Math.max(1, Math.round(options.width ?? naturalWidth));
  const height = Math.max(1, Math.round(options.height ?? naturalHeight));
  if (width * height > MAX_IMAGE_PIXELS) {
    throw new Error("The requested output is too large for safe browser processing.");
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { alpha: options.format !== "image/jpeg" });
  if (!context) throw new Error("Your browser could not create an image canvas.");

  if (options.format === "image/jpeg") {
    context.fillStyle = options.background ?? "#ffffff";
    context.fillRect(0, 0, width, height);
  }

  context.save();
  context.translate(width / 2, height / 2);
  context.rotate((rotation * Math.PI) / 180);
  context.scale(options.flipX ? -1 : 1, options.flipY ? -1 : 1);
  const drawWidth = swapsDimensions ? height : width;
  const drawHeight = swapsDimensions ? width : height;
  context.drawImage(
    source.bitmap,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    -drawWidth / 2,
    -drawHeight / 2,
    drawWidth,
    drawHeight,
  );
  context.restore();

  const blob = await canvasToBlob(canvas, options.format, options.quality);
  canvas.width = 0;
  canvas.height = 0;
  return { blob, width, height, format: options.format };
}

export function canvasToBlob(canvas: HTMLCanvasElement, format: ImageFormat, quality = 0.92): Promise<Blob> {
  if (typeof canvas.toBlob !== "function") {
    return Promise.reject(new Error("This browser does not support exporting images."));
  }
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error(`Your browser could not export this image as ${format}.`));
        } else if (blob.type !== format) {
          reject(new Error(`Your browser does not support exporting ${formatLabelForError(format)} images.`));
        } else {
          resolve(blob);
        }
      },
      format,
      Math.max(0.1, Math.min(1, quality)),
    );
  });
}

function formatLabelForError(format: ImageFormat) {
  return format === "image/jpeg" ? "JPG" : format === "image/png" ? "PNG" : "WebP";
}

export function defaultFormatForFile(file: File): ImageFormat {
  if (file.type === "image/png" || file.name.toLowerCase().endsWith(".png")) return "image/png";
  if (file.type === "image/webp" || file.name.toLowerCase().endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}
