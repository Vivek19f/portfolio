import React, { useState, useEffect, useCallback } from 'react';
import './index.css';

import Header from './components/Header';
import Footer from './components/Footer';
import StarfieldCanvas from './components/StarfieldCanvas';
import CommandPalette from './components/CommandPalette';
import MobileNav from './components/MobileNav';
import PlaygroundModal from './components/PlaygroundModal';
import CelestialController from './components/CelestialController';

import { TABS, getTabTitle } from './data/tabs';
import { useKeyboardShortcut } from './hooks/useKeyboardShortcut';

function App() {
  const [activeTab, setActiveTab] = useState('home'); // Landing page opens on Home in single view
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [activeGame, setActiveGame] = useState(null);

  // Celestial Starfield Stardate Epoch (Month: 0-11, Year)
  const [skyMonth, setSkyMonth] = useState(9); // October
  const [skyYear, setSkyYear] = useState(2026);
  const [isAutoOrbit, setIsAutoOrbit] = useState(false);
  const [isCelestialOpen, setIsCelestialOpen] = useState(false);

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
    <div className={`portfolio-app-root ${isSingleView ? 'single-view-layout' : ''}`}>
      {/* Interactive WebGL Starfield and Ambient Nebula */}
      <StarfieldCanvas 
        month={skyMonth} 
        year={skyYear} 
        isAutoOrbit={isAutoOrbit} 
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

      {/* Interactive Stardate & Constellation Observer HUD */}
      <CelestialController
        month={skyMonth}
        setMonth={setSkyMonth}
        year={skyYear}
        setYear={setSkyYear}
        isAutoOrbit={isAutoOrbit}
        setIsAutoOrbit={setIsAutoOrbit}
        isOpen={isCelestialOpen}
        setIsOpen={setIsCelestialOpen}
      />

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
