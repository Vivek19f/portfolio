import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function CaseStudyModal({ project, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project || !project.caseStudy) return null;

  const { caseStudy } = project;

  return (
    <AnimatePresence>
      <div className="modal-backdrop" onClick={onClose}>
        <motion.div
          className="modal-content glass-modal"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="modal-header">
            <div>
              <span className="modal-role-badge font-mono">{project.role}</span>
              <h2 className="modal-title">{caseStudy.title}</h2>
              <p className="modal-tagline">{caseStudy.tagline}</p>
            </div>
            <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
              <X size={20} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="modal-body custom-scrollbar">
            {/* Overview */}
            <div className="modal-section">
              <h3 className="section-subtitle font-mono">&gt; The_Context</h3>
              <p className="text-secondary leading-relaxed">{caseStudy.overview}</p>
            </div>

            {/* Key Challenges */}
            {caseStudy.challenges && (
              <div className="modal-section">
                <h3 className="section-subtitle font-mono">&gt; Key_Challenges</h3>
                <ul className="challenge-list">
                  {caseStudy.challenges.map((challenge, idx) => (
                    <li key={idx} className="challenge-item">
                      <span className="challenge-bullet font-mono">0{idx + 1}</span>
                      <span className="text-secondary">{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Architecture Solution */}
            {caseStudy.solution && (
              <div className="modal-section">
                <h3 className="section-subtitle font-mono">&gt; Engineering_Solution</h3>
                <div className="solution-box">
                  <div className="solution-icon">
                    <Zap size={20} className="text-accent" />
                  </div>
                  <p className="text-secondary leading-relaxed">{caseStudy.solution}</p>
                </div>
              </div>
            )}

            {/* Key Metrics */}
            {caseStudy.metrics && (
              <div className="modal-section">
                <h3 className="section-subtitle font-mono">&gt; Impact_Metrics</h3>
                <div className="metrics-grid">
                  {caseStudy.metrics.map((metric, idx) => (
                    <div key={idx} className="metric-card">
                      <span className="metric-val text-accent">{metric.value}</span>
                      <span className="metric-label font-mono">{metric.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Stack */}
            <div className="modal-section">
              <h3 className="section-subtitle font-mono">&gt; Tech_Stack</h3>
              <div className="tech-pills">
                {project.stack.map((item, idx) => (
                  <span key={idx} className="tech-badge font-mono">{item}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="modal-footer">
            {project.link ? (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="action-btn primary-glow-btn"
              >
                <span>View Repository</span>
                <ExternalLink size={16} />
              </a>
            ) : (
              <span className="font-mono text-xs text-muted-custom">
                Enterprise confidential • Architecture patterns shareable on request
              </span>
            )}
            <button className="action-btn ghost-btn" onClick={onClose}>
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
