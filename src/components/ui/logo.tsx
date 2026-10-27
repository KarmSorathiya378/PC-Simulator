import * as React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface LogoProps {
  className?: string;
  size?: "sm" | "default" | "lg";
  withLink?: boolean;
  withTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className,
  size = "default",
  withLink = true,
  withTagline = false,
}) => {
  const sizeMap = {
    sm: {
      mark: "size-7.5 rounded-lg",
      iconSize: 16,
      title: "text-sm font-bold",
      badge: "text-[9px] px-1.5 py-0.2",
      tagline: "text-[10px]",
    },
    default: {
      mark: "size-9 rounded-xl",
      iconSize: 20,
      title: "text-base font-bold",
      badge: "text-[10px] px-2 py-0.5",
      tagline: "text-[11px]",
    },
    lg: {
      mark: "size-12 rounded-2xl",
      iconSize: 26,
      title: "text-xl font-extrabold",
      badge: "text-xs px-2.5 py-0.5",
      tagline: "text-xs",
    },
  };

  const currentSize = sizeMap[size];

  const content = (
    <div className={cn("group inline-flex items-center gap-3 select-none", className)}>
      {/* Precision Silicon Mark */}
      <div
        className={cn(
          "relative flex items-center justify-center bg-gradient-to-br from-primary to-blue-700 text-white shadow-xs shadow-primary/30 transition-transform duration-200 group-hover:scale-105 border border-white/20",
          currentSize.mark
        )}
      >
        {/* Silicon chip geometry SVG */}
        <svg
          width={currentSize.iconSize}
          height={currentSize.iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white"
        >
          <rect width="16" height="16" x="4" y="4" rx="3" />
          <rect width="6" height="6" x="9" y="9" rx="1" fill="currentColor" fillOpacity="0.25" />
          <path d="M9 1v3" />
          <path d="M15 1v3" />
          <path d="M9 20v3" />
          <path d="M15 20v3" />
          <path d="M20 9h3" />
          <path d="M20 14h3" />
          <path d="M1 9h3" />
          <path d="M1 14h3" />
        </svg>

        {/* Golden pin 1 indicator dot */}
        <span className="absolute top-1 left-1 size-1 rounded-full bg-amber-300 shadow-2xs" />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "tracking-tight text-foreground font-display transition-colors group-hover:text-primary",
              currentSize.title
            )}
          >
            PC Builder <span className="text-primary font-black">Lab</span>
          </span>
          <span
            className={cn(
              "hidden sm:inline-flex rounded-full border border-border/80 bg-secondary/80 font-mono text-muted-foreground uppercase tracking-wider font-semibold",
              currentSize.badge
            )}
          >
            v2.0
          </span>
        </div>
        {withTagline && (
          <span className={cn("text-muted-foreground font-medium", currentSize.tagline)}>
            Virtual Computer Hardware Simulator
          </span>
        )}
      </div>
    </div>
  );

  if (withLink) {
    return (
      <Link to="/" className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
};
