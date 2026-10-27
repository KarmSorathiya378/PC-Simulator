/**
 * Reusable surface primitives and UI system components.
 * All primitives consume design tokens from theme.ts for Awwwards-caliber polish.
 */

export { Button, buttonVariants } from './button';
export type { ButtonProps } from './button';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from './card';
export type { CardProps } from './card';

export { Badge, badgeVariants } from './badge';
export type { BadgeProps } from './badge';

export { GlowCard } from './glow-card';
export type { GlowCardProps } from './glow-card';

export { GlassPanel } from './glass-panel';
export type { GlassPanelProps } from './glass-panel';

export { GradientText } from './gradient-text';
export type { GradientTextProps, GradientVariant } from './gradient-text';

export { BrandBadge } from './brand-badge';
export type { BrandBadgeProps, BrandBadgeVariant } from './brand-badge';

export { Chip } from './chip';
export type { ChipProps } from './chip';

export { SectionHeading } from './section-heading';
export type { SectionHeadingProps } from './section-heading';

export { Separator } from './separator';
export type { SeparatorProps } from './separator';

export { Header } from './header';
export { Footer } from './footer';
export { AppShell } from './app-shell';

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './dialog';
