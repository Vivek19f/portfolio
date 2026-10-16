/**
 * Celestial Events, Deep-Sky Objects & Astronomical Calculations.
 * Features:
 *  - Seasonal Meteor Showers tied to calendar months.
 *  - Deep-Sky Objects (Andromeda Galaxy M31, Pleiades Cluster M45, Orion Nebula M42).
 *  - Precise Easter calculation (Anonymous Gregorian Algorithm) for Betelgeuse Supernova Easter Egg.
 */

export const METEOR_SHOWERS = [
  {
    id: 'quadrantids',
    name: 'Quadrantids',
    month: 0, // January
    peakDays: 'Jan 3–4',
    radiantAngle: 2.7,
    rate: 'Peak 80/hr',
    color: '#7dd3fc',
    trailColor: 'rgba(125, 211, 252, ',
    description: 'Blazing blue-white meteors radiating from northern Bootes/Draco.',
  },
  {
    id: 'lyrids',
    name: 'Lyrids',
    month: 3, // April
    peakDays: 'Apr 21–22',
    radiantAngle: 5.2,
    rate: '18/hr',
    color: '#a78bfa',
    trailColor: 'rgba(167, 139, 250, ',
    description: 'Fast meteors originating from Lyra with glowing ionization trails.',
  },
  {
    id: 'perseids',
    name: 'Perseids',
    month: 7, // August
    peakDays: 'Aug 12–13',
    radiantAngle: 5.9,
    rate: 'Peak 100/hr',
    color: '#00f0ff',
    trailColor: 'rgba(0, 240, 255, ',
    description: 'The king of summer showers, famed for bright green-cyan fireballs.',
  },
  {
    id: 'orionids',
    name: 'Orionids',
    month: 9, // October
    peakDays: 'Oct 21–22',
    radiantAngle: 1.45,
    rate: '25/hr',
    color: '#38bdf8',
    trailColor: 'rgba(56, 189, 248, ',
    description: 'Debris from Halley\'s Comet radiating from the shoulder of Orion at 66 km/s.',
  },
  {
    id: 'leonids',
    name: 'Leonids',
    month: 10, // November
    peakDays: 'Nov 17–18',
    radiantAngle: 3.2,
    rate: '15/hr',
    color: '#34d399',
    trailColor: 'rgba(52, 211, 153, ',
    description: 'Swift emerald streaks famous for historic cyclical meteor storms.',
  },
  {
    id: 'geminids',
    name: 'Geminids',
    month: 11, // December
    peakDays: 'Dec 13–14',
    radiantAngle: 1.9,
    rate: 'Peak 120/hr',
    color: '#fbbf24',
    trailColor: 'rgba(251, 191, 36, ',
    description: 'The most intense annual shower with slow, brilliant golden fireballs.',
  },
];

export const DEEP_SKY_OBJECTS = [
  {
    id: 'm31-andromeda',
    name: 'Andromeda Galaxy (M31)',
    type: 'Barred Spiral Galaxy',
    constellation: 'Andromeda',
    baseAngle: 0.22, // Near Pegasus and Cassiopeia
    radialDist: 0.32,
    distance: '2.537M ly',
    magnitude: '3.44',
    width: 44,
    height: 18,
    tilt: -0.42, // radians rotation
    colorCore: '#fffbeb',
    colorGlow: 'rgba(56, 189, 248, 0.32)',
    colorArms: 'rgba(129, 140, 248, 0.24)',
    description: 'Our galactic neighbor, containing over 1 trillion stars in a sweeping spiral disc.',
  },
  {
    id: 'm45-pleiades',
    name: 'The Pleiades (M45)',
    type: 'Open Star Cluster & Reflection Nebula',
    constellation: 'Taurus',
    baseAngle: 1.06, // Near Taurus
    radialDist: 0.38,
    distance: '444 ly',
    magnitude: '1.6',
    stars: [
      { x: -14, y: -7, r: 2.4, name: 'Alcyone' },
      { x: -5, y: -13, r: 2.1, name: 'Maia' },
      { x: 5, y: -11, r: 1.9, name: 'Electra' },
      { x: 13, y: -5, r: 2.0, name: 'Taygeta' },
      { x: 9, y: 7, r: 1.8, name: 'Celaeno' },
      { x: -3, y: 9, r: 1.9, name: 'Sterope' },
      { x: -19, y: 5, r: 2.2, name: 'Atlas' },
    ],
    colorGlow: 'rgba(0, 240, 255, 0.35)',
    description: 'The Seven Sisters cluster enveloped in an iridescent sapphire dust reflection cloud.',
  },
  {
    id: 'm42-orion-nebula',
    name: 'Orion Nebula (M42)',
    type: 'Diffuse Emission Nebula',
    constellation: 'Orion',
    baseAngle: 1.48, // Below Orion\'s belt
    radialDist: 0.39,
    distance: '1,344 ly',
    magnitude: '4.0',
    radius: 22,
    colorGlow: 'rgba(236, 72, 153, 0.28)',
    colorCore: 'rgba(168, 85, 247, 0.36)',
    description: 'A stellar nursery where new star systems and protoplanetary discs are currently igniting.',
  },
];

/**
 * Anonymous Gregorian Algorithm (Meeus/Jones/Butcher)
 * Calculates the exact Easter Sunday for any year Y.
 * @param {number} year - The Gregorian epoch year (e.g. 2026)
 * @returns {{ month: number, day: number }} month is 0-indexed (2=March, 3=April)
 */
export function getEasterDate(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const L = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * L) / 451);
  const month = Math.floor((h + L - 7 * m + 114) / 31) - 1; // 0-indexed (2: March, 3: April)
  const day = ((h + L - 7 * m + 114) % 31) + 1;
  return { month, day };
}

/**
 * Checks if a given month/year or real current date falls within Easter season.
 * @param {number} month - 0-11
 * @param {number} year - e.g. 2026
 * @returns {boolean}
 */
export function isEasterSeason(month, year) {
  const easter = getEasterDate(year);
  // Matches the calculated Easter month (March or April)
  if (month === easter.month) return true;

  // Also check real-world local date if viewing current year
  const now = new Date();
  if (year === now.getFullYear()) {
    const realEaster = getEasterDate(now.getFullYear());
    if (now.getMonth() === realEaster.month && Math.abs(now.getDate() - realEaster.day) <= 14) {
      return true;
    }
  }
  return false;
}

/**
 * Returns active meteor shower for a given month, or null if quiet.
 */
export function getActiveMeteorShower(month) {
  return METEOR_SHOWERS.find((s) => s.month === month) || null;
}
