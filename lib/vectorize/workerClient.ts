import type { VectorizationOptions, VectorizationResult, VectorizerEngine } from "./types";

type WorkerResponse =
  | { type: "stage"; stage: string }
  | { type: "result"; svg: string }
  | { type: "error"; message: string };

export function runVectorizationWorker(
  file: File,
  options: VectorizationOptions,
  onStage: (stage: string) => void,
  signal?: AbortSignal,
): Promise<VectorizationResult> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Vectorization was cancelled.", "AbortError"));
      return;
    }
    const worker = new Worker(new URL("./vectorization.worker.ts", import.meta.url), { type: "module" });
    let settled = false;
    const finish = (callback: () => void) => {
      if (settled) return;
      settled = true;
      signal?.removeEventListener("abort", onAbort);
      worker.terminate();
      callback();
    };
    const onAbort = () => finish(() => reject(new DOMException("Vectorization was cancelled.", "AbortError")));
    signal?.addEventListener("abort", onAbort, { once: true });

    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const response = event.data;
      if (response.type === "stage") {
        onStage(response.stage);
      } else if (response.type === "result") {
        finish(() => {
          try {
            resolve(import("./svg").then(({ sanitizeAndInspectSvg }) => sanitizeAndInspectSvg(response.svg)));
          } catch (error) {
            reject(error);
          }
        });
      } else {
        finish(() => reject(new Error(response.message)));
      }
    };
    worker.onerror = () => finish(() => reject(new Error("Vectorization could not finish in this browser. Try a smaller PNG or lower detail.")));
    worker.onmessageerror = () => finish(() => reject(new Error("The vectorization result could not be read. Try again with a smaller PNG.")));
    void file.arrayBuffer().then((buffer) => {
      if (!settled) worker.postMessage({ type: "vectorize", buffer, options }, [buffer]);
    }).catch(() => finish(() => reject(new Error("The PNG could not be read. Choose it again and retry."))));
  });
}

export const imageTracerEngine: VectorizerEngine = {
  vectorize: (file, options, onStage = () => {}, signal) =>
    runVectorizationWorker(file, options, onStage, signal),
};
