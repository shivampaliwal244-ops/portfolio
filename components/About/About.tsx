'use client';

// ============================================
// ABOUT COMPONENT - PROFESSIONAL PORTFOLIO
// ============================================
// 
// TABLE OF CONTENTS:
// 1. Imports
// 2. Component Definition
// 3. Refs & State
// 4. Skills Data (EDITABLE)
// 5. Personal Info Data (EDITABLE)
// 6. About Me Text (EDITABLE)
// 7. Effects (Glitter, 3D Tilt, Smoke, Auto-slide)
// 8. Event Handlers
// 9. Memoized Elements (Bubbles, Stars)
// 10. Helper Functions
// 11. JSX Render
//
// ============================================

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import './About.css';

const About = () => {
  // ============================================
  // 3. REFS & STATE
  // ============================================
  
  // Ref for the name element (glitter effect)
  const nameRef = useRef(null);
  
  // Ref for profile card (3D tilt effect)
  const profileCardRef = useRef(null);
  
  // Ref for about text container (smoke effect)
  const aboutTextRef = useRef(null);
  
  // Currently active skill category index
  const [activeSkillCategory, setActiveSkillCategory] = useState(0);
  
  // Online status indicator - can be made dynamic
  const [isOnline] = useState(true);
  
  // Auto-slide toggle for skills carousel
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  // Skills section visibility state - hidden by default
  const [isSkillsRevealed, setIsSkillsRevealed] = useState(false);
  
  // ============================================
  // 4. SKILLS DATA - EDIT YOUR SKILLS HERE
  // ============================================
  // Each skill category has:
  // - id: unique identifier
  // - icon: emoji icon
  // - title: category name
  // - color: accent color (hex)
  // - items: array of skill names
  // ============================================
  
  const skills = useMemo(() => [
    {
      id: 'frontend',
      icon: '🚀',
      title: 'Frontend Development',
      color: '#00d4ff', // Cyan
      items: ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Next.js', 'Tailwind CSS']
    },
    {
      id: 'animation',
      icon: '✨',
      title: 'Animation & Design',
      color: '#f472b6', // Pink
      items: ['GSAP', 'Three.js', 'UI/UX', 'Framer Motion', 'CSS Animations', 'SVG Animation']
    },
    {
      id: 'backend',
      icon: '⚙️',
      title: 'Backend Development',
      color: '#a855f7', // Purple
      items: ['Node.js', 'Express.js', 'Java', 'REST APIs', 'Firebase', 'Authentication']
    },
    {
      id: 'database',
      icon: '🗄️',
      title: 'Database',
      color: '#10b981', // Emerald
      items: ['SQL', 'PostgreSQL', 'MongoDB', 'Firebase Realtime DB', 'DBMS Concepts']
    },
    {
      id: 'aiml',
      icon: '🤖',
      title: 'AI / ML',
      color: '#f59e0b', // Amber
      items: ['Python', 'Scikit-learn', 'TensorFlow', 'Data Analysis', 'Machine Learning']
    },
    {
      id: 'tools',
      icon: '🛠️',
      title: 'Tools & Others',
      color: '#ef4444', // Red
      items: ['Git', 'GitHub', 'VS Code', 'Figma', 'Postman', 'npm']
    }
  ], []);

  // ============================================
  // 5. PERSONAL INFO DATA - EDIT YOUR INFO HERE
  // ============================================
  // Each info item has:
  // - label: field label (uppercase)
  // - value: field value
  // - icon: emoji icon
  // - color: accent color (hex)
  // ============================================
  
  const personalInfo = useMemo(() => [
    { label: 'NAME', value: 'Shivam Paliwal', icon: '👤', color: '#00d4ff' },
    { label: 'AGE', value: '21 Years', icon: '🎂', color: '#a855f7' },
    { label: 'LOCATION', value: 'Gujarat, India', icon: '📍', color: '#10b981' },
    { label: 'LANGUAGES', value: 'Hindi, English, Basic French', icon: '🌐', color: '#f59e0b' }
  ], []);

  // ============================================
  // 6. ABOUT ME TEXT - EDIT YOUR ABOUT TEXT HERE
  // ============================================
  // - paragraph1: First paragraph content
  // - paragraph2: Second paragraph content
  // - highlights: Array of words to highlight in paragraph1
  // ============================================
  
  const aboutMeText = useMemo(() => ({
    paragraph1: "I'm a passionate Computer Science student with a deep interest in building innovative solutions. Currently pursuing my BCA (Honours with Research) with a minor in AI/ML from Parul University, Gujarat.",
    paragraph2: "My journey in tech started with curiosity and has evolved into a dedication to create impactful applications that solve real-world problems.",
    highlights: ['Computer Science student', 'BCA (Honours with Research)', 'AI/ML']
  }), []);

  // ============================================
  // 7. EFFECTS
  // ============================================

  // --------------------------------------------
  // 7.1 GLITTER EFFECT ON NAME HOVER
  // Creates sparkle particles when hovering over name
  // --------------------------------------------
  useEffect(() => {
    const nameElement = nameRef.current;
    if (!nameElement) return;

    // Throttle function to limit particle creation rate
    let lastTime = 0;
    const throttleMs = 50; // Minimum ms between particle creation

    const createGlitter = (e) => {
      const now = Date.now();
      if (now - lastTime < throttleMs) return;
      lastTime = now;

      // Get mouse position relative to element
      const rect = nameElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Create glitter particles (reduced count for performance)
      for (let i = 0; i < 3; i++) {
        const glitter = document.createElement('span');
        glitter.className = 'glitter-particle';
        
        // Random position offset
        glitter.style.left = `${x + (Math.random() - 0.5) * 40}px`;
        glitter.style.top = `${y + (Math.random() - 0.5) * 40}px`;
        
        // Random animation values
        glitter.style.setProperty('--tx', `${(Math.random() - 0.5) * 100}px`);
        glitter.style.setProperty('--ty', `${(Math.random() - 0.5) * 100}px`);
        glitter.style.setProperty('--rotation', `${Math.random() * 360}deg`);
        
        nameElement.appendChild(glitter);

        // Remove particle after animation completes
        setTimeout(() => glitter.remove(), 1000);
      }
    };

    nameElement.addEventListener('mousemove', createGlitter);
    return () => nameElement.removeEventListener('mousemove', createGlitter);
  }, []);

  // --------------------------------------------
  // 7.2 3D TILT EFFECT ON PROFILE CARD
  // Creates perspective tilt on mouse movement
  // --------------------------------------------
  useEffect(() => {
    const card = profileCardRef.current;
    if (!card) return;

    let animationId;

    const handleMouseMove = (e) => {
      // Cancel any pending animation frame for performance
      if (animationId) cancelAnimationFrame(animationId);
      
      animationId = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calculate rotation based on mouse position
        // Reduced intensity (/ 25) for subtle effect
        const rotateX = (y - centerY) / 25;
        const rotateY = (centerX - x) / 25;

        // Apply 3D transform
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        
        // Update CSS custom properties for glow effect
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    };

    const handleMouseLeave = () => {
      if (animationId) cancelAnimationFrame(animationId);
      // Reset transform on mouse leave
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // --------------------------------------------
  // 7.3 SMOKE/DUST EFFECT ON ABOUT TEXT HOVER
  // Creates floating smoke particles on hover
  // --------------------------------------------
  useEffect(() => {
    const textContainer = aboutTextRef.current;
    if (!textContainer) return;

    let lastTime = 0;
    const throttleMs = 80; // Throttle for performance

    const createSmokeParticle = (e) => {
      const now = Date.now();
      if (now - lastTime < throttleMs) return;
      lastTime = now;

      const rect = textContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Create smoke/dust particles
      for (let i = 0; i < 4; i++) {
        const particle = document.createElement('span');
        particle.className = 'smoke-particle';
        
        // Position with random offset
        particle.style.left = `${x + (Math.random() - 0.5) * 30}px`;
        particle.style.top = `${y + (Math.random() - 0.5) * 30}px`;
        
        // Animation values
        particle.style.setProperty('--tx', `${(Math.random() - 0.5) * 60}px`);
        particle.style.setProperty('--ty', `${-30 - Math.random() * 50}px`); // Float upward
        particle.style.setProperty('--scale', `${0.5 + Math.random() * 1}`);
        
        textContainer.appendChild(particle);

        // Remove after animation
        setTimeout(() => particle.remove(), 1500);
      }
    };

    textContainer.addEventListener('mousemove', createSmokeParticle);
    return () => textContainer.removeEventListener('mousemove', createSmokeParticle);
  }, []);

  // --------------------------------------------
  // 7.4 AUTO-SLIDE SKILLS CAROUSEL
  // Automatically cycles through skill categories
  // --------------------------------------------
  useEffect(() => {
    // Only auto-play if enabled AND skills are revealed
    if (!isAutoPlaying || !isSkillsRevealed) return;

    const interval = setInterval(() => {
      setActiveSkillCategory((prev) => (prev + 1) % skills.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [skills.length, isAutoPlaying, isSkillsRevealed]);

  // ============================================
  // 8. EVENT HANDLERS
  // ============================================

  // --------------------------------------------
  // 8.1 HANDLE SKILL NAVIGATION
  // Handles click on skill category tabs
  // --------------------------------------------
  const handleSkillNav = useCallback((index) => {
    setActiveSkillCategory(index);
    setIsAutoPlaying(false); // Pause auto-play when user interacts
    
    // Resume auto-play after 8 seconds of no interaction
    setTimeout(() => setIsAutoPlaying(true), 8000);
  }, []);

  // --------------------------------------------
  // 8.2 HANDLE SKILLS REVEAL
  // Reveals the skills section when user interacts
  // --------------------------------------------
  const handleSkillsReveal = useCallback(() => {
    if (!isSkillsRevealed) {
      setIsSkillsRevealed(true);
    }
  }, [isSkillsRevealed]);

  // ============================================
  // 9. MEMOIZED ELEMENTS
  // ============================================

  // --------------------------------------------
  // 9.1 CREATE FLOATING BUBBLES
  // Background decorative bubbles (memoized for performance)
  // --------------------------------------------
  const bubbles = useMemo(() => {
    return [...Array(15)].map((_, i) => (
      <div 
        key={i} 
        className="floating-bubble"
        style={{
          '--delay': `${Math.random() * 10}s`,
          '--duration': `${18 + Math.random() * 15}s`,
          '--size': `${12 + Math.random() * 35}px`,
          '--left': `${Math.random() * 100}%`,
          '--opacity': `${0.1 + Math.random() * 0.25}`
        } as any}
      />
    ));
  }, []);

  // --------------------------------------------
  // 9.2 CREATE STARS
  // Background twinkling stars (memoized for performance)
  // --------------------------------------------
  const stars = useMemo(() => {
    return [...Array(80)].map((_, i) => (
      <div 
        key={i} 
        className="star"
        style={{
          '--delay': `${Math.random() * 5}s`,
          '--duration': `${2 + Math.random() * 3}s`,
          '--size': `${1 + Math.random() * 2.5}px`,
          '--left': `${Math.random() * 100}%`,
          '--top': `${Math.random() * 100}%`
        } as any}
      />
    ));
  }, []);

  // ============================================
  // 10. HELPER FUNCTIONS
  // ============================================

  // --------------------------------------------
  // 10.1 HIGHLIGHT TEXT
  // Wraps specified words in highlight spans
  // --------------------------------------------
  const highlightText = useCallback((text, highlights) => {
    let result = text;
    highlights.forEach(highlight => {
      result = result.replace(
        highlight,
        `<span class="text-highlight">${highlight}</span>`
      );
    });
    return result;
  }, []);

  // ============================================
  // 11. JSX RENDER
  // ============================================
  
  return (
    <section className="about-section" id="about">
      
      {/* ============================================
          UNIVERSE BACKGROUND
          Decorative animated background elements
          ============================================ */}
      <div className="universe-bg">
        
        {/* Gradient Nebula Effects - Colored gradient clouds */}
        <div className="nebula nebula-1"></div>
        <div className="nebula nebula-2"></div>
        <div className="nebula nebula-3"></div>
        
        {/* Twinkling Stars - Random positioned stars */}
        <div className="stars-container">
          {stars}
        </div>
        
        {/* Floating Smoke/Bubbles - Rising bubbles */}
        <div className="bubbles-container">
          {bubbles}
        </div>
        
        {/* Grid Overlay - Subtle grid pattern for depth */}
        <div className="grid-overlay"></div>
      </div>

      {/* ============================================
          MAIN CONTENT CONTAINER
          ============================================ */}
      <div className="about-container">

        {/* ============================================
            ABOUT ME SECTION - WITH DECORATIVE SYMBOL
            ============================================ */}
        <div className="about-me-section">
          
          {/* Professional Decorative Symbol */}
          <div className="section-symbol">
            <div className="symbol-core">
              <span className="symbol-icon">◆</span>
            </div>
            <div className="symbol-orbit orbit-1">
              <span className="orbit-dot"></span>
            </div>
            <div className="symbol-orbit orbit-2">
              <span className="orbit-dot"></span>
            </div>
            <div className="symbol-orbit orbit-3">
              <span className="orbit-dot"></span>
            </div>
            <div className="symbol-pulse"></div>
          </div>
          
          {/* Section Heading */}
          <h2 className="section-heading">
            <span className="heading-icon">👋</span>
            About Me
            <span className="heading-decoration"></span>
          </h2>
          
          {/* Interactive About Text Container with Smoke Effect */}
          <div className="about-me-content" ref={aboutTextRef}>
            
            {/* Hover instruction hint */}
            <div className="hover-hint">
              <span className="hint-icon">✨</span>
              <span className="hint-text">Hover over text</span>
            </div>
            
            {/* Paragraph 1 - With highlighted keywords */}
            <p 
              className="about-text"
              dangerouslySetInnerHTML={{ 
                __html: highlightText(aboutMeText.paragraph1, aboutMeText.highlights) 
              }}
            />
            
            {/* Paragraph 2 */}
            <p className="about-text">
              {aboutMeText.paragraph2}
            </p>
            
            {/* Decorative divider */}
            <div className="about-decoration">
              <span className="decoration-line"></span>
              <span className="decoration-diamond">◆</span>
              <span className="decoration-line"></span>
            </div>
          </div>
        </div>

        {/* ============================================
            PROFILE CARD WITH PERSONAL INFO
            3D tilt effect on hover
            ============================================ */}
        <div className="profile-section">
          <div className="profile-card" ref={profileCardRef}>
            
            {/* Card Glow Effect - Follows mouse */}
            <div className="card-glow"></div>
            
            {/* Animated Border Glow */}
            <div className="card-border-glow"></div>
            
            {/* Profile Header with Avatar */}
            <div className="profile-header">
              
              {/* Avatar with ring decoration */}
              <div className="avatar-container">
                <div className="avatar-ring">
                  <div className="avatar-ring-inner"></div>
                </div>
                <div className="avatar">
                  <span className="avatar-text">SP</span>
                  
                  {/* Online Status Indicator */}
                  <div className={`online-status ${isOnline ? 'online' : 'offline'}`}>
                    <span className="status-dot"></span>
                    <span className="status-pulse"></span>
                  </div>
                </div>
              </div>
              
              {/* Profile Title Info */}
              <div className="profile-title">
                <h3 className="profile-name" ref={nameRef}>
                  Shivam Paliwal
                  <span className="name-glow"></span>
                </h3>
                <p className="profile-role">Full Stack Developer</p>
                <div className="profile-status">
                  <span className={`status-badge ${isOnline ? 'online' : 'offline'}`}>
                    {isOnline ? '● Available for work' : '○ Currently busy'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Personal Info Grid with Bubble Effect */}
            <div className="info-grid">
              {personalInfo.map((item, index) => (
                <div 
                  key={index} 
                  className="info-bubble"
                  style={{
                    '--index': index as any,
                    '--bubble-color': item.color as any
                  }}
                >
                  {/* Bubble glow sweep effect */}
                  <div className="bubble-glow"></div>
                  
                  {/* Bubble content */}
                  <div className="bubble-content">
                    <span className="info-icon">{item.icon}</span>
                    <div className="info-text">
                      <span className="info-label">{item.label}</span>
                      <span className="info-value">{item.value}</span>
                    </div>
                  </div>
                  
                  {/* Floating particles inside bubble */}
                  <div className="bubble-particles">
                    {[...Array(6)].map((_, i) => (
                      <span 
                        key={i} 
                        className="bubble-particle"
                        style={{ '--particle-index': i as any }}
                      ></span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Education Section */}
            <div className="education-section">
              <h4 className="education-heading">
                <span className="edu-icon">🎓</span>
                Education
              </h4>
              <div className="education-card">
                {/* Glow decoration */}
                <div className="edu-glow"></div>
                
                {/* Education content */}
                <div className="edu-content">
                  <p className="edu-institution">Parul Institute of Computer Application</p>
                  <p className="edu-university">Parul University, Gujarat</p>
                  <div className="edu-details">
                    <div className="edu-item">
                      <span className="edu-label">Degree:</span>
                      <span className="edu-value">BCA (Hons. with Research)</span>
                    </div>
                    <div className="edu-item">
                      <span className="edu-label">Minor:</span>
                      <span className="edu-value">AI & Machine Learning</span>
                    </div>
                    <div className="edu-item">
                      <span className="edu-label">CGPA:</span>
                      <span className="edu-value cgpa-highlight">7.90</span>
                    </div>
                    <div className="edu-item">
                      <span className="edu-label">Duration:</span>
                      <span className="edu-value">2023 - 2027</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================
            SKILLS SECTION - PROFESSIONAL SLIDER
            Initially hidden/blurred until user interacts
            ============================================ */}
        <div 
          className={`skills-section ${isSkillsRevealed ? 'revealed' : 'hidden'}`}
          onMouseEnter={handleSkillsReveal}
          onTouchStart={handleSkillsReveal}
          onClick={handleSkillsReveal}
        >
          
          {/* Section Heading */}
          <h2 className="section-heading">
            <span className="heading-icon">💡</span>
            My Skills
            <span className="heading-decoration"></span>
          </h2>
          
          {/* Reveal overlay - shown when skills are hidden */}
          {!isSkillsRevealed && (
            <div className="skills-reveal-overlay">
              <div className="reveal-content">
                <span className="reveal-icon">👆</span>
                <span className="reveal-text">Hover or tap to reveal skills</span>
              </div>
            </div>
          )}
          
          {/* Skills Navigation Tabs */}
          <div className="skills-nav-wrapper">
            <div className="skills-nav">
              {skills.map((skill, index) => (
                <button
                  key={skill.id}
                  className={`skill-nav-btn ${activeSkillCategory === index ? 'active' : ''}`}
                  onClick={() => handleSkillNav(index)}
                  style={{ '--skill-color': skill.color } as any}
                  aria-label={`View ${skill.title} skills`}
                  aria-pressed={activeSkillCategory === index}
                  tabIndex={isSkillsRevealed ? 0 : -1}
                >
                  <span className="nav-icon">{skill.icon}</span>
                  <span className="nav-text">{skill.title}</span>
                  <div className="nav-indicator"></div>
                  <div className="nav-glow"></div>
                </button>
              ))}
            </div>
            
            {/* Auto-play status indicator */}
            <div className={`autoplay-indicator ${isAutoPlaying ? 'playing' : 'paused'}`}>
              <span className="autoplay-dot"></span>
              <span className="autoplay-text">{isAutoPlaying ? 'Auto' : 'Paused'}</span>
            </div>
          </div>
          
          {/* Skills Carousel Container */}
          <div className="skills-carousel">
            
            {/* Progress bar showing current slide */}
            <div className="carousel-progress">
              <div 
                className="progress-fill"
                style={{
                  '--progress': `${((activeSkillCategory + 1) / skills.length) * 100}%` as any,
                  '--skill-color': skills[activeSkillCategory].color as any
                }}
              ></div>
            </div>
            
            {/* Slides track - moves horizontally */}
            <div 
              className="skills-track"
              style={{ transform: `translateX(-${activeSkillCategory * 100}%)` }}
            >
              {skills.map((category, index) => (
                <div 
                  key={category.id} 
                  className={`skill-slide ${activeSkillCategory === index ? 'active' : ''}`}
                  style={{ '--category-color': category.color as any }}
                >
                  {/* Slide header */}
                  <div className="skill-slide-header">
                    <span className="slide-icon">{category.icon}</span>
                    <h3 className="slide-title">{category.title}</h3>
                    <span className="skill-count">{category.items.length} skills</span>
                  </div>
                  
                  {/* Skill items grid */}
                  <div className="skill-items">
                    {category.items.map((skill, skillIndex) => (
                      <div 
                        key={skillIndex} 
                        className="skill-item"
                        style={{
                          '--item-delay': `${skillIndex * 0.08}s` as any,
                          '--skill-color': category.color as any
                        }}
                      >
                        <span className="skill-name">{skill}</span>
                        <div className="skill-glow"></div>
                        <div className="skill-shine"></div>
                        <div className="skill-border"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Carousel Navigation Controls */}
          <div className="carousel-controls">
            
            {/* Previous Button */}
            <button 
              className="carousel-btn prev"
              onClick={() => handleSkillNav((activeSkillCategory - 1 + skills.length) % skills.length)}
              aria-label="Previous skill category"
              tabIndex={isSkillsRevealed ? 0 : -1}
            >
              <span className="btn-icon">←</span>
            </button>
            
            {/* Dot Indicators */}
            <div className="carousel-indicators">
              {skills.map((skill, index) => (
                <button
                  key={index}
                  className={`indicator ${activeSkillCategory === index ? 'active' : ''}`}
                  onClick={() => handleSkillNav(index)}
                  aria-label={`Go to ${skill.title}`}
                  style={{ '--indicator-color': skill.color } as any}
                  tabIndex={isSkillsRevealed ? 0 : -1}
                />
              ))}
            </div>
            
            {/* Next Button */}
            <button 
              className="carousel-btn next"
              onClick={() => handleSkillNav((activeSkillCategory + 1) % skills.length)}
              aria-label="Next skill category"
              tabIndex={isSkillsRevealed ? 0 : -1}
            >
              <span className="btn-icon">→</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
