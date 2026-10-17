"use client";

import { useId, useRef } from "react";
import { FileUp } from "lucide-react";

type FilePickerProps = {
  accept: string;
  onFile?: (file: File) => void;
  onFiles?: (files: File[]) => void;
  disabled?: boolean;
  label?: string;
  multiple?: boolean;
};

export function FilePicker({ accept, onFile, onFiles, disabled = false, label = "Choose a file", multiple = false }: FilePickerProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        className="sr-only"
        id={inputId}
        type="file"
        accept={accept}
        disabled={disabled}
        multiple={multiple}
        onChange={(event) => {
          const files = Array.from(event.currentTarget.files ?? []);
          if (multiple) onFiles?.(files);
          else if (files[0]) onFile?.(files[0]);
          event.currentTarget.value = "";
        }}
      />
      <button
        className="button button--primary"
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        aria-controls={inputId}
      >
        <FileUp size={16} /> {label}
      </button>
    </>
  );
}
