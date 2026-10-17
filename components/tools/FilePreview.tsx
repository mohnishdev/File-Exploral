import { FileImage, FileText } from "lucide-react";

type FilePreviewProps = {
  name: string;
  size: number;
  type: "image" | "pdf" | "file";
};

export function FilePreview({ name, size, type }: FilePreviewProps) {
  const Icon = type === "image" ? FileImage : FileText;
  const formattedSize = size < 1024 * 1024
    ? `${Math.max(1, Math.round(size / 1024))} KB`
    : `${(size / (1024 * 1024)).toFixed(1)} MB`;

  return (
    <div className="file-preview">
      <span className="file-preview-icon"><Icon size={18} /></span>
      <span className="file-preview-name" title={name}>{name}</span>
      <span className="file-preview-size">{formattedSize}</span>
    </div>
  );
}
