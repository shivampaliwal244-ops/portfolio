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

   Note: GSAP animations are ONLY used for:
   - Hero text animations (line2, line3)
   - Profile image smoke/ash effect

   Hire Me button and all popups use CSS-only
   transitions for better performance
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
    
    /* Ref for smoke/ash particle effect container */
    const ashRef = useRef(null);
    
    /* Ref for profile image (used in smoke effect) */
    const imgRef = useRef(null);
    
    /* Ref for hire button (used for particle burst) */
    const hireBtnRef = useRef(null);
    
    /* Ref for particle burst container */
    const particleBurstRef = useRef(null);
    
    /* State for contact options popup visibility */
    const [showOptions, setShowOptions] = useState(false);
    
    /* State for password popup visibility */
    const [showPasswordPopup, setShowPasswordPopup] = useState(false);
    
    /* State for password input value */
    const [password, setPassword] = useState('');
    
    /* State for password error message */
    const [passwordError, setPasswordError] = useState('');

    /* ==========================================
       PARTICLE BURST EFFECT
       Creates hand/sparkle burst on button click
       ========================================== */
    
    /* 
     * Create particle burst effect on button click
     * Generates multiple particles that burst outward
     * with random directions, sizes, and rotations
     */
    const createParticleBurst = useCallback((e) => {
        /* Get button position for particle origin */
        const button = hireBtnRef.current;
        if (!button) return;
        
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        /* Number of particles to create */
        const particleCount = 20;
        
        /* Particle types - emojis and shapes for variety */
        const particleTypes = ['✨', '⭐', '💫', '🌟', '✋', '👋', '🤚'];
        
        /* Create particles */
        for (let i = 0; i < particleCount; i++) {
            createSingleParticle(centerX, centerY, particleTypes, i, particleCount);
        }
    }, []);
    
    /* 
     * Create a single particle with animation
     * @param {number} x - Starting X position
     * @param {number} y - Starting Y position
     * @param {array} types - Array of particle emoji types
     * @param {number} index - Current particle index
     * @param {number} total - Total number of particles
     */
    const createSingleParticle = (x, y, types, index, total) => {
        /* Create particle element */
        const particle = document.createElement('div');
        particle.className = 'hand-particle';
        
        /* Random particle type */
        particle.innerHTML = types[Math.floor(Math.random() * types.length)];
        
        /* Calculate burst angle for even distribution */
        const angle = (index / total) * 360 + (Math.random() * 30 - 15);
        const radian = (angle * Math.PI) / 180;
        
        /* Random distance for natural spread */
        const distance = 80 + Math.random() * 120;
        
        /* Calculate end position */
        const endX = Math.cos(radian) * distance;
        const endY = Math.sin(radian) * distance;
        
        /* Random size variation */
        const size = 16 + Math.random() * 20;
        
        /* Random rotation */
        const rotation = Math.random() * 360;
        
        /* Set initial styles */
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
        
        /* Add to document */
        document.body.appendChild(particle);
        
        /* Trigger animation after a tiny delay */
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                /* Random duration for variety */
                const duration = 600 + Math.random() * 400;
                
                particle.style.transition = `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
                particle.style.transform = `translate(calc(-50% + ${endX}px), calc(-50% + ${endY}px)) rotate(${rotation}deg) scale(1)`;
                particle.style.opacity = '0';
                
                /* Remove particle after animation */
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
    
    /* 
     * Close contact options popup
     * Resets the showOptions state to false
     */
    const closePopup = () => setShowOptions(false);
    
    /* 
     * Close password popup and reset all related state
     * Clears password input and any error messages
     */
    const closePasswordPopup = () => {
        setShowPasswordPopup(false);
        setPassword('');
        setPasswordError('');
    };

    /* ==========================================
       MAIN ANIMATIONS - useEffect
       
       Contains GSAP animations for:
       - Hero text lines (line1, line2, line3)
       - Smoke/ash particle effect on profile image
       
       Note: Hire Me button and popups do NOT use GSAP
       They use CSS transitions instead
       ========================================== */
    useEffect(() => {
        /* -----------------------------------------
           GSAP Timeline for hero text animations
           Animates line1, line2 and line3 sequentially
           ----------------------------------------- */
        const tl = gsap.timeline();
        
        /* 
         * Line 1 Animation (Hey, I'm):
         * Starts: opacity 0, moved up 20px
         * Ends: opacity 1, original position with ease
         */
        tl.fromTo(".line1", 
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
        )
        /* 
         * Line 2 Animation (Name):
         * Starts: opacity 0, scaled down to 50%
         * Ends: opacity 1, full scale with elastic bounce
         * Overlaps with previous animation by 0.3s
         */
        .fromTo(".line2", 
            { opacity: 0, scale: 0.5 },
            { opacity: 1, scale: 1, duration: 1, ease: "elastic.out(1, 0.5)" },
            "-=0.3"
        )
        /* 
         * Line 3 Animation (Typewriter text):
         * Starts: opacity 0, moved down 30px
         * Ends: opacity 1, original position
         * Overlaps with previous animation by 0.4s
         */
        .fromTo(".line3", 
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, 
            "-=0.4"
        );

        /* -----------------------------------------
           SMOKE/ASH PARTICLE EFFECT
           Triggers on profile image periodically
           Creates ethereal smoke dissolve effect
           ----------------------------------------- */
        const triggerAsh = () => {
            /* Exit if ash container ref is not available */
            if (!ashRef.current) return;
            
            /* Get all smoke particle elements */
            const particles = ashRef.current.querySelectorAll('.ash-p');
            
            /* 
             * Fade out and blur the profile image
             * Creates the "dissolving" start effect
             */
            gsap.to(imgRef.current, { 
                opacity: 0, 
                scale: 1.4, 
                filter: "blur(25px)", 
                duration: 0.6 
            });

            /* 
             * Animate each smoke particle
             * Each particle moves outward from center
             */
            particles.forEach((p, i) => {
                gsap.fromTo(p, 
                    /* Start state: small, centered, invisible */
                    { opacity: 0, scale: 0.2, y: 0, x: 0 },
                    { 
                        /* End state: visible, larger, spread out */
                        opacity: 1, 
                        scale: 3, 
                        y: -120, 
                        /* Spread horizontally based on index */
                        x: (i - 2.5) * 80, 
                        duration: 1.2,
                        /* After reaching end state, continue fading up */
                        onComplete: () => { 
                            gsap.to(p, { 
                                opacity: 0, 
                                y: -300, 
                                scale: 6, 
                                duration: 2 
                            }); 
                        }
                    }
                );
            });

            /* 
             * Bring back the profile image
             * Restores original state after smoke clears
             */
            gsap.to(imgRef.current, { 
                opacity: 1, 
                scale: 1, 
                filter: "blur(0px)", 
                duration: 1.2, 
                delay: 1.8 
            });
        };

        /* Trigger ash effect immediately on mount */
        triggerAsh();
        
        /* Set up interval to repeat ash effect every 6 seconds */
        const interval = setInterval(triggerAsh, 6000);
        
        /* Cleanup: clear interval when component unmounts */
        return () => { 
            clearInterval(interval); 
        };
    }, []);

    /* ==========================================
       CLICK HANDLERS
       ========================================== */
    
    /* 
     * Handle Hire Me button click
     * Triggers particle burst and shows options popup
     */
    const handleHireMeClick = (e) => {
        /* Trigger particle burst effect */
        createParticleBurst(e);
        /* Show options popup after slight delay for effect */
        setTimeout(() => {
            setShowOptions(true);
        }, 100);
    };
    
    /* 
     * Handle email option click
     * Opens default email client with pre-filled recipient
     */
    const handleEmailClick = () => {
        window.location.href = "mailto:shivampaliwal6975@gmail.com";
    };

    /* 
     * Handle WhatsApp option click
     * Shows password popup for verification
     * Stops event propagation to prevent popup close
     */
    const handleWhatsAppClick = (e) => {
        e.stopPropagation();
        setShowPasswordPopup(true);
    };

    /* 
     * Handle password form submission
     * Validates password and redirects to WhatsApp on success
     */
    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        
        /* Check password against environment variable */
        if (password?.trim() === process.env.NEXT_PUBLIC_APP_PASSWORD?.trim()) {
            /* Correct password - redirect to WhatsApp */
            window.location.href = "https://wa.me/916377396883";
        } else {
            /* Wrong password - show error */
            setPasswordError('Wrong password ❌');
        }
    };

    /* ==========================================
       RENDER
       ========================================== */
    return (
        <div id="home">
            {/* ==========================================
                THREE.JS PARTICLE BACKGROUND
                Renders animated particles behind content
                ========================================== */}
            <Particlethree />
            
            {/* ==========================================
                LEFT SECTION - Hero Text Content
                Contains greeting, name, roles, and CTA
                ========================================== */}
            <div className="lefthome">
                {/* -----------------------------------------
                    HERO TITLE
                    Multi-line animated heading
                    Fixed structure: Line1 above Line2
                    ----------------------------------------- */}
                <div className="hero-title">
                    {/* 
                     * Line 1: "Hey, I'm" greeting
                     * Positioned as block element above the name
                     * GSAP animated on mount (fade down)
                     * Has hover effect with gradient shift
                     */}
                    <span className="line1">Hey, I'm</span>
                    
                    {/* 
                     * Line 2: Name with gradient
                     * GSAP animated on mount (elastic bounce)
                     * Displayed as block for proper stacking
                     */}
                    <span className="line2">Shivam</span>
                </div>

                {/* -----------------------------------------
                    LINE 3 - TYPEWRITER ROLES
                    Animated typing effect for job roles
                    GSAP animated on mount (fade up)
                    ----------------------------------------- */}
                <p className="line3">
                    <span className="highlight">
                        <Typewriter
                            words={[
                                'Python Developer',
                                'Full Stack Developer',
                                'AI Researcher'
                            ]}
                            loop={true}
                            cursor
                            cursorStyle="|"
                            typeSpeed={70}
                            deleteSpeed={40}
                            delaySpeed={1500}
                        />
                    </span>
                </p>

                {/* -----------------------------------------
                    HIRE ME BUTTON
                    
                    CSS-only animations:
                    - Hover effects with lift and glow
                    - Active/click feedback
                    - Entrance animation via CSS keyframes
                    - Hand burst particle effect on click
                    
                    NO GSAP used here
                    ----------------------------------------- */}
                <button 
                    ref={hireBtnRef}
                    className="hire-btn" 
                    onClick={handleHireMeClick}
                >
                    <span className="btn-text">Hire Me</span>
                    <span className="btn-icon">🚀</span>
                    {/* Glow sweep effect on hover */}
                    <div className="btn-glow"></div>
                    {/* Ripple effect container */}
                    <div className="btn-ripple"></div>
                </button>

                {/* -----------------------------------------
                    CONTACT OPTIONS POPUP
                    
                    Shows Email and WhatsApp contact options
                    Features:
                    - Blur background overlay
                    - Glass morphism design
                    - Premium highlight effects on options
                    - Fixed close button positioning
                    
                    CSS-only transitions - NO GSAP
                    ----------------------------------------- */}
                {showOptions && (
                    <div className="popup-overlay" onClick={closePopup}>
                        <div className="hire-popup" onClick={(e) => e.stopPropagation()}>
                            {/* 
                             * Close button
                             * Properly positioned inside popup
                             * Smooth rotation on hover
                             */}
                            <button className="close-btn" onClick={closePopup}>✕</button>
                            
                            {/* Popup title */}
                            <h3 className="popup-title">Get in Touch</h3>
                            
                            {/* Options container */}
                            <div className="options-container">
                                {/* 
                                 * Email Option Card
                                 * Premium highlight glow effect on hover
                                 * Clicks open email client
                                 */}
                                <div className="option email-option" onClick={handleEmailClick}>
                                    {/* Animated border highlight */}
                                    <div className="option-border"></div>
                                    {/* Icon container */}
                                    <div className="icon-wrapper">
                                        <FontAwesomeIcon icon={faGoogle} className="option-icon gmail-icon" />
                                    </div>
                                    {/* Option label */}
                                    <p className="option-label">Email</p>
                                    {/* Shine sweep effect */}
                                    <div className="option-shine"></div>
                                </div>
                                
                                {/* 
                                 * WhatsApp Option Card
                                 * Premium highlight glow effect on hover
                                 * Clicks show password popup
                                 */}
                                <div className="option whatsapp-option" onClick={handleWhatsAppClick}>
                                    {/* Animated border highlight */}
                                    <div className="option-border"></div>
                                    {/* Icon container */}
                                    <div className="icon-wrapper">
                                        <FontAwesomeIcon icon={faWhatsapp} className="option-icon whatsapp-icon" />
                                    </div>
                                    {/* Option label */}
                                    <p className="option-label">WhatsApp</p>
                                    {/* Shine sweep effect */}
                                    <div className="option-shine"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* -----------------------------------------
                    PASSWORD POPUP
                    
                    Glass effect popup for WhatsApp access
                    Features:
                    - Premium glass morphism design
                    - Animated highlight border
                    - Blur background overlay
                    - Input validation with error display
                    - Smooth close button
                    
                    CSS-only transitions - NO GSAP
                    ----------------------------------------- */}
                {showPasswordPopup && (
                    <div className="password-overlay" onClick={closePasswordPopup}>
                        <div className="password-popup" onClick={(e) => e.stopPropagation()}>
                            {/* Animated glass highlight border */}
                            <div className="password-highlight"></div>
                            
                            {/* 
                             * Close button
                             * Positioned at top-right corner
                             */}
                            <button className="password-close-btn" onClick={closePasswordPopup}>✕</button>
                            
                            {/* Lock icon with glow effect */}
                            <div className="password-icon">🔐</div>
                            
                            {/* Title with gradient text */}
                            <h3 className="password-title">Enter Password</h3>
                            
                            {/* Subtitle text */}
                            <p className="password-subtitle">WhatsApp access is protected</p>
                            
                            {/* 
                             * Password Form
                             * Contains input and submit button
                             */}
                            <form onSubmit={handlePasswordSubmit} className="password-form">
                                {/* 
                                 * Password input field
                                 * Auto-focuses when popup opens
                                 * Clears error on input change
                                 */}
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
                                    {/* Input focus highlight */}
                                    <div className="input-highlight"></div>
                                </div>
                                
                                {/* 
                                 * Error message display
                                 * Shows only when passwordError is set
                                 */}
                                {passwordError && (
                                    <p className="password-error">{passwordError}</p>
                                )}
                                
                                {/* 
                                 * Submit button with hover effects
                                 * CSS-only animations
                                 */}
                                <button type="submit" className="password-submit-btn">
                                    <span className="submit-text">Unlock</span>
                                    <span className="submit-icon">→</span>
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            {/* ==========================================
                RIGHT SECTION - Profile Image
                Contains animated profile with effects
                ========================================== */}
            <div className="righthome">
                <div className="image-container">
                    {/* 
                     * Rotating electric border
                     * Creates dynamic spinning border effect
                     */}
                    <div className="rotating-border"></div>
                    
                    {/* 
                     * Glow ring
                     * Pulsing outer glow effect
                     */}
                    <div className="glow-ring"></div>
                    
                    {/* 
                     * Smoke particles wrapper
                     * Contains 6 particles for dissolve effect
                     */}
                    <div className="ash-wrapper" ref={ashRef}>
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="ash-p"></div>
                        ))}
                    </div>
                    
                    {/* 
                     * Profile image
                     * Ref used for GSAP smoke animation
                     */}
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
