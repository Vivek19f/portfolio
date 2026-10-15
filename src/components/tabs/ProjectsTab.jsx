import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, ExternalLink, Hash, Bug, 
  ChevronRight, Sparkles, Keyboard, Search, Filter, Layers
} from 'lucide-react';
import { 
  SELECTED_WORK_DATA, 
  BUILT_FOR_FUN_DATA 
} from '../../data/constants';
import CaseStudyModal from '../CaseStudyModal';
import PlaygroundModal from '../PlaygroundModal';
import GitHubTelemetryBar from '../GitHubTelemetryBar';
import { soundEngine } from '../../utils/soundEngine';

export default function ProjectsTab({ setActiveTab }) {
  const [activeCaseStudy, setActiveCaseStudy] = useState(null);
  const [activeGame, setActiveGame] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const FILTER_CHIPS = [
    { id: 'all', label: 'All Projects' },
    { id: 'architecture', label: 'Architecture & Systems' },
    { id: 'security', label: 'Security & Telemetry' },
    { id: 'data', label: 'Data & Streaming' },
    { id: 'ai', label: 'AI Systems' },
    { id: 'interactive', label: 'Interactive WebGL' }
  ];

  const filteredProjects = SELECTED_WORK_DATA.filter((project) => {
    const matchesFilter = selectedFilter === 'all' || project.category === selectedFilter;
    const matchesSearch = !searchQuery.trim() || 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.stack.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getFunIcon = (iconName) => {
    switch (iconName) {
      case 'hash': return Hash;
      case 'bug': return Bug;
      case 'keyboard': return Keyboard;
      default: return Sparkles;
    }
  };

  return (
    <motion.main
      key="projects-page"
      className="projects-page-container"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.15 }}
    >
      {/* Hero Header */}
      <div className="projects-hero-header">
        <h1 className="projects-main-title">I Build</h1>
        <p className="projects-hero-subtitle">
          Things I've shipped at work, things I built for fun, and every earlier version of this site.
        </p>
      </div>

      {/* Feature 1: Live GitHub Telemetry Bar */}
      <GitHubTelemetryBar />

      {/* Feature 4: Domain & Stack Filter Chips */}
      <section className="projects-section-block">
        <div className="projects-filter-bar">
          <div className="filter-chips-track">
            {FILTER_CHIPS.map((chip) => {
              const isActive = selectedFilter === chip.id;
              return (
                <button
                  key={chip.id}
                  onClick={() => {
                    soundEngine.playTabSwitch();
                    setSelectedFilter(chip.id);
                  }}
                  className={`filter-chip-btn font-mono ${isActive ? 'active' : ''}`}
                >
                  <span>{chip.label}</span>
                  {chip.id === 'all' ? (
                    <span className="filter-count-badge">{SELECTED_WORK_DATA.length}</span>
                  ) : (
                    <span className="filter-count-badge">
                      {SELECTED_WORK_DATA.filter(p => p.category === chip.id).length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div className="project-search-box">
            <Search size={14} className="text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stack or title..."
              className="project-search-input font-mono"
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => setSearchQuery('')}
                className="search-clear-btn font-mono"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Section 1: Selected Work Grid */}
        <h2 className="section-mono-heading font-mono">&gt; Selected_Work</h2>
        
        {filteredProjects.length === 0 ? (
          <div className="filter-empty-state font-mono">
            <p>No projects found matching current filter & search criteria.</p>
            <button 
              onClick={() => { setSelectedFilter('all'); setSearchQuery(''); }}
              className="text-accent underline text-xs mt-2"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="selected-work-grid">
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredProjects.map((project) => (
                <motion.article 
                  key={project.id} 
                  layout
                  initial={false}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="selected-work-card group"
                >
                  <div className="card-top-content">
                    <div className="work-card-category-strip font-mono">
                      <span className="work-category-pill">{project.categoryLabel}</span>
                    </div>

                    <h3 className="work-card-title">
                      {project.link ? (
                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={() => soundEngine.playClick()}
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
                        onClick={() => {
                          soundEngine.playClick();
                          setActiveCaseStudy(project);
                        }}
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
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Section 2: Built for Fun / Puzzles */}
      <section className="projects-section-block">
        <h2 className="section-mono-heading font-mono">&gt; Built_For_Fun</h2>
        <div className="built-for-fun-grid">
          {BUILT_FOR_FUN_DATA.map((item) => {
            const IconComp = getFunIcon(item.icon);
            return (
              <div 
                key={item.id} 
                className="fun-game-card group cursor-pointer"
                onClick={() => {
                  soundEngine.playClick();
                  setActiveGame(item.id);
                }}
              >
                <div className="fun-card-icon-wrapper">
                  <IconComp className="text-accent group-hover:scale-110 transition-transform" size={24} />
                </div>
                <div className="fun-card-content">
                  <div className="flex items-center justify-between">
                    <h3 className="fun-card-title">{item.name}</h3>
                    <ArrowRight size={16} className="text-accent opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="fun-card-description">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Case Study Modal */}
      {activeCaseStudy && (
        <CaseStudyModal
          project={activeCaseStudy}
          onClose={() => setActiveCaseStudy(null)}
        />
      )}

      {/* Playground Game Modal */}
      {activeGame && (
        <PlaygroundModal
          gameId={activeGame}
          onClose={() => setActiveGame(null)}
        />
      )}
    </motion.main>
  );
}
