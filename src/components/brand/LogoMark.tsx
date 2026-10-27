import * as React from 'react';
import { cn } from '@/lib/utils';
import { BRAND_COLORS } from './brandColors';

export type LogoMarkTheme = 'dark' | 'light' | 'auto' | 'mono';

export interface LogoMarkProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
  withGlow?: boolean;
  theme?: LogoMarkTheme;
  mono?: boolean;
}

/**
 * Award-grade Geometric Silicon Hex & Modular PC Chassis Logo Mark.
 * Designed to scale seamlessly from 16px micro-icon to 256px hero display:
 * - Hexagonal PCB silicon shield perimeter with cyan-to-indigo laser gradient.
 * - Solder vias, capacitor SMDs, and high-speed circuit trace conduits.
 * - AM5/LGA gold pin 1 alignment marker.
 * - Central Isometric PC Chassis:
 *   - Top Face: Radiator fan exhaust with dual fan recesses.
 *   - Left Face: Tempered glass chamber with glowing ARGB cooler & GPU backplate line.
 *   - Right Face: Brushed titanium front bezel with cyber intake mesh and vertical laser lightbar.
 * - Full single-color monochrome mode (`mono={true}` or `theme="mono"`) using `currentColor`.
 */
export const LogoMark: React.FC<LogoMarkProps> = ({
  size = 36,
  className,
  withGlow = true,
  theme = 'auto',
  mono = false,
  ...props
}) => {
  const markId = React.useId().replace(/:/g, '');
  const numSize = typeof size === 'number' ? size : parseInt(size, 10) || 36;
  const isMicro = numSize <= 28;
  const isMono = mono || theme === 'mono';

  // Monochrome fallback styling
  if (isMono) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('shrink-0 select-none transition-transform duration-200', className)}
        aria-label="PC Builder Lab Logo Mark"
        role="img"
        {...props}
      >
        {/* Outer Hexagonal Silicon Shield */}
        <polygon
          points="60,6 108,33 108,87 60,114 12,87 12,33"
          stroke="currentColor"
          strokeWidth={isMicro ? 4.5 : 3.5}
          strokeLinejoin="round"
          fill="none"
        />

        {/* Pin 1 Keying Chevron */}
        <polygon points="26,22 35,22 26,31" fill="currentColor" />

        {/* Top Face: Chassis Exhaust */}
        <polygon
          points="60,28 86,43 60,58 34,43"
          fill="currentColor"
          fillOpacity="0.18"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* Left Face: Tempered Glass Chamber */}
        <polygon
          points="34,43 60,58 60,92 34,77"
          fill="currentColor"
          fillOpacity="0.08"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        {/* Cooler Pump Ring */}
        <circle cx="47" cy="58" r="5" stroke="currentColor" strokeWidth="1.4" fill="none" />
        <circle cx="47" cy="58" r="2" fill="currentColor" />
        {/* GPU Trace Line */}
        <line x1="38" y1="69" x2="56" y2="78" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />

        {/* Right Face: Front Bezel */}
        <polygon
          points="60,58 86,43 86,77 60,92"
          fill="currentColor"
          fillOpacity="0.28"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        {/* Front Bezel Vertical Lightbar */}
        <line x1="73" y1="51" x2="73" y2="84" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="73" cy="53" r="1.6" fill="currentColor" />

        {/* High-detail mono conduits */}
        {!isMicro && (
          <>
            <path d="M60,14 L60,28" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M60,92 L60,106" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="60" cy="18" r="2" fill="currentColor" />
            <circle cx="60" cy="102" r="2" fill="currentColor" />
          </>
        )}
      </svg>
    );
  }

  // Full Rich Color Rendering
  const isLight = theme === 'light';
  const shieldFill = isLight ? '#F1F5F9' : BRAND_COLORS.chassisVoid;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        'shrink-0 drop-shadow-[0_2px_16px_rgba(0,245,255,0.32)] transition-all duration-300 select-none',
        className
      )}
      aria-label="PC Builder Lab Logo Mark"
      role="img"
      {...props}
    >
      <defs>
        {/* Primary Laser Cyan-Sky-Indigo Conduit Gradient */}
        <linearGradient id={`mark-laser-${markId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={BRAND_COLORS.laserCyan} />
          <stop offset="48%" stopColor={BRAND_COLORS.laserSky} />
          <stop offset="100%" stopColor={BRAND_COLORS.laserIndigo} />
        </linearGradient>

        {/* Quantum Core Luminescence Gradient */}
        <linearGradient id={`mark-core-${markId}`} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={BRAND_COLORS.coreIndigo} />
          <stop offset="55%" stopColor={BRAND_COLORS.coreViolet} />
          <stop offset="100%" stopColor={BRAND_COLORS.coreFuchsia} />
        </linearGradient>

        {/* Gold Pin 1 Keying Gradient */}
        <linearGradient id={`mark-gold-${markId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={BRAND_COLORS.goldPinLight} />
          <stop offset="50%" stopColor={BRAND_COLORS.goldPinBase} />
          <stop offset="100%" stopColor={BRAND_COLORS.goldPinDark} />
        </linearGradient>

        {/* Chassis Metal Substrate Gradient */}
        <linearGradient id={`mark-metal-${markId}`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={isLight ? '#E2E8F0' : BRAND_COLORS.chassisSteel} />
          <stop offset="50%" stopColor={isLight ? '#CBD5E1' : BRAND_COLORS.chassisCarbon} />
          <stop offset="100%" stopColor={isLight ? '#94A3B8' : BRAND_COLORS.chassisVoid} />
        </linearGradient>

        {/* Ambient Bloom Filter */}
        {withGlow && !isMicro && (
          <filter id={`mark-bloom-${markId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        )}
      </defs>

      {/* 1. Outer Hexagonal Shield Foundation */}
      <polygon
        points="60,6 108,33 108,87 60,114 12,87 12,33"
        fill={theme === 'auto' ? `url(#mark-metal-${markId})` : shieldFill}
        stroke={`url(#mark-laser-${markId})`}
        strokeWidth={isMicro ? 4.5 : 3.2}
        strokeLinejoin="round"
      />

      {/* High-detail features rendered when size > 28px */}
      {!isMicro && (
        <>
          {/* 2. Concentric Circuit Ground Wireframe */}
          <polygon
            points="60,14 100,37 100,83 60,106 20,83 20,37"
            fill="none"
            stroke={isLight ? '#CBD5E1' : '#334155'}
            strokeWidth="1.2"
            strokeDasharray="4 3"
            opacity="0.65"
          />

          {/* 3. Surface Mount Capacitor Arrays (SMDs) */}
          <g fill={isLight ? '#94A3B8' : '#475569'} stroke="#64748B" strokeWidth="0.8">
            <rect x="23" y="55" width="3.5" height="10" rx="1" />
            <rect x="93.5" y="55" width="3.5" height="10" rx="1" />
          </g>

          {/* 4. High-Speed Motherboard PCB Trace Conduits */}
          <g
            stroke={`url(#mark-laser-${markId})`}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
          >
            <path d="M60,14 L60,28" />
            <path d="M60,92 L60,106" />
            <path d="M20,37 L34,43" />
            <path d="M20,83 L34,77" />
            <path d="M100,37 L86,43" />
            <path d="M100,83 L86,77" />
          </g>

          {/* 5. Terminal Solder Vias (Glow Nodes) */}
          <circle cx="60" cy="18" r="2.2" fill={BRAND_COLORS.laserCyan} />
          <circle cx="96" cy="39" r="2.2" fill={BRAND_COLORS.laserSky} />
          <circle cx="96" cy="81" r="2.2" fill={BRAND_COLORS.laserIndigo} />
          <circle cx="60" cy="102" r="2.2" fill={BRAND_COLORS.coreViolet} />
          <circle cx="24" cy="81" r="2.2" fill={BRAND_COLORS.coreFuchsia} />
          <circle cx="24" cy="39" r="2.2" fill={BRAND_COLORS.laserCyan} />
        </>
      )}

      {/* 6. Authentic Gold Pin 1 Socket Keying Indicator */}
      <polygon
        points="26,22 35,22 26,31"
        fill={`url(#mark-gold-${markId})`}
      />

      {/* 7. Central Isometric PC Chassis */}
      {/* Top Exhaust Panel */}
      <polygon
        points="60,28 86,43 60,58 34,43"
        fill={isLight ? '#E2E8F0' : '#1E293B'}
        stroke={`url(#mark-laser-${markId})`}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {!isMicro && (
        <>
          <ellipse cx="48" cy="43" rx="6" ry="3.2" fill={isLight ? '#CBD5E1' : '#0F172A'} stroke="#475569" strokeWidth="0.8" />
          <ellipse cx="72" cy="43" rx="6" ry="3.2" fill={isLight ? '#CBD5E1' : '#0F172A'} stroke="#475569" strokeWidth="0.8" />
        </>
      )}

      {/* Left Panel: Tempered Glass Chamber with Visible Internal Hardware */}
      <polygon
        points="34,43 60,58 60,92 34,77"
        fill={isLight ? '#F8FAFC' : '#0A0F1D'}
        fillOpacity={isLight ? '0.9' : '0.96'}
        stroke={`url(#mark-laser-${markId})`}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      {/* CPU Liquid Cooler Pump with Cyan Core Ring */}
      <g filter={withGlow && !isMicro ? `url(#mark-bloom-${markId})` : undefined}>
        <ellipse
          cx="47"
          cy="58"
          rx="6.5"
          ry="4"
          fill={`url(#mark-core-${markId})`}
          stroke="#FFFFFF"
          strokeWidth="0.8"
        />
        <ellipse
          cx="47"
          cy="58"
          rx="3.5"
          ry="2.2"
          fill={isLight ? '#0F172A' : '#090D16'}
          stroke={BRAND_COLORS.laserCyan}
          strokeWidth="1"
        />
      </g>

      {/* GPU Backplate Angle & ARGB Edge Bar */}
      <polygon
        points="38,68 56,77 56,79 38,70"
        fill="#1E293B"
        stroke="#334155"
        strokeWidth="0.8"
      />
      <line
        x1="38"
        y1="69"
        x2="56"
        y2="78"
        stroke={BRAND_COLORS.laserCyan}
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* Right Panel: Brushed Front Bezel & Cyber Intake Mesh */}
      <polygon
        points="60,58 86,43 86,77 60,92"
        fill={isLight ? '#CBD5E1' : '#111827'}
        stroke={`url(#mark-laser-${markId})`}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      {/* Front Bezel Vertical Laser Lightbar */}
      <line
        x1="73"
        y1="51"
        x2="73"
        y2="84"
        stroke={`url(#mark-laser-${markId})`}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="73" cy="53" r="1.6" fill={BRAND_COLORS.laserCyan} />

      {!isMicro && (
        <g stroke={isLight ? '#94A3B8' : '#334155'} strokeWidth="1.2" strokeLinecap="round">
          <line x1="77" y1="63" x2="82" y2="60.5" />
          <line x1="77" y1="70" x2="82" y2="67.5" />
          <line x1="77" y1="77" x2="82" y2="67.5" />
        </g>
      )}

      {/* Central Alignment Vertex Accent */}
      <circle cx="60" cy="58" r="1.8" fill="#FFFFFF" />
    </svg>
  );
};

export default LogoMark;
