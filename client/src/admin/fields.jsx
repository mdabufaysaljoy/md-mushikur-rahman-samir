import { useRef, useState } from 'react';
import { Plus, Trash2, GripVertical, Upload, ImageOff } from 'lucide-react';
import { api } from '../lib/api.js';

const base = 'w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-brand-500/70 focus:ring-2 focus:ring-brand-500/20 placeholder:text-slate-600';

export function Field({ field, value, onChange }) {
  const { type = 'text', label, placeholder, options, help } = field;
  const set = (v) => onChange(v);

  const control = () => {
    switch (type) {
      case 'textarea':
        return <textarea rows={field.rows || 4} className={`${base} resize-y`} value={value || ''} placeholder={placeholder} onChange={(e) => set(e.target.value)} />;
      case 'number':
        return <input type="number" className={base} value={value ?? ''} placeholder={placeholder} onChange={(e) => set(e.target.value === '' ? '' : Number(e.target.value))} />;
      case 'boolean':
        return (
          <button
            type="button"
            onClick={() => set(!value)}
            className={`relative h-7 w-12 rounded-full transition ${value ? 'bg-brand-500' : 'bg-white/10'}`}
            aria-pressed={!!value}
          >
            <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${value ? 'left-6' : 'left-1'}`} />
          </button>
        );
      case 'color':
        return (
          <div className="flex items-center gap-3">
            <input type="color" value={value || '#6366f1'} onChange={(e) => set(e.target.value)} className="h-10 w-14 cursor-pointer rounded-lg border border-white/10 bg-transparent" />
            <input className={base} value={value || ''} onChange={(e) => set(e.target.value)} placeholder="#6366f1" />
          </div>
        );
      case 'select':
        return (
          <select className={base} value={value || ''} onChange={(e) => set(e.target.value)}>
            <option value="">—</option>
            {options.map((o) => (
              <option key={o.value ?? o} value={o.value ?? o} className="bg-ink-900">{o.label ?? o}</option>
            ))}
          </select>
        );
      case 'image':
        return <ImageField value={value} onChange={set} placeholder={placeholder} round={field.round} />;
      case 'list':
        return <ListField value={value} onChange={set} placeholder={placeholder} />;
      case 'objectList':
        return <ObjectListField value={value} onChange={set} subfields={field.subfields} />;
      default:
        return <input className={base} value={value || ''} placeholder={placeholder} onChange={(e) => set(e.target.value)} />;
    }
  };

  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">{label}</span>
      {control()}
      {help && <span className="mt-1 block text-xs text-slate-600">{help}</span>}
    </label>
  );
}

/** URL input + direct upload + live preview. Works for avatars, logos and favicons. */
function ImageField({ value, onChange, placeholder, round }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [broken, setBroken] = useState(false);

  const pick = async (file) => {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const form = new FormData();
      form.append('file', file);
      const data = await api('/uploads', { method: 'POST', body: form, auth: true, raw: true });
      setBroken(false);
      onChange(data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <span
          className={`grid h-12 w-12 shrink-0 place-items-center overflow-hidden border border-white/10 bg-white/[0.04] ${
            round ? 'rounded-full' : 'rounded-lg'
          }`}
        >
          {value && !broken ? (
            <img src={value} alt="" className="h-full w-full object-cover" onError={() => setBroken(true)} onLoad={() => setBroken(false)} />
          ) : (
            <ImageOff size={16} className="text-slate-600" />
          )}
        </span>
        <input
          className={base}
          value={value || ''}
          placeholder={placeholder || 'https://… or upload'}
          onChange={(e) => {
            setBroken(false);
            onChange(e.target.value);
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2.5 text-xs text-slate-300 hover:border-brand-500/50 hover:text-white"
        >
          <Upload size={13} /> {busy ? 'Uploading…' : 'Upload'}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="shrink-0 rounded-lg border border-white/10 p-2.5 text-slate-500 hover:border-rose-500/40 hover:text-rose-400"
            aria-label="Clear image"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
      {error && <span className="block text-xs text-rose-400">{error}</span>}
      {value && broken && <span className="block text-xs text-amber-400">That URL did not load — check it or upload a file instead.</span>}
    </div>
  );
}

function ListField({ value = [], onChange, placeholder }) {
  const items = Array.isArray(value) ? value : [];
  const update = (i, v) => onChange(items.map((item, idx) => (idx === i ? v : item)));
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <GripVertical size={15} className="shrink-0 text-slate-600" />
          <input className={base} value={item} placeholder={placeholder} onChange={(e) => update(i, e.target.value)} />
          <button type="button" onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="shrink-0 rounded-lg border border-white/10 p-2 text-slate-500 hover:border-rose-500/40 hover:text-rose-400">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, ''])} className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-white/15 px-3 py-2 text-xs text-slate-400 hover:border-brand-500/50 hover:text-white">
        <Plus size={13} /> Add item
      </button>
    </div>
  );
}

function ObjectListField({ value = [], onChange, subfields = [] }) {
  const items = Array.isArray(value) ? value : [];
  const update = (i, key, v) => onChange(items.map((item, idx) => (idx === i ? { ...item, [key]: v } : item)));
  const blank = Object.fromEntries(subfields.map((f) => [f.name, '']));
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(subfields.length, 3)}, minmax(0,1fr))` }}>
            {subfields.map((f) => (
              <input key={f.name} className={base} placeholder={f.label} value={item?.[f.name] || ''} onChange={(e) => update(i, f.name, e.target.value)} />
            ))}
          </div>
          <button type="button" onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-400">
            <Trash2 size={12} /> Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, blank])} className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-white/15 px-3 py-2 text-xs text-slate-400 hover:border-brand-500/50 hover:text-white">
        <Plus size={13} /> Add entry
      </button>
    </div>
  );
}

export function FieldGrid({ fields, values, onChange }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {fields.map((f) => (
        <div key={f.name} className={f.full ? 'sm:col-span-2' : ''}>
          <Field field={f} value={values?.[f.name]} onChange={(v) => onChange(f.name, v)} />
        </div>
      ))}
    </div>
  );
}
