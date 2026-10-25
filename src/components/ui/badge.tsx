import { cn } from "../../lib/utils";
import type { HTMLAttributes } from "react";
import type { CourseLevel } from "../../lib/types";


const toneMap = {
  Beginner: "text-cyan bg-cyan/10 border-cyan/30",
  Intermediate: "text-amber bg-amber/10 border-amber/30",
  Advanced: "text-coral bg-coral/10 border-coral/30",
  default: "text-mist bg-surface-2 border-line",
};

type BadgeProps = Omit<HTMLAttributes<HTMLSpanElement>, "color"> & {
  tone?: CourseLevel | "default";
};

export function Badge({ className, tone = "default", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-medium tracking-wide",
        toneMap[tone] || toneMap.default,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
