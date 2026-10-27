import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { themeTokens } from "@/styles/theme";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold tracking-tight transition-all duration-180 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.975] cursor-pointer [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs shadow-primary/20 hover:bg-primary/90 hover:shadow-[0_4px_20px_rgba(14,165,233,0.35)] active:bg-primary/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]",
        glow:
          "border border-sky-400/50 bg-primary text-white shadow-[0_0_24px_rgba(14,165,233,0.45)] hover:shadow-[0_0_32px_rgba(14,165,233,0.65)] hover:brightness-110 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]",
        cyber:
          "border border-purple-500/50 bg-accent-violet text-white shadow-[0_0_24px_rgba(139,92,246,0.4)] hover:shadow-[0_0_32px_rgba(139,92,246,0.6)] hover:brightness-110 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]",
        gradient:
          "bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 text-white shadow-[0_4px_20px_rgba(14,165,233,0.35)] hover:shadow-[0_4px_28px_rgba(14,165,233,0.55)] hover:brightness-110 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]",
        warm:
          "bg-accent-warm text-white shadow-xs hover:bg-accent-warm/90 hover:shadow-[0_4px_16px_rgba(245,158,11,0.35)] active:bg-accent-warm/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90 hover:shadow-[0_4px_16px_rgba(239,68,68,0.35)] active:bg-destructive/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]",
        outline:
          "border border-border/80 bg-card/80 backdrop-blur-md text-foreground shadow-xs hover:bg-secondary hover:border-primary/50 hover:text-primary active:bg-secondary/80",
        secondary:
          "border border-border/70 bg-secondary/80 backdrop-blur-sm text-secondary-foreground shadow-2xs hover:bg-secondary hover:text-foreground active:bg-secondary/90",
        ghost:
          "text-foreground hover:bg-secondary/80 hover:text-foreground active:bg-secondary",
        link:
          "text-primary underline-offset-4 hover:underline active:scale-100",
        glass:
          "glass-surface border border-white/10 text-foreground shadow-xs hover:bg-card/90 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(14,165,233,0.15)] active:scale-[0.975]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8.5 px-3 text-xs",
        lg: "h-11 px-6 text-base font-bold",
        icon: "h-10 w-10",
        iconSm: "h-8.5 w-8.5",
      },
      radius: {
        default: "rounded-lg",
        sm: "rounded-md",
        xl: "rounded-xl",
        pill: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      radius: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, radius, asChild = false, style, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        style={{
          fontFamily: themeTokens.typography.fontBody,
          ...style,
        }}
        className={cn(buttonVariants({ variant, size, radius, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
export default Button;
