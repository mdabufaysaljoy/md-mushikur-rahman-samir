import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { config } from '../config.js';
import { repo, state } from '../lib/db.js';
import { crudRouter } from '../lib/crud.js';
import { requireAuth, signToken } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';
import { User, Profile, Project, Skill, Experience, Service, Testimonial, Message, Settings } from '../models/index.js';

export const repos = {
  users: repo(User),
  profile: repo(Profile),
  projects: repo(Project),
  skills: repo(Skill),
  experience: repo(Experience),
  services: repo(Service),
  testimonials: repo(Testimonial),
  messages: repo(Message),
  settings: repo(Settings),
};

const router = Router();

const authLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false });
const contactLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 15, standardHeaders: true, legacyHeaders: false });

/* ---------------------------------- auth --------------------------------- */
router.post(
  '/auth/login',
  authLimiter,
  asyncHandler(async (req, res) => {
    const email = String(req.body.email || '').toLowerCase().trim();
    const password = String(req.body.password || '');
    const user = await repos.users.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: { code: 'bad_credentials', message: 'Invalid email or password' } });
    }
    await repos.users.update(user._id, { lastLoginAt: new Date().toISOString() });
    res.json({ data: { token: signToken(user), user: { _id: user._id, name: user.name, email: user.email, role: user.role } } });
  })
);

router.get(
  '/auth/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await repos.users.findById(req.user.sub);
    if (!user) return res.status(404).json({ error: { code: 'not_found', message: 'User not found' } });
    res.json({ data: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  })
);

router.post(
  '/auth/password',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { currentPassword = '', newPassword = '' } = req.body;
    if (newPassword.length < 8) {
      return res.status(400).json({ error: { code: 'weak_password', message: 'New password must be at least 8 characters' } });
    }
    const user = await repos.users.findById(req.user.sub);
    if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash))) {
      return res.status(401).json({ error: { code: 'bad_credentials', message: 'Current password is incorrect' } });
    }
    await repos.users.update(user._id, { passwordHash: await bcrypt.hash(newPassword, 12) });
    res.json({ data: { ok: true } });
  })
);

/* --------------------------- aggregated site data -------------------------- */
router.get(
  '/site',
  asyncHandler(async (_req, res) => {
    const [profile, settings, projects, skills, experience, services, testimonials] = await Promise.all([
      repos.profile.findOne({}),
      repos.settings.findOne({ key: 'site' }),
      repos.projects.list({ published: true }, { order: 1 }),
      repos.skills.list({}, { order: 1 }),
      repos.experience.list({}, { order: 1 }),
      repos.services.list({}, { order: 1 }),
      repos.testimonials.list({}, { order: 1 }),
    ]);
    res.json({ data: { profile, settings, projects, skills, experience, services, testimonials } });
  })
);

/* -------------------------------- profile -------------------------------- */
router.get(
  '/profile',
  asyncHandler(async (_req, res) => res.json({ data: await repos.profile.findOne({}) }))
);

router.put(
  '/profile',
  requireAuth,
  asyncHandler(async (req, res) => {
    const existing = await repos.profile.findOne({});
    const payload = { ...req.body };
    delete payload._id;
    const data = existing ? await repos.profile.update(existing._id, payload) : await repos.profile.create(payload);
    res.json({ data });
  })
);

/* -------------------------------- settings -------------------------------- */
router.get(
  '/settings',
  asyncHandler(async (_req, res) => res.json({ data: await repos.settings.findOne({ key: 'site' }) }))
);

router.put(
  '/settings',
  requireAuth,
  asyncHandler(async (req, res) => {
    const existing = await repos.settings.findOne({ key: 'site' });
    const payload = { ...req.body, key: 'site' };
    delete payload._id;
    const data = existing ? await repos.settings.update(existing._id, payload) : await repos.settings.create(payload);
    res.json({ data });
  })
);

/* -------------------------------- messages -------------------------------- */
router.post(
  '/messages',
  contactLimiter,
  asyncHandler(async (req, res) => {
    const { name = '', email = '', message = '', subject = '', budget = '' } = req.body;
    const errors = {};
    if (name.trim().length < 2) errors.name = 'Please enter your name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = 'Please enter a valid email';
    if (message.trim().length < 10) errors.message = 'Tell me a bit more (10+ characters)';
    if (Object.keys(errors).length) {
      return res.status(400).json({ error: { code: 'validation_error', message: 'Please check the form', details: errors } });
    }
    await repos.messages.create({
      name: name.trim().slice(0, 80),
      email: email.trim().toLowerCase().slice(0, 254),
      subject: String(subject).slice(0, 140),
      budget: String(budget).slice(0, 60),
      message: message.trim().slice(0, 4000),
      ip: req.ip,
      read: false,
      archived: false,
    });
    res.status(201).json({ data: { ok: true } });
  })
);

router.get(
  '/messages',
  requireAuth,
  asyncHandler(async (_req, res) => res.json({ data: await repos.messages.list({}, { createdAt: -1 }) }))
);

router.put(
  '/messages/:id',
  requireAuth,
  asyncHandler(async (req, res) => res.json({ data: await repos.messages.update(req.params.id, req.body) }))
);

router.delete(
  '/messages/:id',
  requireAuth,
  asyncHandler(async (req, res) => res.json({ data: await repos.messages.remove(req.params.id) }))
);

/* --------------------------------- uploads -------------------------------- */
fs.mkdirSync(config.uploadsDir, { recursive: true });
const upload = multer({
  limits: { fileSize: 4 * 1024 * 1024 },
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, config.uploadsDir),
    filename: (_req, file, cb) => cb(null, `${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`),
  }),
  fileFilter: (_req, file, cb) =>
    cb(null, ['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/svg+xml'].includes(file.mimetype)),
});

router.post(
  '/uploads',
  requireAuth,
  upload.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) return res.status(400).json({ error: { code: 'bad_file', message: 'Image files only (max 4MB)' } });
    res.status(201).json({ data: { url: `/uploads/${req.file.filename}` } });
  })
);

/* ------------------------------- dashboard -------------------------------- */
router.get(
  '/stats',
  requireAuth,
  asyncHandler(async (_req, res) => {
    const [projects, featured, skills, messages, unread] = await Promise.all([
      repos.projects.count({}),
      repos.projects.count({ featured: true }),
      repos.skills.count({}),
      repos.messages.count({}),
      repos.messages.count({ read: false }),
    ]);
    res.json({ data: { projects, featured, skills, messages, unread, driver: state.driver } });
  })
);

/* ------------------------------- collections ------------------------------ */
router.use('/projects', crudRouter(repos.projects, { slugField: true }));
router.use('/skills', crudRouter(repos.skills));
router.use('/experience', crudRouter(repos.experience));
router.use('/services', crudRouter(repos.services));
router.use('/testimonials', crudRouter(repos.testimonials));

export default router;
