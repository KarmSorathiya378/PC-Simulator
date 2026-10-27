import * as React from "react";
import { cn } from "@/lib/utils";
import { themeTokens } from "@/styles/theme";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "interactive" | "glass" | "outline" | "glow" | "cyber";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", style, ...props }, ref) => {
    const variantStyles = {
      default:
        "border border-border/80 bg-card text-card-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_16px_rgba(0,0,0,0.35)] backdrop-blur-xs",
      elevated:
        "card-elevated border border-border/75 bg-card/95 text-card-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_28px_-6px_rgba(0,0,0,0.55)] backdrop-blur-md",
      interactive:
        "card-elevated border border-border/80 bg-card/95 text-card-foreground hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_16px_36px_-6px_rgba(14,165,233,0.22),inset_0_1px_0_rgba(255,255,255,0.12)] cursor-pointer active:translate-y-0 active:scale-[0.99] transition-all duration-200 backdrop-blur-md",
      glass:
        "glass-surface border border-white/10 text-card-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_12px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl",
      glow:
        "border border-sky-500/35 bg-card/90 text-card-foreground shadow-[0_0_32px_rgba(14,165,233,0.2),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl",
      cyber:
        "border border-purple-500/35 bg-card/90 text-card-foreground shadow-[0_0_32px_rgba(139,92,246,0.2),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl",
      outline:
        "border border-dashed border-border-strong bg-transparent text-card-foreground",
    };

    return (
      <div
        ref={ref}
        style={{
          borderRadius: themeTokens.radii.xl,
          ...style,
        }}
        className={cn(
          "transition-all duration-200",
          variantStyles[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    style={{
      fontFamily: themeTokens.typography.fontDisplay,
      ...style,
    }}
    className={cn(
      "text-xl font-bold tracking-tight text-foreground leading-snug font-display",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground leading-relaxed", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
