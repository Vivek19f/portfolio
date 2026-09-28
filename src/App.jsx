import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';

import Header from './components/Header';
import Footer from './components/Footer';
import ThreeBackground from './components/ThreeBackground';
import HomeTab from './components/tabs/HomeTab';
import ExperienceTab from './components/tabs/ExperienceTab';
import ProjectsTab from './components/tabs/ProjectsTab';
import AchievementsTab from './components/tabs/AchievementsTab';
import BlogsTab from './components/tabs/BlogsTab';

function App() {
  const [isSplineLoaded, setIsSplineLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="app-container">
      {/* 3D Background */}
      <ThreeBackground 
        isSplineLoaded={isSplineLoaded} 
        setIsSplineLoaded={setIsSplineLoaded} 
      />

      {/* Foreground UI */}
      {isSplineLoaded && (
        <motion.div 
          className="ui-layer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {/* Header */}
          <Header activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Main Content Area */}
          <AnimatePresence mode="wait">
            {activeTab === 'home' && <HomeTab />}
            {activeTab === 'experience' && <ExperienceTab setActiveTab={setActiveTab} />}
            {activeTab === 'projects' && <ProjectsTab setActiveTab={setActiveTab} />}
            {activeTab === 'achievements' && <AchievementsTab setActiveTab={setActiveTab} />}
            {activeTab === 'blogs' && <BlogsTab setActiveTab={setActiveTab} />}
          </AnimatePresence>

          {/* Footer Socials */}
          {activeTab === 'home' && <Footer />}
        </motion.div>
      )}
    </div>
  );
}

export default App;
