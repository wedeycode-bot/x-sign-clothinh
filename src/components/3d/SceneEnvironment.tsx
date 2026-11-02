'use client';

import React, { useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Floating brutalist monolithic pillars reminiscent of high-fashion runway architecture
function BrutalistMonoliths() {
  const monolithMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#0d0e12'),
        roughness: 0.3,
        metalness: 0.7,
        flatShading: true,
      }),
    []
  );

  const trimMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#1f2128'),
        roughness: 0.4,
        metalness: 0.6,
      }),
    []
  );

  return (
    <group>
      {/* Central architectural plinth */}
      <mesh position={[0, -2.6, 0]} receiveShadow material={monolithMat}>
        <cylinderGeometry args={[4.2, 4.6, 0.5, 32]} />
      </mesh>
      {/* Plinth subtle rim bevel */}
      <mesh position={[0, -2.34, 0]} material={trimMat}>
        <torusGeometry args={[4.21, 0.03, 16, 64]} />
      </mesh>

      {/* Floating brutalist background pillars */}
      <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
        <mesh position={[-4.5, 1.2, -4]} rotation={[0.1, 0.4, -0.05]} material={monolithMat}>
          <boxGeometry args={[1.2, 5.5, 1.2]} />
        </mesh>
      </Float>

      <Float speed={1.6} rotationIntensity={0.15} floatIntensity={0.35}>
        <mesh position={[4.8, 0.8, -4.5]} rotation={[-0.1, -0.3, 0.08]} material={monolithMat}>
          <boxGeometry args={[1.4, 6.2, 1.4]} />
        </mesh>
      </Float>

      <Float speed={0.8} rotationIntensity={0.08} floatIntensity={0.25}>
        <mesh position={[-3.2, -0.5, -2.8]} rotation={[0.05, 0.2, 0]} material={monolithMat}>
          <boxGeometry args={[0.9, 3.8, 0.9]} />
        </mesh>
      </Float>

      <Float speed={1.4} rotationIntensity={0.12} floatIntensity={0.3}>
        <mesh position={[3.6, -0.2, -3.2]} rotation={[-0.05, -0.25, 0]} material={monolithMat}>
          <boxGeometry args={[1.1, 4.2, 1.1]} />
        </mesh>
      </Float>
    </group>
  );
}

// Subtle camera parallax responsive to cursor/scroll
function CameraRig() {
  const { camera, pointer } = useThree();

  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.8, 0.03);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 0.4 + 0.2, 0.03);
    camera.lookAt(0, 0.1, 0);
  });

  return null;
}

export const SceneEnvironment: React.FC<{ children?: React.ReactNode; className?: string }> = ({
  children,
  className = 'w-full h-full absolute inset-0',
}) => {
  return (
    <div className={`pointer-events-none select-none ${className}`}>
      <Canvas
        shadows
        dpr={[1, 1.5]}
        className="w-full h-full"
        gl={{ antialias: true, alpha: true }}
      >
        <PerspectiveCamera makeDefault position={[0, 0.2, 5.2]} fov={42} />
        <CameraRig />

        <ambientLight intensity={0.5} />
        <directionalLight
          position={[6, 10, 6]}
          intensity={2.2}
          color="#ffffff"
          castShadow
          shadow-mapSize={1024}
        />
        <directionalLight position={[-6, 4, -4]} intensity={0.8} color="#64748b" />
        <pointLight position={[0, -1, 3]} intensity={0.5} color="#cbd5e1" />

        <BrutalistMonoliths />

        {children}
      </Canvas>
    </div>
  );
};
