/**
 * PC Builder Lab - Award-Winning Global Design Token System
 *
 * Aesthetic Architecture:
 * - Clean, unique, Awwwards / Pinterest-grade Cyber-Architectural Studio UI ("Dark Lab")
 * - Deep Obsidian Void Canvas (#090D16) with subtle cosmic blueprint telemetry
 * - Multi-layer Glassmorphic Surfaces with light-catching specular inner bevels
 * - Precision Electric Laser Cyan Primary (#0EA5E9) aligned with brand laser conduits (#00F5FF -> #0284C7 -> #6366F1)
 * - Hardware Gold / Silicon Amber (#F59E0B) for conductive pins, memory & warnings
 * - Quantum Cyber Violet (#8B5CF6) for GPU compute, expansion & high performance
 * - Telemetry Emerald (#10B981) for validated sockets & live power rails
 * - Micro-interaction tactile springs, diffuse ambient shadows & glowing laser rims
 */

export const themeTokens = {
  colors: {
    dark: {
      // Canvas & Surfaces (Obsidian Layering)
      background: '#090D16',       // Deep Obsidian Void Canvas
      backgroundSubtle: '#0B1120', // Substrate Layer (Carbon / Sub-Chamber)
      surface: '#111827',          // Crisp Primary Card Surface
      surfaceGlass: 'rgba(15, 23, 42, 0.75)',
      surfaceSubtle: '#0D1424',
      surfaceRaised: '#1E293B',    // Elevated Component Bed
      surfaceOverlay: 'rgba(9, 13, 22, 0.88)',

      // Inks & Typography (A11y calibrated, >7:1 contrast)
      foreground: '#F8FAFC',       // Crisp High-Contrast Luminous White
      foregroundMuted: '#94A3B8',  // Slate Secondary (6.5:1 contrast)
      foregroundSubtle: '#64748B', // Tertiary Telemetry / Details
      foregroundInverse: '#090D16',// Inverse text on bright buttons

      // Borders & Dividers
      border: '#1E293B',           // Soft Hairline Perimeter
      borderSubtle: '#172033',     // Subtle Internal Divider
      borderStrong: '#334155',     // Structural Edge
      borderGlow: 'rgba(14, 165, 233, 0.35)', // Laser Accent Edge

      // Primary Signature Accent: Electric Cyan-Cobalt (Brand Laser Conduit)
      primary: '#0EA5E9',
      primaryHover: '#38BDF8',
      primaryActive: '#0284C7',
      primaryLight: '#082F49',
      primaryBorder: '#0369A1',
      primaryGlow: 'rgba(14, 165, 233, 0.4)',
      primaryForeground: '#FFFFFF',
      laserCyan: '#00F5FF',        // High-frequency brand laser cyan

      // Hardware Amber / Silicon Gold Accent
      accentWarm: '#F59E0B',
      accentWarmHover: '#FBBF24',
      accentWarmLight: '#451A03',
      accentWarmBorder: '#92400E',
      accentWarmGlow: 'rgba(245, 158, 11, 0.35)',
      accentWarmForeground: '#FEF3C7',

      // Quantum Cyber Violet Accent
      accentViolet: '#8B5CF6',
      accentVioletHover: '#A78BFA',
      accentVioletLight: '#2E1065',
      accentVioletBorder: '#5B21B6',
      accentVioletGlow: 'rgba(139, 92, 246, 0.35)',
      accentVioletForeground: '#EDE9FE',

      // Telemetry Signals
      success: '#10B981', // Socket Verified / Correct Connection
      successHover: '#34D399',
      successLight: '#064E3B',
      successBorder: '#047857',
      successGlow: 'rgba(16, 185, 129, 0.35)',
      successForeground: '#D1FAE5',

      warning: '#F59E0B', // Compatibility Advisory
      warningLight: '#451A03',
      warningBorder: '#B45309',
      warningForeground: '#FEF3C7',

      danger: '#EF4444',  // Socket Incompatible / Electrical Short
      dangerHover: '#F87171',
      dangerLight: '#450A0A',
      dangerBorder: '#B91C1C',
      dangerGlow: 'rgba(239, 68, 68, 0.35)',
      dangerForeground: '#FEE2E2',

      // Hardware Category Component Codes
      hardware: {
        case: '#64748B',
        motherboard: '#0EA5E9',
        cpu: '#F59E0B',
        cooler: '#94A3B8',
        ram: '#10B981',
        ssd: '#38BDF8',
        gpu: '#8B5CF6',
        psu: '#475569',
        cable: '#EC4899',
      },
    },

    light: {
      background: '#F8FAFC',
      backgroundSubtle: '#F1F5F9',
      surface: '#FFFFFF',
      surfaceGlass: 'rgba(255, 255, 255, 0.85)',
      surfaceSubtle: '#F8FAFC',
      surfaceRaised: '#FFFFFF',
      surfaceOverlay: 'rgba(255, 255, 255, 0.95)',
      
      foreground: '#0F172A',
      foregroundMuted: '#64748B',
      foregroundSubtle: '#94A3B8',
      foregroundInverse: '#FFFFFF',
      
      border: '#E2E8F0',
      borderSubtle: '#F1F5F9',
      borderStrong: '#CBD5E1',
      borderGlow: 'rgba(2, 132, 199, 0.25)',
      
      primary: '#0284C7',
      primaryHover: '#0369A1',
      primaryActive: '#075985',
      primaryLight: '#E0F2FE',
      primaryBorder: '#BAE6FD',
      primaryGlow: 'rgba(2, 132, 199, 0.25)',
      primaryForeground: '#FFFFFF',
      laserCyan: '#0284C7',
      
      accentWarm: '#D97706',
      accentWarmHover: '#B45309',
      accentWarmLight: '#FEF3C7',
      accentWarmBorder: '#FDE68A',
      accentWarmGlow: 'rgba(217, 119, 6, 0.25)',
      accentWarmForeground: '#78350F',

      accentViolet: '#7C3AED',
      accentVioletHover: '#6D28D9',
      accentVioletLight: '#F3E8FF',
      accentVioletBorder: '#DDD6FE',
      accentVioletGlow: 'rgba(124, 58, 237, 0.25)',
      accentVioletForeground: '#4C1D95',

      success: '#059669',
      successHover: '#047857',
      successLight: '#ECFDF5',
      successBorder: '#A7F3D0',
      successGlow: 'rgba(5, 150, 105, 0.25)',
      successForeground: '#065F46',

      warning: '#D97706',
      warningLight: '#FFFBEB',
      warningBorder: '#FDE68A',
      warningForeground: '#92400E',

      danger: '#DC2626',
      dangerHover: '#B91C1C',
      dangerLight: '#FEF2F2',
      dangerBorder: '#FECACA',
      dangerGlow: 'rgba(220, 38, 38, 0.25)',
      dangerForeground: '#991B1B',

      hardware: {
        case: '#475569',
        motherboard: '#0284C7',
        cpu: '#D97706',
        cooler: '#64748B',
        ram: '#059669',
        ssd: '#0284C7',
        gpu: '#7C3AED',
        psu: '#334155',
        cable: '#DB2777',
      },
    },
  },

  typography: {
    fontDisplay: "'Space Grotesk', 'Inter', system-ui, -apple-system, sans-serif",
    fontBody: "'Inter', system-ui, -apple-system, sans-serif",
    fontMono: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace",
    scale: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
    },
    weight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    lineHeight: {
      none: '1',
      tight: '1.15',
      snug: '1.3',
      normal: '1.5',
      relaxed: '1.65',
    },
    tracking: {
      tighter: '-0.04em',
      tight: '-0.025em',
      normal: '-0.011em',
      wide: '0.05em',
      widest: '0.12em',
    },
  },

  spacing: {
    0: '0px',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
  },

  radii: {
    none: '0px',
    xs: '0.375rem',  // 6px
    sm: '0.5rem',    // 8px
    md: '0.75rem',   // 12px
    lg: '1rem',      // 16px
    xl: '1.25rem',   // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '2rem',   // 32px
    pill: '9999px',
  },

  shadows: {
    flat: 'none',
    xs: '0 1px 2px rgba(0, 0, 0, 0.4)',
    sm: '0 2px 8px rgba(0, 0, 0, 0.45), 0 1px 3px rgba(0, 0, 0, 0.35)',
    md: '0 4px 16px rgba(0, 0, 0, 0.55), 0 12px 28px -4px rgba(0, 0, 0, 0.45)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.65), 0 24px 64px -8px rgba(0, 0, 0, 0.55)',
    xl: '0 16px 48px rgba(0, 0, 0, 0.75), 0 32px 80px -12px rgba(0, 0, 0, 0.65)',
    innerBevel: 'inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 1px 3px rgba(0, 0, 0, 0.4)',
    innerBevelLight: 'inset 0 1px 0 rgba(255, 255, 255, 0.8), 0 1px 2px rgba(0, 0, 0, 0.05)',
    glowCyan: '0 0 28px rgba(14, 165, 233, 0.35)',
    glowLaser: '0 0 32px rgba(0, 245, 255, 0.4)',
    glowViolet: '0 0 28px rgba(139, 92, 246, 0.35)',
    glowGold: '0 0 28px rgba(245, 158, 11, 0.35)',
    glowEmerald: '0 0 28px rgba(16, 185, 129, 0.35)',
    glowDanger: '0 0 28px rgba(239, 68, 68, 0.35)',
  },

  glassmorphism: {
    panel: {
      background: 'rgba(17, 24, 39, 0.75)',
      backdropBlur: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 12px 32px -4px rgba(0, 0, 0, 0.5)',
    },
    surface: {
      background: 'rgba(15, 23, 42, 0.72)',
      backdropBlur: 'blur(14px)',
      border: '1px solid rgba(30, 41, 59, 0.8)',
      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 8px 24px -2px rgba(0, 0, 0, 0.45)',
    },
    dock: {
      background: 'rgba(9, 13, 22, 0.88)',
      backdropBlur: 'blur(20px)',
      border: '1px solid rgba(56, 189, 248, 0.2)',
      boxShadow: '0 0 24px rgba(14, 165, 233, 0.15), 0 20px 40px -8px rgba(0, 0, 0, 0.7)',
    },
    popover: {
      background: 'rgba(17, 24, 39, 0.94)',
      backdropBlur: 'blur(18px)',
      border: '1px solid rgba(51, 65, 85, 0.9)',
      boxShadow: '0 12px 36px -4px rgba(0, 0, 0, 0.7)',
    },
  },

  gradients: {
    primaryLaser: 'linear-gradient(135deg, #00F5FF 0%, #0EA5E9 45%, #6366F1 100%)',
    cyanViolet: 'linear-gradient(135deg, #38BDF8 0%, #818CF8 50%, #C084FC 100%)',
    quantumViolet: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #D946EF 100%)',
    siliconAmber: 'linear-gradient(135deg, #FEF08A 0%, #F59E0B 50%, #EA580C 100%)',
    cyberEmerald: 'linear-gradient(135deg, #6EE7B7 0%, #10B981 50%, #059669 100%)',
    darkSubstrate: 'linear-gradient(180deg, #111827 0%, #090D16 100%)',
    cardBevel: 'linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0) 100%)',
    holographic: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(139, 92, 246, 0.15) 50%, rgba(245, 158, 11, 0.15) 100%)',
  },

  motion: {
    durations: {
      instant: '80ms',
      fast: '140ms',
      normal: '220ms',
      slow: '380ms',
    },
    easings: {
      outExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    transitions: {
      fast: '140ms cubic-bezier(0.16, 1, 0.3, 1)',
      normal: '220ms cubic-bezier(0.16, 1, 0.3, 1)',
      spring: '180ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      color: 'background-color 200ms ease, border-color 200ms ease, color 200ms ease',
      tactile: 'transform 160ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 160ms cubic-bezier(0.16, 1, 0.3, 1)',
    },
  },
} as const;

export type ThemeTokens = typeof themeTokens;

/**
 * Returns color code for specific PC hardware components.
 */
export function getHardwareColor(category: string, mode: 'dark' | 'light' = 'dark'): string {
  const table = themeTokens.colors[mode].hardware;
  return (table as Record<string, string>)[category.toLowerCase()] ?? themeTokens.colors[mode].primary;
}

/**
 * Returns pre-composed glow shadow string.
 */
export function getGlowShadow(
  variant: 'cyan' | 'violet' | 'amber' | 'emerald' | 'danger' = 'cyan'
): string {
  switch (variant) {
    case 'cyan':
      return themeTokens.shadows.glowCyan;
    case 'violet':
      return themeTokens.shadows.glowViolet;
    case 'amber':
      return themeTokens.shadows.glowGold;
    case 'emerald':
      return themeTokens.shadows.glowEmerald;
    case 'danger':
      return themeTokens.shadows.glowDanger;
  }
}

/**
 * Returns standard glassmorphism surface inline CSS properties.
 */
export function getGlassStyle(variant: keyof typeof themeTokens.glassmorphism = 'surface'): React.CSSProperties {
  const g = themeTokens.glassmorphism[variant];
  return {
    background: g.background,
    backdropFilter: g.backdropBlur,
    WebkitBackdropFilter: g.backdropBlur,
    border: g.border,
    boxShadow: g.boxShadow,
  };
}

/**
 * Motion utilities: computes staggered reveal delays and transition CSS.
 */
export function getStaggerDelay(index: number, baseMs: number = 40, staggerMs: number = 60): string {
  return `${baseMs + index * staggerMs}ms`;
}

/**
 * Returns tactile spring CSS style object for interactive cards and buttons.
 */
export function getTactileSpringStyle(): React.CSSProperties {
  return {
    transition: themeTokens.motion.transitions.tactile,
  };
}

export default themeTokens;
