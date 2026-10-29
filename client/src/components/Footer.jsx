import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, Globe, Facebook, Lock } from 'lucide-react';
import { assetUrl } from '../lib/api.js';

const ICONS = { github: Github, linkedin: Linkedin, mail: Mail, globe: Globe, facebook: Facebook };

export default function Footer({ profile, settings }) {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-white/5 py-14">
      <div className="container-x grid gap-10 md:grid-cols-[1.4fr,1fr,1fr]">
        <div>
          <div className="flex items-center gap-3">
            {(settings?.logoUrl || profile?.avatarUrl) && (
              <img
                src={assetUrl(settings?.logoUrl || profile?.avatarUrl)}
                alt=""
                className="h-11 w-11 rounded-xl object-cover ring-1 ring-white/10"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            )}
            <div>
              <p className="text-lg font-semibold text-white">{profile?.name || 'Md Abu Faysal Joy'}</p>
              {settings?.tagline && <p className="text-xs text-slate-500">{settings.tagline}</p>}
            </div>
          </div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
            {settings?.footerNote || 'Full-stack engineering, from interface motion to infrastructure.'}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {(profile?.socials || []).map((s) => {
              const Icon = ICONS[s.icon] || Globe;
              return (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:-translate-y-0.5 hover:border-white/30 hover:text-white"
                  aria-label={s.label}
                >
                  <Icon size={17} />
                </a>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-slate-500">Navigate</p>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link className="hover:text-white" to="/">Home</Link></li>
            <li><Link className="hover:text-white" to="/projects">Projects</Link></li>
            <li><a className="hover:text-white" href="/#services">Services</a></li>
            <li><a className="hover:text-white" href="/#contact">Contact</a></li>
          </ul>
        </div>

        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-slate-500">Reach</p>
          <ul className="space-y-2 text-sm text-slate-400">
            {profile?.email && (
              <li><a className="hover:text-white" href={`mailto:${profile.email}`}>{profile.email}</a></li>
            )}
            {profile?.location && <li>{profile.location}</li>}
            <li>
              <Link to="/admin" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-white">
                <Lock size={13} /> Admin panel
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-x mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 text-xs text-slate-500 sm:flex-row">
        <p>© {year} {profile?.name || 'Md Abu Faysal Joy'}. All rights reserved.</p>
        <p className="font-mono">Built with React · Three.js · Node.js · MongoDB</p>
      </div>
    </footer>
  );
}
