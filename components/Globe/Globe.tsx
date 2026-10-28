'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './Globe.css';

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
  { name: 'Python', icon: '/logos/python.svg', color: '#3776AB', category: 'backend' },
  { name: 'Tailwind CSS', icon: '/logos/tailwindcss.svg', color: '#06B6D4', category: 'frontend' },
  { name: 'Express.js', icon: '/logos/express.svg', color: '#ffffff', category: 'backend' },
  { name: 'Git', icon: '/logos/git.svg', color: '#F05032', category: 'tools' },
  { name: 'GitHub', icon: '/logos/github.svg', color: '#ffffff', category: 'tools' },
  { name: 'TensorFlow', icon: '/logos/tensorflow.svg', color: '#FF6F00', category: 'ai-ml' },
  { name: 'PyTorch', icon: '/logos/pytorch.svg', color: '#EE4C2C', category: 'ai-ml' },
  { name: 'OpenCV', icon: '/logos/opencv.svg', color: '#5C3EE8', category: 'ai-ml' },
  { name: 'Scikit-learn', icon: '/logos/scikit-learn.svg', color: '#F7931E', category: 'ai-ml' },
  { name: 'Hugging Face', icon: '/logos/huggingface.svg', color: '#FFD21E', category: 'ai-ml' },
  { name: 'Docker', icon: '/logos/docker.svg', color: '#2496ED', category: 'tools' },
  { name: 'Vercel', icon: '/logos/vercel.svg', color: '#ffffff', category: 'tools' },
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

  const filteredSkills = useMemo(() => {
    if (activeCategory === 'all') return skills;
    return skills.filter((s) => s.category === activeCategory);
  }, [activeCategory]);

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

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let disposed = false;

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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 1.8));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.rotateSpeed = isMobile ? 0.6 : 0.75;
    controls.autoRotate = true;
    controls.autoRotateSpeed = isMobile ? 0.45 : 0.55;
    controls.minPolarAngle = Math.PI * 0.24;
    controls.maxPolarAngle = Math.PI * 0.76;

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const globeGeo = new THREE.SphereGeometry(1, 64, 64);

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

    const innerGlowMat = new THREE.MeshBasicMaterial({
      color: 0x00cfff,
      transparent: true,
      opacity: 0.035,
      blending: THREE.AdditiveBlending,
    });

    const innerGlow = new THREE.Mesh(new THREE.SphereGeometry(0.94, 32, 32), innerGlowMat);
    globeGroup.add(innerGlow);

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x40c4ff,
      wireframe: true,
      transparent: true,
      opacity: 0.13,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const wireSphere = new THREE.Mesh(new THREE.SphereGeometry(1.003, 28, 28), wireMat);
    globeGroup.add(wireSphere);

    const outerWireMat = new THREE.MeshBasicMaterial({
      color: 0x8a5cff,
      wireframe: true,
      transparent: true,
      opacity: 0.05,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const outerWireSphere = new THREE.Mesh(new THREE.SphereGeometry(1.08, 24, 24), outerWireMat);
    globeGroup.add(outerWireSphere);

    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: 0x55c7ff,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(1.17, 32, 32), atmosphereMat);
    globeGroup.add(atmosphere);

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

    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array((isMobile ? 700 : 1400) * 3);

    for (let i = 0; i < starPositions.length; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 80;
      starPositions[i + 1] = (Math.random() - 0.5) * 80;
      starPositions[i + 2] = (Math.random() - 0.5) * 80;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

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

    const orbitRings: THREE.LineLoop[] = [];
    const ringConfigs = [
      { radius: 1.32, color: 0x00d9ff, tiltX: 1.1, tiltY: 0.15, opacity: 0.16 },
      { radius: 1.46, color: 0x7a5cff, tiltX: 0.3, tiltY: 1.0, opacity: 0.11 },
      { radius: 1.62, color: 0x00ffb3, tiltX: 0.85, tiltY: 0.55, opacity: 0.08 },
    ];

    ringConfigs.forEach((cfg) => {
      const geo = new THREE.BufferGeometry();
      const points = new Float32Array(180 * 3);

      for (let i = 0; i < 180; i++) {
        const angle = (i / 180) * Math.PI * 2;
        points[i * 3] = Math.cos(angle) * cfg.radius;
        points[i * 3 + 1] = Math.sin(angle) * cfg.radius;
        points[i * 3 + 2] = 0;
      }

      geo.setAttribute('position', new THREE.BufferAttribute(points, 3));

      const mat = new THREE.LineBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: cfg.opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const ring = new THREE.LineLoop(geo, mat);
      ring.rotation.x = cfg.tiltX;
      ring.rotation.y = cfg.tiltY;
      scene.add(ring);
      orbitRings.push(ring);
    });

    const skillMeshes: SkillMeshRecord[] = [];
    const raycastTargets: THREE.Object3D[] = [];
    const meshToIndex = new Map<THREE.Object3D, number>();

    const dotGeo = new THREE.SphereGeometry(isMobile ? 0.05 : 0.043, 14, 14);
    const haloGeo = new THREE.SphereGeometry(isMobile ? 0.11 : 0.1, 14, 14);
    const nodeRingGeo = new THREE.RingGeometry(0.065, 0.085, 32);
    const centerVec = new THREE.Vector3(0, 0, 0);

    filteredSkills.forEach((sk, i) => {
      const phi = Math.acos(-1 + (2 * (i + 0.5)) / filteredSkills.length);
      const theta = Math.sqrt(filteredSkills.length * Math.PI) * phi;

      const pos = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.cos(phi),
        Math.sin(phi) * Math.sin(theta)
      );

      const safeColor = new THREE.Color((sk.color as string) === '#000000' ? '#888888' : sk.color);
      const dotMat = new THREE.MeshBasicMaterial({
        color: safeColor,
        transparent: true,
        opacity: 0.98,
      });

      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.copy(pos);
      globe.add(dot);

      const haloMat = new THREE.MeshBasicMaterial({
        color: safeColor,
        transparent: true,
        opacity: isMobile ? 0.08 : 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.copy(pos);
      globe.add(halo);

      const ringMat = new THREE.MeshBasicMaterial({
        color: safeColor,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const ring = new THREE.Mesh(nodeRingGeo, ringMat);
      ring.position.copy(pos.clone().multiplyScalar(1.02));
      ring.lookAt(centerVec);
      globe.add(ring);

      const index = skillMeshes.length;
      skillMeshes.push({ mesh: dot, halo, ring, skill: sk, pos });
      raycastTargets.push(dot);
      meshToIndex.set(dot, index);
    });

    const raycaster = new THREE.Raycaster();
    raycaster.params.Points = { threshold: 0.1 };
    const mouse = new THREE.Vector2(-99, -99);

    let hoveredIdx = -1;
    let lockedIdx = -1;
    let tooltipSkillName = '';
    let isPointerDown = false;
    let pointerMoved = false;
    let pointerDownX = 0;
    let pointerDownY = 0;

    const tempVec = new THREE.Vector3();
    const scaleVec1 = new THREE.Vector3();
    const scaleVec2 = new THREE.Vector3();
    const scaleVec3 = new THREE.Vector3();
    const clock = new THREE.Clock();

    const updateMouse = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    const projectMeshToScreen = (mesh: THREE.Mesh) => {
      tempVec.copy(mesh.position).project(camera);
      return tempVec;
    };

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

      if (tooltipSkillName !== sk.name) {
        tip.innerHTML = `
          <div class="tooltip-icon" style="border-color:${sk.color}; background: radial-gradient(circle, ${sk.color}30 0%, rgba(255,255,255,0.03) 70%, transparent 100%);">
            <img src="${sk.icon}" alt="${sk.name}" style="filter: drop-shadow(0 0 8px ${sk.color});" />
          </div>
          <div class="tooltip-copy">
            <span class="tooltip-name" style="text-shadow: 0 0 8px ${sk.color}66;">${sk.name}</span>
            <span class="tooltip-meta">${sk.category}</span>
          </div>
        `;
        tooltipSkillName = sk.name;
      }

      tip.classList.add('visible');
    };

    const hideTip = () => {
      const tip = tooltipRef.current;
      if (!tip) return;
      tip.classList.remove('visible');
      tooltipSkillName = '';
    };

    const setHoveredSkill = (idx: number, lock = false) => {
      if (idx < 0 || !skillMeshes[idx]) return;
      hoveredIdx = idx;
      if (lock) lockedIdx = idx;

      const { skill, mesh } = skillMeshes[idx];
      showTip(skill, projectMeshToScreen(mesh));
      controls.autoRotate = false;
    };

    const clearHoveredSkill = (force = false) => {
      if (lockedIdx !== -1 && !force) return;
      hoveredIdx = -1;
      hideTip();
      controls.autoRotate = true;
    };

    const pickSkill = (clientX: number, clientY: number, lock = false) => {
      updateMouse(clientX, clientY);
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(raycastTargets, false);

      if (hits.length > 0) {
        const idx = meshToIndex.get(hits[0].object) ?? -1;
        if (idx !== -1) {
          setHoveredSkill(idx, lock);
          return idx;
        }
      }

      if (lock) {
        lockedIdx = -1;
        clearHoveredSkill(true);
      }

      return -1;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (isPointerDown) {
        const dx = Math.abs(e.clientX - pointerDownX);
        const dy = Math.abs(e.clientY - pointerDownY);
        if (dx > 6 || dy > 6) pointerMoved = true;
      }

      if (lockedIdx !== -1 && e.pointerType !== 'mouse') return;

      updateMouse(e.clientX, e.clientY);
    };

    const onPointerDown = (e: PointerEvent) => {
      isPointerDown = true;
      pointerMoved = false;
      pointerDownX = e.clientX;
      pointerDownY = e.clientY;

      // Instant feedback on touch/mobile and click
      pickSkill(e.clientX, e.clientY, e.pointerType !== 'mouse');
    };

    const onPointerUp = (e: PointerEvent) => {
      isPointerDown = false;

      const isTap = !pointerMoved;
      if (isTap) {
        const idx = pickSkill(e.clientX, e.clientY, e.pointerType !== 'mouse');
        if (idx === -1 && e.pointerType !== 'mouse') {
          lockedIdx = -1;
          clearHoveredSkill(true);
        }
      }
    };

    const onPointerLeave = () => {
      mouse.set(-99, -99);

      if (lockedIdx === -1) {
        hoveredIdx = -1;
        hideTip();
        controls.autoRotate = true;
      }
    };

    container.addEventListener('pointermove', onPointerMove, { passive: true });
    container.addEventListener('pointerdown', onPointerDown, { passive: true });
    container.addEventListener('pointerup', onPointerUp, { passive: true });
    container.addEventListener('pointerleave', onPointerLeave);

    const resizeObserver = new ResizeObserver(() => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 1.8));
    });

    resizeObserver.observe(container);

    const animate = () => {
      if (disposed) return;

      animIdRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      controls.update();

      stars.rotation.y += isMobile ? 0.00008 : 0.00012;
      stars.rotation.x += 0.00003;

      wireSphere.rotation.y += 0.0012;
      outerWireSphere.rotation.y -= 0.0006;
      outerWireSphere.rotation.x += 0.0002;

      orbitRings.forEach((ring, idx) => {
        ring.rotation.z += 0.001 * (idx + 1) * 0.25;
      });

      if (lockedIdx === -1) {
        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObjects(raycastTargets, false);

        if (hits.length > 0) {
          const idx = meshToIndex.get(hits[0].object) ?? -1;
          if (idx !== -1) {
            if (idx !== hoveredIdx) {
              hoveredIdx = idx;
              const { skill, mesh } = skillMeshes[idx];
              showTip(skill, projectMeshToScreen(mesh));
              controls.autoRotate = false;
            } else {
              const { skill, mesh } = skillMeshes[idx];
              showTip(skill, projectMeshToScreen(mesh));
            }
          }
        } else if (hoveredIdx !== -1) {
          hoveredIdx = -1;
          hideTip();
          controls.autoRotate = true;
        }
      } else {
        const locked = skillMeshes[lockedIdx];
        if (locked) {
          showTip(locked.skill, projectMeshToScreen(locked.mesh));
        }
      }

      for (let i = 0; i < skillMeshes.length; i++) {
        const { mesh, halo, ring } = skillMeshes[i];
        const active = i === hoveredIdx || i === lockedIdx;
        const pulse = 0.5 + Math.sin(elapsed * 2.2 + i * 0.55) * 0.5;

        const targetScale = active ? (isMobile ? 1.55 : 1.42) : 1.0 + pulse * 0.035;
        const targetHaloScale = active ? (isMobile ? 2.15 : 1.95) : 1.0 + pulse * 0.08;
        const targetHaloOpacity = active ? 0.9 : 0.08 + pulse * 0.06;
        const targetRingOpacity = active ? 0.9 : 0.14 + pulse * 0.08;

        scaleVec1.set(targetScale, targetScale, targetScale);
        scaleVec2.set(targetHaloScale, targetHaloScale, targetHaloScale);

        const ringScale = active ? 1.28 : 1.0 + pulse * 0.04;
        scaleVec3.set(ringScale, ringScale, ringScale);

        mesh.scale.lerp(scaleVec1, active ? 0.24 : 0.08);
        halo.scale.lerp(scaleVec2, active ? 0.22 : 0.08);
        ring.scale.lerp(scaleVec3, 0.14);

        const haloMat = halo.material as THREE.MeshBasicMaterial;
        haloMat.opacity += (targetHaloOpacity - haloMat.opacity) * (active ? 0.24 : 0.12);

        const ringMat = ring.material as THREE.MeshBasicMaterial;
        ringMat.opacity += (targetRingOpacity - ringMat.opacity) * (active ? 0.22 : 0.12);
      }

      renderer.render(scene, camera);
    };

    animate();

    visibilityTimeoutRef.current = window.setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => {
      disposed = true;
      cancelAnimationFrame(animIdRef.current);

      if (visibilityTimeoutRef.current) {
        clearTimeout(visibilityTimeoutRef.current);
      }

      resizeObserver.disconnect();

      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointerleave', onPointerLeave);

      controls.dispose();

      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh & {
          geometry?: THREE.BufferGeometry;
          material?: THREE.Material | THREE.Material[];
        };

        if (mesh.geometry) {
          mesh.geometry.dispose();
        }

        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else if (mesh.material) {
          mesh.material.dispose();
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

      <div className="globe-container">
        <div className="globe-bg-gradient" />
        <div className="globe-grid-pattern" />
        <div className="globe-scanlines" />
        <div className="globe-noise" />

        <div ref={mountRef} className="globe-canvas" />

        <div ref={tooltipRef} className="skill-tooltip" />

        <div className="corner-decoration top-left" />
        <div className="corner-decoration top-right" />
        <div className="corner-decoration bottom-left" />
        <div className="corner-decoration bottom-right" />

        <div className="mobile-skill-badge glass-card">
          <span className="badge-count">{filteredCount}</span>
          <span className="badge-label">Skills</span>
        </div>

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

        <div className="top-hud">
          <div className="hud-pill glass-chip">AI DEFENSE MATRIX</div>
          <div className="hud-pill glass-chip">SECURE NODE MAP</div>
        </div>
      </div>

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
                type="button"
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
