import React from 'react';

export default function Header({ activeTab, setActiveTab }) {
  return (
    <header className="header minimalist-header">
      <div className="logo" onClick={() => setActiveTab('home')} style={{cursor: 'pointer'}}>VJ.</div>
      <nav className="nav-links">
        <button className={`nav-button ${activeTab === 'experience' ? 'active' : ''}`} onClick={() => setActiveTab('experience')}>Experience</button>
        <button className={`nav-button ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>Projects</button>
        <button className={`nav-button ${activeTab === 'achievements' ? 'active' : ''}`} onClick={() => setActiveTab('achievements')}>Achievements</button>
      </nav>
    </header>
  );
}
