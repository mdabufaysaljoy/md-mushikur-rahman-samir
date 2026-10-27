import bcrypt from 'bcryptjs';
import { config } from './config.js';
import { connectDatabase } from './lib/db.js';
import { repos } from './routes/index.js';
import * as data from './seed-data.js';

/** Seeds the admin user + starter content when the store is empty. */
export async function ensureSeed({ force = false } = {}) {
  const adminExists = await repos.users.findOne({ email: config.admin.email });
  if (!adminExists) {
    await repos.users.create({
      name: data.profile.name,
      email: config.admin.email,
      passwordHash: await bcrypt.hash(config.admin.password, 12),
      role: 'admin',
    });
    console.log(`[seed] admin created: ${config.admin.email}`);
  }

  const collections = [
    ['profile', [data.profile], () => repos.profile.findOne({})],
    ['settings', [data.settings], () => repos.settings.findOne({ key: 'site' })],
    ['projects', data.projects, () => repos.projects.count({}).then((n) => n > 0)],
    ['skills', data.skills, () => repos.skills.count({}).then((n) => n > 0)],
    ['experience', data.experience, () => repos.experience.count({}).then((n) => n > 0)],
    ['services', data.services, () => repos.services.count({}).then((n) => n > 0)],
    ['testimonials', data.testimonials, () => repos.testimonials.count({}).then((n) => n > 0)],
  ];

  for (const [key, docs, exists] of collections) {
    if (force) await repos[key].clear();
    else if (await exists()) continue;
    for (const doc of docs) await repos[key].create(doc);
    console.log(`[seed] ${key}: ${docs.length} document(s)`);
  }
}

const isDirect = process.argv[1] && process.argv[1].endsWith('seed.js');
if (isDirect) {
  const force = process.argv.includes('--force');
  connectDatabase()
    .then(() => ensureSeed({ force }))
    .then(() => {
      console.log('[seed] done');
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
