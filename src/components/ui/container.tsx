import * as React from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg" | "xl" | "full";
  withAmbientGlow?: boolean;
  withGrid?: boolean;
}

const sizeClasses = {
  sm: "max-w-3xl",
  default: "max-w-5xl",
  lg: "max-w-7xl",
  xl: "max-w-[1400px]",
  full: "max-w-full",
};

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      className,
      size = "lg",
      withAmbientGlow = false,
      withGrid = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative mx-auto w-full px-4 sm:px-6 lg:px-8",
          sizeClasses[size],
          withGrid && "bg-blueprint-dots",
          className
        )}
        {...props}
      >
        {withAmbientGlow && (
          <div
            className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-3/4 h-[350px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(14,165,233,0.12),transparent_70%)] blur-2xl"
            aria-hidden="true"
          />
        )}
        {children}
      </div>
    );
  }
);
Container.displayName = "Container";

export default Container;
