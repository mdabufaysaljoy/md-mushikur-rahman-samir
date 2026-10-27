import { NavLink, Route, Routes, Link } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Wrench, Briefcase, Sparkles, MessageSquareQuote, Mail, Settings, User, LogOut, ExternalLink } from 'lucide-react';
import { AuthProvider, useAuth } from './auth.jsx';
import Login from './Login.jsx';
import Dashboard from './Dashboard.jsx';
import CollectionPage from './CollectionPage.jsx';
import ProfilePage from './ProfilePage.jsx';
import SettingsPage from './SettingsPage.jsx';
import MessagesPage from './MessagesPage.jsx';
import Loader from '../components/Loader.jsx';

const NAV = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/profile', label: 'Profile & hero', icon: User },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/skills', label: 'Skills', icon: Wrench },
  { to: '/admin/experience', label: 'Experience', icon: Briefcase },
  { to: '/admin/services', label: 'Services', icon: Sparkles },
  { to: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { to: '/admin/messages', label: 'Inbox', icon: Mail },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

function Shell() {
  const { user, checking, logout } = useAuth();

  if (checking) return <Loader label="Checking session" />;
  if (!user) return <Login />;

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-e border-white/10 bg-ink-900/60 p-5 backdrop-blur-xl lg:flex">
        <Link to="/" className="mb-8 flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-neon-400 font-bold text-white">F</span>
          <span className="text-sm font-semibold text-slate-200">Control room</span>
        </Link>

        <nav className="flex-1 space-y-1">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  isActive ? 'bg-gradient-to-r from-brand-500/25 to-neon-400/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <n.icon size={16} /> {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-2 border-t border-white/10 pt-4">
          <Link to="/" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-400 hover:text-white">
            <ExternalLink size={15} /> View site
          </Link>
          <button onClick={logout} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-400 hover:text-rose-400">
            <LogOut size={15} /> Sign out ({user.name?.split(' ')[0]})
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="sticky top-0 z-40 flex items-center gap-2 overflow-x-auto border-b border-white/10 bg-ink-950/80 px-4 py-3 backdrop-blur-xl lg:hidden">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-3 py-1.5 text-xs ${isActive ? 'bg-brand-500/25 text-white' : 'text-slate-400'}`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </div>

        <main className="p-5 sm:p-8">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path=":collection" element={<CollectionPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function AdminApp() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  );
}
