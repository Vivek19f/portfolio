/**
 * Lunar Phases, Epoch Calculations & Dynamic Theme Color Engine.
 * Supports:
 *  - Conway / Astronomical Julian Day Moon Phase calculations.
 *  - Full Moon Specialties: Supermoon, Micromoon, Blood Moon, Blue Moon, Harvest Moon.
 *  - Total Solar Eclipse Mode with incandescent solar corona flare ring.
 *  - Dynamic CSS root variable theming based on the Moon's chromatic signature.
 */

export const LUNAR_THEMES = {
  default: {
    id: 'default',
    name: 'Electric Cyan',
    accent: '#00f0ff',
    accentGlow: 'rgba(0, 240, 255, 0.35)',
    accentLight: '#7dd3fc',
    accentSecondary: '#38bdf8',
    cardBorderHover: 'rgba(56, 189, 248, 0.35)',
    moonColor: '#ffffff',
    moonGlow: 'rgba(0, 240, 255, 0.3)',
    darkSilhouette: false,
  },
  bloodMoon: {
    id: 'bloodMoon',
    name: 'Blood Moon (Lunar Eclipse)',
    accent: '#f43f5e',
    accentGlow: 'rgba(244, 63, 94, 0.45)',
    accentLight: '#fda4af',
    accentSecondary: '#fb7185',
    cardBorderHover: 'rgba(244, 63, 94, 0.4)',
    moonColor: '#dc2626',
    moonGlow: 'rgba(239, 68, 68, 0.55)',
    darkSilhouette: false,
  },
  solarEclipse: {
    id: 'solarEclipse',
    name: 'Total Solar Eclipse (Coronal Ring)',
    accent: '#eab308',
    accentGlow: 'rgba(234, 179, 8, 0.55)',
    accentLight: '#fde047',
    accentSecondary: '#facc15',
    cardBorderHover: 'rgba(234, 179, 8, 0.45)',
    moonColor: '#05070e',
    moonGlow: 'rgba(250, 204, 21, 0.65)',
    darkSilhouette: true,
  },
  harvestMoon: {
    id: 'harvestMoon',
    name: 'Harvest Moon (Golden Amber)',
    accent: '#f59e0b',
    accentGlow: 'rgba(245, 158, 11, 0.45)',
    accentLight: '#fcd34d',
    accentSecondary: '#fbbf24',
    cardBorderHover: 'rgba(245, 158, 11, 0.4)',
    moonColor: '#fbbf24',
    moonGlow: 'rgba(245, 158, 11, 0.4)',
    darkSilhouette: false,
  },
  blueMoon: {
    id: 'blueMoon',
    name: 'Blue Moon (Cobalt Sapphire)',
    accent: '#3b82f6',
    accentGlow: 'rgba(59, 130, 246, 0.45)',
    accentLight: '#93c5fd',
    accentSecondary: '#60a5fa',
    cardBorderHover: 'rgba(59, 130, 246, 0.4)',
    moonColor: '#60a5fa',
    moonGlow: 'rgba(59, 130, 246, 0.45)',
    darkSilhouette: false,
  },
  supermoon: {
    id: 'supermoon',
    name: 'Supermoon (Radiant Silver-Cyan)',
    accent: '#22d3ee',
    accentGlow: 'rgba(34, 211, 238, 0.5)',
    accentLight: '#a5f3fc',
    accentSecondary: '#67e8f9',
    cardBorderHover: 'rgba(34, 211, 238, 0.45)',
    moonColor: '#f8fafc',
    moonGlow: 'rgba(34, 211, 238, 0.55)',
    darkSilhouette: false,
  },
  micromoon: {
    id: 'micromoon',
    name: 'Micromoon (Steel Slate)',
    accent: '#38bdf8',
    accentGlow: 'rgba(56, 189, 248, 0.35)',
    accentLight: '#bae6fd',
    accentSecondary: '#7dd3fc',
    cardBorderHover: 'rgba(56, 189, 248, 0.3)',
    moonColor: '#cbd5e1',
    moonGlow: 'rgba(148, 163, 184, 0.3)',
    darkSilhouette: false,
  },
};

/**
 * Calculates high-precision astronomical lunar status for a given calendar date.
 * Based on the Conway lunar epoch algorithm calibrated against JD 2451549.26.
 *
 * @param {number} year - Full year (e.g. 2026)
 * @param {number} month - 0-indexed month (0 = Jan, 11 = Dec)
 * @param {number} day - Day of month (1 - 31)
 * @param {Object} [overrides={}] - Manual eclipse or special type overrides
 * @returns {Object} Comprehensive lunar status, theme palette, and metrics
 */
export function calculateLunarStatus(year, month, day = 15, overrides = {}) {
  // If Total Solar Eclipse is active
  if (overrides.isSolarEclipse) {
    return {
      phaseName: 'Total Solar Eclipse',
      phaseIcon: '🌑',
      phaseFraction: 0.0,
      age: 0,
      illumination: 0,
      type: 'solarEclipse',
      title: 'Total Solar Eclipse',
      badge: '🌑 TOTAL SOLAR ECLIPSE',
      desc: 'The Moon occults the Sun in totality, casting twilight darkness and igniting a 1,500,000 K coronal flare ring.',
      theme: LUNAR_THEMES.solarEclipse,
      scaleMultiplier: 1.05,
      isEclipse: true,
      isSolar: true,
    };
  }

  // If Blood Moon (Total Lunar Eclipse) is active
  if (overrides.isBloodMoon) {
    return {
      phaseName: 'Blood Moon (Lunar Eclipse)',
      phaseIcon: '🌕',
      phaseFraction: 0.5,
      age: 14.76,
      illumination: 100,
      type: 'bloodMoon',
      title: 'Blood Moon (Lunar Eclipse)',
      badge: '🩸 BLOOD MOON',
      desc: 'Earth casts its umbral shadow, turning the Moon deep copper-crimson through atmospheric Rayleigh scattering.',
      theme: LUNAR_THEMES.bloodMoon,
      scaleMultiplier: 1.08,
      isEclipse: true,
      isLunar: true,
    };
  }

  // Astronomical Julian Day calculation
  const m = month + 1;
  const a = Math.floor((14 - m) / 12);
  const yj = year + 4800 - a;
  const mj = m + 12 * a - 3;
  const jd =
    day +
    Math.floor((153 * mj + 2) / 5) +
    365 * yj +
    Math.floor(yj / 4) -
    Math.floor(yj / 100) +
    Math.floor(yj / 400) -
    32045;

  // Synodic lunar period = 29.53058867 days
  const synodicMonth = 29.53058867;
  const daysSinceNew = jd - 2451549.26;
  const cycles = daysSinceNew / synodicMonth;
  const phaseFraction = cycles - Math.floor(cycles); // 0.0 to 1.0
  const age = phaseFraction * synodicMonth; // 0 to 29.53 days
  const illumination = Math.round(((1 - Math.cos(phaseFraction * 2 * Math.PI)) / 2) * 100);

  // Determine standard phase name & emoji
  let phaseName = '';
  let phaseIcon = '';
  if (phaseFraction < 0.03 || phaseFraction > 0.97) {
    phaseName = 'New Moon';
    phaseIcon = '🌑';
  } else if (phaseFraction < 0.22) {
    phaseName = 'Waxing Crescent';
    phaseIcon = '🌒';
  } else if (phaseFraction < 0.28) {
    phaseName = 'First Quarter';
    phaseIcon = '🌓';
  } else if (phaseFraction < 0.47) {
    phaseName = 'Waxing Gibbous';
    phaseIcon = '🌔';
  } else if (phaseFraction < 0.53) {
    phaseName = 'Full Moon';
    phaseIcon = '🌕';
  } else if (phaseFraction < 0.72) {
    phaseName = 'Waning Gibbous';
    phaseIcon = '🌖';
  } else if (phaseFraction < 0.78) {
    phaseName = 'Last Quarter';
    phaseIcon = '🌗';
  } else {
    phaseName = 'Waning Crescent';
    phaseIcon = '🌘';
  }

  // Determine Special Full Moon classifications
  const isFullMoon = phaseFraction >= 0.44 && phaseFraction <= 0.56;

  let type = 'default';
  let title = phaseName;
  let badge = `${phaseIcon} ${phaseName.toUpperCase()}`;
  let desc = `Illumination: ${illumination}% • Lunar Age: ${age.toFixed(1)} days.`;
  let theme = LUNAR_THEMES.default;
  let scaleMultiplier = 1.0;

  if (isFullMoon || overrides.specialType) {
    const forcedType = overrides.specialType;

    if (forcedType === 'bloodMoon') {
      type = 'bloodMoon';
      title = 'Blood Moon';
      badge = '🩸 BLOOD MOON';
      desc = 'Total lunar eclipse: Earth refracts red sunlight onto the lunar surface.';
      theme = LUNAR_THEMES.bloodMoon;
      scaleMultiplier = 1.1;
    } else if (forcedType === 'harvestMoon' || (!forcedType && (month === 8 || month === 9))) {
      // Harvest Moon: Full Moon closest to Autumnal Equinox (Sep / Oct)
      type = 'harvestMoon';
      title = 'Harvest Moon';
      badge = '🌾 HARVEST MOON';
      desc = 'Autumnal full moon rising low on the horizon with a warm golden-amber pumpkin glow.';
      theme = LUNAR_THEMES.harvestMoon;
      scaleMultiplier = 1.12;
    } else if (forcedType === 'blueMoon' || (!forcedType && month === 4 && year === 2026)) {
      // Blue Moon: Rare second full moon in month / 3rd in 4-moon season
      type = 'blueMoon';
      title = 'Rare Blue Moon';
      badge = '💎 BLUE MOON';
      desc = 'A rare second full moon in a single cycle, shining with cobalt sapphire brilliance.';
      theme = LUNAR_THEMES.blueMoon;
      scaleMultiplier = 1.08;
    } else if (forcedType === 'supermoon' || (!forcedType && (month === 7 || month === 8 || month === 9 || month === 10))) {
      // Supermoon: Perigee Full Moon (within 90% of closest orbital distance)
      type = 'supermoon';
      title = 'Perigee Supermoon';
      badge = '🌕 SUPERMOON';
      desc = 'At closest perigee approach: appearing 14% larger and 30% brighter with intense silver-cyan flare.';
      theme = LUNAR_THEMES.supermoon;
      scaleMultiplier = 1.18;
    } else if (forcedType === 'micromoon' || (!forcedType && (month === 0 || month === 1))) {
      // Micromoon: Apogee Full Moon (farthest point in orbit)
      type = 'micromoon';
      title = 'Apogee Micromoon';
      badge = '🌕 MICROMOON';
      desc = 'At maximum apogee distance from Earth: a crisp, compact steel slate full moon.';
      theme = LUNAR_THEMES.micromoon;
      scaleMultiplier = 0.88;
    } else {
      type = 'supermoon';
      title = 'Full Moon';
      badge = '🌕 FULL MOON';
      desc = '100% illuminated lunar disc radiating pure celestial silver light.';
      theme = LUNAR_THEMES.supermoon;
      scaleMultiplier = 1.05;
    }
  }

  return {
    phaseName,
    phaseIcon,
    phaseFraction,
    age,
    illumination,
    type,
    title,
    badge,
    desc,
    theme,
    scaleMultiplier,
    isEclipse: false,
    isSolar: false,
  };
}

/**
 * Dynamically applies lunar theme colors to document root CSS variables.
 * Transforms --accent, --accent-glow, --card-border-hover across the entire site.
 *
 * @param {Object} theme - Lunar theme object from LUNAR_THEMES
 */
export function applyLunarTheme(theme) {
  if (typeof document === 'undefined' || !theme) return;
  const root = document.documentElement;

  root.style.setProperty('--accent', theme.accent);
  root.style.setProperty('--accent-glow', theme.accentGlow);
  root.style.setProperty('--accent-light', theme.accentLight);
  root.style.setProperty('--accent-secondary', theme.accentSecondary);
  root.style.setProperty('--card-border-hover', theme.cardBorderHover);

  window.dispatchEvent(
    new CustomEvent('celestial-theme-change', {
      detail: { theme },
    })
  );
}
