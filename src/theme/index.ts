/**
 * PC Builder Lab - Global Design Tokens System
 * Clean, re-exportable entry point under src/theme.
 */

import {
  themeTokens,
  getHardwareColor,
  getGlowShadow,
  getGlassStyle,
  getStaggerDelay,
  getTactileSpringStyle,
} from '../styles/theme';
import type { ThemeTokens } from '../styles/theme';
import { motionVariants, getStaggerStyle } from '../styles/motion';

export {
  themeTokens,
  getHardwareColor,
  getGlowShadow,
  getGlassStyle,
  getStaggerDelay,
  getTactileSpringStyle,
  motionVariants,
  getStaggerStyle,
};

export type {
  ThemeTokens,
};

export default themeTokens;
