"use client";

import { useRef, useState } from "react";
import { FileUp } from "lucide-react";
import { validateFile } from "@/lib/validation/files";
import { FilePicker } from "./FilePicker";

type UploadDropzoneProps = {
  accept: string[];
  onFile: (file: File) => void;
  onError?: (message: string) => void;
  maxSize?: number;
  disabled?: boolean;
};

export function UploadDropzone({ accept, onFile, onError, maxSize, disabled = false }: UploadDropzoneProps) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const dragDepth = useRef(0);
  const acceptAttribute = accept.join(",");

  function handleFile(file?: File) {
    if (!file || disabled) return;
    const result = validateFile(file, accept, maxSize);
    if (!result.valid) {
      setError(result.message);
      onError?.(result.message);
      return;
    }
    setError("");
    onFile(file);
  }

  return (
    <div
      className={`upload-dropzone${dragging ? " is-dragging" : ""}${disabled ? " is-disabled" : ""}`}
      onDragEnter={(event) => {
        event.preventDefault();
        if (!disabled) {
          dragDepth.current += 1;
          setDragging(true);
        }
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={(event) => {
        event.preventDefault();
        dragDepth.current -= 1;
        if (dragDepth.current <= 0) {
          dragDepth.current = 0;
          setDragging(false);
        }
      }}
      onDrop={(event) => {
        event.preventDefault();
        dragDepth.current = 0;
        setDragging(false);
        handleFile(event.dataTransfer.files[0]);
      }}
      aria-label="File upload area"
      aria-describedby={error ? "upload-error" : "upload-help"}
    >
      <span className="upload-icon"><FileUp size={21} /></span>
      <p className="upload-title">Drop your file here</p>
      <p id="upload-help" className="upload-help">or select a file from your device</p>
      <FilePicker accept={acceptAttribute} onFile={handleFile} disabled={disabled} />
      {error && <p id="upload-error" className="upload-error" role="alert">{error}</p>}
    </div>
  );
}
