import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, AlertTriangle, Compass } from 'lucide-react';

export default function CelestialEventToast() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleEvent = (e) => {
      if (e.detail) {
        setToast(e.detail);
      }
    };

    window.addEventListener('celestial-event-toast', handleEvent);
    return () => window.removeEventListener('celestial-event-toast', handleEvent);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, toast.duration || 5000);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!toast) return null;

  const isSupernova = toast.type === 'supernova';

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ opacity: 0, y: -30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className={`celestial-toast-root ${isSupernova ? 'toast-supernova' : ''}`}
        role="alert"
        aria-live="polite"
      >
        <div className="celestial-toast-content">
          <div className="celestial-toast-badge font-mono">
            {isSupernova ? '💥 EASTER SUPERNOVA' : toast.badge || '🔭 ASTRONOMY'}
          </div>
          <div className="celestial-toast-body">
            <h4 className="celestial-toast-title font-mono">{toast.title}</h4>
            <p className="celestial-toast-desc">{toast.desc}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setToast(null)}
          className="celestial-toast-close"
          aria-label="Dismiss celestial notification"
        >
          <X size={15} />
        </button>
      </motion.aside>
    </AnimatePresence>
  );
}
