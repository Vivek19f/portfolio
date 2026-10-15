import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, ExternalLink, Bomb, Hash, BrainCircuit, Bug, 
  ChevronRight, Sparkles 
} from 'lucide-react';
import { 
  STAT_METRICS, 
  SELECTED_WORK_DATA, 
  BUILT_FOR_FUN_DATA, 
  ARCHIVE_DATA, 
  PREVIOUS_VERSIONS_DATA 
} from '../../data/constants';
import CaseStudyModal from '../CaseStudyModal';
import PlaygroundModal from '../PlaygroundModal';

export default function ProjectsTab({ setActiveTab }) {
  const [activeCaseStudy, setActiveCaseStudy] = useState(null);
  const [activeGame, setActiveGame] = useState(null);

  const getFunIcon = (iconName) => {
    switch (iconName) {
      case 'bomb': return Bomb;
      case 'hash': return Hash;
      case 'brain': return BrainCircuit;
      case 'bug': return Bug;
      default: return Sparkles;
    }
  };

  return (
    <motion.main
      key="projects-page"
      className="projects-page-container"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4 }}
    >
      {/* Hero Header */}
      <div className="projects-hero-header">
        <h1 className="projects-main-title">I Build</h1>
        <p className="projects-hero-subtitle">
          Things I've shipped at work, things I built for fun, and every earlier version of this site.
        </p>
      </div>

      {/* Metrics Row matching aedit.me */}
      <div className="metrics-row-grid">
        {STAT_METRICS.map((stat, idx) => (
          <div key={idx} className="metric-stat-box">
            <span className="metric-stat-label font-mono">{stat.label}</span>
            <div className="metric-stat-content">
              <span className="metric-stat-number">{stat.value}</span>
              <span className="metric-stat-sub font-mono">{stat.subtext}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Section 1: Selected Work */}
      <section className="projects-section-block">
        <h2 className="section-mono-heading font-mono">&gt; Selected_Work</h2>
        <div className="selected-work-grid">
          {SELECTED_WORK_DATA.map((project) => (
            <article key={project.id} className="selected-work-card group">
              <div className="card-top-content">
                <h3 className="work-card-title">
                  {project.link ? (
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="work-title-link"
                    >
                      {project.name}
                    </a>
                  ) : (
                    <span>{project.name}</span>
                  )}
                </h3>
                <p className="work-card-description">{project.description}</p>
              </div>

              <div className="work-card-meta">
                <span className="work-card-role font-mono">{project.role}</span>
              </div>

              {/* Stack Badges */}
              <ul className="work-stack-list" aria-label="Technology Stack">
                {project.stack.map((tech, idx) => (
                  <li key={idx} className="work-stack-badge font-mono">
                    {tech}
                  </li>
                ))}
              </ul>

              {/* Card Footer Action */}
              <div className="work-card-footer">
                {project.hasCaseStudy ? (
                  <button
                    type="button"
                    onClick={() => setActiveCaseStudy(project)}
                    className="case-study-action-btn"
                  >
                    <span>Read the case study</span>
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </button>
                ) : (
                  <span className="font-mono text-xs text-muted-custom">
                    {project.details || 'Internal, details on request'}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Section 2: Built For Fun */}
      <section className="projects-section-block">
        <h2 className="section-mono-heading font-mono">&gt; Built_For_Fun</h2>
        <div className="built-for-fun-grid">
          {BUILT_FOR_FUN_DATA.map((item) => {
            const IconComp = getFunIcon(item.icon);
            return (
              <div
                key={item.id}
                onClick={() => setActiveGame(item.id)}
                className="fun-project-card group cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') setActiveGame(item.id); }}
              >
                <div className="fun-icon-wrapper">
                  <IconComp size={24} className="fun-icon text-muted-custom group-hover:text-accent transition-colors" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="fun-card-title group-hover:text-accent transition-colors">
                    {item.name}
                  </h3>
                  <span className="play-badge font-mono text-xs">Play ↵</span>
                </div>
                <p className="fun-card-desc">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 3: Archive */}
      <section className="projects-section-block">
        <h2 className="section-mono-heading font-mono">&gt; Archive</h2>
        <ul className="archive-list">
          {ARCHIVE_DATA.map((item, idx) => (
            <li key={idx} className="archive-item-card">
              <div className="archive-header-row">
                <span className="archive-year font-mono">{item.year}</span>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="archive-title-link"
                >
                  {item.name}
                </a>
                <span className="archive-description">{item.description}</span>
              </div>
              <ul className="archive-stack-list font-mono" aria-label="Archive stack">
                {item.stack.map((s, sIdx) => (
                  <li key={sIdx} className="archive-stack-badge">
                    {s}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      {/* Section 4: Previous Versions */}
      <section className="projects-section-block previous-versions-block">
        <h2 className="section-mono-heading font-mono">&gt; Previous_Versions</h2>
        <details className="previous-versions-accordion">
          <summary className="accordion-summary font-mono">
            Show {PREVIOUS_VERSIONS_DATA.length} previous versions
          </summary>
          <ol className="versions-list">
            {PREVIOUS_VERSIONS_DATA.map((v, idx) => (
              <li key={idx} className="version-item">
                <span className="version-tag font-mono">{v.version}</span>
                <span className="version-years font-mono">{v.years}</span>
                <span className="version-tech font-sans">{v.tech}</span>
                <span className="version-action">
                  <a
                    href={v.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="version-link font-mono"
                  >
                    Visit <ChevronRight size={14} />
                  </a>
                </span>
              </li>
            ))}
          </ol>
        </details>
      </section>

      {/* Modals */}
      {activeCaseStudy && (
        <CaseStudyModal
          project={activeCaseStudy}
          onClose={() => setActiveCaseStudy(null)}
        />
      )}

      {activeGame && (
        <PlaygroundModal
          gameId={activeGame}
          onClose={() => setActiveGame(null)}
        />
      )}
    </motion.main>
  );
}
