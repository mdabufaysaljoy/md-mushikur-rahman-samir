import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/** Soft trailing cursor ring — desktop / fine-pointer only. */
export default function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 450, damping: 35, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 450, damping: 35, mass: 0.4 });
  const [active, setActive] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    setEnabled(true);
    const move = (e) => {
      x.set(e.clientX - 16);
      y.set(e.clientY - 16);
      const el = e.target;
      setActive(Boolean(el.closest?.('a, button, [data-cursor="hover"]')));
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [x, y]);

  if (!enabled) return null;
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[90] hidden h-8 w-8 rounded-full border border-white/40 mix-blend-difference md:block"
      style={{ x: sx, y: sy }}
      animate={{ scale: active ? 1.9 : 1, backgroundColor: active ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    />
  );
}
