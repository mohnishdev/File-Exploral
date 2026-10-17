"use client";

import { useId, useRef } from "react";
import { FileUp } from "lucide-react";

type FilePickerProps = {
  accept: string;
  onFile: (file: File) => void;
  disabled?: boolean;
  label?: string;
};

export function FilePicker({ accept, onFile, disabled = false, label = "Choose a file" }: FilePickerProps) {
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
        onChange={(event) => {
          const file = event.currentTarget.files?.[0];
          if (file) onFile(file);
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
