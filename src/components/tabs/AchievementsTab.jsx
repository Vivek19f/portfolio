import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { CERTIFICATIONS_DATA, AWARDS_DATA } from '../../data/constants';

export default function AchievementsTab({ setActiveTab }) {
  return (
    <motion.main 
      key="achievements"
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
        
        <h2>Certifications & Trainings</h2>
        <div className="projects-grid" style={{ marginBottom: '40px' }}>
          {CERTIFICATIONS_DATA.map((cert, index) => (
            <div key={index} className="project-card">
              <h3>{cert.title}</h3>
              <p>{cert.issuer}</p>
            </div>
          ))}
        </div>

        <h2>Awards & Recognitions</h2>
        <div className="timeline">
          {AWARDS_DATA.map((award, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h3>{award.title}</h3>
                <p className="company">{award.issuer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.main>
  );
}
