import { renderImage } from "./convert";
import type { ImageFormat, ImageResult, ImageSource } from "./types";

export function getResizedDimensions(
  source: Pick<ImageSource, "width" | "height">,
  options: { width: number; height: number; percentage: number; lockRatio: boolean; mode: "dimensions" | "percentage" },
) {
  if (options.mode === "percentage") {
    const scale = Math.max(1, options.percentage) / 100;
    return { width: Math.round(source.width * scale), height: Math.round(source.height * scale) };
  }
  if (!options.lockRatio) return { width: options.width, height: options.height };
  const widthScale = options.width / source.width;
  const heightScale = options.height / source.height;
  const scale = Math.min(widthScale, heightScale);
  return { width: Math.round(source.width * scale), height: Math.round(source.height * scale) };
}

export function resizeImage(source: ImageSource, width: number, height: number, format: ImageFormat, quality = 0.92): Promise<ImageResult> {
  return renderImage(source, { width, height, format, quality });
}
