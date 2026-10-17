declare module "imagetracerjs" {
  type TraceOptions = {
    pathomit?: number;
    ltres?: number;
    qtres?: number;
    colorsampling?: number;
    colorquantcycles?: number;
    numberofcolors?: number;
    blurradius?: number;
    blurdelta?: number;
    linefilter?: boolean;
    rightangleenhance?: boolean;
    roundcoords?: number;
    scale?: number;
    viewbox?: boolean;
    strokewidth?: number;
    layering?: number;
    pal?: { r: number; g: number; b: number; a: number }[];
  };

  const ImageTracer: {
    imagedataToSVG(imageData: ImageData, options?: TraceOptions): string;
  };

  export default ImageTracer;
}
