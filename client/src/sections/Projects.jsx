import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Github, ExternalLink } from 'lucide-react';
import Reveal from '../components/Reveal.jsx';
import TiltCard from '../components/TiltCard.jsx';

const FILTERS = [
  { key: 'all', label: 'All work' },
  { key: 'saas', label: 'SaaS & ERP' },
  { key: 'web', label: 'Web platforms' },
  { key: 'embedded', label: 'IoT & hardware' },
  { key: 'ai', label: 'AI & robotics' },
];

export function ProjectCard({ project, index = 0, featured = false }) {
  const accent = project.accent || '#6366f1';
  return (
    <TiltCard intensity={featured ? 6 : 8} className="h-full">
      <motion.article
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, delay: index * 0.06 }}
        className="glass card-hover group relative h-full overflow-hidden p-6 sm:p-7"
      >
        <div
          aria-hidden
          className="absolute -right-24 -top-24 h-56 w-56 rounded-full opacity-25 blur-3xl transition-opacity duration-500 group-hover:opacity-50"
          style={{ background: accent }}
        />
        <div className="relative flex h-full flex-col">
          <div className="flex items-center justify-between gap-3">
            <span className="chip" style={{ borderColor: `${accent}55`, color: accent }}>{project.category}</span>
            <span className="font-mono text-xs text-slate-500">{project.year}</span>
          </div>

          <h3 className="mt-5 text-xl font-semibold text-white sm:text-2xl">{project.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">{project.tagline}</p>

          {featured && project.highlights?.length > 0 && (
            <ul className="mt-5 space-y-2">
              {project.highlights.slice(0, 3).map((h) => (
                <li key={h} className="flex gap-2.5 text-sm text-slate-400">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accent }} />
                  {h}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-5 flex flex-wrap gap-1.5">
            {(project.stack || []).slice(0, featured ? 7 : 5).map((t) => (
              <span key={t} className="rounded-md bg-white/5 px-2 py-1 font-mono text-[11px] text-slate-400">{t}</span>
            ))}
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
            <Link
              to={`/projects/${project.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-white transition group-hover:gap-2.5"
            >
              Case study <ArrowUpRight size={16} style={{ color: accent }} />
            </Link>
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white">
                <ExternalLink size={14} /> Live
              </a>
            )}
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white">
                <Github size={14} /> Code
              </a>
            )}
          </div>
        </div>
      </motion.article>
    </TiltCard>
  );
}

export default function Projects({ projects = [] }) {
  const [filter, setFilter] = useState('all');
  const featured = useMemo(() => projects.filter((p) => p.featured), [projects]);
  const list = useMemo(
    () => (filter === 'all' ? projects : projects.filter((p) => p.type === filter)),
    [projects, filter]
  );

  return (
    <section id="work" className="section">
      <div className="container-x">
        <Reveal>
          <span className="label-eyebrow">Selected work</span>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <h2 className="max-w-2xl text-3xl leading-tight sm:text-4xl lg:text-5xl">
              Platforms people <span className="gradient-text">actually run their business on</span>
            </h2>
            <Link to="/projects" className="btn-ghost shrink-0">
              Browse everything <ArrowUpRight size={16} />
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {featured.slice(0, 2).map((p, i) => (
            <ProjectCard key={p._id || p.slug} project={p} index={i} featured />
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                filter === f.key
                  ? 'border-brand-500/60 bg-brand-500/15 text-white'
                  : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/25 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="popLayout">
          <motion.div layout className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {list.map((p, i) => (
              <motion.div layout key={p._id || p.slug} exit={{ opacity: 0, scale: 0.96 }}>
                <ProjectCard project={p} index={i} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
