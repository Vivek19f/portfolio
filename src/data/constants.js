export const SUBTITLES = [
  "Senior Software Engineer.",
  "Frontend Architect & UI Engineer.",
  "System Designer & Open Source Contributor.",
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
    description: "A fast, playful portfolio with interactive arcade puzzle games, a hand-crafted WebGL starfield, ⌘K command console, and smooth micro-animations, built and shipped solo.",
    role: "Solo: design, build, ship",
    stack: ["React 19", "TypeScript", "Three.js", "Framer Motion", "Tailwind CSS"],
    hasCaseStudy: true,
    link: "https://github.com/Vivek19f/portfolio",
    caseStudy: {
      title: "Designing & Engineering Portfolio v3",
      tagline: "High-performance playful web engineering with zero bloat.",
      overview: "Wanted a personal website that felt alive, playful, and technically sophisticated—not just another static developer resume. Built with interactive mini-games, dynamic WebGL starfield, keyboard command console, and fluid transitions.",
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
    description: "Interactive threat intelligence analytics engine mapping adversary tactics, techniques, and procedures (TTPs) across multi-dimensional matrices with real-time sub-16ms graph filtering.",
    role: "Lead UI Architect",
    stack: ["React", "TypeScript", "Web Workers", "D3.js", "State Machines"],
    hasCaseStudy: true,
    details: "Enterprise threat intelligence platform",
    caseStudy: {
      title: "MITRE ATT&CK Heatmap & Analytics Matrix",
      tagline: "Interactive multidimensional visualization for enterprise cyber defense.",
      overview: "Security analysts needed to cross-reference thousands of Indicators of Compromise (IOCs) against adversary techniques. The legacy UI froze under heavy matrix calculations.",
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
    description: "Automated 100% of manual attribute mapping for 10k+ row CSV telemetry with an extensible, schema-driven ingestion engine and heuristic validation pipeline.",
    role: "Architect & Senior Developer",
    stack: ["React", "TypeScript", "Zod", "Web Streams", "Architecture"],
    hasCaseStudy: true,
    details: "Internal, details on request",
    caseStudy: {
      title: "Schema-Driven Telemetry Ingestion Engine",
      tagline: "Eliminating manual data mapping with AST-driven inference.",
      overview: "Enterprise clients upload heterogeneous telemetry schemas with differing field naming standards. Manual field mapping took engineers 3+ hours per client.",
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
    description: "Delivered real-time streamed AI responses over Server-Sent Events (SSE), rendered through custom sandboxed execution renderers with Markdown AST syntax highlighting.",
    role: "Senior Frontend Engineer",
    stack: ["React", "SSE", "State Machine", "Sandboxed Execution"],
    hasCaseStudy: true,
    details: "Internal, details on request",
    caseStudy: {
      title: "Real-Time AI Assistant & Code Execution Sandbox",
      tagline: "Streaming generative AI responses with zero latency and secure execution.",
      overview: "Built a chat and code workspace assistant capable of streaming token responses while safely executing and previewing HTML, JavaScript, and CSS code snippets in real time.",
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
    description: "Cut deployment times and eliminated technical debt by unifying 15+ legacy distributed codebases into one resilient Micro-Frontend architecture with shared design tokens.",
    role: "Frontend Architect",
    stack: ["Webpack", "Micro-Frontends", "Design System", "TypeScript"],
    hasCaseStudy: true,
    details: "Internal, details on request",
    caseStudy: {
      title: "Unifying 15+ Enterprise Legacy Codebases into Micro-Frontends",
      tagline: "Scalable frontend federation for multi-team velocity.",
      overview: "Four disparate engineering squads were blocked by monolithic release cycles. Migrated to Webpack 5 Module Federation with centralized core state and shared design tokens.",
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
    description: "Mission-critical temporal engine ensuring consistent ISO-8601 formatting, user locale preferences, and daylight-saving normalization across global distributed services.",
    role: "Senior Software Engineer",
    stack: ["TypeScript", "Intl API", "Date-fns", "Micro-Services"],
    hasCaseStudy: false,
    details: "Core infrastructure service"
  }
];

export const BUILT_FOR_FUN_DATA = [
  {
    id: "minesweeper",
    name: "Minesweeper",
    description: "Clear a 12×12 board hiding 20 mines. Every board is solvable without guessing.",
    icon: "bomb",
    type: "puzzle"
  },
  {
    id: "quick-math",
    name: "Quick Math",
    description: "Rapid-fire arithmetic. 20 questions. No hesitation. Beat my time.",
    icon: "hash",
    type: "game"
  },
  {
    id: "mini-sudoku",
    name: "Mini Sudoku",
    description: "A 6×6 sudoku with 2×3 boxes. Pure logic, never a guess.",
    icon: "brain",
    type: "puzzle"
  },
  {
    id: "code-review",
    name: "Code Review",
    description: "Three snippets, one bug each. Tap the line that breaks it.",
    icon: "bug",
    type: "game"
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
