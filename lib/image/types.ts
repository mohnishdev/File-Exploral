export type ImageFormat = "image/jpeg" | "image/png" | "image/webp";

export type ImageSource = {
  bitmap: ImageBitmap;
  width: number;
  height: number;
};

export type ImageResult = {
  blob: Blob;
  width: number;
  height: number;
  format: ImageFormat;
};

export type ImageQualityOptions = {
  quality?: number;
  background?: string;
};
