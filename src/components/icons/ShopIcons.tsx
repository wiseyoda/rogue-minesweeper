/**
 * Shop Icons - Icons for floor shop items and permanent upgrades
 *
 * All icons use consistent simple pixel-art style:
 * - No background fills (transparent)
 * - Bold shapes with design system colors
 * - 24x24 viewBox standard
 */

interface IconProps {
  className?: string;
  size?: number;
}

// ============================================
// Floor Shop Item Icons (24x24)
// ============================================

/**
 * Heal Potion - Restores HP (red potion bottle)
 */
export function HealPotionIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      {/* Cork */}
      <rect x="9" y="2" width="6" height="3" fill="var(--bone)" />
      {/* Bottle neck */}
      <rect x="10" y="5" width="4" height="4" fill="var(--stone-500)" />
      {/* Bottle body */}
      <rect x="7" y="9" width="10" height="13" fill="var(--blood)" />
      {/* Liquid highlight */}
      <rect x="8" y="11" width="3" height="9" fill="var(--blood-bright)" opacity="0.5" />
      {/* Plus symbol */}
      <rect x="11" y="13" width="2" height="6" fill="var(--bone)" opacity="0.9" />
      <rect x="9" y="15" width="6" height="2" fill="var(--bone)" opacity="0.9" />
    </svg>
  );
}

/**
 * Max HP Up - Permanently increases max HP (heart with plus)
 * Note: This item isn't currently in the shop, but icon exists for potential use
 */
export function MaxHPUpIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      {/* Heart shape using rects for pixel style */}
      <rect x="2" y="4" width="8" height="8" fill="var(--blood)" />
      <rect x="14" y="4" width="8" height="8" fill="var(--blood)" />
      <rect x="4" y="2" width="4" height="4" fill="var(--blood)" />
      <rect x="16" y="2" width="4" height="4" fill="var(--blood)" />
      <rect x="4" y="10" width="16" height="6" fill="var(--blood)" />
      <rect x="6" y="16" width="12" height="4" fill="var(--blood)" />
      <rect x="10" y="20" width="4" height="2" fill="var(--blood)" />
      {/* Plus badge */}
      <circle cx="18" cy="6" r="5" fill="var(--venom)" />
      <rect x="17" y="4" width="2" height="4" fill="var(--bone)" />
      <rect x="16" y="5" width="4" height="2" fill="var(--bone)" />
    </svg>
  );
}

/**
 * Shield Orb - Grants shields (shield icon)
 */
export function ShieldOrbIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      {/* Outer shield */}
      <path
        d="M12 2 L20 5 L20 11 Q20 18 12 22 Q4 18 4 11 L4 5 Z"
        fill="var(--ice)"
      />
      {/* Inner shield */}
      <path
        d="M12 5 L17 7.5 L17 11 Q17 16 12 19 Q7 16 7 11 L7 7.5 Z"
        fill="var(--ice-dark)"
      />
      {/* Highlight */}
      <path
        d="M12 7 L15 9 L15 11 Q15 14 12 16 Q9 14 9 11 L9 9 Z"
        fill="var(--ice-bright)"
        opacity="0.6"
      />
    </svg>
  );
}

/**
 * Gold Magnet - Doubles gold for next floor (magnet shape)
 */
export function GoldMagnetIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      {/* Magnet U-shape */}
      <rect x="4" y="4" width="4" height="14" fill="var(--stone-400)" />
      <rect x="16" y="4" width="4" height="14" fill="var(--stone-400)" />
      <rect x="8" y="14" width="8" height="4" fill="var(--stone-400)" />
      {/* Red tips */}
      <rect x="4" y="4" width="4" height="4" fill="var(--blood)" />
      <rect x="16" y="4" width="4" height="4" fill="var(--blood)" />
      {/* Gold coins */}
      <circle cx="12" cy="3" r="2" fill="var(--gold)" />
      <circle cx="8" cy="2" r="1.5" fill="var(--gold-bright)" />
      <circle cx="16" cy="2" r="1.5" fill="var(--gold-bright)" />
    </svg>
  );
}

/**
 * Reveal Scroll - Reveals safe tiles at start (scroll with eye)
 */
export function RevealScrollIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      {/* Scroll body */}
      <rect x="5" y="4" width="14" height="16" fill="var(--bone)" />
      {/* Scroll top roll */}
      <rect x="4" y="2" width="16" height="4" rx="2" fill="var(--bone-dark)" />
      {/* Scroll bottom roll */}
      <rect x="4" y="18" width="16" height="4" rx="2" fill="var(--bone-dark)" />
      {/* Eye symbol */}
      <ellipse cx="12" cy="12" rx="5" ry="3" fill="var(--mystic)" />
      <circle cx="12" cy="12" r="2" fill="var(--mystic-bright)" />
      <circle cx="12" cy="12" r="1" fill="var(--void)" />
    </svg>
  );
}

// ============================================
// Permanent Upgrade Icons (24x24 - same size for consistency)
// ============================================

/**
 * Vitality - +1 max HP per level (red heart)
 */
export function VitalityIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      {/* Heart shape */}
      <rect x="2" y="5" width="8" height="7" fill="var(--blood)" />
      <rect x="14" y="5" width="8" height="7" fill="var(--blood)" />
      <rect x="4" y="3" width="4" height="4" fill="var(--blood)" />
      <rect x="16" y="3" width="4" height="4" fill="var(--blood)" />
      <rect x="4" y="10" width="16" height="5" fill="var(--blood)" />
      <rect x="6" y="15" width="12" height="4" fill="var(--blood)" />
      <rect x="10" y="19" width="4" height="2" fill="var(--blood)" />
      {/* Shine */}
      <rect x="5" y="5" width="2" height="2" fill="var(--blood-bright)" opacity="0.6" />
    </svg>
  );
}

/**
 * Fortune - +10% gold find per level (stack of coins)
 */
export function FortuneIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      {/* Bottom coin */}
      <ellipse cx="12" cy="18" rx="9" ry="3" fill="var(--gold-dark)" />
      <ellipse cx="12" cy="17" rx="9" ry="3" fill="var(--gold)" />
      {/* Middle coin */}
      <ellipse cx="12" cy="13" rx="8" ry="2.5" fill="var(--gold-dark)" />
      <ellipse cx="12" cy="12" rx="8" ry="2.5" fill="var(--gold)" />
      {/* Top coin */}
      <ellipse cx="12" cy="8" rx="7" ry="2" fill="var(--gold-dark)" />
      <ellipse cx="12" cy="7" rx="7" ry="2" fill="var(--gold-bright)" />
      {/* Sparkle */}
      <path d="M18 3 L19 5 L21 4 L19 6 L20 8 L18 6 L16 7 L18 5 Z" fill="var(--gold-bright)" />
    </svg>
  );
}

/**
 * Resilience - +1 starting shield per level (blue shield)
 */
export function ResilienceIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 2 L20 5 L20 11 Q20 18 12 22 Q4 18 4 11 L4 5 Z"
        fill="var(--ice)"
      />
      <path
        d="M12 5 L17 7.5 L17 11 Q17 16 12 19 Q7 16 7 11 L7 7.5 Z"
        fill="var(--ice-dark)"
      />
      <path
        d="M12 8 L14 9 L14 11 Q14 13 12 15 Q10 13 10 11 L10 9 Z"
        fill="var(--ice-bright)"
        opacity="0.7"
      />
    </svg>
  );
}

/**
 * First Click Safety - First monster hit is free (magic star/ward)
 */
export function FirstClickSafetyIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      {/* Outer circle */}
      <circle cx="12" cy="12" r="10" fill="none" stroke="var(--mystic)" strokeWidth="2" />
      {/* Inner glow */}
      <circle cx="12" cy="12" r="7" fill="var(--mystic)" opacity="0.3" />
      {/* Star */}
      <path
        d="M12 3 L13.5 9 L20 9 L15 13 L17 20 L12 16 L7 20 L9 13 L4 9 L10.5 9 Z"
        fill="var(--mystic-bright)"
      />
      {/* Center */}
      <circle cx="12" cy="12" r="2" fill="var(--bone)" />
    </svg>
  );
}

/**
 * Preparation - Start with random buff per level (two potions)
 */
export function PreparationIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      {/* Left potion (green) */}
      <rect x="2" y="4" width="4" height="2" fill="var(--bone)" />
      <rect x="3" y="6" width="2" height="2" fill="var(--stone-500)" />
      <rect x="2" y="8" width="4" height="10" fill="var(--venom)" />
      <rect x="3" y="10" width="1" height="6" fill="var(--venom-bright)" opacity="0.5" />

      {/* Right potion (blue) */}
      <rect x="18" y="4" width="4" height="2" fill="var(--bone)" />
      <rect x="19" y="6" width="2" height="2" fill="var(--stone-500)" />
      <rect x="18" y="8" width="4" height="10" fill="var(--ice)" />
      <rect x="19" y="10" width="1" height="6" fill="var(--ice-bright)" opacity="0.5" />

      {/* Center sparkle */}
      <path d="M12 2 L13 6 L17 5 L13 8 L14 12 L12 9 L10 12 L11 8 L7 5 L11 6 Z" fill="var(--gold-bright)" />
    </svg>
  );
}

// ============================================
// Dev/Debug Icons (24x24)
// ============================================

/**
 * Robot - Auto-solver dev tool
 */
export function RobotIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      {/* Antenna */}
      <rect x="11" y="1" width="2" height="3" fill="var(--stone-400)" />
      <circle cx="12" cy="1" r="1.5" fill="var(--mystic-bright)" />
      {/* Head */}
      <rect x="5" y="4" width="14" height="10" fill="var(--stone-600)" />
      <rect x="6" y="5" width="12" height="8" fill="var(--stone-700)" />
      {/* Eyes */}
      <rect x="7" y="6" width="4" height="4" fill="var(--ice)" />
      <rect x="13" y="6" width="4" height="4" fill="var(--ice)" />
      <rect x="8" y="7" width="2" height="2" fill="var(--void)" />
      <rect x="14" y="7" width="2" height="2" fill="var(--void)" />
      {/* Mouth */}
      <rect x="8" y="11" width="8" height="1" fill="var(--stone-500)" />
      {/* Body */}
      <rect x="6" y="14" width="12" height="8" fill="var(--stone-600)" />
      <rect x="8" y="16" width="8" height="4" fill="var(--mystic)" opacity="0.5" />
      {/* Arms */}
      <rect x="2" y="15" width="4" height="2" fill="var(--stone-500)" />
      <rect x="18" y="15" width="4" height="2" fill="var(--stone-500)" />
    </svg>
  );
}
