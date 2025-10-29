/**
 * Feature Flags Configuration
 *
 * Allows enabling/disabling features via environment variables
 * for safe rollout and instant rollback capabilities.
 *
 * Usage:
 * - Set NEXT_PUBLIC_ENABLE_AUTO_EXPAND=true in .env.local to enable
 * - Default is false (disabled) for maximum safety
 * - Can be toggled without code deployment
 */

export const FEATURES = {
  /**
   * Auto-expanding textarea for chat input
   *
   * When enabled:
   * - Input expands vertically as user types
   * - Shows 1-5 lines of text at once
   * - Better for long questions and Vietnamese text
   *
   * When disabled (default):
   * - Single-line input with horizontal scroll
   * - Standard chat app behavior
   */
  AUTO_EXPANDING_TEXTAREA: process.env.NEXT_PUBLIC_ENABLE_AUTO_EXPAND === 'true',
} as const;
