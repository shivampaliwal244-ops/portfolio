'use client';

// Project.tsx - Optimized Version
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';





import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import './Project.css';

// ============================================
// PROJECT DATA CONFIGURATION
// Edit this array to add/remove/modify projects
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

// ============================================
// MAIN PROJECTS COMPONENT - OPTIMIZED
// ============================================
const Projects = () => {
  // State management
  const [activeIndex, setActiveIndex] = useState(2);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Refs
  const sliderRef = useRef(null);
  const touchStartX = useRef(0);
  const autoSlideRef = useRef(null);

  // ============================================
  // MEMOIZED PARTICLES - Reduced count for performance
  // ============================================
  const backgroundParticles = useMemo(() => (
    [...Array(10)].map((_, i) => ({
      key: i,
      delay: `${Math.random() * 10}s`,
      x: `${Math.random() * 100}%`,
      duration: `${Math.random() * 20 + 15}s`,
      size: `${Math.random() * 3 + 1}px`
    }))
  ), []);

  const popupParticles = useMemo(() => (
    [...Array(15)].map((_, i) => ({
      key: i,
      delay: `${Math.random() * 5}s`,
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      size: `${Math.random() * 4 + 2}px`,
      duration: `${Math.random() * 4 + 3}s`
    }))
  ), []);

  // ============================================
  // SMOOTH AUTO-SLIDE with RAF
  // ============================================
  useEffect(() => {
    if (isPopupOpen) return;

    autoSlideRef.current = setInterval(() => {
      if (!isTransitioning) {
        setIsTransitioning(true);
        setActiveIndex((prev) => (prev + 1) % projectsData.length);
        // Reset transition lock after animation completes
        setTimeout(() => setIsTransitioning(false), 500);
      }
    }, 5000);

    return () => clearInterval(autoSlideRef.current);
  }, [isPopupOpen, isTransitioning]);

  // ============================================
  // KEYBOARD NAVIGATION - Optimized with useCallback
  // ============================================
  const navigateSlider = useCallback((direction) => {
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
    const handleKeyDown = (e) => {
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

  // ============================================
  // POPUP FUNCTIONS - Optimized
  // ============================================
  const openPopup = useCallback((project) => {
    setSelectedProject(project);
    setIsPopupOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closePopup = useCallback(() => {
    setIsPopupOpen(false);
    // Delay clearing selected project for exit animation
    setTimeout(() => setSelectedProject(null), 300);
    document.body.style.overflow = 'auto';
  }, []);

  // ============================================
  // TOUCH HANDLERS - Simplified for smooth swiping
  // ============================================
  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].pageX;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    const endX = e.changedTouches[0].pageX;
    const diff = touchStartX.current - endX;
    
    // Minimum swipe distance threshold
    if (Math.abs(diff) > 50) {
      navigateSlider(diff > 0 ? 'next' : 'prev');
    }
  }, [navigateSlider]);

  // ============================================
  // CARD STYLE CALCULATOR - Simplified transforms
  // ============================================
  const getCardStyle = useCallback((index) => {
    const diff = index - activeIndex;
    const absDiv = Math.abs(diff);
    
    // Simplified positioning for smoother animations
    let translateX = diff * 280;
    let scale = absDiv === 0 ? 1.1 : Math.max(0.7, 1 - absDiv * 0.15);
    let opacity = Math.max(0.3, 1 - absDiv * 0.3);
    let zIndex = 10 - absDiv;
    let rotateY = diff * -15;

    // Handle wrap-around
    if (diff > 2) {
      translateX = (diff - projectsData.length) * 280;
      rotateY = (diff - projectsData.length) * -15;
    } else if (diff < -2) {
      translateX = (diff + projectsData.length) * 280;
      rotateY = (diff + projectsData.length) * -15;
    }

    return {
      transform: `translateX(${translateX}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex
    };
  }, [activeIndex]);

  // ============================================
  // RENDER
  // ============================================
  return (
    <section className="projects-section" id="projects">
      {/* ============================================
          BACKGROUND - Simplified for performance
          ============================================ */}
      <div className="projects-bg">
        {/* Gradient orbs - reduced complexity */}
        <div className="bg-gradient-orb orb-1"></div>
        <div className="bg-gradient-orb orb-2"></div>
        
        {/* Grid pattern */}
        <div className="bg-grid"></div>
        
        {/* Reduced particle count */}
        <div className="bg-particles">
          {backgroundParticles.map((p) => (
            <span 
              key={p.key} 
              className="bg-particle"
              style={{
                '--delay': p.delay,
                '--x': p.x,
                '--duration': p.duration,
                '--size': p.size
              }}
            />
          ))}
        </div>
      </div>

      {/* ============================================
          SECTION HEADER
          ============================================ */}
      <div className="projects-header">
        <span className="section-badge">
          <span className="badge-dot"></span>
          <span className="badge-text">Featured Work</span>
        </span>
        
        <h2 className="section-title">
          <span className="title-line">My</span>
          <span className="gradient-text">Projects</span>
        </h2>
        
        <p className="section-subtitle">
          Explore my latest work showcasing modern web development, 
          AI integration, and full-stack expertise
        </p>
        
        <div className="header-decoration">
          <span className="deco-line"></span>
          <span className="deco-diamond"></span>
          <span className="deco-line"></span>
        </div>
      </div>

      {/* ============================================
          3D SLIDER - Optimized transforms
          ============================================ */}
      <div 
        className="slider-container"
        ref={sliderRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="slider-track">
          {projectsData.map((project, index) => {
            const isActive = index === activeIndex;
            const cardStyle = getCardStyle(index);
            
            return (
              <div
                key={project.id}
                className={`project-card ${isActive ? 'active' : ''}`}
                style={{
                  ...cardStyle,
                  '--accent-color': project.accentColor,
                  '--secondary-accent': project.secondaryAccent,
                  '--card-gradient': project.gradient
                }}
                onClick={() => isActive && openPopup(project)}
              >
                {/* Glass Card */}
                <div className="card-glass">
                  {/* Glow border - only on active */}
                  {isActive && <div className="neon-border"></div>}
                  
                  {/* Card Image */}
                  <div className="card-image-wrapper">
                    <div 
                      className="card-image-gradient"
                      style={{ background: project.gradient }}
                    />
                    <img 
                      src={project.image} 
                      alt={project.name}
                      className="card-image"
                      loading="lazy"
                    />
                    
                    {/* Hover overlay - only on active */}
                    {isActive && (
                      <div className="image-overlay">
                        <span className="view-project-btn">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>View Details</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Tech Pills */}
                  <div className="card-tech-stack">
                    {Object.values(project.techStack).flat().slice(0, 4).map((tech, i) => (
                      <span key={i} className="tech-pill">{tech}</span>
                    ))}
                  </div>

                  {/* Shine effect - only on active */}
                  {isActive && <div className="card-shine"></div>}
                </div>

                {/* Project Name */}
                <div className="card-name-wrapper">
                  <h3 className="card-name">{project.name}</h3>
                  <div 
                    className="name-underline"
                    style={{ background: project.gradient }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        <button 
          className="slider-nav prev"
          onClick={() => navigateSlider('prev')}
          aria-label="Previous project"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          className="slider-nav next"
          onClick={() => navigateSlider('next')}
          aria-label="Next project"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* ============================================
          PAGINATION DOTS
          ============================================ */}
      <div className="slider-pagination">
        {projectsData.map((project, index) => (
          <button
            key={index}
            className={`pagination-dot ${index === activeIndex ? 'active' : ''}`}
            onClick={() => !isTransitioning && setActiveIndex(index)}
            aria-label={`Go to project ${index + 1}`}
            style={{ '--dot-color': project.accentColor }}
          >
            <span className="dot-inner"></span>
            {index === activeIndex && <span className="dot-ring"></span>}
          </button>
        ))}
        
        {/* Progress bar */}
        <div className="pagination-progress">
          <div 
            className="progress-fill"
            style={{ 
              width: `${((activeIndex + 1) / projectsData.length) * 100}%`,
              background: projectsData[activeIndex].gradient
            }}
          />
        </div>
      </div>

      {/* ============================================
          POPUP MODAL - Optimized scroll and animations
          ============================================ */}
      {isPopupOpen && selectedProject && (
        <div className="popup-overlay" onClick={closePopup}>
          <div 
            className="popup-container" 
            onClick={(e) => e.stopPropagation()}
            style={{
              '--popup-accent': selectedProject.accentColor,
              '--popup-secondary': selectedProject.secondaryAccent,
              '--popup-gradient': selectedProject.gradient
            }}
          >
            {/* Animated border glow */}
            <div className="popup-border-glow"></div>
            
            {/* Reduced particles */}
            <div className="magic-dust">
              {popupParticles.map((p) => (
                <span 
                  key={p.key} 
                  className="dust-particle"
                  style={{
                    '--delay': p.delay,
                    '--x': p.x,
                    '--y': p.y,
                    '--size': p.size,
                    '--duration': p.duration,
                    '--color': selectedProject.accentColor
                  }}
                />
              ))}
            </div>

            {/* Close Button */}
            <button className="popup-close" onClick={closePopup}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Scrollable Content */}
            <div className="popup-content">
              {/* Header */}
              <div className="popup-header">
                <div 
                  className="popup-icon"
                  style={{ background: selectedProject.gradient }}
                >
                  <span className="icon-emoji">🚀</span>
                </div>
                <div className="popup-title-wrapper">
                  <h2 className="popup-title">{selectedProject.name}</h2>
                  <span 
                    className="title-accent-line" 
                    style={{ background: selectedProject.gradient }}
                  />
                </div>
              </div>

              {/* Project Image */}
              <div className="popup-image-section">
                <div className="popup-image-wrapper">
                  <img 
                    src={selectedProject.image} 
                    alt={selectedProject.name}
                    className="popup-image"
                  />
                  <div className="image-gloss-overlay"></div>
                </div>
              </div>

              {/* Description */}
              <div className="popup-section">
                <h3 className="popup-section-title">
                  <span className="section-icon">🧠</span>
                  <span className="section-text">Description</span>
                  <span className="section-line"></span>
                </h3>
                <p className="popup-description">{selectedProject.description}</p>
              </div>

              {/* Tech Stack */}
              <div className="popup-section">
                <h3 className="popup-section-title">
                  <span className="section-icon">⚙️</span>
                  <span className="section-text">Tech Stack</span>
                  <span className="section-line"></span>
                </h3>
                <div className="tech-stack-grid">
                  {Object.entries(selectedProject.techStack).map(([category, techs]) => (
                    <div key={category} className="tech-category">
                      <span className="category-label">
                        <span className="label-dot"></span>
                        {category}
                      </span>
                      <div className="category-techs">
                        {techs.map((tech, i) => (
                          <span 
                            key={i} 
                            className="tech-tag"
                            style={{ '--accent': selectedProject.accentColor }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="popup-section">
                <h3 className="popup-section-title">
                  <span className="section-icon">🔥</span>
                  <span className="section-text">Features</span>
                  <span className="section-line"></span>
                </h3>
                <div className="features-grid">
                  {selectedProject.features.map((feature, i) => (
                    <div key={i} className="feature-item">
                      <span className="feature-text">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="popup-actions">
                <a 
                  href={selectedProject.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-btn live-btn"
                  style={{ '--gradient': selectedProject.gradient }}
                >
                  <FaExternalLinkAlt className="btn-icon" />
                  <span className="btn-text">Live Demo</span>
                  <span className="btn-arrow">→</span>
                </a>
                <a 
                  href={selectedProject.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-btn github-btn"
                >
                  <FaGithub className="btn-icon" />
                  <span className="btn-text">View Code</span>
                  <span className="btn-arrow">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;



