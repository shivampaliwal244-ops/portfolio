'use client';
import React, { useState, useCallback, useEffect } from 'react';
import './Nav.css';
import { Link } from 'react-scroll';

function Nav(): React.JSX.Element {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggleMenu = useCallback(() => setIsOpen(prev => !prev), []);
    const closeMenu  = useCallback(() => setIsOpen(false), []);

    useEffect(() => {
        document.body.style.overflow    = isOpen ? 'hidden' : '';
        document.body.style.touchAction = isOpen ? 'none'   : '';
        return () => {
            document.body.style.overflow    = '';
            document.body.style.touchAction = '';
        };
    }, [isOpen]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeMenu(); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [closeMenu]);

    return (
        <nav className="navbar">

            {/* LOGO */}
            <h1 className="logo">
                <span className="logo-shine">PORTFOLIO</span>
            </h1>

            {/* HAMBURGER */}
            <button
                className={`hamburger ${isOpen ? 'active' : ''}`}
                onClick={toggleMenu}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
                type="button"
            >
                <span className="hamburger-box">
                    <span className="hamburger-line hamburger-line--top" />
                    <span className="hamburger-line hamburger-line--middle" />
                    <span className="hamburger-line hamburger-line--bottom" />
                </span>
            </button>

            {/* OVERLAY */}
            <div
                className={`menu-overlay ${isOpen ? 'active' : ''}`}
                onClick={closeMenu}
                aria-hidden="true"
            />

            {/* SIDEBAR MENU */}
            <div className={`mobile-menu ${isOpen ? 'active' : ''}`}>

                <ul className="mobile-menu-list">
                    {['Home', 'About', 'Projects', 'Contact'].map((item) => (
                        <li key={item}>
                            <Link
                                to={item}
                                onClick={closeMenu}
                                smooth={true}
                                duration={500}
                                offset={-80}
                            >
                                {item}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* QR SECTION — Next.js: public/assets/qr.png → /assets/qr.png */}
                <div className="menu-qr">
                    <p>Tap or Scan to view Resume 🚀</p>
                    <div className="qr-wrapper">
                        <div className="scanner-corners" />
                        <img
                            src="/assets/qr.png"
                            alt="Resume QR Code"
                            className="qr-image"
                            width={140}
                            height={140}
                        />
                        <div className="scan-line" />
                    </div>
                </div>

            </div>
        </nav>
    );
}

export default Nav;
