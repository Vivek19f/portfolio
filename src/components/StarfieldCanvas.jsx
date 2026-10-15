import React, { useEffect, useRef } from 'react';

export default function StarfieldCanvas() {
  const canvasRef = useRef(null);

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

    // Generate stars
    const numStars = 190;
    const stars = [];
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.3,
        baseAlpha: Math.random() * 0.7 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
        speedX: (Math.random() - 0.5) * 0.18,
        speedY: (Math.random() - 0.5) * 0.18,
        depth: Math.random() * 0.8 + 0.2,
        color: Math.random() > 0.82 ? '#00f0ff' : Math.random() > 0.65 ? '#38bdf8' : '#ffffff',
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

      const parallaxX = ((mouseX - width / 2) / (width / 2)) * 18;
      const parallaxY = ((mouseY - height / 2) / (height / 2)) * 18;

      ctx.clearRect(0, 0, width, height);

      // Render stars
      stars.forEach((star) => {
        star.x += star.speedX * warpFactor;
        star.y += star.speedY * warpFactor;

        // Wrap around boundaries
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        const currentAlpha =
          star.baseAlpha + Math.sin(tick * star.twinkleSpeed + star.twinkleOffset) * 0.25;
        const finalAlpha = Math.max(0.1, Math.min(1, currentAlpha));

        const drawX = star.x - parallaxX * star.depth;
        const drawY = star.y - parallaxY * star.depth;

        if (isWarping && warpFactor > 3) {
          // Hyperspace warp lines
          ctx.beginPath();
          ctx.moveTo(drawX, drawY);
          ctx.lineTo(drawX - star.speedX * warpFactor * 4, drawY - star.speedY * warpFactor * 4);
          ctx.strokeStyle = star.color;
          ctx.lineWidth = star.radius * 1.5;
          ctx.globalAlpha = 0.8;
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(drawX, drawY, star.radius, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.globalAlpha = finalAlpha;
          ctx.shadowBlur = star.color === '#00f0ff' ? 8 : star.color === '#38bdf8' ? 6 : 2;
          ctx.shadowColor = star.color;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Handle shooting stars
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
