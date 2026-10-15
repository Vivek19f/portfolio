import React from 'react';
import { Terminal, ArrowDown, Volume2, VolumeX, Compass } from 'lucide-react';
import { useSound } from '../hooks/useSound';
import { NAV_TABS } from '../data/tabs';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  onOpenConsole,
  skyMonth = 9,
  skyYear = 2026,
  onToggleCelestial
}) {
  const { isSoundOn, toggleSound, playClick, playTabSwitch, playModalOpen } = useSound();

  return (
    <header className="site-header">
      <nav className="header-nav-container" aria-label="Main navigation">
        {/* Logo */}
        <div 
          className="brand-logo cursor-pointer"
          onClick={() => {
            playClick();
            setActiveTab('home');
          }}
        >
          <span className="brand-accent">Vivek</span> Jhooria
        </div>

        {/* Desktop Capsule Nav */}
        <div className="desktop-pill-nav">
          {NAV_TABS.map((item) => {
            const isActive = activeTab === item.id;
            const IconComponent = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  playTabSwitch();
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
          {/* Stargazer Sky Date Trigger */}
          <button
            type="button"
            onClick={() => {
              playClick();
              onToggleCelestial?.();
            }}
            aria-label="Open celestial stardate observer"
            title="Adjust starfield Month & Year"
            className="header-action-btn celestial-header-btn group"
          >
            <Compass size={15} className="text-accent group-hover:rotate-45 transition-transform" />
            <span className="font-mono text-xs hidden lg:inline text-secondary group-hover:text-white">
              {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][skyMonth]} '{String(skyYear).slice(-2)}
            </span>
          </button>

          {/* Audio Synthesizer Toggle */}
          <button
            type="button"
            onClick={toggleSound}
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
              playModalOpen();
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
            onClick={() => playClick()}
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
