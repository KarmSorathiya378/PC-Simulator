import { describe, it, expect } from 'vitest';
import {
  themeTokens,
  getHardwareColor,
  getGlowShadow,
  getGlassStyle,
  getStaggerDelay,
  getTactileSpringStyle,
  motionVariants,
  getStaggerStyle,
} from '../../theme';
import { GlowCard } from './glow-card';
import { GlassPanel } from './glass-panel';
import { GradientText } from './gradient-text';
import { BrandBadge } from './brand-badge';
import { Button, buttonVariants } from './button';
import { Card } from './card';
import { Chip } from './chip';
import { Separator } from './separator';
import { SectionHeading } from './section-heading';
import { Header } from './header';
import { Footer } from './footer';
import { AppShell } from './app-shell';

describe('Global Design Tokens & Surface Primitives', () => {
  describe('themeTokens Structure & Completeness', () => {
    it('defines comprehensive dark and light color systems', () => {
      expect(themeTokens.colors.dark.background).toBe('#090D16');
      expect(themeTokens.colors.dark.primary).toBe('#0EA5E9');
      expect(themeTokens.colors.dark.accentWarm).toBe('#F59E0B');
      expect(themeTokens.colors.dark.accentViolet).toBe('#8B5CF6');
      expect(themeTokens.colors.dark.success).toBe('#10B981');
      expect(themeTokens.colors.dark.danger).toBe('#EF4444');

      expect(themeTokens.colors.light.background).toBe('#F8FAFC');
      expect(themeTokens.colors.light.primary).toBe('#0284C7');
    });

    it('contains full hardware category color mappings', () => {
      expect(getHardwareColor('cpu')).toBe('#F59E0B');
      expect(getHardwareColor('gpu')).toBe('#8B5CF6');
      expect(getHardwareColor('ram')).toBe('#10B981');
      expect(getHardwareColor('motherboard')).toBe('#0EA5E9');
      expect(getHardwareColor('ssd')).toBe('#38BDF8');
      expect(getHardwareColor('case')).toBe('#64748B');
    });

    it('exports typography scale, weights, and tracking tokens', () => {
      expect(themeTokens.typography.fontDisplay).toContain('Space Grotesk');
      expect(themeTokens.typography.fontBody).toContain('Inter');
      expect(themeTokens.typography.fontMono).toContain('JetBrains Mono');
      expect(themeTokens.typography.scale['2xl']).toBe('1.5rem');
    });

    it('exports radii, shadow, and glassmorphism tokens', () => {
      expect(themeTokens.radii.pill).toBe('9999px');
      expect(themeTokens.radii.xl).toBe('1.25rem');
      expect(themeTokens.shadows.glowCyan).toBeTruthy();
      expect(themeTokens.shadows.innerBevel).toBeTruthy();
      expect(themeTokens.glassmorphism.panel.backdropBlur).toContain('blur');
    });

    it('returns valid inline styles via helper functions', () => {
      const panelStyle = getGlassStyle('panel');
      expect(panelStyle.backdropFilter).toContain('blur');
      expect(getGlowShadow('cyan')).toContain('rgba(14, 165, 233');
      expect(getGlowShadow('violet')).toContain('rgba(139, 92, 246');
    });
  });

  describe('Surface Primitives Exports', () => {
    it('exports GlowCard, GlassPanel, GradientText, BrandBadge, and Button', () => {
      expect(GlowCard).toBeDefined();
      expect(typeof GlowCard).toBe('object'); // forwardRef
      expect(GlassPanel).toBeDefined();
      expect(typeof GlassPanel).toBe('object');
      expect(GradientText).toBeDefined();
      expect(typeof GradientText).toBe('function');
      expect(BrandBadge).toBeDefined();
      expect(typeof BrandBadge).toBe('function');
      expect(Button).toBeDefined();
      expect(typeof Button).toBe('object');
      expect(Card).toBeDefined();
      expect(typeof Card).toBe('object');
    });

    it('supports new button variants (glow, cyber, gradient, warm, glass)', () => {
      const glowClasses = buttonVariants({ variant: 'glow' });
      expect(glowClasses).toContain('shadow-[0_0_24px_rgba(14,165,233,0.45)]');

      const cyberClasses = buttonVariants({ variant: 'cyber' });
      expect(cyberClasses).toContain('shadow-[0_0_24px_rgba(139,92,246,0.4)]');

      const gradientClasses = buttonVariants({ variant: 'gradient' });
      expect(gradientClasses).toContain('bg-gradient-to-r');
    });

    it('exports Chip, Separator, SectionHeading, Header, Footer, and AppShell', () => {
      expect(Chip).toBeDefined();
      expect(Separator).toBeDefined();
      expect(SectionHeading).toBeDefined();
      expect(Header).toBeDefined();
      expect(Footer).toBeDefined();
      expect(AppShell).toBeDefined();
    });

    it('provides motion utilities and stagger delay calculators', () => {
      expect(motionVariants.fadeIn).toBeDefined();
      expect(motionVariants.pressable).toBeDefined();
      expect(getStaggerDelay(0)).toBe('40ms');
      expect(getStaggerDelay(2)).toBe('160ms');

      const style = getStaggerStyle(3, 50, 100);
      expect(style.animationDelay).toBe('350ms');
      expect(style.animationFillMode).toBe('both');

      const springStyle = getTactileSpringStyle();
      expect(springStyle.transition).toContain('cubic-bezier');
    });
  });
});
