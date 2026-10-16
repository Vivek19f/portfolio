import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, ChevronLeft, ChevronRight, Play, Pause, RotateCcw, 
  Sparkles, X, Zap, Eye, Moon, Sun, Flame
} from 'lucide-react';
import { useSound } from '../hooks/useSound';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { 
  getActiveMeteorShower, 
  isEasterSeason, 
  getEasterDate 
} from '../data/celestialEvents';
import { LUNAR_THEMES } from '../data/lunarCatalog';

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
  day = 15,
  setDay,
  isSolarEclipse = false,
  setIsSolarEclipse,
  isBloodMoon = false,
  setIsBloodMoon,
  specialLunarType = null,
  setSpecialLunarType,
  lunarStatus,
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

  const handleDayChange = (newDay) => {
    const clamped = Math.max(1, Math.min(31, parseInt(newDay, 10) || 1));
    setDay?.(clamped);
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
    setDay?.(now.getDate());
    setIsSolarEclipse?.(false);
    setIsBloodMoon?.(false);
    setSpecialLunarType?.(null);
    setIsAutoOrbit(false);
  };

  const handleTriggerMeteorBurst = () => {
    playMeteor();
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent('starfield-meteor-burst'));
  };

  const handleTriggerSupernova = () => {
    playSupernova();
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent('starfield-supernova'));
  };

  const handleToggleSolarEclipse = () => {
    playSuccess();
    const next = !isSolarEclipse;
    setIsSolarEclipse?.(next);
    if (next) {
      setIsBloodMoon?.(false);
      setSpecialLunarType?.('solarEclipse');
    } else {
      setSpecialLunarType?.(null);
    }
  };

  const handleToggleBloodMoon = () => {
    playSuccess();
    const next = !isBloodMoon;
    setIsBloodMoon?.(next);
    if (next) {
      setIsSolarEclipse?.(false);
      setSpecialLunarType?.('bloodMoon');
    } else {
      setSpecialLunarType?.(null);
    }
  };

  const handleSelectSpecialLunar = (typeKey) => {
    playTabSwitch();
    if (typeKey === 'reset') {
      setIsSolarEclipse?.(false);
      setIsBloodMoon?.(false);
      setSpecialLunarType?.(null);
    } else if (typeKey === 'solarEclipse') {
      setIsSolarEclipse?.(true);
      setIsBloodMoon?.(false);
      setSpecialLunarType?.('solarEclipse');
    } else if (typeKey === 'bloodMoon') {
      setIsSolarEclipse?.(false);
      setIsBloodMoon?.(true);
      setSpecialLunarType?.('bloodMoon');
    } else {
      setIsSolarEclipse?.(false);
      setIsBloodMoon?.(false);
      setSpecialLunarType?.(typeKey);
    }
  };

  if (!isOpen) return null;

  const currentTheme = lunarStatus?.theme || LUNAR_THEMES.default;

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
                  {currentMonthData.full} {day}, {year} • {currentMonthData.season} Sky
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

          {/* LUNAR PHASES & ECLIPSE COMMAND SECTION */}
          <div className="celestial-lunar-section font-mono">
            <div className="lunar-header-row">
              <div className="lunar-title-group">
                <span className="lunar-icon-large">{lunarStatus?.phaseIcon || '🌒'}</span>
                <div>
                  <div className="lunar-phase-name flex items-center gap-2">
                    <span>{lunarStatus?.title || 'Waxing Moon'}</span>
                    <span 
                      className="lunar-theme-badge" 
                      style={{ 
                        borderColor: currentTheme.accent, 
                        color: currentTheme.accent,
                        boxShadow: `0 0 10px ${currentTheme.accentGlow}`
                      }}
                      title="The entire site theme adapts to this Moon's color spectrum"
                    >
                      <span className="theme-color-dot" style={{ backgroundColor: currentTheme.accent }} />
                      Theme: {currentTheme.name.split(' (')[0]}
                    </span>
                  </div>
                  <div className="lunar-metrics-text">
                    {lunarStatus?.isSolar ? (
                      <span className="text-amber-400 font-semibold">Totality Coronal Eclipse Active • 1,500,000 K Flare Ring</span>
                    ) : (
                      <span>Illumination: {lunarStatus?.illumination ?? 50}% • Age: {lunarStatus?.age ? lunarStatus.age.toFixed(1) : 15}d</span>
                    )}
                  </div>
                </div>
              </div>

              {/* View Sky / Dismiss Action */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="lunar-view-sky-btn"
                title="Gaze at the active Moon and Constellations in the Starfield"
              >
                <Eye size={13} />
                <span>Gaze Sky</span>
              </button>
            </div>

            {/* Description Snippet */}
            <p className="lunar-desc-text">
              {lunarStatus?.desc || 'Astronomical Julian Day Conway epoch calculated lunar cycle.'}
            </p>

            {/* Day of Month Scrubber (Days 1 to 31) */}
            <div className="lunar-scrubber-container">
              <div className="scrubber-label-row">
                <span className="scrubber-label">Lunar Phase Day Scrubber:</span>
                <span className="scrubber-value text-accent">
                  {currentMonthData.short} {day}, {year}
                </span>
              </div>
              <div className="scrubber-controls-row">
                <button
                  type="button"
                  onClick={() => handleDayChange(day - 1)}
                  className="scrubber-step-btn"
                  title="Previous Day (-1d)"
                >
                  -1d
                </button>
                <input
                  type="range"
                  min="1"
                  max="31"
                  value={day}
                  onChange={(e) => handleDayChange(e.target.value)}
                  className="lunar-range-slider"
                  aria-label="Select lunar day"
                />
                <button
                  type="button"
                  onClick={() => handleDayChange(day + 1)}
                  className="scrubber-step-btn"
                  title="Next Day (+1d)"
                >
                  +1d
                </button>
              </div>
            </div>

            {/* Eclipse & Special Full Moon Mode Toggles */}
            <div className="lunar-modes-grid">
              <button
                type="button"
                onClick={handleToggleSolarEclipse}
                className={`lunar-mode-toggle eclipse-toggle ${isSolarEclipse ? 'mode-active-solar' : ''}`}
                title="Occludes ambient light, casting deep space twilight with an incandescent coronal solar flare ring"
              >
                <Sun size={14} className={isSolarEclipse ? 'text-amber-400' : ''} />
                <span className="mode-toggle-name">Total Solar Eclipse</span>
                <span className="mode-toggle-badge">{isSolarEclipse ? 'ON' : 'OFF'}</span>
              </button>

              <button
                type="button"
                onClick={handleToggleBloodMoon}
                className={`lunar-mode-toggle blood-toggle ${isBloodMoon ? 'mode-active-blood' : ''}`}
                title="Total Lunar Eclipse: Earth casts its umbra, scattering copper crimson light"
              >
                <Moon size={14} className={isBloodMoon ? 'text-rose-400' : ''} />
                <span className="mode-toggle-name">Blood Moon (Eclipse)</span>
                <span className="mode-toggle-badge">{isBloodMoon ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            {/* Special Moon Quick Selectors */}
            <div className="lunar-special-chips">
              <span className="text-[11px] text-muted-custom">Special Full Moon Types:</span>
              <div className="chips-flex-row">
                {[
                  { key: 'supermoon', label: '🌕 Supermoon (+14% Size)', themeCol: '#22d3ee' },
                  { key: 'harvestMoon', label: '🌾 Harvest Moon (Autumn Amber)', themeCol: '#f59e0b' },
                  { key: 'blueMoon', label: '💎 Blue Moon (Cobalt)', themeCol: '#3b82f6' },
                  { key: 'micromoon', label: '🌕 Micromoon (Apogee)', themeCol: '#38bdf8' },
                  { key: 'reset', label: '🔄 Natural Epoch', themeCol: 'var(--accent)' },
                ].map((item) => {
                  const isSelected = item.key === 'reset' 
                    ? (!isSolarEclipse && !isBloodMoon && !specialLunarType)
                    : (specialLunarType === item.key && !isSolarEclipse && !isBloodMoon);

                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => handleSelectSpecialLunar(item.key)}
                      className={`special-lunar-chip ${isSelected ? 'chip-active' : ''}`}
                      style={{
                        borderColor: isSelected ? item.themeCol : undefined,
                      }}
                    >
                      <span className="chip-dot" style={{ backgroundColor: item.themeCol }} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
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
