import { Component, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Billboard, Html, Points, PointMaterial, Ring, Torus, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const RINGS = [
  { tilt: [1.18, 0, 0.34], speed: 0.19, color: 'accent' },
  { tilt: [1.02, 0.55, -0.22], speed: -0.14, color: 'brand' },
  { tilt: [1.35, -0.4, 0.12], speed: 0.1, color: 'accent' },
];

const CORE_RADIUS = 1.18;
const HALF_FOV = Math.tan(THREE.MathUtils.degToRad(45) / 2); // camera fov is 45

/**
 * The rig is solved from the canvas size: pick how big the portrait should be, then
 * derive the orbit radii and camera distance that make it come out that size with the
 * labels still in frame. A phone gets a large portrait with a tight, label-free orbit;
 * a wide canvas gets the full labelled constellation.
 */
function useLayout() {
  const { size } = useThree();
  return useMemo(() => {
    const w = Math.max(1, size.width);
    const h = Math.max(1, size.height);
    const aspect = w / h;

    const labels = w >= 430;
    const labelHalf = labels ? 72 : 10; // widest a label chip can get, in px

    // How big the face should read on this canvas.
    const targetPx = THREE.MathUtils.clamp(0.4 * Math.min(w, h), 120, 230);

    // Outer orbit that produces that portrait size once everything is framed.
    const outer = THREE.MathUtils.clamp((CORE_RADIUS * (w - 2 * labelHalf)) / targetPx - 0.5, 2.25, 5.2);
    const ratios = outer >= 3.8 ? [0.62, 0.81, 1] : outer >= 2.6 ? [0.78, 1] : [0.84, 1];
    const radii = ratios.map((r) => r * outer);
    const maxNodes = radii.length * (labels ? 4 : 3);

    // Camera distance converges in a few passes: label width is in pixels, and how many
    // world units that spans depends on the distance we are solving for.
    let z = (outer + 1.5) / (HALF_FOV * aspect);
    for (let i = 0; i < 4; i += 1) {
      const pxPerUnit = h / (2 * HALF_FOV * z);
      const pad = labels ? 0.45 + labelHalf / pxPerUnit : 0.35;
      z = Math.max((outer + pad) / (HALF_FOV * aspect), (outer * 0.85 + pad * 0.6) / HALF_FOV, 5);
    }

    return { z, coreScale: 1, radii, labels, maxNodes };
  }, [size.width, size.height]);
}

/* ------------------------------ avatar core ------------------------------ */

function AvatarDisc({ url, accent }) {
  const texture = useTexture(url);
  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
  }, [texture]);
  return (
    <>
      <mesh>
        <circleGeometry args={[CORE_RADIUS, 72]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, -0.02]}>
        <circleGeometry args={[1.26, 72]} />
        <meshBasicMaterial color={accent} transparent opacity={0.55} />
      </mesh>
    </>
  );
}

/** Any avatar that fails to load falls back to a glowing orb instead of blanking the hero. */
class AvatarBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function FallbackDisc({ brand, accent }) {
  return (
    <mesh>
      <circleGeometry args={[CORE_RADIUS, 72]} />
      <meshBasicMaterial color={brand} toneMapped={false} />
      <mesh position={[0, 0, 0.01]}>
        <ringGeometry args={[0.9, 1.18, 72]} />
        <meshBasicMaterial color={accent} transparent opacity={0.5} />
      </mesh>
    </mesh>
  );
}

function Core({ avatar, brand, accent, active, scale = 1 }) {
  const group = useRef();
  const halo = useRef();
  const arc = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) group.current.position.y = Math.sin(t * 0.7) * 0.09;
    if (arc.current) arc.current.rotation.z = -t * 0.55;
    if (halo.current) {
      const pulse = 1 + Math.sin(t * 1.6) * 0.03 + (active ? 0.06 : 0);
      halo.current.scale.setScalar(pulse);
    }
  });

  const fallback = <FallbackDisc brand={brand} accent={accent} />;

  return (
    <group ref={group} scale={scale}>
      <Billboard>
        <AvatarBoundary fallback={fallback}>
          <Suspense fallback={fallback}>{avatar ? <AvatarDisc url={avatar} accent={accent} /> : fallback}</Suspense>
        </AvatarBoundary>

        {/* soft halo behind the portrait */}
        <mesh ref={halo} position={[0, 0, -0.08]}>
          <circleGeometry args={[1.85, 64]} />
          <meshBasicMaterial color={accent} transparent opacity={0.1} depthWrite={false} />
        </mesh>

        {/* rim + rotating accent arc */}
        <Ring args={[1.27, 1.31, 96]}>
          <meshBasicMaterial color={accent} transparent opacity={0.85} side={THREE.DoubleSide} />
        </Ring>
        <Ring ref={arc} args={[1.38, 1.41, 96, 1, 0, Math.PI * 0.6]}>
          <meshBasicMaterial color={brand} transparent opacity={0.9} side={THREE.DoubleSide} />
        </Ring>
        <Ring args={[1.52, 1.525, 96]}>
          <meshBasicMaterial color={brand} transparent opacity={0.25} side={THREE.DoubleSide} />
        </Ring>
      </Billboard>
    </group>
  );
}

/* -------------------------------- nodes ---------------------------------- */

function SkillNode({ node, position, color, active, labels, onHover, onSelect }) {
  const anchor = useRef();
  const mesh = useRef();
  const label = useRef();
  const scale = useRef(1);
  const world = useMemo(() => new THREE.Vector3(), []);

  // Label sits just outside the node, along the ring's radius, so it never lands on the portrait.
  const labelOffset = useMemo(() => new THREE.Vector3(...position).normalize().multiplyScalar(0.75).toArray(), [position]);

  useFrame(({ camera }, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.x += delta * 0.6;
    mesh.current.rotation.y += delta * 0.4;
    const target = active ? 1.75 : 1;
    scale.current += (target - scale.current) * Math.min(1, delta * 10);
    mesh.current.scale.setScalar(scale.current);

    // Html labels always paint over the canvas, so anything orbiting behind the
    // core is faded out by hand to keep the depth readable.
    if (anchor.current && label.current) {
      anchor.current.getWorldPosition(world);
      const behind = world.distanceTo(camera.position) > camera.position.length();
      // ...and anything that drifts across the portrait fades too, so the face stays clear.
      const ndc = world.project(camera);
      const overCore = THREE.MathUtils.smoothstep(Math.hypot(ndc.x, ndc.y), 0.12, 0.38);
      label.current.style.opacity = active ? '1' : String((behind ? 0.22 : 0.92) * overCore);
    }
  });

  // The node sits at `position` inside a group centred on the core, so the spoke
  // back to the core is static geometry that rides along with the orbit.
  const spoke = useMemo(() => {
    const p = new THREE.Vector3(...position);
    const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), p.clone().multiplyScalar(-1)]);
    return geo;
  }, [position]);

  return (
    <group ref={anchor} position={position}>
      <line geometry={spoke}>
        <lineBasicMaterial color={color} transparent opacity={active ? 0.5 : 0.08} />
      </line>

      {/* generous invisible hit area — the visible node is only a few pixels wide */}
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(node);
        }}
        onPointerOut={(e) => {
          // a tap ends with a pointerout; on touch the read-out should stay put instead
          if (e.pointerType !== 'touch') onHover(null);
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node);
        }}
      >
        <sphereGeometry args={[0.42, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <mesh ref={mesh} raycast={() => null}>
        <icosahedronGeometry args={[0.13, 0]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={active ? 2.4 : 0.9} metalness={0.6} roughness={0.25} />
      </mesh>

      {labels && (
      <Html center position={labelOffset} zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
        <span
          ref={label}
          className={`block max-w-[9rem] truncate rounded-full border px-2 py-0.5 font-mono text-[10px] tracking-wide transition-colors duration-200 ${
            active
              ? 'border-white/40 bg-ink-950/95 text-white shadow-[0_0_24px_rgba(34,211,238,0.35)]'
              : 'border-white/10 bg-ink-950/70 text-slate-400'
          }`}
        >
          {node.name}
        </span>
      </Html>
      )}
    </group>
  );
}

function OrbitRing({ ring, radius, nodes, brand, accent, activeName, labels, onHover, onSelect, paused }) {
  const spin = useRef();
  const color = ring.color === 'brand' ? brand : accent;

  useFrame((_, delta) => {
    if (spin.current && !paused) spin.current.rotation.z += delta * ring.speed * 0.5;
  });

  const placed = useMemo(
    () =>
      nodes.map((node, i) => {
        const angle = (i / Math.max(1, nodes.length)) * Math.PI * 2;
        return { node, position: [Math.cos(angle) * radius, Math.sin(angle) * radius, 0] };
      }),
    [nodes, radius]
  );

  return (
    <group rotation={ring.tilt}>
      <Torus args={[radius, 0.004, 8, 160]}>
        <meshBasicMaterial color={color} transparent opacity={activeName ? 0.5 : 0.28} />
      </Torus>
      <group ref={spin}>
        {placed.map(({ node, position }) => (
          <SkillNode
            key={node.name}
            node={node}
            position={position}
            color={color}
            active={activeName === node.name}
            labels={labels}
            onHover={onHover}
            onSelect={onSelect}
          />
        ))}
      </group>
    </group>
  );
}

/* ------------------------------ environment ------------------------------ */

function Dust({ count = 700, color }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const r = 5.4 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.03;
  });

  return (
    <Points ref={ref} positions={positions} frustumCulled={false}>
      <PointMaterial transparent color={color} size={0.03} sizeAttenuation depthWrite={false} opacity={0.6} />
    </Points>
  );
}

/* --------------------------- drag + auto rotate --------------------------- */

function Constellation({ children, reduced, onDragChange }) {
  const group = useRef();
  const { gl } = useThree();
  const drag = useRef({ active: false, x: 0, y: 0, vx: 0, vy: 0, idle: 0 });

  useEffect(() => {
    const el = gl.domElement;
    el.style.cursor = 'grab';
    el.style.touchAction = 'pan-y';

    const down = (e) => {
      drag.current.active = true;
      drag.current.x = e.clientX;
      drag.current.y = e.clientY;
      drag.current.vx = 0;
      drag.current.vy = 0;
      drag.current.idle = 0;
      el.style.cursor = 'grabbing';
      el.setPointerCapture?.(e.pointerId);
      onDragChange?.(true);
    };
    const move = (e) => {
      if (!drag.current.active || !group.current) return;
      const dx = e.clientX - drag.current.x;
      const dy = e.clientY - drag.current.y;
      drag.current.x = e.clientX;
      drag.current.y = e.clientY;
      drag.current.vx = dx * 0.005;
      drag.current.vy = dy * 0.004;
      group.current.rotation.y += drag.current.vx;
      group.current.rotation.x = THREE.MathUtils.clamp(group.current.rotation.x + drag.current.vy, -0.55, 0.55);
    };
    const up = (e) => {
      if (!drag.current.active) return;
      drag.current.active = false;
      el.style.cursor = 'grab';
      el.releasePointerCapture?.(e.pointerId);
      onDragChange?.(false);
    };

    el.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      el.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, [gl, onDragChange]);

  useFrame((_, delta) => {
    const g = group.current;
    const d = drag.current;
    if (!g || d.active) return;

    // momentum from the throw, then a slow idle spin eases back in
    if (Math.abs(d.vx) > 0.0002 || Math.abs(d.vy) > 0.0002) {
      g.rotation.y += d.vx;
      g.rotation.x = THREE.MathUtils.clamp(g.rotation.x + d.vy, -0.55, 0.55);
      d.vx *= 0.94;
      d.vy *= 0.94;
      d.idle = 0;
      return;
    }
    if (reduced) return;
    d.idle = Math.min(1, d.idle + delta * 0.6);
    g.rotation.y += delta * 0.085 * d.idle;
    g.rotation.x += (0 - g.rotation.x) * delta * 0.5;
  });

  return <group ref={group}>{children}</group>;
}

function PointerCamera({ enabled, z }) {
  const { camera, pointer } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  useFrame(() => {
    const k = enabled ? 1 : 0;
    camera.position.x += (pointer.x * 0.9 * k - camera.position.x) * 0.04;
    camera.position.y += (pointer.y * 0.55 * k - camera.position.y) * 0.04;
    camera.position.z += (z - camera.position.z) * 0.08;
    camera.lookAt(target);
  });
  return null;
}

/* --------------------------------- scene --------------------------------- */

function Scene({ avatar, brand, accent, nodes, active, reduced, onHover, onSelect, onDragChange, dragging }) {
  const { z, coreScale, radii, labels, maxNodes } = useLayout();

  const rings = useMemo(() => {
    const buckets = radii.map(() => []);
    nodes.slice(0, maxNodes).forEach((n, i) => buckets[i % radii.length].push(n));
    return radii
      .map((radius, i) => ({ ring: RINGS[i], radius, nodes: buckets[i] }))
      .filter((r) => r.nodes.length);
  }, [nodes, radii, maxNodes]);

  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[6, 5, 6]} intensity={70} color={accent} />
      <pointLight position={[-7, -4, -4]} intensity={70} color={brand} />

      <Constellation reduced={reduced} onDragChange={onDragChange}>
        <Core avatar={avatar} brand={brand} accent={accent} active={!!active} scale={coreScale} />
        {rings.map(({ ring, radius, nodes: ringNodes }, i) => (
          <OrbitRing
            key={i}
            ring={ring}
            radius={radius}
            nodes={ringNodes}
            brand={brand}
            accent={accent}
            activeName={active?.name}
            labels={labels}
            onHover={onHover}
            onSelect={onSelect}
            paused={!!active || reduced}
          />
        ))}
      </Constellation>

      <Dust color={accent} />
      <PointerCamera enabled={!dragging} z={z} />
    </>
  );
}

export default function HeroScene({
  avatar,
  brand = '#6366f1',
  accent = '#22d3ee',
  nodes = [],
  onActive,
  onSelect,
  className = '',
}) {
  const [active, setActive] = useState(null);
  const [dragging, setDragging] = useState(false);
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const hover = (node) => {
    setActive(node);
    onActive?.(node);
  };

  return (
    <div className={className}>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 11.2], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        frameloop={reduced ? 'demand' : 'always'}
        onPointerMissed={() => hover(null)}
      >
        <Suspense fallback={null}>
          <Scene
            avatar={avatar}
            brand={brand}
            accent={accent}
            nodes={nodes}
            active={active}
            reduced={reduced}
            dragging={dragging}
            onHover={hover}
            onSelect={(n) => onSelect?.(n)}
            onDragChange={setDragging}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
