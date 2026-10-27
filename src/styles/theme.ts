/**
 * PC Builder Lab - Unified Design Token System (Single Source of Truth)
 * 
 * Aesthetic Story:
 * Architectural Studio / Engineering Journal
 * - Grounded warm ivory / parchment paper canvas (#FBF9F5)
 * - Deep drafting ink typography (#191614) with warm sepia secondary tones
 * - Signature Electric Indigo/Cobalt primary accent (#2A4FD7)
 * - Silicon Copper / Burnished Amber complementary accent (#D97706)
 * - Calming Sage / Mint for verified connections and successes (#059669)
 * - Soft diffuse multi-layer ambient shadows, refined radii, and physical micro-interactions
 */

export const themeTokens = {
  colors: {
    light: {
      // Backgrounds & Canvas
      background: '#FBF9F5', // warm drafting paper
      backgroundSubtle: '#F4EFE6', // subtle warm parchment tint
      surface: '#FFFFFF', // crisp elevated card surface
      surfaceGlass: 'rgba(255, 255, 255, 0.82)',
      surfaceSubtle: '#F7F4EE',
      surfaceRaised: '#FFFFFF',
      
      // Inks & Typography
      foreground: '#181614', // obsidian drafting ink (15:1 contrast)
      foregroundMuted: '#575147', // warm graphite secondary (>5.5:1 contrast)
      foregroundSubtle: '#8C8274', // tertiary detail ink
      
      // Borders & Dividers
      border: '#E8E1D3', // soft architectural hairline
      borderSubtle: '#F0ECE1',
      borderStrong: '#D2C7B4',
      
      // Primary Signature Accent (Electric Cobalt / Precision Indigo)
      primary: '#2552E0',
      primaryHover: '#1B42C4',
      primaryActive: '#1535A3',
      primaryLight: '#EEF3FF',
      primaryBorder: '#C7D8FC',
      primaryForeground: '#FFFFFF',
      
      // Complementary Warm Accent (Silicon Copper / Hardware Amber)
      accentWarm: '#D97706',
      accentWarmHover: '#B45309',
      accentWarmLight: '#FEF3C7',
      accentWarmBorder: '#FDE68A',
      accentWarmForeground: '#78350F',

      // Semantic Signals
      success: '#059669', // Verified socket / connected cable
      successLight: '#ECFDF5',
      successBorder: '#A7F3D0',
      successForeground: '#065F46',

      warning: '#D97706',
      warningLight: '#FFFBEB',
      warningBorder: '#FDE68A',
      warningForeground: '#92400E',

      danger: '#DC2626', // Incompatibility / collision
      dangerLight: '#FEF2F2',
      dangerBorder: '#FECACA',
      dangerForeground: '#991B1B',

      // Component Hardware Color Accents (consistent visual coding)
      hardware: {
        case: '#475569',
        motherboard: '#0F766E',
        cpu: '#D97706',
        cooler: '#64748B',
        ram: '#059669',
        ssd: '#2563EB',
        gpu: '#7C3AED',
        psu: '#334155',
      },
    },
    dark: {
      background: '#0F1218',
      backgroundSubtle: '#151A22',
      surface: '#1A212D',
      surfaceGlass: 'rgba(26, 33, 45, 0.85)',
      surfaceSubtle: '#141A23',
      surfaceRaised: '#222B3A',
      
      foreground: '#F6F5F2',
      foregroundMuted: '#9E998E',
      foregroundSubtle: '#6A655C',

      border: '#2A3343',
      borderSubtle: '#1F2734',
      borderStrong: '#3A465B',

      primary: '#436BEE',
      primaryHover: '#5B7FF5',
      primaryActive: '#3358DA',
      primaryLight: '#182447',
      primaryBorder: '#293C75',
      primaryForeground: '#FFFFFF',

      accentWarm: '#F59E0B',
      accentWarmHover: '#FBBF24',
      accentWarmLight: '#32230B',
      accentWarmBorder: '#5C3E0E',
      accentWarmForeground: '#FDE68A',

      success: '#10B981',
      successLight: '#0E2A1F',
      successBorder: '#1A4D39',
      successForeground: '#6EE7B7',

      warning: '#F59E0B',
      warningLight: '#2B200A',
      warningBorder: '#553C0F',
      warningForeground: '#FDE68A',

      danger: '#EF4444',
      dangerLight: '#2D1414',
      dangerBorder: '#522020',
      dangerForeground: '#FCA5A5',

      hardware: {
        case: '#64748B',
        motherboard: '#14B8A6',
        cpu: '#F59E0B',
        cooler: '#94A3B8',
        ram: '#10B981',
        ssd: '#3B82F6',
        gpu: '#A78BFA',
        psu: '#475569',
      },
    },
  },
  typography: {
    fontDisplay: "var(--font-display, 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif)",
    fontBody: "var(--font-sans, 'Inter', system-ui, -apple-system, sans-serif)",
    fontMono: "var(--font-mono, 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace)",
  },
  radii: {
    xs: '0.375rem',  // 6px
    sm: '0.5rem',    // 8px
    md: '0.75rem',   // 12px
    lg: '1rem',      // 16px
    xl: '1.25rem',   // 20px
    pill: '9999px',
  },
  shadows: {
    // Diffuse architectural light shadows
    flat: 'none',
    xs: '0 1px 2px rgba(28, 22, 14, 0.04)',
    sm: '0 1px 3px rgba(28, 22, 14, 0.05), 0 4px 8px -2px rgba(28, 22, 14, 0.04)',
    md: '0 2px 6px rgba(28, 22, 14, 0.06), 0 10px 20px -3px rgba(28, 22, 14, 0.08)',
    lg: '0 4px 12px rgba(28, 22, 14, 0.08), 0 18px 36px -6px rgba(28, 22, 14, 0.10)',
    innerGlow: 'inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 1px 2px rgba(28, 22, 14, 0.04)',
    primaryGlow: '0 4px 14px -2px rgba(37, 82, 224, 0.35)',
    warmGlow: '0 4px 14px -2px rgba(217, 119, 6, 0.35)',
  },
  transitions: {
    fast: '140ms cubic-bezier(0.16, 1, 0.3, 1)',
    normal: '220ms cubic-bezier(0.16, 1, 0.3, 1)',
    spring: '180ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const;

export type ThemeTokens = typeof themeTokens;
