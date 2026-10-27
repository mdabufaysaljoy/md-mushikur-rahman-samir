import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { api } from '../lib/api.js';
import { profileFields, seoFields } from './schemas.js';
import { FieldGrid } from './fields.jsx';
import { useSite } from '../lib/useSite.jsx';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState('');
  const { refresh } = useSite();

  useEffect(() => {
    api('/profile').then((d) => setProfile(d || {}));
  }, []);

  const save = async () => {
    setStatus('saving');
    try {
      const payload = { ...profile };
      delete payload._id;
      await api('/profile', { method: 'PUT', body: payload, auth: true });
      setStatus('saved');
      refresh();
      setTimeout(() => setStatus(''), 2200);
    } catch (err) {
      setStatus(err.message);
    }
  };

  if (!profile) return <p className="text-sm text-slate-500">Loading…</p>;

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-semibold text-white">Profile & hero</h1>
      <p className="mt-1 text-sm text-slate-400">Name, headline, rotating roles, stats and social links.</p>

      <div className="glass mt-6 p-6">
        <FieldGrid fields={profileFields} values={profile} onChange={(k, v) => setProfile((p) => ({ ...p, [k]: v }))} />
      </div>

      <div className="glass mt-5 p-6">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-slate-400">SEO</h2>
        <FieldGrid
          fields={seoFields}
          values={profile.seo || {}}
          onChange={(k, v) => setProfile((p) => ({ ...p, seo: { ...(p.seo || {}), [k]: v } }))}
        />
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button onClick={save} className="btn-primary"><Save size={16} /> {status === 'saving' ? 'Saving…' : 'Save profile'}</button>
        {status === 'saved' && <span className="text-sm text-emerald-400">Saved.</span>}
        {status && !['saving', 'saved'].includes(status) && <span className="text-sm text-rose-400">{status}</span>}
      </div>
    </div>
  );
}
