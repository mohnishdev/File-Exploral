import type { LucideIcon } from "lucide-react";
import {
  Crop,
  ArrowLeftRight,
  FileImage,
  FilePlus2,
  FileText,
  Maximize2,
  Minimize2,
  RotateCw,
  ScanLine,
  Scissors,
  Shapes,
} from "lucide-react";

export type ToolCategory = "Image" | "PDF";

export type Tool = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  category: ToolCategory;
  icon: LucideIcon;
  formats: string[];
  features: string[];
  steps: string[];
  related: string[];
  faqs: { question: string; answer: string }[];
  keywords: string[];
};

const commonFaqs = [
  {
    question: "Is this tool free to use?",
    answer:
      "Yes. Image Converter is free to use, with no account, subscription, or payment required.",
  },
  {
    question: "Are my files uploaded or saved?",
    answer:
      "Image and PDF tools process files in your browser. Files are not uploaded to our servers. Resetting the tool clears temporary file references and previews.",
  },
];

export const tools: Tool[] = [
  {
    slug: "png-to-svg",
    name: "PNG to SVG Converter",
    shortName: "PNG to SVG",
    description:
      "Turn a PNG logo, icon, or illustration into editable SVG vector paths in your browser. Adjust colors and detail, then preview and download the result.",
    category: "Image",
    icon: Shapes,
    formats: ["PNG", "SVG"],
    features: ["Real vector paths, not an embedded image", "Adjustable color and detail settings", "Private browser-side processing"],
    steps: ["Choose a PNG graphic", "Adjust tracing settings", "Preview and download your SVG"],
    related: ["image-resizer", "image-compressor", "png-to-webp"],
    faqs: [
      ...commonFaqs,
      {
        question: "Will this make a perfect vector copy?",
        answer:
          "No. Vectorization estimates shapes and colors from pixels. It works best for logos, icons, line art, signatures, and flat illustrations; photographs and gradients can produce simplified, larger SVGs.",
      },
      {
        question: "Does the SVG contain my original PNG?",
        answer:
          "No. The result contains generated vector paths. The tool does not embed the source PNG in the SVG.",
      },
    ],
    keywords: ["PNG", "SVG"],
  },
  {
    slug: "png-to-jpg",
    name: "PNG to JPG Converter",
    shortName: "PNG to JPG",
    description:
      "Convert PNG images to JPG in your browser, adjust output quality, and download the result without uploading your image.",
    category: "Image",
    icon: ArrowLeftRight,
    formats: ["PNG", "JPG"],
    features: ["Simple image conversion", "No account required", "Clear privacy details"],
    steps: ["Choose a PNG image", "Review the conversion settings", "Download your JPG"],
    related: ["jpg-to-png", "png-to-webp", "image-compressor"],
    faqs: [
      ...commonFaqs,
      {
        question: "Will transparency be preserved?",
        answer:
          "JPG does not support transparency. Transparent areas are composited against white in the output.",
      },
    ],
    keywords: ["PNG", "JPG"],
  },
  {
    slug: "jpg-to-png",
    name: "JPG to PNG Converter",
    shortName: "JPG to PNG",
    description:
      "Convert JPG photos to PNG in your browser. Create a PNG copy for editing or workflows that benefit from lossless image storage.",
    category: "Image",
    icon: ArrowLeftRight,
    formats: ["JPG", "PNG"],
    features: ["Straightforward format change", "No account required", "Built for the browser"],
    steps: ["Choose a JPG image", "Review the conversion settings", "Download your PNG"],
    related: ["png-to-jpg", "webp-to-png", "image-resizer"],
    faqs: commonFaqs,
    keywords: ["JPG", "PNG"],
  },
  {
    slug: "png-to-webp",
    name: "PNG to WebP Converter",
    shortName: "PNG to WebP",
    description:
      "Convert PNG images to WebP with adjustable quality. The image is processed locally in your browser and is not uploaded.",
    category: "Image",
    icon: ArrowLeftRight,
    formats: ["PNG", "WebP"],
    features: ["Modern image format", "No account required", "Simple workflow"],
    steps: ["Choose a PNG image", "Review the conversion settings", "Download your WebP"],
    related: ["jpg-to-webp", "webp-to-png", "png-to-jpg"],
    faqs: commonFaqs,
    keywords: ["PNG", "WebP"],
  },
  {
    slug: "jpg-to-webp",
    name: "JPG to WebP Converter",
    shortName: "JPG to WebP",
    description:
      "Convert JPG images to efficient WebP files and choose the quality that balances image detail with file size.",
    category: "Image",
    icon: ArrowLeftRight,
    formats: ["JPG", "WebP"],
    features: ["Modern image format", "No account required", "Simple workflow"],
    steps: ["Choose a JPG image", "Review the conversion settings", "Download your WebP"],
    related: ["png-to-webp", "jpg-to-png", "image-compressor"],
    faqs: commonFaqs,
    keywords: ["JPG", "WebP"],
  },
  {
    slug: "webp-to-png",
    name: "WebP to PNG Converter",
    shortName: "WebP to PNG",
    description:
      "Convert WebP images to PNG in your browser. Download a PNG copy for compatibility with apps that do not support WebP.",
    category: "Image",
    icon: ArrowLeftRight,
    formats: ["WebP", "PNG"],
    features: ["Simple image conversion", "No account required", "Clear privacy details"],
    steps: ["Choose a WebP image", "Review the conversion settings", "Download your PNG"],
    related: ["jpg-to-png", "png-to-jpg", "png-to-webp"],
    faqs: commonFaqs,
    keywords: ["WebP", "PNG"],
  },
  {
    slug: "image-resizer",
    name: "Image Resizer",
    shortName: "Image Resizer",
    description:
      "Resize an image by dimensions or percentage, preserve its aspect ratio, and export a new file directly in your browser.",
    category: "Image",
    icon: Maximize2,
    formats: ["JPG", "PNG", "WebP"],
    features: ["Set image dimensions", "Keep the workflow simple", "No account required"],
    steps: ["Choose an image", "Set your desired dimensions", "Save the resized image"],
    related: ["image-compressor", "png-to-jpg", "jpg-to-png"],
    faqs: commonFaqs,
    keywords: ["JPG", "PNG", "WebP"],
  },
  {
    slug: "image-compressor",
    name: "Image Compressor",
    shortName: "Image Compressor",
    description:
      "Compress JPG, PNG, and WebP images with a quality control and a before-and-after file size comparison. Processing stays in your browser.",
    category: "Image",
    icon: Minimize2,
    formats: ["JPG", "PNG", "WebP"],
    features: ["Optimize image file size", "No account required", "Simple workflow"],
    steps: ["Choose an image", "Review compression options", "Download the optimized image"],
    related: ["image-resizer", "png-to-webp", "jpg-to-webp"],
    faqs: commonFaqs,
    keywords: ["JPG", "PNG", "WebP"],
  },
  {
    slug: "pdf-editor",
    name: "PDF Editor",
    shortName: "PDF Editor",
    description:
      "Edit PDF page order in your browser: preview pages, zoom, rotate, delete, and reorder before downloading the edited document.",
    category: "PDF",
    icon: FileText,
    formats: ["PDF"],
    features: ["A clear document workflow", "No account required", "Privacy details before processing"],
    steps: ["Choose a PDF", "Make your edits", "Download the updated PDF"],
    related: ["pdf-merge", "pdf-split", "pdf-compress"],
    faqs: commonFaqs,
    keywords: ["PDF"],
  },
  {
    slug: "pdf-merge",
    name: "Merge PDF",
    shortName: "Merge PDF",
    description:
      "Merge multiple PDF files into one document. Arrange the files first, review page counts, then download the combined PDF.",
    category: "PDF",
    icon: FilePlus2,
    formats: ["PDF"],
    features: ["Arrange documents", "No account required", "Simple document workflow"],
    steps: ["Choose your PDF files", "Arrange them in order", "Download the merged PDF"],
    related: ["pdf-split", "pdf-editor", "pdf-compress"],
    faqs: commonFaqs,
    keywords: ["PDF"],
  },
  {
    slug: "pdf-split",
    name: "Split PDF",
    shortName: "Split PDF",
    description:
      "Select PDF pages by number or range and extract them into a new document, processed locally in your browser.",
    category: "PDF",
    icon: Scissors,
    formats: ["PDF"],
    features: ["Choose document pages", "No account required", "Clear processing details"],
    steps: ["Choose a PDF", "Select the pages to keep", "Download your new PDF"],
    related: ["pdf-merge", "pdf-compress", "pdf-editor"],
    faqs: commonFaqs,
    keywords: ["PDF"],
  },
  {
    slug: "pdf-compress",
    name: "Compress PDF",
    shortName: "Compress PDF",
    description:
      "Re-save a PDF with compact object streams in your browser. This structural optimization may not reduce every PDF's file size.",
    category: "PDF",
    icon: Minimize2,
    formats: ["PDF"],
    features: ["Optimize document size", "No account required", "Simple workflow"],
    steps: ["Choose a PDF", "Review compression options", "Download the optimized PDF"],
    related: ["pdf-merge", "pdf-split", "pdf-to-jpg"],
    faqs: commonFaqs,
    keywords: ["PDF"],
  },
  {
    slug: "pdf-to-jpg",
    name: "PDF to JPG Converter",
    shortName: "PDF to JPG",
    description:
      "Render selected PDF pages to JPG images in your browser. Choose image quality and resolution before downloading.",
    category: "PDF",
    icon: ScanLine,
    formats: ["PDF", "JPG"],
    features: ["Convert document pages", "No account required", "Clear processing details"],
    steps: ["Choose a PDF", "Select the pages to convert", "Download your JPG images"],
    related: ["jpg-to-pdf", "pdf-split", "pdf-compress"],
    faqs: commonFaqs,
    keywords: ["PDF", "JPG"],
  },
  {
    slug: "jpg-to-pdf",
    name: "JPG to PDF Converter",
    shortName: "JPG to PDF",
    description:
      "Combine JPG images into a PDF. Reorder pages and choose orientation, margins, and how each image fits the page.",
    category: "PDF",
    icon: FileImage,
    formats: ["JPG", "PDF"],
    features: ["Arrange images into a document", "No account required", "Simple workflow"],
    steps: ["Choose JPG images", "Arrange the pages", "Download your PDF"],
    related: ["pdf-to-jpg", "pdf-merge", "image-resizer"],
    faqs: commonFaqs,
    keywords: ["JPG", "PDF"],
  },
  {
    slug: "webp-to-jpg",
    name: "WebP to JPG Converter",
    shortName: "WebP to JPG",
    description: "Convert WebP images to JPG in your browser and choose the output quality. Your image is processed on this device.",
    category: "Image", icon: ArrowLeftRight, formats: ["WebP", "JPG"],
    features: ["Adjustable JPG quality", "Browser-side processing", "Download with size details"],
    steps: ["Choose a WebP image", "Set the JPG quality", "Download the converted image"],
    related: ["webp-to-png", "jpg-to-webp", "png-to-jpg"],
    faqs: commonFaqs, keywords: ["WebP", "JPG"],
  },
  {
    slug: "image-rotator",
    name: "Image Rotator",
    shortName: "Image Rotator",
    description: "Rotate an image by 90, 180, or 270 degrees, or flip it horizontally or vertically. All processing happens in your browser.",
    category: "Image", icon: RotateCw, formats: ["JPG", "PNG", "WebP"],
    features: ["Quarter-turn and half-turn rotation", "Horizontal and vertical flip", "Preview before download"],
    steps: ["Choose an image", "Rotate or flip the preview", "Download the adjusted image"],
    related: ["image-cropper", "image-resizer", "image-compressor"],
    faqs: commonFaqs, keywords: ["JPG", "PNG", "WebP"],
  },
  {
    slug: "image-cropper",
    name: "Image Cropper",
    shortName: "Image Cropper",
    description: "Crop an image to a preset aspect ratio or custom dimensions. Select the crop area and export locally in your browser.",
    category: "Image", icon: Crop, formats: ["JPG", "PNG", "WebP"],
    features: ["Common aspect-ratio presets", "Adjustable crop area", "Choose the output format"],
    steps: ["Choose an image", "Set the crop area and ratio", "Preview and download the crop"],
    related: ["image-resizer", "image-rotator", "image-compressor"],
    faqs: commonFaqs, keywords: ["JPG", "PNG", "WebP"],
  },
  {
    slug: "pdf-to-png",
    name: "PDF to PNG Converter",
    shortName: "PDF to PNG",
    description: "Render selected PDF pages to high-quality PNG images in your browser and download the pages as a ZIP.",
    category: "PDF", icon: ScanLine, formats: ["PDF", "PNG"],
    features: ["Choose pages and resolution", "Transparent image output", "Private browser processing"],
    steps: ["Choose a PDF", "Select pages and resolution", "Download PNG pages"],
    related: ["pdf-to-jpg", "jpg-to-pdf", "png-to-pdf"],
    faqs: commonFaqs, keywords: ["PDF", "PNG"],
  },
  {
    slug: "png-to-pdf",
    name: "PNG to PDF Converter",
    shortName: "PNG to PDF",
    description: "Combine PNG images into a PDF document. Arrange pages and choose orientation, margins, and image fit.",
    category: "PDF", icon: FileImage, formats: ["PNG", "PDF"],
    features: ["Arrange multiple images", "Choose page layout", "No image upload to a server"],
    steps: ["Choose PNG images", "Arrange pages and set layout", "Create and download your PDF"],
    related: ["jpg-to-pdf", "pdf-to-png", "pdf-merge"],
    faqs: commonFaqs, keywords: ["PNG", "PDF"],
  },
];

export const imageTools = tools.filter((tool) => tool.category === "Image");
export const pdfTools = tools.filter((tool) => tool.category === "PDF");

export function getTool(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}
