import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, ChevronLeft, ChevronRight, Play, Pause, RotateCcw, 
  Sparkles, X, ChevronUp, ChevronDown 
} from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

const MONTHS = [
  { short: 'JAN', full: 'January', season: 'Winter' },
  { short: 'FEB', full: 'February', season: 'Winter' },
  { short: 'MAR', full: 'March', season: 'Spring' },
  { short: 'APR', full: 'April', season: 'Spring' },
  { short: 'MAY', full: 'May', season: 'Spring' },
  { short: 'JUN', full: 'June', season: 'Summer' },
  { short: 'JUL', full: 'July', season: 'Summer' },
  { short: 'AUG', full: 'August', season: 'Summer' },
  { short: 'SEP', full: 'September', season: 'Autumn' },
  { short: 'OCT', full: 'October', season: 'Autumn' },
  { short: 'NOV', full: 'November', season: 'Autumn' },
  { short: 'DEC', full: 'December', season: 'Winter' },
];

const PRESETS = [
  { label: '❄️ Winter Orion', month: 0, year: 2026, desc: 'Orion, Sirius & Taurus' },
  { label: '🌱 Spring Dipper', month: 3, year: 2026, desc: 'Ursa Major & Leo' },
  { label: '☀️ Summer Triangle', month: 6, year: 2026, desc: 'Cygnus, Vega & Scorpius' },
  { label: '🍂 Autumn Cassiopeia', month: 9, year: 2026, desc: 'Cassiopeia & Pegasus' },
];

export default function CelestialController({ 
  month, 
  setMonth, 
  year, 
  setYear, 
  isAutoOrbit, 
  setIsAutoOrbit,
  isOpen,
  setIsOpen
}) {
  const currentMonthData = MONTHS[month] || MONTHS[9];

  React.useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('starfield-open-observer', handleOpen);
    return () => window.removeEventListener('starfield-open-observer', handleOpen);
  }, [setIsOpen]);

  const handlePrevMonth = (e) => {
    e?.stopPropagation();
    soundEngine.playClick();
    if (isAutoOrbit) setIsAutoOrbit(false);
    setMonth((m) => (m === 0 ? 11 : m - 1));
  };

  const handleNextMonth = (e) => {
    e?.stopPropagation();
    soundEngine.playClick();
    if (isAutoOrbit) setIsAutoOrbit(false);
    setMonth((m) => (m === 11 ? 0 : m + 1));
  };

  const handleYearChange = (delta) => {
    soundEngine.playClick();
    if (isAutoOrbit) setIsAutoOrbit(false);
    setYear((y) => Math.max(1990, Math.min(2035, y + delta)));
  };

  const handleSelectMonth = (idx) => {
    soundEngine.playTabSwitch();
    if (isAutoOrbit) setIsAutoOrbit(false);
    setMonth(idx);
  };

  const handleToggleOrbit = () => {
    if (!isAutoOrbit) {
      soundEngine.playSuccess();
    } else {
      soundEngine.playClick();
    }
    setIsAutoOrbit((prev) => !prev);
  };

  const handleResetToToday = () => {
    soundEngine.playClick();
    const now = new Date();
    setMonth(now.getMonth());
    setYear(now.getFullYear());
    setIsAutoOrbit(false);
  };

  return (
    <div className="celestial-controller-root">
      {/* 1. DOCKED FLOATING CAPSULE BAR */}
      <div 
        className={`celestial-dock-pill ${isOpen ? 'active-open' : ''}`}
        onClick={() => {
          soundEngine.playClick();
          setIsOpen((prev) => !prev);
        }}
        title="Open Celestial Stardate Observer (Change starfield Month & Year)"
      >
        <div className="flex items-center gap-2">
          <span className="celestial-pulsing-icon">
            <Compass size={14} className={isAutoOrbit ? 'text-accent animate-spin' : 'text-accent'} />
          </span>
          <span className="font-mono text-xs font-semibold tracking-wider text-white">
            <span className="text-accent">{currentMonthData.short}</span> {year}
          </span>
          <span className="celestial-season-badge font-mono text-[10px] hidden sm:inline">
            {currentMonthData.season} Sky
          </span>
        </div>

        {/* Quick step buttons directly on the pill */}
        <div className="flex items-center gap-0.5 ml-1" onClick={(e) => e.stopPropagation()}>
          <button 
            type="button"
            className="celestial-pill-arrow-btn"
            onClick={handlePrevMonth}
            aria-label="Previous Month"
            title="Previous Month"
          >
            <ChevronLeft size={13} />
          </button>
          <button 
            type="button"
            className="celestial-pill-arrow-btn"
            onClick={handleNextMonth}
            aria-label="Next Month"
            title="Next Month"
          >
            <ChevronRight size={13} />
          </button>
        </div>

        <button 
          type="button"
          className="celestial-pill-toggle-btn"
          aria-label="Toggle celestial controller"
        >
          {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>
      </div>

      {/* 2. EXPANDED CELESTIAL STARDATE MODAL / DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="celestial-drawer-panel glass-modal"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="celestial-drawer-header">
              <div className="flex items-center gap-2">
                <Compass size={16} className="text-accent" />
                <div>
                  <h3 className="font-mono text-xs font-bold tracking-wider text-accent uppercase">
                    Celestial Stardate Observer
                  </h3>
                  <p className="text-[11px] text-muted-custom font-mono">
                    Real-time astronomical night sky projection
                  </p>
                </div>
              </div>
              <button 
                type="button"
                className="modal-close-btn" 
                onClick={() => setIsOpen(false)}
                aria-label="Close celestial controller"
              >
                <X size={15} />
              </button>
            </div>

            {/* Year Controls */}
            <div className="celestial-year-bar font-mono">
              <span className="text-xs text-muted-custom">Epoch Year:</span>
              <div className="celestial-year-steppers">
                <button 
                  type="button" 
                  className="celestial-step-btn"
                  onClick={() => handleYearChange(-5)}
                >
                  -5y
                </button>
                <button 
                  type="button" 
                  className="celestial-step-btn"
                  onClick={() => handleYearChange(-1)}
                >
                  <ChevronLeft size={13} />
                </button>
                <span className="celestial-year-display text-accent font-bold px-2">
                  {year}
                </span>
                <button 
                  type="button" 
                  className="celestial-step-btn"
                  onClick={() => handleYearChange(1)}
                >
                  <ChevronRight size={13} />
                </button>
                <button 
                  type="button" 
                  className="celestial-step-btn"
                  onClick={() => handleYearChange(5)}
                >
                  +5y
                </button>
              </div>
            </div>

            {/* 12-Month Interactive Grid */}
            <div className="celestial-months-grid font-mono">
              {MONTHS.map((m, idx) => {
                const isActive = month === idx;
                return (
                  <button
                    key={m.short}
                    type="button"
                    onClick={() => handleSelectMonth(idx)}
                    className={`celestial-month-chip ${isActive ? 'active-chip' : ''}`}
                  >
                    <span className="month-chip-code">{m.short}</span>
                    <span className="month-chip-season">{m.season[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Seasonal Quick Presets */}
            <div className="celestial-presets-section font-mono">
              <span className="text-[11px] text-muted-custom">Seasonal Orientations:</span>
              <div className="celestial-presets-grid">
                {PRESETS.map((p) => {
                  const isSelected = month === p.month && year === p.year;
                  return (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => {
                        soundEngine.playTabSwitch();
                        setMonth(p.month);
                        setYear(p.year);
                        if (isAutoOrbit) setIsAutoOrbit(false);
                      }}
                      className={`celestial-preset-btn ${isSelected ? 'active-preset' : ''}`}
                    >
                      <span className="preset-name">{p.label}</span>
                      <span className="preset-desc">{p.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Controls: Auto-Orbit & Today */}
            <div className="celestial-drawer-footer font-mono">
              <button
                type="button"
                onClick={handleToggleOrbit}
                className={`celestial-action-btn ${isAutoOrbit ? 'orbit-active' : ''}`}
              >
                {isAutoOrbit ? <Pause size={13} /> : <Play size={13} fill="currentColor" />}
                <span>{isAutoOrbit ? 'Pause Orbit' : 'Auto-Orbit Tour'}</span>
              </button>

              <button
                type="button"
                onClick={handleResetToToday}
                className="celestial-action-btn ghost"
                title="Reset starfield to today's date"
              >
                <RotateCcw size={13} />
                <span>Today's Sky</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
