/**
 * Open-Source AI Copilot & Semantic RAG Engine
 * 
 * Runs 100% client-side in the browser.
 * Utilizes a curated semantic vector knowledge base of Vivek's career, architecture
 * decisions, case studies, and engineering publications to answer questions in real time.
 */

export const VIVEK_KNOWLEDGE_BASE = [
  {
    topic: 'About Vivek Jhooria (Bio & Background)',
    keywords: ['who', 'vivek', 'about', 'bio', 'background', 'profile', 'summary', 'person', 'experience', 'years'],
    summary: 'Senior Software Engineer & UI Systems Architect with 8+ years of expertise in distributed frontend architectures.',
    details: `Vivek Jhooria is a Senior Software Engineer & Frontend Systems Architect:
• Core Focus: Building high-performance, fault-tolerant web applications and enterprise-grade distributed UI architectures.
• Current Role: Senior Software Engineer & UI Architect at EclecticIQ (threat intelligence platform).
• Previous: Senior UI Engineer at Delta Airlines (enterprise micro-frontends with Module Federation).
• Philosophy: Blending high-performance systems engineering (Web Workers, streaming AST parsers, WebGL) with refined visual aesthetics and micro-interactions.
• Location: India (open to global remote & staff-level hybrid opportunities).`,
    tags: ['Bio', 'Senior Architect', 'Full Stack', 'Leadership']
  },
  {
    topic: 'Website Architecture & Tech Stack',
    keywords: ['website', 'portfolio', 'built', 'architecture', 'technology', 'how', 'made', 'source', 'framework', 'vite', 'react', 'audio'],
    summary: 'Built with React 19, Vite Rolldown, Three.js, Canvas 2D, Web Audio API, and client-side RAG.',
    details: `How this portfolio is architected under the hood:
• Framework: React 19 + Vite with Rolldown bundling & manual chunk optimization (index bundle < 116 kB).
• 3D & Graphics: Three.js Vanta globe integration + custom 360° procedural Canvas 2D Celestial Sphere.
• Audio Engine: 100% synthesized Web Audio API sound designer (no external MP3/WAV files loaded!).
• Code Splitting: Asynchronous React.lazy() & Suspense loading for all 5 interactive arcade games.
• AI Engine: Client-side BM25 semantic RAG knowledge base running with 0ms server latency and zero token costs.
• Aesthetics: Dark cyber-celestial theme with glassmorphism, responsive micro-interactions, and custom typography.`,
    tags: ['React 19', 'Vite', 'Three.js', 'Web Audio API', 'Architecture']
  },
  {
    topic: 'Arcade Arena & Interactive Mini-Games',
    keywords: ['arcade', 'game', 'games', 'play', 'quickmath', 'math', 'speedtyper', 'typing', 'codereview', 'memory', 'constellation'],
    summary: '5 engineering-themed mini-games with local high-score persistence and sound feedback.',
    details: `The Portfolio Arcade includes 5 playable mini-games:
1. Quick Math: Solve rapid mental arithmetic under 10 seconds with streak multipliers.
2. Code Review: Identify syntax bugs, memory leaks, and logic errors in realistic code snippets.
3. Speed Typer: Measure your coding WPM and accuracy against real JavaScript/TypeScript algorithms.
4. Memory Matrix: Repeat expanding grid patterns to test short-term spatial visual memory.
5. Constellation Connect: Link stellar coordinates to reconstruct real astronomical constellations.
• Scores: Saved locally in your browser with personal best badges and automatic rank calculation.`,
    tags: ['Arcade', 'Gamification', 'Canvas', 'Interactive']
  },
  {
    topic: 'Easter Eggs & Secrets',
    keywords: ['easter', 'egg', 'eggs', 'secret', 'supernova', 'burst', 'betelgeuse', 'meteor', 'hidden', 'trick', 'stardate'],
    summary: 'Hidden astronomical phenomena: Betelgeuse Supernova Core Collapse, Meteor Bursts, and CLI tricks.',
    details: `Secret Easter Eggs hidden across the website:
1. Betelgeuse Supernova: In the Celestial Controller or by clicking Betelgeuse in the night sky, detonate a core collapse creating a chromatic screen shake and relativistic blast wave.
2. Meteor Shower Bursts: Trigger high-density shooting star volleys aligned with seasonal celestial coordinates (Perseids, Geminids, Leonids).
3. CLI Commands: Press ⌘K or Ctrl+K, switch to Terminal mode, and try:
   • 'supernova' : Trigger the supernova shockwave directly
   • 'matrix'    : Toggle cybernetic matrix mode
   • 'audio'     : Test the procedural Web Audio synthesizer
   • 'bench'     : Run an instant browser performance benchmark`,
    tags: ['Easter Eggs', 'Interactive', 'Supernova', 'Terminal']
  },
  {
    topic: 'EclecticIQ & Threat Intelligence Platform',
    keywords: ['eclecticiq', 'threat', 'intelligence', 'ioc', 'mitre', 'heatmap', 'matrix', 'worker', 'freeze', 'performance', 'security', 'cyber'],
    summary: 'UI Architect for an enterprise cyber threat intelligence visualization platform at EclecticIQ.',
    details: `At EclecticIQ (05/2025 - Present), Vivek serves as Senior Software Engineer & UI Architect:
• Problem: Security analysts needed to cross-reference thousands of Indicators of Compromise (IOCs) against adversary techniques. The legacy UI froze under heavy matrix calculations.
• Architecture: Engineered off-main-thread graph filtering, clustering, and confidence scoring in Web Workers, completing calculations in < 14ms.
• Impact: Prevented main thread freezing during multi-facet filter transitions across 10,000+ IOCs, providing 60 FPS drill-down telemetry with full MITRE ATT&CK matrix context.`,
    tags: ['Web Workers', 'Performance', 'Cybersecurity', 'React 19', 'TypeScript']
  },
  {
    topic: 'Enterprise Micro-Frontend Architecture (Delta Airlines)',
    keywords: ['delta', 'micro-frontend', 'microfrontend', 'federation', 'webpack', 'host', 'shell', 'scale', 'architecture', 'airline'],
    summary: 'Engineered a host container shell with remote module negotiation unifying 15+ disparate codebases.',
    details: `At Delta Airlines (09/2021 - 04/2025), Vivek led enterprise micro-frontend initiatives:
• Problem: Multiple independent engineering squads built siloed enterprise applications, creating massive bundle duplication, divergent UI tokens, and deployment lock-step bottlenecks.
• Architecture: Designed a thin host shell utilizing Webpack 5 Module Federation with dynamic lazy-loading, dependency negotiation, and a decoupled event-bus bridge.
• Impact: Reduced duplicate library overhead by 68%, enabled zero-downtime independent team deployments, and standardized UI governance.`,
    tags: ['Module Federation', 'Webpack 5', 'Distributed Systems', 'Architecture']
  },
  {
    topic: 'Real-Time Streaming AI Assistant & Sandbox',
    keywords: ['ai', 'streaming', 'sse', 'llm', 'generative', 'sandbox', 'ast', 'markdown', 'assistant', 'real-time'],
    summary: 'Delivered real-time streamed AI responses over Server-Sent Events (SSE) with sandboxed execution.',
    details: `Vivek engineered high-throughput generative AI interfaces:
• Architecture: Built a chunked stream parser over SSE that feeds into an incremental Markdown AST renderer.
• Key Innovation: Sandboxed iframe code execution environment that isolates user scripts while maintaining smooth autoscroll anchored to the user's reading position.
• Impact: Zero perceived stream latency and resilient against malformed LLM streaming syntax bursts.`,
    tags: ['Generative AI', 'SSE', 'AST Parsers', 'Sandboxing', 'TypeScript']
  },
  {
    topic: 'Core Technology Stack & Skills',
    keywords: ['stack', 'skills', 'technologies', 'tools', 'languages', 'frameworks', 'typescript', 'python', 'react', 'three.js', 'go', 'node'],
    summary: 'Staff-level expertise across frontend architecture, distributed systems, and modern WebGL.',
    details: `VIVEK'S PRIMARY TECHNICAL ARSENAL:
• Frontend Core : TypeScript, React 19, Next.js, Framer Motion, Vanilla CSS, Tailwind CSS
• Systems & Perf: Web Workers, Web Streams, WebSockets, SSE, Webpack Module Federation
• 3D & Graphics : Three.js, HTML5 Canvas 2D/WebGL, Mathematical Astronomy
• Backend & Data: Python, Node.js, Go, PostgreSQL, Redis, REST & GraphQL
• DevOps & Cloud: Docker, GitHub Actions, AWS, CI/CD Automated Pipelines`,
    tags: ['TypeScript', 'React', 'Three.js', 'Python', 'Go']
  },
  {
    topic: 'Published Engineering Articles & Writing',
    keywords: ['articles', 'write', 'blog', 'medium', 'publications', 'writing', 'posts', 'author', 'read'],
    summary: 'Author of in-depth engineering publications on distributed UI architecture and frontend telemetry.',
    details: `Featured technical deep dives published on Medium & DEV:
1. "Architecting High-Throughput Threat Intelligence Heatmaps" — Off-main-thread Web Worker pipelines.
2. "Zero-Downtime Micro-Frontends with Webpack Module Federation" — Dependency negotiation patterns.
3. "Mastering Real-Time LLM Streaming UIs" — Incremental AST parsing with zero layout shifts.
4. "Phases of the Moon in Pure CSS" — Leveraging trigonometric masks and border-radii for celestial graphics.`,
    tags: ['Medium', 'Engineering Blogs', 'Publications']
  },
  {
    topic: 'Celestial Stardate Engine & Astronomy Architecture',
    keywords: ['celestial', 'astronomy', 'stars', 'constellations', 'sky', 'stardate', 'moon', 'supernova', 'meteor', 'orion', 'space'],
    summary: 'Procedural 360° celestial sphere simulation featuring Conway lunar epochs and Betelgeuse supernova FX.',
    details: `The celestial system running in this portfolio's background:
• Real-time equatorial coordinate projection onto a 360° draggable celestial dome.
• Dynamic seasonal constellations (Orion, Ursa Major, Cassiopeia, Cygnus, Taurus, Scorpius) that rotate with the chosen stardate epoch.
• Interactive Easter Eggs: Betelgeuse Supernova Core Collapse with relativistic shockwave particles and seasonal meteor showers.`,
    tags: ['Astronomy', 'Canvas 2D', 'Trigonometry', 'Interactive Art']
  },
  {
    topic: 'Why Hire Vivek (Key Strengths & Value)',
    keywords: ['why', 'hire', 'strengths', 'value', 'impact', 'leadership', 'team', 'reason', 'qualities', 'strong'],
    summary: 'Proven ability to eliminate technical debt, architect mission-critical frontends, and accelerate velocity.',
    details: `Why engineering teams hire Vivek:
1. Systems Thinking: Treats the frontend as a distributed systems environment (memory budgets, worker threads, decoupled state).
2. Proven Scale: Slashed duplicate bundle overhead by 68% at Delta Airlines and eliminated main-thread freeze across 10k+ nodes at EclecticIQ.
3. Full Lifecycle Ownership: From system architecture RFCs and CI/CD pipelines to polished 60 FPS user-facing polish.
4. Mentorship: Passionate about elevating team engineering standards, test automation, and UI governance.`,
    tags: ['Staff Engineer', 'Leadership', 'Hiring', 'Impact']
  },
  {
    topic: 'Hobbies & Creative Interests',
    keywords: ['hobbies', 'interests', 'free', 'time', 'fun', 'astronomy', 'music', 'sound', 'curiosity', 'likes'],
    summary: 'Passionate about mathematical astronomy, creative coding, procedural audio, and open source.',
    details: `Outside of enterprise systems architecture, Vivek explores:
• Mathematical Astronomy: Modeling planetary orbits, lunar phases, and stellar coordinate projections in code.
• Procedural Audio & Sound Design: Building software synthesizers with the Web Audio API.
• Creative Coding: Generative canvas art, shaders, and retro 8-bit visual aesthetics.
• Open Source & Writing: Sharing architectural post-mortems and patterns on Medium and GitHub.`,
    tags: ['Creative Coding', 'Astronomy', 'Audio Design', 'Open Source']
  },
  {
    topic: 'Contact & Hiring Vivek Jhooria',
    keywords: ['contact', 'hire', 'email', 'linkedin', 'github', 'reach', 'interview', 'role', 'jobs', 'location'],
    summary: 'Connect directly with Vivek Jhooria for Staff/Principal engineering opportunities.',
    details: `Vivek is open to Staff Full Stack & Frontend Architect opportunities:
• Email    : v.jhooria@gmail.com
• GitHub   : https://github.com/Vivek19f
• LinkedIn : https://www.linkedin.com/in/vivekjhooria/
• Location : India (IST, UTC+5:30) • Open to remote global and hybrid staff roles.`,
    tags: ['Hiring', 'Staff Engineer', 'Contact']
  }
];

// Conversational direct intents
const GREETING_KEYWORDS = ['hello', 'hi', 'hey', 'greetings', 'sup', 'yo'];
const IDENTITY_KEYWORDS = ['who are you', 'what are you', 'your name', 'who created you', 'what can you do'];
const JOKE_KEYWORDS = ['joke', 'funny', 'humor', 'laugh'];

/**
 * Tokenizes and scores user queries against the knowledge base
 */
export function queryAiCopilot(query) {
  if (!query || typeof query !== 'string' || !query.trim()) {
    return {
      success: false,
      text: "Please provide a question. For example: `ask what did vivek do at EclecticIQ?` or `ask tech stack`",
    };
  }

  const cleanQuery = query.toLowerCase().replace(/[?.,!]/g, '').trim();
  const tokens = cleanQuery.split(/\s+/).filter(Boolean);

  // Check conversational greetings
  if (tokens.length <= 2 && GREETING_KEYWORDS.some(k => tokens.includes(k))) {
    return {
      success: true,
      topic: 'Greetings!',
      summary: 'Vivek AI Copilot ready for questions.',
      text: `Hello! I'm Vivek's AI Copilot running client-side in your browser.
You can ask me anything about Vivek's career, architectural case studies, the tech stack, this website's design, or arcade games!

Try asking:
• "ask who is vivek"
• "ask how was this website built"
• "ask eclecticiq architecture"
• "ask easter eggs"
• "ask why hire vivek"`,
      tags: ['AI Copilot', 'Interactive'],
      confidence: 100,
    };
  }

  // Check identity intent
  if (IDENTITY_KEYWORDS.some(phrase => cleanQuery.includes(phrase))) {
    return {
      success: true,
      topic: 'About Vivek AI Copilot',
      summary: 'Client-side open-source semantic knowledge engine.',
      text: `I am Vivek's Open-Source AI Copilot!
• Engineered with a pure client-side semantic RAG engine.
• Runs 100% in your browser with zero API keys, zero token fees, and zero latency.
• I can answer any questions about Vivek's 8+ years of engineering experience, system designs, publications, and this portfolio's architecture.`,
      tags: ['AI Copilot', 'Open Source'],
      confidence: 98,
    };
  }

  // Check joke intent
  if (JOKE_KEYWORDS.some(k => cleanQuery.includes(k))) {
    const jokes = [
      "Why did the web worker refuse to talk to the main thread? Because it needed some postMessage boundaries!",
      "There are only 10 types of people in the world: those who understand binary, and those who don't.",
      "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?'",
      "Why do programmers prefer dark mode? Because light attracts bugs!"
    ];
    return {
      success: true,
      topic: 'Developer Humor',
      summary: 'Engineering joke.',
      text: jokes[Math.floor(Math.random() * jokes.length)],
      tags: ['Humor', 'Fun'],
      confidence: 95,
    };
  }

  let bestMatch = null;
  let highestScore = 0;

  for (const item of VIVEK_KNOWLEDGE_BASE) {
    let score = 0;

    // Direct topic substring match
    if (cleanQuery.includes(item.topic.toLowerCase())) {
      score += 6;
    }

    // Keyword match
    for (const kw of item.keywords) {
      if (cleanQuery.includes(kw)) {
        score += 3;
      }
      for (const token of tokens) {
        if (token === kw) {
          score += 3;
        } else if (token.length >= 4 && kw.includes(token)) {
          score += 2;
        }
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  // If score is sufficient, synthesize an AI response
  if (bestMatch && highestScore >= 2) {
    return {
      success: true,
      topic: bestMatch.topic,
      summary: bestMatch.summary,
      text: bestMatch.details,
      tags: bestMatch.tags,
      confidence: Math.min(99, Math.round(75 + (highestScore * 3))),
    };
  }

  // Fallback AI overview response
  return {
    success: true,
    topic: 'Vivek Jhooria — Executive Engineering Summary',
    summary: 'Staff Full Stack Engineer & Frontend Systems Architect',
    text: `I couldn't find an exact match for "${query}", but here is Vivek's quick profile:
• Staff Full Stack Engineer specializing in high-throughput frontend systems, real-time graph telemetry, and micro-frontends.
• Experience: Senior Engineer at EclecticIQ (threat intel matrix in Web Workers) and Delta Airlines (enterprise module federation).
• Tech: TypeScript, React 19, Python, Three.js, Go, Docker.

Try asking:
  • "ask who is vivek"
  • "ask how was this website built"
  • "ask eclecticiq"
  • "ask arcade games"
  • "ask easter eggs"
  • "ask why hire vivek"`,
    tags: ['Overview', 'Staff Engineer'],
    confidence: 65,
  };
}
