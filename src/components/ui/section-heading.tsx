import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface SectionHeadingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  badge?: string;
  badgeVariant?: "default" | "secondary" | "warm" | "success" | "outline" | "mint" | "violet";
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  action?: React.ReactNode;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  badgeVariant = "secondary",
  eyebrow,
  title,
  description,
  align = "left",
  action,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start text-left",
        action && "sm:flex-row sm:items-end sm:justify-between",
        className
      )}
      {...props}
    >
      <div className={cn("flex flex-col gap-2 max-w-2xl", align === "center" && "items-center")}>
        {badge && (
          <Badge variant={badgeVariant} className="px-2.5 py-0.5 text-xs font-semibold tracking-wider font-mono uppercase shadow-xs">
            {badge}
          </Badge>
        )}
        {eyebrow && !badge && (
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
            {eyebrow}
          </span>
        )}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground font-display leading-[1.12]">
          {title}
        </h2>
        {description && (
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-sans max-w-xl">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0 pt-2 sm:pt-0">{action}</div>}
    </div>
  );
};
