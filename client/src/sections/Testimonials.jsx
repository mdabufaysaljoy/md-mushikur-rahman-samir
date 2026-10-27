import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import Reveal from '../components/Reveal.jsx';

export default function Testimonials({ testimonials = [] }) {
  const [index, setIndex] = useState(0);
  if (!testimonials.length) return null;
  const item = testimonials[index % testimonials.length];
  const move = (step) => setIndex((i) => (i + step + testimonials.length) % testimonials.length);

  return (
    <section className="section">
      <div className="container-x">
        <Reveal>
          <span className="label-eyebrow">Feedback</span>
          <h2 className="max-w-2xl text-3xl leading-tight sm:text-4xl lg:text-5xl">
            What clients <span className="gradient-text">say</span>
          </h2>
        </Reveal>

        <div className="glass relative mt-12 overflow-hidden p-8 sm:p-12">
          <Quote className="absolute -right-4 -top-4 text-white/5" size={160} />
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="relative max-w-3xl"
            >
              <div className="mb-5 flex gap-1 text-neon-400">
                {Array.from({ length: item.rating || 5 }).map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
              </div>
              <p className="text-lg leading-relaxed text-slate-200 sm:text-2xl sm:leading-relaxed">"{item.quote}"</p>
              <footer className="mt-7 flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-neon-400 font-semibold text-white">
                  {item.name?.[0] || '•'}
                </span>
                <div>
                  <p className="font-medium text-white">{item.name}</p>
                  <p className="text-sm text-slate-400">
                    {item.role}
                    {item.company ? ` · ${item.company}` : ''}
                  </p>
                </div>
              </footer>
            </motion.blockquote>
          </AnimatePresence>

          <div className="relative mt-9 flex items-center gap-3">
            <button onClick={() => move(-1)} aria-label="Previous" className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:border-white/30 hover:text-white">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => move(1)} aria-label="Next" className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:border-white/30 hover:text-white">
              <ChevronRight size={18} />
            </button>
            <div className="ms-3 flex gap-1.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Testimonial ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${i === index ? 'w-7 bg-neon-400' : 'w-3 bg-white/15'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
