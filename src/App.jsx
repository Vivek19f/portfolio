import React, { useState, useEffect } from 'react';
import './index.css';

import Header from './components/Header';
import Footer from './components/Footer';
import StarfieldCanvas from './components/StarfieldCanvas';
import CommandPalette from './components/CommandPalette';
import MobileNav from './components/MobileNav';
import PlaygroundModal from './components/PlaygroundModal';

import HomeTab from './components/tabs/HomeTab';
import ExperienceTab from './components/tabs/ExperienceTab';
import ProjectsTab from './components/tabs/ProjectsTab';
import ArcadeTab from './components/tabs/ArcadeTab';
import AchievementsTab from './components/tabs/AchievementsTab';
import BlogsTab from './components/tabs/BlogsTab';

function App() {
  const [activeTab, setActiveTab] = useState('home'); // Landing page opens on Home in single view!
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [activeGame, setActiveGame] = useState(null);

  // Sync tab title with active view
  useEffect(() => {
    const titles = {
      home: 'Vivek Jhooria | Staff Full Stack Engineer',
      projects: 'Projects | Vivek Jhooria',
      experience: 'Experience | Vivek Jhooria',
      arcade: 'Arcade | Vivek Jhooria',
      achievements: 'Achievements | Vivek Jhooria',
      blogs: 'Articles | Vivek Jhooria'
    };
    document.title = titles[activeTab] || 'Vivek Jhooria | Staff Full Stack Engineer';
  }, [activeTab]);

  // Global keyboard shortcut for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsConsoleOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
      <StarfieldCanvas />

      {/* Main UI Overlay */}
      <div className={`portfolio-content-layer ${isSingleView ? 'single-view-content' : ''}`}>
        {/* Sticky Header with Rolling Navigation & Console Trigger */}
        <Header 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onOpenConsole={() => setIsConsoleOpen(true)}
        />

        {/* Persistent Page Views: Loaded Once, Cached in DOM, Zero Reload Lag */}
        <div className={`portfolio-main-viewport ${isSingleView ? 'single-view-viewport' : ''}`}>
          <div 
            id="panel-home" 
            style={{ display: activeTab === 'home' ? 'contents' : 'none' }}
          >
            <HomeTab setActiveTab={setActiveTab} />
          </div>

          <div 
            id="panel-projects" 
            style={{ display: activeTab === 'projects' ? 'block' : 'none' }}
          >
            {visitedTabs.has('projects') && <ProjectsTab setActiveTab={setActiveTab} />}
          </div>

          <div 
            id="panel-experience" 
            style={{ display: activeTab === 'experience' ? 'block' : 'none' }}
          >
            {visitedTabs.has('experience') && <ExperienceTab setActiveTab={setActiveTab} />}
          </div>

          <div 
            id="panel-arcade" 
            style={{ display: activeTab === 'arcade' ? 'block' : 'none' }}
          >
            {visitedTabs.has('arcade') && <ArcadeTab />}
          </div>

          <div 
            id="panel-achievements" 
            style={{ display: activeTab === 'achievements' ? 'block' : 'none' }}
          >
            {visitedTabs.has('achievements') && <AchievementsTab setActiveTab={setActiveTab} />}
          </div>

          <div 
            id="panel-blogs" 
            style={{ display: activeTab === 'blogs' ? 'block' : 'none' }}
          >
            {visitedTabs.has('blogs') && <BlogsTab setActiveTab={setActiveTab} />}
          </div>
        </div>

        {/* Global Contact Footer on scrollable tabs */}
        <div style={{ display: isSingleView ? 'none' : 'block' }}>
          <Footer />
        </div>

        {/* Floating Mobile Dock Navigation */}
        <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

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
