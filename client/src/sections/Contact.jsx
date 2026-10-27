import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import Reveal from '../components/Reveal.jsx';
import { api } from '../lib/api.js';

const BUDGETS = ['< $500', '$500 – $2k', '$2k – $10k', '$10k+', 'Not sure yet'];

export default function Contact({ profile }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', budget: '', message: '' });
  const [status, setStatus] = useState({ state: 'idle', message: '', errors: {} });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ state: 'loading', message: '', errors: {} });
    try {
      await api('/messages', { method: 'POST', body: form });
      setForm({ name: '', email: '', subject: '', budget: '', message: '' });
      setStatus({ state: 'success', message: "Message sent — I'll reply within a day.", errors: {} });
    } catch (err) {
      setStatus({ state: 'error', message: err.message, errors: err.details || {} });
    }
  };

  return (
    <section id="contact" className="section">
      <div className="container-x">
        <div className="glass relative overflow-hidden p-8 sm:p-12">
          <div aria-hidden className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
          <div aria-hidden className="absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-neon-400/15 blur-3xl" />

          <div className="relative grid gap-12 lg:grid-cols-[1fr,1.1fr]">
            <Reveal from="right">
              <span className="label-eyebrow">Contact</span>
              <h2 className="text-3xl leading-tight sm:text-4xl">
                Let's build something <span className="gradient-text">that lasts</span>
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-slate-400">
                Tell me about the product, the deadline and the constraints. You will get a straight answer on scope,
                architecture and timeline — not a sales pitch.
              </p>

              <div className="mt-8 space-y-3 text-sm">
                {profile?.email && (
                  <a href={`mailto:${profile.email}`} className="flex items-center gap-3 text-slate-300 hover:text-white">
                    <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-neon-400">
                      <Mail size={16} />
                    </span>
                    {profile.email}
                  </a>
                )}
                {profile?.location && (
                  <p className="flex items-center gap-3 text-slate-400">
                    <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-neon-400">
                      <MapPin size={16} />
                    </span>
                    {profile.location}
                  </p>
                )}
              </div>
            </Reveal>

            <Reveal from="left">
              <form onSubmit={submit} className="space-y-4" noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs uppercase tracking-wider text-slate-500" htmlFor="c-name">Name</label>
                    <input id="c-name" className="input" value={form.name} onChange={set('name')} placeholder="Your name" autoComplete="name" />
                    {status.errors.name && <p className="mt-1 text-xs text-rose-400">{status.errors.name}</p>}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs uppercase tracking-wider text-slate-500" htmlFor="c-email">Email</label>
                    <input id="c-email" type="email" className="input" value={form.email} onChange={set('email')} placeholder="you@company.com" autoComplete="email" inputMode="email" />
                    {status.errors.email && <p className="mt-1 text-xs text-rose-400">{status.errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs uppercase tracking-wider text-slate-500" htmlFor="c-subject">Subject</label>
                  <input id="c-subject" className="input" value={form.subject} onChange={set('subject')} placeholder="POS system for 3 branches" />
                </div>

                <div>
                  <p className="mb-1.5 text-xs uppercase tracking-wider text-slate-500">Budget</p>
                  <div className="flex flex-wrap gap-2">
                    {BUDGETS.map((b) => (
                      <button
                        type="button"
                        key={b}
                        onClick={() => setForm((f) => ({ ...f, budget: f.budget === b ? '' : b }))}
                        className={`rounded-full border px-3.5 py-1.5 text-xs transition ${
                          form.budget === b
                            ? 'border-brand-500/70 bg-brand-500/20 text-white'
                            : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/25'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs uppercase tracking-wider text-slate-500" htmlFor="c-message">Project details</label>
                  <textarea id="c-message" rows={5} className="input resize-none" value={form.message} onChange={set('message')} placeholder="What are you building, and what does success look like?" />
                  {status.errors.message && <p className="mt-1 text-xs text-rose-400">{status.errors.message}</p>}
                </div>

                <button type="submit" disabled={status.state === 'loading'} className="btn-primary w-full sm:w-auto">
                  {status.state === 'loading' ? 'Sending…' : 'Send message'} <Send size={16} />
                </button>

                {status.state === 'success' && (
                  <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-sm text-emerald-400">
                    <CheckCircle2 size={16} /> {status.message}
                  </motion.p>
                )}
                {status.state === 'error' && (
                  <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-sm text-rose-400">
                    <AlertCircle size={16} /> {status.message}
                  </motion.p>
                )}
              </form>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
