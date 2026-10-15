import { useEffect } from 'react';

/**
 * Reusable hook to handle Escape key dismissal for modals and overlays.
 * Eliminates duplicate window event listener boilerplate across modal components.
 * 
 * @param {Function} onEscape Callback fired when the Escape key is pressed
 * @param {boolean} [isActive=true] Whether the listener is currently active
 */
export function useEscapeKey(onEscape, isActive = true) {
  useEffect(() => {
    if (!isActive || !onEscape) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onEscape();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onEscape, isActive]);
}
