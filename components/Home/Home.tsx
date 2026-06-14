'use client';

/* ==========================================
   HOME.TSX - Main Home Component
   Features:
   - Hero section with profile image
   - Typewriter effect for roles
   - Hire Me button with contact popup
   - Hand burst particle effect on button click
   - Password-protected WhatsApp access
   - Particle background
   ========================================== */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import './Home.css';
import gsap from 'gsap';
import { Typewriter } from 'react-simple-typewriter';
import Particlethree from './particlethree';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

function Home() {
    /* ==========================================
       REFS & STATE
       ========================================== */
    const ashRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const hireBtnRef = useRef<HTMLButtonElement>(null);
    
    const [showOptions, setShowOptions] = useState(false);
    const [showPasswordPopup, setShowPasswordPopup] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    /* ==========================================
       PARTICLE BURST EFFECT
       ========================================== */
    const createParticleBurst = useCallback((e: React.MouseEvent) => {
        const button = hireBtnRef.current;
        if (!button) return;
        
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const particleCount = 20;
        const particleTypes = ['✨', '⭐', '💫', '🌟', '✋', '👋', '🤚'];
        
        for (let i = 0; i < particleCount; i++) {
            createSingleParticle(centerX, centerY, particleTypes, i, particleCount);
        }
    }, []);
    
    const createSingleParticle = (x: number, y: number, types: string[], index: number, total: number) => {
        const particle = document.createElement('div');
        particle.className = 'hand-particle';
        particle.innerHTML = types[Math.floor(Math.random() * types.length)];
        
        const angle = (index / total) * 360 + (Math.random() * 30 - 15);
        const radian = (angle * Math.PI) / 180;
        const distance = 80 + Math.random() * 120;
        
        const endX = Math.cos(radian) * distance;
        const endY = Math.sin(radian) * distance;
        const size = 16 + Math.random() * 20;
        const rotation = Math.random() * 360;
        
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            font-size: ${size}px;
            pointer-events: none;
            z-index: 10001;
            opacity: 1;
            transform: translate(-50%, -50%) rotate(0deg) scale(0);
            transition: none;
        `;
        
        document.body.appendChild(particle);
        
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                const duration = 600 + Math.random() * 400;
                particle.style.transition = `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
                particle.style.transform = `translate(calc(-50% + ${endX}px), calc(-50% + ${endY}px)) rotate(${rotation}deg) scale(1)`;
                particle.style.opacity = '0';
                
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, duration + 50);
            });
        });
    };

    /* ==========================================
       POPUP HANDLERS
       ========================================== */
    const closePopup = () => setShowOptions(false);
    
    const closePasswordPopup = () => {
        setShowPasswordPopup(false);
        setPassword('');
        setPasswordError('');
    };

    /* ==========================================
       MAIN ANIMATIONS - useEffect
       ========================================== */
    useEffect(() => {
        // GSAP Timeline for Hero Text
        const tl = gsap.timeline();
        
        tl.fromTo(".line1", 
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
        )
        .fromTo(".line2", 
            { opacity: 0, scale: 0.5 },
            { opacity: 1, scale: 1, duration: 1, ease: "elastic.out(1, 0.5)" },
            "-=0.3"
        )
        .fromTo(".line3", 
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, 
            "-=0.4"
        );

        // Smoke/Ash Particle Effect
        const triggerAsh = () => {
            if (!ashRef.current || !imgRef.current) return;
            const particles = ashRef.current.querySelectorAll('.ash-p');
            
            gsap.to(imgRef.current, { 
                opacity: 0, scale: 1.4, filter: "blur(25px)", duration: 0.6 
            });

            particles.forEach((p, i) => {
                gsap.fromTo(p, 
                    { opacity: 0, scale: 0.2, y: 0, x: 0 },
                    { 
                        opacity: 1, scale: 3, y: -120, x: (i - 2.5) * 80, duration: 1.2,
                        onComplete: () => { 
                            gsap.to(p, { opacity: 0, y: -300, scale: 6, duration: 2 }); 
                        }
                    }
                );
            });

            gsap.to(imgRef.current, { 
                opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.2, delay: 1.8 
            });
        };

        triggerAsh();
        const interval = setInterval(triggerAsh, 6000);
        return () => clearInterval(interval);
    }, []);

    /* ==========================================
       CLICK HANDLERS
       ========================================== */
    const handleHireMeClick = (e: React.MouseEvent) => {
        createParticleBurst(e);
        setTimeout(() => setShowOptions(true), 100);
    };
    
    //const handleEmailClick = () => {
       // window.location.href = "mailto:shivampaliwal244@gmail.com";
    //};
    const handleEmailClick = () => {
    window.location.href = "mailto:shivampaliwal244@gmail.com";
};

    const handleWhatsAppClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowPasswordPopup(true);
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password?.trim() === process.env.NEXT_PUBLIC_APP_PASSWORD?.trim()) {
            window.location.href = "https://wa.me/916377396883";
        } else {
            setPasswordError('Wrong password ❌');
        }
    };

    /* ==========================================
       RENDER
       ========================================== */
    return (
        <div id="home">
            <Particlethree />
            
            <div className="lefthome">
                <div className="hero-title">
                    <span className="line1">Hey, I'm</span>
                    <span className="line2">Shivam</span>
                </div>

                <p className="line3">
                    <span className="highlight">
                        <Typewriter
                            words={['Python Developer', 'Full Stack Developer', 'AI Researcher']}
                            loop={true}
                            cursor
                            cursorStyle="|"
                            typeSpeed={70}
                            deleteSpeed={40}
                            delaySpeed={1500}
                        />
                    </span>
                </p>

                <button 
                    ref={hireBtnRef}
                    className="hire-btn" 
                    onClick={handleHireMeClick}
                >
                    <span className="btn-text">Hire Me</span>
                    <span className="btn-icon">🚀</span>
                    <div className="btn-glow"></div>
                    <div className="btn-ripple"></div>
                </button>

                {/* CONTACT OPTIONS POPUP */}
                {showOptions && (
                    <div className="popup-overlay" onClick={closePopup}>
                        <div className="hire-popup" onClick={(e) => e.stopPropagation()}>
                            <button className="close-btn" onClick={closePopup}>✕</button>
                            <h3 className="popup-title">Get in Touch</h3>
                            
                            <div className="options-container">
                                <div className="option email-option" onClick={handleEmailClick}>
                                    <div className="option-border"></div>
                                    <div className="icon-wrapper">
                                        <FontAwesomeIcon icon={faGoogle} className="option-icon gmail-icon" />
                                    </div>
                                    <p className="option-label">Email</p>
                                    <div className="option-shine"></div>
                                </div>
                                
                                <div className="option whatsapp-option" onClick={handleWhatsAppClick}>
                                    <div className="option-border"></div>
                                    <div className="icon-wrapper">
                                        <FontAwesomeIcon icon={faWhatsapp} className="option-icon whatsapp-icon" />
                                    </div>
                                    <p className="option-label">WhatsApp</p>
                                    <div className="option-shine"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* PASSWORD POPUP */}
                {showPasswordPopup && (
                    <div className="password-overlay" onClick={closePasswordPopup}>
                        <div className="password-popup" onClick={(e) => e.stopPropagation()}>
                            <div className="password-highlight"></div>
                            <button className="password-close-btn" onClick={closePasswordPopup}>✕</button>
                            <div className="password-icon">🔐</div>
                            <h3 className="password-title">Enter Password</h3>
                            <p className="password-subtitle">WhatsApp access is protected</p>
                            
                            <form onSubmit={handlePasswordSubmit} className="password-form">
                                <div className="input-wrapper">
                                    <input
                                        type="password"
                                        className="password-input"
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setPasswordError('');
                                        }}
                                        autoFocus
                                    />
                                    <div className="input-highlight"></div>
                                </div>
                                
                                {passwordError && (
                                    <p className="password-error">{passwordError}</p>
                                )}
                                
                                <button type="submit" className="password-submit-btn">
                                    <span className="submit-text">Unlock</span>
                                    <span className="submit-icon">→</span>
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            <div className="righthome">
                <div className="image-container">
                    <div className="rotating-border"></div>
                    <div className="glow-ring"></div>
                    
                    <div className="ash-wrapper" ref={ashRef}>
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="ash-p"></div>
                        ))}
                    </div>
                    
                    <img
                        ref={imgRef}
                        src="/assets/Hprofile.png"
                        alt="Shivam"
                        className="profile-img"
                    />
                </div>
            </div>
        </div>
    );
}

export default Home;