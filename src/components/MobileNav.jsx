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
                  <span className="predator-laser-sight mobile-laser" aria-hidden="true">
                    <span className="laser-triangle">
                      <span className="laser-dot dot-top" />
                      <span className="laser-dot dot-bottom-left" />
                      <span className="laser-dot dot-bottom-right" />
                    </span>
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
