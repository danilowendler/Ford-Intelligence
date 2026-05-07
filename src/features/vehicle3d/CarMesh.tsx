import { useMemo } from 'react';
import * as THREE from 'three';

const FORD_BLUE = '#1F6FEB';
const BODY_DARK = '#0F1623';
const CABIN_GLASS = '#0A1422';
const TIRE_COLOR = '#0A0E14';
const RIM_COLOR = '#3B4252';
const HEADLIGHT_COLOR = '#FFE9A8';

type WheelProps = {
  position: [number, number, number];
};

function Wheel({ position }: WheelProps) {
  return (
    <group position={position}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.42, 0.42, 0.32, 24]} />
        <meshStandardMaterial color={TIRE_COLOR} roughness={0.95} metalness={0.05} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.22, 0.22, 0.34, 16]} />
        <meshStandardMaterial color={RIM_COLOR} roughness={0.4} metalness={0.85} />
      </mesh>
    </group>
  );
}

export function CarMesh() {
  const bodyMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: BODY_DARK,
        metalness: 0.55,
        roughness: 0.32,
      }),
    [],
  );

  const accentMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: FORD_BLUE,
        metalness: 0.5,
        roughness: 0.45,
        emissive: '#0A2050',
        emissiveIntensity: 0.4,
      }),
    [],
  );

  const glassMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: CABIN_GLASS,
        metalness: 0.9,
        roughness: 0.15,
        transparent: true,
        opacity: 0.85,
      }),
    [],
  );

  const headlightMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: HEADLIGHT_COLOR,
        emissive: HEADLIGHT_COLOR,
        emissiveIntensity: 0.9,
        roughness: 0.3,
      }),
    [],
  );

  return (
    <group>
      <mesh position={[0, 0.65, 0]} material={bodyMaterial} castShadow receiveShadow>
        <boxGeometry args={[2.05, 0.4, 4.45]} />
      </mesh>

      <mesh position={[0, 0.95, 0]} material={bodyMaterial} castShadow receiveShadow>
        <boxGeometry args={[2.0, 0.5, 4.4]} />
      </mesh>

      <mesh position={[0, 1.18, 1.45]} material={accentMaterial} castShadow>
        <boxGeometry args={[1.85, 0.12, 1.55]} />
      </mesh>

      <mesh position={[0, 1.18, -1.55]} material={bodyMaterial} castShadow>
        <boxGeometry args={[1.85, 0.12, 1.35]} />
      </mesh>

      <mesh position={[0, 1.45, -0.2]} material={glassMaterial} castShadow>
        <boxGeometry args={[1.78, 0.55, 2.35]} />
      </mesh>

      <mesh position={[0, 1.05, 2.22]}>
        <boxGeometry args={[1.95, 0.18, 0.05]} />
        <meshStandardMaterial
          color={FORD_BLUE}
          emissive={FORD_BLUE}
          emissiveIntensity={0.6}
          roughness={0.3}
        />
      </mesh>

      <mesh position={[-0.65, 1.05, 2.21]} material={headlightMaterial}>
        <boxGeometry args={[0.45, 0.14, 0.08]} />
      </mesh>
      <mesh position={[0.65, 1.05, 2.21]} material={headlightMaterial}>
        <boxGeometry args={[0.45, 0.14, 0.08]} />
      </mesh>

      <mesh position={[-0.6, 1.05, -2.21]}>
        <boxGeometry args={[0.45, 0.14, 0.08]} />
        <meshStandardMaterial
          color="#E5484D"
          emissive="#E5484D"
          emissiveIntensity={0.7}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0.6, 1.05, -2.21]}>
        <boxGeometry args={[0.45, 0.14, 0.08]} />
        <meshStandardMaterial
          color="#E5484D"
          emissive="#E5484D"
          emissiveIntensity={0.7}
          roughness={0.3}
        />
      </mesh>

      <Wheel position={[-1.05, 0.42, 1.45]} />
      <Wheel position={[1.05, 0.42, 1.45]} />
      <Wheel position={[-1.05, 0.42, -1.45]} />
      <Wheel position={[1.05, 0.42, -1.45]} />

      <mesh
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[5, 48]} />
        <meshStandardMaterial color="#0A0E14" roughness={1} metalness={0} />
      </mesh>
    </group>
  );
}
