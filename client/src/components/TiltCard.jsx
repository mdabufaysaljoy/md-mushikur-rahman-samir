import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/** Pointer-tracking 3D tilt with a moving specular highlight. */
export default function TiltCard({ children, className = '', intensity = 10 }) {
  const ref = useRef(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 160, damping: 18 });
  const sy = useSpring(my, { stiffness: 160, damping: 18 });
  const rotateX = useTransform(sy, [0, 1], [intensity, -intensity]);
  const rotateY = useTransform(sx, [0, 1], [-intensity, intensity]);
  const glowX = useTransform(sx, (v) => `${v * 100}%`);
  const glowY = useTransform(sy, (v) => `${v * 100}%`);

  const onMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => {
        mx.set(0.5);
        my.set(0.5);
      }}
      style={{ rotateX, rotateY, transformPerspective: 1100 }}
      className={`group relative ${className}`}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: useTransform(
            [glowX, glowY],
            ([x, y]) => `radial-gradient(380px circle at ${x} ${y}, rgba(255,255,255,0.10), transparent 60%)`
          ),
        }}
      />
      {children}
    </motion.div>
  );
}
