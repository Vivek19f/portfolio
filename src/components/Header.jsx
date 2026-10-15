import React from 'react';
import { Terminal, ArrowDown, Briefcase, Layers, Gamepad2, Award, BookOpen } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, onOpenConsole }) {
  const navItems = [
    { id: 'experience', labelTop: 'I Work', labelBottom: 'Experience', icon: Briefcase },
    { id: 'projects', labelTop: 'I Build', labelBottom: 'Projects', icon: Layers },
    { id: 'arcade', labelTop: 'I Play', labelBottom: 'Arcade', icon: Gamepad2 },
    { id: 'achievements', labelTop: 'I Achieve', labelBottom: 'Awards', icon: Award },
    { id: 'blogs', labelTop: 'I Write', labelBottom: 'Articles', icon: BookOpen },
  ];

  return (
    <header className="site-header">
      <nav className="header-nav-container" aria-label="Main navigation">
        {/* Logo */}
        <div 
          className="brand-logo cursor-pointer"
          onClick={() => setActiveTab('home')}
        >
          <span className="brand-accent">Vivek</span> Jhooria
        </div>

        {/* Desktop Capsule Nav */}
        <div className="desktop-pill-nav">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const IconComponent = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-capsule-link group ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Active Electric Cyan Sparkle Indicator */}
                {isActive && (
                  <span className="sparkle-indicator" aria-hidden="true">
                    <svg viewBox="4 2 16 16" fill="currentColor" className="size-full">
                      <path d="M12 2c.7 5.6 2.4 7.3 8 8-5.6.7-7.3 2.4-8 8-.7-5.6-2.4-7.3-8-8 5.6-.7 7.3-2.4 8-8Z" />
                    </svg>
                  </span>
                )}

                <IconComponent className="nav-item-icon" size={16} />

                {/* Rolling Text Container */}
                <span className="roller-viewport">
                  <span className="roller-track">
                    <span className="roller-slide top-slide">{item.labelTop}</span>
                    <span className="roller-slide bottom-slide">{item.labelBottom}</span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="header-actions">
          {/* Command Palette Button */}
          <button
            type="button"
            onClick={onOpenConsole}
            aria-label="Open command palette"
            className="header-action-btn terminal-trigger-btn"
          >
            <Terminal size={15} />
            <span className="font-mono text-xs hidden md:inline">⌘K</span>
          </button>

          {/* Resume Button */}
          <a
            href="https://github.com/Vivek19f"
            target="_blank"
            rel="noopener noreferrer"
            className="resume-pill-btn group"
          >
            <ArrowDown size={15} className="resume-icon group-hover:text-accent" />
            <span>Resume</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
