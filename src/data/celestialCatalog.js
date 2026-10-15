// Comprehensive 12-month astronomical constellation catalog
// Coordinates are defined relative to the celestial sphere wheel (theta: 0 to 2*PI radians)
export const CELESTIAL_CONSTELLATIONS = [
  // --- AUTUMN SKY ---
  {
    id: 'cassiopeia',
    name: 'CASSIOPEIA',
    season: 'Autumn / Winter',
    months: [8, 9, 10, 11], // Sep - Dec
    baseAngle: 0, // 0 deg
    radialDist: 0.34,
    code: 'α Cas · Schedar',
    keyStarIdx: 1,
    stars: [
      { x: -75, y: -20, r: 2.4, color: '#38bdf8', name: 'Caph' },
      { x: -35, y: 22, r: 3.2, color: '#00f0ff', name: 'Schedar' },
      { x: 5, y: -38, r: 3.0, color: '#ffffff', name: 'γ-Cas' },
      { x: 50, y: 15, r: 2.5, color: '#38bdf8', name: 'Ruchbah' },
      { x: 85, y: -25, r: 2.3, color: '#00f0ff', name: 'Segin' }
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4]]
  },
  {
    id: 'pegasus',
    name: 'PEGASUS',
    season: 'Autumn',
    months: [8, 9, 10], // Sep - Nov
    baseAngle: 0.38, // ~22 deg
    radialDist: 0.38,
    code: 'Great Square of Pegasus',
    keyStarIdx: 2,
    stars: [
      { x: -55, y: -50, r: 2.7, color: '#38bdf8', name: 'Scheat' },
      { x: 55, y: -45, r: 2.8, color: '#00f0ff', name: 'Alpheratz' },
      { x: 50, y: 50, r: 2.6, color: '#ffffff', name: 'Algenib' },
      { x: -55, y: 45, r: 2.8, color: '#7dd3fc', name: 'Markab' },
      { x: -105, y: 15, r: 2.2, color: '#38bdf8', name: 'Homam' }
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4]]
  },

  // --- WINTER SKY ---
  {
    id: 'orion',
    name: 'ORION',
    season: 'Winter',
    months: [11, 0, 1, 2], // Dec - Mar
    baseAngle: 1.45, // ~83 deg
    radialDist: 0.36,
    code: 'The Hunter · Belt & Rigel',
    keyStarIdx: 6,
    stars: [
      { x: -45, y: -65, r: 3.3, color: '#f59e0b', name: 'Betelgeuse' }, // Supergiant Amber
      { x: 35, y: -60, r: 2.8, color: '#00f0ff', name: 'Bellatrix' },
      { x: -16, y: -5, r: 2.5, color: '#38bdf8', name: 'Alnitak' },
      { x: 0, y: -10, r: 2.7, color: '#ffffff', name: 'Alnilam' },
      { x: 16, y: -15, r: 2.5, color: '#00f0ff', name: 'Mintaka' },
      { x: -38, y: 55, r: 2.5, color: '#38bdf8', name: 'Saiph' },
      { x: 38, y: 50, r: 3.4, color: '#7dd3fc', name: 'Rigel' },
      { x: 0, y: -80, r: 2.0, color: '#ffffff', name: 'Meissa' }
    ],
    edges: [
      [0, 7], [7, 1], [0, 2], [1, 4],
      [2, 3], [3, 4], [2, 5], [4, 6]
    ]
  },
  {
    id: 'canis-major',
    name: 'CANIS MAJOR',
    season: 'Winter',
    months: [11, 0, 1], // Dec - Feb
    baseAngle: 1.82, // ~104 deg
    radialDist: 0.40,
    code: 'α CMa · Sirius (Brilliant)',
    keyStarIdx: 0,
    stars: [
      { x: -30, y: -45, r: 3.8, color: '#ffffff', name: 'Sirius' }, // Brightest star in night sky
      { x: -65, y: -30, r: 2.4, color: '#38bdf8', name: 'Mirzam' },
      { x: 15, y: 20, r: 2.6, color: '#00f0ff', name: 'Wezen' },
      { x: -15, y: 45, r: 2.7, color: '#7dd3fc', name: 'Adhara' },
      { x: 40, y: 50, r: 2.3, color: '#38bdf8', name: 'Aludra' }
    ],
    edges: [[1, 0], [0, 2], [2, 3], [2, 4]]
  },
  {
    id: 'taurus',
    name: 'TAURUS',
    season: 'Winter',
    months: [10, 11, 0], // Nov - Jan
    baseAngle: 1.15, // ~66 deg
    radialDist: 0.35,
    code: 'α Tau · Aldebaran & Pleiades',
    keyStarIdx: 0,
    stars: [
      { x: 10, y: 10, r: 3.2, color: '#f59e0b', name: 'Aldebaran' }, // Red Giant
      { x: 65, y: -40, r: 2.6, color: '#00f0ff', name: 'Elnath' },
      { x: 50, y: 35, r: 2.3, color: '#38bdf8', name: 'Tianguan' },
      { x: -35, y: -10, r: 2.4, color: '#ffffff', name: 'Ain' },
      { x: -75, y: -30, r: 2.8, color: '#7dd3fc', name: 'Pleiades M45' }
    ],
    edges: [[3, 0], [0, 1], [0, 2], [3, 4]]
  },
  {
    id: 'gemini',
    name: 'GEMINI',
    season: 'Winter / Spring',
    months: [0, 1, 2, 3], // Jan - Apr
    baseAngle: 2.15, // ~123 deg
    radialDist: 0.36,
    code: 'Castor & Pollux Twins',
    keyStarIdx: 1,
    stars: [
      { x: -25, y: -60, r: 2.8, color: '#ffffff', name: 'Castor' },
      { x: 15, y: -55, r: 3.1, color: '#f59e0b', name: 'Pollux' },
      { x: -35, y: 5, r: 2.4, color: '#38bdf8', name: 'Wasat' },
      { x: 10, y: 15, r: 2.3, color: '#00f0ff', name: 'Mekbuda' },
      { x: -50, y: 60, r: 2.6, color: '#7dd3fc', name: 'Alhena' },
      { x: -10, y: 65, r: 2.3, color: '#38bdf8', name: 'Tejat' }
    ],
    edges: [[0, 2], [2, 4], [1, 3], [3, 5], [0, 1]]
  },

  // --- SPRING SKY ---
  {
    id: 'ursa-major',
    name: 'URSA MAJOR',
    season: 'Spring',
    months: [2, 3, 4, 5], // Mar - Jun
    baseAngle: 3.05, // ~175 deg
    radialDist: 0.35,
    code: 'Big Dipper Asterism',
    keyStarIdx: 6,
    stars: [
      { x: -95, y: 15, r: 2.5, color: '#38bdf8', name: 'Alkaid' },
      { x: -55, y: 2, r: 2.4, color: '#ffffff', name: 'Mizar' },
      { x: -15, y: -8, r: 2.8, color: '#00f0ff', name: 'Alioth' },
      { x: 22, y: -8, r: 2.3, color: '#38bdf8', name: 'Megrez' },
      { x: 18, y: 35, r: 2.5, color: '#00f0ff', name: 'Phecda' },
      { x: 72, y: 38, r: 2.7, color: '#ffffff', name: 'Merak' },
      { x: 78, y: -10, r: 3.2, color: '#00f0ff', name: 'Dubhe' }
    ],
    edges: [
      [0, 1], [1, 2], [2, 3],
      [3, 4], [4, 5], [5, 6], [6, 3]
    ]
  },
  {
    id: 'leo',
    name: 'LEO',
    season: 'Spring',
    months: [1, 2, 3, 4], // Feb - May
    baseAngle: 2.68, // ~153 deg
    radialDist: 0.38,
    code: 'The Lion · Regulus',
    keyStarIdx: 0,
    stars: [
      { x: -55, y: 35, r: 3.2, color: '#7dd3fc', name: 'Regulus' },
      { x: -35, y: -10, r: 2.7, color: '#f59e0b', name: 'Algieba' },
      { x: -55, y: -45, r: 2.4, color: '#00f0ff', name: 'Adhafera' },
      { x: -25, y: -65, r: 2.3, color: '#ffffff', name: 'Rasalas' },
      { x: 25, y: -15, r: 2.5, color: '#38bdf8', name: 'Zosma' },
      { x: 65, y: 10, r: 2.9, color: '#00f0ff', name: 'Denebola' }
    ],
    edges: [[0, 1], [1, 2], [2, 3], [1, 4], [4, 5], [0, 4]]
  },
  {
    id: 'bootes',
    name: 'BOÖTES',
    season: 'Spring / Summer',
    months: [3, 4, 5, 6], // Apr - Jul
    baseAngle: 3.75, // ~215 deg
    radialDist: 0.36,
    code: 'α Boo · Arcturus (Gold Giant)',
    keyStarIdx: 0,
    stars: [
      { x: 0, y: 55, r: 3.5, color: '#f59e0b', name: 'Arcturus' }, // Brilliant Gold
      { x: -30, y: 5, r: 2.4, color: '#38bdf8', name: 'Muphrid' },
      { x: 25, y: -10, r: 2.7, color: '#00f0ff', name: 'Izar' },
      { x: 35, y: -65, r: 2.4, color: '#7dd3fc', name: 'Seginus' },
      { x: -10, y: -75, r: 2.3, color: '#ffffff', name: 'Nekkar' }
    ],
    edges: [[1, 0], [0, 2], [2, 3], [3, 4], [4, 1]]
  },

  // --- SUMMER SKY ---
  {
    id: 'cygnus',
    name: 'CYGNUS',
    season: 'Summer',
    months: [5, 6, 7, 8], // Jun - Sep
    baseAngle: 5.32, // ~305 deg
    radialDist: 0.35,
    code: 'Northern Cross · Deneb',
    keyStarIdx: 0,
    stars: [
      { x: 0, y: -70, r: 3.3, color: '#00f0ff', name: 'Deneb' },
      { x: 0, y: -12, r: 2.8, color: '#ffffff', name: 'Sadr' },
      { x: 0, y: 65, r: 2.5, color: '#f59e0b', name: 'Albireo' },
      { x: -65, y: -20, r: 2.5, color: '#38bdf8', name: 'Gienah' },
      { x: 60, y: -15, r: 2.6, color: '#7dd3fc', name: 'δ-Cygni' }
    ],
    edges: [[0, 1], [1, 2], [3, 1], [1, 4]]
  },
  {
    id: 'lyra',
    name: 'LYRA',
    season: 'Summer',
    months: [5, 6, 7], // Jun - Aug
    baseAngle: 4.85, // ~278 deg
    radialDist: 0.38,
    code: 'α Lyr · Vega (Sapphire)',
    keyStarIdx: 0,
    stars: [
      { x: -15, y: -50, r: 3.6, color: '#7dd3fc', name: 'Vega' }, // Top 5 brightest sapphire star
      { x: -35, y: 5, r: 2.3, color: '#38bdf8', name: 'δ-Lyrae' },
      { x: 15, y: 15, r: 2.4, color: '#00f0ff', name: 'Sheliak' },
      { x: -15, y: 55, r: 2.5, color: '#ffffff', name: 'Sulafat' }
    ],
    edges: [[0, 1], [0, 2], [1, 3], [2, 3]]
  },
  {
    id: 'scorpius',
    name: 'SCORPIUS',
    season: 'Summer',
    months: [5, 6, 7], // Jun - Aug
    baseAngle: 4.38, // ~251 deg
    radialDist: 0.39,
    code: 'α Sco · Antares (Heart of Scorpion)',
    keyStarIdx: 2,
    stars: [
      { x: -65, y: -50, r: 2.6, color: '#38bdf8', name: 'Graffias' },
      { x: -45, y: -25, r: 2.5, color: '#00f0ff', name: 'Dschubba' },
      { x: -20, y: 5, r: 3.4, color: '#ef4444', name: 'Antares' }, // Crimson Supergiant
      { x: 5, y: 35, r: 2.4, color: '#ffffff', name: 'Larawag' },
      { x: 35, y: 60, r: 2.6, color: '#38bdf8', name: 'Sargas' },
      { x: 65, y: 35, r: 2.9, color: '#00f0ff', name: 'Shaula' }
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]]
  }
];
