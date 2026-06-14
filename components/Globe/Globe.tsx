'use client';
// Globe.jsx
// ============================================
// PROFESSIONAL 3D TECH UNIVERSE GLOBE
// A realistic, interactive skills showcase
// Enhanced with professional side panels
// MOBILE OPTIMIZED VERSION
// ============================================

import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { gsap } from "gsap";
import "./Globe.css";

// ============================================
// SKILLS DATA - Add/Remove skills here
// Each skill has: name, icon path, brand color, category
// ============================================
const skills = [
  { name: "React", icon: "/logos/react.svg", color: "#61DAFB", category: "frontend" },
  { name: "Next.js", icon: "/logos/nextjs.svg", color: "#ffffff", category: "frontend" },
  { name: "Node.js", icon: "/logos/nodejs.svg", color: "#339933", category: "backend" },
  { name: "TypeScript", icon: "/logos/typescript.svg", color: "#3178C6", category: "frontend" },
  { name: "PostgreSQL", icon: "/logos/postgresql.svg", color: "#4169E1", category: "backend" },
  { name: "Html5", icon: "/logos/html5.svg", color: "#E34C26", category: "frontend" },
  { name: "Flutter", icon: "/logos/flutter.svg", color: "#00C5D5", category: "frontend" },
  { name: "GSAP", icon: "/logos/gsap-greensock.svg", color: "#06B6D4", category: "frontend" },
  { name: "Three.js", icon: "/logos/Three.js.svg", color: "#000000", category: "frontend" },
  { name: "AI-ML", icon: "/logos/AI-ML.svg", color: "#E10098", category: "backend" },
  { name: "Firebase", icon: "/logos/firebase.svg", color: "#FFCA28", category: "backend" },
  { name: "MongoDB", icon: "/logos/mongodb.svg", color: "#47A248", category: "backend" },
];

// ============================================
// SHADER CODE - Creates realistic glow effects
// ============================================

// Vertex shader - calculates surface normals for glow
const glowVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPositionNormal;
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment shader - creates pulsing outer glow
const glowFragmentShader = `
  uniform vec3 glowColor;
  uniform float intensity;
  uniform float time;
  varying vec3 vNormal;
  varying vec3 vPositionNormal;
  
  void main() {
    // Fresnel effect for edge glow
    float strength = pow(0.65 - dot(vNormal, vPositionNormal), 2.0);
    // Subtle pulse animation
    float pulse = 0.9 + 0.1 * sin(time * 1.2);
    gl_FragColor = vec4(glowColor, strength * intensity * pulse);
  }
`;

// Atmosphere shader - creates outer atmospheric haze
const atmosphereFragmentShader = `
  uniform vec3 glowColor;
  uniform float intensity;
  uniform float time;
  varying vec3 vNormal;
  varying vec3 vPositionNormal;
  
  void main() {
    float strength = pow(0.75 - dot(vNormal, vPositionNormal), 3.0);
    // Wave animation for organic feel
    float wave = 0.95 + 0.05 * sin(time * 0.8 + vNormal.y * 3.0);
    vec3 color = mix(glowColor, vec3(0.0, 0.6, 1.0), strength * 0.3);
    gl_FragColor = vec4(color, strength * intensity * wave * 0.6);
  }
`;

// Globe surface shader - creates tech grid pattern
const globeSurfaceFragmentShader = `
  uniform float time;
  uniform vec3 baseColor;
  uniform vec3 glowColor;
  varying vec3 vNormal;
  varying vec3 vPositionNormal;
  varying vec2 vUv;
  
  void main() {
    // Grid pattern
    float gridX = step(0.98, fract(vUv.x * 30.0));
    float gridY = step(0.98, fract(vUv.y * 15.0));
    float grid = max(gridX, gridY) * 0.15;
    
    // Fresnel rim lighting
    float fresnel = pow(1.0 - abs(dot(vNormal, vPositionNormal)), 2.0);
    
    // Animated scan line
    float scanLine = smoothstep(0.0, 0.1, sin(vUv.y * 50.0 + time * 2.0)) * 0.05;
    
    // Combine effects
    vec3 finalColor = baseColor + grid * glowColor + fresnel * glowColor * 0.3 + scanLine * glowColor;
    float alpha = 0.92 + fresnel * 0.08;
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Throttle function for performance optimization
const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// ============================================
// DETECT MOBILE DEVICE
// Returns true if user is on mobile/tablet
// ============================================
const isMobileDevice = () => {
  return (
    typeof window !== "undefined" &&
    (window.innerWidth <= 768 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ))
  );
};

// ============================================
// MAIN GLOBE COMPONENT
// ============================================
export default function Globe() {
  // --------------------------------------------
  // DOM REFERENCES
  // --------------------------------------------
  const mountRef = useRef(null);           // Container for Three.js canvas
  const tooltipRef = useRef(null);         // Skill name tooltip
  const hoveredSkill = useRef(null);       // Currently hovered skill
  const animationRef = useRef(null);       // Animation frame ID for cleanup
  const controlsRef = useRef(null);        // OrbitControls reference
  const rendererRef = useRef(null);        // Store renderer reference for resize
  const cameraRef = useRef(null);          // Store camera reference for resize
  
  // --------------------------------------------
  // STATE MANAGEMENT
  // --------------------------------------------
  const [isVisible, setIsVisible] = useState(false);        // Visibility for entrance animation
  const [currentTime, setCurrentTime] = useState(new Date()); // Real-time clock
  const [isMobile, setIsMobile] = useState(false);          // Mobile detection state
  const [metrics, setMetrics] = useState({                   // Dynamic metrics
    uptime: "99.9%",
    latency: "12ms",
    throughput: "1.2k/s"
  });
  const [activeCategory, setActiveCategory] = useState("all"); // Skill filter
  const [searchQuery, setSearchQuery] = useState("");          // Search filter

  // --------------------------------------------
  // MOBILE DETECTION ON MOUNT
  // --------------------------------------------
  useEffect(() => {
    setIsMobile(isMobileDevice());
    
    // Update on resize
    const handleResize = () => {
      setIsMobile(isMobileDevice());
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --------------------------------------------
  // MEMOIZED CALCULATIONS
  // Prevents recalculation on every render
  // --------------------------------------------
  
  // Calculate skill counts by category
  const skillCounts = useMemo(() => {
    return {
      total: skills.length,
      frontend: skills.filter(s => s.category === "frontend").length,
      backend: skills.filter(s => s.category === "backend").length,
      devops: skills.filter(s => s.category === "devops").length
    };
  }, []); // Empty deps since skills array is static

  // Filter skills based on search and category
  const filteredSkills = useMemo(() => {
    return skills.filter(skill => {
      const matchesCategory = activeCategory === "all" || skill.category === activeCategory;
      const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // --------------------------------------------
  // REAL-TIME CLOCK EFFECT
  // Updates every second for live time display
  // --------------------------------------------
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // --------------------------------------------
  // SIMULATED METRICS UPDATE
  // Creates dynamic "live" feel for metrics
  // --------------------------------------------
  useEffect(() => {
    const metricsTimer = setInterval(() => {
      setMetrics({
        uptime: `${(99.5 + Math.random() * 0.5).toFixed(1)}%`,
        latency: `${Math.floor(10 + Math.random() * 8)}ms`,
        throughput: `${(1.0 + Math.random() * 0.4).toFixed(1)}k/s`
      });
    }, 3000);
    
    return () => clearInterval(metricsTimer);
  }, []);

  // --------------------------------------------
  // CATEGORY FILTER HANDLER
  // Memoized to prevent unnecessary re-renders
  // --------------------------------------------
  const handleCategoryChange = useCallback((category) => {
    setActiveCategory(category);
  }, []);

  // --------------------------------------------
  // SEARCH INPUT HANDLER
  // Memoized for performance
  // --------------------------------------------
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  // ============================================
  // MAIN EFFECT - Three.js Scene Setup
  // ============================================
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // --------------------------------------------
    // INTERSECTION OBSERVER - Entrance animation trigger
    // Fires once when component enters viewport
    // --------------------------------------------
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect(); // Stop observing after first trigger
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% visible
    );
    observer.observe(mount);

    // --------------------------------------------
    // SCENE SETUP
    // Creates the 3D environment
    // --------------------------------------------
    const scene = new THREE.Scene();
    
    // Responsive sizing function - calculates container dimensions
    // FIXED: Ensure minimum dimensions for mobile
    const getSize = () => {
      const width = mount.clientWidth || 300;
      const height = mount.clientHeight || 300;
      return {
        width: Math.max(width, 280),   // Minimum width 280px
        height: Math.max(height, 280), // Minimum height 280px
      };
    };
    
    let { width, height } = getSize();
    
    // Detect if mobile for performance optimizations
    const mobile = isMobileDevice();

    // Camera setup - perspective for realistic 3D depth
    // FIXED: Adjusted camera distance for mobile
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, mobile ? 12 : 14); // Closer on mobile
    cameraRef.current = camera;

    // Renderer setup - high quality WebGL settings
    // FIXED: Lower pixel ratio on mobile for performance
    const renderer = new THREE.WebGLRenderer({
      antialias: !mobile,              // Disable antialiasing on mobile for performance
      alpha: true,                     // Transparent background
      powerPreference: mobile ? "low-power" : "high-performance",
      preserveDrawingBuffer: true,     // Helps with some mobile rendering issues
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2)); // Lower on mobile
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Clock for time-based animations
    const clock = new THREE.Clock();

    // --------------------------------------------
    // SPACE DUST PARTICLES - Background atmosphere
    // FIXED: Reduced particle count on mobile
    // --------------------------------------------
    const createSpaceDust = () => {
      const geometry = new THREE.BufferGeometry();
      const count = mobile ? 800 : 2000; // Fewer particles on mobile
      
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const sizes = new Float32Array(count);
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        
        const radius = 8 + Math.random() * 20;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);
        
        const hue = 0.55 + Math.random() * 0.15;
        const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
        
        sizes[i] = Math.random() * 2 + 0.5;
      }
      
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
      
      const material = new THREE.PointsMaterial({
        size: mobile ? 0.04 : 0.03, // Slightly larger on mobile for visibility
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      });
      
      return new THREE.Points(geometry, material);
    };
    
    const spaceDust = createSpaceDust();
    scene.add(spaceDust);

    // --------------------------------------------
    // NEBULA CLOUDS - Adds depth and atmosphere
    // FIXED: Simplified on mobile
    // --------------------------------------------
    const createNebula = () => {
      const group = new THREE.Group();
      
      // Fewer nebula clouds on mobile
      const nebulaColors = mobile ? [
        { color: 0x4a9eff, x: -10, y: 4, z: -15, scale: 6 },
        { color: 0x764abc, x: 12, y: -6, z: -18, scale: 8 },
      ] : [
        { color: 0x4a9eff, x: -12, y: 5, z: -15, scale: 8 },
        { color: 0x764abc, x: 15, y: -8, z: -20, scale: 10 },
        { color: 0x00d4ff, x: -8, y: -12, z: -18, scale: 7 },
      ];
      
      nebulaColors.forEach(({ color, x, y, z, scale }) => {
        const geometry = new THREE.SphereGeometry(scale, mobile ? 16 : 32, mobile ? 16 : 32);
        const material = new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.03,
          blending: THREE.AdditiveBlending,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        group.add(mesh);
      });
      
      return group;
    };
    
    const nebula = createNebula();
    scene.add(nebula);

    // --------------------------------------------
    // MAIN GLOBE - Core sphere with tech surface
    // FIXED: Reduced polygon count on mobile
    // --------------------------------------------
    const sphereRadius = mobile ? 2.5 : 2.8; // Slightly smaller on mobile
    
    const globeGeometry = new THREE.SphereGeometry(
      sphereRadius, 
      mobile ? 64 : 128,  // Lower segments on mobile
      mobile ? 64 : 128
    );
    const globeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        baseColor: { value: new THREE.Color(0x0a0a18) },
        glowColor: { value: new THREE.Color(0x4a9eff) },
      },
      vertexShader: glowVertexShader,
      fragmentShader: globeSurfaceFragmentShader,
      transparent: true,
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);

    // --------------------------------------------
    // WIREFRAME OVERLAY - Tech aesthetic
    // FIXED: Lower detail on mobile
    // --------------------------------------------
    const wireframeGeometry = new THREE.IcosahedronGeometry(
      sphereRadius + 0.02, 
      mobile ? 1 : 2  // Lower detail on mobile
    );
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x4a9eff,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    scene.add(wireframe);

    // --------------------------------------------
    // GLOW LAYERS - Creates realistic luminosity
    // FIXED: Reduced complexity on mobile
    // --------------------------------------------
    const glowSegments = mobile ? 32 : 64;
    
    // Inner glow
    const innerGlowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color(0x00ffff) },
        intensity: { value: 0.2 },
        time: { value: 0 },
      },
      vertexShader: glowVertexShader,
      fragmentShader: glowFragmentShader,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });
    const innerGlow = new THREE.Mesh(
      new THREE.SphereGeometry(sphereRadius - 0.05, glowSegments, glowSegments),
      innerGlowMaterial
    );
    scene.add(innerGlow);

    // Outer glow
    const outerGlowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color(0x4a9eff) },
        intensity: { value: 0.6 },
        time: { value: 0 },
      },
      vertexShader: glowVertexShader,
      fragmentShader: glowFragmentShader,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });
    const outerGlow = new THREE.Mesh(
      new THREE.SphereGeometry(sphereRadius + 0.5, glowSegments, glowSegments),
      outerGlowMaterial
    );
    scene.add(outerGlow);

    // Atmosphere - only on desktop for performance
    let atmosphere = null;
    if (!mobile) {
      const atmosphereMaterial = new THREE.ShaderMaterial({
        uniforms: {
          glowColor: { value: new THREE.Color(0x00d4ff) },
          intensity: { value: 0.4 },
          time: { value: 0 },
        },
        vertexShader: glowVertexShader,
        fragmentShader: atmosphereFragmentShader,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
      });
      atmosphere = new THREE.Mesh(
        new THREE.SphereGeometry(sphereRadius + 1.2, 64, 64),
        atmosphereMaterial
      );
      scene.add(atmosphere);
    }

    // --------------------------------------------
    // ORBITAL RINGS - Tech decoration
    // FIXED: Fewer rings on mobile
    // --------------------------------------------
    const createOrbitalRing = (radius, color, opacity, tilt) => {
      const geometry = new THREE.TorusGeometry(radius, 0.008, 16, mobile ? 50 : 100);
      const material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
      });
      const ring = new THREE.Mesh(geometry, material);
      ring.rotation.x = tilt.x;
      ring.rotation.y = tilt.y;
      return ring;
    };

    // Create orbital rings (fewer on mobile)
    const orbitalRings = mobile ? [
      createOrbitalRing(sphereRadius + 0.6, 0x4a9eff, 0.2, { x: Math.PI / 2, y: 0 }),
      createOrbitalRing(sphereRadius + 0.9, 0x00ffff, 0.15, { x: Math.PI / 2.5, y: Math.PI / 6 }),
    ] : [
      createOrbitalRing(sphereRadius + 0.6, 0x4a9eff, 0.2, { x: Math.PI / 2, y: 0 }),
      createOrbitalRing(sphereRadius + 0.9, 0x00ffff, 0.15, { x: Math.PI / 2.5, y: Math.PI / 6 }),
      createOrbitalRing(sphereRadius + 1.1, 0x764abc, 0.1, { x: Math.PI / 3, y: Math.PI / 3 }),
    ];
    orbitalRings.forEach((ring) => scene.add(ring));

    // --------------------------------------------
    // SKILL ICONS - Interactive skill showcase
    // --------------------------------------------
    const textureLoader = new THREE.TextureLoader();
    const skillsGroup = new THREE.Group();
    const skillMeshes = [];
    const skillOrbitRadius = sphereRadius + 0.5;

    skills.forEach((skill, i) => {
      const texture = textureLoader.load(
        skill.icon,
        undefined,
        undefined,
        (err) => console.warn(`Failed to load icon: ${skill.icon}`)
      );
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(spriteMaterial);

      // Fibonacci sphere distribution
      const phi = Math.acos(1 - (2 * (i + 0.5)) / skills.length);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      sprite.position.setFromSphericalCoords(skillOrbitRadius, phi, theta);
      
      // FIXED: Slightly larger icons on mobile for better visibility
      const iconScale = mobile ? 0.55 : 0.5;
      sprite.scale.set(iconScale, iconScale, iconScale);

      // Glow ring behind icon
      const ringGeometry = new THREE.RingGeometry(0.28, 0.35, 32);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: skill.color,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.copy(sprite.position);
      ring.lookAt(0, 0, 0);

      // Outer glow halo
      const haloGeometry = new THREE.RingGeometry(0.32, 0.45, 32);
      const haloMaterial = new THREE.MeshBasicMaterial({
        color: skill.color,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      });
      const halo = new THREE.Mesh(haloGeometry, haloMaterial);
      halo.position.copy(sprite.position);
      halo.lookAt(0, 0, 0);

      skillsGroup.add(halo);
      skillsGroup.add(ring);
      skillsGroup.add(sprite);
      
      skillMeshes.push({
        sprite,
        ring,
        halo,
        skill,
        originalScale: iconScale,
        originalPosition: sprite.position.clone(),
      });
    });
    scene.add(skillsGroup);

    // --------------------------------------------
    // CONNECTION LINES - Network effect between skills
    // FIXED: Fewer connections on mobile
    // --------------------------------------------
    const connectionLines = [];
    const connectionChance = mobile ? 0.85 : 0.7; // 15% vs 30% connections
    
    for (let i = 0; i < skills.length; i++) {
      for (let j = i + 1; j < skills.length; j++) {
        if (Math.random() > connectionChance) {
          const points = [];
          const start = skillMeshes[i].sprite.position;
          const end = skillMeshes[j].sprite.position;
          
          const mid = new THREE.Vector3()
            .addVectors(start, end)
            .multiplyScalar(0.5)
            .normalize()
            .multiplyScalar(sphereRadius * 0.7);
          
          const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
          points.push(...curve.getPoints(mobile ? 10 : 20)); // Fewer segments on mobile
          
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const material = new THREE.LineBasicMaterial({
            color: 0x4a9eff,
            transparent: true,
            opacity: 0.08,
            blending: THREE.AdditiveBlending,
          });
          
          const line = new THREE.Line(geometry, material);
          connectionLines.push(line);
          scene.add(line);
        }
      }
    }

    // --------------------------------------------
    // DATA PARTICLES - Flowing particles on connections
    // FIXED: Fewer particles on mobile
    // --------------------------------------------
    const createDataParticles = () => {
      const geometry = new THREE.BufferGeometry();
      const count = mobile ? 25 : 50;
      const positions = new Float32Array(count * 3);
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const angle = (i / count) * Math.PI * 2;
        const radius = sphereRadius + 0.3 + Math.random() * 0.4;
        positions[i3] = Math.cos(angle) * radius;
        positions[i3 + 1] = (Math.random() - 0.5) * 2;
        positions[i3 + 2] = Math.sin(angle) * radius;
      }
      
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      
      const material = new THREE.PointsMaterial({
        color: 0x00ffff,
        size: mobile ? 0.06 : 0.05,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      });
      
      return new THREE.Points(geometry, material);
    };
    
    const dataParticles = createDataParticles();
    scene.add(dataParticles);

    // --------------------------------------------
    // LIGHTING - Professional 3-point setup
    // --------------------------------------------
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const keyLight = new THREE.PointLight(0x4a9eff, 2, 20);
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x00ffff, 1, 20);
    fillLight.position.set(-5, -3, 5);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x764abc, 0.8, 15);
    rimLight.position.set(0, -5, -5);
    scene.add(rimLight);

    // --------------------------------------------
    // CONTROLS - Orbit controls for user interaction
    // FIXED: Better touch handling for mobile
    // --------------------------------------------
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = mobile ? 0.08 : 0.05; // More damping on mobile
    controls.autoRotate = true;
    controls.autoRotateSpeed = mobile ? 0.4 : 0.3; // Slightly faster on mobile
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI / 4;
    controls.maxPolarAngle = (3 * Math.PI) / 4;
    controls.rotateSpeed = mobile ? 0.3 : 0.5; // Slower rotation on mobile for better control
    
    // FIXED: Enable touch support
    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN
    };
    
    controlsRef.current = controls;

    // --------------------------------------------
    // RAYCASTER - For hover detection on skills
    // --------------------------------------------
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Throttled mouse move handler for performance
    const onMouseMove = throttle((event) => {
      const rect = mount.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      if (tooltipRef.current) {
        tooltipRef.current.style.left = `${event.clientX - rect.left + 20}px`;
        tooltipRef.current.style.top = `${event.clientY - rect.top - 15}px`;
      }
    }, 16);

    // FIXED: Improved touch handler for mobile devices
    const onTouchMove = throttle((event) => {
      if (event.touches.length === 1) {
        const touch = event.touches[0];
        const rect = mount.getBoundingClientRect();
        mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
      }
    }, 16);

    // FIXED: Touch end handler to detect taps on skills
    const onTouchEnd = (event) => {
      if (event.changedTouches.length > 0) {
        const touch = event.changedTouches[0];
        const rect = mount.getBoundingClientRect();
        mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Check for skill tap
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(
          skillMeshes.map((m) => m.sprite)
        );
        
        if (intersects.length > 0) {
          const hitSkill = skillMeshes.find(m => m.sprite === intersects[0].object);
          if (hitSkill && tooltipRef.current) {
            // Show tooltip briefly on tap
            tooltipRef.current.innerHTML = `
              <span class="tooltip-icon" style="background: ${hitSkill.skill.color}20; border-color: ${hitSkill.skill.color}">
                <img src="${hitSkill.skill.icon}" alt="${hitSkill.skill.name}" />
              </span>
              <span class="tooltip-name">${hitSkill.skill.name}</span>
            `;
            tooltipRef.current.style.borderColor = hitSkill.skill.color;
            tooltipRef.current.style.left = `${touch.clientX - rect.left}px`;
            tooltipRef.current.style.top = `${touch.clientY - rect.top - 60}px`;
            tooltipRef.current.classList.add("visible");
            
            // Hide after 2 seconds
            setTimeout(() => {
              if (tooltipRef.current) {
                tooltipRef.current.classList.remove("visible");
              }
            }, 2000);
          }
        }
      }
    };

    // Attach event listeners
    mount.addEventListener("mousemove", onMouseMove);
    mount.addEventListener("touchmove", onTouchMove, { passive: true });
    mount.addEventListener("touchend", onTouchEnd, { passive: true });

    // --------------------------------------------
    // ENTRANCE ANIMATION - Dramatic reveal
    // FIXED: Faster animation on mobile
    // --------------------------------------------
    const animDuration = mobile ? 2 : 2.5;
    
    gsap.fromTo(
      camera.position,
      { z: mobile ? 20 : 25, y: mobile ? 3 : 5 },
      {
        z: mobile ? 12 : 14,
        y: 0,
        duration: animDuration,
        ease: "power3.out",
        delay: 0.3,
      }
    );

    gsap.fromTo(
      skillsGroup.rotation,
      { y: -Math.PI },
      {
        y: 0,
        duration: mobile ? 1.5 : 2,
        ease: "power2.out",
        delay: 0.5,
      }
    );

    // Staggered skill icon reveal
    skillMeshes.forEach(({ sprite, ring, halo }, index) => {
      const targetScale = sprite.scale.x;
      gsap.fromTo(
        sprite.scale,
        { x: 0, y: 0, z: 0 },
        {
          x: targetScale,
          y: targetScale,
          z: targetScale,
          duration: mobile ? 0.4 : 0.6,
          ease: "back.out(1.7)",
          delay: (mobile ? 0.5 : 0.8) + index * (mobile ? 0.05 : 0.08),
        }
      );
    });

    // --------------------------------------------
    // ANIMATION LOOP - Main render loop
    // FIXED: Optimized for mobile performance
    // --------------------------------------------
    let frameCount = 0;
    
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      
      frameCount++;
      
      // On mobile, skip some expensive updates every other frame
      const shouldUpdate = !mobile || frameCount % 2 === 0;

      // Update shader uniforms
      globeMaterial.uniforms.time.value = elapsedTime;
      innerGlowMaterial.uniforms.time.value = elapsedTime;
      outerGlowMaterial.uniforms.time.value = elapsedTime;
      if (atmosphere) {
        atmosphere.material.uniforms.time.value = elapsedTime;
      }

      if (shouldUpdate) {
        // Rotate space dust slowly
        spaceDust.rotation.y += 0.0001;
        spaceDust.rotation.x += 0.00005;

        // Rotate nebula clouds
        nebula.rotation.y += 0.00015;

        // Rotate wireframe
        wireframe.rotation.y -= 0.0005;
        wireframe.rotation.x += 0.0002;

        // Animate orbital rings
        orbitalRings[0].rotation.z += 0.001;
        orbitalRings[1].rotation.z -= 0.0008;
        if (orbitalRings[2]) {
          orbitalRings[2].rotation.z += 0.0006;
        }

        // Animate data particles
        const positions = dataParticles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
          const angle = elapsedTime * 0.5 + i * 0.1;
          const radius = sphereRadius + 0.3 + Math.sin(elapsedTime + i) * 0.1;
          positions[i] = Math.cos(angle) * radius;
          positions[i + 2] = Math.sin(angle) * radius;
        }
        dataParticles.geometry.attributes.position.needsUpdate = true;

        // Pulse connection lines
        connectionLines.forEach((line, i) => {
          line.material.opacity = 0.05 + 0.05 * Math.sin(elapsedTime * 1.5 + i * 0.5);
        });

        // Pulse skill rings
        skillMeshes.forEach(({ ring, halo }, i) => {
          ring.material.opacity = 0.4 + 0.2 * Math.sin(elapsedTime * 2 + i * 0.3);
          halo.material.opacity = 0.15 + 0.1 * Math.sin(elapsedTime * 1.5 + i * 0.2);
        });
      }

      // --------------------------------------------
      // HOVER DETECTION - Desktop only
      // Mobile uses touch events instead
      // --------------------------------------------
      if (!mobile) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(
          skillMeshes.map((m) => m.sprite)
        );

        let foundHover = false;

        skillMeshes.forEach(({ sprite, ring, halo, skill, originalScale }) => {
          const isHovered =
            intersects.length > 0 && intersects[0].object === sprite;

          if (isHovered) {
            foundHover = true;

            if (hoveredSkill.current !== skill.name) {
              hoveredSkill.current = skill.name;

              if (tooltipRef.current) {
                tooltipRef.current.innerHTML = `
                  <span class="tooltip-icon" style="background: ${skill.color}20; border-color: ${skill.color}">
                    <img src="${skill.icon}" alt="${skill.name}" />
                  </span>
                  <span class="tooltip-name">${skill.name}</span>
                `;
                tooltipRef.current.style.borderColor = skill.color;
                tooltipRef.current.classList.add("visible");
              }

              gsap.to(sprite.scale, {
                x: originalScale * 1.5,
                y: originalScale * 1.5,
                z: originalScale * 1.5,
                duration: 0.3,
                ease: "back.out(2)",
              });

              gsap.to(ring.material, { opacity: 1, duration: 0.2 });
              gsap.to(halo.material, { opacity: 0.6, duration: 0.2 });
              gsap.to(halo.scale, { x: 1.3, y: 1.3, z: 1.3, duration: 0.3 });

              controls.autoRotateSpeed = 0.08;
            }
          } else {
            gsap.to(sprite.scale, {
              x: originalScale,
              y: originalScale,
              z: originalScale,
              duration: 0.3,
              ease: "power2.out",
            });

            gsap.to(ring.material, { opacity: 0.4, duration: 0.2 });
            gsap.to(halo.material, { opacity: 0.15, duration: 0.2 });
            gsap.to(halo.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
          }
        });

        if (!foundHover) {
          if (tooltipRef.current) {
            tooltipRef.current.classList.remove("visible");
          }
          hoveredSkill.current = null;
          controls.autoRotateSpeed = 0.3;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // --------------------------------------------
    // RESIZE HANDLER
    // FIXED: Proper resize handling for mobile
    // --------------------------------------------
    const handleResize = () => {
      const { width: w, height: h } = getSize();
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    
    window.addEventListener("resize", handleResize);
    
    // FIXED: Handle orientation change on mobile
    window.addEventListener("orientationchange", () => {
      setTimeout(handleResize, 100);
    });

    // --------------------------------------------
    // CLEANUP
    // --------------------------------------------
    return () => {
      observer.disconnect();
      mount.removeEventListener("mousemove", onMouseMove);
      mount.removeEventListener("touchmove", onTouchMove);
      mount.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
      
      scene.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    };
  }, []);

  // ============================================
  // RENDER - Component JSX
  // ============================================
  return (
    <div className={`globe-wrapper ${isVisible ? "visible" : ""}`}>
      {/* ============================================
          LEFT DECORATIVE PANEL
          Hidden on mobile via CSS
          ============================================ */}
      <div className="side-panel left-panel">
        <div className="panel-content">
          
          {/* Real-time clock display */}
          <div className="panel-clock">
            <div className="clock-time">
              {currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
              })}
            </div>
            <div className="clock-date">
              {currentTime.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
          </div>
          
          {/* Animated tech lines */}
          <div className="tech-lines">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className="tech-line" 
                style={{ animationDelay: `${i * 0.2}s` }} 
              />
            ))}
          </div>
          
          {/* Dynamic metrics display */}
          <div className="panel-metrics">
            <div className="metric-item">
              <span className="metric-value">{metrics.uptime}</span>
              <span className="metric-label">Uptime</span>
            </div>
            <div className="metric-item">
              <span className="metric-value">{metrics.latency}</span>
              <span className="metric-label">Latency</span>
            </div>
            <div className="metric-item">
              <span className="metric-value">{metrics.throughput}</span>
              <span className="metric-label">Throughput</span>
            </div>
          </div>
          
          {/* Data stream visualization */}
          <div className="data-stream">
            <div className="stream-label">DATA STREAM</div>
            <div className="stream-bars">
              {[...Array(8)].map((_, i) => (
                <div 
                  key={i} 
                  className="stream-bar" 
                  style={{ 
                    animationDelay: `${i * 0.1}s`,
                    height: `${20 + Math.random() * 60}%`
                  }} 
                />
              ))}
            </div>
          </div>
          
          {/* Connection status */}
          <div className="connection-status">
            <div className="connection-dot" />
            <span>Connected</span>
          </div>
          
        </div>
      </div>

      {/* ============================================
          MAIN GLOBE CONTAINER
          Always visible including mobile
          ============================================ */}
      <div className="globe-container">
        
        {/* Background effects */}
        <div className="globe-bg-gradient" />
        <div className="globe-grid-pattern" />
        <div className="globe-noise-overlay" />
        
        {/* Three.js canvas mount point */}
        <div ref={mountRef} className="globe-canvas" />
        
        {/* Skill tooltip */}
        <div ref={tooltipRef} className="skill-tooltip" />
        
        {/* Drag/Touch instruction */}
        <div className="globe-overlay">
          <div className="drag-instruction">
            <div className="drag-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            {/* FIXED: Different text for mobile */}
            <span className="drag-text">
              {isMobile ? "Touch to explore skills" : "Drag to explore skills universe"}
            </span>
          </div>
        </div>
        
        {/* Corner decorations */}
        <div className="corner-decoration top-left" />
        <div className="corner-decoration top-right" />
        <div className="corner-decoration bottom-left" />
        <div className="corner-decoration bottom-right" />
        
        {/* Glow orbs */}
        <div className="glow-orbs">
          <div className="glow-orb orb-1" />
          <div className="glow-orb orb-2" />
          <div className="glow-orb orb-3" />
        </div>
        
        {/* ADDED: Mobile skill count badge */}
        <div className="mobile-skill-badge">
          <span className="badge-count">{skills.length}</span>
          <span className="badge-label">Skills</span>
        </div>
        
      </div>

      {/* ============================================
          RIGHT DECORATIVE PANEL
          Hidden on mobile via CSS
          ============================================ */}
      <div className="side-panel right-panel">
        <div className="panel-content">
          
          {/* Skill count display */}
          <div className="skill-count">
            <span className="count-number">{skills.length}</span>
            <span className="count-label">Skills</span>
          </div>
          
          {/* Active status */}
          <div className="status-indicator">
            <div className="status-dot" />
            <span>Active</span>
          </div>
          
          {/* Category filters */}
          <div className="skill-categories">
            <div className="category-label">Categories</div>
            
            <button 
              className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('all')}
            >
              <span className="cat-name">All</span>
              <span className="cat-count">{skillCounts.total}</span>
            </button>
            
            <button 
              className={`category-btn ${activeCategory === 'frontend' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('frontend')}
            >
              <span className="cat-name">Frontend</span>
              <span className="cat-count">{skillCounts.frontend}</span>
            </button>
            
            <button 
              className={`category-btn ${activeCategory === 'backend' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('backend')}
            >
              <span className="cat-name">Backend</span>
              <span className="cat-count">{skillCounts.backend}</span>
            </button>
            
            <button 
              className={`category-btn ${activeCategory === 'devops' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('devops')}
            >
              <span className="cat-name">DevOps</span>
              <span className="cat-count">{skillCounts.devops}</span>
            </button>
          </div>
          
          {/* Proficiency indicators */}
          <div className="proficiency-section">
            <div className="proficiency-label">Proficiency</div>
            <div className="proficiency-bars">
              <div className="prof-item">
                <span className="prof-level">Expert</span>
                <div className="prof-bar">
                  <div className="prof-fill expert" style={{ width: '85%' }} />
                </div>
              </div>
              
              <div className="prof-item">
                <span className="prof-level">Advanced</span>
                <div className="prof-bar">
                  <div className="prof-fill advanced" style={{ width: '70%' }} />
                </div>
              </div>
              
              <div className="prof-item">
                <span className="prof-level">Intermediate</span>
                <div className="prof-bar">
                  <div className="prof-fill intermediate" style={{ width: '55%' }} />
                </div>
              </div>
            </div>
          </div>
          
          {/* Version info */}
          <div className="version-info">
            <span className="version-label">v2.0.4</span>
            <span className="build-date">Build 2024</span>
          </div>
          
        </div>
      </div>
    </div>
  );
}

