'use client';

// ============================================
// ABOUT COMPONENT - PROFESSIONAL PORTFOLIO
// ============================================

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import './About.css';

const About = () => {
  // ============================================
  // REFS & STATE
  // ============================================
  const nameRef = useRef(null);
  const profileCardRef = useRef(null);
  const aboutTextRef = useRef(null);
  
  const [activeSkillCategory, setActiveSkillCategory] = useState(0);
  const [isOnline] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isSkillsRevealed, setIsSkillsRevealed] = useState(false);

  const [bubbles, setBubbles] = useState<React.JSX.Element[]>([]);
  const [stars, setStars] = useState<React.JSX.Element[]>([]);
  
  // ============================================
  // DATA
  // ============================================
  const skills = useMemo(() => [
    {
      id: 'frontend',
      icon: '🚀',
      title: 'Frontend Development',
      color: '#00d4ff',
      items: ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Next.js', 'Tailwind CSS']
    },
    {
      id: 'animation',
      icon: '✨',
      title: 'Animation & Design',
      color: '#f472b6',
      items: ['GSAP', 'Three.js', 'UI/UX', 'Framer Motion', 'CSS Animations', 'SVG Animation']
    },
    {
      id: 'backend',
      icon: '⚙️',
      title: 'Backend Development',
      color: '#a855f7',
      items: ['Node.js', 'Express.js', 'Java', 'REST APIs', 'Firebase', 'Authentication']
    },
    {
      id: 'database',
      icon: '🗄️',
      title: 'Database',
      color: '#10b981',
      items: ['SQL', 'PostgreSQL', 'MongoDB', 'Firebase Realtime DB', 'DBMS Concepts']
    },
    {
      id: 'aiml',
      icon: '🤖',
      title: 'AI / ML',
      color: '#f59e0b',
      items: ['Python', 'Scikit-learn', 'TensorFlow', 'Data Analysis', 'Machine Learning']
    },
    {
      id: 'tools',
      icon: '🛠️',
      title: 'Tools & Others',
      color: '#ef4444',
      items: ['Git', 'GitHub', 'VS Code', 'Figma', 'Postman', 'npm']
    }
  ], []);

  const personalInfo = useMemo(() => [
    { label: 'NAME', value: 'Shivam Paliwal', icon: '👤', color: '#00d4ff' },
    { label: 'AGE', value: '21 Years', icon: '🎂', color: '#a855f7' },
    { label: 'LOCATION', value: 'Gujarat, India', icon: '📍', color: '#10b981' },
    { label: 'LANGUAGES', value: 'Hindi, English, Basic French', icon: '🌐', color: '#f59e0b' }
  ], []);

  const aboutMeText = useMemo(() => ({
    paragraph1: "I'm a passionate Computer Science student with a deep interest in building innovative solutions. Currently pursuing my BCA (Honours with Research) with a minor in AI/ML from Parul University, Gujarat.",
    paragraph2: "My journey in tech started with curiosity and has evolved into a dedication to create impactful applications that solve real-world problems.",
    highlights: ['Computer Science student', 'BCA (Honours with Research)', 'AI/ML']
  }), []);

  // ============================================
  // EFFECTS
  // ============================================

  // 1. GLITTER EFFECT
  useEffect(() => {
    const nameElement = nameRef.current;
    if (!nameElement) return;

    let lastTime = 0;
    const throttleMs = 50;

    const createGlitter = (e: any) => {
      const now = Date.now();
      if (now - lastTime < throttleMs) return;
      lastTime = now;

      const rect = nameElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      for (let i = 0; i < 3; i++) {
        const glitter = document.createElement('span');
        glitter.className = 'glitter-particle';
        
        glitter.style.left = `${x + (Math.random() - 0.5) * 40}px`;
        glitter.style.top = `${y + (Math.random() - 0.5) * 40}px`;
        
        glitter.style.setProperty('--tx', `${(Math.random() - 0.5) * 100}px`);
        glitter.style.setProperty('--ty', `${(Math.random() - 0.5) * 100}px`);
        glitter.style.setProperty('--rotation', `${Math.random() * 360}deg`);
        
        nameElement.appendChild(glitter);
        setTimeout(() => glitter.remove(), 1000);
      }
    };

    nameElement.addEventListener('mousemove', createGlitter);
    return () => nameElement.removeEventListener('mousemove', createGlitter);
  }, []);

  // 2. 3D TILT EFFECT
  useEffect(() => {
    const card = profileCardRef.current;
    if (!card) return;

    let animationId: number;

    const handleMouseMove = (e: any) => {
      if (animationId) cancelAnimationFrame(animationId);
      
      animationId = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 25;
        const rotateY = (centerX - x) / 25;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    };

    const handleMouseLeave = () => {
      if (animationId) cancelAnimationFrame(animationId);
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

  // 3. SMOKE EFFECT
  useEffect(() => {
    const textContainer = aboutTextRef.current;
    if (!textContainer) return;

    let lastTime = 0;
    const throttleMs = 80;

    const createSmokeParticle = (e: any) => {
      const now = Date.now();
      if (now - lastTime < throttleMs) return;
      lastTime = now;

      const rect = textContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      for (let i = 0; i < 4; i++) {
        const particle = document.createElement('span');
        particle.className = 'smoke-particle';
        
        particle.style.left = `${x + (Math.random() - 0.5) * 30}px`;
        particle.style.top = `${y + (Math.random() - 0.5) * 30}px`;
        
        particle.style.setProperty('--tx', `${(Math.random() - 0.5) * 60}px`);
        particle.style.setProperty('--ty', `${-30 - Math.random() * 50}px`);
        particle.style.setProperty('--scale', `${0.5 + Math.random() * 1}`);
        
        textContainer.appendChild(particle);
        setTimeout(() => particle.remove(), 1500);
      }
    };

    textContainer.addEventListener('mousemove', createSmokeParticle);
    return () => textContainer.removeEventListener('mousemove', createSmokeParticle);
  }, []);

  // 4. AUTO-SLIDE CAROUSEL
  useEffect(() => {
    if (!isAutoPlaying || !isSkillsRevealed) return;

    const interval = setInterval(() => {
      setActiveSkillCategory((prev) => (prev + 1) % skills.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [skills.length, isAutoPlaying, isSkillsRevealed]);

  // ============================================
  // CLIENT-SIDE ELEMENTS (HYDRATION FIX)
  // ============================================
  useEffect(() => {
    const generatedBubbles = [...Array(15)].map((_, i) => (
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

    const generatedStars = [...Array(80)].map((_, i) => (
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

    setBubbles(generatedBubbles);
    setStars(generatedStars);
  }, []);

  // ============================================
  // EVENT HANDLERS & HELPERS
  // ============================================

  const handleSkillNav = useCallback((index: number) => {
    setActiveSkillCategory(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  }, []);

  const handleSkillsReveal = useCallback(() => {
    if (!isSkillsRevealed) {
      setIsSkillsRevealed(true);
    }
  }, [isSkillsRevealed]);

  const highlightText = useCallback((text: string, highlights: string[]) => {
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
  // JSX RENDER
  // ============================================
  
  return (
    <section className="about-section" id="about">
      
      {/* UNIVERSE BACKGROUND */}
      <div className="universe-bg">
        <div className="nebula nebula-1"></div>
        <div className="nebula nebula-2"></div>
        <div className="nebula nebula-3"></div>
        
        <div className="stars-container">
          {stars}
        </div>
        
        <div className="bubbles-container">
          {bubbles}
        </div>
        
        <div className="grid-overlay"></div>
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <div className="about-container">

        {/* ABOUT ME SECTION */}
        <div className="about-me-section">
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
          
          <h2 className="section-heading">
            <span className="heading-icon">👋</span>
            About Me
            <span className="heading-decoration"></span>
          </h2>
          
          <div className="about-me-content" ref={aboutTextRef}>
            <div className="hover-hint">
              <span className="hint-icon">✨</span>
              <span className="hint-text">Hover over text</span>
            </div>
            
            <p 
              className="about-text"
              dangerouslySetInnerHTML={{ 
                __html: highlightText(aboutMeText.paragraph1, aboutMeText.highlights) 
              }}
            />
            
            <p className="about-text">
              {aboutMeText.paragraph2}
            </p>
            
            <div className="about-decoration">
              <span className="decoration-line"></span>
              <span className="decoration-diamond">◆</span>
              <span className="decoration-line"></span>
            </div>
          </div>
        </div>

        {/* PROFILE CARD */}
        <div className="profile-section">
          <div className="profile-card" ref={profileCardRef}>
            <div className="card-glow"></div>
            <div className="card-border-glow"></div>
            
            <div className="profile-header">
              <div className="avatar-container">
                <div className="avatar-ring">
                  <div className="avatar-ring-inner"></div>
                </div>
                <div className="avatar">
                  <span className="avatar-text">SP</span>
                  <div className={`online-status ${isOnline ? 'online' : 'offline'}`}>
                    <span className="status-dot"></span>
                    <span className="status-pulse"></span>
                  </div>
                </div>
              </div>
              
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
            
            <div className="info-grid">
              {personalInfo.map((item, index) => (
                <div 
                  key={index} 
                  className="info-bubble"
                  // TS FIX: Complete object cast to any
                  style={{ '--index': index, '--bubble-color': item.color } as any}
                >
                  <div className="bubble-glow"></div>
                  <div className="bubble-content">
                    <span className="info-icon">{item.icon}</span>
                    <div className="info-text">
                      <span className="info-label">{item.label}</span>
                      <span className="info-value">{item.value}</span>
                    </div>
                  </div>
                  <div className="bubble-particles">
                    {[...Array(6)].map((_, i) => (
                      <span 
                        key={i} 
                        className="bubble-particle"
                        // TS FIX: Complete object cast to any
                        style={{ '--particle-index': i } as any}
                      ></span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="education-section">
              <h4 className="education-heading">
                <span className="edu-icon">🎓</span>
                Education
              </h4>
              <div className="education-card">
                <div className="edu-glow"></div>
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

        {/* SKILLS SECTION */}
        <div 
          className={`skills-section ${isSkillsRevealed ? 'revealed' : 'hidden'}`}
          onMouseEnter={handleSkillsReveal}
          onTouchStart={handleSkillsReveal}
          onClick={handleSkillsReveal}
        >
          <h2 className="section-heading">
            <span className="heading-icon">💡</span>
            My Skills
            <span className="heading-decoration"></span>
          </h2>
          
          {!isSkillsRevealed && (
            <div className="skills-reveal-overlay">
              <div className="reveal-content">
                <span className="reveal-icon">👆</span>
                <span className="reveal-text">Hover or tap to reveal skills</span>
              </div>
            </div>
          )}
          
          <div className="skills-nav-wrapper">
            <div className="skills-nav">
              {skills.map((skill, index) => (
                <button
                  key={skill.id}
                  className={`skill-nav-btn ${activeSkillCategory === index ? 'active' : ''}`}
                  onClick={() => handleSkillNav(index)}
                  // TS FIX: Complete object cast to any
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
            
            <div className={`autoplay-indicator ${isAutoPlaying ? 'playing' : 'paused'}`}>
              <span className="autoplay-dot"></span>
              <span className="autoplay-text">{isAutoPlaying ? 'Auto' : 'Paused'}</span>
            </div>
          </div>
          
          <div className="skills-carousel">
            <div className="carousel-progress">
              <div 
                className="progress-fill"
                // TS FIX: Complete object cast to any
                style={{
                  '--progress': `${((activeSkillCategory + 1) / skills.length) * 100}%`,
                  '--skill-color': skills[activeSkillCategory].color
                } as any}
              ></div>
            </div>
            
            <div 
              className="skills-track"
              style={{ transform: `translateX(-${activeSkillCategory * 100}%)` }}
            >
              {skills.map((category, index) => (
                <div 
                  key={category.id} 
                  className={`skill-slide ${activeSkillCategory === index ? 'active' : ''}`}
                  // TS FIX: Complete object cast to any
                  style={{ '--category-color': category.color } as any}
                >
                  <div className="skill-slide-header">
                    <span className="slide-icon">{category.icon}</span>
                    <h3 className="slide-title">{category.title}</h3>
                    <span className="skill-count">{category.items.length} skills</span>
                  </div>
                  
                  <div className="skill-items">
                    {category.items.map((skill, skillIndex) => (
                      <div 
                        key={skillIndex} 
                        className="skill-item"
                        // TS FIX: Complete object cast to any
                        style={{
                          '--item-delay': `${skillIndex * 0.08}s`,
                          '--skill-color': category.color
                        } as any}
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
          
          <div className="carousel-controls">
            <button 
              className="carousel-btn prev"
              onClick={() => handleSkillNav((activeSkillCategory - 1 + skills.length) % skills.length)}
              aria-label="Previous skill category"
              tabIndex={isSkillsRevealed ? 0 : -1}
            >
              <span className="btn-icon">←</span>
            </button>
            
            <div className="carousel-indicators">
              {skills.map((skill, index) => (
                <button
                  key={index}
                  className={`indicator ${activeSkillCategory === index ? 'active' : ''}`}
                  onClick={() => handleSkillNav(index)}
                  aria-label={`Go to ${skill.title}`}
                  // TS FIX: Complete object cast to any
                  style={{ '--indicator-color': skill.color } as any}
                  tabIndex={isSkillsRevealed ? 0 : -1}
                />
              ))}
            </div>
            
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