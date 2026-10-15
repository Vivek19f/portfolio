import React, { useState, useEffect } from 'react';
import { GitCommit, Star, FolderGit2, Activity, Cpu, ExternalLink } from 'lucide-react';
import { fetchGitHubTelemetry, getSynchronousTelemetry } from '../services/githubService';

export default function GitHubTelemetryBar() {
  const [telemetry, setTelemetry] = useState(() => getSynchronousTelemetry());
  const [fps, setFps] = useState(60);

  // Measure real client frame rate
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId;

    const tick = () => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        const measured = Math.min(60, Math.round((frameCount * 1000) / (now - lastTime)));
        setFps((prev) => (prev === measured ? prev : measured));
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  useEffect(() => {
    let mounted = true;
    fetchGitHubTelemetry().then((data) => {
      if (mounted && data) setTelemetry(data);
    });
    return () => { mounted = false; };
  }, []);

  const stats = telemetry?.stats || { totalStars: 28, totalRepos: 18, topLanguages: ['TypeScript', 'Python', 'Node.js', 'React'] };
  const latestActivity = telemetry?.latestActivity || { repo: 'Vivek19f/portfolio', message: 'Code updates & commits', relativeTime: 'Today', url: 'https://github.com/Vivek19f/portfolio' };
  const source = telemetry?.source || 'cached';

  return (
    <div className="github-telemetry-container">
      {/* Top Banner Status */}
      <div className="telemetry-header-strip">
        <div className="telemetry-live-pill font-mono">
          <span className="telemetry-pulse-dot"></span>
          <span>LIVE GITHUB TELEMETRY</span>
          <span className="telemetry-source-tag">[{source.toUpperCase()}]</span>
        </div>

        <div className="telemetry-runtime-pill font-mono">
          <Activity size={12} className="text-accent animate-pulse" />
          <span>WebGL: {fps} FPS</span>
          <span className="telemetry-meta-sep">•</span>
          <span>16.6ms frame tick</span>
        </div>
      </div>

      {/* Grid of Dynamic Metrics */}
      <div className="telemetry-grid">
        {/* Card 1: Latest Activity */}
        <a 
          href={latestActivity.url}
          target="_blank"
          rel="noopener noreferrer"
          className="telemetry-metric-card telemetry-activity-card group"
        >
          <div className="telemetry-card-top">
            <span className="telemetry-card-label font-mono">
              <GitCommit size={13} className="text-accent" />
              LATEST COMMIT
            </span>
            <span className="telemetry-time-badge font-mono">{latestActivity.relativeTime}</span>
          </div>
          <div className="telemetry-commit-body">
            <span className="telemetry-repo-name font-mono">{latestActivity.repo}</span>
            <p className="telemetry-commit-text font-mono">"{latestActivity.message}"</p>
          </div>
          <div className="telemetry-card-action font-mono">
            <span>View commit</span>
            <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </a>

        {/* Card 2: Repositories & Stars */}
        <div className="telemetry-metric-card">
          <div className="telemetry-card-top">
            <span className="telemetry-card-label font-mono">
              <FolderGit2 size={13} className="text-accent" />
              PUBLIC REPOSITORIES
            </span>
            <span className="telemetry-stars-badge font-mono">
              <Star size={11} className="text-yellow-400 fill-yellow-400" />
              {stats.totalStars}+ stars
            </span>
          </div>
          <div className="telemetry-stat-value font-mono">
            <span className="telemetry-big-number">{stats.totalRepos}</span>
            <span className="telemetry-unit">repos</span>
          </div>
          <div className="telemetry-card-sub font-mono">
            <span>open source & architecture</span>
          </div>
        </div>

        {/* Card 3: Primary Languages */}
        <div className="telemetry-metric-card">
          <div className="telemetry-card-top">
            <span className="telemetry-card-label font-mono">
              <Cpu size={13} className="text-accent" />
              PRIMARY STACK
            </span>
            <span className="telemetry-live-badge font-mono">Active</span>
          </div>
          <div className="telemetry-langs-list font-mono">
            {stats.topLanguages.map((lang, idx) => (
              <span key={idx} className="telemetry-lang-badge">
                <span className="lang-color-dot"></span>
                {lang}
              </span>
            ))}
          </div>
          <div className="telemetry-card-sub font-mono">
            <span>distributed systems & UI</span>
          </div>
        </div>
      </div>
    </div>
  );
}
