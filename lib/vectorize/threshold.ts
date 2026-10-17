import type { ThresholdMode } from "./types";

function grayscaleHistogram(imageData: ImageData): { histogram: Uint32Array; count: number; sum: number } {
  const pixels = imageData.data;
  const histogram = new Uint32Array(256);
  let count = 0;
  let sum = 0;
  for (let index = 0; index < pixels.length; index += 4) {
    if (pixels[index + 3] === 0) continue;
    const value = Math.round(pixels[index] * 0.2126 + pixels[index + 1] * 0.7152 + pixels[index + 2] * 0.0722);
    pixels[index] = value;
    pixels[index + 1] = value;
    pixels[index + 2] = value;
    histogram[value]++;
    count++;
    sum += value;
  }
  return { histogram, count, sum };
}

function otsuThreshold(histogram: Uint32Array, count: number, sum: number): number {
  let backgroundCount = 0;
  let backgroundSum = 0;
  let maximumVariance = -1;
  let threshold = 128;
  for (let value = 0; value < histogram.length; value++) {
    backgroundCount += histogram[value];
    if (backgroundCount === 0) continue;
    const foregroundCount = count - backgroundCount;
    if (foregroundCount === 0) break;
    backgroundSum += value * histogram[value];
    const backgroundMean = backgroundSum / backgroundCount;
    const foregroundMean = (sum - backgroundSum) / foregroundCount;
    const variance = backgroundCount * foregroundCount * (backgroundMean - foregroundMean) ** 2;
    if (variance > maximumVariance) {
      maximumVariance = variance;
      threshold = value;
    }
  }
  return threshold;
}

function applyAdaptiveThreshold(imageData: ImageData, sensitivity: number): void {
  const { data, width, height } = imageData;
  const stride = width + 1;
  const integral = new Float64Array((width + 1) * (height + 1));
  const counts = new Uint32Array((width + 1) * (height + 1));
  for (let y = 1; y <= height; y++) {
    let rowSum = 0;
    let rowCount = 0;
    for (let x = 1; x <= width; x++) {
      const offset = ((y - 1) * width + x - 1) * 4;
      if (data[offset + 3] > 0) {
        rowSum += data[offset];
        rowCount++;
      }
      const cell = y * stride + x;
      integral[cell] = integral[cell - stride] + rowSum;
      counts[cell] = counts[cell - stride] + rowCount;
    }
  }

  const radius = Math.max(8, Math.round(Math.min(width, height) / 24));
  const sensitivityFactor = Math.max(0.02, Math.min(0.35, sensitivity / 100));
  for (let y = 0; y < height; y++) {
    const top = Math.max(0, y - radius);
    const bottom = Math.min(height, y + radius + 1);
    for (let x = 0; x < width; x++) {
      const offset = (y * width + x) * 4;
      if (data[offset + 3] === 0) continue;
      const left = Math.max(0, x - radius);
      const right = Math.min(width, x + radius + 1);
      const bottomRight = bottom * stride + right;
      const topRight = top * stride + right;
      const bottomLeft = bottom * stride + left;
      const topLeft = top * stride + left;
      const localSum = integral[bottomRight] - integral[topRight] - integral[bottomLeft] + integral[topLeft];
      const localCount = counts[bottomRight] - counts[topRight] - counts[bottomLeft] + counts[topLeft];
      const localMean = localCount ? localSum / localCount : 255;
      const value = data[offset] < localMean * (1 - sensitivityFactor) ? 0 : 255;
      data[offset] = value;
      data[offset + 1] = value;
      data[offset + 2] = value;
    }
  }
}

export function applyThreshold(imageData: ImageData, threshold: number, mode: ThresholdMode): void {
  const { histogram, count, sum } = grayscaleHistogram(imageData);
  if (mode === "adaptive") {
    applyAdaptiveThreshold(imageData, threshold);
    return;
  }

  const cutoff = mode === "otsu"
    ? otsuThreshold(histogram, count, sum)
    : threshold;
  const pixels = imageData.data;
  for (let index = 0; index < pixels.length; index += 4) {
    if (pixels[index + 3] === 0) continue;
    const value = pixels[index] < cutoff ? 0 : 255;
    pixels[index] = value;
    pixels[index + 1] = value;
    pixels[index + 2] = value;
  }
}
