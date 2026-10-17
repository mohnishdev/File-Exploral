import { Download } from "lucide-react";

type DownloadButtonProps = {
  href: string;
  filename: string;
  disabled?: boolean;
  format?: string;
  size?: string;
};

export function DownloadButton({ href, filename, disabled = false, format, size }: DownloadButtonProps) {
  return (
    <div className="download-action">
      <a
        className={`button button--primary${disabled ? " is-disabled" : ""}`}
        href={disabled ? undefined : href}
        download={filename}
        aria-disabled={disabled}
        onClick={disabled ? (event) => event.preventDefault() : undefined}
      >
        <Download size={16} /> Download {format ?? "file"}
      </a>
      {size && <span className="download-details">{filename} · approximately {size}</span>}
    </div>
  );
}
