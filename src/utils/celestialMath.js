/**
 * Pure trigonometric and projection utilities for the interactive celestial starfield.
 * Encapsulates astronomical sphere rotation and screen projection mathematics (SRP).
 */

/**
 * Calculates target celestial dome angle based on calendar Month, Year, and continuous auto-orbit offset.
 * Calibrated so October (month 9) starts at angle 0.
 *
 * @param {number} month 0-indexed month (0 = Jan, 11 = Dec)
 * @param {number} year Full year (e.g. 2026)
 * @param {number} [autoOrbitOffset=0] Continuous rotation offset
 * @returns {number} Sky angle in radians
 */
export function calculateDesiredSkyAngle(month, year, autoOrbitOffset = 0) {
  return ((month - 9) * (Math.PI / 6)) + ((year - 2026) * 0.02) + autoOrbitOffset;
}

/**
 * Normalizes apparent angle difference to [-PI, PI] range relative to current celestial orientation.
 *
 * @param {number} baseAngle Constellation right ascension base angle
 * @param {number} currentSkyAngle Current celestial dome angle
 * @returns {number} Normalized angle in radians between -PI and PI
 */
export function normalizeApparentAngle(baseAngle, currentSkyAngle) {
  let apparent = (baseAngle - currentSkyAngle) % (Math.PI * 2);
  if (apparent > Math.PI) apparent -= Math.PI * 2;
  if (apparent < -Math.PI) apparent += Math.PI * 2;
  return apparent;
}

/**
 * Computes visibility factor for a celestial body across the 360-degree dome.
 * In-season constellations glow with full prominence (1.0), while opposite-season
 * constellations remain visible as gentle background ambient stars (0.35).
 *
 * @param {number} apparentAngle Normalized apparent angle in radians
 * @returns {{ isVisible: boolean, factor: number }}
 */
export function computeConstellationVisibility(apparentAngle) {
  // Graceful seasonal emphasis without cutting off the left half of the sky
  const seasonalProminence = 0.65 + 0.35 * Math.cos(apparentAngle);
  return { 
    isVisible: true, 
    factor: Math.max(0.25, Math.min(1.0, seasonalProminence)) 
  };
}

/**
 * Computes 2D screen coordinates for a constellation anchor on the elliptical celestial dome.
 * Distributes constellations naturally across left, center, right, top, and bottom.
 */
export function computeConstellationScreenAnchor({
  centerX,
  centerY,
  width,
  height,
  radialDist,
  apparentAngle,
  tick,
  baseAngle,
  parallaxX = 0,
  parallaxY = 0,
}) {
  // Elliptical dome calibrated so constellations span both left (cos < 0) and right (cos > 0)
  const orbitalRadiusX = width * radialDist * 0.95;
  const orbitalRadiusY = height * radialDist * 0.88;

  const rawX = centerX + Math.cos(apparentAngle) * orbitalRadiusX;
  const rawY = centerY + Math.sin(apparentAngle) * orbitalRadiusY;

  // Zero-g drift
  const driftX = Math.sin(tick * 0.007 + baseAngle) * 5;
  const driftY = Math.cos(tick * 0.006 + baseAngle * 1.4) * 5;

  return {
    anchorX: rawX + driftX - parallaxX * 0.35,
    anchorY: rawY + driftY - parallaxY * 0.35,
  };
}
