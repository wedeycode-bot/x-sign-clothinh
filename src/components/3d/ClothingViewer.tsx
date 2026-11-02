'use client';

import React, { useState, Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float, Stage } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { GarmentModel } from './GarmentModels';
import { Product, ProductColor } from '@/types/product';
import { RotateCcw, Play, Pause, Eye, Box, ZoomIn, ZoomOut, Sparkles } from 'lucide-react';

interface ClothingViewerProps {
  product: Product;
  selectedColor?: ProductColor;
  onColorChange?: (color: ProductColor) => void;
  className?: string;
  showControlsBar?: boolean;
}

export const ClothingViewer: React.FC<ClothingViewerProps> = ({
  product,
  selectedColor,
  onColorChange,
  className = 'h-[500px] w-full',
  showControlsBar = true,
}) => {
  const [currentColor, setCurrentColor] = useState<ProductColor>(
    selectedColor || product.colors[0]
  );
  const [isWireframe, setIsWireframe] = useState(false);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [isEnhancedFabric, setIsEnhancedFabric] = useState(true);
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const activeColor = selectedColor || currentColor;

  const handleColorSelect = (c: ProductColor) => {
    setCurrentColor(c);
    if (onColorChange) onColorChange(c);
  };

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const handleZoom = (delta: number) => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      camera.position.multiplyScalar(delta);
      controlsRef.current.update();
    }
  };

  return (
    <div className={`relative bg-gradient-to-b from-[#0c0d12] via-[#090a0f] to-[#060608] rounded-2xl overflow-hidden border border-white/5 select-none ${className}`}>
      {/* 3D Canvas */}
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 3.8], fov: 45 }}
        className="cursor-grab active:cursor-grabbing w-full h-full"
      >
        <color attach="background" args={['#08080b']} />
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.8}
          castShadow
          shadow-mapSize={1024}
        />
        <directionalLight position={[-5, 4, -4]} intensity={0.6} color="#94a3b8" />
        <pointLight position={[0, -2, 2]} intensity={0.4} color="#ffffff" />

        <Suspense fallback={null}>
          <Float
            speed={2}
            rotationIntensity={0.2}
            floatIntensity={0.4}
            floatingRange={[-0.05, 0.05]}
          >
            <GarmentModel
              garmentType={product.garmentType}
              color={activeColor.modelHex || activeColor.hex}
              wireframe={isWireframe}
              roughness={isEnhancedFabric ? product.model3DConfig.roughness : 0.5}
              metalness={isEnhancedFabric ? product.model3DConfig.metalness : 0.1}
              autoRotate={isAutoRotate}
            />
          </Float>

          <ContactShadows
            position={[0, -1.6, 0]}
            opacity={0.65}
            scale={5}
            blur={2.4}
            far={4}
            color="#000000"
          />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          minDistance={2.0}
          maxDistance={6.0}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.7}
          autoRotate={isAutoRotate}
          autoRotateSpeed={1.8}
          dampingFactor={0.08}
        />
      </Canvas>

      {/* Floating 3D Badge Indicator */}
      <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono tracking-wider text-zinc-300 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        INTERACTIVE 3D INSPECTOR
      </div>

      {/* Instructions Overlay */}
      <div className="absolute bottom-4 left-4 hidden sm:flex items-center gap-2 text-[11px] font-mono text-zinc-500 pointer-events-none">
        <span>DRAG TO ROTATE 360°</span>
        <span>•</span>
        <span>PINCH / SCROLL TO ZOOM</span>
      </div>

      {/* Controls Bar */}
      {showControlsBar && (
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {/* Auto Rotate Toggle */}
          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            title={isAutoRotate ? 'Pause Rotation' : 'Auto Rotate'}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              isAutoRotate
                ? 'bg-white/15 text-white border border-white/20'
                : 'bg-black/60 text-zinc-400 hover:text-white border border-white/5'
            }`}
          >
            {isAutoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Wireframe Toggle */}
          <button
            onClick={() => setIsWireframe(!isWireframe)}
            title={isWireframe ? 'Shaded View' : 'Wireframe View'}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              isWireframe
                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                : 'bg-black/60 text-zinc-400 hover:text-white border border-white/5'
            }`}
          >
            <Box className="w-4 h-4" />
          </button>

          {/* Fabric Specular Texture Toggle */}
          <button
            onClick={() => setIsEnhancedFabric(!isEnhancedFabric)}
            title="Toggle PBR Micro-Weave Texture"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              isEnhancedFabric
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                : 'bg-black/60 text-zinc-400 hover:text-white border border-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* Zoom In */}
          <button
            onClick={() => handleZoom(0.85)}
            title="Zoom In"
            className="w-9 h-9 rounded-full bg-black/60 text-zinc-400 hover:text-white border border-white/5 flex items-center justify-center transition-all"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Zoom Out */}
          <button
            onClick={() => handleZoom(1.15)}
            title="Zoom Out"
            className="w-9 h-9 rounded-full bg-black/60 text-zinc-400 hover:text-white border border-white/5 flex items-center justify-center transition-all"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Reset Camera */}
          <button
            onClick={handleResetCamera}
            title="Reset Angle"
            className="w-9 h-9 rounded-full bg-black/60 text-zinc-400 hover:text-white border border-white/5 flex items-center justify-center transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Interactive Color Swatch Bar inside viewer */}
      {product.colors.length > 1 && (
        <div className="absolute bottom-4 right-4 flex items-center gap-2 p-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 pl-2 pr-1 hidden sm:inline">
            Color:
          </span>
          {product.colors.map((c) => (
            <button
              key={c.hex}
              onClick={() => handleColorSelect(c)}
              className={`w-6 h-6 rounded-full border transition-all ${
                activeColor.hex === c.hex
                  ? 'border-white scale-110 shadow-lg shadow-white/20'
                  : 'border-white/20 hover:scale-105 opacity-70'
              }`}
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
        </div>
      )}
    </div>
  );
};
