type ProgressIndicatorProps = {
  value: number;
  label: string;
};

export function ProgressIndicator({ value, label }: ProgressIndicatorProps) {
  const progress = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="progress-indicator">
      <div className="progress-label"><span>{label}</span><span>{progress}%</span></div>
      <progress value={progress} max={100} aria-label={label}>{progress}%</progress>
    </div>
  );
}
