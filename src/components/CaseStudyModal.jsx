import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ArrowRight, Zap, GitBranch } from 'lucide-react';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { useSound } from '../hooks/useSound';

export default function CaseStudyModal({ project, onClose }) {
  const { playModalOpen, playClick } = useSound();

  useEscapeKey(onClose, Boolean(project));

  useEffect(() => {
    if (project) {
      playModalOpen();
    }
  }, [project, playModalOpen]);

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
            <button 
              className="modal-close-btn" 
              onClick={() => {
                playClick();
                onClose();
              }} 
              aria-label="Close modal"
            >
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

            {/* System Architecture Pipeline Diagram */}
            {caseStudy.architecture && caseStudy.architecture.length > 0 && (
              <div className="modal-section">
                <div className="architecture-header-flex">
                  <h3 className="section-subtitle font-mono">&gt; System_Architecture_Pipeline</h3>
                  <span className="architecture-live-tag font-mono">
                    <GitBranch size={12} className="text-accent" />
                    Distributed Flow
                  </span>
                </div>

                <div className="architecture-pipeline-container">
                  <div className="architecture-track">
                    {caseStudy.architecture.map((node, idx) => (
                      <React.Fragment key={idx}>
                        <div className="architecture-node group">
                          <div className="architecture-node-header font-mono">
                            <span className="arch-node-stage">{node.stage}</span>
                            <span className="arch-node-tech">{node.tech}</span>
                          </div>
                          <p className="arch-node-desc font-mono">{node.desc}</p>
                        </div>
                        {idx < caseStudy.architecture.length - 1 && (
                          <div className="architecture-flow-arrow" aria-hidden="true">
                            <div className="arch-flow-line"></div>
                            <ArrowRight size={14} className="arch-flow-icon text-accent" />
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            )}

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
                onClick={() => playClick()}
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
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
