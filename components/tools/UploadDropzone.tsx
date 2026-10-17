"use client";

import { useRef, useState } from "react";
import { FileUp } from "lucide-react";
import { validateFile } from "@/lib/validation/files";
import { FilePicker } from "./FilePicker";

type UploadDropzoneProps = {
  accept: string[];
  onFile?: (file: File) => void;
  onFiles?: (files: File[]) => void;
  onError?: (message: string) => void;
  maxSize?: number;
  disabled?: boolean;
  multiple?: boolean;
  title?: string;
  description?: string;
};

export function UploadDropzone({
  accept,
  onFile,
  onFiles,
  onError,
  maxSize,
  disabled = false,
  multiple = false,
  title = "Drop your file here",
  description = "or choose a file from your device",
}: UploadDropzoneProps) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const dragDepth = useRef(0);
  const acceptAttribute = accept.join(",");

  function handleFiles(files: File[]) {
    if (files.length === 0 || disabled) return;
    const invalidFile = files
      .map((file) => ({ file, validation: validateFile(file, accept, maxSize) }))
      .find(({ validation }) => !validation.valid);
    if (invalidFile && !invalidFile.validation.valid) {
      setError(invalidFile.validation.message);
      onError?.(invalidFile.validation.message);
      return;
    }
    setError("");
    if (multiple) onFiles?.(files);
    else onFile?.(files[0]);
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
        handleFiles(Array.from(event.dataTransfer.files));
      }}
      aria-label="File upload area"
      aria-describedby={error ? "upload-error" : "upload-help"}
    >
      <span className="upload-icon"><FileUp size={21} /></span>
      <p className="upload-title">{title}</p>
      <p id="upload-help" className="upload-help">{description}</p>
      <FilePicker accept={acceptAttribute} onFile={onFile} onFiles={onFiles} multiple={multiple} disabled={disabled} label={multiple ? "Choose files" : "Choose file"} />
      {error && <p id="upload-error" className="upload-error" role="alert">{error}</p>}
    </div>
  );
}
