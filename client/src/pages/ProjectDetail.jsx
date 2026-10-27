import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, Layers3, Target, Lightbulb, CheckCircle2 } from 'lucide-react';
import { useSite } from '../lib/useSite.jsx';
import Loader from '../components/Loader.jsx';
import Reveal from '../components/Reveal.jsx';

export default function ProjectDetail() {
  const { slug } = useParams();
  const { data, loading } = useSite();
  const project = (data?.projects || []).find((p) => p.slug === slug);
  const others = (data?.projects || []).filter((p) => p.slug !== slug).slice(0, 3);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    if (project) document.title = `${project.title} — Md Abu Faysal Joy`;
  }, [slug, project]);

  if (loading) return <Loader label="Opening case study" />;
  if (!project) {
    return (
      <div className="container-x flex min-h-[70vh] flex-col items-center justify-center text-center">
        <h1 className="text-3xl text-white">Project not found</h1>
        <Link to="/projects" className="btn-ghost mt-6">Back to all projects</Link>
      </div>
    );
  }

  const accent = project.accent || '#6366f1';

  return (
    <article className="pt-32">
      <div aria-hidden className="absolute inset-x-0 top-0 h-[520px] opacity-30" style={{ background: `radial-gradient(60% 50% at 50% 0%, ${accent}55, transparent 70%)` }} />

      <header className="container-x relative">
        <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
          <ArrowLeft size={15} /> All projects
        </Link>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mt-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="chip" style={{ borderColor: `${accent}55`, color: accent }}>{project.category}</span>
            <span className="chip">{project.year}</span>
            {project.role && <span className="chip">{project.role}</span>}
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">{project.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-400">{project.tagline}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn-primary">
                Visit live site <ExternalLink size={16} />
              </a>
            )}
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noreferrer" className="btn-ghost">
                <Github size={16} /> Source code
              </a>
            )}
          </div>
        </motion.div>

        {project.metrics?.length > 0 && (
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {project.metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="glass p-6"
              >
                <p className="text-2xl font-semibold" style={{ color: accent }}>{m.value}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-slate-500">{m.label}</p>
              </motion.div>
            ))}
          </div>
        )}
      </header>

      <div className="container-x relative mt-20 grid gap-12 lg:grid-cols-[1.6fr,1fr] lg:items-start">
        <div className="space-y-10">
          {project.summary && (
            <Reveal>
              <h2 className="text-2xl">Overview</h2>
              <p className="mt-4 leading-relaxed text-slate-400">{project.summary}</p>
            </Reveal>
          )}

          {project.problem && (
            <Reveal>
              <h2 className="flex items-center gap-2 text-2xl"><Target size={20} style={{ color: accent }} /> The problem</h2>
              <p className="mt-4 leading-relaxed text-slate-400">{project.problem}</p>
            </Reveal>
          )}

          {project.solution && (
            <Reveal>
              <h2 className="flex items-center gap-2 text-2xl"><Lightbulb size={20} style={{ color: accent }} /> The approach</h2>
              <p className="mt-4 leading-relaxed text-slate-400">{project.solution}</p>
            </Reveal>
          )}

          {project.highlights?.length > 0 && (
            <Reveal>
              <h2 className="text-2xl">Engineering highlights</h2>
              <ul className="mt-5 space-y-3">
                {project.highlights.map((h) => (
                  <li key={h} className="glass flex items-start gap-3 p-4 text-sm leading-relaxed text-slate-300">
                    <CheckCircle2 size={17} className="mt-0.5 shrink-0" style={{ color: accent }} />
                    {h}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {project.features?.length > 0 && (
            <Reveal>
              <h2 className="text-2xl">Feature set</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {project.features.map((f) => (
                  <div key={f} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">{f}</div>
                ))}
              </div>
            </Reveal>
          )}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-28">
          <div className="glass p-6">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
              <Layers3 size={15} /> Stack
            </h3>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {(project.stack || []).map((t) => (
                <span key={t} className="rounded-md bg-white/5 px-2.5 py-1.5 font-mono text-[11px] text-slate-300">{t}</span>
              ))}
            </div>
          </div>

          {project.architecture && (
            <div className="glass p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Architecture</h3>
              <p className="mt-3 font-mono text-xs leading-relaxed text-slate-400">{project.architecture}</p>
            </div>
          )}

          <div className="glass p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Need something like this?</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">I take projects from architecture to deployment.</p>
            <Link to="/#contact" className="btn-primary mt-5 w-full">Start a conversation</Link>
          </div>
        </aside>
      </div>

      {others.length > 0 && (
        <div className="container-x mt-24">
          <h2 className="text-2xl">More work</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {others.map((p) => (
              <Link key={p.slug} to={`/projects/${p.slug}`} className="glass card-hover p-6">
                <span className="chip" style={{ borderColor: `${p.accent}55`, color: p.accent }}>{p.category}</span>
                <h3 className="mt-4 font-semibold text-white">{p.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{p.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
      <div className="h-24" />
    </article>
  );
}
