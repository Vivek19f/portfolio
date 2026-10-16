import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, ChevronLeft, ChevronRight, Play, Pause, RotateCcw, 
  Sparkles, X, Zap, Eye
} from 'lucide-react';
import { useSound } from '../hooks/useSound';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { 
  getActiveMeteorShower, 
  isEasterSeason, 
  getEasterDate 
} from '../data/celestialEvents';

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
  const { playClick, playTabSwitch, playSuccess, playMeteor, playSupernova } = useSound();
  const currentMonthData = MONTHS[month] || MONTHS[9];

  // Reusable Escape key listener to close modal
  useEscapeKey(() => setIsOpen(false), isOpen);

  React.useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('starfield-open-observer', handleOpen);
    return () => window.removeEventListener('starfield-open-observer', handleOpen);
  }, [setIsOpen]);

  const activeShower = getActiveMeteorShower(month);
  const isEaster = isEasterSeason(month, year);
  const easterDate = getEasterDate(year);

  const PRESETS = [
    { label: '🍂 Autumn Cassiopeia', month: 9, year: 2026, desc: 'M31 Andromeda & Pegasus' },
    { label: '❄️ Winter Orion', month: 0, year: 2026, desc: 'Betelgeuse, Sirius & M42' },
    { label: '✨ The Pleiades M45', month: 10, year: 2026, desc: 'Seven Sisters & Taurus' },
    { label: '🌱 Spring Dipper', month: 3, year: 2026, desc: 'Ursa Major & Leo' },
    { label: '☀️ Summer Triangle', month: 6, year: 2026, desc: 'Cygnus, Vega & Scorpius' },
    { label: '🥚 Easter Supernova', month: easterDate.month, year, desc: 'Betelgeuse Core Collapse' },
  ];

  const handlePrevMonth = (e) => {
    e?.stopPropagation();
    playClick();
    if (isAutoOrbit) setIsAutoOrbit(false);
    setMonth((m) => (m === 0 ? 11 : m - 1));
  };

  const handleNextMonth = (e) => {
    e?.stopPropagation();
    playClick();
    if (isAutoOrbit) setIsAutoOrbit(false);
    setMonth((m) => (m === 11 ? 0 : m + 1));
  };

  const handleSelectMonth = (mIdx) => {
    playTabSwitch();
    if (isAutoOrbit) setIsAutoOrbit(false);
    setMonth(mIdx);
  };

  const handleYearChange = (delta) => {
    playClick();
    if (isAutoOrbit) setIsAutoOrbit(false);
    setYear((y) => Math.max(1970, Math.min(2080, y + delta)));
  };

  const handleToggleOrbit = () => {
    playClick();
    setIsAutoOrbit((prev) => !prev);
  };

  const handleResetToToday = () => {
    playClick();
    const now = new Date();
    setMonth(now.getMonth());
    setYear(now.getFullYear());
    setIsAutoOrbit(false);
  };

  const handleTriggerMeteorBurst = () => {
    playMeteor();
    window.dispatchEvent(new CustomEvent('starfield-meteor-burst'));
  };

  const handleTriggerSupernova = () => {
    playSupernova();
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent('starfield-supernova'));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="modal-backdrop celestial-backdrop" onClick={() => setIsOpen(false)}>
        <motion.div
          className="celestial-modal-panel glass-modal"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="celestial-drawer-header">
            <div className="flex items-center gap-2">
              <Compass size={18} className="text-accent" />
              <div>
                <h3 className="font-mono text-sm font-bold tracking-wider text-accent uppercase">
                  Celestial Stardate Observer
                </h3>
                <p className="text-xs text-muted-custom font-mono">
                  {currentMonthData.full} {year} • {currentMonthData.season} Sky
                </p>
              </div>
            </div>
            <button 
              type="button"
              className="modal-close-btn" 
              onClick={() => setIsOpen(false)}
              aria-label="Close celestial controller"
            >
              <X size={18} />
            </button>
          </div>

          {/* Active Celestial Event Banner */}
          {activeShower && (
            <div className="celestial-event-card shower-active font-mono">
              <div className="event-info">
                <span className="event-icon">☄️</span>
                <div>
                  <div className="event-title">{activeShower.name} Meteor Shower</div>
                  <div className="event-subtitle">
                    {activeShower.rate} • {activeShower.description}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleTriggerMeteorBurst}
                className="event-trigger-btn"
                title="Launch a volley of shooting stars"
              >
                <Zap size={12} />
                <span>Burst</span>
              </button>
            </div>
          )}

          {/* Easter Season Supernova Banner */}
          <div className={`celestial-event-card easter-supernova-card font-mono ${isEaster ? 'easter-glowing' : ''}`}>
            <div className="event-info">
              <span className="event-icon">🥚</span>
              <div>
                <div className="event-title">
                  {isEaster ? 'Easter Epoch: Betelgeuse Unstable Core' : 'Betelgeuse Supernova Easter Egg'}
                </div>
                <div className="event-subtitle">
                  {isEaster 
                    ? `Easter Sunday: ${MONTHS[easterDate.month].short} ${easterDate.day}, ${year} • Click to collapse core!`
                    : `Works during Easter epoch (${MONTHS[easterDate.month].short} ${easterDate.day}) or click below:`}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleTriggerSupernova}
              className="event-trigger-btn supernova-btn"
              title="Trigger Betelgeuse Supernova Core Collapse"
            >
              <span>💥 Detonate</span>
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
                title="Rewind 5 years"
              >
                -5y
              </button>
              <button 
                type="button" 
                className="celestial-step-btn"
                onClick={() => handleYearChange(-1)}
                title="Rewind 1 year"
              >
                -1y
              </button>
              <span className="current-year-value">{year}</span>
              <button 
                type="button" 
                className="celestial-step-btn"
                onClick={() => handleYearChange(1)}
                title="Advance 1 year"
              >
                +1y
              </button>
              <button 
                type="button" 
                className="celestial-step-btn"
                onClick={() => handleYearChange(5)}
                title="Advance 5 years"
              >
                +5y
              </button>
            </div>
          </div>

          {/* Month Selector Grid */}
          <div className="celestial-months-grid font-mono">
            {MONTHS.map((m, idx) => {
              const isActive = idx === month;
              const hasShower = !!getActiveMeteorShower(idx);
              const isEasterMonth = idx === easterDate.month;
              return (
                <button
                  key={m.short}
                  type="button"
                  onClick={() => handleSelectMonth(idx)}
                  className={`celestial-month-chip ${isActive ? 'active-chip' : ''} ${hasShower ? 'has-shower' : ''}`}
                  title={`${m.full} (${m.season})${hasShower ? ' • Active Meteor Shower' : ''}${isEasterMonth ? ' • Easter Epoch' : ''}`}
                >
                  <span className="month-chip-code">{m.short}</span>
                  <span className="month-chip-season">
                    {isEasterMonth ? '🥚' : hasShower ? '☄️' : m.season[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Seasonal Quick Presets */}
          <div className="celestial-presets-section font-mono">
            <span className="text-[11px] text-muted-custom">Celestial Presets & Deep-Sky:</span>
            <div className="celestial-presets-grid">
              {PRESETS.map((p) => {
                const isSelected = month === p.month && year === p.year;
                return (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      playTabSwitch();
                      setMonth(p.month);
                      setYear(p.year);
                      if (isAutoOrbit) setIsAutoOrbit(false);
                      if (p.label.includes('Supernova')) {
                        setTimeout(() => handleTriggerSupernova(), 300);
                      }
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
      </div>
    </AnimatePresence>
  );
}
