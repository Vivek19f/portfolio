import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { PROJECTS_DATA } from '../../data/constants';

export default function ProjectsTab({ setActiveTab }) {
  return (
    <motion.main 
      key="projects"
      className="main-content experience-section"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      <div className="glass-panel experience-card">
        <button className="back-button" onClick={() => setActiveTab('home')}>
          <ArrowLeft size={16} /> Back
        </button>
        <h2>Projects</h2>
        
        <div className="projects-grid">
          {PROJECTS_DATA.map((project, index) => (
            <div key={index} className="project-card">
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <a href={project.url} className="project-link" target="_blank" rel="noreferrer">View Repository</a>
            </div>
          ))}
        </div>
      </div>
    </motion.main>
  );
}
