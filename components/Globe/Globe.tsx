'use client';

// Globe.tsx
// ======================================================
// PREMIUM 3D AI / SECURITY GLOBE
// - Glassmorphism UI
// - Hacker / cyber glow styling
// - Smooth hover halos
// - Mobile + desktop responsive
// - Performance-minded Three.js setup
// - Category filtering actually affects globe dots
// ======================================================

import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './Globe.css';

/**
 * Skill dataset
 * You can keep extending this safely.
 */
const skills = [
  { name: 'React', icon: '/logos/react.svg', color: '#61DAFB', category: 'frontend' },
  { name: 'Next.js', icon: '/logos/nextjs.svg', color: '#ffffff', category: 'frontend' },
  { name: 'Node.js', icon: '/logos/nodejs.svg', color: '#339933', category: 'backend' },
  { name: 'TypeScript', icon: '/logos/typescript.svg', color: '#3178C6', category: 'frontend' },
  { name: 'PostgreSQL', icon: '/logos/postgresql.svg', color: '#4169E1', category: 'backend' },
  { name: 'Html5', icon: '/logos/html5.svg', color: '#E34C26', category: 'frontend' },
  { name: 'Flutter', icon: '/logos/flutter.svg', color: '#00C5D5', category: 'frontend' },
  { name: 'GSAP', icon: '/logos/gsap-greensock.svg', color: '#88CE02', category: 'frontend' },
  { name: 'Three.js', icon: '/logos/Three.js.svg', color: '#ffffff', category: 'frontend' },
  { name: 'AI-ML', icon: '/logos/AI-ML.svg', color: '#ff2bd6', category: 'backend' },
  { name: 'Firebase', icon: '/logos/firebase.svg', color: '#FFCA28', category: 'backend' },
  { name: 'MongoDB', icon: '/logos/mongodb.svg', color: '#47A248', category: 'backend' },
] as const;

type Skill = (typeof skills)[number];

type SkillMeshRecord = {
  mesh: THREE.Mesh;
  halo: THREE.Mesh;
  ring: THREE.Mesh;
  skill: Skill;
  pos: THREE.Vector3;
};

export default function Globe() {
  const mountRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animIdRef = useRef<number>(0);
  const visibilityTimeoutRef = useRef<number | null>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'frontend' | 'backend'>('all');
  const [currentTime, setCurrentTime] = useState('00:00');
  const [date, setDate] = useState('');
  const [metrics, setMetrics] = useState({
    uptime: '99.9%',
    latency: '12ms',
    throughput: '1.2k/s',
  });
  const [streamBars, setStreamBars] = useState<number[]>([]);

  /**
   * Filtered skills for UI counts and actual globe rendering logic
   */
  const filteredSkills = useMemo(() => {
    if (activeCategory === 'all') return skills;
    return skills.filter((s) => s.category === activeCategory);
  }, [activeCategory]);

  /**
   * Lightweight UI timers
   */
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    setStreamBars([...Array(8)].map(() => 20 + Math.random() * 60));

    const tick = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
      setDate(
        now.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })
      );
    };

    tick();

    const t1 = window.setInterval(tick, 1000);

    const t2 = window.setInterval(() => {
      setMetrics({
        uptime: `${(99.5 + Math.random() * 0.49).toFixed(2)}%`,
        latency: `${Math.floor(8 + Math.random() * 10)}ms`,
        throughput: `${(1.0 + Math.random() * 0.6).toFixed(1)}k/s`,
      });
      setStreamBars([...Array(8)].map(() => 20 + Math.random() * 60));
    }, 2600);

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(t1);
      clearInterval(t2);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  /**
   * Main Three.js effect
   * Rebuilds when:
   * - mobile state changes
   * - category changes
   *
   * For this use-case that's okay and keeps code simple/clean.
   */
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let disposed = false;

    // -----------------------------
    // Scene / Camera / Renderer
    // -----------------------------
    const scene = new THREE.Scene();

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 400;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, isMobile ? 4.2 : 3.45);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true,
    });

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // -----------------------------
    // Controls
    // -----------------------------
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.045;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.rotateSpeed = 0.75;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.55;
    controls.minPolarAngle = Math.PI * 0.24;
    controls.maxPolarAngle = Math.PI * 0.76;

    // -----------------------------
    // Globe Core
    // -----------------------------
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const globeGeo = new THREE.SphereGeometry(1, 64, 64);

    // Matte dark cyber base
    const globeMat = new THREE.MeshPhongMaterial({
      color: 0x040912,
      emissive: 0x07111f,
      specular: 0x223344,
      shininess: 12,
      transparent: true,
      opacity: 0.94,
    });

    const globe = new THREE.Mesh(globeGeo, globeMat);
    globeGroup.add(globe);

    // Inner subtle core glow
    const innerGlowMat = new THREE.MeshBasicMaterial({
      color: 0x00cfff,
      transparent: true,
      opacity: 0.035,
      blending: THREE.AdditiveBlending,
    });
    const innerGlow = new THREE.Mesh(
      new THREE.SphereGeometry(0.94, 32, 32),
      innerGlowMat
    );
    globeGroup.add(innerGlow);

    // Main holographic wireframe
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x40c4ff,
      wireframe: true,
      transparent: true,
      opacity: 0.13,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const wireSphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.003, 28, 28),
      wireMat
    );
    globeGroup.add(wireSphere);

    // Secondary outer wire shell for AI/cyber feel
    const outerWireMat = new THREE.MeshBasicMaterial({
      color: 0x8a5cff,
      wireframe: true,
      transparent: true,
      opacity: 0.05,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const outerWireSphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.08, 24, 24),
      outerWireMat
    );
    globeGroup.add(outerWireSphere);

    // Atmosphere shell
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: 0x55c7ff,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.17, 32, 32),
      atmosphereMat
    );
    globeGroup.add(atmosphere);

    // -----------------------------
    // Lights
    // -----------------------------
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xaad8ff, 1.2);
    dirLight1.position.set(5, 3, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x7d5cff, 0.5);
    dirLight2.position.set(-4, -2, -3);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x00e5ff, 1.1, 8, 2);
    pointLight.position.set(0, 0, 3);
    scene.add(pointLight);

    // -----------------------------
    // Stars
    // -----------------------------
    const starGeometry = new THREE.BufferGeometry();
    const starPositions: number[] = [];

    const starCount = isMobile ? 700 : 1400;
    for (let i = 0; i < starCount; i++) {
      starPositions.push(
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 80
      );
    }

    starGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(starPositions, 3)
    );

    const stars = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({
        color: 0xd7f3ff,
        size: isMobile ? 0.035 : 0.045,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    scene.add(stars);

    // -----------------------------
    // Orbit rings for "AI / Hacker" look
    // -----------------------------
    const orbitRings: THREE.LineLoop[] = [];
    const ringConfigs = [
      { radius: 1.32, color: 0x00d9ff, tiltX: 1.1, tiltY: 0.15, opacity: 0.16 },
      { radius: 1.46, color: 0x7a5cff, tiltX: 0.3, tiltY: 1.0, opacity: 0.11 },
      { radius: 1.62, color: 0x00ffb3, tiltX: 0.85, tiltY: 0.55, opacity: 0.08 },
    ];

    ringConfigs.forEach((cfg) => {
      const ringGeo = new THREE.BufferGeometry();
      const points: number[] = [];
      const segments = 180;

      for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        points.push(Math.cos(angle) * cfg.radius, Math.sin(angle) * cfg.radius, 0);
      }

      ringGeo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));

      const ringMat = new THREE.LineBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: cfg.opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const ring = new THREE.LineLoop(ringGeo, ringMat);
      ring.rotation.x = cfg.tiltX;
      ring.rotation.y = cfg.tiltY;
      scene.add(ring);
      orbitRings.push(ring);
    });

    // -----------------------------
    // Skill nodes
    // -----------------------------
    const skillMeshes: SkillMeshRecord[] = [];
    const dotGeo = new THREE.SphereGeometry(isMobile ? 0.038 : 0.043, 14, 14);
    const haloGeo = new THREE.SphereGeometry(isMobile ? 0.09 : 0.1, 14, 14);
    const ringGeo = new THREE.RingGeometry(0.065, 0.085, 32);

    filteredSkills.forEach((sk, i) => {
      // Fibonacci-like sphere distribution
      const phi = Math.acos(-1 + (2 * (i + 0.5)) / filteredSkills.length);
      const theta = Math.sqrt(filteredSkills.length * Math.PI) * phi;

      const pos = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.cos(phi),
        Math.sin(phi) * Math.sin(theta)
      );
      const safeColor = new THREE.Color((sk.color as string) === '#000000' ? '#888888' : (sk.color as string));
      // Dot
      const dotMat = new THREE.MeshBasicMaterial({
        color: safeColor,
        transparent: true,
        opacity: 0.95,
      });

      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.copy(pos);
      globe.add(dot);

      // Glow halo
      const haloMat = new THREE.MeshBasicMaterial({
        color: safeColor,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.copy(pos);
      globe.add(halo);

      // Thin ring around node for cyber UI look
      const ringMat = new THREE.MeshBasicMaterial({
        color: safeColor,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos.clone().multiplyScalar(1.02));
      ring.lookAt(new THREE.Vector3(0, 0, 0));
      globe.add(ring);

      skillMeshes.push({ mesh: dot, halo, ring, skill: sk, pos });
    });

    // -----------------------------
    // Raycasting / Interaction
    // -----------------------------
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-99, -99);
    let hoveredIdx = -1;

    const updateMouse = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onMouseMove = (e: MouseEvent) => {
      updateMouse(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      updateMouse(e.touches[0].clientX, e.touches[0].clientY);
    };

    const onLeave = () => {
      mouse.set(-99, -99);
      hoveredIdx = -1;
      hideTip();
      controls.autoRotate = true;
    };

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('mouseleave', onLeave);

    // -----------------------------
    // Resize handling
    // -----------------------------
    const resizeObserver = new ResizeObserver(() => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });

    resizeObserver.observe(container);

    // -----------------------------
    // Tooltip helpers
    // -----------------------------
    const showTip = (sk: Skill, screenPos: THREE.Vector3) => {
      const tip = tooltipRef.current;
      if (!tip) return;

      const rect = container.getBoundingClientRect();

      let x = ((screenPos.x + 1) / 2) * rect.width;
      let y = ((-screenPos.y + 1) / 2) * rect.height;

      const tipWidth = isMobile ? 140 : 170;

      if (x + tipWidth > rect.width) x = rect.width - tipWidth - 12;
      if (x < 10) x = 10;
      if (y < 45) y = 45;

      tip.style.left = `${x + 14}px`;
      tip.style.top = `${y - 42}px`;
      tip.style.borderColor = sk.color;
      tip.style.boxShadow = `0 12px 40px rgba(0,0,0,0.45), 0 0 22px ${sk.color}55, inset 0 0 18px ${sk.color}14`;

      tip.innerHTML = `
        <div class="tooltip-icon" style="border-color:${sk.color}; background: radial-gradient(circle, ${sk.color}30 0%, rgba(255,255,255,0.03) 70%, transparent 100%);">
          <img src="${sk.icon}" alt="${sk.name}" style="filter: drop-shadow(0 0 8px ${sk.color});" />
        </div>
        <div class="tooltip-copy">
          <span class="tooltip-name" style="text-shadow: 0 0 8px ${sk.color}66;">${sk.name}</span>
          <span class="tooltip-meta">${sk.category}</span>
        </div>
      `;

      tip.classList.add('visible');
    };

    const hideTip = () => {
      const tip = tooltipRef.current;
      if (!tip) return;
      tip.classList.remove('visible');
    };

    // -----------------------------
    // Animation loop
    // -----------------------------
    const tempVec = new THREE.Vector3();
    const clock = new THREE.Clock();

    const animate = () => {
      if (disposed) return;

      animIdRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      controls.update();

      // Ambient scene motion
      stars.rotation.y += isMobile ? 0.00008 : 0.00012;
      stars.rotation.x += 0.00003;

      wireSphere.rotation.y += 0.0012;
      outerWireSphere.rotation.y -= 0.0006;
      outerWireSphere.rotation.x += 0.0002;

      orbitRings.forEach((ring, idx) => {
        ring.rotation.z += 0.001 * (idx + 1) * 0.25;
      });

      // Raycast on visible skill meshes
      raycaster.setFromCamera(mouse, camera);
      const hitTargets = skillMeshes.map((s) => s.mesh);
      const hits = raycaster.intersectObjects(hitTargets, false);

      if (hits.length > 0) {
        const idx = skillMeshes.findIndex((s) => s.mesh === hits[0].object);

        if (idx !== hoveredIdx && idx !== -1) {
          hoveredIdx = idx;
          const { skill, mesh } = skillMeshes[idx];

          tempVec.copy(mesh.position).project(camera);
          showTip(skill, tempVec);

          controls.autoRotate = false;
        }
      } else if (hoveredIdx !== -1) {
        hideTip();
        controls.autoRotate = true;
        hoveredIdx = -1;
      }

      // Smooth per-node animation
      skillMeshes.forEach(({ mesh, halo, ring }, i) => {
        const hovered = i === hoveredIdx;
        const pulse = 0.5 + Math.sin(elapsed * 2.2 + i * 0.55) * 0.5;

        const targetScale = hovered ? 1.42 : 1.0 + pulse * 0.035;
        const targetHaloScale = hovered ? 1.95 : 1.0 + pulse * 0.08;
        const targetHaloOpacity = hovered ? 0.82 : 0.08 + pulse * 0.06;
        const targetRingOpacity = hovered ? 0.85 : 0.14 + pulse * 0.08;

        mesh.scale.lerp(
          new THREE.Vector3(targetScale, targetScale, targetScale),
          hovered ? 0.16 : 0.08
        );

        halo.scale.lerp(
          new THREE.Vector3(targetHaloScale, targetHaloScale, targetHaloScale),
          hovered ? 0.16 : 0.08
        );

        ring.scale.lerp(
          new THREE.Vector3(
            hovered ? 1.25 : 1.0 + pulse * 0.04,
            hovered ? 1.25 : 1.0 + pulse * 0.04,
            hovered ? 1.25 : 1.0 + pulse * 0.04
          ),
          0.12
        );

        const haloMat = halo.material as THREE.MeshBasicMaterial;
        haloMat.opacity += (targetHaloOpacity - haloMat.opacity) * 0.12;

        const ringMat = ring.material as THREE.MeshBasicMaterial;
        ringMat.opacity += (targetRingOpacity - ringMat.opacity) * 0.12;
      });

      renderer.render(scene, camera);
    };

    animate();

    visibilityTimeoutRef.current = window.setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // -----------------------------
    // Cleanup
    // -----------------------------
    return () => {
      disposed = true;

      cancelAnimationFrame(animIdRef.current);

      if (visibilityTimeoutRef.current) {
        clearTimeout(visibilityTimeoutRef.current);
      }

      resizeObserver.disconnect();

      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('mouseleave', onLeave);

      controls.dispose();

      // Dispose geometries/materials
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) {
          mesh.geometry.dispose();
        }

        const material = mesh.material;
        if (Array.isArray(material)) {
          material.forEach((m) => m.dispose());
        } else if (material) {
          material.dispose();
        }
      });

      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isMobile, activeCategory, filteredSkills]);

  const filteredCount = filteredSkills.length;

  return (
    <div className={`globe-wrapper ${isVisible ? 'visible' : ''}`}>
      {/* LEFT PANEL */}
      <div className="side-panel left-panel">
        <div className="panel-content">
          <div className="panel-clock">
            <div className="clock-time">{currentTime}</div>
            <div className="clock-date">{date}</div>
          </div>

          <div className="panel-metrics glass-card">
            {[
              { label: 'Uptime', value: metrics.uptime },
              { label: 'Latency', value: metrics.latency },
              { label: 'Throughput', value: metrics.throughput },
            ].map((m) => (
              <div className="metric-item" key={m.label}>
                <span className="metric-value">{m.value}</span>
                <span className="metric-label">{m.label}</span>
              </div>
            ))}
          </div>

          <div className="stream-bars glass-card">
            {streamBars.map((h, i) => (
              <div
                key={i}
                className="stream-bar"
                style={{
                  height: `${h}%`,
                  animationDelay: `${i * 0.08}s`,
                }}
              />
            ))}
          </div>

          <div className="connection-status glass-chip">
            <div className="connection-dot" />
            Online
          </div>
        </div>
      </div>

      {/* GLOBE */}
      <div className="globe-container">
        {/* Background decorative layers */}
        <div className="globe-bg-gradient" />
        <div className="globe-grid-pattern" />
        <div className="globe-scanlines" />
        <div className="globe-noise" />

        {/* Three.js mount */}
        <div ref={mountRef} className="globe-canvas" />

        {/* Tooltip */}
        <div ref={tooltipRef} className="skill-tooltip" />

        {/* Frame decoration */}
        <div className="corner-decoration top-left" />
        <div className="corner-decoration top-right" />
        <div className="corner-decoration bottom-left" />
        <div className="corner-decoration bottom-right" />

        {/* Mobile badge */}
        <div className="mobile-skill-badge glass-card">
          <span className="badge-count">{filteredCount}</span>
          <span className="badge-label">Skills</span>
        </div>

        {/* Overlay controls / hint */}
        <div className="globe-overlay">
          <div className="drag-instruction glass-chip">
            <div className="drag-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M12 12v.01" />
                <path d="M3 12h18M12 3v18" strokeOpacity="0.4" />
              </svg>
            </div>
            <span className="drag-text">Drag to Explore</span>
          </div>
        </div>

        {/* Top HUD */}
        <div className="top-hud">
          <div className="hud-pill glass-chip">AI DEFENSE MATRIX</div>
          <div className="hud-pill glass-chip">SECURE NODE MAP</div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="side-panel right-panel">
        <div className="panel-content">
          <div className="skill-count">
            <div className="count-number">{filteredCount}</div>
            <div className="count-label">Skills</div>
          </div>

          <div className="status-indicator glass-chip">
            <div className="status-dot" />
            Active
          </div>

          <div className="skill-categories">
            <div className="category-label">Filter</div>

            {[
              { id: 'all', label: 'All', count: skills.length },
              {
                id: 'frontend',
                label: 'Frontend',
                count: skills.filter((s) => s.category === 'frontend').length,
              },
              {
                id: 'backend',
                label: 'Backend',
                count: skills.filter((s) => s.category === 'backend').length,
              },
            ].map((cat) => (
              <button
                key={cat.id}
                className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id as 'all' | 'frontend' | 'backend')}
                aria-pressed={activeCategory === cat.id}
              >
                <span className="cat-name">{cat.label}</span>
                <span className="cat-count">{cat.count}</span>
              </button>
            ))}
          </div>

          <div className="proficiency-section glass-card">
            <div className="proficiency-label">Proficiency</div>

            <div className="proficiency-bars">
              {[
                { level: 'Expert', pct: '90%', cls: 'expert' },
                { level: 'Advanced', pct: '75%', cls: 'advanced' },
                { level: 'Intermediate', pct: '55%', cls: 'intermediate' },
              ].map((p) => (
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
            <span className="version-label">v3.0</span>
            <span className="build-date">Cyber AI UI</span>
          </div>
        </div>
      </div>
    </div>
  );
}
