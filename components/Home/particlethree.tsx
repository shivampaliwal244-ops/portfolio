'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Particlethree() {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        let renderer: THREE.WebGLRenderer | null = null;
        let scene: THREE.Scene | null = null;
        let camera: THREE.PerspectiveCamera | null = null;
        let particlesGeometry: THREE.BufferGeometry | null = null;
        let particlesMaterial: THREE.PointsMaterial | null = null;
        let particles: THREE.Points | null = null;
        let animationFrameId = 0;

        const currentMount = mountRef.current;

        try {
            scene = new THREE.Scene();

            camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
            camera.position.z = 5;

            renderer = new THREE.WebGLRenderer({
                alpha: true,
                antialias: true,
                powerPreference: 'high-performance'
            });

            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
            currentMount.appendChild(renderer.domElement);

            const count = window.innerWidth < 768 ? 1600 : 2800;

            particlesGeometry = new THREE.BufferGeometry();

            const positions = new Float32Array(count * 3);
            const speeds = new Float32Array(count);
            const drift = new Float32Array(count);

            for (let i = 0; i < count; i++) {
                const i3 = i * 3;

                positions[i3] = (Math.random() - 0.5) * 24;
                positions[i3 + 1] = Math.random() * 22 - 11;
                positions[i3 + 2] = (Math.random() - 0.5) * 16;

                speeds[i] = Math.random() * 0.035 + 0.012;
                drift[i] = (Math.random() - 0.5) * 0.006;
            }

            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

            particlesMaterial = new THREE.PointsMaterial({
                color: 0x00ff41,
                size: window.innerWidth < 768 ? 0.03 : 0.04,
                transparent: true,
                opacity: 0.78,
                depthWrite: false
            });

            particles = new THREE.Points(particlesGeometry, particlesMaterial);
            scene.add(particles);

            const updateSize = () => {
                if (!renderer || !camera || !mountRef.current) return;

                const width = mountRef.current.clientWidth;
                const height = mountRef.current.clientHeight || window.innerHeight;

                renderer.setSize(width, height);
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
            };

            const animate = () => {
                animationFrameId = requestAnimationFrame(animate);

                if (!particlesGeometry || !particles || !renderer || !scene || !camera) return;

                const pos = particlesGeometry.attributes.position.array as Float32Array;

                for (let i = 0; i < count; i++) {
                    const i3 = i * 3;

                    pos[i3 + 1] -= speeds[i];
                    pos[i3] += drift[i];

                    if (pos[i3 + 1] < -11) {
                        pos[i3 + 1] = 11;
                        pos[i3] = (Math.random() - 0.5) * 24;
                    }

                    if (pos[i3] > 12 || pos[i3] < -12) {
                        pos[i3] *= -1;
                    }
                }

                particlesGeometry.attributes.position.needsUpdate = true;

                particles.rotation.y += 0.0008;
                particles.rotation.x = Math.sin(Date.now() * 0.00015) * 0.03;

                renderer.render(scene, camera);
            };

            updateSize();
            animate();

            window.addEventListener('resize', updateSize);

            return () => {
                cancelAnimationFrame(animationFrameId);
                window.removeEventListener('resize', updateSize);

                if (particlesGeometry) particlesGeometry.dispose();
                if (particlesMaterial) particlesMaterial.dispose();

                if (scene && particles) {
                    scene.remove(particles);
                }

                if (renderer) {
                    renderer.dispose();

                    if (renderer.domElement && currentMount.contains(renderer.domElement)) {
                        currentMount.removeChild(renderer.domElement);
                    }
                }
            };
        } catch (error) {
            console.error('Cyber particle background initialization failed:', error);
        }

        return () => {
            cancelAnimationFrame(animationFrameId);

            if (particlesGeometry) particlesGeometry.dispose();
            if (particlesMaterial) particlesMaterial.dispose();

            if (renderer) {
                renderer.dispose();

                if (renderer.domElement && currentMount.contains(renderer.domElement)) {
                    currentMount.removeChild(renderer.domElement);
                }
            }
        };
    }, []);

    return <div className="three-bg hacker-matrix-bg" ref={mountRef}></div>;
}