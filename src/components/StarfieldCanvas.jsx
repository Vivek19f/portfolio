import React, { useEffect, useRef } from 'react';
import { CELESTIAL_CONSTELLATIONS } from '../data/celestialCatalog';
import {
  calculateDesiredSkyAngle,
  normalizeApparentAngle,
  computeConstellationVisibility,
  computeConstellationScreenAnchor
} from '../utils/celestialMath';

// Re-export catalog for consumers
export { CELESTIAL_CONSTELLATIONS };


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
    let currentSkyAngle = calculateDesiredSkyAngle(stateRef.current.month, stateRef.current.year);
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
      
      const desiredBaseAngle = calculateDesiredSkyAngle(targetMonth, targetYear, autoOrbitAccumulator);
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
        const apparentAngle = normalizeApparentAngle(c.baseAngle, currentSkyAngle);
        const { isVisible, factor: visibilityFactor } = computeConstellationVisibility(apparentAngle);
        if (!isVisible) return;

        const { anchorX, anchorY } = computeConstellationScreenAnchor({
          centerX,
          centerY,
          width,
          height,
          radialDist: c.radialDist,
          apparentAngle,
          tick,
          baseAngle: c.baseAngle,
          parallaxX,
          parallaxY,
        });

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
