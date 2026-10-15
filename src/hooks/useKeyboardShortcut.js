import { useEffect } from 'react';

/**
 * Reusable hook for global keyboard shortcuts (e.g. Command+K / Ctrl+K).
 * 
 * @param {string} key Target key character (e.g. 'k')
 * @param {Function} handler Callback when shortcut matches
 * @param {Object} [options]
 * @param {boolean} [options.metaOrCtrl=true] Require Meta (Cmd) or Ctrl modifier
 * @param {boolean} [options.preventDefault=true] Prevent default browser behavior
 */
export function useKeyboardShortcut(key, handler, { metaOrCtrl = true, preventDefault = true } = {}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const modifierMatch = metaOrCtrl ? (e.metaKey || e.ctrlKey) : true;
      if (modifierMatch && e.key.toLowerCase() === key.toLowerCase()) {
        if (preventDefault) e.preventDefault();
        handler(e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, handler, metaOrCtrl, preventDefault]);
}
