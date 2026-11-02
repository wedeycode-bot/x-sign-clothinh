'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GarmentType } from '@/types/product';

interface GarmentModelProps {
  garmentType: GarmentType;
  color: string;
  wireframe?: boolean;
  roughness?: number;
  metalness?: number;
  autoRotate?: boolean;
  isFloating?: boolean;
}

export const GarmentModel: React.FC<GarmentModelProps> = ({
  garmentType,
  color,
  wireframe = false,
  roughness = 0.85,
  metalness = 0.08,
  autoRotate = false,
  isFloating = true,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  // Subtle floating levitation and optional gentle rotation
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    if (isFloating) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.08;
    }
    if (autoRotate) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  // Base PBR material with bump-map procedural fabric texture
  const fabricMaterial = useMemo(() => {
    if (typeof document === 'undefined') {
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        roughness,
        metalness,
        wireframe,
      });
    }

    // Generate high-resolution procedural micro-weave bump canvas
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, 128, 128);
      ctx.fillStyle = '#999999';
      for (let x = 0; x < 128; x += 4) {
        for (let y = 0; y < 128; y += 4) {
          if ((x + y) % 8 === 0) {
            ctx.fillRect(x, y, 2, 2);
          }
        }
      }
    }
    const bumpTexture = new THREE.CanvasTexture(canvas);
    bumpTexture.wrapS = THREE.RepeatWrapping;
    bumpTexture.wrapT = THREE.RepeatWrapping;
    bumpTexture.repeat.set(16, 16);

    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      roughness,
      metalness,
      wireframe,
      bumpMap: bumpTexture,
      bumpScale: 0.015,
      side: THREE.DoubleSide,
    });
  }, [color, wireframe, roughness, metalness]);

  // Accent trim material (zippers, hardware, ribbing)
  const trimMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#333338'),
      roughness: 0.4,
      metalness: 0.85,
      wireframe,
    });
  }, [wireframe]);

  const metalAccentMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#888c96'),
      roughness: 0.3,
      metalness: 0.85,
      wireframe,
    });
  }, [wireframe]);

  return (
    <group ref={groupRef} dispose={null}>
      {garmentType === 'hoodie' && (
        <HoodieGeometry fabricMat={fabricMaterial} trimMat={trimMaterial} goldMat={metalAccentMaterial} />
      )}
      {garmentType === 'tshirt' && (
        <TShirtGeometry fabricMat={fabricMaterial} trimMat={trimMaterial} />
      )}
      {(garmentType === 'pants' || garmentType === 'jeans') && (
        <PantsGeometry fabricMat={fabricMaterial} trimMat={trimMaterial} isJeans={garmentType === 'jeans'} />
      )}
      {garmentType === 'vest' && (
        <VestGeometry fabricMat={fabricMaterial} trimMat={trimMaterial} goldMat={metalAccentMaterial} />
      )}
      {garmentType === 'accessory' && (
        <BalaclavaGeometry fabricMat={fabricMaterial} trimMat={trimMaterial} goldMat={metalAccentMaterial} />
      )}
    </group>
  );
};

/* --- 1. OVERSIZED HOODIE GEOMETRY --- */
function HoodieGeometry({
  fabricMat,
  trimMat,
  goldMat,
}: {
  fabricMat: THREE.Material;
  trimMat: THREE.Material;
  goldMat: THREE.Material;
}) {
  return (
    <group position={[0, -0.2, 0]}>
      {/* Torso - Boxy drop-shoulder cut */}
      <mesh position={[0, 0.4, 0]} material={fabricMat} castShadow receiveShadow>
        <cylinderGeometry args={[0.9, 0.98, 1.4, 32]} />
      </mesh>

      {/* Bottom Hem Ribbing Band */}
      <mesh position={[0, -0.32, 0]} material={trimMat} castShadow>
        <cylinderGeometry args={[0.96, 0.96, 0.16, 32]} />
      </mesh>

      {/* Kangaroo Front Pocket */}
      <mesh position={[0, 0.15, 0.72]} rotation={[0.08, 0, 0]} material={fabricMat} castShadow>
        <boxGeometry args={[1.0, 0.55, 0.22]} />
      </mesh>

      {/* Kangaroo pocket side flaps angled */}
      <mesh position={[-0.42, 0.15, 0.7]} rotation={[0, -0.35, 0]} material={trimMat}>
        <boxGeometry args={[0.18, 0.45, 0.08]} />
      </mesh>
      <mesh position={[0.42, 0.15, 0.7]} rotation={[0, 0.35, 0]} material={trimMat}>
        <boxGeometry args={[0.18, 0.45, 0.08]} />
      </mesh>

      {/* Left Drop-Shoulder Sleeve */}
      <group position={[-1.15, 0.7, 0]} rotation={[0, 0, 0.5]}>
        <mesh position={[0, -0.7, 0]} material={fabricMat} castShadow>
          <cylinderGeometry args={[0.34, 0.25, 1.45, 24]} />
        </mesh>
        {/* Left Cuff Ribbing */}
        <mesh position={[0, -1.45, 0]} material={trimMat} castShadow>
          <cylinderGeometry args={[0.26, 0.24, 0.18, 24]} />
        </mesh>
      </group>

      {/* Right Drop-Shoulder Sleeve */}
      <group position={[1.15, 0.7, 0]} rotation={[0, 0, -0.5]}>
        <mesh position={[0, -0.7, 0]} material={fabricMat} castShadow>
          <cylinderGeometry args={[0.34, 0.25, 1.45, 24]} />
        </mesh>
        {/* Right Cuff Ribbing */}
        <mesh position={[0, -1.45, 0]} material={trimMat} castShadow>
          <cylinderGeometry args={[0.26, 0.24, 0.18, 24]} />
        </mesh>
      </group>

      {/* Oversized Double-ply Hood */}
      <group position={[0, 1.35, -0.15]}>
        {/* Outer Hood Dome */}
        <mesh material={fabricMat} castShadow>
          <sphereGeometry args={[0.62, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.75]} />
        </mesh>
        {/* Hood Collar wrap */}
        <mesh position={[0, -0.3, 0.25]} rotation={[0.4, 0, 0]} material={fabricMat}>
          <torusGeometry args={[0.42, 0.16, 16, 32, Math.PI * 1.3]} />
        </mesh>
      </group>

      {/* Metal Drawstring Aglets */}
      <mesh position={[-0.14, 0.65, 0.82]} material={goldMat} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 12]} />
      </mesh>
      <mesh position={[0.14, 0.62, 0.82]} material={goldMat} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.55, 12]} />
      </mesh>

      {/* Bonsam Chest Sigil / Rune Emblem */}
      <mesh position={[0, 0.68, 0.89]} rotation={[0, 0, 0]} material={goldMat}>
        <cylinderGeometry args={[0.12, 0.12, 0.02, 6]} />
      </mesh>
    </group>
  );
}

/* --- 2. BOXY HEAVYWEIGHT TEE GEOMETRY --- */
function TShirtGeometry({
  fabricMat,
  trimMat,
}: {
  fabricMat: THREE.Material;
  trimMat: THREE.Material;
}) {
  return (
    <group position={[0, -0.1, 0]}>
      {/* Boxy Torso */}
      <mesh position={[0, 0.35, 0]} material={fabricMat} castShadow receiveShadow>
        <cylinderGeometry args={[0.9, 0.95, 1.45, 32]} />
      </mesh>

      {/* High Ribbed Collar Ring */}
      <mesh position={[0, 1.08, 0]} rotation={[Math.PI / 2, 0, 0]} material={trimMat} castShadow>
        <torusGeometry args={[0.38, 0.06, 16, 32]} />
      </mesh>

      {/* Left Elongated Sleeve */}
      <group position={[-1.1, 0.75, 0]} rotation={[0, 0, 0.42]}>
        <mesh position={[0, -0.4, 0]} material={fabricMat} castShadow>
          <cylinderGeometry args={[0.32, 0.28, 0.85, 24]} />
        </mesh>
        <mesh position={[0, -0.84, 0]} material={trimMat}>
          <cylinderGeometry args={[0.29, 0.29, 0.05, 24]} />
        </mesh>
      </group>

      {/* Right Elongated Sleeve */}
      <group position={[1.1, 0.75, 0]} rotation={[0, 0, -0.42]}>
        <mesh position={[0, -0.4, 0]} material={fabricMat} castShadow>
          <cylinderGeometry args={[0.32, 0.28, 0.85, 24]} />
        </mesh>
        <mesh position={[0, -0.84, 0]} material={trimMat}>
          <cylinderGeometry args={[0.29, 0.29, 0.05, 24]} />
        </mesh>
      </group>

      {/* Bottom Hem Hemline */}
      <mesh position={[0, -0.38, 0]} material={trimMat}>
        <cylinderGeometry args={[0.96, 0.96, 0.06, 32]} />
      </mesh>

      {/* Front Architectural Graphics Plate */}
      <mesh position={[0, 0.45, 0.89]} material={trimMat}>
        <boxGeometry args={[0.65, 0.75, 0.01]} />
      </mesh>
    </group>
  );
}

/* --- 3. PANTS & JEANS GEOMETRY --- */
function PantsGeometry({
  fabricMat,
  trimMat,
  isJeans,
}: {
  fabricMat: THREE.Material;
  trimMat: THREE.Material;
  isJeans: boolean;
}) {
  return (
    <group position={[0, 0.1, 0]}>
      {/* Waistband */}
      <mesh position={[0, 0.85, 0]} material={trimMat} castShadow>
        <cylinderGeometry args={[0.82, 0.82, 0.18, 32]} />
      </mesh>

      {/* Belt loops */}
      {[-0.6, -0.2, 0.2, 0.6].map((x, idx) => (
        <mesh key={idx} position={[x, 0.85, 0.8]} material={trimMat}>
          <boxGeometry args={[0.04, 0.19, 0.04]} />
        </mesh>
      ))}

      {/* Pelvis Seat Area */}
      <mesh position={[0, 0.55, 0]} material={fabricMat} castShadow>
        <cylinderGeometry args={[0.82, 0.78, 0.45, 32]} />
      </mesh>

      {/* Left Leg */}
      <group position={[-0.42, 0.15, 0]}>
        {/* Thigh */}
        <mesh position={[0, -0.45, 0]} rotation={[0, 0, -0.04]} material={fabricMat} castShadow>
          <cylinderGeometry args={[0.36, 0.31, 0.95, 24]} />
        </mesh>
        {/* Articulated Knee */}
        <mesh position={[0, -0.95, 0.02]} rotation={[0.08, 0, 0]} material={trimMat}>
          <cylinderGeometry args={[0.32, 0.3, 0.22, 24]} />
        </mesh>
        {/* Calf */}
        <mesh position={[0, -1.45, 0]} material={fabricMat} castShadow>
          <cylinderGeometry args={[0.3, 0.26, 0.95, 24]} />
        </mesh>
        {/* Ankle Cinch */}
        <mesh position={[0, -1.95, 0]} material={trimMat}>
          <cylinderGeometry args={[0.27, 0.27, 0.1, 24]} />
        </mesh>

        {/* Cargo Box Pocket if tactical pants */}
        {!isJeans && (
          <mesh position={[-0.26, -0.4, 0.05]} rotation={[0, 0.2, 0]} material={trimMat} castShadow>
            <boxGeometry args={[0.18, 0.45, 0.38]} />
          </mesh>
        )}
      </group>

      {/* Right Leg */}
      <group position={[0.42, 0.15, 0]}>
        {/* Thigh */}
        <mesh position={[0, -0.45, 0]} rotation={[0, 0, 0.04]} material={fabricMat} castShadow>
          <cylinderGeometry args={[0.36, 0.31, 0.95, 24]} />
        </mesh>
        {/* Articulated Knee */}
        <mesh position={[0, -0.95, 0.02]} rotation={[0.08, 0, 0]} material={trimMat}>
          <cylinderGeometry args={[0.32, 0.3, 0.22, 24]} />
        </mesh>
        {/* Calf */}
        <mesh position={[0, -1.45, 0]} material={fabricMat} castShadow>
          <cylinderGeometry args={[0.3, 0.26, 0.95, 24]} />
        </mesh>
        {/* Ankle Cinch */}
        <mesh position={[0, -1.95, 0]} material={trimMat}>
          <cylinderGeometry args={[0.27, 0.27, 0.1, 24]} />
        </mesh>

        {/* Cargo Box Pocket if tactical pants */}
        {!isJeans && (
          <mesh position={[0.26, -0.4, 0.05]} rotation={[0, -0.2, 0]} material={trimMat} castShadow>
            <boxGeometry args={[0.18, 0.45, 0.38]} />
          </mesh>
        )}
      </group>
    </group>
  );
}

/* --- 4. TACTICAL PUFFER VEST GEOMETRY --- */
function VestGeometry({
  fabricMat,
  trimMat,
  goldMat,
}: {
  fabricMat: THREE.Material;
  trimMat: THREE.Material;
  goldMat: THREE.Material;
}) {
  return (
    <group position={[0, -0.1, 0]}>
      {/* 3 Tiered Baffle Chambers */}
      <mesh position={[0, 0.7, 0]} material={fabricMat} castShadow>
        <cylinderGeometry args={[0.82, 0.86, 0.45, 32]} />
      </mesh>
      <mesh position={[0, 0.25, 0]} material={fabricMat} castShadow>
        <cylinderGeometry args={[0.86, 0.89, 0.45, 32]} />
      </mesh>
      <mesh position={[0, -0.2, 0]} material={fabricMat} castShadow>
        <cylinderGeometry args={[0.89, 0.86, 0.45, 32]} />
      </mesh>

      {/* Stand-up High Collar */}
      <mesh position={[0, 1.05, 0]} material={trimMat} castShadow>
        <cylinderGeometry args={[0.48, 0.52, 0.3, 32, 1, true]} />
      </mesh>

      {/* Heavy Front Zipper Track */}
      <mesh position={[0, 0.25, 0.88]} material={goldMat}>
        <boxGeometry args={[0.06, 1.35, 0.05]} />
      </mesh>

      {/* Tactical Webbing Straps */}
      <mesh position={[-0.45, 0.25, 0.85]} material={trimMat}>
        <boxGeometry args={[0.12, 0.9, 0.04]} />
      </mesh>
      <mesh position={[0.45, 0.25, 0.85]} material={trimMat}>
        <boxGeometry args={[0.12, 0.9, 0.04]} />
      </mesh>
    </group>
  );
}

/* --- 5. MONOGRAM BALACLAVA GEOMETRY --- */
function BalaclavaGeometry({
  fabricMat,
  trimMat,
  goldMat,
}: {
  fabricMat: THREE.Material;
  trimMat: THREE.Material;
  goldMat: THREE.Material;
}) {
  return (
    <group position={[0, 0.1, 0]}>
      {/* Head Form */}
      <mesh position={[0, 0.5, 0]} material={fabricMat} castShadow>
        <sphereGeometry args={[0.68, 32, 24]} />
      </mesh>

      {/* Extended Neck Tube */}
      <mesh position={[0, -0.2, 0]} material={fabricMat} castShadow>
        <cylinderGeometry args={[0.54, 0.62, 0.85, 32]} />
      </mesh>

      {/* Eyewear Visor / Slit cutout rim */}
      <mesh position={[0, 0.52, 0.62]} rotation={[0, 0, 0]} material={trimMat}>
        <boxGeometry args={[0.62, 0.22, 0.12]} />
      </mesh>

      {/* Gold Talisman on Forehead */}
      <mesh position={[0, 0.88, 0.6]} material={goldMat}>
        <cylinderGeometry args={[0.08, 0.08, 0.03, 8]} />
      </mesh>
    </group>
  );
}
