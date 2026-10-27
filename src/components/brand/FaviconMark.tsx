import * as React from 'react';
import { cn } from '@/lib/utils';
import { BRAND_COLORS } from './brandColors';

export interface FaviconMarkProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

/**
 * Micro Favicon-Optimized SVG Mark for PC Builder Lab.
 * Specifically streamlined for ultra-low resolution rendering (16x16, 24x24, 32x32)
 * in browser tabs, taskbars, and micro status pills with zero line blurring.
 */
export const FaviconMark: React.FC<FaviconMarkProps> = ({
  size = 32,
  className,
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0 select-none', className)}
      aria-label="PC Builder Lab Micro Mark"
      {...props}
    >
      <defs>
        <linearGradient id="fav-micro-laser" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={BRAND_COLORS.laserCyan} />
          <stop offset="50%" stopColor={BRAND_COLORS.laserSky} />
          <stop offset="100%" stopColor={BRAND_COLORS.laserIndigo} />
        </linearGradient>

        <linearGradient id="fav-micro-core" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={BRAND_COLORS.coreIndigo} />
          <stop offset="60%" stopColor={BRAND_COLORS.coreViolet} />
          <stop offset="100%" stopColor={BRAND_COLORS.coreFuchsia} />
        </linearGradient>

        <linearGradient id="fav-micro-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={BRAND_COLORS.goldPinLight} />
          <stop offset="100%" stopColor={BRAND_COLORS.goldPinDark} />
        </linearGradient>
      </defs>

      {/* 1. Outer Hexagonal Shield Foundation */}
      <polygon
        points="16,2 29,9.5 29,22.5 16,30 3,22.5 3,9.5"
        fill={BRAND_COLORS.chassisVoid}
        stroke="url(#fav-micro-laser)"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* 2. Authentic Gold Pin 1 Keying Indicator */}
      <circle cx="7" cy="7.5" r="1.4" fill="url(#fav-micro-gold)" />

      {/* 3. Central Isometric PC Chassis */}
      {/* Top Face (Fan Exhaust) */}
      <polygon
        points="16,7.5 23.5,11.5 16,15.5 8.5,11.5"
        fill={BRAND_COLORS.chassisSteel}
        stroke="url(#fav-micro-laser)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* Left Face (Tempered Glass Side Panel) */}
      <polygon
        points="8.5,11.5 16,15.5 16,24.5 8.5,20.5"
        fill="#0A0F1D"
        stroke="url(#fav-micro-laser)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* Right Face (Front Chassis Bezel) */}
      <polygon
        points="16,15.5 23.5,11.5 23.5,20.5 16,24.5"
        fill={BRAND_COLORS.chassisCarbon}
        stroke="url(#fav-micro-laser)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* 4. Illuminated Hardware Accents */}
      {/* CPU Core Ring / ARGB Pump */}
      <circle cx="12.2" cy="17.2" r="1.8" fill="url(#fav-micro-core)" />
      <circle cx="12.2" cy="17.2" r="0.8" fill={BRAND_COLORS.laserCyan} />

      {/* Front Bezel Vertical Lightbar */}
      <line
        x1="19.8"
        y1="13.8"
        x2="19.8"
        y2="22.2"
        stroke={BRAND_COLORS.laserCyan}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default FaviconMark;