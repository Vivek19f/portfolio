import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Search, Briefcase, Layers, Gamepad2, Award, 
  BookOpen, Mail, Copy, ArrowDown, Check, Sparkles, Code2, Play, CornerDownLeft
} from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { soundEngine } from '../utils/soundEngine';

export default function CommandPalette({ isOpen, onClose, setActiveTab, onOpenGame }) {
  const [mode, setMode] = useState('menu'); // 'menu' | 'cli'
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  
  // CLI State
  const [cliInput, setCliInput] = useState('');
  const [cliHistory, setCliHistory] = useState([
    { type: 'system', text: "Antigravity CLI v2.4.0 [x86_64-apple-darwin]" },
    { type: 'system', text: "Type 'help' to inspect available system commands, or 'warp' for hyperspace." }
  ]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [enteredCommands, setEnteredCommands] = useState([]);

  const inputRef = useRef(null);
  const cliInputRef = useRef(null);
  const cliOutputRef = useRef(null);

  const COMMANDS = [
    {
      category: "Navigation",
      items: [
        { id: 'home', label: 'Go to Landing Page (Home)', icon: Sparkles, action: () => { soundEngine.playClick(); setActiveTab('home'); onClose(); } },
        { id: 'projects', label: 'Go to Projects (I Build)', icon: Layers, action: () => { soundEngine.playClick(); setActiveTab('projects'); onClose(); } },
        { id: 'experience', label: 'Go to Experience (I Work)', icon: Briefcase, action: () => { soundEngine.playClick(); setActiveTab('experience'); onClose(); } },
        { id: 'arcade', label: 'Go to Arcade (I Play)', icon: Gamepad2, action: () => { soundEngine.playClick(); setActiveTab('arcade'); onClose(); } },
        { id: 'achievements', label: 'Go to Achievements', icon: Award, action: () => { soundEngine.playClick(); setActiveTab('achievements'); onClose(); } },
        { id: 'blogs', label: 'Go to Publications & Talks', icon: BookOpen, action: () => { soundEngine.playClick(); setActiveTab('blogs'); onClose(); } },
      ]
    },
    {
      category: "Interactive Arcade",
      items: [
        { id: 'math', label: 'Play Quick Math Challenge', icon: Sparkles, action: () => { soundEngine.playClick(); onOpenGame('quick-math'); onClose(); } },
        { id: 'code', label: 'Play Code Review: Spot the Bug', icon: Terminal, action: () => { soundEngine.playClick(); onOpenGame('code-review'); onClose(); } },
        { id: 'speedrun', label: 'Play Code Speedrun (Typing Test)', icon: Terminal, action: () => { soundEngine.playClick(); onOpenGame('speed-typer'); onClose(); } },
        { id: 'memory', label: 'Play Neural Memory Matrix', icon: Sparkles, action: () => { soundEngine.playClick(); onOpenGame('memory-matrix'); onClose(); } },
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
            soundEngine.playSuccess();
            navigator.clipboard.writeText('v.jhooria@gmail.com');
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } 
        },
        { 
          id: 'github', 
          label: 'Open GitHub Profile (@Vivek19f)', 
          icon: FaGithub, 
          action: () => { soundEngine.playClick(); window.open('https://github.com/Vivek19f', '_blank'); onClose(); } 
        },
        { 
          id: 'linkedin', 
          label: 'Connect on LinkedIn', 
          icon: FaLinkedin, 
          action: () => { soundEngine.playClick(); window.open('https://www.linkedin.com/in/vivekjhooria/', '_blank'); onClose(); } 
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

    soundEngine.playClick();
    setEnteredCommands(prev => [...prev, cmd]);
    setHistoryIndex(-1);

    const newEntries = [{ type: 'command', text: `$ ${cmd}` }];
    const lower = cmd.toLowerCase();

    if (lower === 'help') {
      newEntries.push({
        type: 'output',
        text: `Available commands:
  • whoami       : Staff Full Stack Engineer bio & overview
  • stack        : Primary languages, frameworks & system tools
  • contact      : Communication channels & email link
  • bench        : Real-time browser environment & WebGL telemetry
  • cat /resume  : Work history & leadership summary
  • warp         : Trigger hyperspace starfield acceleration
  • clear        : Clear console output history`
      });
    } else if (lower === 'whoami') {
      newEntries.push({
        type: 'output',
        text: `VIVEK JHOORIA
Title: Staff Full Stack Engineer (Frontend Architect & Distributed UI Systems)
Focus: High-throughput telemetry, Micro-Frontends, real-time graph analytics, AST parsers.
Base: India (IST, UTC+5:30) • Open to Staff & Principal engineering roles.`
      });
    } else if (lower === 'stack') {
      newEntries.push({
        type: 'output',
        text: `CORE TECHNOLOGY MATRIX:
• Languages: TypeScript, Python, Node.js, Go, SQL
• Frontend : React 19, Next.js, WebGL / Canvas, D3.js, Framer Motion
• Systems  : Web Workers, Web Streams, SSE, WebSockets, Module Federation
• Tools    : Vite, Docker, GitHub Actions, AWS, Tailwind CSS, Jest/Vitest`
      });
    } else if (lower === 'contact') {
      newEntries.push({
        type: 'output',
        text: `GET IN TOUCH:
• Email    : v.jhooria@gmail.com
• GitHub   : https://github.com/Vivek19f
• LinkedIn : https://www.linkedin.com/in/vivekjhooria/`
      });
    } else if (lower === 'bench') {
      const dpr = window.devicePixelRatio || 1;
      const mem = performance.memory ? `${Math.round(performance.memory.usedJSHeapSize / 1048576)} MB heap` : 'Protected';
      newEntries.push({
        type: 'output',
        text: `CLIENT RUNTIME BENCHMARK:
• Viewport : ${window.innerWidth} x ${window.innerHeight} (DPR ${dpr})
• Renderer : WebGL 2.0 Canvas Starfield @ 60 FPS
• Memory   : ${mem}
• Latency  : < 16.6ms target frame budget`
      });
    } else if (lower === 'cat /resume') {
      newEntries.push({
        type: 'output',
        text: `RESUME DIGEST:
• Lead UI Architect (Cybersecurity Platform) - MITRE ATT&CK Matrix & TTP Analytics
• Senior Software Engineer - Schema-Driven Ingestion Engine (50k rows/s)
• Frontend Architect - Enterprise Micro-Frontend Migration (15+ codebases unified)
• Publications: Technical blogs on distributed frontend state & real-time analytics`
      });
    } else if (lower === 'warp' || lower === 'matrix') {
      soundEngine.playWarp();
      newEntries.push({
        type: 'success',
        text: `[HYPERSPACE TRIGGERED] Engaging maximum particle warp velocity... 🚀`
      });
      // Fire custom event for starfield acceleration
      window.dispatchEvent(new CustomEvent('starfield-warp'));
    } else if (lower === 'clear') {
      setCliHistory([]);
      setCliInput('');
      return;
    } else {
      newEntries.push({
        type: 'error',
        text: `zsh: command not found: ${cmd}. Type 'help' for available commands.`
      });
    }

    setCliHistory(prev => [...prev, ...newEntries]);
    setCliInput('');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
        return;
      }

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
  }, [isOpen, mode, flatItems, selectedIndex, onClose]);

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
                  soundEngine.playClick();
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
                  soundEngine.playClick();
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
              <div className="console-search-wrapper">
                <Search size={18} className="console-terminal-icon text-accent" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setSelectedIndex(0); }}
                  placeholder="Type a command or search tabs..."
                  className="console-search-input font-mono"
                />
              </div>

              {/* Toast on copy */}
              {copied && (
                <div className="console-toast font-mono">
                  <Check size={14} className="text-green-400" /> Copied v.jhooria@gmail.com to clipboard!
                </div>
              )}

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
