/**
 * Zero-dependency JSON document store.
 * Used automatically when no MongoDB server is reachable, so the portfolio
 * (and its admin panel) stays fully functional on any machine.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { config } from '../config.js';

const FILE = path.join(config.dataDir, 'db.json');
let cache = null;

function load() {
  if (cache) return cache;
  fs.mkdirSync(config.dataDir, { recursive: true });
  try {
    cache = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch {
    cache = {};
  }
  return cache;
}

function persist() {
  fs.mkdirSync(config.dataDir, { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(cache, null, 2));
}

const matches = (doc, filter = {}) =>
  Object.entries(filter).every(([key, value]) => {
    if (value === undefined) return true;
    if (value && typeof value === 'object' && '$in' in value) return value.$in.includes(doc[key]);
    if (Array.isArray(doc[key])) return doc[key].includes(value);
    return String(doc[key]) === String(value);
  });

function sortDocs(docs, sort = {}) {
  const entries = Object.entries(sort);
  if (!entries.length) return docs;
  return [...docs].sort((a, b) => {
    for (const [key, dir] of entries) {
      const av = a[key], bv = b[key];
      if (av === bv) continue;
      return (av > bv ? 1 : -1) * (dir === -1 ? -1 : 1);
    }
    return 0;
  });
}

export const fileStore = {
  collection(name) {
    const db = load();
    db[name] = db[name] || [];
    return db[name];
  },
  list(name, filter = {}, sort = {}) {
    return sortDocs(this.collection(name).filter((d) => matches(d, filter)), sort);
  },
  findOne(name, filter = {}) {
    return this.collection(name).find((d) => matches(d, filter)) || null;
  },
  create(name, data) {
    const now = new Date().toISOString();
    const doc = { _id: crypto.randomUUID(), createdAt: now, updatedAt: now, ...data };
    this.collection(name).push(doc);
    persist();
    return doc;
  },
  update(name, id, data) {
    const col = this.collection(name);
    const index = col.findIndex((d) => String(d._id) === String(id));
    if (index === -1) return null;
    col[index] = { ...col[index], ...data, updatedAt: new Date().toISOString() };
    persist();
    return col[index];
  },
  remove(name, id) {
    const col = this.collection(name);
    const index = col.findIndex((d) => String(d._id) === String(id));
    if (index === -1) return null;
    const [doc] = col.splice(index, 1);
    persist();
    return doc;
  },
  replaceAll(name, docs) {
    const db = load();
    db[name] = docs;
    persist();
  },
};
