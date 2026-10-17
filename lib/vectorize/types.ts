export type VectorizationMode = "monochrome" | "color";
export type VectorizationDetail = "low" | "medium" | "high";
export type VectorColorCount = "auto" | 2 | 4 | 8 | 16 | 32;
export type ThresholdMode = "fixed" | "otsu" | "adaptive";

export type VectorizationOptions = {
  mode: VectorizationMode;
  colors: VectorColorCount;
  detail: VectorizationDetail;
  smoothing: number;
  removeBackground: boolean;
  threshold: number;
  thresholdMode: ThresholdMode;
};

export type VectorizationResult = {
  svg: string;
  pathCount: number;
  viewBox: string;
  width: number;
  height: number;
};

export type VectorizerEngine = {
  vectorize(
    file: File,
    options: VectorizationOptions,
    onStage?: (stage: string) => void,
    signal?: AbortSignal,
  ): Promise<VectorizationResult>;
};

export const MAX_VECTOR_FILE_SIZE = 20 * 1024 * 1024;
export const MAX_VECTOR_PIXELS = 20_000_000;
export const MAX_VECTOR_DIMENSION = 12_000;
export const MAX_SVG_BYTES = 8 * 1024 * 1024;
export const MAX_SVG_PATHS = 30_000;

export const defaultVectorizationOptions: VectorizationOptions = {
  mode: "color",
  colors: 16,
  detail: "high",
  smoothing: 0,
  removeBackground: false,
  threshold: 160,
  thresholdMode: "fixed",
};
