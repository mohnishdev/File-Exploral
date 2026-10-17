import { AlertCircle, CheckCircle2, LoaderCircle } from "lucide-react";

type ProcessingStateProps = {
  state: "idle" | "processing" | "success" | "error";
  message?: string;
};

const icons = {
  idle: null,
  processing: <LoaderCircle size={17} className="processing-spinner" />,
  success: <CheckCircle2 size={17} />,
  error: <AlertCircle size={17} />,
};

export function ProcessingState({ state, message }: ProcessingStateProps) {
  if (state === "idle") return null;
  return (
    <div className={`processing-state processing-state--${state}`} role={state === "error" ? "alert" : "status"} aria-live="polite">
      {icons[state]}
      <span>{message ?? (state === "processing" ? "Processing your file…" : state === "success" ? "Your file is ready." : "Something went wrong. Please try again.")}</span>
    </div>
  );
}
