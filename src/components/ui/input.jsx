import { cn } from "../../lib/utils";


export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "flex h-11 w-full rounded-lg border border-line bg-surface-2 px-4 text-sm text-fog placeholder:text-mist/70 outline-none transition-colors focus:border-cyan/60 focus:ring-2 focus:ring-cyan/20",
        className
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }) {
  return (
    <label
      className={cn("mb-1.5 block text-xs font-medium uppercase tracking-wide text-mist", className)}
      {...props}
    />
  );
}
