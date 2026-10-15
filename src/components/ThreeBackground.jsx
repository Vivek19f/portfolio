import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion, useTransform, useMotionValue } from 'framer-motion';

export default function ThreeBackground({ isSplineLoaded, setIsSplineLoaded, scrollY }) {
  const [vantaEffect, setVantaEffect] = useState(null);
  const myRef = useRef(null);

  // Framer motion values mapped to scroll position
  const scrollValue = useMotionValue(0);
  
  useEffect(() => {
    scrollValue.set(scrollY);
  }, [scrollY, scrollValue]);

  const scale = useTransform(scrollValue, [0, 500], [1, 0.7]);
  const opacity = useTransform(scrollValue, [0, 500], [1, 0.3]);
  const y = useTransform(scrollValue, [0, 500], [0, 150]);

  useEffect(() => {
    setIsSplineLoaded(true);
    let effect = null;
    
    window.THREE = THREE;
    
    const loadVanta = async () => {
      try {
        await import('vanta/dist/vanta.globe.min');
        
        if (!vantaEffect && window.VANTA && window.VANTA.GLOBE) {
          effect = window.VANTA.GLOBE({
            el: myRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x4f46e5, 
            color2: 0x6366f1, 
            size: 1.2,
            backgroundColor: 0x000000
          });
          setVantaEffect(effect);
        }
      } catch (err) {
        console.error("Failed to load Vanta Globe", err);
      }
    };
    
    loadVanta();

    return () => {
      if (effect) effect.destroy();
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect, setIsSplineLoaded]);

  return (
    <motion.div 
      style={{ 
        position: 'absolute', 
        width: '100vw', 
        height: '100vh', 
        zIndex: 1, 
        top: 0, 
        left: 0,
        scale,
        opacity,
        y
      }} 
      ref={myRef}
    />
  );
}
