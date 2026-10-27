/**
 * PC Builder Lab Brand Design Tokens & Palette Primitives.
 * Cyber-architectural color system engineered for high-contrast technical software.
 */
export const BRAND_COLORS = {
  // Primary Laser Conduits (Cyan to Indigo)
  laserCyan: '#00F5FF',
  laserSky: '#0284C7',
  laserIndigo: '#6366F1',

  // Core Processing Glow (Violet to Neon Fuchsia)
  coreIndigo: '#4F46E5',
  coreViolet: '#8B5CF6',
  coreFuchsia: '#EC4899',

  // Hardware Substrate & Chassis
  chassisSteel: '#1E293B',
  chassisCarbon: '#111827',
  chassisVoid: '#070A10',

  // Golden Alignment Indicators (Socket Keying & Standoffs)
  goldPinLight: '#FEF08A',
  goldPinBase: '#FACC15',
  goldPinDark: '#D97706',

  // Telemetry Semantics
  statusLive: '#10B981',
  statusWarning: '#F59E0B',
  statusAlert: '#EF4444',
  statusInfo: '#38BDF8',
} as const;

export type BrandColorKey = keyof typeof BRAND_COLORS;

/**
 * Standard CSS gradient strings for brand accents and typography.
 */
export const BRAND_GRADIENTS = {
  primaryLaser: 'linear-gradient(135deg, #00F5FF 0%, #0284C7 45%, #6366F1 100%)',
  quantumCore: 'linear-gradient(135deg, #4F46E5 0%, #8B5CF6 55%, #EC4899 100%)',
  goldAccent: 'linear-gradient(135deg, #FEF08A 0%, #FACC15 50%, #D97706 100%)',
  chassisMetal: 'linear-gradient(180deg, #1E293B 0%, #111827 50%, #070A10 100%)',
} as const;
