import { useCallback, useEffect, useMemo, useRef, useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Download, Sparkles, MapPin, MousePointerClick } from 'lucide-react';
import Magnetic from '../components/Magnetic.jsx';
import Marquee from '../components/Marquee.jsx';
import { assetUrl } from '../lib/api.js';

const HeroScene = lazy(() => import('../three/HeroScene.jsx'));

function RoleRotator({ roles = [] }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!roles.length) return undefined;
    const full = roles[index % roles.length];
    const done = !deleting && text === full;
    const cleared = deleting && text === '';
    const delay = done ? 1600 : cleared ? 180 : deleting ? 28 : 58;

    const timer = setTimeout(() => {
      if (done) return setDeleting(true);
      if (cleared) {
        setDeleting(false);
        return setIndex((i) => i + 1);
      }
      setText(deleting ? full.slice(0, text.length - 1) : full.slice(0, text.length + 1));
    }, delay);
    return () => clearTimeout(timer);
  }, [text, deleting, index, roles]);

  return (
    <span className="font-mono text-base text-neon-400 sm:text-lg">
      {text}
      <span className="ms-0.5 inline-block w-[2px] animate-pulse bg-neon-400 align-middle" style={{ height: '1.1em' }} />
    </span>
  );
}

/** Read-out under the orb: idle hint, or the skill the visitor is pointing at. */
function OrbReadout({ node, count }) {
  const coarse = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
  return (
    <div className="glass relative mx-auto mt-3 max-w-sm overflow-hidden px-4 py-3.5 sm:mt-4 sm:px-5 sm:py-4">
      <AnimatePresence mode="wait">
        {node ? (
          <motion.div
            key={node.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <div className="flex items-baseline justify-between gap-3">
              <p className="truncate text-sm font-semibold text-white">{node.name}</p>
              <p className="font-mono text-[11px] uppercase tracking-wider text-neon-400">{node.group}</p>
            </div>
            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-neon-400"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, node.level || 70)}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
            <p className="mt-2 text-[11px] text-slate-500">
              {coarse ? 'Tap again' : 'Click the node'} to jump to the full stack.
            </p>
          </motion.div>
        ) : (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="flex items-center gap-2 text-sm text-slate-300">
              <MousePointerClick size={15} className="text-neon-400" />
              Drag the orb — {coarse ? 'tap' : 'hover'} a node
            </p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">
              {count} technologies orbiting live from the CMS. Every label, colour and the portrait itself is editable in the admin panel.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Hero({ profile, settings, skills = [], techs = [] }) {
  const brand = settings?.primaryColor || '#6366f1';
  const accent = settings?.accentColor || '#22d3ee';
  const [active, setActive] = useState(null);

  // The orb orbits the strongest skills, spread across groups so each ring reads differently.
  const nodes = useMemo(() => {
    const byLevel = [...skills].sort((a, b) => (b.level || 0) - (a.level || 0));
    const seen = new Map();
    byLevel.forEach((s) => {
      const list = seen.get(s.group) || [];
      if (list.length < 3) list.push(s);
      seen.set(s.group, list);
    });
    const picked = [...seen.values()].flat().slice(0, 10);
    const source = picked.length ? picked : byLevel.slice(0, 10);
    return source.map((s) => ({ name: s.name, group: s.group || 'Stack', level: s.level || 70 }));
  }, [skills]);

  // On a touch screen the first tap reveals the read-out, the second follows through
  // to the skills section — a single tap would scroll away before anything was read.
  const tapped = useRef(null);
  const select = useCallback((node) => {
    const coarse = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
    if (coarse && tapped.current !== node?.name) {
      tapped.current = node?.name;
      setActive(node);
      return;
    }
    document.querySelector('#skills')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden pt-24 sm:pt-28">
      <div aria-hidden className="absolute inset-0 grid-lines opacity-70" />
      <div
        aria-hidden
        className="pointer-events-none absolute end-0 top-1/4 hidden h-[36rem] w-[36rem] rounded-full opacity-25 blur-[120px] sm:block"
        style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 65%)` }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-ink-950 to-transparent" />

      <div className="container-x relative z-10 flex min-h-[calc(100svh-6rem)] flex-col justify-center py-8">
        <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[1.05fr,1.1fr] lg:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="label-eyebrow">
              <Sparkles size={13} className="text-neon-400" />
              {profile?.availability || 'Available for work'}
            </span>

            <h1 className="text-[2rem] font-semibold leading-[1.08] [text-wrap:balance] min-[420px]:text-[2.4rem] sm:text-5xl md:text-6xl lg:text-[3rem] xl:text-[3.6rem] 2xl:text-[4rem]">
              <span className="block text-slate-400">Hi, I'm</span>
              <span className="gradient-text block">{profile?.name || 'Md Abu Faysal Joy'}</span>
            </h1>

            <div className="mt-4 flex min-h-[2rem] items-center gap-2 sm:gap-3">
              <span className="hidden h-px w-10 bg-gradient-to-r from-brand-500 to-transparent sm:block" />
              <RoleRotator roles={profile?.roles?.length ? profile.roles : ['Full-Stack Developer']} />
            </div>

            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-slate-400 sm:mt-7 sm:text-base lg:text-lg">
              {profile?.summary}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-2.5 sm:mt-9 sm:gap-3">
              <Magnetic>
                <a href="#work" className="btn-primary">
                  View featured work <ArrowDown size={16} />
                </a>
              </Magnetic>
              <Magnetic>
                <a href="#contact" className="btn-ghost">Start a project</a>
              </Magnetic>
              {profile?.resumeUrl && (
                <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="btn-ghost">
                  <Download size={15} /> Résumé
                </a>
              )}
            </div>

            {profile?.location && (
              <p className="mt-6 inline-flex items-center gap-2 text-sm text-slate-500 sm:mt-7">
                <MapPin size={14} /> {profile.location}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative lg:-me-4 xl:-me-10"
          >
            <Suspense
              fallback={
                <div className="mx-auto grid h-[22rem] place-items-center">
                  <span className="h-40 w-40 animate-pulse rounded-full bg-white/5 ring-1 ring-white/10" />
                </div>
              }
            >
              <HeroScene
                avatar={assetUrl(profile?.avatarUrl)}
                brand={brand}
                accent={accent}
                nodes={nodes}
                onActive={setActive}
                onSelect={select}
                className="h-[23rem] w-full min-[420px]:h-[25rem] sm:h-[28rem] lg:h-[34rem]"
              />
            </Suspense>
            <OrbReadout node={active} count={skills.length || nodes.length} />
          </motion.div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-4 md:grid-cols-4">
          {(profile?.stats || []).map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.08, duration: 0.6 }}
              className="glass px-4 py-3.5 sm:py-4"
            >
              <p className="text-xl font-semibold text-white sm:text-2xl">
                {s.value}
                <span className="text-neon-400">{s.suffix}</span>
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-wider text-slate-500">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative z-10 pb-8 pt-8 sm:pb-10 sm:pt-10">
        <Marquee items={techs} />
      </div>
    </section>
  );
}
