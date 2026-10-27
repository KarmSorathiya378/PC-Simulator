import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold tracking-tight transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.975] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 hover:shadow-sm active:bg-primary/95",
        warm:
          "bg-accent-warm text-white shadow-xs hover:bg-accent-warm/90 active:bg-accent-warm/95",
        destructive:
          "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90 active:bg-destructive/95",
        outline:
          "border border-border bg-card/90 text-foreground shadow-xs hover:bg-secondary hover:border-border-strong active:bg-secondary/80",
        secondary:
          "border border-border/70 bg-secondary text-secondary-foreground shadow-2xs hover:bg-secondary/80 active:bg-secondary/90",
        ghost:
          "text-foreground hover:bg-secondary/80 hover:text-foreground active:bg-secondary",
        link:
          "text-primary underline-offset-4 hover:underline active:scale-100",
        glass:
          "glass-surface border border-border/80 text-foreground shadow-xs hover:bg-card active:scale-[0.975]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8.5 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-6 text-base",
        icon: "h-10 w-10",
        iconSm: "h-8.5 w-8.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
