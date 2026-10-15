import React, { useEffect, useRef } from 'react';

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
      { x: -30, y: -45, r: 3.8, color: '#ffffff', name: 'Sirius' }, // Brightest star in night sky!
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
      { x: -15, y: -50, r: 3.6, color: '#7dd3fc', name: 'Vega' }, // Top 5 brightest sapphire star!
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

export default function StarfieldCanvas({ month = 9, year = 2026, isAutoOrbit = false }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({ month, year, isAutoOrbit });

  useEffect(() => {
    stateRef.current = { month, year, isAutoOrbit };
  }, [month, year, isAutoOrbit]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    let warpFactor = 1;
    let isWarping = false;

    // Celestial sky angle interpolation
    // Target angle based on Month & Year (October = month 9 aligns with angle 0)
    let currentSkyAngle = ((stateRef.current.month - 9) * (Math.PI / 6)) + ((stateRef.current.year - 2026) * 0.02);
    let autoOrbitAccumulator = 0;

    // Track smooth hover states for each constellation
    const constellationHoverStates = {};
    CELESTIAL_CONSTELLATIONS.forEach(c => {
      constellationHoverStates[c.id] = 0;
    });

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    const handleWarp = () => {
      isWarping = true;
      warpFactor = 16;
      setTimeout(() => {
        const decay = setInterval(() => {
          warpFactor *= 0.85;
          if (warpFactor <= 1.05) {
            warpFactor = 1;
            isWarping = false;
            clearInterval(decay);
          }
        }, 50);
      }, 1600);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('starfield-warp', handleWarp);

    // Generate background field stars mapped on celestial sphere
    const numStars = 160;
    const stars = [];
    for (let i = 0; i < numStars; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radiusDist = Math.random() * 0.48 + 0.05;
      stars.push({
        theta,
        radiusDist,
        radius: Math.random() * 1.5 + 0.3,
        baseAlpha: Math.random() * 0.65 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
        depth: Math.random() * 0.75 + 0.25,
        color: Math.random() > 0.8 ? '#00f0ff' : Math.random() > 0.6 ? '#38bdf8' : '#ffffff',
      });
    }

    // Shooting stars
    const shootingStars = [];
    let lastShootingStarTime = Date.now();

    const addShootingStar = () => {
      shootingStars.push({
        x: Math.random() * width * 0.8,
        y: Math.random() * height * 0.4,
        length: Math.random() * 80 + 40,
        speed: Math.random() * 6 + 7,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
        alpha: 1,
        life: 0,
        maxLife: Math.random() * 40 + 30,
      });
    };

    let tick = 0;
    const render = () => {
      tick++;
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const parallaxX = ((mouseX - width / 2) / (width / 2)) * 16;
      const parallaxY = ((mouseY - height / 2) / (height / 2)) * 16;

      // Handle Celestial Rotation Interpolation
      const { month: targetMonth, year: targetYear, isAutoOrbit: activeOrbit } = stateRef.current;
      if (activeOrbit) {
        autoOrbitAccumulator += 0.0016; // Smooth planetarium tour
      }
      
      const desiredBaseAngle = ((targetMonth - 9) * (Math.PI / 6)) + ((targetYear - 2026) * 0.02) + autoOrbitAccumulator;
      // Smooth celestial rotation with inertia
      currentSkyAngle += (desiredBaseAngle - currentSkyAngle) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const minDimension = Math.min(width, height);
      const scale = Math.max(0.75, Math.min(1.05, width / 1440));

      // -------------------------------------------------------------
      // 1. RENDER ROTATING BACKGROUND STARS
      // -------------------------------------------------------------
      stars.forEach((star) => {
        const starRotatedAngle = star.theta - currentSkyAngle * star.depth;
        const starDistX = Math.cos(starRotatedAngle) * (star.radiusDist * width * 1.05);
        const starDistY = Math.sin(starRotatedAngle) * (star.radiusDist * height * 0.95);

        let drawX = centerX + starDistX - parallaxX * star.depth;
        let drawY = centerY + starDistY - parallaxY * star.depth;

        // Wrap gently if off viewport
        if (drawX < 0) drawX += width;
        if (drawX > width) drawX -= width;
        if (drawY < 0) drawY += height;
        if (drawY > height) drawY -= height;

        const currentAlpha =
          star.baseAlpha + Math.sin(tick * star.twinkleSpeed + star.twinkleOffset) * 0.25;
        const finalAlpha = Math.max(0.1, Math.min(1, currentAlpha));

        if (isWarping && warpFactor > 3) {
          ctx.beginPath();
          ctx.moveTo(drawX, drawY);
          ctx.lineTo(drawX - 2 * warpFactor, drawY - 2 * warpFactor);
          ctx.strokeStyle = star.color;
          ctx.lineWidth = star.radius * 1.5;
          ctx.globalAlpha = 0.8;
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(drawX, drawY, star.radius, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.globalAlpha = finalAlpha;
          ctx.fill();

          if (star.color !== '#ffffff' && star.radius > 0.75) {
            ctx.beginPath();
            ctx.arc(drawX, drawY, star.radius * 2.2, 0, Math.PI * 2);
            ctx.fillStyle = star.color;
            ctx.globalAlpha = finalAlpha * 0.2;
            ctx.fill();
          }
        }
      });

      // -------------------------------------------------------------
      // 2. RENDER SEASONAL CONSTELLATIONS
      // -------------------------------------------------------------
      CELESTIAL_CONSTELLATIONS.forEach((c) => {
        // Compute apparent celestial angle relative to current sky orientation
        let apparentAngle = (c.baseAngle - currentSkyAngle) % (Math.PI * 2);
        if (apparentAngle > Math.PI) apparentAngle -= Math.PI * 2;
        if (apparentAngle < -Math.PI) apparentAngle += Math.PI * 2;

        // Visibility calculation: constellations rotate above and below Earth horizon
        // When |apparentAngle| < 105 degrees (1.83 rad), the constellation is overhead in night sky
        const cosAngle = Math.cos(apparentAngle);
        const isVisible = cosAngle > -0.25;

        // Smooth visibility transition
        const visibilityFactor = Math.max(0, Math.min(1, (cosAngle + 0.25) / 0.85));
        if (!isVisible || visibilityFactor <= 0.02) return;

        // Position constellation around celestial dome
        // Use an elliptical projection to hug the open screen gutters & margins
        const orbitalRadiusX = width * c.radialDist * 1.15;
        const orbitalRadiusY = height * c.radialDist * 1.05;

        const cAnchorX = centerX + Math.cos(apparentAngle) * orbitalRadiusX;
        const cAnchorY = centerY + Math.sin(apparentAngle) * orbitalRadiusY;

        // Subtle zero-g drift
        const driftX = Math.sin(tick * 0.007 + c.baseAngle) * 5;
        const driftY = Math.cos(tick * 0.006 + c.baseAngle * 1.4) * 5;

        const anchorX = cAnchorX + driftX - parallaxX * 0.35;
        const anchorY = cAnchorY + driftY - parallaxY * 0.35;

        // Mouse proximity check
        const distToMouse = Math.hypot(mouseX - anchorX, mouseY - anchorY);
        const targetHover = distToMouse < 260 ? Math.max(0, 1 - distToMouse / 260) : 0;
        const currentHover = (constellationHoverStates[c.id] =
          (constellationHoverStates[c.id] || 0) + (targetHover - (constellationHoverStates[c.id] || 0)) * 0.08);

        // Precompute star screen positions
        const starPositions = c.stars.map((s, sIdx) => {
          const sx = anchorX + s.x * scale;
          const sy = anchorY + s.y * scale;
          const pulse = Math.sin(tick * 0.035 + sIdx * 0.8 + c.baseAngle) * 0.25;
          return { ...s, sx, sy, pulse };
        });

        // A. Draw connecting lines
        const baseLineAlpha = (0.42 + Math.sin(tick * 0.025 + c.baseAngle) * 0.06) * visibilityFactor;
        const lineAlpha = isWarping ? 0.05 : Math.min(0.92, baseLineAlpha + currentHover * 0.4);

        c.edges.forEach(([fromIdx, toIdx]) => {
          const from = starPositions[fromIdx];
          const to = starPositions[toIdx];
          if (!from || !to) return;

          // Outer glowing halo line
          ctx.beginPath();
          ctx.moveTo(from.sx, from.sy);
          ctx.lineTo(to.sx, to.sy);
          ctx.strokeStyle = '#00f0ff';
          ctx.lineWidth = 3.2;
          ctx.globalAlpha = lineAlpha * 0.35;
          ctx.stroke();

          // Core bright vector line
          ctx.beginPath();
          ctx.moveTo(from.sx, from.sy);
          ctx.lineTo(to.sx, to.sy);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.4 + currentHover * 0.8;
          ctx.globalAlpha = lineAlpha;
          ctx.stroke();
        });

        // B. Draw constellation stars
        starPositions.forEach((s, sIdx) => {
          const starAlpha = Math.max(0.4, Math.min(1, (0.95 + s.pulse * 0.3 + currentHover * 0.2) * visibilityFactor));

          if (isWarping && warpFactor > 3) {
            ctx.beginPath();
            ctx.moveTo(s.sx, s.sy);
            ctx.lineTo(s.sx - 2 * warpFactor, s.sy - 2 * warpFactor);
            ctx.strokeStyle = s.color;
            ctx.lineWidth = s.r * 1.5;
            ctx.globalAlpha = 0.8;
            ctx.stroke();
          } else {
            // Radiant outer aura
            ctx.beginPath();
            ctx.arc(s.sx, s.sy, s.r * (2.8 + currentHover * 1.5), 0, Math.PI * 2);
            ctx.fillStyle = s.color;
            ctx.globalAlpha = (0.35 + currentHover * 0.3) * starAlpha;
            ctx.fill();

            // Inner glowing node
            ctx.beginPath();
            ctx.arc(s.sx, s.sy, s.r * (1.3 + currentHover * 0.25), 0, Math.PI * 2);
            ctx.fillStyle = s.color;
            ctx.globalAlpha = starAlpha;
            ctx.fill();

            // Diamond pinpoint center
            ctx.beginPath();
            ctx.arc(s.sx, s.sy, Math.max(1.0, s.r * 0.5), 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = 0.98 * visibilityFactor;
            ctx.fill();

            // Lens flare cross spike on key primary stars
            if (sIdx === c.keyStarIdx) {
              const spikeLen = (s.r * 2.8 + currentHover * 3.5);
              const spikeAlpha = (0.45 + currentHover * 0.4) * starAlpha;
              ctx.strokeStyle = '#00f0ff';
              ctx.lineWidth = 1;
              ctx.globalAlpha = spikeAlpha;

              ctx.beginPath();
              ctx.moveTo(s.sx - spikeLen, s.sy);
              ctx.lineTo(s.sx + spikeLen, s.sy);
              ctx.moveTo(s.sx, s.sy - spikeLen);
              ctx.lineTo(s.sx, s.sy + spikeLen);
              ctx.stroke();
            }
          }
        });

        // C. Sci-Fi Constellation HUD Telemetry
        if (!isWarping && visibilityFactor > 0.15) {
          const hudAlpha = Math.min(0.95, (0.32 + currentHover * 0.65) * visibilityFactor);
          ctx.save();
          ctx.globalAlpha = hudAlpha;
          ctx.font = '600 11px "JetBrains Mono", monospace';
          ctx.fillStyle = '#00f0ff';

          const labelX = anchorX - 55;
          const labelY = anchorY - 80 * scale;

          ctx.fillText(`⟡ ${c.name}`, labelX, labelY);

          ctx.font = '400 9px "JetBrains Mono", monospace';
          ctx.fillStyle = 'rgba(241, 245, 249, 0.72)';
          ctx.fillText(c.code, labelX, labelY + 13);

          // Subtle cyan bracket
          ctx.beginPath();
          ctx.moveTo(labelX - 6, labelY - 11);
          ctx.lineTo(labelX - 6, labelY + 16);
          ctx.lineTo(labelX + 2, labelY + 16);
          ctx.strokeStyle = `rgba(0, 240, 255, ${hudAlpha * 0.75})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.restore();
        }
      });

      // -------------------------------------------------------------
      // 3. SHOOTING STARS
      // -------------------------------------------------------------
      if (Date.now() - lastShootingStarTime > 6000 && Math.random() < 0.015) {
        addShootingStar();
        lastShootingStarTime = Date.now();
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.life++;
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.alpha = Math.max(0, 1 - s.life / s.maxLife);

        const tailX = s.x - Math.cos(s.angle) * s.length;
        const tailY = s.y - Math.sin(s.angle) * s.length;

        const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
        grad.addColorStop(0, `rgba(0, 240, 255, ${s.alpha})`);
        grad.addColorStop(1, 'rgba(0, 240, 255, 0)');

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (s.life >= s.maxLife) {
          shootingStars.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('starfield-warp', handleWarp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="starfield-container" aria-hidden="true">
      <div className="nebula-glow nebula-top" />
      <div className="nebula-glow nebula-bottom" />
      <canvas ref={canvasRef} className="starfield-canvas" />
    </div>
  );
}
