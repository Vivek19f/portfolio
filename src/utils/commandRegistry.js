/**
 * Command Strategy Registry for Antigravity Terminal CLI.
 * Follows Open/Closed Principle (OCP) and Single Responsibility Principle (SRP).
 * Handlers receive context ({ playWarp, playSuccess }) and return output entries or control actions.
 */

export const CLI_COMMANDS = {
  help: {
    description: 'Inspect available system commands',
    execute: () => [
      {
        type: 'output',
        text: `Available commands:
  • whoami       : Staff Full Stack Engineer bio & overview
  • stack        : Primary languages, frameworks & system tools
  • contact      : Communication channels & email link
  • bench        : Real-time browser environment & WebGL telemetry
  • cat /resume  : Work history & leadership summary
  • sky          : Open Celestial Stardate Observer (month/year selector)
  • warp         : Trigger hyperspace starfield acceleration
  • clear        : Clear console output history`,
      },
    ],
  },

  whoami: {
    description: 'Staff Full Stack Engineer bio & overview',
    execute: () => [
      {
        type: 'output',
        text: `VIVEK JHOORIA
Title: Staff Full Stack Engineer (Frontend Architect & Distributed UI Systems)
Focus: High-throughput telemetry, Micro-Frontends, real-time graph analytics, AST parsers.
Base: India (IST, UTC+5:30) • Open to Staff & Principal engineering roles.`,
      },
    ],
  },

  stack: {
    description: 'Core languages, frameworks & systems',
    execute: () => [
      {
        type: 'output',
        text: `CORE TECHNOLOGY MATRIX:
• Languages: TypeScript, Python, Node.js, Go, SQL
• Frontend : React 19, Next.js, WebGL / Canvas, D3.js, Framer Motion
• Systems  : Web Workers, Web Streams, SSE, WebSockets, Module Federation
• Tools    : Vite, Docker, GitHub Actions, AWS, Tailwind CSS, Jest/Vitest`,
      },
    ],
  },

  contact: {
    description: 'Communication channels & links',
    execute: () => [
      {
        type: 'output',
        text: `GET IN TOUCH:
• Email    : v.jhooria@gmail.com
• GitHub   : https://github.com/Vivek19f
• LinkedIn : https://www.linkedin.com/in/vivekjhooria/`,
      },
    ],
  },

  bench: {
    description: 'Client runtime and browser benchmark',
    execute: () => {
      const dpr = window.devicePixelRatio || 1;
      const mem = performance.memory
        ? `${Math.round(performance.memory.usedJSHeapSize / 1048576)} MB heap`
        : 'Protected';
      return [
        {
          type: 'output',
          text: `CLIENT RUNTIME BENCHMARK:
• Viewport : ${window.innerWidth} x ${window.innerHeight} (DPR ${dpr})
• Renderer : WebGL 2.0 Canvas Starfield @ 60 FPS
• Memory   : ${mem}
• Latency  : < 16.6ms target frame budget`,
        },
      ];
    },
  },

  'cat /resume': {
    description: 'Work history & leadership digest',
    execute: () => [
      {
        type: 'output',
        text: `RESUME DIGEST:
• Lead UI Architect (Cybersecurity Platform) - MITRE ATT&CK Matrix & TTP Analytics
• Senior Software Engineer - Schema-Driven Ingestion Engine (50k rows/s)
• Frontend Architect - Enterprise Micro-Frontend Migration (15+ codebases unified)
• Publications: Technical blogs on distributed frontend state & real-time analytics`,
      },
    ],
  },

  resume: {
    aliasOf: 'cat /resume',
  },

  warp: {
    description: 'Trigger hyperspace starfield acceleration',
    execute: ({ playWarp }) => {
      playWarp?.();
      window.dispatchEvent(new CustomEvent('starfield-warp'));
      return [
        {
          type: 'success',
          text: `[HYPERSPACE TRIGGERED] Engaging maximum particle warp velocity... 🚀`,
        },
      ];
    },
  },

  matrix: {
    aliasOf: 'warp',
  },

  sky: {
    description: 'Open Celestial Stardate Observer',
    execute: ({ playSuccess }) => {
      playSuccess?.();
      window.dispatchEvent(new CustomEvent('starfield-open-observer'));
      return [
        {
          type: 'success',
          text: `[CELESTIAL STARDATE OBSERVER] Engaging stardate console. Rotating night sky... 🔭`,
        },
      ];
    },
  },

  stargazer: {
    aliasOf: 'sky',
  },

  orbit: {
    aliasOf: 'sky',
  },
};

/**
 * Dispatches a CLI command to registered handlers.
 * @param {string} rawInput 
 * @param {Object} context Sound and UI triggers
 * @returns {{ clear: boolean, entries: Array<{ type: string, text: string }> }}
 */
export function executeCliCommand(rawInput, context = {}) {
  const trimmed = rawInput.trim();
  const lower = trimmed.toLowerCase();

  if (lower === 'clear') {
    return { clear: true, entries: [] };
  }

  let handler = CLI_COMMANDS[lower];
  if (handler && handler.aliasOf) {
    handler = CLI_COMMANDS[handler.aliasOf];
  }

  // Handle prefix commands like "sky 2026"
  if (!handler && lower.startsWith('sky')) {
    handler = CLI_COMMANDS.sky;
  }

  if (handler) {
    const entries = handler.execute(context);
    return { clear: false, entries };
  }

  return {
    clear: false,
    entries: [
      {
        type: 'error',
        text: `zsh: command not found: ${trimmed}. Type 'help' for available commands.`,
      },
    ],
  };
}
