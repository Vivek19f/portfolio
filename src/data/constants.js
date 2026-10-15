export const SUBTITLES = [
  "Staff Full Stack Engineer (TypeScript • Python • Node.js)",
  "Frontend Architect & Distributed UI Systems",
  "High-Throughput Analytics & Telemetry Architect",
  "Turning complex systems into binary || beauty."
];

export const STAT_METRICS = [
  {
    label: "Visits this month",
    value: "1,420+",
    subtext: "one per person per day"
  },
  {
    label: "Production Impact",
    value: "10k+ events/s",
    subtext: "real-time telemetry & ATT&CK analytics"
  },
  {
    label: "Rewrites",
    value: "3rd portfolio",
    subtext: "v1 2019 - 2021, v2 2021 - 2024, now"
  }
];

export const SELECTED_WORK_DATA = [
  {
    id: "portfolio-v3",
    name: "vivek.me, this portfolio",
    subtitle: "v3 portfolio",
    category: "interactive",
    categoryLabel: "Interactive WebGL",
    description: "A fast, playful portfolio with interactive arcade puzzle games, a hand-crafted WebGL starfield, ⌘K command console, and smooth micro-animations, built and shipped solo.",
    role: "Solo: design, build, ship",
    stack: ["React 19", "TypeScript", "Three.js", "Framer Motion", "Tailwind CSS"],
    hasCaseStudy: true,
    link: "https://github.com/Vivek19f/portfolio",
    caseStudy: {
      title: "Designing & Engineering Portfolio v3",
      tagline: "High-performance playful web engineering with zero bloat.",
      overview: "Wanted a personal website that felt alive, playful, and technically sophisticated—not just another static developer resume. Built with interactive mini-games, dynamic WebGL starfield, keyboard command console, and fluid transitions.",
      architecture: [
        { stage: "01. WebGL Starfield", tech: "HTML5 Canvas", desc: "Double-buffered particle physics ticking at 60 FPS without DOM thrashing." },
        { stage: "02. React 19 Shell", tech: "Vite + React 19", desc: "Single-view viewport orchestration with zero-overhead layout transitions." },
        { stage: "03. Audio Synthesizer", tech: "Web Audio API", desc: "Zero-asset mechanical sound feedback generated in real time." },
        { stage: "04. Live GitHub Bus", tech: "GitHub REST API", desc: "Decoupled 10-minute TTL cached telemetry ingestion with fallback resilience." }
      ],
      challenges: [
        "Rendering an interactive starfield with parallax without affecting 60fps page scroll performance.",
        "Creating an intuitive rolling text navigation dock and ⌘K console with full keyboard accessibility.",
        "Implementing playable daily arcade puzzles (Quick Math & Code Review) inside modular modals."
      ],
      solution: "Engineered an HTML5 Canvas starfield using double-buffered frame ticks and lightweight vector math. Integrated Framer Motion layout animations with zero layout thrashing.",
      metrics: [
        { label: "Lighthouse Score", value: "99/100" },
        { label: "Bundle Size", value: "< 95 kB gzip" },
        { label: "Frame Rate", value: "Consistent 60 fps" }
      ]
    }
  },
  {
    id: "threat-matrix",
    name: "Threat Matrix & MITRE ATT&CK Analytics",
    subtitle: "Cybersecurity Platform",
    category: "security",
    categoryLabel: "Security & Telemetry",
    description: "Interactive threat intelligence analytics engine mapping adversary tactics, techniques, and procedures (TTPs) across multi-dimensional matrices with real-time sub-16ms graph filtering.",
    role: "Lead UI Architect",
    stack: ["React", "TypeScript", "Web Workers", "D3.js", "State Machines"],
    hasCaseStudy: true,
    details: "Enterprise threat intelligence platform",
    caseStudy: {
      title: "MITRE ATT&CK Heatmap & Analytics Matrix",
      tagline: "Interactive multidimensional visualization for enterprise cyber defense.",
      overview: "Security analysts needed to cross-reference thousands of Indicators of Compromise (IOCs) against adversary techniques. The legacy UI froze under heavy matrix calculations.",
      architecture: [
        { stage: "01. IOC Ingestion", tech: "WebSocket Stream", desc: "Continuous live telemetry stream of threat actor signatures and adversary tactics." },
        { stage: "02. Worker Thread", tech: "Web Workers", desc: "Off-main-thread graph filtering, clustering, and confidence scoring in < 14ms." },
        { stage: "03. State Machine", tech: "XState / Redux", desc: "Strict transition state machines eliminating race conditions across filters." },
        { stage: "04. Hybrid Matrix Canvas", tech: "D3 + Virtual DOM", desc: "Virtualized viewport rendering 10,000+ nodes at a steady 60 FPS." }
      ],
      challenges: [
        "Traversing and filtering 500+ tactic nodes with real-time aggregated threat confidence scores.",
        "Preventing main thread freezing during multi-facet filter state transitions across 10,000+ IOCs.",
        "Providing instant detail pane drill-down with MITRE analytics context."
      ],
      solution: "Extracted graph computation and clustering into Web Workers, implemented hybrid virtualized SVG canvas rendering, and built a declarative state machine for selection states.",
      metrics: [
        { label: "Frame Drop Reduction", value: "92%" },
        { label: "Calculation Latency", value: "< 14 ms" },
        { label: "Analyst Workflow Speed", value: "3.4x faster" }
      ]
    }
  },
  {
    id: "mapping-engine",
    name: "Schema-Driven Mapping Engine",
    subtitle: "Telemetry Ingestion",
    category: "data",
    categoryLabel: "Data & Streaming",
    description: "Automated 100% of manual attribute mapping for 10k+ row CSV telemetry with an extensible, schema-driven ingestion engine and heuristic validation pipeline.",
    role: "Architect & Senior Developer",
    stack: ["React", "TypeScript", "Zod", "Web Streams", "Architecture"],
    hasCaseStudy: true,
    details: "Internal, details on request",
    caseStudy: {
      title: "Schema-Driven Telemetry Ingestion Engine",
      tagline: "Eliminating manual data mapping with AST-driven inference.",
      overview: "Enterprise clients upload heterogeneous telemetry schemas with differing field naming standards. Manual field mapping took engineers 3+ hours per client.",
      architecture: [
        { stage: "01. Chunked Stream", tech: "Web Streams API", desc: "Non-blocking client-side file chunking reading 10k+ rows without memory spikes." },
        { stage: "02. AST Inferencer", tech: "Zod + Heuristics", desc: "Levenshtein distance & regex heuristic matching with 98.7% automatic accuracy." },
        { stage: "03. Worker Validation", tech: "Worker Thread", desc: "High-throughput schema validation executing 50k rows/s in background." },
        { stage: "04. Virtual Grid", tech: "Virtual Scroll", desc: "Immediate preview of mapped fields with highlighted confidence anomalies." }
      ],
      challenges: [
        "Inconsistent data formats and multi-level nested payloads across varied telemetry sources.",
        "Validating tens of thousands of rows client-side without crashing browser memory.",
        "Guiding users through ambiguous field matches with confidence scores."
      ],
      solution: "Created an AST schema inference engine utilizing Zod schemas and Levenshtein distance heuristics. Streamed chunked CSV reading using Web Streams API.",
      metrics: [
        { label: "Time Saved", value: "100% automated" },
        { label: "Ingestion Throughput", value: "50k rows/s" },
        { label: "Mapping Accuracy", value: "98.7%" }
      ]
    }
  },
  {
    id: "ai-assistant",
    name: "Real-Time AI Assistant UI",
    subtitle: "Generative AI Platform",
    category: "ai",
    categoryLabel: "AI Systems",
    description: "Delivered real-time streamed AI responses over Server-Sent Events (SSE), rendered through custom sandboxed execution renderers with Markdown AST syntax highlighting.",
    role: "Senior Frontend Engineer",
    stack: ["React", "SSE", "State Machine", "Sandboxed Execution"],
    hasCaseStudy: true,
    details: "Internal, details on request",
    caseStudy: {
      title: "Real-Time AI Assistant & Code Execution Sandbox",
      tagline: "Streaming generative AI responses with zero latency and secure execution.",
      overview: "Built a chat and code workspace assistant capable of streaming token responses while safely executing and previewing HTML, JavaScript, and CSS code snippets in real time.",
      architecture: [
        { stage: "01. SSE Stream", tech: "Server-Sent Events", desc: "Token streaming channel with custom reconnection and backpressure buffers." },
        { stage: "02. AST Token Parser", tech: "Unified / Remark", desc: "Progressive Markdown AST parser preventing re-tokenizing the whole history." },
        { stage: "03. Sandboxed Iframe", tech: "HTML5 Sandbox", desc: "Isolated postMessage protocol executing untrusted JS/HTML securely." },
        { stage: "04. Sticky Scroller", tech: "ResizeObserver", desc: "Anchor-aware auto-scrolling with zero scroll lock or user jank." }
      ],
      challenges: [
        "Handling bursty SSE token packets while preventing continuous React re-renders.",
        "Executing untrusted generated code safely without XSS vulnerability.",
        "Maintaining smooth autoscroll anchored to user viewing position."
      ],
      solution: "Built a high-performance SSE chunk buffer with backpressure throttling and an isolated sandbox iframe with restricted postMessage protocols.",
      metrics: [
        { label: "Time to First Token", value: "< 180 ms" },
        { label: "Security Vulnerabilities", value: "0 reported" },
        { label: "User Engagement", value: "+145%" }
      ]
    }
  },
  {
    id: "mfe-migration",
    name: "Enterprise MFE Migration",
    subtitle: "Architecture Modernization",
    category: "architecture",
    categoryLabel: "Architecture & Systems",
    description: "Cut deployment times and eliminated technical debt by unifying 15+ legacy distributed codebases into one resilient Micro-Frontend architecture with shared design tokens.",
    role: "Frontend Architect",
    stack: ["Webpack", "Micro-Frontends", "Design System", "TypeScript"],
    hasCaseStudy: true,
    details: "Internal, details on request",
    caseStudy: {
      title: "Unifying 15+ Enterprise Legacy Codebases into Micro-Frontends",
      tagline: "Scalable frontend federation for multi-team velocity.",
      overview: "Four disparate engineering squads were blocked by monolithic release cycles. Migrated to Webpack 5 Module Federation with centralized core state and shared design tokens.",
      architecture: [
        { stage: "01. Host Shell", tech: "Webpack 5 Federation", desc: "Thin container shell negotiating shared dependencies (React, UI tokens)." },
        { stage: "02. Event Bus Bridge", tech: "Custom Event Protocol", desc: "Framework-agnostic inter-app communication without tight coupling." },
        { stage: "03. Design System", tech: "Shared Token Package", desc: "Centralized CSS variables and typography tokens across all squads." },
        { stage: "04. Independent CI/CD", tech: "GitHub Actions", desc: "Decoupled pipelines allowing squads to deploy independently without coordination." }
      ],
      challenges: [
        "Dependency drift and conflicting React versions across micro-apps.",
        "Cohesive authentication and router synchronization without page reloads.",
        "Zero downtime migration while active production traffic was flowing."
      ],
      solution: "Engineered a host container shell with remote module negotiation, dynamic lazy-loading with graceful fallbacks, and a decoupled event-bus bridge.",
      metrics: [
        { label: "Deploy Frequency", value: "4x per week" },
        { label: "Bundle Redundancy", value: "-62%" },
        { label: "Release Cycles", value: "3 weeks -> 1 day" }
      ]
    }
  },
  {
    id: "timezone-service",
    name: "Timezone & Localization Engine",
    subtitle: "Temporal Infrastructure",
    category: "architecture",
    categoryLabel: "Architecture & Systems",
    description: "Mission-critical temporal engine ensuring consistent ISO-8601 formatting, user locale preferences, and daylight-saving normalization across global distributed services.",
    role: "Senior Software Engineer",
    stack: ["TypeScript", "Intl API", "Date-fns", "Micro-Services"],
    hasCaseStudy: false,
    details: "Core infrastructure service"
  }
];

export const BUILT_FOR_FUN_DATA = [
  {
    id: "quick-math",
    name: "Quick Math",
    description: "Rapid-fire arithmetic. 20 questions. No hesitation. Beat my time.",
    icon: "hash",
    type: "game"
  },
  {
    id: "code-review",
    name: "Code Review",
    description: "Three snippets, one bug each. Tap the line that breaks it.",
    icon: "bug",
    type: "game"
  },
  {
    id: "minesweeper",
    name: "Minesweeper",
    description: "Clear a 8×8 board hiding 10 mines. Pure deductive logic, never guess.",
    icon: "bomb",
    type: "puzzle"
  },
  {
    id: "mini-sudoku",
    name: "Mini Sudoku",
    description: "A 6×6 sudoku with 2×3 box constraints. Pure logic, interactive keypad.",
    icon: "brain",
    type: "puzzle"
  },
  {
    id: "game-2048",
    name: "2048: Dev Edition",
    description: "Merge technology tiles from HTML & CSS up to Principal 2048.",
    icon: "grid",
    type: "game"
  },
  {
    id: "speed-typer",
    name: "Code Speedrun",
    description: "30-second rapid syntax typing test with live WPM & accuracy metrics.",
    icon: "keyboard",
    type: "challenge"
  },
  {
    id: "memory-matrix",
    name: "Memory Matrix",
    description: "Memorize and recall the flashing cyan grid pattern as complexity scales.",
    icon: "sparkles",
    type: "brain"
  }
];

export const ARCHIVE_DATA = [
  {
    year: "2024",
    name: "Xebia Frontend Challenge",
    description: "High-performance state-driven application evaluation platform with algorithm scoring and test verification.",
    url: "https://github.com/Vivek19f/xebia_frontend_challenge",
    stack: ["React", "TypeScript", "Jest", "Tailwind CSS"]
  },
  {
    year: "2023",
    name: "Flight Turnaround Ops Dashboard",
    description: "Real-time gate operation and aircraft turnaround tracking engine deployed for operations crews at Delta Airlines.",
    url: "https://github.com/Vivek19f",
    stack: ["React", "WebSockets", "AWS", "Node.js"]
  },
  {
    year: "2021",
    name: "ProemSports Fan Engagement Engine",
    description: "Interactive real-time sports telemetry platform delivering sub-second live match feeds and statistical overlays.",
    url: "https://github.com/Vivek19f",
    stack: ["React", "Redux", "Python", "MongoDB"]
  },
  {
    year: "2019",
    name: "Enterprise Core Insurance Portal",
    description: "Modernized legacy policy workflows into responsive single-page web applications with reactive form validations.",
    url: "https://github.com/Vivek19f",
    stack: ["JavaScript", "React", "RESTful APIs", "Bootstrap"]
  }
];

export const PREVIOUS_VERSIONS_DATA = [
  {
    version: "v2",
    years: "2021 - 2024",
    tech: "React, Three.js, Spline 3D, Sass, glassmorphism design system.",
    url: "https://github.com/Vivek19f/portfolio"
  },
  {
    version: "v1",
    years: "2019 - 2021",
    tech: "HTML5, CSS3, JavaScript, particles.js ambient particle canvas.",
    url: "https://github.com/Vivek19f"
  }
];

export const EXPERIENCE_DATA = [
  {
    title: "Senior Software Engineer",
    company: "EclecticIQ Pvt Ltd",
    date: "05/2025 - Present",
    desc: "Architecting threat intelligence visualization systems, heatmap matrices, schema-driven telemetry mapping, and real-time streaming AI interfaces."
  },
  {
    title: "Senior Developer",
    company: "Delta Airlines",
    date: "04/2023 - 05/2025",
    desc: "Led frontend modernization for critical flight turnaround platforms, micro-frontend migration, and high-concurrency real-time WebSocket feeds."
  },
  {
    title: "Software Engineer",
    company: "Proemsports Pvt Ltd",
    date: "11/2021 - 04/2023",
    desc: "Engineered scalable real-time sports fan interfaces, interactive telemetry overlays, and low-latency state synchronization."
  },
  {
    title: "Software Engineer",
    company: "Valuemomentum Pvt Ltd",
    date: "06/2019 - 10/2021",
    desc: "Developed responsive enterprise portals, robust reusable component libraries, and optimized mission-critical policy flows."
  }
];

export const CERTIFICATIONS_DATA = [
  {
    title: "Cloud Accelerator Program",
    issuer: "Pluralsight"
  },
  {
    title: "Developing on AWS",
    issuer: "Delta IT"
  },
  {
    title: "Security Learning Program",
    issuer: "Proem Sports"
  },
  {
    title: "Machine Learning: Neural Networks & Deep Learning",
    issuer: "Coursera / DeepLearning.AI"
  }
];

export const AWARDS_DATA = [
  {
    title: "Golden Award",
    issuer: "Delta Airlines",
    desc: "Recognized for exemplary architectural contribution and zero-downtime micro-frontend rollout."
  },
  {
    title: "Chairman’s Club Nomination",
    issuer: "Delta Airlines",
    desc: "Nominated among top engineering contributors across global digital operations."
  },
  {
    title: "Best Employee of the Quarter",
    issuer: "3 Consecutive Quarters",
    desc: "Awarded for exceptional execution speed and technical leadership."
  }
];

export const SKILLS_DATA = [
  "TypeScript", "JavaScript", "Python", "React.js", "Next.js", 
  "Angular", "Node.js", "NestJS", "AWS & Azure", "System Design", 
  "Docker", "CI/CD", "WebSockets", "Web Workers", "GraphQL"
];

export const PROJECTS_DATA = SELECTED_WORK_DATA;

export const BLOGS_DATA = [
  {
    title: "Digital Fortress vs. India’s Push for Private User Data: A Reality Check",
    url: "https://medium.com/@robotChat/digital-fortress-vs-indias-push-for-private-user-data-a-reality-check-ce625914e02c",
    description: "An analysis of the privacy implications and technical challenges surrounding user data regulation."
  },
  {
    title: "The Ultimate Guide to Django ORM Queries",
    url: "https://medium.com/@robotChat/getting-started-with-django-queries-c916a625ce59",
    description: "A comprehensive guide on mastering Django ORM for efficient database querying."
  }
];
