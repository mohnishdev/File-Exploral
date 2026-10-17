import type { Tool } from "@/lib/tools";

type ToolPageSeo = {
  title: string;
  description: string;
  scope: string;
  practicalHeading: string;
  practical: string;
  faqs: { question: string; answer: string }[];
};

export const toolPageSeo: Record<string, ToolPageSeo> = {
  "png-to-svg": {
    title: "PNG to SVG Converter",
    description: "Trace a PNG logo, icon, or illustration into SVG paths in your browser. Choose black-and-white or color settings and preview before downloading.",
    scope: "This is image tracing, not a lossless format switch. The browser analyzes pixel boundaries and approximates them as SVG paths; clear shapes generally trace better than photographs.",
    practicalHeading: "Prepare artwork for a cleaner trace",
    practical: "Start with the largest clean PNG available. Remove unnecessary whitespace, use a plain or transparent background, and choose black and white for line art or a small color palette for flat illustrations. Inspect small text and narrow gaps in the preview before using the SVG.",
    faqs: [
      { question: "Can every PNG become a useful SVG?", answer: "No. Logos, icons, signatures, and flat illustrations usually trace more cleanly than photographs, textures, or gradients. Complex images can create large SVG files and lose visual detail." },
      { question: "Will the output SVG scale cleanly?", answer: "The output consists of vector paths that can scale without pixel interpolation, but tracing approximates the source. Inspect edges and small details at the intended size." },
    ],
  },
  "png-to-jpg": {
    title: "PNG to JPG Converter",
    description: "Convert PNG images to JPG in your browser. Adjust JPEG quality, compare output size, and download without uploading the source file.",
    scope: "JPG is useful for photographs and broad compatibility, but it does not support transparent pixels. This converter composites transparent areas onto white and lets you choose output quality.",
    practicalHeading: "When JPG is a good fit",
    practical: "Choose JPG for photographs or when a destination specifically asks for JPEG. Keep PNG for transparent logos, interface graphics, and images with crisp text or edges. Lower quality can reduce file size, but inspect fine detail before downloading.",
    faqs: [
      { question: "Why did transparent areas turn white?", answer: "JPEG has no alpha channel. Transparent pixels must be filled with a solid background; this tool uses white." },
      { question: "Which JPG quality should I choose?", answer: "Start near the default and reduce quality only if you need a smaller file. The best setting depends on image detail and its final display size." },
    ],
  },
  "jpg-to-png": {
    title: "JPG to PNG Converter",
    description: "Make a PNG copy of a JPG image in your browser for compatible editing and lossless export workflows. Compare the file before downloading.",
    scope: "PNG stores the decoded pixels losslessly, but conversion cannot restore detail already discarded by JPG compression. The PNG may be larger than the original JPG.",
    practicalHeading: "What JPG-to-PNG conversion changes",
    practical: "Use PNG when an app requires the format or when you want to avoid additional lossy encoding during later edits. If the goal is a smaller photograph, PNG is usually not the right target; keep the JPG or consider WebP instead.",
    faqs: [
      { question: "Does converting JPG to PNG improve image quality?", answer: "No. It preserves the decoded JPG pixels in a lossless container but cannot recover details lost during the original JPG compression." },
      { question: "Will a PNG always be larger?", answer: "Not always, but photographs commonly take more space as PNG because PNG does not use lossy compression." },
    ],
  },
  "png-to-webp": {
    title: "PNG to WebP Converter",
    description: "Convert PNG artwork or photos to WebP in your browser. Set quality, preserve supported transparency, and compare the resulting file size.",
    scope: "WebP can store transparency and supports lossy or lossless encoding. The quality setting controls a lossy export, so fine detail may change as the file gets smaller.",
    practicalHeading: "Choose WebP for modern web delivery",
    practical: "WebP is a practical web format when your publishing tools and destination support it. Check transparent edges on graphics and compare the output at its actual display size before replacing the original PNG.",
    faqs: [
      { question: "Does WebP keep PNG transparency?", answer: "Yes. WebP supports transparency, and transparent PNG areas are retained in the WebP output." },
      { question: "Will the WebP be smaller than the PNG?", answer: "Often, especially with lossy quality settings, but the result depends on the image and selected quality. Compare the actual output size." },
    ],
  },
  "jpg-to-webp": {
    title: "JPG to WebP Converter",
    description: "Convert JPG photos to WebP in your browser and balance image quality with file size before downloading the new image.",
    scope: "WebP is supported by modern browsers and many publishing systems. Converting an already-compressed JPG cannot recover lost detail, and another lossy export can introduce additional changes.",
    practicalHeading: "Balance quality and file size",
    practical: "Begin with a high-quality setting, then lower it until the output reaches a useful size without obvious artifacts at the intended display dimensions. Keep the JPG if a receiving app does not accept WebP.",
    faqs: [
      { question: "Can WebP be used on websites?", answer: "Modern browsers support WebP. Confirm that your CMS, email platform, or other destination accepts WebP before replacing a JPG." },
      { question: "Does converting JPG to WebP recover detail?", answer: "No. Conversion changes the encoding format; it cannot restore information removed by the source JPG compression." },
    ],
  },
  "webp-to-png": {
    title: "WebP to PNG Converter",
    description: "Convert WebP images to PNG in your browser for applications that need PNG. Keep transparency and download a locally processed copy.",
    scope: "PNG is widely accepted by editing tools and preserves transparency, but it cannot restore image detail removed by lossy WebP encoding. Photographic PNGs may be larger.",
    practicalHeading: "When to convert WebP to PNG",
    practical: "Use PNG when an editor or workflow needs it, or when you need a lossless container for subsequent pixel edits. The conversion does not make a lossy source sharper; retain the original if file size matters.",
    faqs: [
      { question: "Will this restore the original quality of a lossy WebP?", answer: "No. The decoded pixels are saved as PNG, but details already lost in lossy WebP encoding cannot be recovered." },
      { question: "Is transparency preserved?", answer: "Yes. WebP transparency is retained in the PNG output." },
    ],
  },
  "webp-to-jpg": {
    title: "WebP to JPG Converter",
    description: "Convert WebP images to widely compatible JPG files in your browser. Choose JPEG quality and preview the output before download.",
    scope: "JPG works well for photographs and older apps, but does not support transparency. Transparent source pixels are composited onto a white background.",
    practicalHeading: "Check transparency and image quality",
    practical: "Use JPG when the destination requires it or does not accept WebP. If the WebP contains transparency, expect a white background. Use a high quality setting for detailed images, then compare the output visually.",
    faqs: [
      { question: "What happens to transparent WebP areas?", answer: "JPG does not support transparency, so transparent areas are composited onto white." },
      { question: "Can conversion improve a WebP image?", answer: "No. It changes the file format and may re-encode image data, but it cannot recreate detail missing from the source." },
    ],
  },
  "image-resizer": {
    title: "Image Resizer",
    description: "Resize JPG, PNG, or WebP images by pixel dimensions or percentage. Lock the aspect ratio, choose an output format, and preview the result.",
    scope: "Resizing changes the number of pixels in an image. Reducing dimensions can lower file size; enlarging an image creates interpolated pixels rather than genuine new detail.",
    practicalHeading: "Choose dimensions for the destination",
    practical: "Use the dimensions requested by your website, document, or platform. Keep the aspect ratio locked unless you intentionally want to stretch the image. For a smaller file, resizing and compression can be combined, but check the final result for readability.",
    faqs: [
      { question: "What does locking the aspect ratio do?", answer: "It keeps the image proportions consistent: changing one dimension automatically adjusts the other to avoid stretching." },
      { question: "Will enlarging an image make it sharper?", answer: "No. Enlargement can increase pixel dimensions, but it cannot create real detail that was not present in the source." },
    ],
  },
  "image-compressor": {
    title: "Image Compressor",
    description: "Reduce JPG, PNG, or WebP image file size in your browser. Adjust quality, compare before and after sizes, and download the result.",
    scope: "Compression results depend on both format and image content. Lower lossy quality can reduce size at the cost of detail; PNG is lossless and does not respond to a lossy quality slider in the same way.",
    practicalHeading: "How to reduce image size without surprises",
    practical: "For photographs, compare JPG or WebP quality settings and inspect edges, gradients, and fine texture. For transparent graphics, keep a format that supports transparency. The output can occasionally be larger, so use the measured size rather than assuming compression always saves space.",
    faqs: [
      { question: "Why did the compressed image get larger?", answer: "Some images are already efficiently encoded, or the chosen output format may not suit their content. Try another format or keep the smaller original." },
      { question: "Does the quality slider affect PNG?", answer: "PNG uses lossless compression. A lossy quality setting is meaningful for JPG and lossy WebP exports, not for PNG in the same way." },
    ],
  },
  "image-rotator": {
    title: "Image Rotator",
    description: "Rotate JPG, PNG, or WebP images by 90, 180, or 270 degrees, or flip them horizontally or vertically in your browser.",
    scope: "Rotation and flipping change orientation while keeping the original file untouched. The downloaded image is a newly rendered export in its selected format.",
    practicalHeading: "Straighten or mirror an image",
    practical: "Use quarter turns to correct sideways photos, or flip when a mirrored composition is needed. A 90- or 270-degree rotation swaps the output width and height. Choose PNG for lossless graphics or a suitable quality for JPG/WebP.",
    faqs: [
      { question: "Will rotating change the image dimensions?", answer: "A 90- or 270-degree rotation swaps width and height; a 180-degree rotation keeps the same dimensions." },
      { question: "Does the tool overwrite my original?", answer: "No. The original remains unchanged; the tool creates a separate file for download." },
    ],
  },
  "image-cropper": {
    title: "Image Cropper",
    description: "Crop JPG, PNG, or WebP images with free proportions or common aspect ratios. Preview the crop and choose an output format.",
    scope: "Cropping removes pixels outside the selected region. Aspect-ratio presets help create consistent framing, while free crop supports custom dimensions.",
    practicalHeading: "Frame the subject before exporting",
    practical: "Choose a preset when preparing profile images, thumbnails, or common video shapes. Keep the important subject inside the crop and inspect the preview at the intended output size. Cropped areas are not included in the downloaded file.",
    faqs: [
      { question: "Can I crop to a square or widescreen shape?", answer: "Yes. Choose a preset such as 1:1 or 16:9, or use free crop for a custom shape." },
      { question: "Can I recover pixels outside the crop later?", answer: "The original file is not changed. The downloaded crop omits pixels outside the selected area, so keep the original if you may need a different crop." },
    ],
  },
  "pdf-editor": {
    title: "PDF Page Editor",
    description: "Reorder, rotate, or remove PDF pages in your browser. Preview page thumbnails and download a revised PDF without editing page text.",
    scope: "This editor changes document page structure, not the text or objects drawn inside each page. It is useful for page-level cleanup before sharing or printing.",
    practicalHeading: "Page editing versus editing PDF text",
    practical: "Use the thumbnails to review page order, rotate incorrectly oriented pages, and remove pages that should not be included. Text editing, annotations, form changes, and redaction are outside this tool’s current scope.",
    faqs: [
      { question: "Can I change a word or character inside a PDF?", answer: "No. This tool reorders, rotates, or deletes whole pages. It does not edit text or objects within a page." },
      { question: "Can I review the page order before saving?", answer: "Yes. The editor previews page thumbnails, and you can reorder them before downloading the revised PDF." },
    ],
  },
  "pdf-merge": {
    title: "Merge PDF Files",
    description: "Combine multiple PDF files into one document in your browser. Arrange file order, review page counts, and download the merged PDF.",
    scope: "Merging is useful for assembling related forms, reports, or scanned pages. It copies pages into one document; it does not rewrite the text inside those pages.",
    practicalHeading: "Plan the order before merging",
    practical: "Add the PDFs, check their names and page counts, then drag them into the desired reading order. Review the merged file before sharing. Password-protected or malformed PDFs may need to be unlocked or repaired first.",
    faqs: [
      { question: "Can I choose the order of the PDFs?", answer: "Yes. Drag the file rows into the order you want before merging." },
      { question: "Can I merge password-protected PDFs?", answer: "Encrypted PDFs may not be supported by the browser processing library. Use an accessible, unencrypted copy if you have permission to do so." },
    ],
  },
  "pdf-split": {
    title: "Split PDF Pages",
    description: "Extract selected pages or page ranges from a PDF in your browser. Preview pages, enter ranges, and download a separate PDF.",
    scope: "Splitting copies selected pages into a new document and leaves the source file unchanged. Enter individual pages or ranges such as 1, 3-5, 8.",
    practicalHeading: "Select pages with a range",
    practical: "Separate page numbers with commas and use a hyphen for a continuous range. For example, 2, 4-6 extracts pages 2, 4, 5, and 6 in their original order. Check the page count before starting.",
    faqs: [
      { question: "How do I select a page range?", answer: "Enter comma-separated page numbers and ranges, such as 1, 3-5, 8. Page numbers start at 1." },
      { question: "Does splitting change the original PDF?", answer: "No. The selected pages are written to a separate PDF; the original file stays unchanged." },
    ],
  },
  "pdf-compress": {
    title: "Compress PDF Structure",
    description: "Re-save a PDF with compact object streams in your browser. Compare file sizes; embedded images are not recompressed, so results vary.",
    scope: "This browser operation repacks PDF structure only. It does not downsample or recompress embedded photos and scans, so it is not equivalent to image-based PDF compression.",
    practicalHeading: "Know what this PDF optimization can do",
    practical: "This method may reduce files with redundant or verbose PDF objects, but image-heavy documents may remain the same size or grow slightly. Compare the output size and open the saved document to verify it before replacing the original.",
    faqs: [
      { question: "Will this shrink every PDF?", answer: "No. The browser method repacks document objects but does not recompress embedded images. Results vary and the output can be similar or larger." },
      { question: "Does the tool lower scanned image quality?", answer: "No. It does not downsample or recompress embedded scans, so it generally avoids that quality trade-off but may not significantly reduce the file." },
    ],
  },
  "pdf-to-jpg": {
    title: "Convert PDF Pages to JPG",
    description: "Render selected PDF pages as JPG images in your browser. Choose resolution and quality; multiple pages download together as a ZIP.",
    scope: "Each selected page becomes a raster image. JPG is convenient for sharing and photographs, but text is no longer selectable and compression can soften small details.",
    practicalHeading: "Choose a resolution for the intended use",
    practical: "Use standard resolution for quick previews and higher resolution when page detail needs to remain readable. Higher settings create larger files and use more memory. Select only the pages you need when working with a large document.",
    faqs: [
      { question: "Can I convert only certain PDF pages?", answer: "Yes. Enter individual page numbers or ranges supported by the page selector." },
      { question: "Will the JPG contain selectable text?", answer: "No. Each page is rendered as pixels. Use a PDF workflow if text selection or search must be preserved." },
    ],
  },
  "pdf-to-png": {
    title: "Convert PDF Pages to PNG",
    description: "Render selected PDF pages as PNG images in your browser. Choose resolution and download one or multiple page images.",
    scope: "PNG preserves crisp rendered edges without lossy image compression. It does not preserve PDF text as editable or selectable text, and high-resolution pages can be large.",
    practicalHeading: "When PNG is the right page image",
    practical: "Choose PNG for diagrams, text-heavy pages, or when you want to avoid JPG artifacts around sharp edges. Select a practical resolution and limit page count for large files to manage browser memory.",
    faqs: [
      { question: "Is text still selectable in a page PNG?", answer: "No. The PDF page is rendered as an image. Keep the PDF when searchable or selectable text is needed." },
      { question: "Why are high-resolution PNG pages large?", answer: "PNG stores rendered pixels losslessly. Increasing resolution increases the number of pixels, which can substantially increase file size." },
    ],
  },
  "jpg-to-pdf": {
    title: "Convert JPG Images to PDF",
    description: "Arrange JPG photos, choose page orientation and margins, then create a PDF in your browser with control over image fit.",
    scope: "Each image becomes page content in a new PDF. The original photos remain unchanged; page layout depends on orientation, margins, and fit settings.",
    practicalHeading: "Set up a photo document",
    practical: "Arrange images in the order they should appear. Use automatic orientation to match each photo, or choose portrait or landscape for a consistent document. Contain keeps the whole image visible; fill may crop its edges.",
    faqs: [
      { question: "Can each image become a separate page?", answer: "Yes. The selected images are placed in order, one image per PDF page." },
      { question: "What is the difference between contain and fill?", answer: "Contain keeps the complete image visible within the page. Fill covers the page but can crop parts of the image." },
    ],
  },
  "png-to-pdf": {
    title: "Convert PNG Images to PDF",
    description: "Arrange PNG graphics and create a PDF in your browser. Choose page orientation, margins, and image fit for each page.",
    scope: "The tool places each PNG on a PDF page. Transparent areas can remain transparent in the embedded image; printed output may show transparency as white depending on the viewer or printer.",
    practicalHeading: "Keep graphics readable on PDF pages",
    practical: "Arrange the PNGs in reading order, then choose page dimensions and margins that suit the content. Contain preserves the complete image; fill may crop it. Review the downloaded PDF before printing or sharing.",
    faqs: [
      { question: "Will PNG transparency work in the PDF?", answer: "Transparency is retained in the embedded PNG where supported. A PDF viewer or printer may display transparent areas against white." },
      { question: "Can I arrange the image page order?", answer: "Yes. Add multiple images and drag their rows into the required page order before creating the PDF." },
    ],
  },
};

export function getToolPageSeo(tool: Tool) {
  return toolPageSeo[tool.slug];
}
