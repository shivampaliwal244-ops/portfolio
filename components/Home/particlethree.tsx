'use client';
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Particlethree() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // --- VARIABLES DEFINED OUTSIDE TRY BLOCK (Crucial for fix) ---
    let renderer: THREE.WebGLRenderer;
    let animationFrameId: number;
    let particlesGeometry: THREE.BufferGeometry;
    let particlesMaterial: THREE.PointsMaterial;

    try {
      // 1. SCENE SETUP
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 5;

      // WebGL Renderer - Antialiasing enabled for crisp, non-blurry hacker dots
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      mountRef.current.appendChild(renderer.domElement);

      const updateSize = () => {
        if (!mountRef.current) return;
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };

      // 🔥 HACKER DIGITAL RAIN SETUP (No Glow, Real Type)
      // Complexity here lies in numbers and deterministic behavior (falling traffic)
      const count = 3000;
      particlesGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const speeds = new Float32Array(count); // Individual vertical speeds

      for (let i = 0; i < count; i++) {
        // Spread particles across a wide X/Z plane (data streams)
        positions[i * 3] = (Math.random() - 0.5) * 20;     // X: Spread wide
        positions[i * 3 + 1] = Math.random() * 20 - 10;    // Y: Distributed height
        positions[i * 3 + 2] = (Math.random() - 0.5) * 15; // Z: Depth

        // Each data packet falls at a slightly different, deterministic speed
        speeds[i] = Math.random() * 0.05 + 0.02;
      }

      particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      
      // Strict points material: No Blending (prevents glow)
      particlesMaterial = new THREE.PointsMaterial({
        color: 0x00ff41, // Raw Matrix Green
        size: 0.04,     // Sharp, small dots
        transparent: true,
        opacity: 0.8,
        // No Aditive blending = No overexposure or glow.
      });

      const particles = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particles);

      // 🎬 ANIMATION LOOP (Deterministic Data Flow)
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        // Access raw positions array
        const pos = particlesGeometry.attributes.position.array as Float32Array;

        for (let i = 0; i < count; i++) {
          const i3 = i * 3;
          // Apply individual falling speed (Matrix Digital Rain simulation)
          pos[i3 + 1] -= speeds[i];

          // Reset traffic packet to the top once it falls below the screen
          if (pos[i3 + 1] < -10) {
            pos[i3 + 1] = 10;
          }
        }

        // Inform THREE that positions need GPU update
        particlesGeometry.attributes.position.needsUpdate = true;
        
        // Slow structure rotation adds isometric depth
        particles.rotation.y += 0.001;

        renderer.render(scene, camera);
      };

      updateSize();
      animate();
      window.addEventListener("resize", updateSize);

    } catch (error) {
      console.error("WebGL Hacker Background initialization failed:", error);
    }

    // --- FULL MEMORY CLEANUP FUNCTION ---
    // Memory is disposed here only if it was successfully initialized.
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", () => {});
      
      if (renderer) renderer.dispose();
      // Error Fixed: Check existence before disposal
      if (particlesGeometry!) particlesGeometry.dispose();
      if (particlesMaterial!) particlesMaterial.dispose();
      
      if (renderer && mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div className="three-bg hacker-matrix-bg" ref={mountRef}></div>;
}