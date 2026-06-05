import React, { useEffect, useRef, useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion';
import {
  ArrowRight,
  BrainCircuit,
  Braces,
  BriefcaseBusiness,
  Bot,
  ChevronRight,
  Code2,
  Database,
  Github,
  GraduationCap,
  Globe2,
  Layers3,
  Linkedin,
  Mail,
  Menu,
  MousePointer2,
  PenTool,
  Rocket,
  Send,
  ServerCog,
  ShieldCheck,
  Sparkles,
  Terminal,
  Workflow,
  X,
  ExternalLink,
  Lock,
  LogOut,
  RefreshCw
} from 'lucide-react';
import { ReactLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import './styles.css';
import { sanityClient } from './sanityClient';

// ==========================================
// Types & Interfaces
// ==========================================
interface PortfolioContent {
  heroName: string;
  heroTitle: string;
  heroBio: string;
  projectTitle: string;
  projectCategory: string;
  projectSummary: string;
  projectDescription: string;
  projectStack: string[];
  projectGithub: string;
  projectDemo: string;
  projectImage: string;
}

const DEFAULT_CONTENT: PortfolioContent = {
  heroName: 'Samyak Jain',
  heroTitle: 'Building Products, Ideas & Digital Experiences.',
  heroBio: 'I craft clean, high-performance web applications, integrate generative AI pipelines, and build custom automation scripts. Toggle the interactive console below or in the capsule to trigger shell diagnostics.',
  projectTitle: 'HexGrid Goa',
  projectCategory: 'Environmental Tech Platform',
  projectSummary: 'Turning coastal beach cleanups into a trackable, verifiable, and rewarding live hex-grid system.',
  projectDescription: 'HexGrid Goa divides coastlines into a live hex-grid. Volunteers submit before/after scans of locations, which are verified via AI-assisted review with human fallback. Cleansed areas update a shared public map, rewarding contributors with impact points, faction progress, and leaderboard recognition to solve low visibility, low trust, and volunteer retention in environmental efforts.',
  projectStack: ['React', 'TypeScript', 'Tailwind CSS', 'Leaflet', 'Node.js', 'TensorFlow.js'],
  projectGithub: 'https://github.com/Samyakj-07/HexGrid-Goa.git',
  projectDemo: 'https://hexgrid-goa.vercel.app',
  projectImage: '/hexgrid-goa.png'
};

interface StarsProps {
  color: string;
  count: number;
  speed: number;
  size?: number;
}

interface Project {
  title: string;
  category: string;
  summary: string;
  description: string;
  stack: string[];
  github: string;
  demo: string;
  imageGlow: string;
  image?: string;
}

interface ExplorerCard {
  title: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  body: string;
  color: string;
}

interface BuildCard {
  title: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  description: string;
  details: string;
}

interface BeyondCard {
  title: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  description: string;
  detail: string;
}

// ==========================================
// Data Constants
// ==========================================
const EXPLORING_ITEMS: ExplorerCard[] = [
  {
    title: 'AI Products',
    icon: BrainCircuit,
    body: 'Building tools powered by modern generative AI models and neural networks.',
    color: 'from-cyan-500/20 to-blue-500/20 hover:border-cyan-400'
  },
  {
    title: 'Web Applications',
    icon: Code2,
    body: 'Creating fast, secure, and highly scalable digital experiences with clean frontend & backend architecture.',
    color: 'from-blue-500/20 to-indigo-500/20 hover:border-blue-500'
  },
  {
    title: 'Automation',
    icon: Workflow,
    body: 'Designing workflow orchestrations that save time, automate data flows, and reduce manual effort.',
    color: 'from-violet-500/20 to-purple-500/20 hover:border-purple-400'
  },
  {
    title: 'Game Development',
    icon: Rocket,
    body: 'Exploring interactive virtual worlds, 3D logic systems, physics mechanics, and gameplay scripts.',
    color: 'from-fuchsia-500/20 to-pink-500/20 hover:border-fuchsia-400'
  },
  {
    title: 'Startup Collaboration',
    icon: BriefcaseBusiness,
    body: 'Open to co-founding, active partnerships, and rapid MVP engineering for early-stage ventures.',
    color: 'from-blue-500/20 to-cyan-500/20 hover:border-cyan-500'
  }
];

const JOURNEY_STEPS = [
  {
    title: 'Started Learning Programming',
    description: 'Began exploring software logic, command line utilities, and basic script editing.'
  },
  {
    title: 'C++ Fundamentals',
    description: 'Mastered object-oriented principles, compilers, execution loops, and low-level memory thinking.'
  },
  {
    title: 'Data Structures & Algorithms',
    description: 'Studied core arrays, stacks, queues, trees, search techniques, and optimized logic flows.'
  },
  {
    title: 'AI-Assisted Development',
    description: 'Learned to build apps using LLMs, prompt pipelines, and integrated AI tools in the developer suite.'
  },
  {
    title: 'Modern Web Development',
    description: 'Acquired skills in React, TypeScript, database modeling, responsive styling, and modern APIs.'
  },
  {
    title: 'Personal Projects',
    description: 'Began building and launching indie web utilities, productivity scripts, and open-source tools to solve personal workflows.'
  },
  {
    title: 'Building SaaS & Products',
    description: 'Designing, launching, and scaling SaaS platforms, AI-powered applications, and digital experiences.'
  }
];

const PROJECTS: Project[] = [
  {
    title: 'HexGrid Goa',
    category: 'Environmental Tech Platform',
    summary: 'Turning coastal beach cleanups into a trackable, verifiable, and rewarding live hex-grid system.',
    description: 'HexGrid Goa divides coastlines into a live hex-grid. Volunteers submit before/after scans of locations, which are verified via AI-assisted review with human fallback. Cleansed areas update a shared public map, rewarding contributors with impact points, faction progress, and leaderboard recognition to solve low visibility, low trust, and volunteer retention in environmental efforts.',
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Leaflet', 'Node.js', 'TensorFlow.js'],
    github: 'https://github.com/Samyakj-07/HexGrid-Goa.git',
    demo: 'https://hexgrid-goa.vercel.app',
    image: '/hexgrid-goa.png',
    imageGlow: 'from-accent-primary/20 via-slate-950/10 to-black'
  }
];

const THINGS_TO_BUILD: BuildCard[] = [
  {
    title: 'AI Startup',
    icon: BrainCircuit,
    description: 'An automated agent platform designed to execute complex, multi-modal business flows.',
    details: 'A workflow canvas where users hook up custom AI agents that can browse, code, fetch APIs, edit databases, and write emails collaboratively.'
  },
  {
    title: 'Developer Platform',
    icon: Terminal,
    description: 'A code-to-cloud serverless hosting workspace that makes deployments instant.',
    details: 'A lightweight deployment CLI and UI dashboard that reads code repositories, configures edge nodes automatically, and serves static/serverless paths globally with zero setup.'
  },
  {
    title: 'SaaS Company',
    icon: Layers3,
    description: 'A digital workspace for creative teams to store, write, and publish interactive design specs.',
    details: 'A multiplayer editing hub built with operational transformations (OT) or CRDTs, optimized for developers and designers to draft user stories and interactive flows.'
  },
  {
    title: 'Automation Ecosystem',
    icon: Workflow,
    description: 'A cross-platform keyboard and cursor macro system syncing across remote desktop paths.',
    details: 'A background client app that records recurrent browser/terminal actions, generates local python/bash automation scripts, and syncs them securely to cloud endpoints.'
  },
  {
    title: 'Open Source Products',
    icon: Braces,
    description: 'Optimized state management and rendering primitives for modern React and TS tools.',
    details: 'High-performance React hook libraries and web worker wrappers facilitating background data sorting and large array computations at sub-millisecond speeds.'
  }
];

const BEYOND_CODING: BeyondCard[] = [
  {
    title: 'Learning New Technologies',
    icon: Sparkles,
    description: 'Endless curiosity about how advanced systems work under the hood.',
    detail: 'I spend my free hours reading technical articles, analyzing public code repos, and experimenting with new language tools like Rust, Go, or WebAssembly.'
  },
  {
    title: 'Product Design',
    icon: Rocket,
    description: 'Studying product-market fit, layout architecture, and user psychology.',
    detail: 'I focus on building clear interfaces, minimizing user friction, and crafting intuitive journeys that translate complex code into valuable utilities.'
  },
  {
    title: 'Building Products',
    icon: PenTool,
    description: 'Designing interactive structures that improve digital workflows.',
    detail: 'Beyond writing scripts, I focus on design, wireframes, copywriting, and metrics to ensure that whatever I construct is clean, useful, and delightful.'
  },
  {
    title: 'Exploring AI',
    icon: Bot,
    description: 'Integrating neural intelligence pipelines into traditional applications.',
    detail: 'I explore prompt chaining, agentic pipelines, RAG systems, and semantic searching to build tools that help automate knowledge worker tasks.'
  },
  {
    title: 'Problem Solving',
    icon: ShieldCheck,
    description: 'Solving code patterns, graph trees, and runtime bottlenecks.',
    detail: 'I enjoy testing my logic with algorithmic challenges, optimizing sorting logic in C++, and finding structural bottlenecks in frontend React rendering loops.'
  }
];

// ==========================================
// R3F 3D StarField Particles
// ==========================================
// ==========================================
// Dynamic Theme Configuration
// ==========================================
export interface ThemeConfig {
  name: string;
  bg: string;
  primary: string;
  secondary: string;
  glow1: string;
  glow2: string;
  glow3: string;
  accentPrimary: string;
  accentSecondary: string;
  accentTertiary: string;
}

export const THEMES: Record<string, ThemeConfig> = {
  sky: {
    name: 'Sky Nebula',
    bg: '#02040c',
    primary: '#00F5FF',
    secondary: '#0066FF',
    glow1: 'rgba(0,102,255,0.15)',
    glow2: 'rgba(6,182,212,0.12)',
    glow3: 'rgba(147,51,234,0.08)',
    accentPrimary: '6, 182, 212',
    accentSecondary: '0, 102, 255',
    accentTertiary: '147, 51, 234'
  },
  gold: {
    name: 'Obsidian Gold',
    bg: '#080604',
    primary: '#F59E0B',
    secondary: '#D97706',
    glow1: 'rgba(217,119,6,0.15)',
    glow2: 'rgba(245,158,11,0.12)',
    glow3: 'rgba(251,191,36,0.08)',
    accentPrimary: '245, 158, 11',
    accentSecondary: '217, 119, 6',
    accentTertiary: '251, 191, 36'
  },
  emerald: {
    name: 'Cyber Emerald',
    bg: '#020604',
    primary: '#10B981',
    secondary: '#059669',
    glow1: 'rgba(16,185,129,0.15)',
    glow2: 'rgba(5,150,105,0.12)',
    glow3: 'rgba(245,158,11,0.08)',
    accentPrimary: '16, 185, 129',
    accentSecondary: '5, 150, 105',
    accentTertiary: '245, 158, 11'
  },
  synth: {
    name: 'Synthwave',
    bg: '#090210',
    primary: '#DB2777',
    secondary: '#9333EA',
    glow1: 'rgba(219,39,119,0.15)',
    glow2: 'rgba(147,51,234,0.12)',
    glow3: 'rgba(79,70,229,0.08)',
    accentPrimary: '219, 39, 119',
    accentSecondary: '147, 51, 234',
    accentTertiary: '79, 70, 229'
  },
  carbon: {
    name: 'Carbon',
    bg: '#080809',
    primary: '#FAFAFA',
    secondary: '#A1A1AA',
    glow1: 'rgba(255,255,255,0.06)',
    glow2: 'rgba(161,161,170,0.05)',
    glow3: 'rgba(255,255,255,0.02)',
    accentPrimary: '250, 250, 250',
    accentSecondary: '161, 161, 170',
    accentTertiary: '228, 228, 231'
  }
};

// ==========================================
// R3F 3D StarField Particles
// ==========================================
function Stars({ color, count, speed, size = 0.012 }: StarsProps) {
  const ref = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 0.35;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 0.35;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 8;
    }
    return pos;
  }, [count]);

  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * speed * 0.15;
      ref.current.rotation.y += delta * speed * 0.1;
      ref.current.position.x += (mouse.current.x - ref.current.position.x) * 0.04;
      ref.current.position.y += (-mouse.current.y - ref.current.position.y) * 0.04;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        sizeAttenuation
        transparent
        opacity={0.5}
        depthWrite={false}
      />
    </points>
  );
}

function StarField({ themeKey }: { themeKey: keyof typeof THEMES }) {
  const currentTheme = THEMES[themeKey];

  return (
    <div 
      className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: currentTheme.bg }}
    >
      {/* Nebula radial glows */}
      <div 
        className="absolute inset-0 transition-all duration-700" 
        style={{ backgroundImage: `radial-gradient(circle at 30% 35%, ${currentTheme.glow1}, transparent 55%)` }}
      />
      <div 
        className="absolute inset-0 transition-all duration-700" 
        style={{ backgroundImage: `radial-gradient(circle at 75% 75%, ${currentTheme.glow2}, transparent 50%)` }}
      />
      <div 
        className="absolute inset-0 transition-all duration-700" 
        style={{ backgroundImage: `radial-gradient(circle at 80% 20%, ${currentTheme.glow3}, transparent 50%)` }}
      />

      {/* Subtle background tech grid */}
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <Canvas camera={{ position: [0, 0, 1.5] }}>
        <ambientLight intensity={0.5} />
        <Stars color="#ffffff" count={800} speed={0.02} size={0.01} />
        <Stars color={currentTheme.primary} count={300} speed={0.04} size={0.013} />
        <Stars color={currentTheme.secondary} count={300} speed={0.015} size={0.015} />
      </Canvas>
    </div>
  );
}

// ==========================================
// R3F 3D Hero Morphing Centerpiece
// ==========================================
function MorphingCenterpiece({ themeKey }: { themeKey: keyof typeof THEMES }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const currentTheme = THEMES[themeKey];

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.12;
      meshRef.current.rotation.y += delta * 0.16;
      
      const time = state.clock.getElapsedTime();
      const scaleVal = 1 + Math.sin(time * 1.5) * 0.05;
      meshRef.current.scale.set(scaleVal, scaleVal, scaleVal);
      
      // Follow mouse cursor hover coordinates
      const targetX = state.pointer.x * 0.35;
      const targetY = state.pointer.y * 0.35;
      meshRef.current.rotation.x += (targetY - meshRef.current.rotation.x) * 0.06;
      meshRef.current.rotation.y += (targetX - meshRef.current.rotation.y) * 0.06;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[0.38, 0.13, 90, 16, 2, 3]} />
      <meshStandardMaterial
        wireframe
        color={currentTheme.primary}
        emissive={currentTheme.primary}
        emissiveIntensity={0.5}
        roughness={0.15}
        metalness={0.85}
      />
    </mesh>
  );
}

function HeroCanvas({ themeKey }: { themeKey: keyof typeof THEMES }) {
  return (
    <div className="w-full h-[320px] sm:h-[450px] relative select-none">
      <Canvas camera={{ position: [0, 0, 1.25] }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.2} color="#ffffff" />
        <directionalLight position={[-5, 5, -5]} intensity={0.4} />
        <MorphingCenterpiece themeKey={themeKey} />
      </Canvas>
    </div>
  );
}

// ==========================================
// Matrix Rain Canvas Simulation (Easter Egg)
// ==========================================
function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const cols = Math.floor(width / 14) + 1;
    const ypos = Array(cols).fill(0);

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    const matrix = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = 'rgba(16, 185, 129, 0.35)'; // CRT green glow
      ctx.font = '10pt monospace';

      ypos.forEach((y, ind) => {
        const text = String.fromCharCode(33 + Math.floor(Math.random() * 93));
        const x = ind * 14;
        ctx.fillText(text, x, y);
        if (y > 100 + Math.random() * 10000) ypos[ind] = 0;
        else ypos[ind] = y + 14;
      });
    };

    const interval = setInterval(matrix, 35);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-45 z-0" />;
}

// ==========================================
// Retro CRT Terminal Panel Drawer Component
// ==========================================
interface TerminalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  themeKey: keyof typeof THEMES;
  setThemeKey: (theme: keyof typeof THEMES) => void;
  content: PortfolioContent;
}

function TerminalDrawer({ isOpen, onClose, themeKey, setThemeKey, content }: TerminalDrawerProps) {
  const [history, setHistory] = useState<string[]>([
    'Welcome to PortfolioOS [Version 1.0.0]',
    '(c) 2026 Samyak Jain. All system channels active.',
    '',
    "Type 'help' to see list of available commands.",
    ''
  ]);
  const [input, setInput] = useState('');
  const [isMatrixActive, setIsMatrixActive] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').toLowerCase();

    let output: string[] = [`samyak@system:~# ${trimmed}`];

    switch (cmd) {
      case 'help':
        output.push(
          'Available Commands:',
          '  about       - Short professional background bio',
          '  skills      - Technical capabilities & stack summary',
          '  projects    - List active featured applications',
          '  theme <val> - Switch site theme (sky, gold, emerald, synth, carbon)',
          '  neofetch    - Show portfolio OS hardware diagnostics',
          '  matrix      - Activate falling green code rain',
          '  contact     - Retrieve email and LinkedIn profiles',
          '  console     - Establish secure channel to dashboard',
          '  clear       - Wipe console text buffer',
          '  help        - Show this helper guide'
        );
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      case 'about':
        output.push(
          'Samyak Jain -- Full Stack Developer & Builder',
          '---------------------------------------------',
          'A software engineer focused on building clean,',
          'functional, and premium digital products. I design',
          'high-performance web utilities, custom automation',
          'orchestrations, and generative AI pipelines.',
          '',
          'Open to startup collaborations and MVP engineering.'
        );
        break;
      case 'skills':
        output.push(
          '[ Technical Stack Capabilities ]',
          '---------------------------------------------',
          'Languages : C++, JavaScript, TypeScript',
          'Web Core  : React, HTML5, CSS3, Tailwind CSS v4',
          'Backends  : Node.js, Express, REST APIs',
          'Databases : MongoDB, MySQL, JSON Schemas',
          'Visuals   : GSAP, Three.js, React Three Fiber'
        );
        break;
      case 'projects':
        output.push(
          '[ Featured Code Projects ]',
          '---------------------------------------------',
          `1. ${content.projectTitle} - ${content.projectSummary}`
        );
        break;
      case 'admin':
      case 'console':
      case 'login':
        output.push(
          '[ SANITY.IO HEADLESS CMS DIRECTORY ]',
          '---------------------------------------------',
          'Content management is configured via Sanity.io.',
          '',
          'To edit your portfolio details or upload screenshots:',
          '  1. Run local visual dashboard: "npx sanity dev"',
          '  2. Or manage project online  : visit https://manage.sanity.io',
          '',
          'Credentials and database access are secured remotely.'
        );
        break;
      case 'neofetch':
        output.push(
          'samyak@portfolio-os',
          '------------------',
          'OS: PortfolioOS v1.0.0 (Mac)',
          'Kernel: React 19 + TypeScript',
          'Uptime: 2h 45m',
          'Shell: antigravity-sh 2.0',
          'DE: Tailwind CSS v4',
          'WM: GSAP + Lenis Smooth Scroll',
          'CPU: Samyak Jain (Fullstack Developer)',
          'Memory: 16 GB Creative Logic / 100% Focused'
        );
        break;
      case 'matrix':
        setIsMatrixActive(true);
        output.push('WARNING: Matrix rain override activated. Exit by typing any other command.');
        break;
      case 'contact':
        output.push(
          'Contact Details:',
          '  Email    - samyak.jain@example.com',
          '  LinkedIn - linkedin.com/in/samyak-jain-173756374/',
          '  GitHub   - github.com'
        );
        break;
      case 'theme':
        if (THEMES[arg as keyof typeof THEMES]) {
          setThemeKey(arg as keyof typeof THEMES);
          output.push(`SUCCESS: System theme updated to '${THEMES[arg as keyof typeof THEMES].name}'.`);
        } else {
          output.push(
            `ERROR: Theme '${arg}' not recognized.`,
            "Choose from: 'sky', 'gold', 'emerald', 'synth', 'carbon'."
          );
        }
        break;
      default:
        output.push(`Command not found: '${cmd}'. Type 'help' for command directory.`);
    }

    if (cmd !== 'matrix') {
      setIsMatrixActive(false);
    }

    setHistory(prev => [...prev, ...output, '']);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 200 }}
            className="terminal-drawer terminal-crt"
          >
            {isMatrixActive && <MatrixRain />}

            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-black/40 z-10 relative">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <span className="text-[10px] text-slate-500 font-mono font-bold tracking-widest uppercase ml-2 select-none">
                  samyak@system: ~
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <div 
              className="flex-1 p-4 overflow-y-auto z-10 relative terminal-crt-screen text-xs font-mono leading-relaxed"
              style={{ color: `rgb(${THEMES[themeKey].accentPrimary})` }}
              onClick={() => inputRef.current?.focus()}
            >
              {history.map((line, i) => (
                <div key={i} className="whitespace-pre-wrap">
                  {line}
                </div>
              ))}
              <div className="flex items-center mt-1">
                <span>samyak@system:~#&nbsp;</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent border-none outline-none focus:ring-0 p-0 text-xs font-mono"
                  style={{ color: `rgb(${THEMES[themeKey].accentPrimary})` }}
                />
                <span className="terminal-cursor" />
              </div>
              <div ref={terminalEndRef} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ==========================================
// Magnetic Button Component
// ==========================================
interface MagneticButtonProps extends React.ComponentPropsWithoutRef<typeof motion.a> {
  children: React.ReactNode;
  className?: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string; size?: number }>;
  type?: 'button' | 'submit';
}

function MagneticButton({ children, className = '', href, icon: Icon, type = 'button', ...props }: MagneticButtonProps) {
  const ref = useRef<any>(null);
  const x = useSpring(0, { stiffness: 250, damping: 20 });
  const y = useSpring(0, { stiffness: 250, damping: 20 });
  const Component = href ? motion.a : motion.button;

  const handleMove = (event: React.MouseEvent) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * 0.2);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.2);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const hasTextColor = className.includes('text-');

  return (
    <Component
      ref={ref}
      href={href}
      type={href ? undefined : type}
      className={`relative inline-flex items-center justify-center gap-2 px-6 py-3 border border-slate-800 rounded-full bg-slate-950/50 backdrop-blur-md font-semibold transition-all hover:border-accent-primary/50 hover:shadow-[0_0_20px_rgba(var(--accent-primary),0.15)] ${hasTextColor ? '' : 'text-white'} ${className}`}
      style={{ x, y }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      whileTap={{ scale: 0.98 }}
      {...(props as any)}
    >
      <span style={{ color: 'inherit' }}>{children}</span>
      {Icon && <Icon size={16} className="text-accent-primary group-hover:translate-x-0.5 transition-transform" style={{ color: 'rgb(var(--accent-primary))' }} />}
    </Component>
  );
}

// ==========================================
// Orbiting Tech Stack Element Component
// ==========================================
interface OrbitNodeProps {
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  index: number;
  total: number;
  radius: number;
  colorClass: string;
}

function OrbitNode({ name, icon: Icon, index, total, radius, colorClass }: OrbitNodeProps) {
  const angle = (index / total) * Math.PI * 2;
  const [screenRadius, setScreenRadius] = useState(radius);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 680) {
        setScreenRadius(radius * 0.65);
      } else {
        setScreenRadius(radius);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [radius]);

  const x = Math.cos(angle) * screenRadius;
  const y = Math.sin(angle) * screenRadius;

  return (
    <div
      className="absolute"
      style={{
        left: '50%',
        top: '50%',
        transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`
      }}
    >
      <div className="orbit-node group">
        <Icon size={16} className={`${colorClass} group-hover:scale-110 transition-transform`} />
        <span className="text-[8px] md:text-[9px] mt-0.5 font-medium whitespace-nowrap opacity-60 group-hover:opacity-100 group-hover:text-accent-primary transition-all">{name}</span>
      </div>
    </div>
  );
}

// ==========================================
// Main Components
// ==========================================

interface NavigationProps {
  themeKey: keyof typeof THEMES;
  setThemeKey: (theme: keyof typeof THEMES) => void;
  onOpenTerminal: () => void;
}

function Navigation({ themeKey, setThemeKey, onOpenTerminal }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [time, setTime] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Kolkata'
      });
      setTime(timeStr + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(Math.round((window.scrollY / totalHeight) * 100));
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { href: '#home', label: 'home' },
    { href: '#explore', label: 'explore' },
    { href: '#journey', label: 'journey' },
    { href: '#projects', label: 'projects' },
    { href: '#tech-stack', label: 'tech' },
    { href: '#beyond', label: 'beyond' },
    { href: '#contact', label: 'contact' }
  ];

  const isExpanded = !isScrolled || isHovered || mobileMenuOpen;

  return (
    <>
      <div 
        className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none select-none"
      >
        <motion.header
          className="pointer-events-auto flex items-center justify-between border border-white/[0.08] bg-black/60 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] rounded-full transition-all duration-300 ease-out overflow-hidden"
          style={{
            width: isExpanded ? '100%' : '260px',
            maxWidth: isExpanded ? '1120px' : '260px',
            paddingLeft: isExpanded ? '24px' : '16px',
            paddingRight: isExpanded ? '24px' : '16px',
            height: '48px',
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Left Side: Brand Logo or System status */}
          <div className="flex items-center gap-2 font-mono">
            <a className="flex items-center gap-2 text-white font-black text-xs tracking-wider" href="#home">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              {isExpanded ? 'SAMYAK // SYSTEM' : 'SJ'}
            </a>
          </div>

          {/* Center Links (only show when expanded) */}
          <AnimatePresence>
            {isExpanded && (
              <motion.nav 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hidden lg:flex items-center gap-1.5" 
                aria-label="Primary navigation"
              >
                {links.map((link, idx) => (
                  <a
                    href={link.href}
                    key={link.href}
                    className="relative text-[9px] font-mono tracking-widest text-slate-400 hover:text-accent-primary px-3 py-1.5 transition-colors uppercase"
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  >
                    {hoveredIdx === idx && (
                      <motion.span
                        layoutId="nav-hover-pill"
                        className="absolute inset-0 bg-white/[0.06] border border-white/[0.04] rounded-full z-0"
                        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </a>
                ))}
              </motion.nav>
            )}
          </AnimatePresence>

          {/* Collapsed Center Text */}
          {!isExpanded && (
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest animate-pulse">
              System Active
            </span>
          )}

          {/* Right Side Controls */}
          <div className="flex items-center gap-3">
            {isExpanded ? (
              <>
                <div className="hidden sm:flex flex-col items-end font-mono text-[8px] text-slate-500 leading-none">
                  <span className="text-accent-primary/90 font-bold" style={{ color: 'rgb(var(--accent-primary))' }}>{time}</span>
                </div>

                {/* Theme Switcher Dots */}
                <div className="hidden md:flex items-center gap-1.5 border-r border-white/10 pr-3 mr-1">
                  {(Object.keys(THEMES) as Array<keyof typeof THEMES>).map((tKey) => {
                    const active = themeKey === tKey;
                    const t = THEMES[tKey];
                    return (
                      <button
                        key={tKey}
                        onClick={() => setThemeKey(tKey)}
                        className={`w-3 h-3 rounded-full border transition-all hover:scale-115 cursor-pointer relative ${
                          active 
                            ? 'border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.4)]' 
                            : 'border-white/20'
                        }`}
                        style={{ backgroundColor: t.primary }}
                        title={t.name}
                      />
                    );
                  })}
                </div>

                <button
                  onClick={onOpenTerminal}
                  className="px-3 py-1 border border-white/10 hover:border-accent-primary/40 rounded-full bg-white/[0.03] text-[9px] font-mono font-bold tracking-wider text-slate-400 hover:text-accent-primary transition-all flex items-center gap-1.5 uppercase cursor-pointer"
                  style={{
                    color: 'inherit'
                  }}
                >
                  <Terminal size={10} className="text-accent-primary" style={{ color: 'rgb(var(--accent-primary))' }} />
                  <span>Console</span>
                </button>

                <a
                  className="px-3.5 py-1 border border-accent-primary/40 rounded-full bg-accent-primary/20 text-[9px] font-mono font-bold tracking-wider text-accent-primary hover:bg-accent-primary hover:text-black transition-all shadow-[0_0_15px_rgba(var(--accent-primary),0.1)] uppercase"
                  style={{
                    borderColor: 'rgba(var(--accent-primary), 0.4)',
                    backgroundColor: 'rgba(var(--accent-primary), 0.2)',
                    color: 'rgb(var(--accent-primary))'
                  }}
                  href="#contact"
                >
                  Inquire
                </a>
              </>
            ) : (
              <span 
                className="text-[9px] font-mono text-accent-primary font-bold bg-accent-primary/30 px-2 py-0.5 border border-accent-primary/20 rounded-full"
                style={{
                  color: 'rgb(var(--accent-primary))',
                  backgroundColor: 'rgba(var(--accent-primary), 0.3)',
                  borderColor: 'rgba(var(--accent-primary), 0.2)'
                }}
              >
                {scrollProgress}%
              </span>
            )}
            
            <button
              className="flex lg:hidden w-7 h-7 items-center justify-center text-slate-400 hover:text-white"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={15} /> : <Menu size={15} />}
            </button>
          </div>
        </motion.header>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed top-20 left-4 right-4 z-40 p-6 border border-white/[0.08] rounded-3xl bg-black/95 backdrop-blur-xl shadow-2xl flex flex-col gap-6 lg:hidden font-mono"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col gap-4">
              {links.map((link) => (
                <a
                  href={link.href}
                  key={link.href}
                  className="text-sm text-slate-400 font-bold hover:text-accent-primary capitalize"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <button
                className="text-sm text-slate-400 font-bold hover:text-accent-primary capitalize text-left flex items-center gap-2"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTerminal();
                }}
              >
                <Terminal size={14} className="text-accent-primary" style={{ color: 'rgb(var(--accent-primary))' }} />
                <span>System Console</span>
              </button>
            </nav>
            {/* Theme switcher on mobile */}
            <div className="flex flex-col gap-2 border-t border-white/[0.05] pt-4">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold font-mono">Select Theme</span>
              <div className="flex items-center gap-3">
                {(Object.keys(THEMES) as Array<keyof typeof THEMES>).map((tKey) => {
                  const active = themeKey === tKey;
                  const t = THEMES[tKey];
                  return (
                    <button
                      key={tKey}
                      onClick={() => setThemeKey(tKey)}
                      className={`w-5 h-5 rounded-full border transition-all cursor-pointer relative ${
                        active 
                          ? 'border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.4)]' 
                          : 'border-white/20'
                      }`}
                      style={{ backgroundColor: t.primary }}
                      title={t.name}
                    />
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col gap-1 border-t border-white/[0.05] pt-4 text-[10px] text-slate-500">
              <span className="text-accent-primary" style={{ color: 'rgb(var(--accent-primary))' }}>{time}</span>
              <span>LOC: IND [GMT+5:30]</span>
            </div>
            <a
              className="flex items-center justify-center w-full py-3 border border-accent-primary/40 rounded-full bg-accent-primary/30 text-xs font-bold text-accent-primary hover:bg-accent-primary hover:text-black transition-all"
              style={{
                borderColor: 'rgba(var(--accent-primary), 0.4)',
                backgroundColor: 'rgba(var(--accent-primary), 0.3)',
                color: 'rgb(var(--accent-primary))'
              }}
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
            >
              HIRE SAMYAK
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Hero({ onOpenTerminal, themeKey, content }: { onOpenTerminal: () => void; themeKey: keyof typeof THEMES; content: PortfolioContent }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textColRef.current) {
      // Animate entry with GSAP
      gsap.fromTo(
        textColRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out', delay: 0.4 }
      );
    }
  }, []);

  return (
    <section className="relative min-h-[100svh] flex flex-col justify-center px-6 py-20" id="home">
      <div 
        ref={containerRef} 
        className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
      >
        {/* Left Column: Copy & Actions */}
        <div ref={textColRef} className="lg:col-span-7 flex flex-col gap-6 text-left items-start z-10">
          <span 
            className="text-xs uppercase tracking-widest font-bold font-mono px-3.5 py-1 border rounded-full transition-all duration-300"
            style={{ 
              color: `rgb(${THEMES[themeKey].accentPrimary})`,
              borderColor: `rgba(${THEMES[themeKey].accentPrimary}, 0.25)`,
              backgroundColor: `rgba(${THEMES[themeKey].accentPrimary}, 0.05)`
            }}
          >
            HELLO WORLD // PORTFOLIO WORKSPACE
          </span>
          <h1 className="flex flex-col gap-2">
            <span className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-none">
              {content.heroName.toUpperCase()}
            </span>
            <span className="text-xl sm:text-2xl md:text-3xl text-slate-400 font-semibold leading-normal mt-2">
              {content.heroTitle}
            </span>
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-bold text-slate-500 font-mono">
            <span>Developer.</span>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `rgb(${THEMES[themeKey].accentPrimary})` }} />
            <span>Builder.</span>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `rgb(${THEMES[themeKey].accentPrimary})` }} />
            <span>Product Maker.</span>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `rgb(${THEMES[themeKey].accentPrimary})` }} />
            <span style={{ color: `rgb(${THEMES[themeKey].accentPrimary})` }}>[ OPEN FOR STARTUPS ]</span>
          </div>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-lg font-medium">
            {content.heroBio}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-2">
            <MagneticButton href="#projects" icon={ArrowRight} className="bg-white !text-black hover:bg-slate-200">
              View Work
            </MagneticButton>
            <button
              onClick={onOpenTerminal}
              className="relative inline-flex items-center justify-center gap-2 px-6 py-3 border rounded-full bg-slate-950/50 backdrop-blur-md font-semibold transition-all hover:scale-102 cursor-pointer text-xs"
              style={{
                borderColor: `rgba(${THEMES[themeKey].accentPrimary}, 0.25)`,
                color: `rgb(${THEMES[themeKey].accentPrimary})`,
                boxShadow: `0 0 15px rgba(${THEMES[themeKey].accentPrimary}, 0.05)`
              }}
            >
              <Terminal size={14} />
              <span>Open Console</span>
            </button>
          </div>
        </div>

        {/* Right Column: 3D Morphing Centerpiece */}
        <div className="lg:col-span-5 w-full flex justify-center items-center z-10">
          <HeroCanvas themeKey={themeKey} />
        </div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 cursor-pointer select-none"
        onClick={() => document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <MousePointer2 size={16} style={{ color: `rgb(${THEMES[themeKey].accentPrimary})` }} />
        <span className="text-[10px] tracking-widest uppercase">Explore Workspace</span>
      </motion.div>
    </section>
  );
}

function WhoAmI() {
  const text = "I am a developer who loves turning ideas into reality. From websites and web applications to AI-powered tools and startup concepts, I enjoy building products that solve real problems. I'm constantly learning, experimenting, and pushing myself to create bigger and better things.";

  // Split text into words for stagger reveal
  const words = text.split(' ');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.04
      }
    }
  };

  const wordVariants = {
    hidden: { opacity: 0.15, y: 5 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  return (
    <section className="py-24 px-6 max-w-5xl mx-auto" id="explore">
      <div className="flex flex-col gap-6">
        <span className="text-xs uppercase tracking-widest text-accent-primary font-bold">Who Am I?</span>
        <h2 className="text-3xl sm:text-5xl font-black text-white mt-4">I design & engineer software values.</h2>

        <motion.div
          className="mt-6 flex flex-wrap gap-x-2 gap-y-1 text-xl sm:text-3xl font-medium text-slate-500 leading-relaxed"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10%' }}
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              variants={wordVariants}
              className="hover:text-white transition-colors duration-200"
            >
              {word}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CurrentlyExploring() {
  return (
    <section className="py-24 px-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-12">
        <div>
          <span className="text-xs uppercase tracking-widest text-accent-primary font-bold">Capabilities</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white mt-4">Currently Exploring</h2>
          <p className="text-sm sm:text-base text-slate-400 mt-4 max-w-lg">Fields I actively experiment in to build future-focused digital systems.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {EXPLORING_ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                className={`p-8 border border-white/[0.05] border-glow-hover rounded-3xl bg-slate-950/40 backdrop-blur-sm flex flex-col gap-4 group transition-all duration-300 hover:translate-y-[-4px] hover:shadow-[0_15px_30px_rgba(0,0,0,0.4)] ${item.color}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-12 h-12 grid place-items-center border border-white/[0.08] rounded-2xl bg-white/[0.02] text-accent-primary group-hover:bg-accent-primary group-hover:text-black group-hover:scale-105 transition-all">
                  <Icon size={20} />
                </div>
                <h3 className="text-lg font-bold text-white mt-2 group-hover:text-accent-primary transition-colors">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{item.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Journey() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Hook up scroll position of the section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end end']
  });

  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 25 });

  return (
    <section ref={containerRef} className="py-24 px-6 max-w-4xl mx-auto" id="journey">
      <div className="flex flex-col gap-16 relative">
        <div>
          <span className="text-xs uppercase tracking-widest text-accent-primary font-bold">Milestones</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white mt-4">My Journey</h2>
          <p className="text-sm sm:text-base text-slate-400 mt-4 max-w-md">My roadmap from writing initial logic to engineering complete web applications.</p>
        </div>

        <div className="relative flex flex-col gap-12 pl-10 md:pl-0">
          {/* Animated vertical track line */}
          <div className="absolute left-[19px] md:left-1/2 top-[32px] bottom-[64px] w-[2px] bg-slate-800 pointer-events-none" />
          <motion.div
            style={{ scaleY, transformOrigin: 'top' }}
            className="absolute left-[19px] md:left-1/2 top-[32px] bottom-[64px] w-[2px] bg-gradient-to-b from-accent-secondary via-accent-primary to-accent-tertiary pointer-events-none"
          />

          {JOURNEY_STEPS.map((step, index) => {
            const isLeft = index % 2 === 0;
            return (
              <motion.div
                key={index}
                className={`relative flex flex-col md:flex-row md:items-center ${isLeft ? 'md:justify-start' : 'md:justify-end'}`}
                initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6 }}
              >
                {/* Visual node marker */}
                <div 
                  className="absolute left-[-31px] md:left-1/2 md:translate-x-[-10px] top-1.5 w-5 h-5 border-2 rounded-full bg-black z-10"
                  style={{
                    borderColor: 'rgb(var(--accent-primary))',
                    boxShadow: '0 0 10px rgba(var(--accent-primary), 0.5)'
                  }}
                />

                {/* Card element */}
                <div className={`w-full md:w-[45%] p-6 border border-white/[0.05] border-glow-hover rounded-2xl bg-slate-950/30 backdrop-blur-sm transition-all hover:border-accent-primary/20 hover:bg-slate-950/50`}>
                  <h3 className="text-base font-bold text-white">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FeaturedProjects({ projects }: { projects: Project[] }) {
  return (
    <section className="py-24 px-6 max-w-6xl mx-auto" id="projects">
      <div className="flex flex-col gap-16">
        <div>
          <span className="text-xs uppercase tracking-widest text-accent-primary font-bold">Execution</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white mt-4">Featured Projects</h2>
          <p className="text-sm sm:text-base text-slate-400 mt-4 max-w-md">Product drafts and code solutions that highlight my development range.</p>
        </div>

        <div className="flex flex-col gap-12">
          {projects.map((project, index) => {
            const isReverse = index % 2 !== 0;
            return (
              <motion.article
                key={index}
                className={`flex flex-col lg:flex-row gap-8 items-stretch p-8 border border-white/[0.05] border-glow-hover rounded-3xl bg-slate-950/20 backdrop-blur-md relative overflow-hidden group ${
                  isReverse ? 'lg:flex-row-reverse' : ''
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.7 }}
              >
                {/* Glowing backing effect */}
                <div className={`absolute inset-0 z-[-1] bg-gradient-to-br ${project.imageGlow} opacity-30`} />

                {/* Project screenshots mock frame */}
                <div className="flex-1 min-h-[300px] lg:min-h-[360px] border border-white/[0.08] rounded-2xl bg-black/40 overflow-hidden relative flex flex-col select-none group/browser shadow-2xl">
                  {/* Browser Header */}
                  <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.08] bg-slate-900/60 backdrop-blur-sm z-10">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                    <span className="text-[11px] text-slate-400 font-medium ml-4 font-mono select-all bg-black/30 px-3 py-0.5 rounded-md border border-white/[0.03]">
                      {project.demo ? project.demo.replace(/^https?:\/\//, '') : `${project.title.toLowerCase().replace(/\s/g, '-')}.dev`}
                    </span>
                  </div>

                  {/* Browser Body */}
                  <div className="flex-1 relative overflow-hidden bg-[#09090b] flex items-center justify-center">
                    {project.image ? (
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="absolute inset-0 w-full h-full object-cover object-top group-hover/browser:scale-[1.04] transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-[85%] p-6 min-h-[140px] flex flex-col justify-between">
                        <div className="h-2 w-12 bg-accent-primary/20 rounded-full" />
                        <div className="flex flex-col gap-2 mt-4">
                          <div className="h-4 w-3/4 bg-slate-800 rounded-md" />
                          <div className="h-3 w-1/2 bg-slate-800/60 rounded-md" />
                        </div>
                        <div className="flex items-center gap-2 mt-6">
                          <span className="w-4 h-4 rounded-full bg-accent-secondary/20 border border-accent-secondary/40" />
                          <span className="w-4 h-4 rounded-full bg-accent-primary/20 border border-accent-primary/40" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Details column */}
                <div className="flex-1 flex flex-col justify-between p-2 lg:p-4">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-accent-primary font-bold">{project.category}</span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white mt-1 group-hover:text-accent-primary transition-colors">{project.title}</h3>
                    <p className="text-slate-400 text-sm mt-4 leading-relaxed font-semibold">{project.summary}</p>
                    <p className="text-slate-500 text-xs sm:text-sm mt-3 leading-relaxed">{project.description}</p>
                  </div>

                  <div className="mt-8 flex flex-col gap-4">
                    {/* Tech stack rows */}
                    <div className="flex flex-wrap gap-2">
                      {project.stack.map((item, idx) => (
                        <span key={idx} className="px-3 py-1 border border-white/[0.06] rounded-full bg-white/[0.02] text-[11px] text-slate-400 font-mono">
                          {item}
                        </span>
                      ))}
                    </div>

                    {/* Interaction link row */}
                    <div className="flex items-center gap-4 mt-2">
                      <a
                        href={project.demo}
                        className="inline-flex items-center gap-1.5 text-xs text-white font-bold hover:text-accent-primary transition-colors"
                      >
                        Live Demo
                        <ExternalLink size={14} />
                      </a>
                      <a
                        href={project.github}
                        className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-bold hover:text-white transition-colors"
                      >
                        Source Code
                        <Github size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ThingsIWantToBuild() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section className="py-24 px-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-12">
        <div>
          <span className="text-xs uppercase tracking-widest text-accent-primary font-bold">Backlog</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white mt-4">Things I Want To Build</h2>
          <p className="text-sm sm:text-base text-slate-400 mt-4 max-w-md">Concepts and software structures on my developmental drawing board.</p>
        </div>

        <div className="flex flex-col gap-4">
          {THINGS_TO_BUILD.map((item, index) => {
            const isExpanded = expandedIndex === index;
            const Icon = item.icon;
            return (
              <motion.div
                layout
                key={index}
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
                className={`p-6 border border-white/[0.05] border-glow-hover rounded-2xl bg-slate-950/20 backdrop-blur-sm cursor-pointer select-none transition-all duration-300 hover:border-accent-primary/30 ${
                  isExpanded ? 'border-accent-primary/20 bg-slate-950/40 shadow-[0_10px_30px_rgba(var(--accent-primary),0.05)]' : ''
                }`}
              >
                <motion.div layout="position" className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="w-10 h-10 grid place-items-center border border-white/[0.08] rounded-xl bg-white/[0.02] text-accent-primary">
                      <Icon size={18} />
                    </span>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white">{item.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-slate-500"
                  >
                    <ArrowRight size={18} className="rotate-45" />
                  </motion.div>
                </motion.div>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden border-t border-white/[0.06] pt-4"
                    >
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
                        {item.details}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TechStack() {
  const orbits = {
    inner: [
      { name: 'React', icon: Code2 },
      { name: 'TS', icon: Terminal },
      { name: 'Tailwind', icon: Braces },
      { name: 'HTML/CSS', icon: Globe2 }
    ],
    middle: [
      { name: 'Node.js', icon: ServerCog },
      { name: 'Express', icon: Braces },
      { name: 'MongoDB', icon: Database },
      { name: 'MySQL', icon: Database },
      { name: 'C++', icon: Code2 }
    ],
    outer: [
      { name: 'GSAP', icon: Sparkles },
      { name: 'Three.js', icon: Globe2 },
      { name: 'OpenAI', icon: BrainCircuit },
      { name: 'Git', icon: Workflow },
      { name: 'VS Code', icon: Terminal }
    ]
  };

  return (
    <section className="py-24 px-6 max-w-6xl mx-auto flex flex-col items-center" id="tech-stack">
      <div className="w-full text-center mb-16">
        <span className="text-xs uppercase tracking-widest text-accent-primary font-bold">Toolbelt</span>
        <h2 className="text-3xl sm:text-5xl font-black text-white mt-4">My Tech Stack</h2>
      </div>

      {/* Orbit visual arena */}
      <div className="orbit-container my-8 scale-90 md:scale-100 select-none">
        {/* Core center node */}
        <div 
          className="absolute z-20 w-16 h-16 rounded-full border bg-[#050505] flex items-center justify-center text-accent-primary transition-transform duration-300 hover:scale-105"
          style={{
            borderColor: 'rgb(var(--accent-primary))',
            color: 'rgb(var(--accent-primary))',
            boxShadow: '0 0 40px rgba(var(--accent-primary), 0.4)'
          }}
        >
          <span className="font-black text-sm tracking-widest">CORE</span>
        </div>

        {/* Inner orbit circle */}
        <div className="orbit-circle orbit-circle--inner">
          {orbits.inner.map((item, idx) => (
            <OrbitNode
              key={idx}
              name={item.name}
              icon={item.icon}
              index={idx}
              total={orbits.inner.length}
              radius={80} // Radius in px
              colorClass="text-accent-primary"
            />
          ))}
        </div>

        {/* Middle orbit circle */}
        <div className="orbit-circle orbit-circle--middle">
          {orbits.middle.map((item, idx) => (
            <OrbitNode
              key={idx}
              name={item.name}
              icon={item.icon}
              index={idx}
              total={orbits.middle.length}
              radius={150}
              colorClass="text-accent-secondary"
            />
          ))}
        </div>

        {/* Outer orbit circle */}
        <div className="orbit-circle orbit-circle--outer">
          {orbits.outer.map((item, idx) => (
            <OrbitNode
              key={idx}
              name={item.name}
              icon={item.icon}
              index={idx}
              total={orbits.outer.length}
              radius={220}
              colorClass="text-accent-tertiary"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function BeyondCoding() {
  return (
    <section className="py-24 px-6 max-w-6xl mx-auto" id="beyond">
      <div className="flex flex-col gap-12">
        <div>
          <span className="text-xs uppercase tracking-widest text-accent-primary font-bold">Philosophy</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white mt-4">Beyond Coding</h2>
          <p className="text-sm sm:text-base text-slate-400 mt-4 max-w-lg">The human side: what drives my logic, build focus, and learning habits.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BEYOND_CODING.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                className="p-8 border border-white/[0.05] border-glow-hover rounded-3xl bg-slate-950/20 backdrop-blur-sm transition-all hover:border-accent-primary/20 hover:bg-slate-950/40 flex flex-col gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 grid place-items-center border border-white/[0.08] rounded-xl bg-white/[0.02] text-accent-primary">
                    <Icon size={18} />
                  </span>
                  <h3 className="text-base font-bold text-white">{item.title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed mt-2">{item.description}</p>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mt-1">{item.detail}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Final() {
  const [formData, setFormData] = useState({ name: '', email: '', projectType: 'Web Application', message: '' });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('loading');
    
    try {
      const response = await fetch('http://127.0.0.1:5001/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', projectType: 'Web Application', message: '' });
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        console.error('API submission error:', data.error);
        setSubmitStatus('error');
        setTimeout(() => setSubmitStatus('idle'), 5000);
      }
    } catch (error) {
      console.error('Fetch error submitting inquiry:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  return (
    <section className="py-32 px-6 flex flex-col items-center justify-center relative overflow-hidden" id="contact">
      {/* Visual glowing nebula background inside container */}
      <div 
        className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] z-[0] w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full blur-[80px] sm:blur-[120px] pointer-events-none transition-all duration-700" 
        style={{ backgroundColor: 'rgba(var(--accent-primary), 0.1)' }}
      />

      <motion.div
        className="w-full max-w-5xl relative z-10 flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left">
          {/* Left Column: Context & Socials */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <span className="text-xs uppercase tracking-widest text-accent-primary font-bold">Developer Workspace</span>
              <h2 className="text-4xl sm:text-5xl font-black text-white leading-none tracking-tight">
                I Don't Just Build Websites. <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-secondary via-accent-primary to-accent-tertiary drop-shadow-[0_0_30px_rgba(var(--accent-primary),0.2)]">I Build Ideas.</span>
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed mt-2 font-medium">
                Have a scalable startup concept, AI workflow, or product logic to compile? Let's build a premium digital framework. I'm actively open to startup collaborations, co-founding, and MVP development.
              </p>
            </div>
            <div className="flex flex-col gap-3 font-mono text-[10px] text-slate-500 border-t border-white/[0.05] pt-6">
              <div className="flex items-center gap-2">
                <span className="text-accent-primary">EMAIL:</span>
                <a href="mailto:samyak.jain@example.com" className="hover:text-white transition-colors">samyak.jain@example.com</a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-accent-primary">LOC:</span>
                <span className="text-slate-300">IND // GMT+5:30</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-2">
              <a 
                href="https://www.linkedin.com/in/samyak-jain-173756374/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-3 border border-white/[0.05] rounded-xl bg-slate-950/20 text-slate-400 hover:text-white hover:border-accent-primary/30 hover:shadow-[0_0_15px_rgba(var(--accent-primary),0.1)] transition-all"
              >
                <Linkedin size={16} />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-3 border border-white/[0.05] rounded-xl bg-slate-950/20 text-slate-400 hover:text-white hover:border-accent-primary/30 hover:shadow-[0_0_15px_rgba(var(--accent-primary),0.1)] transition-all"
              >
                <Github size={16} />
              </a>
            </div>
          </div>

          {/* Right Column: Inquiry Form Card */}
          <div className="lg:col-span-7 w-full border border-white/[0.08] rounded-3xl bg-slate-950/40 backdrop-blur-xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
            {/* Background glow in form card */}
            <div className="absolute top-0 right-0 w-[150px] h-[150px] rounded-full bg-accent-primary/5 blur-[50px] pointer-events-none" />
            
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-5 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="form-name" className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Your Name</label>
                  <input
                    id="form-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="px-4 py-3 border border-white/[0.06] rounded-xl bg-black/40 text-white placeholder-slate-700 text-sm focus:outline-none focus:border-accent-primary/50 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="form-email" className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Email Address</label>
                  <input
                    id="form-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="px-4 py-3 border border-white/[0.06] rounded-xl bg-black/40 text-white placeholder-slate-700 text-sm focus:outline-none focus:border-accent-primary/50 transition-all"
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Project Type</label>
                <div className="flex flex-wrap gap-2">
                  {['Web Application', 'AI Automation', 'Startup Collab', 'SaaS Concept', 'Other'].map((type) => {
                    const active = formData.projectType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, projectType: type })}
                        className={`px-4 py-2 border rounded-full text-xs font-mono transition-all cursor-pointer ${
                          active
                            ? 'border-accent-primary bg-accent-primary/20 text-accent-primary shadow-[0_0_15px_rgba(var(--accent-primary),0.15)]'
                            : 'border-white/[0.06] bg-black/30 text-slate-400 hover:text-white hover:border-slate-700'
                        }`}
                        style={{
                          borderColor: active ? 'rgb(var(--accent-primary))' : undefined,
                          color: active ? 'rgb(var(--accent-primary))' : undefined
                        }}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label htmlFor="form-message" className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Project Brief</label>
                <textarea
                  id="form-message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell me about what you want to build..."
                  className="px-4 py-3 border border-white/[0.06] rounded-xl bg-black/40 text-white placeholder-slate-700 text-sm focus:outline-none focus:border-accent-primary/50 transition-all resize-none"
                />
              </div>
              
              <div className="mt-2 flex items-center justify-between gap-4">
                {submitStatus === 'success' ? (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-green-400 font-mono text-[10px]"
                  >
                    <ShieldCheck size={14} />
                    <span>Inquiry sent successfully!</span>
                  </motion.div>
                ) : submitStatus === 'error' ? (
                  <div className="text-red-400 font-mono text-[10px]">
                    Error sending inquiry.
                  </div>
                ) : (
                  <div />
                )}
                <button
                  type="submit"
                  disabled={submitStatus === 'loading'}
                  className="relative flex items-center gap-2 px-5 py-2.5 border rounded-full text-xs font-mono font-bold tracking-wider hover:text-black transition-all uppercase disabled:opacity-50 cursor-pointer"
                  style={{
                    borderColor: 'rgba(var(--accent-primary), 0.4)',
                    backgroundColor: 'rgba(var(--accent-primary), 0.2)',
                    color: 'rgb(var(--accent-primary))',
                    boxShadow: '0 0 15px rgba(var(--accent-primary), 0.1)'
                  }}
                >
                  {submitStatus === 'loading' ? 'Sending...' : 'Send Inquiry'}
                  <Send size={12} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 border-t border-white/[0.05] bg-slate-950/20 text-center px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center sm:items-start gap-1">
          <strong className="text-white text-base font-bold">Samyak Jain</strong>
          <span className="text-xs text-slate-500 font-bold">Developer • Builder • Maker</span>
        </div>
        <div className="text-[11px] text-slate-600 font-medium">
          &copy; {new Date().getFullYear()} Samyak Jain. All rights reserved. Built with Vite, React, R3F, GSAP & Tailwind v4.
        </div>
      </div>
    </footer>
  );
}

function SectionDivider() {
  return (
    <div className="w-full max-w-5xl mx-auto px-6 opacity-20 pointer-events-none">
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-accent-primary/20 to-transparent" />
    </div>
  );
}

function App() {
  const [themeKey, setThemeKey] = useState<keyof typeof THEMES>('sky');
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [content, setContent] = useState<PortfolioContent>(DEFAULT_CONTENT);
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [isLoadingContent, setIsLoadingContent] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const query = `{
          "portfolio": *[_type == "portfolio"][0] {
            heroName,
            heroTitle,
            heroBio
          },
          "projects": *[_type == "project"] | order(_createdAt asc) {
            title,
            category,
            summary,
            description,
            stack,
            github,
            demo,
            "image": image.asset->url
          }
        }`;
        console.log('Fetching content from Sanity using client:', sanityClient.config());
        const data = await sanityClient.fetch(query);
        console.log('Sanity query returned:', data);

        if (data) {
          // 1. Map portfolio content
          if (data.portfolio) {
            setContent(prev => ({
              ...prev,
              heroName: data.portfolio.heroName || prev.heroName,
              heroTitle: data.portfolio.heroTitle || prev.heroTitle,
              heroBio: data.portfolio.heroBio || prev.heroBio
            }));
          }

          // 2. Map projects list
          if (data.projects && data.projects.length > 0) {
            const mappedProjects = data.projects.map((p: any) => ({
              title: p.title,
              category: p.category,
              summary: p.summary,
              description: p.description,
              stack: p.stack || [],
              github: p.github || '',
              demo: p.demo || '',
              image: p.image || '',
              imageGlow: 'from-accent-primary/20 via-slate-950/10 to-black'
            }));
            setProjectsList(mappedProjects);
          }
        }
      } catch (err) {
        console.error('Sanity fetch failed completely:', err);
      } finally {
        setIsLoadingContent(false);
      }
    };
    fetchContent();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const currentTheme = THEMES[themeKey];
    root.style.setProperty('--bg-primary', currentTheme.bg);
    root.style.setProperty('--glow-1', currentTheme.glow1);
    root.style.setProperty('--glow-2', currentTheme.glow2);
    root.style.setProperty('--glow-3', currentTheme.glow3);
    root.style.setProperty('--accent-primary', currentTheme.accentPrimary);
    root.style.setProperty('--accent-secondary', currentTheme.accentSecondary);
    root.style.setProperty('--accent-tertiary', currentTheme.accentTertiary);
  }, [themeKey]);

  const dynamicProjects = useMemo(() => {
    if (projectsList.length > 0) {
      return projectsList;
    }
    // Fallback: If no projects are published in Sanity yet, show HexGrid Goa
    return [
      {
        title: content.projectTitle || DEFAULT_CONTENT.projectTitle,
        category: content.projectCategory || DEFAULT_CONTENT.projectCategory,
        summary: content.projectSummary || DEFAULT_CONTENT.projectSummary,
        description: content.projectDescription || DEFAULT_CONTENT.projectDescription,
        stack: content.projectStack || DEFAULT_CONTENT.projectStack,
        github: content.projectGithub || DEFAULT_CONTENT.projectGithub,
        demo: content.projectDemo || DEFAULT_CONTENT.projectDemo,
        image: content.projectImage || DEFAULT_CONTENT.projectImage,
        imageGlow: 'from-accent-primary/20 via-slate-950/10 to-black'
      }
    ];
  }, [content, projectsList]);

  return (
    <ReactLenis root>
      <StarField themeKey={themeKey} />
      <div className="noise-overlay" />
      <Navigation 
        themeKey={themeKey} 
        setThemeKey={setThemeKey} 
        onOpenTerminal={() => setIsTerminalOpen(true)} 
      />
      <main className="relative z-10 text-white selection:bg-accent-primary selection:text-black">
        <Hero 
          themeKey={themeKey} 
          onOpenTerminal={() => setIsTerminalOpen(true)} 
          content={content}
        />
        <SectionDivider />
        <WhoAmI />
        <SectionDivider />
        <CurrentlyExploring />
        <SectionDivider />
        <Journey />
        <SectionDivider />
        <FeaturedProjects projects={dynamicProjects} />
        <SectionDivider />
        <ThingsIWantToBuild />
        <SectionDivider />
        <TechStack />
        <SectionDivider />
        <BeyondCoding />
        <SectionDivider />
        <Final />
      </main>
      <Footer />
      <TerminalDrawer 
        isOpen={isTerminalOpen} 
        onClose={() => setIsTerminalOpen(false)} 
        themeKey={themeKey} 
        setThemeKey={setThemeKey} 
        content={content}
      />
    </ReactLenis>
  );
}

// ==========================================
// App Initialization
// ==========================================
createRoot(document.getElementById('root')!).render(<App />);
