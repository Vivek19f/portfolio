import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Gamepad2, Mail } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { SUBTITLES } from '../../data/constants';

export default function HomeTab({ setActiveTab }) {
  const [subtitleIndex, setSubtitleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSubtitleIndex((prev) => (prev + 1) % SUBTITLES.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.main 
      key="home"
      className="home-single-view"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.15 }}
    >
      <div className="home-hero-container">
        {/* Availability Badge */}
        <div className="home-status-badge font-mono">
          <span className="status-dot-pulse"></span>
          <span>Available for Staff & Lead Roles</span>
        </div>

        {/* Hero Name Title */}
        <h1 className="home-hero-title">
          <span className="text-white">VIVEK</span> <span className="text-accent">JHOORIA</span>
        </h1>

        {/* Dynamic Rotating Subtitle */}
        <div className="home-subtitle-container">
          <AnimatePresence mode="wait">
            <motion.p
              key={subtitleIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="home-dynamic-subtitle font-mono"
            >
              {SUBTITLES[subtitleIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Direct Action CTA Buttons */}
        <div className="home-cta-actions">
          <button 
            type="button"
            onClick={() => setActiveTab && setActiveTab('projects')}
            className="home-cta-btn home-cta-primary group"
          >
            <span>Explore Work</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab && setActiveTab('arcade')}
            className="home-cta-btn home-cta-secondary group"
          >
            <Gamepad2 size={16} className="text-accent group-hover:scale-110 transition-transform" />
            <span>Play Arcade</span>
          </button>

          <a 
            href="mailto:v.jhooria@gmail.com" 
            className="home-cta-btn home-cta-ghost group"
          >
            <Mail size={16} className="group-hover:text-accent transition-colors" />
            <span>Get in Touch</span>
          </a>
        </div>
      </div>

      {/* Docked Single-View Footer */}
      <footer className="home-docked-footer">
        <div className="home-footer-meta font-mono">
          <span>Based in India</span>
          <span className="meta-dot">•</span>
          <span>TypeScript / Python / Node.js</span>
        </div>

        <div className="home-footer-socials">
          <a 
            href="https://github.com/Vivek19f" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="home-social-link font-mono"
            aria-label="GitHub Profile"
          >
            <FaGithub size={15} />
            <span>GitHub</span>
          </a>
          <a 
            href="https://www.linkedin.com/in/vivekjhooria/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="home-social-link font-mono"
            aria-label="LinkedIn Profile"
          >
            <FaLinkedin size={15} />
            <span>LinkedIn</span>
          </a>
          <a 
            href="mailto:v.jhooria@gmail.com" 
            className="home-social-link font-mono"
            aria-label="Email Contact"
          >
            <Mail size={15} />
            <span>Email</span>
          </a>
        </div>

        <div className="home-footer-cmd font-mono hidden md:flex items-center gap-1.5 text-xs">
          <span>Press</span>
          <kbd className="home-kbd">⌘K</kbd>
          <span>for console</span>
        </div>
      </footer>
    </motion.main>
  );
}
