import type { ImageFormat } from "./types";

export const IMAGE_ACCEPT = ["image/jpeg", "image/png", "image/webp"] as const;
export const MAX_IMAGE_BYTES = 100 * 1024 * 1024;
export const MAX_IMAGE_PIXELS = 60_000_000;

export function validateImageFile(file: File): string | undefined {
  const extension = file.name.split(".").pop()?.toLowerCase();
  const acceptedExtensions = ["jpg", "jpeg", "png", "webp"];
  if (!IMAGE_ACCEPT.includes(file.type as (typeof IMAGE_ACCEPT)[number]) && !acceptedExtensions.includes(extension ?? "")) {
    return "Choose a JPG, PNG, or WebP image.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "This image is larger than the 100 MB limit.";
  }
  if (file.size === 0) {
    return "This file is empty. Choose a valid image.";
  }
  return undefined;
}

export function extensionForFormat(format: ImageFormat): string {
  return format === "image/jpeg" ? "jpg" : format === "image/png" ? "png" : "webp";
}

export function formatLabel(format: ImageFormat): string {
  return format === "image/jpeg" ? "JPG" : format === "image/png" ? "PNG" : "WebP";
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function reductionPercent(before: number, after: number): number {
  return before > 0 ? Math.round((1 - after / before) * 100) : 0;
}
