import { motion } from 'framer-motion';

const variants = {
  up: { y: 36, opacity: 0 },
  down: { y: -36, opacity: 0 },
  left: { x: 46, opacity: 0 },
  right: { x: -46, opacity: 0 },
  scale: { scale: 0.92, opacity: 0 },
};

export default function Reveal({ children, from = 'up', delay = 0, className = '', once = true }) {
  return (
    <motion.div
      className={className}
      initial={variants[from]}
      whileInView={{ x: 0, y: 0, scale: 1, opacity: 1 }}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
