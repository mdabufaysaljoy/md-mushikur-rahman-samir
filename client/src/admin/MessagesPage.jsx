import { useEffect, useState } from 'react';
import { Mail, MailOpen, Trash2, Archive } from 'lucide-react';
import { api } from '../lib/api.js';

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [open, setOpen] = useState(null);

  const load = async () => setMessages(await api('/messages', { auth: true }));

  useEffect(() => {
    load();
  }, []);

  const toggleRead = async (m) => {
    await api(`/messages/${m._id}`, { method: 'PUT', body: { read: !m.read }, auth: true });
    load();
  };

  const remove = async (m) => {
    if (!window.confirm('Delete this message?')) return;
    await api(`/messages/${m._id}`, { method: 'DELETE', auth: true });
    setOpen(null);
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Inbox</h1>
      <p className="mt-1 text-sm text-slate-400">{messages.filter((m) => !m.read).length} unread of {messages.length}</p>

      <div className="mt-6 space-y-3">
        {messages.map((m) => (
          <div key={m._id} className={`glass p-5 ${m.read ? 'opacity-70' : ''}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <button onClick={() => setOpen(open === m._id ? null : m._id)} className="text-start">
                <p className="font-medium text-slate-100">
                  {m.name} <span className="text-slate-500">· {m.email}</span>
                </p>
                <p className="mt-0.5 text-sm text-slate-400">{m.subject || 'No subject'}{m.budget ? ` · ${m.budget}` : ''}</p>
                <p className="mt-1 text-xs text-slate-600">{new Date(m.createdAt).toLocaleString()}</p>
              </button>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleRead(m)} className="rounded-lg border border-white/10 p-2 text-slate-400 hover:text-white" aria-label="Toggle read">
                  {m.read ? <MailOpen size={15} /> : <Mail size={15} />}
                </button>
                <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || 'Your message')}`} className="rounded-lg border border-white/10 p-2 text-slate-400 hover:text-white" aria-label="Reply">
                  <Archive size={15} />
                </a>
                <button onClick={() => remove(m)} className="rounded-lg border border-white/10 p-2 text-slate-500 hover:border-rose-500/40 hover:text-rose-400" aria-label="Delete">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
            {open === m._id && <p className="mt-4 whitespace-pre-wrap border-t border-white/10 pt-4 text-sm leading-relaxed text-slate-300">{m.message}</p>}
          </div>
        ))}
        {!messages.length && <p className="text-sm text-slate-500">No messages yet.</p>}
      </div>
    </div>
  );
}
