export type ProcessingOptions = Readonly<Record<string, boolean | number | string>>;

export type ConversionRequest = {
  toolId: string;
  file: File;
  options?: ProcessingOptions;
};

export type ConversionResult = {
  blob: Blob;
  filename: string;
  mimeType: string;
};

export interface FileProcessor {
  process(request: ConversionRequest, signal?: AbortSignal): Promise<ConversionResult>;
}

export interface TemporaryProcessingJob {
  getResult(signal?: AbortSignal): Promise<ConversionResult>;
  delete(): Promise<void>;
}

export interface TemporaryFileProcessor {
  createJob(request: ConversionRequest, signal?: AbortSignal): Promise<TemporaryProcessingJob>;
}

export async function processTemporarily(
  processor: TemporaryFileProcessor,
  request: ConversionRequest,
  signal?: AbortSignal,
): Promise<ConversionResult> {
  const job = await processor.createJob(request, signal);
  let result: ConversionResult;

  try {
    result = await job.getResult(signal);
  } catch (processingError) {
    try {
      await job.delete();
    } catch (cleanupError) {
      throw new AggregateError(
        [processingError, cleanupError],
        "File processing and temporary-file cleanup both failed.",
      );
    }
    throw processingError;
  }

  await job.delete();
  return result;
}
