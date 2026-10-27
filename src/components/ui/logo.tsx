/**
 * Unified UI Logo primitive for PC Builder Lab.
 * Re-exports the bespoke brand Logo and LogoMark to maintain 100% backward compatibility
 * across all shared UI consumers and layout headers/footers.
 */

export { Logo, LogoMark, BRAND_TOKENS } from '../Logo';
export type {
  LogoProps,
  LogoMarkProps,
  LogoSize,
  LogoVariant,
  LogoTheme,
  LogoMarkTheme,
} from '../Logo';

export { default } from '../Logo';
