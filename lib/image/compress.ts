import { renderImage } from "./convert";
import type { ImageFormat, ImageResult, ImageSource } from "./types";

export function compressImage(source: ImageSource, format: ImageFormat, quality: number): Promise<ImageResult> {
  return renderImage(source, { format, quality });
}
