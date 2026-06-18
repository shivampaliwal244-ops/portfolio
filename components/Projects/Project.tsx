'use client';

// Project.tsx - Optimized Version
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import './Project.css';

// ============================================
// PROJECT DATA CONFIGURATION
// ============================================
const projectsData = [
  {
    id: 1,
    name: "AI Study Planner App",
    description: "A smart AI-powered study planning application built using Flutter and Firebase. This app helps students organize their daily study schedule, track progress, and receive intelligent suggestions based on their learning patterns.",
    techStack: {
      frontend: ["Flutter"],
      backend: ["Firebase"],
      ai: ["Gemini API", "OpenAI API"],
      state: ["Provider", "Riverpod"]
    },
    features: [
      "🔐 User Authentication",
      "📅 AI Study Schedule Generator",
      "✅ Task Management",
      "📊 Progress Tracking",
      "🤖 Smart AI Suggestions",
      "🔔 Push Notifications",
      "☁️ Cloud Sync",
      "🎯 Modern UI"
    ],
    image: "/assets/projects/ai-study-planner.png",
    liveLink: "[google.com](https://google.com)",
    githubLink: "[github.com](https://github.com)",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    accentColor: "#667eea",
    secondaryAccent: "#764ba2"
  },
  {
    id: 2,
    name: "Full Stack Developer Hub",
    description: "A modern full-stack web application built using React.js that showcases developer tools, project management features, and real-time data handling.",
    techStack: {
      frontend: ["React.js", "Tailwind CSS", "GSAP"],
      backend: ["Node.js", "Express.js"],
      database: ["MongoDB"],
      auth: ["JWT"]
    },
    features: [
      "🔐 User Authentication",
      "📁 Project Dashboard",
      "📊 Real-time Data",
      "🎨 Glass Effect UI",
      "⚡ Smooth Animations",
      "🌍 3D Elements",
      "📱 Responsive Design",
      "🔎 Search & Filter"
    ],
    image: "/assets/projects/fullstack-hub.png",
    liveLink: "[google.com](https://google.com)",
    githubLink: "[github.com](https://github.com)",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    accentColor: "#f5576c",
    secondaryAccent: "#f093fb"
  },
  {
    id: 3,
    name: "AI Website Builder SaaS",
    description: "An AI-powered website builder platform that allows users to generate fully responsive websites using simple prompts with subscription-based access.",
    techStack: {
      frontend: ["React.js", "Tailwind CSS"],
      backend: ["Node.js", "Express.js"],
      database: ["MongoDB"],
      ai: ["OpenAI API"]
    },
    features: [
      "🤖 Prompt → Website",
      "🎨 Auto Layout",
      "📝 Content Generation",
      "💳 Stripe Payments",
      "🔐 JWT Auth",
      "📁 User Dashboard",
      "🎨 Drag & Drop",
      "🚀 One-click Deploy"
    ],
    image: "/assets/projects/ai-website-builder.png",
    liveLink: "[google.com](https://google.com)",
    githubLink: "[github.com](https://github.com)",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    accentColor: "#4facfe",
    secondaryAccent: "#00f2fe"
  },
  {
    id: 4,
    name: "Amazon Clone E-commerce",
    description: "A full-stack e-commerce web application inspired by Amazon, built using the MERN stack with secure payments and order management.",
    techStack: {
      frontend: ["React.js", "Redux Toolkit"],
      backend: ["Node.js", "Express.js"],
      database: ["MongoDB"],
      payment: ["Stripe"]
    },
    features: [
      "🔍 Product Search",
      "🛍️ Cart & Wishlist",
      "🧾 Order Tracking",
      "💳 Stripe Checkout",
      "🧑‍💻 Admin Panel",
      "⭐ Reviews",
      "📊 Analytics",
      "📱 Responsive"
    ],
    image: "/assets/projects/amazon-clone.png",
    liveLink: "[google.com](https://google.com)",
    githubLink: "[github.com](https://github.com)",
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    accentColor: "#fa709a",
    secondaryAccent: "#fee140"
  },
  {
    id: 5,
    name: "NoteNest API",
    description: "NoteNest API is a RESTful backend application built using Node.js and Express that allows users to create, manage, update, and delete notes efficiently.",
    techStack: {
      backend: ["Node.js", "Express.js"],
      database: ["MongoDB"],
      orm: ["Mongoose"],
      tools: ["Postman"]
    },
    features: [
      "📝 Create Notes",
      "📖 Fetch All Notes",
      "✏️ Update Notes",
      "🗑️ Delete Notes",
      "⚡ RESTful API",
      "🧩 Clean Structure",
      "🔄 JSON Handling",
      "📚 API Docs"
    ],
    image: "/assets/projects/notenest-api.png",
    liveLink: "[google.com](https://google.com)",
    githubLink: "[github.com](https://github.com)",
    gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    accentColor: "#a8edea",
    secondaryAccent: "#fed6e3"
  }
];

const Projects = () => {
  const [activeIndex, setActiveIndex] = useState(2);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // FIX: Hydration-free particle states
  const [backgroundParticles, setBackgroundParticles] = useState<any[]>([]);
  const [popupParticles, setPopupParticles] = useState<any[]>([]);
  
  const sliderRef = useRef(null);
  const touchStartX = useRef(0);
  const autoSlideRef = useRef<NodeJS.Timeout | null>(null);

  // FIX: Generate particles ONLY on the client
  useEffect(() => {
    setBackgroundParticles([...Array(10)].map((_, i) => ({
      key: i,
      delay: `${Math.random() * 10}s`,
      x: `${Math.random() * 100}%`,
      duration: `${Math.random() * 20 + 15}s`,
      size: `${Math.random() * 3 + 1}px`
    })));

    setPopupParticles([...Array(15)].map((_, i) => ({
      key: i,
      delay: `${Math.random() * 5}s`,
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      size: `${Math.random() * 4 + 2}px`,
      duration: `${Math.random() * 4 + 3}s`
    })));
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

  const openPopup = useCallback((project: any) => {
    setSelectedProject(project);
    setIsPopupOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closePopup = useCallback(() => {
    setIsPopupOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
    document.body.style.overflow = 'auto';
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].pageX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const endX = e.changedTouches[0].pageX;
    const diff = touchStartX.current - endX;
    if (Math.abs(diff) > 50) {
      navigateSlider(diff > 0 ? 'next' : 'prev');
    }
  }, [navigateSlider]);

  const getCardStyle = useCallback((index: number) => {
    const diff = index - activeIndex;
    const absDiv = Math.abs(diff);
    let translateX = diff * 280;
    let scale = absDiv === 0 ? 1.1 : Math.max(0.7, 1 - absDiv * 0.15);
    let opacity = Math.max(0.3, 1 - absDiv * 0.3);
    let zIndex = 10 - absDiv;
    let rotateY = diff * -15;
    if (diff > 2) { translateX = (diff - projectsData.length) * 280; rotateY = (diff - projectsData.length) * -15; } 
    else if (diff < -2) { translateX = (diff + projectsData.length) * 280; rotateY = (diff + projectsData.length) * -15; }
    return { transform: `translateX(${translateX}px) rotateY(${rotateY}deg) scale(${scale})`, opacity, zIndex };
  }, [activeIndex]);

  return (
    <section className="projects-section" id="projects">
      <div className="projects-bg">
        <div className="bg-gradient-orb orb-1"></div>
        <div className="bg-gradient-orb orb-2"></div>
        <div className="bg-grid"></div>
        <div className="bg-particles">
          {backgroundParticles.map((p) => (
            <span key={p.key} className="bg-particle" style={{ '--delay': p.delay, '--x': p.x, '--duration': p.duration, '--size': p.size } as any} />
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
              <div key={project.id} className={`project-card ${isActive ? 'active' : ''}`} style={{ ...cardStyle, '--accent-color': project.accentColor, '--secondary-accent': project.secondaryAccent, '--card-gradient': project.gradient } as any} onClick={() => isActive && openPopup(project)}>
                <div className="card-glass">
                  {isActive && <div className="neon-border"></div>}
                  <div className="card-image-wrapper">
                    <div className="card-image-gradient" style={{ background: project.gradient }} />
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
          <button key={index} className={`pagination-dot ${index === activeIndex ? 'active' : ''}`} onClick={() => !isTransitioning && setActiveIndex(index)} style={{ '--dot-color': project.accentColor } as any}><span className="dot-inner"></span></button>
        ))}
        <div className="pagination-progress"><div className="progress-fill" style={{ width: `${((activeIndex + 1) / projectsData.length) * 100}%`, background: projectsData[activeIndex].gradient }} /></div>
      </div>

      {isPopupOpen && selectedProject && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-container" onClick={(e) => e.stopPropagation()} style={{ '--popup-accent': selectedProject.accentColor, '--popup-gradient': selectedProject.gradient } as any}>
            <div className="popup-border-glow"></div>
            <div className="magic-dust">
              {popupParticles.map((p) => <span key={p.key} className="dust-particle" style={{ '--delay': p.delay, '--x': p.x, '--y': p.y, '--size': p.size, '--duration': p.duration, '--color': selectedProject.accentColor } as any} />)}
            </div>
            <button className="popup-close" onClick={closePopup}>×</button>
            <div className="popup-content">
              <div className="popup-header"><h2 className="popup-title">{selectedProject.name}</h2></div>
              <img src={selectedProject.image} alt={selectedProject.name} className="popup-image" />
              <p className="popup-description">{selectedProject.description}</p>
              <div className="popup-actions">
                <a href={selectedProject.liveLink} target="_blank" className="action-btn live-btn">Live Demo</a>
                <a href={selectedProject.githubLink} target="_blank" className="action-btn github-btn">View Code</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;
