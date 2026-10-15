import React from 'react';
import { Briefcase, Layers, Gamepad2, Award, Mail } from 'lucide-react';

export default function MobileNav({ activeTab, setActiveTab }) {
  const items = [
    { id: 'experience', label: 'I Work', icon: Briefcase },
    { id: 'projects', label: 'I Build', icon: Layers },
    { id: 'arcade', label: 'I Play', icon: Gamepad2 },
    { id: 'achievements', label: 'I Achieve', icon: Award },
    { id: 'blogs', label: 'I Write', icon: Mail },
  ];

  return (
    <nav className="mobile-dock-nav" aria-label="Mobile Navigation">
      <ul className="mobile-dock-grid">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          const IconComp = item.icon;

          return (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`mobile-dock-btn ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {isActive && (
                  <span className="mobile-sparkle">
                    <svg viewBox="4 2 16 16" fill="currentColor">
                      <path d="M12 2c.7 5.6 2.4 7.3 8 8-5.6.7-7.3 2.4-8 8-.7-5.6-2.4-7.3-8-8 5.6-.7 7.3-2.4 8-8Z" />
                    </svg>
                  </span>
                )}
                <IconComp size={20} className="mobile-dock-icon" />
                <span className="mobile-dock-label font-mono">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
