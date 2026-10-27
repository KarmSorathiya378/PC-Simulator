import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const chipVariants = cva(
  "inline-flex items-center gap-1.5 rounded-lg border font-mono text-xs font-medium tracking-tight transition-all duration-150 select-none",
  {
    variants: {
      variant: {
        default:
          "border-border/80 bg-card text-foreground shadow-2xs",
        subtle:
          "border-border/60 bg-secondary/80 text-foregroundMuted",
        primary:
          "border-primary/30 bg-primary-light text-primary font-semibold dark:bg-primary-light/40 dark:text-primary-foreground",
        warm:
          "border-amber-300/80 bg-amber-50 text-amber-900 font-semibold dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
        mint:
          "border-emerald-300/80 bg-emerald-50 text-emerald-900 font-semibold dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
        interactive:
          "border-border/90 bg-card text-foreground hover:border-primary/60 hover:bg-secondary/70 hover:shadow-xs cursor-pointer active:scale-[0.97]",
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
