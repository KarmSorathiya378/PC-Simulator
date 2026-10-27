import * as React from "react";
import { cn } from "@/lib/utils";

export interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "warm" | "subtle" | "emerald";
  as?: React.ElementType;
}

export const GradientText: React.FC<GradientTextProps> = ({
  variant = "primary",
  as: Component = "span",
  className,
  children,
  ...props
}) => {
  const gradientStyles = {
    primary:
      "bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 dark:from-blue-400 dark:via-indigo-300 dark:to-blue-200",
    warm:
      "bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800 dark:from-amber-400 dark:via-orange-300 dark:to-amber-200",
    subtle:
      "bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-600 dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-400",
    emerald:
      "bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-800 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-200",
  };

  return (
    <Component
      className={cn(
        "bg-clip-text text-transparent font-bold tracking-tight inline-block",
        gradientStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
