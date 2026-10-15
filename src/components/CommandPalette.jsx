import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Search, Briefcase, Layers, Gamepad2, Award, 
  BookOpen, Mail, Copy, ArrowDown, Check, Sparkles 
} from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export default function CommandPalette({ isOpen, onClose, setActiveTab, onOpenGame }) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);

  const COMMANDS = [
    {
      category: "Navigation",
      items: [
        { id: 'projects', label: 'Go to Projects (I Build)', icon: Layers, action: () => { setActiveTab('projects'); onClose(); } },
        { id: 'experience', label: 'Go to Experience (I Work)', icon: Briefcase, action: () => { setActiveTab('experience'); onClose(); } },
        { id: 'arcade', label: 'Go to Arcade (I Play)', icon: Gamepad2, action: () => { setActiveTab('arcade'); onClose(); } },
        { id: 'achievements', label: 'Go to Achievements', icon: Award, action: () => { setActiveTab('achievements'); onClose(); } },
        { id: 'blogs', label: 'Go to Publications & Talks', icon: BookOpen, action: () => { setActiveTab('blogs'); onClose(); } },
      ]
    },
    {
      category: "Interactive Arcade",
      items: [
        { id: 'math', label: 'Play Quick Math Challenge', icon: Sparkles, action: () => { onOpenGame('quick-math'); onClose(); } },
        { id: 'code', label: 'Play Code Review: Spot the Bug', icon: Terminal, action: () => { onOpenGame('code-review'); onClose(); } },
        { id: 'mine', label: 'Play Minesweeper', icon: Gamepad2, action: () => { onOpenGame('minesweeper'); onClose(); } },
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
            navigator.clipboard.writeText('v.jhooria@gmail.com');
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } 
        },
        { 
          id: 'github', 
          label: 'Open GitHub Profile (@Vivek19f)', 
          icon: FaGithub, 
          action: () => { window.open('https://github.com/Vivek19f', '_blank'); onClose(); } 
        },
        { 
          id: 'linkedin', 
          label: 'Connect on LinkedIn', 
          icon: FaLinkedin, 
          action: () => { window.open('https://www.linkedin.com/in/vivekjhooria/', '_blank'); onClose(); } 
        },
        { 
          id: 'resume', 
          label: 'Download Engineering Resume (PDF)', 
          icon: ArrowDown, 
          action: () => { window.open('https://github.com/Vivek19f', '_blank'); onClose(); } 
        },
      ]
    }
  ];

  // Flatten filtered list
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
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
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
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, flatItems, selectedIndex, onClose]);

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
          {/* Search bar */}
          <div className="console-search-wrapper">
            <Terminal size={18} className="console-terminal-icon text-accent" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setSelectedIndex(0); }}
              placeholder="Type a command or search tabs..."
              className="console-search-input font-mono"
            />
            <span className="console-esc-hint font-mono">ESC</span>
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
                  {group.items.map((item) => {
                    const itemGlobalIndex = flatItems.findIndex(i => i.id === item.id);
                    const isSelected = itemGlobalIndex === selectedIndex;
                    const IconComp = item.icon;

                    return (
                      <div
                        key={item.id}
                        onClick={item.action}
                        onMouseEnter={() => setSelectedIndex(itemGlobalIndex)}
                        className={`console-item ${isSelected ? 'selected' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          <IconComp size={16} className={isSelected ? 'text-accent' : 'text-muted-custom'} />
                          <span className="console-item-text">{item.label}</span>
                        </div>
                        {isSelected && <span className="font-mono text-xs text-accent">↵ select</span>}
                      </div>
                    );
                  })}
                </div>
              ))
            ) : (
              <div className="console-empty font-mono">
                No matching commands found for "{search}"
              </div>
            )}
          </div>

          {/* Console footer */}
          <div className="console-footer font-mono">
            <span>Navigation: ↑ ↓ keys</span>
            <span>Select: ↵ Enter</span>
            <span>Close: ESC</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
