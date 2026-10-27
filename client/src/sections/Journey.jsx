import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Briefcase, GraduationCap } from 'lucide-react';
import Reveal from '../components/Reveal.jsx';

export default function Journey({ experience = [] }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const line = useSpring(scrollYProgress, { stiffness: 90, damping: 26 });

  return (
    <section id="journey" className="section">
      <div className="container-x">
        <Reveal>
          <span className="label-eyebrow">Journey</span>
          <h2 className="max-w-2xl text-3xl leading-tight sm:text-4xl lg:text-5xl">
            Experience, <span className="gradient-text">in order</span>
          </h2>
        </Reveal>

        <div ref={ref} className="relative mt-14 ps-8 sm:ps-12">
          <div className="absolute inset-y-0 start-[11px] w-px bg-white/10 sm:start-[19px]" />
          <motion.div
            style={{ scaleY: line }}
            className="absolute inset-y-0 start-[11px] w-px origin-top bg-gradient-to-b from-brand-500 to-neon-400 sm:start-[19px]"
          />

          <div className="space-y-8">
            {experience.map((item, i) => {
              const Icon = item.type === 'education' ? GraduationCap : Briefcase;
              return (
                <motion.div
                  key={item._id || `${item.role}-${i}`}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, delay: i * 0.06 }}
                  className="relative"
                >
                  <span className="absolute -start-8 top-5 grid h-6 w-6 place-items-center rounded-full border border-white/15 bg-ink-900 text-neon-400 sm:-start-12 sm:h-8 sm:w-8">
                    <Icon size={13} />
                  </span>
                  <div className="glass card-hover p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{item.role}</h3>
                        <p className="mt-0.5 text-sm text-slate-400">
                          {item.company}
                          {item.location ? ` · ${item.location}` : ''}
                        </p>
                      </div>
                      <span className={`chip ${item.current ? 'border-neon-400/40 text-neon-400' : ''}`}>
                        {item.start} — {item.current ? 'Present' : item.end}
                      </span>
                    </div>

                    {item.summary && <p className="mt-4 text-sm leading-relaxed text-slate-400">{item.summary}</p>}

                    {item.bullets?.length > 0 && (
                      <ul className="mt-4 space-y-2">
                        {item.bullets.map((b) => (
                          <li key={b} className="flex gap-2.5 text-sm text-slate-400">
                            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}

                    {item.stack?.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-1.5">
                        {item.stack.map((t) => (
                          <span key={t} className="rounded-md bg-white/5 px-2 py-1 font-mono text-[11px] text-slate-400">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
