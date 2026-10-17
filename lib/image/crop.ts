import type { ImageFormat, ImageResult, ImageSource } from "./types";
import { renderImage } from "./convert";

export type CropRegion = { x: number; y: number; width: number; height: number };

export function cropImage(
  source: ImageSource,
  crop: CropRegion,
  format: ImageFormat,
  quality = 0.92,
): Promise<ImageResult> {
  return renderImage(source, { crop, format, quality });
}
