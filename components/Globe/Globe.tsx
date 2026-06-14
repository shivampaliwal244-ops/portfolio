'use client';
// Globe.tsx
// ============================================
// PROFESSIONAL 3D TECH UNIVERSE GLOBE
// Sleek Matte Holographic version with Hover Glow
// ============================================

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./Globe.css";

const skills = [
  { name: "React",      icon: "/logos/react.svg", color: "#61DAFB", category: "frontend" },
  { name: "Next.js",    icon: "/logos/nextjs.svg", color: "#ffffff", category: "frontend" },
  { name: "Node.js",    icon: "/logos/nodejs.svg", color: "#339933", category: "backend" },
  { name: "TypeScript", icon: "/logos/typescript.svg", color: "#3178C6", category: "frontend" },
  { name: "PostgreSQL", icon: "/logos/postgresql.svg", color: "#4169E1", category: "backend" },
  { name: "Html5",      icon: "/logos/html5.svg", color: "#E34C26", category: "frontend" },
  { name: "Flutter",    icon: "/logos/flutter.svg", color: "#00C5D5", category: "frontend" },
  { name: "GSAP",       icon: "/logos/gsap-greensock.svg", color: "#88CE02", category: "frontend" },
  { name: "Three.js",   icon: "/logos/Three.js.svg", color: "#ffffff", category: "frontend" },
  { name: "AI-ML",      icon: "/logos/AI-ML.svg", color: "#E10098", category: "backend" },
  { name: "Firebase",   icon: "/logos/firebase.svg", color: "#FFCA28", category: "backend" },
  { name: "MongoDB",    icon: "/logos/mongodb.svg", color: "#47A248", category: "backend" },
];

export default function Globe() {
  const mountRef    = useRef<HTMLDivElement>(null);
  const tooltipRef  = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animIdRef   = useRef<number>(0);

  const [isVisible,       setIsVisible]       = useState(false);
  const [isMobile,        setIsMobile]        = useState(false);
  const [activeCategory,  setActiveCategory]  = useState("all");
  const [currentTime,     setCurrentTime]     = useState("00:00");
  const [date,            setDate]            = useState("");
  const [metrics,         setMetrics]         = useState({
    uptime: "99.9%", latency: "12ms", throughput: "1.2k/s",
  });
  const [streamBars, setStreamBars] = useState<number[]>([]);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    setStreamBars([...Array(8)].map(() => 20 + Math.random() * 60));

    const tick = () => {
      const n = new Date();
      setCurrentTime(n.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }));
      setDate(n.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
    };
    tick();
    const t1 = setInterval(tick, 1000);

    const t2 = setInterval(() => {
      setMetrics({
        uptime:     `${(99.5 + Math.random() * 0.5).toFixed(1)}%`,
        latency:    `${Math.floor(10 + Math.random() * 8)}ms`,
        throughput: `${(1.0 + Math.random() * 0.4).toFixed(1)}k/s`,
      });
      setStreamBars([...Array(8)].map(() => 20 + Math.random() * 60));
    }, 3000);

    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);

  /* ── THREE.JS GLOBE ── */
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene  = new THREE.Scene();
    const W = container.clientWidth  || 500;
    const H = container.clientHeight || 400;

    // CAMERA: Moved further back to make the globe smaller (medium size)
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 1000);
    camera.position.set(0, 0, isMobile ? 3.8 : 3.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping  = true;
    controls.dampingFactor  = 0.05;
    controls.enableZoom     = false;
    controls.enablePan      = false;
    controls.autoRotate     = true;
    controls.autoRotateSpeed = 0.6;

    /* ── SLEEK MATTE HOLOGRAPHIC GLOBE ── */
    const globeGeo = new THREE.SphereGeometry(1, 64, 64);
    
    // Matte dark base
    const globeMat = new THREE.MeshPhongMaterial({
      color:       0x030812, // Very dark blue/black
      emissive:    0x000000,
      specular:    0x111111, // Very subtle shine
      shininess:   5,        // Matte finish
      transparent: true,
      opacity:     0.85,
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    scene.add(globe);

    // Glowing Holographic Wireframe
    const wireMat = new THREE.MeshBasicMaterial({
      color:       0x2a6aff,
      wireframe:   true,
      transparent: true,
      opacity:     0.1, // Subtle high-tech grid
      blending:    THREE.AdditiveBlending,
    });
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.002, 32, 32), wireMat));

    // Atmosphere
    const atmMat = new THREE.MeshBasicMaterial({
      color:       0x4a9eff,
      transparent: true,
      opacity:     0.05,
      side:        THREE.BackSide,
      blending:    THREE.AdditiveBlending,
    });
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.15, 32, 32), atmMat));

    /* Lights */
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(5, 3, 5);
    scene.add(dirLight);

    /* Stars */
    const starGeo = new THREE.BufferGeometry();
    const starPos: number[] = [];
    for (let i = 0; i < 1500; i++) {
      starPos.push((Math.random() - 0.5) * 80, (Math.random() - 0.5) * 80, (Math.random() - 0.5) * 80);
    }
    starGeo.setAttribute("position", new THREE.Float32BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true, opacity: 0.4 })));

    /* Skill dots & Hover Halos */
    const skillMeshes: { mesh: THREE.Mesh; halo: THREE.Mesh; skill: typeof skills[0]; pos: THREE.Vector3 }[] = [];
    const dotGeo = new THREE.SphereGeometry(0.045, 16, 16);
    const haloGeo = new THREE.SphereGeometry(0.09, 16, 16);

    skills.forEach((sk, i) => {
      const phi   = Math.acos(-1 + (2 * i) / skills.length);
      const theta = Math.sqrt(skills.length * Math.PI) * phi;
      const pos   = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.cos(phi),
        Math.sin(phi) * Math.sin(theta)
      );

      const color  = new THREE.Color(sk.color === "#000000" ? "#888888" : sk.color);
      
      const dotMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 });
      const dot    = new THREE.Mesh(dotGeo, dotMat);
      dot.position.copy(pos);
      globe.add(dot);

      // Halo (Invisible by default, only shows on hover)
      const haloMat = new THREE.MeshBasicMaterial({ 
        color, 
        transparent: true, 
        opacity: 0.0, // Initially invisible (No blinking)
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.copy(pos);
      globe.add(halo);

      skillMeshes.push({ mesh: dot, halo: halo, skill: sk, pos });
    });

    const raycaster = new THREE.Raycaster();
    const mouse     = new THREE.Vector2(-99, -99);
    let   hoveredIdx = -1;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      mouse.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
    };
    const onTouch = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      const rect = container.getBoundingClientRect();
      mouse.x =  ((e.touches[0].clientX - rect.left) / rect.width)  * 2 - 1;
      mouse.y = -((e.touches[0].clientY - rect.top)  / rect.height) * 2 + 1;
    };
    
    container.addEventListener("mousemove",  onMouseMove);
    container.addEventListener("touchmove",  onTouch, { passive: true });
    container.addEventListener("mouseleave", () => { mouse.set(-99, -99); hoveredIdx = -1; hideTip(); });

    const ro = new ResizeObserver(() => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(container);

    /* Tooltip with Smooth Color Glow */
    const showTip = (sk: typeof skills[0], screenPos: THREE.Vector3) => {
      const tip = tooltipRef.current;
      if (!tip) return;
      
      const rect = container.getBoundingClientRect();
      let x = ((screenPos.x + 1) / 2) * rect.width;
      let y = ((-screenPos.y + 1) / 2) * rect.height;
      
      const tipWidth = 160; 
      if (x + tipWidth > rect.width) x = rect.width - tipWidth - 10;
      if (x < 10) x = 10;
      if (y < 40) y = 40;

      tip.style.left = `${x + 14}px`;
      tip.style.top  = `${y - 40}px`;
      
      // Dynamic Glowing Box Shadow on Touch/Hover
      tip.style.boxShadow = `0 15px 40px rgba(0, 0, 0, 0.7), 0 0 20px ${sk.color}88`;
      tip.style.borderColor = sk.color;

      tip.innerHTML  = `
        <div class="tooltip-icon" style="border-color:${sk.color}; background: radial-gradient(circle, ${sk.color}33 0%, transparent 80%);">
          <img src="${sk.icon}" alt="${sk.name}" style="filter: drop-shadow(0 0 5px ${sk.color});" />
        </div>
        <span class="tooltip-name" style="text-shadow: 0 0 8px ${sk.color}99;">${sk.name}</span>`;
      tip.classList.add("visible");
    };
    
    const hideTip = () => {
      if (tooltipRef.current) {
        tooltipRef.current.classList.remove("visible");
      }
    };

    const clock = new THREE.Clock();
    const animate = () => {
      animIdRef.current = requestAnimationFrame(animate);
      controls.update();

      /* Raycasting to detect hover */
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(skillMeshes.map(s => s.mesh));

      if (hits.length > 0) {
        const idx = skillMeshes.findIndex(s => s.mesh === hits[0].object);
        if (idx !== hoveredIdx) {
          hoveredIdx = idx;
          const { skill, mesh } = skillMeshes[idx];
          const sp = mesh.position.clone().project(camera);
          showTip(skill, sp);
          controls.autoRotate = false;
        }
      } else {
        if (hoveredIdx !== -1) { 
          hideTip(); 
          controls.autoRotate = true; 
          hoveredIdx = -1; 
        }
      }

      /* SMOOTH ANIMATION: Only glow the hovered dot */
      skillMeshes.forEach(({ mesh, halo }, i) => {
        const isHovered = (i === hoveredIdx);
        
        // Target values based on hover state
        const targetScale = isHovered ? 1.4 : 1.0;
        const targetHaloScale = isHovered ? 1.8 : 1.0;
        const targetHaloOpacity = isHovered ? 0.8 : 0.0; // Glow only on hover

        // Lerp (Smooth transition)
        mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
        halo.scale.lerp(new THREE.Vector3(targetHaloScale, targetHaloScale, targetHaloScale), 0.15);
        
        const haloMat = halo.material as THREE.MeshBasicMaterial;
        haloMat.opacity += (targetHaloOpacity - haloMat.opacity) * 0.15;
      });

      renderer.render(scene, camera);
    };
    animate();

    setTimeout(() => setIsVisible(true), 100);

    return () => {
      cancelAnimationFrame(animIdRef.current);
      ro.disconnect();
      container.removeEventListener("mousemove",  onMouseMove);
      container.removeEventListener("touchmove",  onTouch);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [isMobile]);

  const filteredCount = activeCategory === "all"
    ? skills.length
    : skills.filter(s => s.category === activeCategory).length;

  return (
    <div className={`globe-wrapper ${isVisible ? "visible" : ""}`}>
      {/* ── LEFT PANEL ── */}
      <div className="side-panel left-panel">
        <div className="panel-content">
          <div className="panel-clock">
            <div className="clock-time">{currentTime}</div>
            <div className="clock-date">{date}</div>
          </div>
          <div className="panel-metrics">
            {[
              { label: "Uptime",      value: metrics.uptime },
              { label: "Latency",     value: metrics.latency },
              { label: "Throughput",  value: metrics.throughput },
            ].map(m => (
              <div className="metric-item" key={m.label}>
                <span className="metric-value">{m.value}</span>
                <span className="metric-label">{m.label}</span>
              </div>
            ))}
          </div>
          <div className="stream-bars">
            {streamBars.map((h, i) => (
              <div key={i} className="stream-bar" style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="connection-status">
            <div className="connection-dot" /> Online
          </div>
        </div>
      </div>

      {/* ── GLOBE ── */}
      <div className="globe-container">
        <div className="globe-bg-gradient" />
        <div className="globe-grid-pattern" />
        
        <div ref={mountRef} className="globe-canvas" />
        <div ref={tooltipRef} className="skill-tooltip" />

        <div className="corner-decoration top-left" />
        <div className="corner-decoration top-right" />
        <div className="corner-decoration bottom-left" />
        <div className="corner-decoration bottom-right" />

        <div className="mobile-skill-badge">
          <span className="badge-count">{skills.length}</span>
          <span className="badge-label">Skills</span>
        </div>

        <div className="globe-overlay">
          <div className="drag-instruction">
            <div className="drag-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M12 12v.01"/>
                <path d="M3 12h18M12 3v18" strokeOpacity="0.4"/>
              </svg>
            </div>
            <span className="drag-text">Drag to Explore</span>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="side-panel right-panel">
        <div className="panel-content">
          <div className="skill-count">
            <div className="count-number">{filteredCount}</div>
            <div className="count-label">Skills</div>
          </div>
          <div className="status-indicator">
            <div className="status-dot" /> Active
          </div>
          <div className="skill-categories">
            <div className="category-label">Filter</div>
            {[
              { id: "all",      label: "All",      count: skills.length },
              { id: "frontend", label: "Frontend",  count: skills.filter(s => s.category === "frontend").length },
              { id: "backend",  label: "Backend",   count: skills.filter(s => s.category === "backend").length },
            ].map(cat => (
              <button
                key={cat.id}
                className={`category-btn ${activeCategory === cat.id ? "active" : ""}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <span className="cat-name">{cat.label}</span>
                <span className="cat-count">{cat.count}</span>
              </button>
            ))}
          </div>
          <div className="proficiency-section">
            <div className="proficiency-label">Proficiency</div>
            <div className="proficiency-bars">
              {[
                { level: "Expert",      pct: "90%",  cls: "expert"       },
                { level: "Advanced",    pct: "75%",  cls: "advanced"     },
                { level: "Intermediate", pct: "55%",  cls: "intermediate" },
              ].map(p => (
                <div className="prof-item" key={p.level}>
                  <span className="prof-level">{p.level}</span>
                  <div className="prof-bar">
                    <div className={`prof-fill ${p.cls}`} style={{ width: p.pct }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="version-info">
            <span className="version-label">v2.0</span>
            <span className="build-date">2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}