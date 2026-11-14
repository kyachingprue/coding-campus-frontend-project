import { FiCode } from "react-icons/fi";

export default function LoadingState({
  label = "Loading your learning space...",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center gap-4 rounded-2xl border border-cyan/15 bg-surface p-5 shadow-lg shadow-black/5 ${className}`}
    >
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan/10 text-cyan">
        <span className="absolute inset-0 animate-ping rounded-xl bg-cyan/10" />
        <FiCode className="relative animate-pulse" size={20} />
      </span>
      <span className="min-w-0">
        <span className="block font-display text-sm font-semibold text-fog">{label}</span>
        <span className="mt-1 block text-xs text-mist">Preparing your next step...</span>
      </span>
      <span className="ml-auto h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-line border-t-cyan" aria-hidden="true" />
    </div>
  );
}
