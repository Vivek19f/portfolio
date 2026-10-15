import React, { useState, useEffect } from 'react';
import { Terminal, ArrowDown, Briefcase, Layers, Gamepad2, Award, BookOpen, Volume2, VolumeX } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export default function Header({ activeTab, setActiveTab, onOpenConsole }) {
  const [isSoundOn, setIsSoundOn] = useState(false);

  useEffect(() => {
    setIsSoundOn(soundEngine.isEnabled());
  }, []);

  const handleToggleSound = () => {
    const nextState = soundEngine.toggle();
    setIsSoundOn(nextState);
  };

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
          onClick={() => {
            soundEngine.playClick();
            setActiveTab('home');
          }}
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
                onClick={() => {
                  soundEngine.playTabSwitch();
                  setActiveTab(item.id);
                }}
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
          {/* Audio Synthesizer Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            aria-label={isSoundOn ? "Mute sound effects" : "Enable sound effects"}
            title={isSoundOn ? "Sound Effects: ON (Click to mute)" : "Sound Effects: OFF (Click to unmute)"}
            className={`header-action-btn sound-toggle-btn ${isSoundOn ? 'sound-active' : ''}`}
          >
            {isSoundOn ? (
              <Volume2 size={15} className="text-accent" />
            ) : (
              <VolumeX size={15} className="text-secondary opacity-60" />
            )}
          </button>

          {/* Command Palette Button */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playModalOpen();
              onOpenConsole();
            }}
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
            onClick={() => soundEngine.playClick()}
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
