import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <motion.section 
      className="vante-contact-section"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1 }}
    >
      <div className="vante-contact-content">
        <h2 className="vante-heading">HAVE AN IDEA?</h2>
        <a href="mailto:v.jhooria@gmail.com" className="vante-email-link">
          LET'S TALK <ArrowUpRight className="vante-arrow" size={80} strokeWidth={1} />
        </a>
      </div>
      
      <div className="vante-contact-footer">
        <div className="vante-footer-info">
          <p>Based in India.</p>
          <p>Available for freelance opportunities.</p>
        </div>
        
        <div className="vante-social-links">
          <a href="https://github.com/Vivek19f" target="_blank" rel="noreferrer" className="vante-social-link">GITHUB</a>
          <a href="https://www.linkedin.com/in/vivekjhooria/" target="_blank" rel="noreferrer" className="vante-social-link">LINKEDIN</a>
        </div>
      </div>
    </motion.section>
  );
}
