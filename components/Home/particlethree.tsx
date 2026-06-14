'use client';
import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

export default function Particlethree() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    let renderer: THREE.WebGLRenderer;
    let animationFrameId: number;

    try {
      // scene setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 4;

      // WebGL Renderer with Error Handling
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

      // 🔥 PARTICLES & LINES SETUP
      const count = 80;
      const particlesGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const velocities = [];

      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
        velocities.push({
          x: (Math.random() - 0.5) * 0.01,
          y: (Math.random() - 0.5) * 0.01,
        });
      }

      particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const particlesMaterial = new THREE.PointsMaterial({
        color: 0x8a2be2,
        size: 0.05,
        transparent: true,
        opacity: 0.8,
      });

      const particles = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particles);

      // 🔗 DYNAMIC LINES SETUP
      const linesGeometry = new THREE.BufferGeometry();
      const linesMaterial = new THREE.LineBasicMaterial({
        color: 0x8a2be2,
        transparent: true,
        opacity: 0.2,
      });

      gsap.to([particlesMaterial.color, linesMaterial.color], {
        r: 0.7, 
        g: 0.2,
        b: 1,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
      const lines = new THREE.LineSegments(linesGeometry, linesMaterial);
      scene.add(lines);

      // 🎬 ANIMATION LOOP
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        const pos = particlesGeometry.attributes.position.array as Float32Array;
        const linePositions = [];

        for (let i = 0; i < count; i++) {
          const i3 = i * 3;
          pos[i3] += velocities[i].x;
          pos[i3 + 1] += velocities[i].y;

          if (pos[i3] > 5 || pos[i3] < -5) velocities[i].x *= -1;
          if (pos[i3 + 1] > 3 || pos[i3 + 1] < -3) velocities[i].y *= -1;

          for (let j = i + 1; j < count; j++) {
            const j3 = j * 3;
            const dx = pos[i3] - pos[j3];
            const dy = pos[i3 + 1] - pos[j3 + 1];
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 1.5) {
              linePositions.push(pos[i3], pos[i3 + 1], pos[i3 + 2]);
              linePositions.push(pos[j3], pos[j3 + 1], pos[j3 + 2]);
            }
          }
        }

        particlesGeometry.attributes.position.needsUpdate = true;
        linesGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(linePositions), 3));
        
        renderer.render(scene, camera);
      };

      updateSize();
      animate();
      window.addEventListener("resize", updateSize);

    } catch (error) {
      console.error("Could not create WebGL context:", error);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", () => {});
      if (renderer) {
        renderer.dispose();
        if (mountRef.current && renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  return <div className="three-bg" ref={mountRef}></div>;
}