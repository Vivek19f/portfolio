import React, { useState, useEffect, useCallback } from 'react';
import './index.css';

import Header from './components/Header';
import Footer from './components/Footer';
import StarfieldCanvas from './components/StarfieldCanvas';
import CommandPalette from './components/CommandPalette';
import MobileNav from './components/MobileNav';
import PlaygroundModal from './components/PlaygroundModal';
import CelestialController from './components/CelestialController';
import CelestialEventToast from './components/CelestialEventToast';

import { TABS, getTabTitle } from './data/tabs';
import { useKeyboardShortcut } from './hooks/useKeyboardShortcut';
import { calculateLunarStatus, applyLunarTheme } from './data/lunarCatalog';

function App() {
  const [activeTab, setActiveTab] = useState('home'); // Landing page opens on Home in single view
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [activeGame, setActiveGame] = useState(null);

  // Celestial Starfield Stardate Epoch (Month: 0-11, Year, Day: 1-31)
  const [skyMonth, setSkyMonth] = useState(9); // October
  const [skyYear, setSkyYear] = useState(2026);
  const [skyDay, setSkyDay] = useState(15);
  const [isAutoOrbit, setIsAutoOrbit] = useState(false);
  const [isCelestialOpen, setIsCelestialOpen] = useState(false);

  // Special Lunar Events & Eclipses
  const [isSolarEclipse, setIsSolarEclipse] = useState(false);
  const [isBloodMoon, setIsBloodMoon] = useState(false);
  const [specialLunarType, setSpecialLunarType] = useState(null);

  // Calculate real-time lunar status
  const lunarStatus = calculateLunarStatus(skyYear, skyMonth, skyDay, {
    isSolarEclipse,
    isBloodMoon,
    specialType: specialLunarType,
  });

  // Dynamically update site theme colors as per the moon's celestial hue
  useEffect(() => {
    applyLunarTheme(lunarStatus.theme);
  }, [lunarStatus.theme]);

  // Global listener for lunar mode and cycle triggers
  useEffect(() => {
    const handleSetLunarMode = (e) => {
      const mode = e.detail?.mode;
      if (mode === 'solarEclipse') {
        setIsSolarEclipse(true);
        setIsBloodMoon(false);
        setSpecialLunarType('solarEclipse');
      } else if (mode === 'bloodMoon') {
        setIsSolarEclipse(false);
        setIsBloodMoon(true);
        setSpecialLunarType('bloodMoon');
      } else if (mode === 'reset') {
        setIsSolarEclipse(false);
        setIsBloodMoon(false);
        setSpecialLunarType(null);
      } else if (mode) {
        setIsSolarEclipse(false);
        setIsBloodMoon(false);
        setSpecialLunarType(mode);
      }
    };

    const handleCycleLunar = () => {
      const modes = [null, 'bloodMoon', 'solarEclipse', 'harvestMoon', 'blueMoon', 'supermoon'];
      setSpecialLunarType((current) => {
        const nextIdx = (modes.indexOf(current) + 1) % modes.length;
        const nextMode = modes[nextIdx];
        if (nextMode === 'solarEclipse') {
          setIsSolarEclipse(true);
          setIsBloodMoon(false);
        } else if (nextMode === 'bloodMoon') {
          setIsSolarEclipse(false);
          setIsBloodMoon(true);
        } else {
          setIsSolarEclipse(false);
          setIsBloodMoon(false);
        }
        return nextMode;
      });
    };

    window.addEventListener('celestial-set-lunar-mode', handleSetLunarMode);
    window.addEventListener('celestial-cycle-lunar-event', handleCycleLunar);
    return () => {
      window.removeEventListener('celestial-set-lunar-mode', handleSetLunarMode);
      window.removeEventListener('celestial-cycle-lunar-event', handleCycleLunar);
    };
  }, []);

  // Sync document title with active tab config
  useEffect(() => {
    document.title = getTabTitle(activeTab);
  }, [activeTab]);

  // Global keyboard shortcut for ⌘K / Ctrl+K
  const toggleConsole = useCallback(() => {
    setIsConsoleOpen((prev) => !prev);
  }, []);

  useKeyboardShortcut('k', toggleConsole);

  // Persistent tab shell: once a tab is visited, it stays loaded in the DOM and is never re-loaded
  const [visitedTabs, setVisitedTabs] = useState(() => new Set(['home', activeTab]));

  useEffect(() => {
    setVisitedTabs((prev) => {
      if (prev.has(activeTab)) return prev;
      const next = new Set(prev);
      next.add(activeTab);
      return next;
    });
  }, [activeTab]);

  // Instant scroll-to-top on tab switch to avoid scroll trapping/jumping
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activeTab]);

  const isSingleView = activeTab === 'home';

  return (
    <div className={`portfolio-app-root ${isSingleView ? 'single-view-layout' : ''} ${lunarStatus.isSolar ? 'solar-eclipse-active' : ''}`}>
      {/* Interactive WebGL Starfield, Ambient Nebula & Dynamic Lunar Body */}
      <StarfieldCanvas 
        month={skyMonth} 
        year={skyYear} 
        day={skyDay}
        isAutoOrbit={isAutoOrbit} 
        isSolarEclipse={isSolarEclipse}
        isBloodMoon={isBloodMoon}
        specialLunarType={specialLunarType}
        lunarStatus={lunarStatus}
      />

      {/* Main UI Overlay */}
      <div className={`portfolio-content-layer ${isSingleView ? 'single-view-content' : ''}`}>
        {/* Sticky Header with Rolling Navigation & Console Trigger */}
        <Header 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onOpenConsole={() => setIsConsoleOpen(true)}
          skyMonth={skyMonth}
          skyYear={skyYear}
          lunarStatus={lunarStatus}
          onToggleCelestial={() => setIsCelestialOpen((prev) => !prev)}
        />

        {/* Persistent Page Views: Loaded Once, Cached in DOM, Zero Reload Lag */}
        <div className={`portfolio-main-viewport ${isSingleView ? 'single-view-viewport' : ''}`}>
          {TABS.map((tab) => {
            const isTabActive = activeTab === tab.id;
            const hasBeenVisited = visitedTabs.has(tab.id);
            const TabComponent = tab.component;

            return (
              <div
                key={tab.id}
                id={`panel-${tab.id}`}
                style={{
                  display: isTabActive ? tab.displayType || 'block' : 'none',
                }}
              >
                {(hasBeenVisited || isTabActive) && (
                  <TabComponent setActiveTab={setActiveTab} />
                )}
              </div>
            );
          })}
        </div>

        {/* Global Contact Footer on scrollable tabs */}
        <div style={{ display: isSingleView ? 'none' : 'block' }}>
          <Footer />
        </div>

        {/* Floating Mobile Dock Navigation */}
        <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Interactive Stardate, Constellation & Lunar Eclipse Observer HUD */}
      <CelestialController
        month={skyMonth}
        setMonth={setSkyMonth}
        year={skyYear}
        setYear={setSkyYear}
        day={skyDay}
        setDay={setSkyDay}
        isSolarEclipse={isSolarEclipse}
        setIsSolarEclipse={setIsSolarEclipse}
        isBloodMoon={isBloodMoon}
        setIsBloodMoon={setIsBloodMoon}
        specialLunarType={specialLunarType}
        setSpecialLunarType={setSpecialLunarType}
        lunarStatus={lunarStatus}
        isAutoOrbit={isAutoOrbit}
        setIsAutoOrbit={setIsAutoOrbit}
        isOpen={isCelestialOpen}
        setIsOpen={setIsCelestialOpen}
      />

      {/* Real-time Astronomical & Easter Egg Alerts */}
      <CelestialEventToast />

      {/* ⌘K Navigation Console Modal */}
      <CommandPalette
        isOpen={isConsoleOpen}
        onClose={() => setIsConsoleOpen(false)}
        setActiveTab={setActiveTab}
        onOpenGame={(gameId) => setActiveGame(gameId)}
      />

      {/* Interactive Arcade Mini-Game Modal */}
      {activeGame && (
        <PlaygroundModal
          gameId={activeGame}
          onClose={() => setActiveGame(null)}
        />
      )}
    </div>
  );
}

export default App;
