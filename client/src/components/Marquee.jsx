export default function Marquee({ items = [], className = '' }) {
  const row = [...items, ...items];
  return (
    <div className={`relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)] ${className}`}>
      <div className="flex min-w-full shrink-0 animate-marquee items-center gap-10 pe-10">
        {row.map((item, i) => (
          <span key={`${item}-${i}`} className="whitespace-nowrap font-mono text-sm uppercase tracking-[0.3em] text-slate-500">
            {item}
            <span className="ms-10 text-brand-500">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
