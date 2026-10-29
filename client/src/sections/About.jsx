import { motion } from 'framer-motion';
import { Code2, Cpu, Cloud, ShieldCheck } from 'lucide-react';
import Reveal from '../components/Reveal.jsx';
import TiltCard from '../components/TiltCard.jsx';
import { assetUrl } from '../lib/api.js';

const PILLARS = [
  { icon: Code2, title: 'Product-grade front end', text: 'Design systems, motion choreography and 3D scenes that stay fast and accessible.' },
  { icon: ShieldCheck, title: 'Backends that hold up', text: 'Transactions, ledgers, idempotency, RBAC and validation on every route.' },
  { icon: Cloud, title: 'Shipped, not just built', text: 'Dockerised CI/CD to AWS or VPS with monitoring, backups and SSL.' },
  { icon: Cpu, title: 'Hardware in the loop', text: 'ESP32, Arduino and Raspberry Pi firmware wired into the same cloud services.' },
];

export default function About({ profile }) {
  return (
    <section id="about" className="section">
      <div className="container-x grid gap-14 lg:grid-cols-[1fr,1.05fr] lg:items-center">
        <Reveal from="right">
          {profile?.avatarUrl && (
            <div className="mb-7 flex items-center gap-4">
              <div className="relative shrink-0">
                <span aria-hidden className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-brand-500 to-neon-400 opacity-60 blur-md" />
                <img
                  src={assetUrl(profile.avatarUrl)}
                  alt={profile?.name || 'Portrait'}
                  loading="lazy"
                  className="relative h-20 w-20 rounded-2xl object-cover ring-1 ring-white/20 sm:h-24 sm:w-24"
                  onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}
                />
              </div>
              <div>
                <p className="text-base font-semibold text-white">{profile?.name}</p>
                <p className="mt-0.5 text-sm text-slate-400">{profile?.headline}</p>
                {profile?.location && <p className="mt-1 text-xs text-slate-500">{profile.location}</p>}
              </div>
            </div>
          )}
          <span className="label-eyebrow">About</span>
          <h2 className="text-3xl leading-tight sm:text-4xl lg:text-5xl">
            I build the <span className="gradient-text">whole system</span> — interface, service and the device at the edge.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-slate-400">{profile?.about}</p>

          <div className="mt-8 flex flex-wrap gap-2">
            {['Architecture first', 'Money & stock correctness', 'Security by default', 'Performance budgets', 'Clean handover'].map((t) => (
              <span key={t} className="chip">{t}</span>
            ))}
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} from="up" delay={i * 0.08}>
              <TiltCard intensity={7}>
                <motion.div className="glass card-hover h-full p-6">
                  <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand-500/25 to-neon-400/20 text-neon-400">
                    <p.icon size={20} />
                  </div>
                  <h3 className="text-base font-semibold text-white">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{p.text}</p>
                </motion.div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
