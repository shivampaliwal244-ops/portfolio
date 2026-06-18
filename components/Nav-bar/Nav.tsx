'use client';

import React, { useState, useCallback, useEffect } from 'react';
import './Nav.css';
import { Link } from 'react-scroll';

function Nav(): React.JSX.Element {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggleMenu = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    const closeMenu = useCallback(() => {
        setIsOpen(false);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeMenu();
        };

        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [closeMenu]);

    const navItems = ['Home', 'About', 'Projects', 'Contact'];

    return (
        <>
            <nav className="navbar" aria-label="Main navigation">
                {/* Logo / Brand */}
                <div className="logo" aria-label="Cyber AI Security Intelligence Hub">
                    <span className="logo-status" aria-hidden="true" />
                    <div className="logo-text-wrap">
                        <span className="logo-kicker">ACTIVE</span>
                        <h1 className="logo-shine">CYBER AI SECURITY</h1>
                        <span className="logo-sub">INTELLIGENCE HUB</span>
                    </div>
                </div>

                {/* Hamburger */}
                <button
                    className={`hamburger ${isOpen ? 'active' : ''}`}
                    onClick={toggleMenu}
                    aria-label={isOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={isOpen}
                    aria-controls="mobile-menu"
                    type="button"
                >
                    <span className="hamburger-box">
                        <span className="hamburger-line hamburger-line--top" />
                        <span className="hamburger-line hamburger-line--middle" />
                        <span className="hamburger-line hamburger-line--bottom" />
                    </span>
                </button>
            </nav>

            {/* Overlay */}
            <div
                className={`menu-overlay ${isOpen ? 'active' : ''}`}
                onClick={closeMenu}
                aria-hidden="true"
            />

            {/* Sidebar / Mobile menu */}
            <aside
                id="mobile-menu"
                className={`mobile-menu ${isOpen ? 'active' : ''}`}
                aria-hidden={!isOpen}
            >
                <ul className="mobile-menu-list">
                    {navItems.map((item) => (
                        <li key={item}>
                            <Link
                                to={item}
                                spy={true}
                                smooth={true}
                                duration={500}
                                offset={-80}
                                onClick={closeMenu}
                            >
                                {item}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* QR section */}
                <div className="menu-qr">
                    <p>Resume Access Node</p>
                    <div className="qr-wrapper">
                        <div className="scanner-corners" />
                        <img
                            src="/assets/qr.png"
                            alt="Resume QR Code"
                            className="qr-image"
                            width={140}
                            height={140}
                            loading="lazy"
                        />
                        <div className="scan-line" />
                    </div>
                </div>
            </aside>
        </>
    );
}

export default Nav;
