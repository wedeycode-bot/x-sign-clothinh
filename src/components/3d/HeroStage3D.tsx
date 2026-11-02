'use client';

import React, { useState, Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { GarmentModel } from './GarmentModels';
import { GarmentType } from '@/types/product';
import { Box, RotateCw, Eye } from 'lucide-react';

interface HeroStage3DProps {
  onSelectProduct?: (garmentType: GarmentType) => void;
}

export const HeroStage3D: React.FC<HeroStage3DProps> = () => {
  const [activeGarment, setActiveGarment] = useState<GarmentType>('hoodie');
  const [wireframe, setWireframe] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const garmentColorways: Record<GarmentType, string[]> = {
    hoodie: ['#18181b', '#d8d3c7', '#3f151c'],
    tshirt: ['#1a1a1a', '#f0ede6', '#2a3b4c'],
    pants: ['#25282e', '#8c8070', '#3b4034'],
    jeans: ['#22313f', '#333333'],
    vest: ['#1d1d20', '#b5bdc5'],
    accessory: ['#171718', '#383b40'],
  };

  const currentColor = garmentColorways[activeGarment][colorIndex % garmentColorways[activeGarment].length];

  return (
    <div className="relative w-full h-[520px] lg:h-[620px] select-none">
      {/* 3D Canvas */}
      <Canvas
        shadows
        dpr={[1, 1.8]}
        camera={{ position: [0, 0.2, 4.4], fov: 42 }}
        className="cursor-grab active:cursor-grabbing w-full h-full"
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={2.0} castShadow shadow-mapSize={1024} />
        <directionalLight position={[-5, 3, -3]} intensity={0.8} color="#94a3b8" />
        <pointLight position={[0, -2, 2]} intensity={0.5} color="#ffffff" />

        <Suspense fallback={null}>
          <Float speed={2} rotationIntensity={0.25} floatIntensity={0.5} floatingRange={[-0.08, 0.08]}>
            <GarmentModel
              garmentType={activeGarment}
              color={currentColor}
              wireframe={wireframe}
              roughness={0.8}
              metalness={0.12}
              autoRotate={true}
              isFloating={false}
            />
          </Float>

          <ContactShadows
            position={[0, -1.8, 0]}
            opacity={0.75}
            scale={6}
            blur={2.8}
            far={4}
            color="#000000"
          />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          minDistance={2.4}
          maxDistance={6.5}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.7}
          autoRotate={false}
          dampingFactor={0.06}
        />
      </Canvas>

      {/* Floating Interactive Model Switcher */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-xs font-mono z-20 overflow-x-auto max-w-[92%] sm:max-w-none">
        {(['hoodie', 'tshirt', 'accessory', 'pants', 'vest'] as GarmentType[]).map((type) => (
          <button
            key={type}
            onClick={() => {
              setActiveGarment(type);
              setColorIndex(0);
            }}
            className={`px-3 py-1.5 rounded-full capitalize transition-all whitespace-nowrap ${
              activeGarment === type
                ? 'bg-white text-black font-bold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {type === 'hoodie'
              ? 'Oversized Hoodie'
              : type === 'tshirt'
              ? 'Boxy Tee'
              : type === 'accessory'
              ? 'Ribbed Beanie'
              : type === 'pants'
              ? 'Cargos'
              : 'Utility Vest'}
          </button>
        ))}
      </div>

      {/* Floating 3D Tools Badge */}
      <div className="absolute bottom-6 left-6 flex items-center gap-2">
        <button
          onClick={() => setColorIndex((prev) => prev + 1)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-zinc-300 hover:text-white hover:border-white/30 transition-all"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>CYCLE COLORWAY</span>
        </button>

        <button
          onClick={() => setWireframe(!wireframe)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md text-[11px] font-mono transition-all border ${
            wireframe
              ? 'bg-white/20 text-white border-white/40'
              : 'bg-black/60 text-zinc-300 hover:text-white border-white/10'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span>{wireframe ? 'SURFACE: SHADED' : 'SURFACE: WIRE'}</span>
        </button>
      </div>

      {/* 360 Hint */}
      <div className="absolute bottom-6 right-6 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-zinc-400">
        <Eye className="w-3.5 h-3.5 text-zinc-300" />
        <span>DRAG TO ROTATE 3D GARMENT</span>
      </div>
    </div>
  );
};
