import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SUBTITLES } from '../../data/constants';

export default function HomeTab() {
  const [subtitleIndex, setSubtitleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSubtitleIndex((prev) => (prev + 1) % SUBTITLES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.main 
      key="home"
      className="main-content centered-hero"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="hero-section">
        <h1>VIVEK JHOORIA</h1>
        <div className="subtitle-container">
          <AnimatePresence mode="wait">
            <motion.p
              key={subtitleIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="dynamic-subtitle"
            >
              {SUBTITLES[subtitleIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </motion.main>
  );
}
