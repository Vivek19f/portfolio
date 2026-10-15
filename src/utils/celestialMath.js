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
 * Computes visibility factor for a celestial body based on horizon occultation.
 * Body is visible overhead when |apparentAngle| < 105 degrees (cos > -0.25).
 *
 * @param {number} apparentAngle Normalized apparent angle in radians
 * @returns {{ isVisible: boolean, factor: number }}
 */
export function computeConstellationVisibility(apparentAngle) {
  const cosAngle = Math.cos(apparentAngle);
  const isVisible = cosAngle > -0.25;
  const factor = isVisible ? Math.max(0, Math.min(1, (cosAngle + 0.25) / 0.85)) : 0;
  return { isVisible: isVisible && factor > 0.02, factor };
}

/**
 * Computes 2D screen coordinates for a constellation anchor on the elliptical celestial dome.
 * Applies subtle zero-G orbital drift and mouse parallax.
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
  const orbitalRadiusX = width * radialDist * 1.15;
  const orbitalRadiusY = height * radialDist * 1.05;

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
