import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Search, Copy, CornerDownLeft, Sparkles, Compass, Zap
} from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { useSound } from '../hooks/useSound';
import { executeCliCommand } from '../utils/commandRegistry';
import { TABS } from '../data/tabs';

export default function CommandPalette({ isOpen, onClose, setActiveTab, onOpenGame }) {
  const { playClick, playSuccess, playWarp, playMeteor, playSupernova } = useSound();
  const [mode, setMode] = useState('menu'); // 'menu' | 'cli'
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  
  // CLI State
  const [cliInput, setCliInput] = useState('');
  const [cliHistory, setCliHistory] = useState([
    { type: 'system', text: "Antigravity CLI v2.4.0 [x86_64-apple-darwin]" },
    { type: 'system', text: "Type 'help' to inspect commands, or 'whoami', 'stack', 'bench'..." }
  ]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [enteredCommands, setEnteredCommands] = useState([]);

  const inputRef = useRef(null);
  const cliInputRef = useRef(null);
  const cliOutputRef = useRef(null);

  // Reusable Escape key hook
  useEscapeKey(onClose, isOpen);

  // Config-driven commands derived from single source of truth
  const navigationItems = TABS.map(tab => ({
    id: tab.id,
    label: tab.id === 'home' ? 'Go to Landing Page (Home)' : `Go to ${tab.labelBottom || tab.title.split('|')[0].trim()} (${tab.labelTop})`,
    icon: tab.icon,
    action: () => {
      playClick();
      setActiveTab(tab.id);
      onClose();
    }
  }));

  const COMMANDS = [
    {
      category: "Navigation",
      items: navigationItems
    },
    {
      category: "Interactive Arcade",
      items: [
        { id: 'constellation', label: 'Play Constellation Connect (Celestial Star Linker)', icon: Compass, action: () => { playClick(); onOpenGame('constellation-connect'); onClose(); } },
        { id: 'math', label: 'Play Quick Math Challenge', icon: Sparkles, action: () => { playClick(); onOpenGame('quick-math'); onClose(); } },
        { id: 'code', label: 'Play Code Review: Spot the Bug', icon: Terminal, action: () => { playClick(); onOpenGame('code-review'); onClose(); } },
        { id: 'speedrun', label: 'Play Code Speedrun (Typing Test)', icon: Terminal, action: () => { playClick(); onOpenGame('speed-typer'); onClose(); } },
        { id: 'memory', label: 'Play Neural Memory Matrix', icon: Sparkles, action: () => { playClick(); onOpenGame('memory-matrix'); onClose(); } },
      ]
    },
    {
      category: "Celestial & Easter Egg Events",
      items: [
        {
          id: 'betelgeuse-supernova',
          label: 'Betelgeuse Supernova Core Collapse (Easter Egg)',
          icon: Sparkles,
          action: () => {
            playSupernova();
            window.dispatchEvent(new CustomEvent('starfield-supernova'));
            onClose();
          }
        },
        {
          id: 'meteor-burst',
          label: 'Launch Seasonal Meteor Shower Burst',
          icon: Zap,
          action: () => {
            playMeteor();
            window.dispatchEvent(new CustomEvent('starfield-meteor-burst'));
            onClose();
          }
        },
        {
          id: 'open-sky',
          label: 'Open Celestial Stardate Observer',
          icon: Compass,
          action: () => {
            playClick();
            window.dispatchEvent(new CustomEvent('starfield-open-observer'));
            onClose();
          }
        }
      ]
    },
    {
      category: "Quick Actions & Links",
      items: [
        { 
          id: 'copy-email', 
          label: 'Copy Email Address (v.jhooria@gmail.com)', 
          icon: Copy, 
          action: () => {
            playSuccess();
            navigator.clipboard.writeText('v.jhooria@gmail.com');
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } 
        },
        { 
          id: 'github', 
          label: 'Open GitHub Profile (@Vivek19f)', 
          icon: FaGithub, 
          action: () => { playClick(); window.open('https://github.com/Vivek19f', '_blank'); onClose(); } 
        },
        { 
          id: 'linkedin', 
          label: 'Connect on LinkedIn', 
          icon: FaLinkedin, 
          action: () => { playClick(); window.open('https://www.linkedin.com/in/vivekjhooria/', '_blank'); onClose(); } 
        },
      ]
    }
  ];

  const filteredCommands = COMMANDS.map(group => ({
    ...group,
    items: group.items.filter(item => 
      item.label.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(group => group.items.length > 0);

  const flatItems = filteredCommands.flatMap(group => group.items);

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      if (mode === 'menu') {
        setTimeout(() => inputRef.current?.focus(), 50);
      } else {
        setTimeout(() => cliInputRef.current?.focus(), 50);
      }
    }
  }, [isOpen, mode]);

  useEffect(() => {
    if (cliOutputRef.current) {
      cliOutputRef.current.scrollTop = cliOutputRef.current.scrollHeight;
    }
  }, [cliHistory]);

  const handleCliSubmit = (e) => {
    e.preventDefault();
    const cmd = cliInput.trim();
    if (!cmd) return;

    playClick();
    setEnteredCommands(prev => [...prev, cmd]);
    setHistoryIndex(-1);

    const result = executeCliCommand(cmd, { playWarp, playSuccess });
    if (result.clear) {
      setCliHistory([]);
      setCliInput('');
      return;
    }

    setCliHistory(prev => [
      ...prev,
      { type: 'command', text: `$ ${cmd}` },
      ...result.entries
    ]);
    setCliInput('');
  };

  const handleCliKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (enteredCommands.length === 0) return;
      const nextIdx = historyIndex === -1 ? enteredCommands.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setCliInput(enteredCommands[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= enteredCommands.length) {
        setHistoryIndex(-1);
        setCliInput('');
      } else {
        setHistoryIndex(nextIdx);
        setCliInput(enteredCommands[nextIdx]);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (mode === 'menu') {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % (flatItems.length || 1));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + flatItems.length) % (flatItems.length || 1));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (flatItems[selectedIndex]) {
            flatItems[selectedIndex].action();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, mode, flatItems, selectedIndex]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="modal-backdrop console-backdrop" onClick={onClose}>
        <motion.div 
          className="console-modal glass-modal"
          onClick={e => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Top Bar with Mode Switcher */}
          <div className="console-top-strip">
            <div className="console-mode-toggle font-mono">
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setMode('menu');
                }}
                className={`mode-pill-btn ${mode === 'menu' ? 'active' : ''}`}
              >
                <Search size={13} />
                <span>Command Menu</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setMode('cli');
                }}
                className={`mode-pill-btn ${mode === 'cli' ? 'active' : ''}`}
              >
                <Terminal size={13} />
                <span>Interactive CLI (&gt;_)</span>
              </button>
            </div>
            <span className="console-esc-hint font-mono">ESC to exit</span>
          </div>

          {/* MODE 1: Standard Navigation Menu */}
          {mode === 'menu' && (
            <>
              {/* Search bar */}
              <div className="console-search-bar">
                <Search size={18} className="console-search-icon" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={e => {
                    setSearch(e.target.value);
                    setSelectedIndex(0);
                  }}
                  placeholder="Type a command, page name or action..."
                  className="console-input font-mono"
                  autoFocus
                />
                {copied && (
                  <span className="console-copied-badge font-mono">
                    Copied!
                  </span>
                )}
              </div>

              {/* Results list */}
              <div className="console-results custom-scrollbar">
                {flatItems.length > 0 ? (
                  filteredCommands.map((group, groupIdx) => (
                    <div key={groupIdx} className="console-group">
                      <div className="console-group-label font-mono">&gt; {group.category}</div>
                      <div className="console-group-items">
                        {group.items.map(item => {
                          const itemIndex = flatItems.findIndex(i => i.id === item.id);
                          const isSelected = itemIndex === selectedIndex;
                          const IconComp = item.icon;

                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={item.action}
                              onMouseEnter={() => setSelectedIndex(itemIndex)}
                              className={`console-item ${isSelected ? 'selected' : ''}`}
                            >
                              <div className="console-item-left">
                                <IconComp size={16} className="console-item-icon" />
                                <span className="console-item-label">{item.label}</span>
                              </div>
                              {isSelected && (
                                <span className="console-item-enter font-mono">↵</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="console-empty font-mono">
                    <p>No commands found matching "{search}".</p>
                    <button 
                      onClick={() => setMode('cli')}
                      className="text-accent underline text-xs mt-2"
                    >
                      Try Interactive CLI mode instead →
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* MODE 2: Interactive Terminal CLI */}
          {mode === 'cli' && (
            <div className="cli-container">
              <div ref={cliOutputRef} className="cli-output custom-scrollbar font-mono">
                {cliHistory.map((item, idx) => (
                  <div key={idx} className={`cli-line cli-${item.type}`}>
                    {item.text}
                  </div>
                ))}
              </div>

              <form onSubmit={handleCliSubmit} className="cli-input-form font-mono">
                <span className="cli-prompt text-accent">vivek@portfolio:~$</span>
                <input
                  ref={cliInputRef}
                  type="text"
                  value={cliInput}
                  onChange={e => setCliInput(e.target.value)}
                  onKeyDown={handleCliKeyDown}
                  placeholder="type 'help', 'whoami', 'stack', 'bench'..."
                  className="cli-text-input font-mono"
                  autoFocus
                />
                <button type="submit" className="cli-submit-btn" aria-label="Run command">
                  <CornerDownLeft size={14} />
                </button>
              </form>
            </div>
          )}

          {/* Console Footer */}
          <div className="console-footer font-mono">
            <div className="console-hint">
              <span>{mode === 'menu' ? '↑↓ Navigate' : 'Enter: Run command'}</span>
              <span className="console-separator">•</span>
              <span>{mode === 'menu' ? '↵ Select' : 'Type "clear" to reset'}</span>
            </div>
            <div className="console-brand">
              <span className="text-accent">Vivek</span> Terminal Engine
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
