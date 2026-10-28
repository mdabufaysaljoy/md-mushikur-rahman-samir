import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import Magnetic from './Magnetic.jsx';

const LINKS = [
  { label: 'About', hash: '#about' },
  { label: 'Skills', hash: '#skills' },
  { label: 'Work', hash: '#work' },
  { label: 'Journey', hash: '#journey' },
  { label: 'Services', hash: '#services' },
  { label: 'Contact', hash: '#contact' },
];

export default function Nav({ name = 'Faysal Joy', logo, avatar }) {
  const [markBroken, setMarkBroken] = useState(false);
  const mark = !markBroken ? logo || avatar : null;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const go = (hash) => {
    setOpen(false);
    if (pathname !== '/') navigate(`/${hash}`);
    else document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.div style={{ scaleX: progress }} className="fixed inset-x-0 top-0 z-[80] h-0.5 origin-left bg-gradient-to-r from-brand-500 to-neon-400" />
      <header className={`fixed inset-x-0 top-0 z-[70] transition-all duration-500 ${scrolled ? 'py-3' : 'py-6'}`}>
        <div className="container-x">
          <nav
            className={`flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-500 ${
              scrolled ? 'border border-white/10 bg-ink-950/70 backdrop-blur-xl' : 'border border-transparent'
            }`}
          >
            <Link to="/" className="group flex items-center gap-3">
              {mark ? (
                <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl ring-1 ring-white/15">
                  <img src={mark} alt="" className="h-full w-full object-cover" onError={() => setMarkBroken(true)} />
                  <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand-500 to-neon-400 opacity-0 blur-md transition group-hover:opacity-60" />
                </span>
              ) : (
                <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-neon-400 font-bold text-white">
                  {(name || 'F').trim().charAt(0).toUpperCase()}
                  <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand-500 to-neon-400 opacity-60 blur-md transition group-hover:opacity-90" />
                </span>
              )}
              <span className="text-sm font-semibold tracking-wide text-slate-200">{name}</span>
            </Link>

            <div className="hidden items-center gap-1 lg:flex">
              {LINKS.map((l) => (
                <button
                  key={l.hash}
                  onClick={() => go(l.hash)}
                  className="relative rounded-full px-4 py-2 text-sm text-slate-400 transition hover:text-white"
                >
                  {l.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Magnetic className="hidden sm:block">
                <button onClick={() => go('#contact')} className="btn-primary !px-5 !py-2.5">
                  Hire me <ArrowUpRight size={16} />
                </button>
              </Magnetic>
              <button
                onClick={() => setOpen((v) => !v)}
                aria-label="Toggle menu"
                className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-200 lg:hidden"
              >
                {open ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </nav>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="container-x mt-2 lg:hidden"
            >
              <div className="glass flex flex-col p-2">
                {LINKS.map((l) => (
                  <button
                    key={l.hash}
                    onClick={() => go(l.hash)}
                    className="rounded-xl px-4 py-3 text-start text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                  >
                    {l.label}
                  </button>
                ))}
                <Link to="/projects" className="rounded-xl px-4 py-3 text-start text-sm text-slate-300 hover:bg-white/5 hover:text-white">
                  All projects
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
