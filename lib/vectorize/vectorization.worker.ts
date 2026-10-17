/// <reference lib="webworker" />
import ImageTracer from "imagetracerjs";
import { createTraceOptions, quantizeColors } from "./colorQuantization";
import { applyThreshold } from "./threshold";
import {
  MAX_VECTOR_DIMENSION,
  MAX_VECTOR_PIXELS,
  type VectorizationOptions,
} from "./types";

type Request = { type: "vectorize"; buffer: ArrayBuffer; options: VectorizationOptions };
const workerScope = self as DedicatedWorkerGlobalScope;

function postStage(stage: string) {
  workerScope.postMessage({ type: "stage", stage });
}

function removeFlatBackground(imageData: ImageData) {
  const { data, width, height } = imageData;
  const total = width * height;
  const queue = new Int32Array(total);
  const colorBins = new Map<number, { count: number; r: number; g: number; b: number }>();

  function touchesTransparentEdge(pixel: number, x: number, y: number): boolean {
    if (x === 0 || y === 0 || x === width - 1 || y === height - 1) return true;
    return data[(pixel - 1) * 4 + 3] === 0 ||
      data[(pixel + 1) * 4 + 3] === 0 ||
      data[(pixel - width) * 4 + 3] === 0 ||
      data[(pixel + width) * 4 + 3] === 0;
  }

  let candidateCount = 0;
  for (let pixel = 0; pixel < total; pixel++) {
    const offset = pixel * 4;
    if (data[offset + 3] === 0) continue;
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    if (!touchesTransparentEdge(pixel, x, y)) continue;
    candidateCount++;
    const key = (data[offset] >> 3) << 10 | (data[offset + 1] >> 3) << 5 | data[offset + 2] >> 3;
    const bin = colorBins.get(key) ?? { count: 0, r: 0, g: 0, b: 0 };
    bin.count++;
    bin.r += data[offset];
    bin.g += data[offset + 1];
    bin.b += data[offset + 2];
    colorBins.set(key, bin);
  }

  let dominantBin: { count: number; r: number; g: number; b: number } | undefined;
  for (const bin of colorBins.values()) {
    if (!dominantBin || bin.count > dominantBin.count) dominantBin = bin;
  }
  if (!dominantBin || dominantBin.count / candidateCount < 0.2) return;
  const background = [
    dominantBin.r / dominantBin.count,
    dominantBin.g / dominantBin.count,
    dominantBin.b / dominantBin.count,
  ];

  let head = 0;
  let tail = 0;
  for (let pixel = 0; pixel < total; pixel++) {
    const offset = pixel * 4;
    if (data[offset + 3] === 0) continue;
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    if (!touchesTransparentEdge(pixel, x, y)) continue;
    const distance = Math.hypot(
      data[offset] - background[0],
      data[offset + 1] - background[1],
      data[offset + 2] - background[2],
    );
    if (distance <= 52) {
      data[offset + 3] = 0;
      queue[tail++] = pixel;
    }
  }

  while (head < tail) {
    const pixel = queue[head++];
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    const neighbors = [
      x > 0 ? pixel - 1 : -1,
      x + 1 < width ? pixel + 1 : -1,
      y > 0 ? pixel - width : -1,
      y + 1 < height ? pixel + width : -1,
    ];
    for (const next of neighbors) {
      if (next < 0) continue;
      const nextOffset = next * 4;
      if (data[nextOffset + 3] === 0) continue;
      const distance = Math.hypot(
        data[nextOffset] - background[0],
        data[nextOffset + 1] - background[1],
        data[nextOffset + 2] - background[2],
      );
      if (distance > 52) continue;
      data[nextOffset + 3] = 0;
      queue[tail++] = next;
    }
  }
}

async function processImage(buffer: ArrayBuffer, options: VectorizationOptions) {
  postStage("Preparing image…");
  const header = new DataView(buffer);
  const signature = new Uint8Array(buffer, 0, Math.min(8, buffer.byteLength));
  const validSignature = signature.length === 8 &&
    signature[0] === 137 && signature[1] === 80 && signature[2] === 78 && signature[3] === 71 &&
    signature[4] === 13 && signature[5] === 10 && signature[6] === 26 && signature[7] === 10;
  if (!validSignature || buffer.byteLength < 24 || header.getUint32(12) !== 0x49484452) {
    throw new Error("This PNG could not be opened. It may be damaged or use an unsupported encoding.");
  }
  const inputWidth = header.getUint32(16);
  const inputHeight = header.getUint32(20);
  if (
    inputWidth === 0 ||
    inputHeight === 0 ||
    inputWidth > MAX_VECTOR_DIMENSION ||
    inputHeight > MAX_VECTOR_DIMENSION ||
    inputWidth * inputHeight > MAX_VECTOR_PIXELS
  ) {
    throw new Error("This PNG exceeds the supported dimensions (12,000 px per side and 20 megapixels). Resize it and try again.");
  }
  const bitmap = await createImageBitmap(new Blob([buffer], { type: "image/png" }));
  try {
    const maxWorkingDimension = options.detail === "high" ? 1600 : options.detail === "medium" ? 1200 : 900;
    const scale = Math.min(1, maxWorkingDimension / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = new OffscreenCanvas(width, height);
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) throw new Error("This browser cannot prepare images for vectorization.");
    context.clearRect(0, 0, width, height);
    context.drawImage(bitmap, 0, 0, width, height);

    postStage("Analyzing colors…");
    const imageData = context.getImageData(0, 0, width, height);
    if (options.removeBackground) removeFlatBackground(imageData);
    if (options.mode === "monochrome") applyThreshold(imageData, options.threshold, options.thresholdMode);
    const palette = options.mode === "color" ? quantizeColors(imageData, options.colors) : undefined;
    context.putImageData(imageData, 0, 0);

    postStage("Tracing…");
    const svg = ImageTracer.imagedataToSVG(imageData, createTraceOptions(options, palette));
    postStage("Optimizing SVG…");
    if (!svg || !svg.includes("<path")) {
      throw new Error("No vector shapes were found. Try changing the threshold or using a higher detail setting.");
    }
    return svg;
  } finally {
    bitmap.close();
  }
}

workerScope.onmessage = (event: MessageEvent<Request>) => {
  const { type, buffer, options } = event.data;
  if (type !== "vectorize") return;
  void processImage(buffer, options)
    .then((svg) => workerScope.postMessage({ type: "result", svg }))
    .catch((error: unknown) => {
      const message = error instanceof Error
        ? error.message
        : "Vectorization failed. Try a smaller PNG or simpler settings.";
      workerScope.postMessage({ type: "error", message });
    });
};
