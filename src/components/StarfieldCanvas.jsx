import React, { useEffect, useRef } from 'react';
import { CELESTIAL_CONSTELLATIONS } from '../data/celestialCatalog';
import {
  DEEP_SKY_OBJECTS,
  getActiveMeteorShower,
  isEasterSeason,
  getEasterDate,
} from '../data/celestialEvents';
import {
  calculateDesiredSkyAngle,
  normalizeApparentAngle,
  computeConstellationVisibility,
  computeConstellationScreenAnchor,
} from '../utils/celestialMath';
import { soundEngine } from '../utils/soundEngine';

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

    // Camera shake for supernova detonation
    let shakeIntensity = 0;

    // Celestial sky angle interpolation
    let currentSkyAngle = calculateDesiredSkyAngle(stateRef.current.month, stateRef.current.year);
    let autoOrbitAccumulator = 0;

    // Hover states for constellations and deep-sky objects
    const constellationHoverStates = {};
    CELESTIAL_CONSTELLATIONS.forEach((c) => {
      constellationHoverStates[c.id] = 0;
    });

    const dsoHoverStates = {};
    DEEP_SKY_OBJECTS.forEach((d) => {
      dsoHoverStates[d.id] = 0;
    });

    // Supernova Animation State
    let supernova = {
      active: false,
      tick: 0,
      maxTicks: 160,
      x: 0,
      y: 0,
      particles: [],
    };

    // Stored interactive object screen positions for click detection
    let interactiveTargets = [];

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

    const triggerSupernova = (customX, customY, isEasterTrigger = true) => {
      // Find Betelgeuse screen coordinates if not passed
      let sx = customX;
      let sy = customY;
      if (sx === undefined || sy === undefined) {
        const betelgeuseTarget = interactiveTargets.find((t) => t.id === 'betelgeuse');
        sx = betelgeuseTarget ? betelgeuseTarget.x : width / 2;
        sy = betelgeuseTarget ? betelgeuseTarget.y : height / 2;
      }

      soundEngine.playSupernova();
      shakeIntensity = 18;

      const particles = [];
      const numParticles = 65;
      for (let i = 0; i < numParticles; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 3;
        particles.push({
          x: sx,
          y: sy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 3 + 1.5,
          color: Math.random() > 0.5 ? '#00f0ff' : Math.random() > 0.3 ? '#f59e0b' : '#ffffff',
          life: 0,
          maxLife: Math.random() * 50 + 70,
        });
      }

      supernova = {
        active: true,
        tick: 0,
        maxTicks: 150,
        x: sx,
        y: sy,
        particles,
      };

      const easterInfo = getEasterDate(stateRef.current.year);
      const easterMonthName = ['March', 'April'][easterInfo.month - 2] || 'Spring';

      window.dispatchEvent(
        new CustomEvent('celestial-event-toast', {
          detail: {
            type: 'supernova',
            badge: '💥 EASTER SUPERNOVA',
            title: 'Betelgeuse Core Collapse Observed!',
            desc: `Alpha Orionis Type II supernova event triggered [Easter Epoch: ${easterMonthName} ${easterInfo.day}, ${stateRef.current.year}]. Relativistic shockwave expanding at 12,000 km/s!`,
            duration: 7000,
          },
        })
      );
    };

    const triggerMeteorBurst = () => {
      soundEngine.playMeteor();
      const currentMonth = stateRef.current.month;
      const shower = getActiveMeteorShower(currentMonth);
      const count = 7;
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          addShootingStar(true, shower);
        }, i * 90);
      }
    };

    const handleGlobalClick = (e) => {
      // Check if user clicked close to Betelgeuse or Deep Sky Objects
      const clickX = e.clientX;
      const clickY = e.clientY;

      for (const target of interactiveTargets) {
        const dist = Math.hypot(clickX - target.x, clickY - target.y);
        if (dist <= target.radius + 15) {
          if (target.id === 'betelgeuse') {
            triggerSupernova(target.x, target.y);
            return;
          }

          if (target.type === 'dso') {
            soundEngine.playSuccess();
            window.dispatchEvent(
              new CustomEvent('celestial-event-toast', {
                detail: {
                  type: 'dso',
                  badge: '🔭 DEEP-SKY OBJECT',
                  title: target.dso.name,
                  desc: `${target.dso.type} in ${target.dso.constellation} • Distance: ${target.dso.distance} • Magnitude: ${target.dso.magnitude}. ${target.dso.description}`,
                  duration: 6000,
                },
              })
            );
            return;
          }
        }
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleGlobalClick);
    window.addEventListener('starfield-warp', handleWarp);
    window.addEventListener('starfield-supernova', () => triggerSupernova());
    window.addEventListener('starfield-meteor-burst', triggerMeteorBurst);

    // Generate background field stars
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

    // Dynamic shooting stars & seasonal meteor showers
    const shootingStars = [];
    let lastShootingStarTime = Date.now();

    const addShootingStar = (isBurst = false, shower = null) => {
      const activeShower = shower || getActiveMeteorShower(stateRef.current.month);
      const angle = activeShower
        ? (activeShower.radiantAngle - currentSkyAngle) % (Math.PI * 2) + (Math.random() - 0.5) * 0.3
        : Math.PI / 4 + (Math.random() - 0.5) * 0.25;

      const startX = activeShower
        ? width / 2 + Math.cos(angle) * (width * 0.3) + (Math.random() - 0.5) * width * 0.4
        : Math.random() * width * 0.8;

      const startY = activeShower
        ? height / 2 + Math.sin(angle) * (height * 0.25) + (Math.random() - 0.5) * height * 0.3
        : Math.random() * height * 0.4;

      shootingStars.push({
        x: startX,
        y: startY,
        length: Math.random() * (isBurst ? 100 : 80) + 45,
        speed: Math.random() * 7 + 8,
        angle,
        alpha: 1,
        life: 0,
        maxLife: Math.random() * 35 + 30,
        color: activeShower ? activeShower.color : '#00f0ff',
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
        autoOrbitAccumulator += 0.0016;
      }

      const desiredBaseAngle = calculateDesiredSkyAngle(targetMonth, targetYear, autoOrbitAccumulator);
      currentSkyAngle += (desiredBaseAngle - currentSkyAngle) * 0.05;

      ctx.clearRect(0, 0, width, height);
      interactiveTargets = [];

      // Screen shake decay
      let currentShakeX = 0;
      let currentShakeY = 0;
      if (shakeIntensity > 0.1) {
        currentShakeX = (Math.random() - 0.5) * shakeIntensity;
        currentShakeY = (Math.random() - 0.5) * shakeIntensity;
        shakeIntensity *= 0.92;
      }

      ctx.save();
      if (shakeIntensity > 0.1) {
        ctx.translate(currentShakeX, currentShakeY);
      }

      const centerX = width / 2;
      const centerY = height / 2;
      const isMobile = width < 768;
      const scale = isMobile
        ? Math.max(0.38, Math.min(0.52, width / 750))
        : Math.max(0.7, Math.min(1.0, width / 1440));

      const isEasterActive = isEasterSeason(targetMonth, targetYear);

      // -------------------------------------------------------------
      // 1. RENDER ROTATING BACKGROUND STARS
      // -------------------------------------------------------------
      stars.forEach((star) => {
        const starRotatedAngle = star.theta - currentSkyAngle * star.depth;
        const starDistX = Math.cos(starRotatedAngle) * (star.radiusDist * width * 1.05);
        const starDistY = Math.sin(starRotatedAngle) * (star.radiusDist * height * 0.95);

        let drawX = centerX + starDistX - parallaxX * star.depth;
        let drawY = centerY + starDistY - parallaxY * star.depth;

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
      // 2. RENDER DEEP-SKY OBJECTS (M31 Andromeda, M45 Pleiades, M42 Orion Nebula)
      // -------------------------------------------------------------
      DEEP_SKY_OBJECTS.forEach((dso) => {
        const apparentAngle = normalizeApparentAngle(dso.baseAngle, currentSkyAngle);
        const { isVisible, factor: visibilityFactor } = computeConstellationVisibility(apparentAngle);
        if (!isVisible) return;

        const { anchorX, anchorY } = computeConstellationScreenAnchor({
          centerX,
          centerY,
          width,
          height,
          radialDist: dso.radialDist,
          apparentAngle,
          tick,
          baseAngle: dso.baseAngle,
          parallaxX,
          parallaxY,
        });

        // Hover proximity
        const distToMouse = Math.hypot(mouseX - anchorX, mouseY - anchorY);
        const targetHover = !isMobile && distToMouse < 180 ? Math.max(0, 1 - distToMouse / 180) : 0;
        const currentHover = (dsoHoverStates[dso.id] =
          (dsoHoverStates[dso.id] || 0) + (targetHover - (dsoHoverStates[dso.id] || 0)) * 0.08);

        // Register interactive target
        interactiveTargets.push({
          id: dso.id,
          type: 'dso',
          x: anchorX,
          y: anchorY,
          radius: 28 * scale,
          dso,
        });

        ctx.save();
        ctx.translate(anchorX, anchorY);

        if (dso.id === 'm31-andromeda') {
          // ANDROMEDA GALAXY (M31): Rotated spiral galaxy disc with dense core
          ctx.rotate(dso.tilt);

          const discW = dso.width * scale * (1 + currentHover * 0.25);
          const discH = dso.height * scale * (1 + currentHover * 0.25);
          const baseAlpha = (isMobile ? 0.25 : 0.45 + currentHover * 0.35) * visibilityFactor;

          // Outer spiral haze
          const outerGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, discW);
          outerGrad.addColorStop(0, 'rgba(255, 251, 235, 0.7)');
          outerGrad.addColorStop(0.25, dso.colorArms);
          outerGrad.addColorStop(0.65, dso.colorGlow);
          outerGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');

          ctx.beginPath();
          ctx.ellipse(0, 0, discW, discH, 0, 0, Math.PI * 2);
          ctx.fillStyle = outerGrad;
          ctx.globalAlpha = baseAlpha;
          ctx.fill();

          // Intense galactic supermassive core
          ctx.beginPath();
          ctx.arc(0, 0, 3.2 * scale, 0, Math.PI * 2);
          ctx.fillStyle = dso.colorCore;
          ctx.globalAlpha = Math.min(1, baseAlpha * 1.5);
          ctx.fill();
        } else if (dso.id === 'm45-pleiades') {
          // THE PLEIADES (M45): Reflection nebulosity surrounding 7 sapphire stars
          const nebGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, 34 * scale);
          nebGrad.addColorStop(0, 'rgba(0, 240, 255, 0.45)');
          nebGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.25)');
          nebGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');

          ctx.beginPath();
          ctx.arc(0, 0, 34 * scale * (1 + currentHover * 0.2), 0, Math.PI * 2);
          ctx.fillStyle = nebGrad;
          ctx.globalAlpha = (isMobile ? 0.2 : 0.38 + currentHover * 0.3) * visibilityFactor;
          ctx.fill();

          // Render the 7 clustered stars
          dso.stars.forEach((st) => {
            const sx = st.x * scale;
            const sy = st.y * scale;
            ctx.beginPath();
            ctx.arc(sx, sy, st.r * scale, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = (0.7 + Math.sin(tick * 0.04 + st.r) * 0.2) * visibilityFactor;
            ctx.fill();

            // Soft cyan halo
            ctx.beginPath();
            ctx.arc(sx, sy, st.r * scale * 2.2, 0, Math.PI * 2);
            ctx.fillStyle = '#00f0ff';
            ctx.globalAlpha = 0.25 * visibilityFactor;
            ctx.fill();
          });
        } else if (dso.id === 'm42-orion-nebula') {
          // ORION NEBULA (M42): Glowing magenta interstellar cloud
          const nebGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, dso.radius * scale * 1.3);
          nebGrad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
          nebGrad.addColorStop(0.3, dso.colorCore);
          nebGrad.addColorStop(0.7, dso.colorGlow);
          nebGrad.addColorStop(1, 'transparent');

          ctx.beginPath();
          ctx.arc(0, 0, dso.radius * scale * (1 + currentHover * 0.25), 0, Math.PI * 2);
          ctx.fillStyle = nebGrad;
          ctx.globalAlpha = (isMobile ? 0.22 : 0.4 + currentHover * 0.3) * visibilityFactor;
          ctx.fill();
        }

        ctx.restore();

        // Sci-Fi Deep-Sky HUD (Desktop hover)
        if (!isMobile && !isWarping && visibilityFactor > 0.25 && currentHover > 0.08) {
          const hudAlpha = Math.min(0.85, currentHover * visibilityFactor);
          ctx.save();
          ctx.globalAlpha = hudAlpha;
          ctx.font = '600 11px "JetBrains Mono", monospace';
          ctx.fillStyle = '#38bdf8';

          const labelX = anchorX - 60;
          const labelY = anchorY - 45 * scale;

          ctx.fillText(`✦ ${dso.name}`, labelX, labelY);

          ctx.font = '400 9px "JetBrains Mono", monospace';
          ctx.fillStyle = 'rgba(226, 232, 240, 0.75)';
          ctx.fillText(`${dso.distance} • ${dso.magnitude} mag`, labelX, labelY + 13);

          // Sleek bracket indicator
          ctx.beginPath();
          ctx.moveTo(labelX - 6, labelY - 11);
          ctx.lineTo(labelX - 6, labelY + 16);
          ctx.lineTo(labelX + 2, labelY + 16);
          ctx.strokeStyle = `rgba(56, 189, 248, ${hudAlpha * 0.8})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.restore();
        }
      });

      // -------------------------------------------------------------
      // 3. RENDER SEASONAL CONSTELLATIONS & BETELGEUSE
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

        const distToMouse = Math.hypot(mouseX - anchorX, mouseY - anchorY);
        const targetHover = !isMobile && distToMouse < 260 ? Math.max(0, 1 - distToMouse / 260) : 0;
        const currentHover = (constellationHoverStates[c.id] =
          (constellationHoverStates[c.id] || 0) +
          (targetHover - (constellationHoverStates[c.id] || 0)) * 0.08);

        // Precompute star screen positions
        const starPositions = c.stars.map((s, sIdx) => {
          const sx = anchorX + s.x * scale;
          const sy = anchorY + s.y * scale;
          const pulse = Math.sin(tick * 0.035 + sIdx * 0.8 + c.baseAngle) * 0.25;

          // Register Betelgeuse in Orion (star index 0) for click interaction
          if (c.id === 'orion' && sIdx === 0) {
            interactiveTargets.push({
              id: 'betelgeuse',
              type: 'star',
              x: sx,
              y: sy,
              radius: 18 * scale,
            });
          }

          return { ...s, sx, sy, pulse };
        });

        // A. Draw connecting lines
        const baseLineAlpha =
          (isMobile
            ? 0.08 + Math.sin(tick * 0.025 + c.baseAngle) * 0.02
            : 0.16 + Math.sin(tick * 0.025 + c.baseAngle) * 0.03) * visibilityFactor;

        const lineAlpha = isWarping
          ? 0.02
          : Math.min(isMobile ? 0.16 : 0.35, baseLineAlpha + currentHover * 0.22);

        c.edges.forEach(([fromIdx, toIdx]) => {
          const from = starPositions[fromIdx];
          const to = starPositions[toIdx];
          if (!from || !to) return;

          if (!isMobile) {
            ctx.beginPath();
            ctx.moveTo(from.sx, from.sy);
            ctx.lineTo(to.sx, to.sy);
            ctx.strokeStyle = '#00f0ff';
            ctx.lineWidth = 1.6;
            ctx.globalAlpha = lineAlpha * 0.22;
            ctx.stroke();
          }

          ctx.beginPath();
          ctx.moveTo(from.sx, from.sy);
          ctx.lineTo(to.sx, to.sy);
          ctx.strokeStyle = isMobile ? 'rgba(56, 189, 248, 0.5)' : '#38bdf8';
          ctx.lineWidth = isMobile ? 0.75 : 0.95 + currentHover * 0.35;
          ctx.globalAlpha = lineAlpha;
          ctx.stroke();
        });

        // B. Draw constellation stars & Betelgeuse Easter flare
        starPositions.forEach((s, sIdx) => {
          const isBetelgeuse = c.id === 'orion' && sIdx === 0;

          // If during Easter, Betelgeuse pulses with unstable red-gold core flare
          const easterFlare = isBetelgeuse && isEasterActive
            ? Math.sin(tick * 0.1) * 0.4 + 0.6
            : 0;

          const starAlpha = Math.max(
            0.12,
            Math.min(
              isMobile ? 0.48 : 0.75,
              ((isMobile ? 0.36 : 0.56) + s.pulse * 0.12 + currentHover * 0.25 + easterFlare * 0.3) *
                visibilityFactor
            )
          );

          if (isWarping && warpFactor > 3) {
            ctx.beginPath();
            ctx.moveTo(s.sx, s.sy);
            ctx.lineTo(s.sx - 2 * warpFactor, s.sy - 2 * warpFactor);
            ctx.strokeStyle = s.color;
            ctx.lineWidth = s.r * 1.5;
            ctx.globalAlpha = 0.8;
            ctx.stroke();
          } else {
            // Betelgeuse Pre-Supernova Easter Pulsing Ring
            if (isBetelgeuse && isEasterActive) {
              ctx.beginPath();
              ctx.arc(s.sx, s.sy, (s.r * 2.8 + easterFlare * 6) * scale, 0, Math.PI * 2);
              ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
              ctx.lineWidth = 1.2;
              ctx.globalAlpha = (0.4 + easterFlare * 0.4) * visibilityFactor;
              ctx.stroke();
            }

            // Soft outer aura
            ctx.beginPath();
            ctx.arc(s.sx, s.sy, s.r * (isMobile ? 1.3 : 1.7 + currentHover * 0.6), 0, Math.PI * 2);
            ctx.fillStyle = s.color;
            ctx.globalAlpha = (isMobile ? 0.08 : 0.15 + currentHover * 0.12) * starAlpha;
            ctx.fill();

            // Inner glowing node
            ctx.beginPath();
            ctx.arc(s.sx, s.sy, s.r * (isMobile ? 0.85 : 1.05 + currentHover * 0.2), 0, Math.PI * 2);
            ctx.fillStyle = s.color;
            ctx.globalAlpha = starAlpha * (isMobile ? 0.65 : 0.82);
            ctx.fill();

            // Diamond pinpoint center
            ctx.beginPath();
            ctx.arc(s.sx, s.sy, Math.max(0.6, s.r * 0.4), 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = (isMobile ? 0.4 : 0.65) * visibilityFactor;
            ctx.fill();

            // Lens flare cross spike
            if (!isMobile && (sIdx === c.keyStarIdx || (isBetelgeuse && isEasterActive)) && currentHover > 0.06) {
              const spikeLen = s.r * 1.8 + currentHover * 2.5 + easterFlare * 3;
              const spikeAlpha = 0.3 * (currentHover + easterFlare) * starAlpha;
              ctx.strokeStyle = isBetelgeuse ? '#f59e0b' : '#00f0ff';
              ctx.lineWidth = 0.8;
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
        if (!isMobile && !isWarping && visibilityFactor > 0.2 && currentHover > 0.06) {
          const hudAlpha = Math.min(0.75, currentHover * 0.85 * visibilityFactor);
          ctx.save();
          ctx.globalAlpha = hudAlpha;
          ctx.font = '600 11px "JetBrains Mono", monospace';
          ctx.fillStyle = '#00f0ff';

          const labelX = anchorX - 55;
          const labelY = anchorY - 80 * scale;

          ctx.fillText(`⟡ ${c.name}`, labelX, labelY);

          ctx.font = '400 9px "JetBrains Mono", monospace';
          ctx.fillStyle = 'rgba(241, 245, 249, 0.72)';
          const subtitle = c.id === 'orion' && isEasterActive
            ? 'α Ori (Betelgeuse) [Unstable Easter Epoch Core - Click!]'
            : c.code;
          ctx.fillText(subtitle, labelX, labelY + 13);

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
      // 4. ACTIVE SUPERNOVA SHOCKWAVE & PARTICLE FIELD
      // -------------------------------------------------------------
      if (supernova.active) {
        supernova.tick++;
        const progress = supernova.tick / supernova.maxTicks;

        // Blinding flash at start
        if (supernova.tick < 20) {
          const flashAlpha = Math.max(0, 1 - supernova.tick / 20) * 0.85;
          const flashGrad = ctx.createRadialGradient(
            supernova.x,
            supernova.y,
            10,
            supernova.x,
            supernova.y,
            Math.max(width, height) * 0.9
          );
          flashGrad.addColorStop(0, `rgba(255, 255, 255, ${flashAlpha})`);
          flashGrad.addColorStop(0.25, `rgba(0, 240, 255, ${flashAlpha * 0.8})`);
          flashGrad.addColorStop(0.6, `rgba(245, 158, 11, ${flashAlpha * 0.4})`);
          flashGrad.addColorStop(1, 'transparent');

          ctx.beginPath();
          ctx.arc(supernova.x, supernova.y, Math.max(width, height) * 0.9, 0, Math.PI * 2);
          ctx.fillStyle = flashGrad;
          ctx.fill();
        }

        // Relativistic expanding shockwave ring
        const shockRadius = progress * Math.min(width, height) * 0.75;
        const shockAlpha = Math.max(0, 1 - progress) * 0.9;

        ctx.beginPath();
        ctx.arc(supernova.x, supernova.y, shockRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 240, 255, ${shockAlpha})`;
        ctx.lineWidth = Math.max(1, 4 * (1 - progress));
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(supernova.x, supernova.y, shockRadius * 0.96, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(245, 158, 11, ${shockAlpha * 0.7})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Supernova Ejecta Particles
        supernova.particles.forEach((p) => {
          p.life++;
          p.x += p.vx;
          p.y += p.vy;
          const pAlpha = Math.max(0, 1 - p.life / p.maxLife);

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (1 - p.life / p.maxLife * 0.5), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = pAlpha;
          ctx.fill();
        });

        if (supernova.tick >= supernova.maxTicks) {
          supernova.active = false;
        }
      }

      // -------------------------------------------------------------
      // 5. SHOOTING STARS & SEASONAL METEOR SHOWERS
      // -------------------------------------------------------------
      const activeShower = getActiveMeteorShower(targetMonth);
      const meteorInterval = activeShower ? 1800 : 6000;
      const meteorProbability = activeShower ? 0.04 : 0.015;

      if (Date.now() - lastShootingStarTime > meteorInterval && Math.random() < meteorProbability) {
        addShootingStar(false, activeShower);
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
        grad.addColorStop(0, s.color || 'rgba(0, 240, 255, 1)');
        grad.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.globalAlpha = s.alpha;
        ctx.stroke();

        if (s.life >= s.maxLife) {
          shootingStars.splice(i, 1);
        }
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleGlobalClick);
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
