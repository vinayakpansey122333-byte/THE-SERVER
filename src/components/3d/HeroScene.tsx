import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { PixelHeroFallback } from './PixelHeroFallback';

/**
 * Seeded 2D pseudo-noise for procedural Minecraft terrain
 */
function simpleTerrainNoise(x: number, z: number): number {
  const nx = x * 0.15;
  const nz = z * 0.15;
  const h1 = Math.sin(nx) * Math.cos(nz) * 2.2;
  const h2 = Math.sin(nx * 0.5 + 1.2) * Math.cos(nz * 0.7) * 1.5;
  const h3 = Math.sin(nx * 2.1) * Math.cos(nz * 2.1) * 0.5;
  return Math.round(h1 + h2 + h3);
}

export const HeroScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reduceEffects, setReduceEffects] = useState<boolean>(() => {
    return localStorage.getItem('mc_reduce_effects') === 'true';
  });
  const [webglSupported, setWebglSupported] = useState<boolean>(true);

  const toggleReduceEffects = () => {
    setReduceEffects((prev) => {
      const next = !prev;
      localStorage.setItem('mc_reduce_effects', String(next));
      return next;
    });
  };

  useEffect(() => {
    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    if (reduceEffects) return;

    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setReduceEffects(true);
      return;
    }

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0910);
    scene.fog = new THREE.FogExp2(0x0a0910, 0.045);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 10, 22);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    const pixelRatio = Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.2 : 1.75);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Dusk Lighting
    const ambientLight = new THREE.AmbientLight(0x282338, 1.2);
    scene.add(ambientLight);

    const duskSun = new THREE.DirectionalLight(0xd8b24a, 1.5);
    duskSun.position.set(15, 20, 10);
    scene.add(duskSun);

    const rimLight = new THREE.DirectionalLight(0x8e6bdb, 1.8);
    rimLight.position.set(-15, 10, -10);
    scene.add(rimLight);

    // Glowing point lights
    const amethystLight = new THREE.PointLight(0x8e6bdb, 3, 12);
    amethystLight.position.set(-3, 3, 2);
    scene.add(amethystLight);

    const emeraldLight = new THREE.PointLight(0x3ddc84, 2.5, 12);
    emeraldLight.position.set(4, 2, -1);
    scene.add(emeraldLight);

    // Terrain InstancedMesh
    const gridSize = 22; // 22x22 grid of blocks
    const totalBlocks = gridSize * gridSize;
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

    // Materials
    const stoneMat = new THREE.MeshLambertMaterial({ color: 0x221f2d });
    const grassMat = new THREE.MeshLambertMaterial({ color: 0x364835 });
    const deepslateMat = new THREE.MeshLambertMaterial({ color: 0x14121b });
    const amethystOreMat = new THREE.MeshLambertMaterial({
      color: 0x8e6bdb,
      emissive: 0x5c3ea6,
      emissiveIntensity: 0.8,
    });
    const emeraldOreMat = new THREE.MeshLambertMaterial({
      color: 0x3ddc84,
      emissive: 0x1f9453,
      emissiveIntensity: 0.8,
    });

    const terrainMesh = new THREE.InstancedMesh(boxGeometry, stoneMat, totalBlocks);
    const oreMesh = new THREE.InstancedMesh(boxGeometry, amethystOreMat, 15);
    const emeraldMesh = new THREE.InstancedMesh(boxGeometry, emeraldOreMat, 15);

    const dummy = new THREE.Object3D();
    let blockIndex = 0;
    let oreIndex = 0;
    let emeraldIndex = 0;

    const offset = gridSize / 2;
    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        const wx = x - offset;
        const wz = z - offset;
        const height = simpleTerrainNoise(wx, wz);

        dummy.position.set(wx, height, wz);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();

        terrainMesh.setMatrixAt(blockIndex++, dummy.matrix);

        // Place occasional glowing ores
        if ((x + z) % 11 === 0 && oreIndex < 15) {
          dummy.position.set(wx, height + 1, wz);
          dummy.updateMatrix();
          oreMesh.setMatrixAt(oreIndex++, dummy.matrix);
        } else if ((x * 3 + z) % 17 === 0 && emeraldIndex < 15) {
          dummy.position.set(wx, height + 1, wz);
          dummy.updateMatrix();
          emeraldMesh.setMatrixAt(emeraldIndex++, dummy.matrix);
        }
      }
    }

    terrainMesh.instanceMatrix.needsUpdate = true;
    oreMesh.instanceMatrix.needsUpdate = true;
    emeraldMesh.instanceMatrix.needsUpdate = true;

    scene.add(terrainMesh);
    scene.add(oreMesh);
    scene.add(emeraldMesh);

    // Water Plane
    const waterGeo = new THREE.PlaneGeometry(28, 28);
    const waterMat = new THREE.MeshLambertMaterial({
      color: 0x1d2d44,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide,
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.y = -0.5;
    scene.add(water);

    // Floating Voxel Spores / Embers Particles
    const particleCount = 45;
    const particleGeo = new THREE.BoxGeometry(0.08, 0.08, 0.08);
    const particleMat = new THREE.MeshBasicMaterial({
      color: 0x8e6bdb,
      transparent: true,
      opacity: 0.75,
    });
    const particles = new THREE.InstancedMesh(particleGeo, particleMat, particleCount);

    const particleVelocities: Array<{ x: number; y: number; z: number }> = [];
    for (let i = 0; i < particleCount; i++) {
      dummy.position.set(
        (Math.random() - 0.5) * 16,
        Math.random() * 8,
        (Math.random() - 0.5) * 16
      );
      dummy.updateMatrix();
      particles.setMatrixAt(i, dummy.matrix);
      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.005,
        y: 0.005 + Math.random() * 0.008,
        z: (Math.random() - 0.5) * 0.005,
      });
    }
    particles.instanceMatrix.needsUpdate = true;
    scene.add(particles);

    // Mouse parallax tracking
    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let currentParallaxX = 0;
    let currentParallaxY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      targetParallaxX = nx * 1.5;
      targetParallaxY = -ny * 0.8;
    };
    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Visibility Observer to pause when offscreen
    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(container);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Camera gentle cinematic orbit + parallax
      currentParallaxX += (targetParallaxX - currentParallaxX) * 0.04;
      currentParallaxY += (targetParallaxY - currentParallaxY) * 0.04;

      const baseAngle = elapsedTime * 0.05;
      const radius = 22;
      camera.position.x = Math.sin(baseAngle) * radius + currentParallaxX;
      camera.position.z = Math.cos(baseAngle) * radius;
      camera.position.y = 8 + Math.sin(elapsedTime * 0.1) * 1.2 + currentParallaxY;
      camera.lookAt(0, 0.5, 0);

      // Float particles
      for (let i = 0; i < particleCount; i++) {
        particles.getMatrixAt(i, dummy.matrix);
        dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
        dummy.position.y += particleVelocities[i].y;
        dummy.position.x += particleVelocities[i].x;
        dummy.position.z += particleVelocities[i].z;

        if (dummy.position.y > 10) {
          dummy.position.y = 0;
          dummy.position.x = (Math.random() - 0.5) * 16;
          dummy.position.z = (Math.random() - 0.5) * 16;
        }

        dummy.updateMatrix();
        particles.setMatrixAt(i, dummy.matrix);
      }
      particles.instanceMatrix.needsUpdate = true;

      // Pulse ore lights subtly
      amethystLight.intensity = 2.4 + Math.sin(elapsedTime * 2) * 0.6;
      emeraldLight.intensity = 2.0 + Math.cos(elapsedTime * 1.8) * 0.5;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);

      boxGeometry.dispose();
      waterGeo.dispose();
      particleGeo.dispose();
      stoneMat.dispose();
      grassMat.dispose();
      deepslateMat.dispose();
      amethystOreMat.dispose();
      emeraldOreMat.dispose();
      waterMat.dispose();
      particleMat.dispose();
      renderer.dispose();

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [reduceEffects, webglSupported]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Fallback component if WebGL is disabled or reduced effects is requested */}
      {(!webglSupported || reduceEffects) && <PixelHeroFallback />}

      {/* 3D Canvas Container */}
      <div
        ref={containerRef}
        className={`absolute inset-0 transition-opacity duration-700 ${
          reduceEffects || !webglSupported ? 'opacity-0' : 'opacity-100'
        }`}
        aria-hidden="true"
      />

      {/* Vignette & Contrast gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0910] via-transparent to-[#0A0910]/60 pointer-events-none" />
      <div className="absolute inset-0 bg-radial from-transparent via-[#0A0910]/40 to-[#0A0910]/80 pointer-events-none" />

      {/* User-visible "Reduce effects" toggle button */}
      <div className="absolute bottom-4 right-4 z-20 pointer-events-auto">
        <button
          onClick={toggleReduceEffects}
          className="text-[11px] font-mono px-2.5 py-1 bg-[#14121B]/90 hover:bg-[#26232E] text-[#A29DB3] hover:text-white border border-[#2E2A38] transition-colors flex items-center gap-1.5 shadow-md"
          title="Toggle 3D visual effects for reduced battery & CPU usage"
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              reduceEffects ? 'bg-amber-400' : 'bg-emerald-400'
            }`}
          />
          {reduceEffects ? 'Effects: Minimal' : 'Reduce effects'}
        </button>
      </div>
    </div>
  );
};
