import { useEffect, useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Download, Sparkles, MapPin } from 'lucide-react';
import Magnetic from '../components/Magnetic.jsx';
import Marquee from '../components/Marquee.jsx';

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

export default function Hero({ profile, settings, techs = [] }) {
  const brand = settings?.primaryColor || '#6366f1';
  const accent = settings?.accentColor || '#22d3ee';

  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden pt-28">
      <div aria-hidden className="absolute inset-0 grid-lines opacity-70" />
      <Suspense fallback={null}>
        <HeroScene
          brand={brand}
          accent={accent}
          className="pointer-events-none absolute inset-y-0 end-0 h-full w-full opacity-45 sm:opacity-60 lg:w-[56%] lg:opacity-100"
        />
      </Suspense>
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-ink-950 to-transparent" />
      <div
        aria-hidden
        className="absolute inset-y-0 start-0 hidden w-2/3 bg-gradient-to-r from-ink-950 via-ink-950/85 to-transparent lg:block"
      />

      <div className="container-x relative z-10 flex min-h-[calc(100svh-7rem)] flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <span className="label-eyebrow">
            <Sparkles size={13} className="text-neon-400" />
            {profile?.availability || 'Available for work'}
          </span>

          <h1 className="text-[2.6rem] font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">
            <span className="block text-slate-400">Hi, I'm</span>
            <span className="gradient-text block">{profile?.name || 'Md Abu Faysal Joy'}</span>
          </h1>

          <div className="mt-4 flex min-h-[2rem] items-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-brand-500 to-transparent" />
            <RoleRotator roles={profile?.roles?.length ? profile.roles : ['Full-Stack Developer']} />
          </div>

          <p className="mt-7 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">{profile?.summary}</p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
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
            <p className="mt-7 inline-flex items-center gap-2 text-sm text-slate-500">
              <MapPin size={14} /> {profile.location}
            </p>
          )}

          <div className="mt-12 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
            {(profile?.stats || []).map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.08, duration: 0.6 }}
                className="glass px-4 py-4"
              >
                <p className="text-2xl font-semibold text-white">
                  {s.value}
                  <span className="text-neon-400">{s.suffix}</span>
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-wider text-slate-500">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 pb-10">
        <Marquee items={techs} />
      </div>
    </section>
  );
}
