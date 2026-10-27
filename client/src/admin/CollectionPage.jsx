import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, X, Search, Pencil } from 'lucide-react';
import { api } from '../lib/api.js';
import { collections } from './schemas.js';
import { FieldGrid } from './fields.jsx';
import { useSite } from '../lib/useSite.jsx';

export default function CollectionPage() {
  const { collection } = useParams();
  const config = collections[collection];
  const { refresh } = useSite();

  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await api(config.endpoint));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setEditing(null);
    setQuery('');
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => JSON.stringify(i).toLowerCase().includes(q));
  }, [items, query]);

  if (!config) return <p className="text-slate-400">Unknown collection.</p>;

  const blank = () => {
    const draft = { order: items.length + 1 };
    for (const f of config.fields) {
      if (f.type === 'list' || f.type === 'objectList') draft[f.name] = [];
      else if (f.type === 'boolean') draft[f.name] = f.name === 'published';
    }
    return draft;
  };

  const save = async () => {
    setStatus('saving');
    try {
      const payload = { ...editing };
      const id = payload._id;
      delete payload._id;
      delete payload.createdAt;
      delete payload.updatedAt;
      if (id) await api(`${config.endpoint}/${id}`, { method: 'PUT', body: payload, auth: true });
      else await api(config.endpoint, { method: 'POST', body: payload, auth: true });
      setStatus('saved');
      setEditing(null);
      await load();
      refresh();
      setTimeout(() => setStatus(''), 2200);
    } catch (err) {
      setStatus(err.message);
    }
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete "${item[config.titleKey]}"? This cannot be undone.`)) return;
    await api(`${config.endpoint}/${item._id}`, { method: 'DELETE', auth: true });
    await load();
    refresh();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">{config.label}</h1>
          <p className="mt-1 text-sm text-slate-400">{items.length} item(s) · changes appear on the site immediately</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input className="input !py-2 ps-9" placeholder="Search…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <button onClick={() => setEditing(blank())} className="btn-primary !py-2.5">
            <Plus size={16} /> New
          </button>
        </div>
      </div>

      {status && status !== 'saving' && (
        <p className={`mt-4 rounded-lg border px-3 py-2 text-sm ${status === 'saved' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-rose-500/30 bg-rose-500/10 text-rose-300'}`}>
          {status === 'saved' ? 'Saved.' : status}
        </p>
      )}

      <div className="mt-6 space-y-3">
        {loading && <p className="text-sm text-slate-500">Loading…</p>}
        {filtered.map((item) => (
          <div key={item._id} className="glass flex items-center justify-between gap-4 p-4">
            <div className="min-w-0">
              <p className="truncate font-medium text-slate-100">{item[config.titleKey] || 'Untitled'}</p>
              <p className="truncate text-sm text-slate-500">{item[config.subtitleKey]}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {item.featured && <span className="chip !text-[10px] text-neon-400">featured</span>}
              {item.published === false && <span className="chip !text-[10px] text-amber-400">draft</span>}
              <button onClick={() => setEditing(item)} className="rounded-lg border border-white/10 p-2 text-slate-400 hover:border-white/30 hover:text-white" aria-label="Edit">
                <Pencil size={15} />
              </button>
              <button onClick={() => remove(item)} className="rounded-lg border border-white/10 p-2 text-slate-500 hover:border-rose-500/40 hover:text-rose-400" aria-label="Delete">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
        {!loading && !filtered.length && <p className="text-sm text-slate-500">Nothing here yet.</p>}
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex justify-end bg-black/70 backdrop-blur-sm"
            onClick={() => setEditing(null)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              className="h-full w-full max-w-3xl overflow-y-auto border-s border-white/10 bg-ink-900 p-6 sm:p-8"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                  {editing._id ? 'Edit' : 'New'} {config.label.replace(/s$/, '')}
                </h2>
                <button onClick={() => setEditing(null)} className="rounded-lg border border-white/10 p-2 text-slate-400 hover:text-white">
                  <X size={16} />
                </button>
              </div>

              <FieldGrid fields={config.fields} values={editing} onChange={(k, v) => setEditing((e) => ({ ...e, [k]: v }))} />

              <div className="sticky bottom-0 mt-8 flex gap-3 border-t border-white/10 bg-ink-900 py-4">
                <button onClick={save} disabled={status === 'saving'} className="btn-primary">
                  <Save size={16} /> {status === 'saving' ? 'Saving…' : 'Save changes'}
                </button>
                <button onClick={() => setEditing(null)} className="btn-ghost">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
