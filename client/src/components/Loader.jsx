export default function Loader({ label = 'Loading' }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5">
      <div className="relative h-16 w-16">
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-white/10 border-t-brand-500" />
        <span className="absolute inset-2 animate-spin rounded-full border-2 border-white/5 border-b-neon-400 [animation-direction:reverse]" />
      </div>
      <p className="font-mono text-xs uppercase tracking-[0.4em] text-slate-500">{label}</p>
    </div>
  );
}
