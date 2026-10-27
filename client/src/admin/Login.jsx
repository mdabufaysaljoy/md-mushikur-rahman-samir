import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from './auth.jsx';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(form.email, form.password);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass w-full max-w-md p-8"
      >
        <div className="mb-7 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-neon-400 text-white">
            <Lock size={18} />
          </span>
          <div>
            <h1 className="text-lg font-semibold text-white">Admin panel</h1>
            <p className="text-xs text-slate-500">Sign in to edit every word on the site</p>
          </div>
        </div>

        <label className="mb-4 block">
          <span className="mb-1.5 block text-xs uppercase tracking-wider text-slate-400">Email</span>
          <input className="input" type="email" autoComplete="username" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="admin@faysaljoy.dev" />
        </label>

        <label className="mb-6 block">
          <span className="mb-1.5 block text-xs uppercase tracking-wider text-slate-400">Password</span>
          <input className="input" type="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
        </label>

        {error && (
          <p className="mb-4 flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
            <AlertCircle size={15} /> {error}
          </p>
        )}

        <button disabled={busy} className="btn-primary w-full">
          {busy ? 'Signing in…' : 'Sign in'} <LogIn size={16} />
        </button>
        <p className="mt-5 text-center text-xs text-slate-600">Credentials live in server/.env — change them before deploying.</p>
      </motion.form>
    </div>
  );
}
