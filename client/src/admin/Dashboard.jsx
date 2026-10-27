import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, Star, Wrench, Mail, Database, ArrowUpRight } from 'lucide-react';
import { api } from '../lib/api.js';

const CARDS = [
  { key: 'projects', label: 'Projects', icon: FolderKanban, to: '/admin/projects' },
  { key: 'featured', label: 'Featured', icon: Star, to: '/admin/projects' },
  { key: 'skills', label: 'Skills', icon: Wrench, to: '/admin/skills' },
  { key: 'unread', label: 'Unread messages', icon: Mail, to: '/admin/messages' },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api('/stats', { auth: true }).then(setStats).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Overview</h1>
      <p className="mt-1.5 text-sm text-slate-400">Everything on the public site is editable from here.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {CARDS.map((c) => (
          <Link key={c.key} to={c.to} className="glass card-hover group p-6">
            <div className="flex items-start justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500/25 to-neon-400/20 text-neon-400">
                <c.icon size={18} />
              </span>
              <ArrowUpRight size={16} className="text-slate-600 transition group-hover:text-white" />
            </div>
            <p className="mt-5 text-3xl font-semibold text-white">{stats?.[c.key] ?? '—'}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-slate-500">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="glass mt-6 flex flex-wrap items-center gap-3 p-6 text-sm text-slate-400">
        <Database size={16} className="text-neon-400" />
        Storage driver: <span className="font-mono text-slate-200">{stats?.driver || '…'}</span>
        <span className="text-slate-600">
          ({stats?.driver === 'mongo' ? 'MongoDB connected' : 'JSON file fallback — set MONGODB_URI to use MongoDB'})
        </span>
      </div>

      <div className="glass mt-6 p-6">
        <h2 className="font-semibold text-white">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/admin/projects" className="btn-ghost !py-2 !text-xs">Add a project</Link>
          <Link to="/admin/profile" className="btn-ghost !py-2 !text-xs">Edit hero & about</Link>
          <Link to="/admin/settings" className="btn-ghost !py-2 !text-xs">Change theme colours</Link>
          <Link to="/" className="btn-ghost !py-2 !text-xs">View live site</Link>
        </div>
      </div>
    </div>
  );
}
