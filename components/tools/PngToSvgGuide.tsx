import Link from "next/link";
import { getToolPathBySlug } from "@/lib/seo/tool-routes";

export function PngToSvgGuide() {
  return (
    <section className="vector-seo-content" aria-label="PNG and SVG guide">
      <article>
        <h2>What are PNG and SVG?</h2>
        <p>PNG is a raster image format: it records the color of each pixel and supports transparency. SVG is a text-based vector format that describes artwork with paths and shapes. A PNG can look crisp at its original dimensions, while an SVG can scale to different sizes without becoming pixelated.</p>
      </article>
      <article>
        <h2>Why vectorize a PNG?</h2>
        <p>A vector version can be useful when a simple logo, icon, or illustration needs to scale for a layout, be recolored, or enter a vector-editing workflow. This converter traces the visible regions into SVG paths. It does not merely change the filename, and it does not embed the source PNG in the SVG.</p>
      </article>
      <article>
        <h2>How PNG to SVG vectorization works</h2>
        <p>The image is decoded on your device, reduced to a practical working size when needed, and analyzed for color regions. The browser-side tracing engine simplifies those regions and draws vector paths around them. Black &amp; white mode applies a threshold before tracing; Color mode groups similar colors into a limited palette. The result is an interpretation of the pixels rather than a perfect reconstruction.</p>
      </article>
      <article>
        <h2>Choose the right image and settings</h2>
        <p>Logos with solid fills, icons, signatures, line art, and flat-color illustrations tend to make the most useful SVGs. A clean, high-resolution source with clear edges helps. For a single-color mark, try Black &amp; white and tune Threshold until fine strokes remain connected. For a flat illustration, choose Color and start with a small color count. Increase Detail only when the shapes need it.</p>
        <p>Photographs, soft shadows, textures, and gradients contain subtle pixel changes that do not map neatly to a few paths. They may become posterized, visually different, or much larger than the PNG. Use a raster format such as <Link href={getToolPathBySlug("png-to-webp")}>PNG to WebP</Link> when you need to preserve photographic appearance.</p>
      </article>
      <article>
        <h2>PNG vs SVG: which should you use?</h2>
        <p>Keep PNG for screenshots, photos, complex textures, and artwork where every pixel matters. Choose SVG for simple graphics that need to scale or be edited as shapes. Vectorizing cannot recover detail that is not present in the original, and it may not preserve exact colors or edges. Review the preview before using the result.</p>
      </article>
      <nav aria-label="Related image tools">
        <h2>Related tools</h2>
        <p>Prepare an image with the <Link href={getToolPathBySlug("image-resizer")}>Image Resizer</Link>, reduce a raster file with the <Link href={getToolPathBySlug("image-compressor")}>Image Compressor</Link>, or export a modern raster copy with <Link href={getToolPathBySlug("png-to-webp")}>PNG to WebP</Link>.</p>
      </nav>
    </section>
  );
}
