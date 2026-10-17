import type { ImageFormat, ImageResult, ImageSource } from "./types";
import { renderImage } from "./convert";

export function rotateImage(
  source: ImageSource,
  format: ImageFormat,
  rotation: number,
  flipX = false,
  flipY = false,
  quality = 0.92,
): Promise<ImageResult> {
  return renderImage(source, { format, rotation, flipX, flipY, quality });
}
