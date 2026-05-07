import { useEffect, useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber/native';
import * as THREE from 'three';
import type { HotspotCategory, HotspotSeverity } from './derive';

const COLORS: Record<HotspotSeverity, string> = {
  idle: '#8A93A6',
  warn: '#FFB020',
  critical: '#E5484D',
};

const PULSE_SPEED: Record<HotspotSeverity, number> = {
  idle: 0,
  warn: 3.4,
  critical: 5.6,
};

const BASE_RADIUS = 0.18;

export type HotspotProps = {
  category: HotspotCategory;
  severity: HotspotSeverity;
  position: [number, number, number];
  registry: MutableRefObject<THREE.Mesh[]>;
};

export function Hotspot({ category, severity, position, registry }: HotspotProps) {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const haloRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    mesh.userData.hotspotCategory = category;
    registry.current.push(mesh);
    return () => {
      registry.current = registry.current.filter((m) => m !== mesh);
    };
  }, [category, registry]);

  useEffect(() => {
    if (severity === 'idle' && meshRef.current) {
      meshRef.current.scale.setScalar(1);
    }
  }, [severity]);

  useFrame((state) => {
    if (severity === 'idle') return;
    const t = state.clock.elapsedTime;
    const speed = PULSE_SPEED[severity];
    const pulse = 1 + Math.sin(t * speed) * 0.18;
    if (meshRef.current) {
      meshRef.current.scale.setScalar(pulse);
    }
    if (haloRef.current) {
      const haloScale = 1.2 + (Math.sin(t * speed) + 1) * 0.6;
      haloRef.current.scale.setScalar(haloScale);
      const mat = haloRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.35 - (Math.sin(t * speed) + 1) * 0.12;
    }
  });

  const color = COLORS[severity];
  const isActive = severity !== 'idle';

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[BASE_RADIUS, 20, 20]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isActive ? 1.2 : 0.4}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      {isActive ? (
        <mesh ref={haloRef}>
          <sphereGeometry args={[BASE_RADIUS * 1.6, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.25} depthWrite={false} />
        </mesh>
      ) : null}
    </group>
  );
}
