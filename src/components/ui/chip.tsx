import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const chipVariants = cva(
  "inline-flex items-center gap-1.5 rounded-lg border font-mono text-xs font-medium tracking-tight transition-all duration-180 select-none shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
  {
    variants: {
      variant: {
        default:
          "border-border/80 bg-card/90 text-foreground shadow-2xs backdrop-blur-xs",
        subtle:
          "border-border/60 bg-secondary/80 text-foregroundMuted backdrop-blur-xs",
        primary:
          "border-primary/40 bg-primary/10 text-primary font-semibold shadow-xs shadow-primary/20",
        warm:
          "border-amber-500/40 bg-amber-950/40 text-amber-300 font-semibold shadow-xs shadow-amber-500/20",
        mint:
          "border-emerald-500/40 bg-emerald-950/40 text-emerald-300 font-semibold shadow-xs shadow-emerald-500/20",
        interactive:
          "border-border/90 bg-card/90 text-foreground hover:border-primary/60 hover:bg-secondary/70 hover:shadow-xs cursor-pointer active:scale-[0.97] transition-transform",
      },
      size: {
        default: "px-2.5 py-1 text-xs",
        sm: "px-2 py-0.5 text-[11px]",
        lg: "px-3 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chipVariants> {
  icon?: React.ReactNode;
  active?: boolean;
}

export const Chip: React.FC<ChipProps> = ({
  className,
  variant,
  size,
  icon,
  active,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        chipVariants({ variant, size }),
        active && "border-primary bg-primary text-primary-foreground shadow-xs",
        className
      )}
      {...props}
    >
      {icon && <span className="size-3.5 shrink-0 [&>svg]:size-3.5 flex items-center justify-center">{icon}</span>}
      <span>{children}</span>
    </div>
  );
};
