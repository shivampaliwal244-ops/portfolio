'use client';

import React, { useEffect, useMemo, useState } from 'react';
import './Home.css';
import gsap from 'gsap';
import { Typewriter } from 'react-simple-typewriter';
import Particlethree from './particlethree';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

function Home() {
    // Controls contact options popup
    const [showOptions, setShowOptions] = useState(false);

    // Controls password popup for WhatsApp secure chat
    const [showPasswordPopup, setShowPasswordPopup] = useState(false);

    // Stores user-entered password
    const [password, setPassword] = useState('');

    // Stores password/auth error message
    const [passwordError, setPasswordError] = useState('');

    // JSON typing animation state
    const [jsonCode, setJsonCode] = useState('');

    // Terminal output lines
    const [terminalLines, setTerminalLines] = useState<string[]>([]);

    // Cursor blinking state
    const [showCursor, setShowCursor] = useState(true);

    // Static JSON content shown in right panel
    const fullJson = useMemo(
        () => `{
  "sys_user": "Shivam Paliwal",
  "clearance": "ROOT_ACCESS",
  "designation": [
    "Python Developer",
    "Full Stack Web Developer",
    "AI Researcher"
  ],
  "status": "SYSTEM_READY",
  "network": "ENCRYPTED",
  "location": "Nathdwara, RJ"
}`,
        []
    );

    useEffect(() => {
        // GSAP intro animation timeline
        const tl = gsap.timeline();

        tl.fromTo(
            '.cyber-terminal-name',
            { opacity: 0, x: -50 },
            { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }
        )
            .fromTo(
                '.hacker-role',
                { opacity: 0, y: 16 },
                { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
                '-=0.15'
            )
            .fromTo(
                '.system-status',
                { opacity: 0 },
                { opacity: 1, duration: 0.35 },
                '-=0.2'
            )
            .fromTo(
                '.cyber-btn',
                { opacity: 0, scale: 0.95 },
                { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' },
                '-=0.1'
            );

        let jsonInterval: ReturnType<typeof setInterval> | null = null;
        let mounted = true;

        const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

        // Sequential terminal animation
        const sequence = async () => {
            await delay(700);
            if (!mounted) return;
            setTerminalLines((prev) => [...prev, 'root@cyber-system:~# whoami']);

            await delay(500);
            if (!mounted) return;
            setTerminalLines((prev) => [...prev, 'Shivam Paliwal | ROOT ACCESS | ID: SP-77X']);

            await delay(650);
            if (!mounted) return;
            setTerminalLines((prev) => [...prev, 'root@cyber-system:~# ./fetch_profile.sh --format=json']);

            await delay(500);
            if (!mounted) return;
            setTerminalLines((prev) => [...prev, '[*] Scanning encrypted portfolio node...']);

            await delay(650);
            if (!mounted) return;
            setTerminalLines((prev) => [...prev, '[+] Threat-safe handshake established.']);

            await delay(450);
            if (!mounted) return;
            setTerminalLines((prev) => [...prev, '[+] Rendering identity payload...']);

            // Typing JSON one character at a time
            let i = 0;
            jsonInterval = setInterval(() => {
                if (!mounted) return;

                setJsonCode(fullJson.slice(0, i));
                i++;

                if (i > fullJson.length && jsonInterval) {
                    clearInterval(jsonInterval);
                }
            }, 18);
        };

        sequence();

        // Cursor blinking interval
        const blink = setInterval(() => {
            setShowCursor((prev) => !prev);
        }, 500);

        return () => {
            mounted = false;
            clearInterval(blink);
            if (jsonInterval) clearInterval(jsonInterval);
            tl.kill();
        };
    }, [fullJson]);

    // Small glitch effect on body
    const triggerBodyGlitch = () => {
        document.body.classList.add('screen-glitch');

        setTimeout(() => {
            document.body.classList.remove('screen-glitch');
        }, 220);
    };

    // Opens main contact options popup
    const handleHireMeClick = () => {
        triggerBodyGlitch();
        setShowOptions(true);
        setShowPasswordPopup(false);
        setPassword('');
        setPasswordError('');
    };

    // Closes all popups and resets auth input
    const closeAllPopups = () => {
        setShowOptions(false);
        setShowPasswordPopup(false);
        setPassword('');
        setPasswordError('');
    };

    // Opens WhatsApp password popup
    const handleOpenSecureChat = () => {
        setShowPasswordPopup(true);
        setPassword('');
        setPasswordError('');
    };

    // Opens email client
    const handleEmailClick = () => {
        window.location.href = 'mailto:shivampaliwal244@gmail.com';
    };

    // Checks password and opens WhatsApp if correct
    const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Read password from environment variable
        const envPassword = process.env.NEXT_PUBLIC_APP_PASSWORD?.trim();

        // If env variable is missing, show error
        if (!envPassword) {
            setPasswordError('AUTH KEY NOT CONFIGURED IN ENV');
            return;
        }

        // Compare entered password with env password
        if (password.trim() === envPassword) {
            // FIX: Use direct WhatsApp URL, not markdown link
window.open('https://wa.me/916377396883', '_blank', 'noopener,noreferrer');
            closeAllPopups();
        } else {
            setPasswordError('ACCESS DENIED: INVALID AUTHORIZATION KEY');
        }
    };

    return (
        <div id="home" className="cyber-root glassmorphism-bg">
            <div className="scanlines"></div>
            <div className="cyber-noise"></div>

            <Particlethree />

            <div className="lefthome">
                <div className="system-status">
                    <span className="blink-dot"></span>
                    SECURE CONNECTION ESTABLISHED
                </div>

                <div className="hero-title">
                    <h1 className="cyber-terminal-name">SHIVAM PALIWAL</h1>

                    <div className="name-sub-glow">
                        AI | FULL STACK | PYTHON | CYBER INSPIRED SYSTEMS
                    </div>
                </div>

                <div className="hacker-role">
                    <span className="prompt">root@system:~#</span>
                    <span className="highlight-cyan">
                        <Typewriter
                            words={[
                                'execute_python_dev.sh',
                                'init_fullstack_env',
                                'run_ai_models.py',
                                'secure_client_connection --live'
                            ]}
                            loop={true}
                            cursor
                            // FIX: Correct cursor character
                            cursorStyle="|"
                            typeSpeed={48}
                            deleteSpeed={28}
                            delaySpeed={1800}
                        />
                    </span>
                </div>

                <p className="hero-desc">
                    I build modern web systems, Python tools, and AI-powered applications
                    with a clean user experience and a futuristic cyber aesthetic.
                </p>

                <button className="cyber-btn" onClick={handleHireMeClick}>
                    <span className="btn-text">INITIALIZE_CONTACT</span>
                    <div className="btn-decor-top"></div>
                    <div className="btn-decor-bottom"></div>
                </button>
            </div>

            <div className="righthome">
                <div className="cyber-hud-display">
                    <div className="hud-panel json-panel cyber-glass">
                        <div className="panel-header">
                            <span>intro.json</span>
                            <span className="lang">JSON</span>
                        </div>

                        <div className="panel-body pre-wrap">
                            {jsonCode}
                            {jsonCode.length < fullJson.length && showCursor ? '|' : ''}
                        </div>
                    </div>

                    <div className="hud-panel terminal-panel cyber-glass">
                        <div className="mac-header">
                            <div className="mac-buttons">
                                <span className="mac-btn close"></span>
                                <span className="mac-btn min"></span>
                                <span className="mac-btn max"></span>
                            </div>
                            <span className="mac-title">root@cyber-ai - zsh</span>
                        </div>

                        <div className="terminal-content">
                            {terminalLines.map((line, idx) => (
                                <p
                                    key={idx}
                                    className={line.startsWith('root@') ? 'term-cmd' : 'term-out'}
                                >
                                    {line}
                                </p>
                            ))}

                            <p className="term-cmd">root@cyber-system:~# {showCursor ? '|' : ''}</p>
                        </div>
                    </div>
                </div>
            </div>

            {showOptions && (
                <div className="cyber-overlay" onClick={closeAllPopups}>
                    <div className="cyber-glass-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">TARGET_ACQUISITION</div>
                        <button className="cyber-close" onClick={closeAllPopups}>
                            [X]
                        </button>

                        <div className="modal-grid">
                            <div
                                className="cyber-card"
                                onClick={handleEmailClick}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') handleEmailClick();
                                }}
                            >
                                <FontAwesomeIcon icon={faGoogle} className="cyber-icon red-glow" />
                                <div className="card-text-wrap">
                                    <span>PROTOCOL: EMAIL</span>
                                    <small>shivampaliwal244@gmail.com</small>
                                </div>
                            </div>

                            <div
                                className="cyber-card"
                                onClick={handleOpenSecureChat}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') handleOpenSecureChat();
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faWhatsapp}
                                    className="cyber-icon green-glow"
                                />
                                <div className="card-text-wrap">
                                    <span>PROTOCOL: SECURE_CHAT</span>
                                    <small>Encrypted WhatsApp channel</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showPasswordPopup && (
                <div className="cyber-overlay top-layer" onClick={closeAllPopups}>
                    <div
                        className="cyber-glass-modal auth-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header alert">! ENCRYPTED_CHANNEL !</div>
                        <button className="cyber-close" onClick={closeAllPopups}>
                            [X]
                        </button>

                        <div className="auth-body">
                            <p className="auth-text">Enter decryption authorization key:</p>

                            <form onSubmit={handlePasswordSubmit}>
                                <input
                                    type="password"
                                    className="cyber-input"
                                    placeholder="0xHASH_KEY"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setPasswordError('');
                                    }}
                                    autoFocus
                                />

                                {passwordError && <p className="cyber-error">&gt; {passwordError}</p>}

                                <button type="submit" className="cyber-btn sm-btn">
                                    [ DECRYPT ]
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
