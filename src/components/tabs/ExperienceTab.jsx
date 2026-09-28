import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { EXPERIENCE_DATA, SKILLS_DATA } from '../../data/constants';

export default function ExperienceTab({ setActiveTab }) {
  return (
    <motion.main 
      key="experience"
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
        
        <h2>Technical Arsenal</h2>
        <div className="skill-tags" style={{ marginBottom: '40px' }}>
          {SKILLS_DATA.map((skill, index) => (
            <span key={index} className="skill-tag">{skill}</span>
          ))}
        </div>

        <h2>Experience</h2>
        <div className="timeline">
          {EXPERIENCE_DATA.map((exp, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h3>{exp.title}</h3>
                <p className="company">{exp.company} • {exp.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.main>
  );
}
