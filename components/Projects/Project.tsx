'use client';

// Project.tsx - Optimized Version
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Project } from '../../types';
import './Project.css';
import ProjectDetails from './ProjectDetails';

// ============================================
// PROJECT DATA CONFIGURATION
// ============================================
const projectsData = [
  {
  id: 1,
  name: "Shifra AI",
  description: "Shifra AI is a full-stack SaaS platform that enables website owners to build, customize, and deploy intelligent voice assistants on any website using a simple script tag. Powered by Google Gemini, it combines voice recognition, natural-sounding speech synthesis, contextual AI conversations, and voice-controlled website navigation. With customizable themes, secure authentication, subscription billing, and resilient API handling, Shifra AI makes it easy to integrate interactive AI voice experiences into web applications.",
  techStack: {
    frontend: [
      "React 19",
      "Vite",
      "Tailwind CSS",
      "React Router DOM",
      "Axios",
      "Firebase",
      "React Hot Toast",
      "React Icons"
    ],
    backend: [
      "Node.js",
      "Express.js",
      "MongoDB",
      "Mongoose",
      "JWT Authentication",
      "Cookie Parser",
      "CORS",
      "Razorpay"
    ],
    ai: [
      "Google Gemini 2.5 Flash",
      "Web Speech API",
      "Speech Recognition",
      "Speech Synthesis"
    ],
    state: [
      "React Hooks",
      "JWT Cookies"
    ]
  },
  features: [
    "🔐 Google OAuth Authentication with Firebase",
    "🎙️ Real-Time Voice Recognition",
    "🧠 Intelligent AI Responses Powered by Google Gemini",
    "🗣️ Natural Text-to-Speech with Voice Selection",
    "🛠️ Custom AI Assistant Builder with Business Context",
    "🌐 One-Script Website Integration",
    "🎨 Multiple UI Themes: Dark, Light, Glass & Neon",
    "🧭 Voice-Controlled Website Navigation",
    "💳 Subscription Billing with Razorpay",
    "📊 Usage Tracking and Message Rate Limiting",
    "⚡ Circuit Breaker Pattern for API Resilience",
    "🛡️ Robust Error Handling and Retry Logic"
  ],
  image: "/assets/projects/shifra-ai.png",
  liveLink: "https://ai-voice-assistant-y7a8.onrender.com",
githubLink: "https://github.com/shivampaliwal244-ops/AI_Voice_Assistant",  gradient: "linear-gradient(135deg, #7c3aed 0%, #22c55e 100%)",
  accentColor: "#7c3aed",
  secondaryAccent: "#22c55e"
},
{
  id: 2,
  name: "🚀 Next.js 3D Portfolio Website",
  description: "A modern, interactive personal portfolio built with Next.js 16, React 19, and TypeScript, featuring a futuristic cyber/hacker-inspired UI with immersive 3D visuals, glassmorphism, and smooth animations. Showcases technical skills, projects, certifications, and professional achievements through an interactive 3D skills globe, animated particle backgrounds, and immersive project and certificate carousels. Integrates Firebase Firestore for contact form data management and EmailJS for email notifications, delivering a responsive, engaging, and feature-rich full-stack web experience. Enhanced with GSAP, Framer Motion, and Vercel Speed Insights for fluid interactions and performance monitoring.",
  techStack: {
    frontend: [
      "Next.js 16.2.9",
      "React 19.2.4",
      "TypeScript 5",
      "Tailwind CSS 4",
      "Three.js 0.184.0",
      "@react-three/fiber 9.6.1",
      "@react-three/drei 10.7.7",
      "Swiper 12.2.0",
      "GSAP 3.15.0",
      "Framer Motion 12.40.0",
      "react-icons 5.6.0",
      "react-router-dom 7.17.0",
      "react-scroll 1.9.3",
      "react-simple-typewriter 5.0.1",
      "@gsap/react 2.1.2",
      "@tsparticles/react 4.1.3",
      "@tsparticles/slim 4.1.3",
      "vanilla-tilt 1.8.1",
      "@fortawesome/react-fontawesome 3.3.1"
    ],
    backend: [
      "Firebase 12.14.0",
      "Firebase Firestore",
      "EmailJS 4.4.1"
    ],
    ai: [],
    state: [
      "React Hooks",
      "React Context"
    ]
  },
  features: [
    "🌐 Interactive 3D Skills Globe with Raycasting",
    "✨ Immersive Three.js Particle Background",
    "🎨 Futuristic Cyber/Hacker UI with Glassmorphism",
    "📜 Dynamic Certificate Carousel with Coverflow Effect",
    "🎠 Interactive 3D Project Carousel with Auto-Play",
    "👆 Touch Gestures for Seamless Mobile Navigation",
    "⌨️ Terminal-Inspired Typing Animations",
    "📬 Firebase Firestore-Powered Contact Form",
    "📧 Automated Email Notifications via EmailJS",
    "📱 Fully Responsive, Mobile-First Design",
    "🎬 Smooth GSAP and Framer Motion Animations",
    "⌨️ Keyboard Navigation and Accessibility Support",
    "⚡ Vercel Speed Insights for Performance Monitoring",
    "💎 Modern UI with Smooth Transitions and Micro-Interactions"
  ],
    image: "/assets/projects/ai-website-builders.png",
liveLink: "https://shivam-ai-web-developer-ten-tawny.vercel.app/",
githubLink: "https://github.com/shivampaliwal244-ops/portfolio",  gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  accentColor: "#667eea",
  secondaryAccent: "#764ba2"
},
  
{
  id: 3,
  name: "EstateIQ — Real Estate Intelligence Platform",
  description:
    "An AI-powered real estate analytics platform that predicts property prices using machine learning and provides interactive tools for property comparison, what-if analysis, prediction explanations, and model monitoring. Features Firebase-powered email/password authentication and Google OAuth sign-in, with a responsive Streamlit interface deployed on Streamlit Community Cloud.",

  techStack: {
    frontend: ["Streamlit", "Custom CSS"],
    backend: ["Python", "Streamlit"],
    database: ["Firebase Authentication", "SQLite"],
    ai: [
      "Machine Learning",
      "Property Price Prediction",
      "Model Explainability",
      "Model Monitoring"
    ],
    tools: [
      "Pandas",
      "NumPy",
      "Scikit-learn",
      "Git",
      "GitHub"
    ],
    authentication: [
      "Firebase Authentication",
      "Google OAuth",
      "Email/Password Authentication"
    ]
  },

  features: [
    "🏡 ML-Powered Property Price Prediction",
    "📊 Interactive Real Estate Dashboard",
    "⚖️ Compare Multiple Properties",
    "🎛️ What-If Price Simulator",
    "🔍 Explainable Predictions",
    "📈 Model Performance Analytics",
    "🩺 Model Monitoring",
    "🔐 Firebase Email/Password Authentication",
    "🌐 Google Sign-In",
    "📝 Prediction History",
    "🤖 Model & Data Assistant",
    "☁️ Streamlit Cloud Deployment",
    "📱 Responsive User Interface"
  ],

  image: "/assets/projects/estateiq.png",

  liveLink: "https://estateiq-property-ai.streamlit.app/",

  githubLink: "https://github.com/shivampaliwal244-ops/estateiq",

  gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  accentColor: "#667eea",
  secondaryAccent: "#764ba2"
},

{
  id: 3,
  name: "YouTube Clone — Video Streaming Platform",

  description:
    "A full-stack YouTube-inspired video streaming platform that integrates the YouTube Data API v3 to fetch real-time video content, search results, and category-based recommendations. Built with React and Vite on the frontend and Node.js with Express on the backend. Features video playback through the official YouTube IFrame Player, dynamic search, category browsing, related video suggestions, JWT-based authentication, and MongoDB-powered user data and comments. Deployed on Render.",

  techStack: {
    frontend: [
      "React.js",
      "Vite",
      "JavaScript",
      "CSS3",
      "Responsive UI"
    ],

    backend: [
      "Node.js",
      "Express.js",
      "REST API"
    ],

    database: [
      "MongoDB Atlas",
      "Mongoose"
    ],

    api: [
      "YouTube Data API v3",
      "YouTube IFrame Player API"
    ],

    authentication: [
      "JWT Authentication",
      "Protected Routes",
      "Role-Based Ownership Validation"
    ],

    tools: [
      "Axios / Fetch API",
      "Git",
      "GitHub",
      "VS Code",
      "Postman",
      "Render"
    ]
  },

  features: [
    "🎬 Real-Time YouTube Video Feed",
    "🔍 Dynamic Video Search",
    "📂 Category-Based Video Browsing",
    "▶️ YouTube Video Playback Integration",
    "🎯 Related & Suggested Videos",
    "📄 API-Based Video Pagination",
    "🔐 JWT-Based User Authentication",
    "💬 Add, Edit & Delete Comments",
    "🛡️ Protected Comment Operations",
    "📚 MongoDB-Powered Video Library",
    "👍 Like & Dislike UI Interactions",
    "📺 Subscription UI",
    "🌙 YouTube-Inspired Dark Theme",
    "📱 Responsive User Interface",
    "⚡ Loading, Empty & Error States",
    "☁️ Frontend & Backend Deployment on Render"
  ],

  image: "/assets/projects/youtube-clone.png",

  liveLink: "https://youtube-clone-fronted.onrender.com/",

  githubLink: "https://github.com/shivampaliwal244-ops/youtube_clone",

  gradient: "linear-gradient(135deg, #91ff00 0%, #21a30d98 100%)",
  accentColor: "#00f7ff",
  secondaryAccent: "#65710bcf"
}
];

const Projects = () => {
  const [activeIndex, setActiveIndex] = useState(2);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // FIX: Hydration-free particle states
  const [backgroundParticles, setBackgroundParticles] = useState<Array<{key: number; delay: string; x: string; duration: string; size: string}>>([]);
  const particlesInitialized = useRef(false);

  const sliderRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const autoSlideRef = useRef<NodeJS.Timeout | null>(null);

  // FIX: Generate particles ONLY on the client
  useEffect(() => {
    if (!particlesInitialized.current) {
      setBackgroundParticles([...Array(10)].map((_, i) => ({
        key: i,
        delay: `${Math.random() * 10}s`,
        x: `${Math.random() * 100}%`,
        duration: `${Math.random() * 20 + 15}s`,
        size: `${Math.random() * 3 + 1}px`
      })));
      particlesInitialized.current = true;
    }
  }, []);

  useEffect(() => {
    if (isPopupOpen) return;
    autoSlideRef.current = setInterval(() => {
      if (!isTransitioning) {
        setIsTransitioning(true);
        setActiveIndex((prev) => (prev + 1) % projectsData.length);
        setTimeout(() => setIsTransitioning(false), 500);
      }
    }, 5000);
    return () => { if (autoSlideRef.current) clearInterval(autoSlideRef.current); };
  }, [isPopupOpen, isTransitioning]);

  const navigateSlider = useCallback((direction: string) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    if (direction === 'prev') {
      setActiveIndex((prev) => (prev - 1 + projectsData.length) % projectsData.length);
    } else {
      setActiveIndex((prev) => (prev + 1) % projectsData.length);
    }
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  const openPopup = (project: Project) => {
    setSelectedProject(project);
    setIsPopupOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPopupOpen) {
        if (e.key === 'Escape') closePopup();
        return;
      }
      if (e.key === 'ArrowLeft') navigateSlider('prev');
      if (e.key === 'ArrowRight') navigateSlider('next');
      if (e.key === 'Enter') openPopup(projectsData[activeIndex]);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, isPopupOpen, navigateSlider]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].pageX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].pageX;
    const diff = touchStartX.current - endX;
    if (Math.abs(diff) > 50) {
      navigateSlider(diff > 0 ? 'next' : 'prev');
    }
  };

  const getCardStyle = (index: number) => {
    const diff = index - activeIndex;
    const absDiv = Math.abs(diff);
    let translateX = diff * 280;
    const scale = absDiv === 0 ? 1.1 : Math.max(0.7, 1 - absDiv * 0.15);
    const opacity = Math.max(0.3, 1 - absDiv * 0.3);
    const zIndex = 10 - absDiv;
    let rotateY = diff * -15;
    if (diff > 2) { translateX = (diff - projectsData.length) * 280; rotateY = (diff - projectsData.length) * -15; }
    else if (diff < -2) { translateX = (diff + projectsData.length) * 280; rotateY = (diff + projectsData.length) * -15; }
    return { transform: `translateX(${translateX}px) rotateY(${rotateY}deg) scale(${scale})`, opacity, zIndex };
  };

  return (
    <section className="projects-section" id="projects">
      <div className="projects-bg">
        <div className="bg-gradient-orb orb-1"></div>
        <div className="bg-gradient-orb orb-2"></div>
        <div className="bg-grid"></div>
        <div className="bg-particles">
          {backgroundParticles.map((p) => (
            <span key={p.key} className="bg-particle" style={{ '--delay': p.delay, '--x': p.x, '--duration': p.duration, '--size': p.size } as React.CSSProperties} />
          ))}
        </div>
      </div>

      <div className="projects-header">
        <span className="section-badge cyber-badge">
          <span className="badge-dot"></span>
          <span className="badge-text cyber-badge-text">Featured Work</span>
        </span>

        <h2 className="section-title cyber-title">
          <span className="title-line cyber-title-line">My</span>
          <span className="gradient-text cyber-gradient-text">Projects</span>
        </h2>

        <p className="section-subtitle cyber-subtitle">
          Explore my latest work showcasing modern web development, AI integration, and full-stack expertise
        </p>

        <div className="header-decoration">
          <span className="deco-line"></span>
          <span className="deco-diamond"></span>
          <span className="deco-line"></span>
        </div>
      </div>

      <div className="slider-container" ref={sliderRef} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <div className="slider-track">
          {projectsData.map((project, index) => {
            const isActive = index === activeIndex;
            const cardStyle = getCardStyle(index);
            return (
              
<div
  key={`${project.id}-${index}`}
  className={`project-card ${isActive ? 'active' : ''}`}
  style={{
    ...cardStyle,
    '--accent-color': project.accentColor,
    '--secondary-accent': project.secondaryAccent,
    '--card-gradient': project.gradient,
  } as React.CSSProperties}
  onClick={() => isActive && openPopup(project)}
>

                <div className="card-glass">
                  {isActive && <div className="neon-border"></div>}
                  <div className="card-image-wrapper">
                    <div className="card-image-gradient" style={{ background: project.gradient } as React.CSSProperties} />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={project.image} alt={project.name} className="card-image" loading="lazy" />
                    {isActive && (
                      <div className="image-overlay"><span className="view-project-btn"><span>View Details</span></span></div>
                    )}
                  </div>
                  <div className="card-tech-stack">
                    {Object.values(project.techStack).flat().slice(0, 4).map((tech, i) => (<span key={i} className="tech-pill">{tech}</span>))}
                  </div>
                  {isActive && <div className="card-shine"></div>}
                </div>
                <div className="card-name-wrapper"><h3 className="card-name">{project.name}</h3><div className="name-underline" style={{ background: project.gradient }} /></div>
              </div>
            );
          })}
        </div>
        <button className="slider-nav prev" onClick={() => navigateSlider('prev')} aria-label="Previous project">←</button>
        <button className="slider-nav next" onClick={() => navigateSlider('next')} aria-label="Next project">→</button>
      </div>

      <div className="slider-pagination">
        {projectsData.map((project, index) => (
          <button key={index} className={`pagination-dot ${index === activeIndex ? 'active' : ''}`} onClick={() => !isTransitioning && setActiveIndex(index)} style={{ '--dot-color': project.accentColor } as React.CSSProperties}><span className="dot-inner"></span></button>
        ))}
        <div className="pagination-progress"><div className="progress-fill" style={{ width: `${((activeIndex + 1) / projectsData.length) * 100}%`, background: projectsData[activeIndex].gradient } as React.CSSProperties} /></div>
      </div>

      {isPopupOpen && selectedProject && (
        <ProjectDetails project={selectedProject} onClose={closePopup} />
      )}
    </section>
  );
};

export default Projects;
