'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import './Home.css';
import gsap from 'gsap';
import { Typewriter } from 'react-simple-typewriter';
import Particlethree from './particlethree';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import Image from 'next/image';

function Home() {
    const ashRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const hireBtnRef = useRef<HTMLButtonElement>(null);

    const [showOptions, setShowOptions] = useState(false);
    const [showPasswordPopup, setShowPasswordPopup] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // State for interactive hacker typing effects
    const [jsonCode, setJsonCode] = useState('');
    const [terminalLines, setTerminalLines] = useState<string[]>([]);
    const [showCursor, setShowCursor] = useState(true);

    const fullJson = `{
  "sys_user": "Shivam Paliwal",
  "clearance": "ROOT_ACCESS",
  "designation": [
    "Python Developer",
    "Full Stack Web",
    "AI Researcher"
  ],
  "status": "SYSTEM_READY",
  "location": "Nathdwara, RJ"
}`;

    useEffect(() => {
        // Snappy animations on load
        const tl = gsap.timeline();
        tl.fromTo(".cyber-terminal-name", 
            { opacity: 0, x: -50 },
            { opacity: 1, x: 0, duration: 0.3, ease: "steps(5)" }
        )
        .fromTo(".hacker-role", 
            { opacity: 0 },
            { opacity: 1, duration: 0.2 },
            "+=0.2"
        );

        // Custom Hacking Sequence Simulation
        const sequence = async () => {
            const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
            
            await delay(1000);
            setTerminalLines(prev => [...prev, "root@cyber-system:~# whoami"]);
            
            await delay(600);
            setTerminalLines(prev => [...prev, "Shivam Paliwal | ROOT ACCESS | ID: SP-77X"]);
            
            await delay(800);
            setTerminalLines(prev => [...prev, "root@cyber-system:~# ./fetch_profile.sh --format=json"]);
            
            await delay(600);
            setTerminalLines(prev => [...prev, "[*] Intercepting data traffic..."]);
            
            await delay(800);
            setTerminalLines(prev => [...prev, "[+] Decryption successful. Displaying JSON Card."]);
            
            // Start typing JSON content
            let i = 0;
            const typeJson = setInterval(() => {
                setJsonCode(fullJson.slice(0, i));
                i++;
                if (i > fullJson.length) clearInterval(typeJson);
            }, 30); // Dynamic typing speed
        };

        sequence();

        // Standard terminal cursor blinking effect
        const blink = setInterval(() => setShowCursor(p => !p), 500);
        return () => clearInterval(blink);
    }, []);

    const handleHireMeClick = () => {
        // Simple screen glitch FX on click
        document.body.classList.add('screen-glitch');
        setTimeout(() => document.body.classList.remove('screen-glitch'), 200);
        setShowOptions(true);
    };

    const closePopups = () => {
        setShowOptions(false);
        setShowPasswordPopup(false);
        setPassword('');
        setPasswordError('');
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Access password from .env file securely
        if (password?.trim() === process.env.NEXT_PUBLIC_APP_PASSWORD?.trim()) {
            window.location.href = "https://wa.me/916377396883";
        } else {
            setPasswordError('ACCESS DENIED: INVALID AUTHORIZATION KEY');
        }
    };

    return (
        <div id="home" className="cyber-root glassmorphism-bg">
            <div className="scanlines"></div>
            <Particlethree />
            
            <div className="lefthome">
                <div className="system-status">
                    <span className="blink-dot"></span> SECURE CONNECTION ESTABLISHED
                </div>

                <div className="hero-title">
                    <h1 className="cyber-terminal-name" data-text="SHIVAM PALIWAL">
                        SHIVAM PALIWAL
                    </h1>
                </div>

                <div className="hacker-role">
                    <span className="prompt">root@system:~#</span>
                    <span className="highlight-cyan">
                        <Typewriter
                            words={['execute_python_dev.sh', 'init_fullstack_env', 'run_ai_models.py']}
                            loop={true}
                            cursor
                            cursorStyle="█"
                            typeSpeed={50}
                            deleteSpeed={30}
                            delaySpeed={2000}
                        />
                    </span>
                </div>

                <button className="cyber-btn" onClick={handleHireMeClick}>
                    <span className="btn-text">INITIALIZE_CONTACT</span>
                    <div className="btn-decor-top"></div>
                    <div className="btn-decor-bottom"></div>
                </button>

                {/* Cyber Hacker Modal/Popup (Framer motion style) */}
                {showOptions && (
                    <div className="cyber-overlay" onClick={closePopups}>
                        <div className="cyber-glass-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">TARGET_ACQUISITION</div>
                            <button className="cyber-close" onClick={closePopups}>[X]</button>
                            
                            <div className="modal-grid">
                                <div className="cyber-card" onClick={() => window.location.href = "mailto:shivampaliwal244@gmail.com"}>
                                    <FontAwesomeIcon icon={faGoogle} className="cyber-icon red-glow" />
                                    <span>PROTOCOL: EMAIL</span>
                                </div>
                                <div className="cyber-card" onClick={(e) => { e.stopPropagation(); setShowPasswordPopup(true); }}>
                                    <FontAwesomeIcon icon={faWhatsapp} className="cyber-icon green-glow" />
                                    <span>PROTOCOL: SECURE_CHAT</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showPasswordPopup && (
                    <div className="cyber-overlay" onClick={closePopups}>
                        <div className="cyber-glass-modal auth-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header alert">! ENCRYPTED_CHANNEL !</div>
                            <button className="cyber-close" onClick={closePopups}>[X]</button>
                            
                            <div className="auth-body">
                                <p className="auth-text">Enter decryption authorization key:</p>
                                <form onSubmit={handlePasswordSubmit}>
                                    <input
                                        type="password"
                                        className="cyber-input"
                                        placeholder="0xHASH_KEY"
                                        value={password}
                                        onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }}
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

            <div className="righthome">
                {/* HUD data panels with glass FX replaced Avatar */}
                <div className="cyber-hud-display">
                    
                    {/* Panel 1: JSON Code Card with typing animation */}
                    <div className="hud-panel json-panel cyber-glass">
                        <div className="panel-header">
                            <span>intro.json</span>
                            <span className="lang">JSON</span>
                        </div>
                        <div className="panel-body pre-wrap">
                            {jsonCode}
                            {jsonCode.length < fullJson.length && showCursor ? '█' : ''}
                        </div>
                    </div>

                    {/* Panel 2: macOS Style Hacker Terminal */}
                    <div className="hud-panel terminal-panel cyber-glass">
                        <div className="mac-header">
                            <div className="mac-buttons">
                                <span className="mac-btn close"></span>
                                <span className="mac-btn min"></span>
                                <span className="mac-btn max"></span>
                            </div>
                            <span className="mac-title">root@cyber-ai — zsh</span>
                        </div>
                        <div className="terminal-content">
                            {terminalLines.map((line, idx) => (
                                <p key={idx} className={line.startsWith('root@') ? 'term-cmd' : 'term-out'}>
                                    {line}
                                </p>
                            ))}
                            <p className="term-cmd">
                                root@cyber-system:~# {showCursor ? '█' : ''}
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Home;