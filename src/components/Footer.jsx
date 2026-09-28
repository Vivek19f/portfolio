import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer center-footer">
      <motion.a 
        href="https://github.com/Vivek19f" 
        target="_blank"
        rel="noreferrer"
        className="social-icon"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.3 }}
      >
        <FaGithub size={20} />
      </motion.a>
      <motion.a 
        href="https://www.linkedin.com/in/vivekjhooria/" 
        target="_blank"
        rel="noreferrer"
        className="social-icon"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <FaLinkedin size={20} />
      </motion.a>
      <motion.a 
        href="mailto:v.jhooria@gmail.com" 
        className="social-icon"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <Mail size={20} />
      </motion.a>
    </footer>
  );
}
