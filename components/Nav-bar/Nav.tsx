'use client';

import React, { useRef, useState, useCallback } from 'react';
import './Nav.css';
import { Link } from 'react-scroll';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import QR from "/assets/qr.png";

function Nav() {
    const navRef = useRef();
    const [isOpen, setIsOpen] = useState(false);

    /* ==========================================
       Toggle menu handler - memoized for performance
       ========================================== */
    const toggleMenu = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    /* ==========================================
       Close menu handler - for overlay and links
       ========================================== */
    const closeMenu = useCallback(() => {
        setIsOpen(false);
    }, []);

    /* ==========================================
       GSAP PORTFOLIO SMOKE ANIMATION
       Premium smoky letter reveal effect
       ========================================== */
    useGSAP(() => {
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });

        /* Phase 1: Letters emerge from smoke */
        tl.to(".logo-letter", {
            duration: 1.2,
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            scale: 1,
            stagger: 0.1,
            ease: "power3.out"
        })
        /* Phase 2: Letters glow and float up */
        .to(".logo-letter", {
            duration: 1.4,
            opacity: 1,
            filter: "blur(6px)",
            y: -12,
            scale: 1.2,
            textShadow: "0 0 25px #00e5ff, 0 0 50px #7f00ff, 0 0 75px #00e5ff",
            stagger: 0.08,
            ease: "sine.inOut",
            delay: 1
        })
        /* Phase 3: Letters dissolve into smoke */
        .to(".logo-letter", {
            duration: 1.8,
            opacity: 0,
            y: -35,
            filter: "blur(15px)",
            scale: 0.85,
            stagger: 0.05,
            ease: "power2.inOut"
        });

    }, { scope: navRef });

    /* ==========================================
       BODY SCROLL LOCK
       Prevents background scrolling when menu open
       ========================================== */
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.touchAction = 'none'; /* Prevents iOS bounce */
        } else {
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
        }
        
        return () => {
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
        };
    }, [isOpen]);

    /* ==========================================
       ESCAPE KEY HANDLER
       Close menu with Escape key for accessibility
       ========================================== */
    React.useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                closeMenu();
            }
        };
        
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, closeMenu]);

    return (
        <nav ref={navRef} className="navbar">
            {/* ==========================================
                LOGO - Animated smoke text
                ========================================== */}
            <h1 className="logo">
                {"PORTFOLIO".split("").map((char, index) => (
                    <span key={index} className="logo-letter">{char}</span>
                ))}
            </h1>

            {/* ==========================================
                HAMBURGER MENU BUTTON
                Fixed: Proper button element with stable z-index
                ========================================== */}
            <button 
                className={`hamburger ${isOpen ? 'active' : ''}`}
                onClick={toggleMenu}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
                type="button"
            >
                <span className="hamburger-box">
                    <span className="hamburger-line hamburger-line--top"></span>
                    <span className="hamburger-line hamburger-line--middle"></span>
                    <span className="hamburger-line hamburger-line--bottom"></span>
                </span>
            </button>

            {/* ==========================================
                OVERLAY BACKDROP
                Click outside to close menu
                ========================================== */}
            <div 
                className={`menu-overlay ${isOpen ? 'active' : ''}`} 
                onClick={closeMenu}
                aria-hidden="true"
            />

            {/* ==========================================
                MOBILE/SIDEBAR MENU
                Glass morphism with smooth animations
                ========================================== */}
            <div className={`mobile-menu ${isOpen ? 'active' : ''}`}>
                <ul className="mobile-menu-list">
                    <li>
                        <Link 
                            to="Home" 
                            onClick={closeMenu} 
                            smooth={true} 
                            duration={500}
                            offset={-80}
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="About" 
                            onClick={closeMenu} 
                            smooth={true} 
                            duration={500}
                            offset={-80}
                        >
                            About
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="Projects" 
                            onClick={closeMenu} 
                            smooth={true} 
                            duration={500}
                            offset={-80}
                        >
                            Projects
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="Contact" 
                            onClick={closeMenu} 
                            smooth={true} 
                            duration={500}
                            offset={-80}
                        >
                            Contact
                        </Link>
                    </li>
                </ul>

                {/* ==========================================
                    QR CODE SECTION
                    3D tilt effect with neon glow
                    ========================================== */}
                <div className="menu-qr">
                    <p>Tap or Scan to view my Resume 🚀</p>
                    <div className="qr-wrapper">
                        <img src="/assets/qr.png" alt="QR Code - Scan to view resume" />
                        <div className="scan-line"></div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Nav;
