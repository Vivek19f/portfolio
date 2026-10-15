import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

        {/* Dynamic Page Views with Smooth Motion Transitions */}
        <div className={`portfolio-main-viewport ${isSingleView ? 'single-view-viewport' : ''}`}>
          <AnimatePresence mode="wait">
            {activeTab === 'home' && <HomeTab key="home" setActiveTab={setActiveTab} />}
            {activeTab === 'projects' && <ProjectsTab key="projects" setActiveTab={setActiveTab} />}
            {activeTab === 'experience' && <ExperienceTab key="experience" setActiveTab={setActiveTab} />}
            {activeTab === 'arcade' && <ArcadeTab key="arcade" />}
            {activeTab === 'achievements' && <AchievementsTab key="achievements" setActiveTab={setActiveTab} />}
            {activeTab === 'blogs' && <BlogsTab key="blogs" setActiveTab={setActiveTab} />}
          </AnimatePresence>
        </div>

        {/* Global Contact Footer on scrollable tabs */}
        {!isSingleView && <Footer />}

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
