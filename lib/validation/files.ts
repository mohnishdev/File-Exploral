export const MAX_FILE_SIZE = 25 * 1024 * 1024;

export type FileValidationResult =
  | { valid: true }
  | { valid: false; message: string; code: "unsupported" | "too-large" };

export function validateFile(
  file: File,
  acceptedTypes: string[],
  maxSize = MAX_FILE_SIZE,
): FileValidationResult {
  const fileExtension = file.name.split(".").pop()?.toLowerCase();
  const accepted = acceptedTypes.some((type) =>
    type.startsWith(".")
      ? `.${fileExtension}` === type.toLowerCase()
      : type === file.type,
  );

  if (!accepted) {
    return {
      valid: false,
      code: "unsupported",
      message: `This file type is not supported. Choose ${acceptedTypes.join(", ")}.`,
    };
  }
  if (file.size > maxSize) {
    return {
      valid: false,
      code: "too-large",
      message: `This file is larger than the ${Math.round(maxSize / 1024 / 1024)} MB limit.`,
    };
  }
  return { valid: true };
}
