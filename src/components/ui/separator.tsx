import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

export interface SeparatorProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  variant?: "default" | "gradient" | "laser" | "subtle";
}

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(
  (
    { className, orientation = "horizontal", decorative = true, variant = "default", ...props },
    ref
  ) => {
    const variantStyles = {
      default: "bg-border/80",
      gradient:
        orientation === "horizontal"
          ? "bg-gradient-to-r from-transparent via-border to-transparent"
          : "bg-gradient-to-b from-transparent via-border to-transparent",
      laser:
        orientation === "horizontal"
          ? "bg-gradient-to-r from-transparent via-primary/60 to-transparent shadow-[0_0_8px_rgba(14,165,233,0.35)]"
          : "bg-gradient-to-b from-transparent via-primary/60 to-transparent shadow-[0_0_8px_rgba(14,165,233,0.35)]",
      subtle: "bg-border/40",
    };

    return (
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={cn(
          "shrink-0",
          variantStyles[variant],
          orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
          className
        )}
        {...props}
      />
    );
  }
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator }
