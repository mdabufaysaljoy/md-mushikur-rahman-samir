import { useEffect, useState } from 'react';
import { Save, KeyRound } from 'lucide-react';
import { api } from '../lib/api.js';
import { settingsFields } from './schemas.js';
import { FieldGrid } from './fields.jsx';
import { useSite } from '../lib/useSite.jsx';

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [status, setStatus] = useState('');
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '' });
  const [pwStatus, setPwStatus] = useState('');
  const { refresh } = useSite();

  useEffect(() => {
    api('/settings').then((d) => setSettings(d || {}));
  }, []);

  const save = async () => {
    setStatus('saving');
    try {
      const payload = { ...settings };
      delete payload._id;
      await api('/settings', { method: 'PUT', body: payload, auth: true });
      setStatus('saved');
      refresh();
      setTimeout(() => setStatus(''), 2200);
    } catch (err) {
      setStatus(err.message);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setPwStatus('saving');
    try {
      await api('/auth/password', { method: 'POST', body: pw, auth: true });
      setPw({ currentPassword: '', newPassword: '' });
      setPwStatus('Password updated.');
    } catch (err) {
      setPwStatus(err.message);
    }
  };

  if (!settings) return <p className="text-sm text-slate-500">Loading…</p>;

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-semibold text-white">Site settings</h1>
      <p className="mt-1 text-sm text-slate-400">Theme colours, section visibility and footer text.</p>

      <div className="glass mt-6 p-6">
        <FieldGrid fields={settingsFields} values={settings} onChange={(k, v) => setSettings((s) => ({ ...s, [k]: v }))} />
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button onClick={save} className="btn-primary"><Save size={16} /> {status === 'saving' ? 'Saving…' : 'Save settings'}</button>
        {status === 'saved' && <span className="text-sm text-emerald-400">Saved.</span>}
        {status && !['saving', 'saved'].includes(status) && <span className="text-sm text-rose-400">{status}</span>}
      </div>

      <form onSubmit={changePassword} className="glass mt-10 p-6">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
          <KeyRound size={15} /> Change admin password
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <input className="input" type="password" autoComplete="current-password" placeholder="Current password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} />
          <input className="input" type="password" autoComplete="new-password" placeholder="New password (min 8 chars)" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} />
        </div>
        <button className="btn-ghost mt-5">{pwStatus === 'saving' ? 'Updating…' : 'Update password'}</button>
        {pwStatus && pwStatus !== 'saving' && (
          <p className={`mt-3 text-sm ${pwStatus.includes('updated') ? 'text-emerald-400' : 'text-rose-400'}`}>{pwStatus}</p>
        )}
      </form>
    </div>
  );
}
