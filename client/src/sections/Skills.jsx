import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from '../components/Reveal.jsx';

const GROUP_ORDER = ['Frontend', 'Backend', 'Database', 'Architecture', 'DevOps & Cloud', 'Embedded & IoT'];

export default function Skills({ skills = [] }) {
  const groups = useMemo(() => {
    const names = [...new Set(skills.map((s) => s.group))];
    return names.sort((a, b) => {
      const ia = GROUP_ORDER.indexOf(a);
      const ib = GROUP_ORDER.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });
  }, [skills]);

  const [active, setActive] = useState(null);
  const current = active && groups.includes(active) ? active : groups[0];
  const visible = skills.filter((s) => s.group === current);

  return (
    <section id="skills" className="section">
      <div aria-hidden className="absolute inset-0 grid-lines opacity-40" />
      <div className="container-x relative">
        <Reveal>
          <span className="label-eyebrow">Capabilities</span>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <h2 className="max-w-2xl text-3xl leading-tight sm:text-4xl lg:text-5xl">
              A stack that covers <span className="gradient-text">browser to bare metal</span>
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-slate-400">
              Every tool below is one I have shipped production work with — not a list of things I have read about.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 flex flex-wrap gap-2">
          {groups.map((g) => (
            <button
              key={g}
              onClick={() => setActive(g)}
              className={`relative rounded-full px-5 py-2.5 text-sm font-medium transition ${
                current === g ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {current === g && (
                <motion.span
                  layoutId="skill-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-500/80 to-neon-400/70"
                  transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                />
              )}
              <span className="relative z-10">{g}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {visible.map((s, i) => (
              <motion.div
                key={s._id || s.name}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.035 }}
                className="glass card-hover group p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-100">{s.name}</p>
                  <span className="font-mono text-xs text-slate-500">{s.level}%</span>
                </div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${s.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, delay: 0.1 + i * 0.03, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-neon-400"
                  />
                </div>
                {s.note && <p className="mt-3 text-xs text-slate-500">{s.note}</p>}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
