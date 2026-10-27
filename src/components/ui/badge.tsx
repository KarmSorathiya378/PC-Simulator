import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { themeTokens } from "@/styles/theme";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-tight transition-all duration-150 backdrop-blur-md select-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]",
  {
    variants: {
      variant: {
        default:
          "border-sky-500/35 bg-sky-950/50 text-sky-300 shadow-xs shadow-sky-500/25",
        secondary:
          "border-border/80 bg-secondary/80 text-secondary-foreground shadow-2xs",
        warm:
          "border-amber-500/35 bg-amber-950/50 text-amber-300 shadow-xs shadow-amber-500/25",
        success:
          "border-emerald-500/35 bg-emerald-950/50 text-emerald-300 shadow-xs shadow-emerald-500/25",
        destructive:
          "border-rose-500/35 bg-rose-950/50 text-rose-300 shadow-xs shadow-rose-500/25",
        outline:
          "border-border/80 bg-card/60 text-foreground",
        mint:
          "border-teal-500/35 bg-teal-950/50 text-teal-300 shadow-xs shadow-teal-500/25",
        violet:
          "border-indigo-500/35 bg-indigo-950/50 text-indigo-300 shadow-xs shadow-indigo-500/25",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.2 text-[10px]",
        lg: "px-3 py-1 text-sm font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
  dotColor?: string;
}

function Badge({ className, variant, size, dot, dotColor, children, style, ...props }: BadgeProps) {
  return (
    <div
      style={{
        borderRadius: themeTokens.radii.pill,
        ...style,
      }}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "size-1.5 rounded-full shrink-0",
            dotColor || (variant === "warm" ? "bg-amber-400" : variant === "success" ? "bg-emerald-400" : variant === "destructive" ? "bg-rose-400" : "bg-sky-400")
          )}
        />
      )}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
export default Badge;
