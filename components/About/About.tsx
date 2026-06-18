'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './About.css';

/* =========================================================
   TYPES
   ========================================================= */
type TerminalLine = {
  id: number;
  type: 'command' | 'output' | 'success' | 'warning' | 'muted';
  text: string;
};

type StatusItem = {
  label: string;
  value: string;
  state: 'online' | 'active' | 'verified' | 'connected' | 'running' | 'alert';
};

type ArsenalCategory = {
  id: string;
  title: string;
  code: string;
  color: string;
  items: { name: string; tag: string }[];
};

/* =========================================================
   COMPONENT
   ========================================================= */
const About = () => {
  const profileCardRef = useRef<HTMLDivElement | null>(null);

  const [activeArsenal, setActiveArsenal] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const [stars, setStars] = useState<React.JSX.Element[]>([]);
  const [nodes, setNodes] = useState<React.JSX.Element[]>([]);
  const [streams, setStreams] = useState<React.JSX.Element[]>([]);
  const [keywords, setKeywords] = useState<React.JSX.Element[]>([]);

  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [typedCommand, setTypedCommand] = useState('');

  /* =========================================================
     STATIC DATA
     ========================================================= */
  const dossierInfo = useMemo(
    () => [
      { label: 'IDENTITY', value: 'Shivam Paliwal' },
      { label: 'ROLE', value: 'AI Engineer / Full Stack Developer' },
      { label: 'ACADEMIC PROGRAM', value: 'BCA (Hons. with Research) + Minor in AI/ML' },
      { label: 'LOCATION', value: 'Gujarat, India' },
      { label: 'LANGUAGES', value: 'Hindi, English, Basic French' },
      { label: 'STATUS', value: 'ONLINE' },
      { label: 'AVAILABILITY', value: 'OPEN FOR WORK' },
      { label: 'TECH CLASSIFICATION', value: 'HIGH-VALUE TECHNICAL ASSET' }
    ],
    []
  );

  const missionData = useMemo(
    () => ({
      summary:
        'Candidate is a Computer Science specialist focused on intelligent systems, full stack product engineering, and applied AI development. Current trajectory indicates strong alignment with innovation-led software ecosystems.',
      focus:
        'Developing scalable web systems, integrating AI/ML workflows, improving user-facing digital experiences, and building practical software for real-world problem solving.',
      objective:
        'To engineer secure, impactful, and intelligent products that combine modern software architecture with machine learning and research-driven development.',
      research: [
        'Machine Learning Systems',
        'Applied AI Product Engineering',
        'Modern Frontend Architecture',
        'Backend API Design',
        'Developer Tooling & Workflow Efficiency',
        'Human-Centered UI/UX Systems'
      ]
    }),
    []
  );

  const academicRecords = useMemo(
    () => [
      { label: 'INSTITUTE RECORD', value: 'Parul Institute of Computer Application' },
      { label: 'UNIVERSITY NODE', value: 'Parul University, Gujarat' },
      { label: 'PROGRAM INFORMATION', value: 'BCA (Honours with Research)' },
      { label: 'RESEARCH TRACK', value: 'AI & Machine Learning' },
      { label: 'ACADEMIC TIMELINE', value: '2023 - 2027' },
      { label: 'PERFORMANCE INDEX', value: 'CGPA 7.90' }
    ],
    []
  );

  const arsenal = useMemo<ArsenalCategory[]>(
    () => [
      {
        id: 'web-systems',
        title: 'WEB SYSTEMS',
        code: 'PAYLOAD_WS_01',
        color: '#00e0ff',
        items: [
          { tag: 'ACTIVE', name: 'HTML5' },
          { tag: 'ACTIVE', name: 'CSS3' },
          { tag: 'VERIFIED', name: 'JavaScript' },
          { tag: 'DEPLOYED', name: 'React.js' },
          { tag: 'OPERATIONAL', name: 'Next.js' },
          { tag: 'VERIFIED', name: 'Tailwind CSS' }
        ]
      },
      {
        id: 'ai-modules',
        title: 'AI MODULES',
        code: 'NEURAL_AI_09',
        color: '#ff3b5c',
        items: [
          { tag: 'TRAINED', name: 'Python' },
          { tag: 'TRAINED', name: 'Scikit-learn' },
          { tag: 'OPERATIONAL', name: 'TensorFlow' },
          { tag: 'ACTIVE', name: 'Data Analysis' },
          { tag: 'VERIFIED', name: 'Machine Learning' }
        ]
      },
      {
        id: 'database-engine',
        title: 'DATABASE ENGINE',
        code: 'DB_CORE_04',
        color: '#39ff8a',
        items: [
          { tag: 'ACTIVE', name: 'SQL' },
          { tag: 'VERIFIED', name: 'PostgreSQL' },
          { tag: 'DEPLOYED', name: 'MongoDB' },
          { tag: 'OPERATIONAL', name: 'Firebase Realtime DB' },
          { tag: 'VERIFIED', name: 'DBMS Concepts' }
        ]
      },
      {
        id: 'cloud-infra',
        title: 'CLOUD INFRASTRUCTURE',
        code: 'UPLINK_CL_07',
        color: '#ffb020',
        items: [
          { tag: 'CONNECTED', name: 'Firebase' },
          { tag: 'DEPLOYED', name: 'REST APIs' },
          { tag: 'ACTIVE', name: 'Authentication' },
          { tag: 'OPERATIONAL', name: 'Node.js Services' }
        ]
      },
      {
        id: 'dev-tools',
        title: 'DEVELOPMENT TOOLS',
        code: 'EXPLOIT_DT_11',
        color: '#a855f7',
        items: [
          { tag: 'VERIFIED', name: 'Git' },
          { tag: 'ACTIVE', name: 'GitHub' },
          { tag: 'OPERATIONAL', name: 'VS Code' },
          { tag: 'DEPLOYED', name: 'Postman' },
          { tag: 'ACTIVE', name: 'npm' },
          { tag: 'VERIFIED', name: 'Figma' }
        ]
      },
      {
        id: 'security-knowledge',
        title: 'SECURITY KNOWLEDGE',
        code: 'SEC_AUDIT_13',
        color: '#ff6584',
        items: [
          { tag: 'VERIFIED', name: 'Authentication Flows' },
          { tag: 'ACTIVE', name: 'API Security Basics' },
          { tag: 'OPERATIONAL', name: 'Secure App Architecture' },
          { tag: 'TRAINED', name: 'System Design Thinking' }
        ]
      }
    ],
    []
  );

  const systemStatus = useMemo<StatusItem[]>(
    () => [
      { label: 'AI CORE', value: 'ONLINE', state: 'online' },
      { label: 'WEB STACK', value: 'ACTIVE', state: 'active' },
      { label: 'DATABASE', value: 'ACTIVE', state: 'active' },
      { label: 'CLOUD NODE', value: 'CONNECTED', state: 'connected' },
      { label: 'SECURITY', value: 'VERIFIED', state: 'verified' },
      { label: 'THREAT LEVEL', value: 'ELEVATED', state: 'alert' },
      { label: 'RESEARCH', value: 'RUNNING', state: 'running' }
    ],
    []
  );

  const terminalSequence = useMemo(
    () => [
      { type: 'command' as const, text: 'root@blackhat-sys:~$ execute ./extract_profile.sh' },
      { type: 'muted' as const, text: '[*] Parsing target dossier...' },
      { type: 'success' as const, text: '[+] Identity signature verified.' },
      { type: 'command' as const, text: 'root@blackhat-sys:~$ decrypt mission_log.dat' },
      { type: 'muted' as const, text: '[*] Decrypting mission directives...' },
      { type: 'success' as const, text: '[+] Report compiled successfully.' },
      { type: 'command' as const, text: 'root@blackhat-sys:~$ cat /var/dossier/academic.json' },
      { type: 'muted' as const, text: '[*] Reading institutional records...' },
      { type: 'success' as const, text: '[+] Academic file synced to dashboard.' },
      { type: 'command' as const, text: 'root@blackhat-sys:~$ load_modules --all' },
      { type: 'muted' as const, text: '[*] Loading technical capabilities...' },
      { type: 'success' as const, text: '[+] Capability index ready.' }
    ],
    []
  );

  /* =========================================================
     HELPERS
     ========================================================= */
  const formatJsonKey = (str: string) => `"${str.toLowerCase().replace(/ /g, '_')}"`;

  /* =========================================================
     BACKGROUND ELEMENT GENERATION
     Reduced intensity for better performance and clarity
     ========================================================= */
  useEffect(() => {
    const generatedStars = [...Array(26)].map((_, i) => (
      <span
        key={`star-${i}`}
        className="intel-star"
        style={
          {
            '--left': `${Math.random() * 100}%`,
            '--top': `${Math.random() * 100}%`,
            '--size': `${1 + Math.random() * 2}px`,
            '--delay': `${Math.random() * 6}s`,
            '--duration': `${3 + Math.random() * 4}s`
          } as React.CSSProperties
        }
      />
    ));

    const generatedNodes = [...Array(16)].map((_, i) => (
      <span
        key={`node-${i}`}
        className="neural-node"
        style={
          {
            '--left': `${12 + Math.random() * 76}%`,
            '--top': `${10 + Math.random() * 80}%`,
            '--delay': `${Math.random() * 3}s`,
            '--duration': `${2 + Math.random() * 3}s`
          } as React.CSSProperties
        }
      />
    ));

    const generatedStreams = [...Array(10)].map((_, i) => (
      <span
        key={`stream-${i}`}
        className="data-stream"
        style={
          {
            '--left': `${Math.random() * 100}%`,
            '--delay': `${Math.random() * 8}s`,
            '--duration': `${5 + Math.random() * 6}s`
          } as React.CSSProperties
        }
      />
    ));

    const cyberWords = ['ROOT', 'PAYLOAD', 'ACCESS', 'NEURAL', 'SYNC', 'ENCRYPTED'];
    const generatedKeywords = cyberWords.map((word, i) => (
      <span
        key={`${word}-${i}`}
        className="floating-keyword"
        style={
          {
            '--left': `${6 + Math.random() * 82}%`,
            '--top': `${8 + Math.random() * 80}%`,
            '--delay': `${Math.random() * 6}s`,
            '--duration': `${12 + Math.random() * 8}s`
          } as React.CSSProperties
        }
      >
        {word}
      </span>
    ));

    setStars(generatedStars);
    setNodes(generatedNodes);
    setStreams(generatedStreams);
    setKeywords(generatedKeywords);
  }, []);

  /* =========================================================
     AUTO PLAY FOR ARSENAL TABS
     ========================================================= */
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveArsenal((prev) => (prev + 1) % arsenal.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [arsenal.length, isAutoPlaying]);

  /* =========================================================
     TERMINAL TYPING ANIMATION
     ========================================================= */
  useEffect(() => {
    let mounted = true;
    let currentIndex = 0;
    let commandText = '';
    let charIndex = 0;
    let typingTimer: ReturnType<typeof setTimeout>;

    const resetTerminal = () => {
      if (!mounted) return;
      setTerminalLines([]);
      setTypedCommand('');
      currentIndex = 0;
      commandText = '';
      charIndex = 0;
      startSequence();
    };

    const startSequence = () => {
      if (!mounted) return;

      if (currentIndex >= terminalSequence.length) {
        typingTimer = setTimeout(resetTerminal, 3500);
        return;
      }

      const current = terminalSequence[currentIndex];

      if (current.type === 'command') {
        commandText = current.text;
        charIndex = 0;
        typeCommand();
      } else {
        setTerminalLines((prev) => [
          ...prev,
          {
            id: Date.now() + currentIndex,
            type: current.type,
            text: current.text
          }
        ]);
        currentIndex += 1;
        typingTimer = setTimeout(startSequence, 550);
      }
    };

    const typeCommand = () => {
      if (!mounted) return;

      if (charIndex <= commandText.length) {
        setTypedCommand(commandText.slice(0, charIndex));
        charIndex += 1;
        typingTimer = setTimeout(typeCommand, 28);
      } else {
        setTerminalLines((prev) => [
          ...prev,
          {
            id: Date.now() + currentIndex,
            type: 'command',
            text: commandText
          }
        ]);
        setTypedCommand('');
        currentIndex += 1;
        typingTimer = setTimeout(startSequence, 350);
      }
    };

    startSequence();

    return () => {
      mounted = false;
      clearTimeout(typingTimer);
    };
  }, [terminalSequence]);

  /* =========================================================
     DESKTOP ONLY 3D HOVER EFFECT
     Disabled on smaller screens for smoother mobile experience
     ========================================================= */
  useEffect(() => {
    const card = profileCardRef.current;
    if (!card) return;

    let frame = 0;

    const onMove = (e: MouseEvent) => {
      if (window.innerWidth < 992) return;
      if (frame) cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 65;
        const rotateY = (centerX - x) / 65;

        card.style.transform = `perspective(1400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    };

    const onLeave = () => {
      if (frame) cancelAnimationFrame(frame);
      card.style.transform = 'perspective(1400px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    };

    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      card.removeEventListener('mousemove', onMove);
      card.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  /* =========================================================
     MANUAL TAB CHANGE
     Pause autoplay briefly when user interacts
     ========================================================= */
  const handleArsenalChange = useCallback((index: number) => {
    setActiveArsenal(index);
    setIsAutoPlaying(false);

    const timer = setTimeout(() => {
      setIsAutoPlaying(true);
    }, 9000);

    return () => clearTimeout(timer);
  }, []);

  /* =========================================================
     RENDER
     ========================================================= */
  return (
    <section className="about-section cyber-about" id="about">
      {/* Background FX */}
      <div className="cyber-bg" aria-hidden="true">
        <div className="grid-layer" />
        <div className="scanlines" />
        <div className="crt-flicker" />

        <div className="glow-orb orb-1" />
        <div className="glow-orb orb-2" />
        <div className="glow-orb orb-3" />

        <div className="stars-layer">{stars}</div>
        <div className="streams-layer">{streams}</div>
        <div className="keywords-layer">{keywords}</div>

        <div className="neural-core-bg">
          <div className="brain-shell">{nodes}</div>
        </div>
      </div>

      <div className="about-container">
        {/* Header */}
        <header className="analysis-header">
          <div className="header-chip glitch-text" data-text="INTERPOL_RED_NOTICE // CLASSIFIED">
            INTERPOL_RED_NOTICE // CLASSIFIED
          </div>

          <h2 className="analysis-title">
            TARGET_DOSSIER: <span className="text-red-alert">[DECRYPTED]</span>
          </h2>

          <div className="header-status-grid">
            <div className="status-line box-corners">
              <span className="status-key">THREAT_LEVEL</span>
              <span className="status-separator">:</span>
              <span className="status-value alert">CRITICAL</span>
            </div>

            <div className="status-line box-corners">
              <span className="status-key">ENCRYPTION</span>
              <span className="status-separator">:</span>
              <span className="status-value">BYPASSED</span>
            </div>

            <div className="status-line box-corners">
              <span className="status-key">ROOT_ACCESS</span>
              <span className="status-separator">:</span>
              <span className="status-value verified">GRANTED</span>
            </div>

            <div className="status-line box-corners">
              <span className="status-key">DATA_STREAM</span>
              <span className="status-separator">:</span>
              <span className="status-value active">SYNCING</span>
            </div>
          </div>
        </header>

        {/* Main Grid Layout */}
        <div className="intel-layout">
          {/* =====================================================
             DOSSIER PANEL
             ===================================================== */}
          <section className="intel-panel dossier-panel" ref={profileCardRef}>
            <div className="panel-topbar">
              <span className="panel-label">CASE-FILE: 001 // IDENTITY</span>
              <span className="panel-badge live blink">REC_LIVE</span>
            </div>

            <div className="dossier-hero">
              <div className="asset-sigil" aria-hidden="true">
                <div className="sigil-core">SP</div>
                <span className="sigil-ring ring-a" />
                <span className="sigil-ring ring-b" />
                <div className="crosshair ch-tl" />
                <div className="crosshair ch-tr" />
                <div className="crosshair ch-bl" />
                <div className="crosshair ch-br" />
              </div>

              <div className="asset-meta">
                <h3 className="asset-name">Shivam Paliwal</h3>
                <p className="asset-role">&lt;AI_Engineer_FullStack_Developer /&gt;</p>

                <div className="asset-flags">
                  <span className="flag-item red">WANTED_FOR: INNOVATION</span>
                  <span className="flag-item">SYSTEM_BUILD_CAPABLE</span>
                </div>
              </div>
            </div>

            <div className="json-block">
              <span className="json-bracket">{'{'}</span>

              <div className="json-content">
                {dossierInfo.map((item, index) => (
                  <div className="json-line" key={`dossier-${index}`}>
                    <span className="json-key">{formatJsonKey(item.label)}</span>
                    <span className="json-colon">: </span>
                    <span className={item.value === 'ONLINE' ? 'json-value-green' : 'json-value'}>
                      &quot;{item.value}&quot;
                    </span>
                    {index < dossierInfo.length - 1 && <span className="json-comma">,</span>}
                  </div>
                ))}
              </div>

              <span className="json-bracket">{'}'}</span>
            </div>
          </section>

          {/* =====================================================
             MISSION PANEL
             ===================================================== */}
          <section className="intel-panel mission-panel">
            <div className="panel-topbar">
              <span className="panel-label">LOG_DUMP // MISSION_DIRECTIVES</span>
              <span className="panel-badge alert">CONFIDENTIAL</span>
            </div>

            <div className="mission-block log-style">
              <h3 className="panel-heading">{'>>'} TARGET_SUMMARY</h3>
              <p className="typewriter-text">{missionData.summary}</p>
            </div>

            <div className="mission-block log-style">
              <h3 className="panel-heading">{'>>'} ACTIVE_VECTOR</h3>
              <p className="typewriter-text">{missionData.focus}</p>
            </div>

            <div className="mission-block log-style">
              <h3 className="panel-heading">{'>>'} ENDGAME_OBJECTIVE</h3>
              <p className="typewriter-text">{missionData.objective}</p>
            </div>

            <div className="mission-block log-style">
              <h3 className="panel-heading">{'>>'} KNOWN_EXPLOIT_AREAS</h3>
              <div className="research-tags">
                {missionData.research.map((item, index) => (
                  <span className="research-tag hack-tag" key={`research-${index}`}>
                    [{item.toUpperCase().replace(/ /g, '_')}]
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* =====================================================
             ACADEMIC PANEL
             ===================================================== */}
          <section className="intel-panel academic-panel">
            <div className="panel-topbar">
              <span className="panel-label">CASE-FILE: 002 // ACADEMICS</span>
              <span className="panel-badge">UNENCRYPTED</span>
            </div>

            <div className="json-block small-json">
              <span className="json-bracket">const</span>{' '}
              <span className="json-var">academic_record</span>{' '}
              <span className="json-bracket">= {'{'}</span>

              <div className="json-content">
                {academicRecords.map((record, index) => (
                  <div className="json-line" key={`academic-${index}`}>
                    <span className="json-key">{formatJsonKey(record.label)}</span>
                    <span className="json-colon">: </span>
                    <span className={record.label === 'PERFORMANCE INDEX' ? 'json-value-amber' : 'json-value'}>
                      &quot;{record.value}&quot;
                    </span>
                    {index < academicRecords.length - 1 && <span className="json-comma">,</span>}
                  </div>
                ))}
              </div>

              <span className="json-bracket">{'}'}</span>
            </div>
          </section>

          {/* =====================================================
             ARSENAL PANEL
             ===================================================== */}
          <section className="intel-panel arsenal-panel">
            <div className="panel-topbar">
              <span className="panel-label">PAYLOAD_LIBRARY // ARSENAL</span>
              <span className={`panel-badge ${isAutoPlaying ? 'live' : ''}`}>
                {isAutoPlaying ? 'AUTO-INJECT' : 'MANUAL-OVERRIDE'}
              </span>
            </div>

            <div className="arsenal-nav">
              {arsenal.map((category, index) => (
                <button
                  key={category.id}
                  className={`arsenal-tab hack-tab ${activeArsenal === index ? 'active' : ''}`}
                  onClick={() => handleArsenalChange(index)}
                  style={{ ['--tab-color' as string]: category.color }}
                  aria-label={`Load ${category.title}`}
                  type="button"
                >
                  <span className="tab-code">{category.code}</span>
                  <span className="tab-title">./{category.id}.sh</span>
                </button>
              ))}
            </div>

            <div
              className="arsenal-display hack-display"
              style={{ ['--accent-color' as string]: arsenal[activeArsenal].color }}
            >
              <div className="arsenal-header">
                <div>
                  <span className="arsenal-kicker">EXECUTING MODULE</span>
                  <h3 className="glitch-title">{arsenal[activeArsenal].title}</h3>
                </div>

                <span className="arsenal-code border-blink">{arsenal[activeArsenal].code}</span>
              </div>

              <div className="arsenal-items">
                {arsenal[activeArsenal].items.map((item, index) => (
                  <div className="arsenal-item hack-item" key={`item-${index}`}>
                    <span className="arsenal-tag" style={{ color: 'var(--accent-color)' }}>
                      [ {item.tag} ]
                    </span>
                    <span className="arsenal-name">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* =====================================================
             STATUS CONSOLE
             ===================================================== */}
          <section className="intel-panel status-panel">
            <div className="panel-topbar">
              <span className="panel-label">SYS_MONITOR // STATUS</span>
              <span className="panel-badge live">PULSE_CHECK</span>
            </div>

            <div className="status-console">
              {systemStatus.map((item, index) => (
                <div className="console-row" key={`status-${index}`}>
                  <span className="console-key">{item.label}</span>
                  <span className="console-dots" />
                  <span className={`console-value ${item.state}`}>[{item.value}]</span>
                </div>
              ))}
            </div>
          </section>

          {/* =====================================================
             TERMINAL PANEL
             ===================================================== */}
          <section className="intel-panel terminal-panel">
            <div className="panel-topbar">
              <span className="panel-label">BASH // ROOT_TERMINAL</span>
              <span className="panel-badge alert blink">UID:0</span>
            </div>

            <div className="terminal-window hack-terminal">
              <div className="terminal-head">
                <span className="terminal-dot red" />
                <span className="terminal-dot amber" />
                <span className="terminal-dot green" />
                <span className="terminal-title">ssh -p 1337 root@blackhat-sys</span>
              </div>

              <div className="terminal-body">
                {terminalLines.map((line) => (
                  <div className={`terminal-line ${line.type}`} key={`term-${line.id}`}>
                    {line.text}
                  </div>
                ))}

                {typedCommand && (
                  <div className="terminal-line command typing-line">
                    {typedCommand}
                    <span className="terminal-caret" />
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};

export default About;
