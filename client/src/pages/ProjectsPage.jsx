import { useMemo, useState } from 'react';
import { useSite } from '../lib/useSite.jsx';
import { usePageTitle } from '../lib/pageTitle.js';
import Loader from '../components/Loader.jsx';
import Reveal from '../components/Reveal.jsx';
import { ProjectCard } from '../sections/Projects.jsx';

export default function ProjectsPage() {
  const { data, loading } = useSite();
  const [query, setQuery] = useState('');
  usePageTitle('Projects');
  const projects = data?.projects || [];

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p) =>
      [p.title, p.tagline, p.category, ...(p.stack || [])].join(' ').toLowerCase().includes(q)
    );
  }, [projects, query]);

  if (loading) return <Loader label="Loading projects" />;

  return (
    <section className="section pt-36">
      <div className="container-x">
        <Reveal>
          <span className="label-eyebrow">Archive</span>
          <h1 className="max-w-3xl text-4xl leading-tight sm:text-5xl">
            Every project, <span className="gradient-text">end to end</span>
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-400">
            Commerce platforms, ERP and POS suites, learning systems, content tooling and hardware — search by name or stack.
          </p>
          <input
            className="input mt-8 max-w-md"
            placeholder="Search projects, e.g. POS, ESP32, Next.js…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {list.map((p, i) => (
            <ProjectCard key={p._id || p.slug} project={p} index={i} />
          ))}
        </div>
        {!list.length && <p className="mt-16 text-center text-sm text-slate-500">No project matches "{query}".</p>}
      </div>
    </section>
  );
}
