import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Points, PointMaterial, Torus, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';

/** Slowly drifting starfield shell around the core. */
function ParticleField({ count = 1400, color = '#8ab4ff' }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const r = 3.2 + Math.random() * 5.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.65;
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.045;
    ref.current.rotation.x += delta * 0.012;
  });

  return (
    <Points ref={ref} positions={positions} frustumCulled={false}>
      <PointMaterial transparent color={color} size={0.035} sizeAttenuation depthWrite={false} opacity={0.75} />
    </Points>
  );
}

/** Morphing core: the "engine" of the hero. */
function Core({ brand = '#6366f1', accent = '#22d3ee' }) {
  const mesh = useRef();
  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    mesh.current.rotation.y = t * 0.18;
    mesh.current.rotation.z = Math.sin(t * 0.22) * 0.12;
  });

  return (
    <group>
      <Icosahedron ref={mesh} args={[1.35, 10]}>
        <MeshDistortMaterial
          color={brand}
          emissive={accent}
          emissiveIntensity={0.18}
          roughness={0.16}
          metalness={0.85}
          distort={0.42}
          speed={1.6}
        />
      </Icosahedron>
      <Icosahedron args={[2.05, 1]}>
        <meshBasicMaterial color={accent} wireframe transparent opacity={0.16} />
      </Icosahedron>
    </group>
  );
}

function Rings({ accent = '#22d3ee', brand = '#6366f1' }) {
  const a = useRef();
  const b = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (a.current) {
      a.current.rotation.x = Math.PI / 2.6 + Math.sin(t * 0.3) * 0.2;
      a.current.rotation.z = t * 0.22;
    }
    if (b.current) {
      b.current.rotation.y = Math.PI / 3 + t * 0.16;
      b.current.rotation.x = Math.cos(t * 0.25) * 0.25;
    }
  });
  return (
    <>
      <Torus ref={a} args={[3.05, 0.012, 12, 160]}>
        <meshBasicMaterial color={accent} transparent opacity={0.6} />
      </Torus>
      <Torus ref={b} args={[3.7, 0.008, 12, 160]}>
        <meshBasicMaterial color={brand} transparent opacity={0.45} />
      </Torus>
    </>
  );
}

/** Small solids standing in for the stack orbiting the core. */
function Satellites({ brand, accent }) {
  const group = useRef();
  const nodes = useMemo(
    () => [
      { pos: [2.9, 0.9, -0.6], geo: 'box', color: accent, s: 0.3 },
      { pos: [-3.0, -0.6, 0.8], geo: 'octa', color: brand, s: 0.34 },
      { pos: [1.4, -2.2, 1.4], geo: 'tetra', color: '#a855f7', s: 0.32 },
      { pos: [-1.8, 2.3, -1.2], geo: 'box', color: '#f59e0b', s: 0.26 },
      { pos: [3.4, -1.4, -1.6], geo: 'octa', color: '#10b981', s: 0.28 },
    ],
    [brand, accent]
  );

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.09;
  });

  return (
    <group ref={group}>
      {nodes.map((n, i) => (
        <Float key={i} speed={1.4 + i * 0.2} rotationIntensity={1.1} floatIntensity={1.5}>
          <mesh position={n.pos}>
            {n.geo === 'box' && <boxGeometry args={[n.s, n.s, n.s]} />}
            {n.geo === 'octa' && <octahedronGeometry args={[n.s]} />}
            {n.geo === 'tetra' && <tetrahedronGeometry args={[n.s]} />}
            <meshStandardMaterial color={n.color} metalness={0.7} roughness={0.25} emissive={n.color} emissiveIntensity={0.35} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

/** Camera eases toward the pointer for depth without a controls dependency. */
function PointerCamera() {
  const { camera, pointer } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  useFrame(() => {
    camera.position.x += (pointer.x * 1.5 - camera.position.x) * 0.045;
    camera.position.y += (pointer.y * 0.9 - camera.position.y) * 0.045;
    camera.lookAt(target);
  });
  return null;
}

export default function HeroScene({ brand = '#6366f1', accent = '#22d3ee', className = '' }) {
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return (
    <div className={className}>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 9.2], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        frameloop={reduced ? 'demand' : 'always'}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[6, 5, 6]} intensity={90} color={accent} />
          <pointLight position={[-7, -4, -4]} intensity={90} color={brand} />
          <Core brand={brand} accent={accent} />
          <Rings brand={brand} accent={accent} />
          <Satellites brand={brand} accent={accent} />
          <ParticleField color={accent} />
          <PointerCamera />
        </Suspense>
      </Canvas>
    </div>
  );
}
