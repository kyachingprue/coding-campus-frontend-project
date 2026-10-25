import { cva } from "class-variance-authority";
import { createElement, type ButtonHTMLAttributes, type ElementType } from "react";
import type { VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";


const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-linear-to-r from-cyan to-cyan-dim text-ink shadow-[0_0_0_1px_rgba(0,217,192,0.35),0_8px_24px_-8px_rgba(0,217,192,0.35)] hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_12px_30px_-8px_rgba(0,217,192,0.45)] active:translate-y-0",
        outline:
          "border border-line bg-transparent text-fog hover:bg-surface-2 hover:border-mist/40",
        ghost: "bg-transparent text-fog hover:bg-surface-2",
        subtle: "bg-surface-2 text-fog hover:bg-line",
        danger: "bg-coral/10 text-coral border border-coral/30 hover:bg-coral/20",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-14 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> &
  VariantProps<typeof buttonVariants> & {
    as?: ElementType;
    to?: string;
    [prop: string]: unknown;
  };

export function Button({ className, variant, size, as = "button", ...props }: ButtonProps) {
  return createElement(as, {
    ...props,
    className: cn(buttonVariants({ variant, size }), className),
  });
}
