import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { BLOGS_DATA } from '../../data/constants';

export default function BlogsTab({ setActiveTab }) {
  return (
    <motion.main 
      key="blogs"
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
        <h2>Articles & Blogs</h2>
        
        <div className="projects-grid">
          {BLOGS_DATA.map((blog, index) => (
            <div key={index} className="project-card">
              <h3>{blog.title}</h3>
              <p>{blog.description}</p>
              <a href={blog.url} className="project-link" target="_blank" rel="noreferrer">Read Article</a>
            </div>
          ))}
        </div>
      </div>
    </motion.main>
  );
}
