import type { VectorColorCount } from "./types";

type Color = { r: number; g: number; b: number; a: number };
type ColorBin = { r: number; g: number; b: number; count: number };

function medianCut(colors: ColorBin[], limit: number): Color[] {
  const boxes: ColorBin[][] = [colors];
  while (boxes.length < limit) {
    let splitIndex = -1;
    let splitChannel: "r" | "g" | "b" = "r";
    let splitScore = 0;
    for (let index = 0; index < boxes.length; index++) {
      const box = boxes[index];
      if (box.length < 2) continue;
      const ranges = (["r", "g", "b"] as const).map((channel) => {
        let minimum = 255;
        let maximum = 0;
        for (const color of box) {
          minimum = Math.min(minimum, color[channel]);
          maximum = Math.max(maximum, color[channel]);
        }
        return maximum - minimum;
      });
      const channelIndex = ranges.indexOf(Math.max(...ranges));
      const score = ranges[channelIndex] * Math.sqrt(box.reduce((sum, color) => sum + color.count, 0));
      if (score > splitScore) {
        splitScore = score;
        splitIndex = index;
        splitChannel = (["r", "g", "b"] as const)[channelIndex];
      }
    }
    if (splitIndex < 0) break;

    const box = boxes.splice(splitIndex, 1)[0].sort((left, right) => left[splitChannel] - right[splitChannel]);
    const midpoint = box.reduce((sum, color) => sum + color.count, 0) / 2;
    let accumulated = 0;
    let splitAt = 1;
    for (; splitAt < box.length; splitAt++) {
      accumulated += box[splitAt - 1].count;
      if (accumulated >= midpoint) break;
    }
    boxes.splice(splitIndex, 0, box.slice(0, splitAt), box.slice(splitAt));
  }

  return boxes.map((box) => {
    const totals = box.reduce((sum, color) => ({
      r: sum.r + color.r * color.count,
      g: sum.g + color.g * color.count,
      b: sum.b + color.b * color.count,
      count: sum.count + color.count,
    }), { r: 0, g: 0, b: 0, count: 0 });
    return {
      r: Math.round(totals.r / totals.count),
      g: Math.round(totals.g / totals.count),
      b: Math.round(totals.b / totals.count),
      a: 255,
    };
  });
}

export function quantizeColors(imageData: ImageData, requestedColors: VectorColorCount): Color[] {
  const count = requestedColors === "auto" ? 16 : requestedColors;
  const bins = new Map<number, { r: number; g: number; b: number; count: number }>();
  let hasTransparency = false;
  const pixels = imageData.data;
  for (let index = 0; index < pixels.length; index += 4) {
    if (pixels[index + 3] === 0) {
      hasTransparency = true;
      continue;
    }
    const key = (pixels[index] >> 3) << 10 | (pixels[index + 1] >> 3) << 5 | pixels[index + 2] >> 3;
    const bin = bins.get(key) ?? { r: 0, g: 0, b: 0, count: 0 };
    bin.r += pixels[index];
    bin.g += pixels[index + 1];
    bin.b += pixels[index + 2];
    bin.count++;
    bins.set(key, bin);
  }
  const samples: ColorBin[] = Array.from(bins.values(), (bin) => ({
    r: bin.r / bin.count,
    g: bin.g / bin.count,
    b: bin.b / bin.count,
    count: bin.count,
  }));
  const palette = samples.length ? medianCut(samples, Math.min(count, samples.length)) : [];
  if (hasTransparency) palette.push({ r: 0, g: 0, b: 0, a: 0 });

  for (let index = 0; index < pixels.length; index += 4) {
    if (pixels[index + 3] === 0 || palette.length === 0) continue;
    let nearest = palette[0];
    let nearestDistance = Number.POSITIVE_INFINITY;
    for (const color of palette) {
      if (color.a === 0) continue;
      const red = pixels[index] - color.r;
      const green = pixels[index + 1] - color.g;
      const blue = pixels[index + 2] - color.b;
      const distance = red * red + green * green + blue * blue;
      if (distance < nearestDistance) {
        nearest = color;
        nearestDistance = distance;
      }
    }
    pixels[index] = nearest.r;
    pixels[index + 1] = nearest.g;
    pixels[index + 2] = nearest.b;
  }
  return palette;
}

export function createTraceOptions(options: {
  mode: "monochrome" | "color";
  colors: "auto" | 2 | 4 | 8 | 16 | 32;
  detail: "low" | "medium" | "high";
  smoothing: number;
}, palette?: Color[]) {
  const detailSettings = {
    low: { pathomit: 12, ltres: 2, qtres: 2 },
    medium: { pathomit: 4, ltres: 1, qtres: 1 },
    high: { pathomit: 1, ltres: 0.5, qtres: 0.5 },
  }[options.detail];

  const smoothing = Math.max(0, Math.min(100, options.smoothing));
  const blurRadius = Math.round(smoothing / 34);

  return {
    ...detailSettings,
    colorsampling: 0,
    colorquantcycles: options.mode === "monochrome" ? 3 : 1,
    numberofcolors: options.mode === "monochrome"
      ? 2
      : options.colors === "auto" ? 16 : options.colors,
    blurradius: blurRadius,
    blurdelta: 16 + Math.round((100 - smoothing) * 1.2),
    linefilter: options.mode === "monochrome" || smoothing > 0,
    rightangleenhance: options.mode === "monochrome",
    roundcoords: 1,
    scale: 1,
    viewbox: true,
    strokewidth: 0,
    layering: 0,
    ...(palette ? { pal: palette } : {}),
  };
}
