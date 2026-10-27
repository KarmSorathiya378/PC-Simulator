import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full rounded-xl border font-sans text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/60 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 select-text",
  {
    variants: {
      variant: {
        default:
          "border-border/80 bg-card/80 text-foreground shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:shadow-[0_0_16px_rgba(14,165,233,0.18)]",
        tech:
          "border-border/90 bg-[#0B0F18] font-mono text-xs text-foreground shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)] focus-visible:border-cyan-400 focus-visible:ring-2 focus-visible:ring-cyan-500/25 focus-visible:shadow-[0_0_20px_rgba(0,245,255,0.2)]",
        glass:
          "glass-surface border-white/10 bg-slate-900/60 backdrop-blur-xl text-foreground focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/25",
        subtle:
          "border-border/50 bg-secondary/40 text-foreground focus-visible:border-border-strong focus-visible:ring-2 focus-visible:ring-primary/20",
      },
      inputSize: {
        sm: "h-8 px-2.5 py-1 text-xs",
        default: "h-10 px-3.5 py-2 text-sm",
        lg: "h-12 px-4 py-2.5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  error?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, type, error, startIcon, endIcon, ...props }, ref) => {
    return (
      <div className="relative flex w-full items-center">
        {startIcon && (
          <div className="pointer-events-none absolute left-3 flex items-center justify-center text-muted-foreground">
            {startIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            inputVariants({ variant, inputSize }),
            startIcon && "pl-9",
            endIcon && "pr-9",
            error && "border-destructive/80 focus-visible:border-destructive focus-visible:ring-destructive/30",
            className
          )}
          ref={ref}
          {...props}
        />
        {endIcon && (
          <div className="absolute right-3 flex items-center justify-center text-muted-foreground">
            {endIcon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
export default Input;
