import { motion } from 'framer-motion';
import { Layers, Store, Network, Cpu, Cloud, Sparkles, Boxes } from 'lucide-react';
import Reveal from '../components/Reveal.jsx';
import TiltCard from '../components/TiltCard.jsx';

const ICONS = { layers: Layers, store: Store, network: Network, cpu: Cpu, cloud: Cloud, sparkles: Sparkles };

export default function Services({ services = [] }) {
  if (!services.length) return null;
  return (
    <section id="services" className="section">
      <div className="container-x">
        <Reveal>
          <span className="label-eyebrow">What I do</span>
          <h2 className="max-w-2xl text-3xl leading-tight sm:text-4xl lg:text-5xl">
            Hire me for the <span className="gradient-text">hard parts</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = ICONS[s.icon] || Boxes;
            return (
              <TiltCard key={s._id || s.title} intensity={7}>
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.06 }}
                  className="glass card-hover group relative h-full overflow-hidden p-7"
                >
                  <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-500/20 blur-3xl transition-opacity duration-500 group-hover:bg-neon-400/25" />
                  <div className="relative">
                    <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-gradient-to-br from-brand-500/25 to-neon-400/20 text-neon-400">
                      <Icon size={21} />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{s.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-400">{s.description}</p>
                    <ul className="mt-5 space-y-2">
                      {(s.bullets || []).map((b) => (
                        <li key={b} className="flex gap-2.5 text-sm text-slate-400">
                          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-neon-400" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
