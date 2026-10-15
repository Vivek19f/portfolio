import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ExternalLink, 
  BookOpen, 
  Clock, 
  Calendar, 
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';
import { 
  fetchMediumArticles, 
  MEDIUM_PROFILE_URL,
  FALLBACK_ARTICLES 
} from '../../services/mediumService';
import { BLOGS_DATA } from '../../data/constants';

export default function BlogsTab({ setActiveTab }) {
  const [articles, setArticles] = useState(BLOGS_DATA || FALLBACK_ARTICLES);
  const [, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [, setMeta] = useState({ isLive: true, source: 'cached' });

  useEffect(() => {
    let isMounted = true;

    async function loadArticles() {
      try {
        setLoading(true);
        const res = await fetchMediumArticles();
        if (isMounted && res.articles && res.articles.length > 0) {
          setArticles(res.articles);
          setMeta({ isLive: res.isLive, source: res.source });
        }
      } catch (err) {
        console.warn('Failed to load live articles:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadArticles();
    return () => { isMounted = false; };
  }, []);

  const handleRefresh = async () => {
    try {
      soundEngine.playClick();
      setIsRefreshing(true);
      // Clear cache to force fresh pull
      if (typeof window !== 'undefined') {
        localStorage.removeItem('vivek_medium_articles_v1');
      }
      const res = await fetchMediumArticles();
      if (res.articles && res.articles.length > 0) {
        setArticles(res.articles);
        setMeta({ isLive: res.isLive, source: 'fresh' });
        soundEngine.playSuccess();
      }
    } catch {
      // ignore
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  return (
    <motion.main 
      key="blogs"
      className="main-content experience-section"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.35 }}
    >
      <div className="glass-panel experience-card blogs-container">
        <div className="blogs-header-row">
          <button 
            className="back-button" 
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('home');
            }}
          >
            <ArrowLeft size={16} /> Back to Overview
          </button>

          <div className="blogs-live-pill-group">
            <span className="blogs-live-pill">
              <span className="live-pulse-dot" />
              <span>Auto-synced via Medium RSS</span>
            </span>

            <button 
              className={`blogs-refresh-btn ${isRefreshing ? 'rotating' : ''}`}
              onClick={handleRefresh}
              title="Force re-sync from Medium RSS"
            >
              <RefreshCw size={13} className={isRefreshing ? 'spin-icon' : ''} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          </div>
        </div>

        <div className="blogs-title-area">
          <div className="blogs-badge-tag">
            <BookOpen size={14} />
            <span>THOUGHT LEADERSHIP &amp; ARCHITECTURE</span>
          </div>
          <h2>Publications &amp; Articles</h2>
          <p className="blogs-lead-text">
            Deep-dives into distributed frontend state, real-world systems scaling, architecture traps, and web performance. Whenever I publish on Medium, it automatically reflects here.
          </p>
        </div>

        <div className="blogs-feed-grid">
          {articles.map((blog, index) => (
            <motion.article 
              key={blog.url || index} 
              className="blog-feed-card"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.3 }}
            >
              <div className="blog-card-meta-top">
                <div className="blog-card-date-wrap">
                  <Calendar size={13} />
                  <span>{blog.date || 'Recent'}</span>
                </div>
                <div className="blog-card-readtime-wrap">
                  <Clock size={13} />
                  <span>{blog.readTime || '5 min read'}</span>
                </div>
                <span className="blog-platform-badge">Medium</span>
              </div>

              <h3 className="blog-card-title">
                <a 
                  href={blog.url} 
                  target="_blank" 
                  rel="noreferrer"
                  onClick={() => soundEngine.playClick()}
                >
                  {blog.title}
                </a>
              </h3>

              <p className="blog-card-desc">{blog.description}</p>

              {Array.isArray(blog.categories) && blog.categories.length > 0 && (
                <div className="blog-card-tags">
                  {blog.categories.slice(0, 4).map((tag, tIdx) => (
                    <span key={tIdx} className="blog-tag-pill">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="blog-card-footer">
                <a 
                  href={blog.url} 
                  className="blog-read-link" 
                  target="_blank" 
                  rel="noreferrer"
                  onClick={() => soundEngine.playClick()}
                >
                  <span>Read Article on Medium</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="blogs-footer-banner">
          <div className="blogs-footer-content">
            <div className="blogs-footer-icon">
              <Sparkles size={20} />
            </div>
            <div>
              <h4>Follow on Medium (@robotChat)</h4>
              <p>Catch upcoming articles on frontend telemetry, WebGL shaders, and high-frequency UI pipelines.</p>
            </div>
          </div>
          <a 
            href={MEDIUM_PROFILE_URL}
            target="_blank" 
            rel="noreferrer" 
            className="blogs-medium-cta"
            onClick={() => soundEngine.playClick()}
          >
            <span>View Medium Profile</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </motion.main>
  );
}
