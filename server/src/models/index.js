import mongoose from 'mongoose';

const opts = { timestamps: true, versionKey: false };

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'editor'], default: 'admin' },
    lastLoginAt: Date,
  },
  opts
);

const profileSchema = new mongoose.Schema(
  {
    name: String,
    headline: String,
    roles: [String],
    summary: String,
    about: String,
    location: String,
    email: String,
    phone: String,
    availability: String,
    resumeUrl: String,
    avatarUrl: String,
    socials: [{ label: String, url: String, icon: String }],
    stats: [{ label: String, value: String, suffix: String }],
    seo: { title: String, description: String, keywords: String },
  },
  opts
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    tagline: String,
    category: { type: String, default: 'Web App' },
    type: { type: String, enum: ['web', 'saas', 'embedded', 'ai'], default: 'web' },
    year: String,
    role: String,
    client: String,
    summary: String,
    description: String,
    problem: String,
    solution: String,
    highlights: [String],
    features: [String],
    stack: [String],
    architecture: String,
    metrics: [{ label: String, value: String }],
    coverImage: String,
    gallery: [String],
    accent: { type: String, default: '#6366f1' },
    liveUrl: String,
    repoUrl: String,
    caseStudyUrl: String,
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  opts
);

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    group: { type: String, default: 'Frontend' },
    level: { type: Number, default: 80 },
    icon: String,
    note: String,
    order: { type: Number, default: 0 },
  },
  opts
);

const experienceSchema = new mongoose.Schema(
  {
    role: String,
    company: String,
    location: String,
    type: { type: String, default: 'work' },
    start: String,
    end: String,
    current: { type: Boolean, default: false },
    summary: String,
    bullets: [String],
    stack: [String],
    order: { type: Number, default: 0 },
  },
  opts
);

const serviceSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    icon: String,
    bullets: [String],
    order: { type: Number, default: 0 },
  },
  opts
);

const testimonialSchema = new mongoose.Schema(
  {
    name: String,
    role: String,
    company: String,
    quote: String,
    avatarUrl: String,
    rating: { type: Number, default: 5 },
    order: { type: Number, default: 0 },
  },
  opts
);

const messageSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    subject: String,
    budget: String,
    message: String,
    read: { type: Boolean, default: false },
    archived: { type: Boolean, default: false },
    ip: String,
  },
  opts
);

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'site', unique: true },
    siteTitle: String,
    tagline: String,
    primaryColor: String,
    accentColor: String,
    heroMode: { type: String, default: 'particles' },
    showTestimonials: { type: Boolean, default: true },
    showServices: { type: Boolean, default: true },
    analyticsId: String,
    footerNote: String,
  },
  opts
);

export const User = mongoose.model('User', userSchema);
export const Profile = mongoose.model('Profile', profileSchema);
export const Project = mongoose.model('Project', projectSchema);
export const Skill = mongoose.model('Skill', skillSchema);
export const Experience = mongoose.model('Experience', experienceSchema);
export const Service = mongoose.model('Service', serviceSchema);
export const Testimonial = mongoose.model('Testimonial', testimonialSchema);
export const Message = mongoose.model('Message', messageSchema);
export const Settings = mongoose.model('Settings', settingsSchema);
