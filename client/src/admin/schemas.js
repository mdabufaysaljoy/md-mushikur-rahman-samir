/** Field definitions that drive every admin form. Add a field here and it appears in the panel. */
export const projectFields = [
  { name: 'title', label: 'Title' },
  { name: 'slug', label: 'Slug', help: 'URL: /projects/<slug>' },
  { name: 'tagline', label: 'Tagline', full: true },
  { name: 'category', label: 'Category badge' },
  { name: 'type', label: 'Filter group', type: 'select', options: [
    { value: 'web', label: 'Web platforms' },
    { value: 'saas', label: 'SaaS & ERP' },
    { value: 'embedded', label: 'IoT & hardware' },
    { value: 'ai', label: 'AI & robotics' },
  ] },
  { name: 'year', label: 'Year' },
  { name: 'role', label: 'My role' },
  { name: 'accent', label: 'Accent colour', type: 'color' },
  { name: 'summary', label: 'Overview', type: 'textarea', full: true },
  { name: 'problem', label: 'The problem', type: 'textarea', full: true },
  { name: 'solution', label: 'The approach', type: 'textarea', full: true },
  { name: 'highlights', label: 'Engineering highlights', type: 'list', full: true },
  { name: 'features', label: 'Feature set', type: 'list', full: true },
  { name: 'stack', label: 'Tech stack', type: 'list', full: true },
  { name: 'architecture', label: 'Architecture line', type: 'textarea', rows: 2, full: true },
  { name: 'metrics', label: 'Metrics', type: 'objectList', full: true, subfields: [
    { name: 'label', label: 'Label' },
    { name: 'value', label: 'Value' },
  ] },
  { name: 'liveUrl', label: 'Live URL' },
  { name: 'repoUrl', label: 'Repository URL' },
  { name: 'coverImage', label: 'Cover image URL' },
  { name: 'order', label: 'Sort order', type: 'number' },
  { name: 'featured', label: 'Featured on home', type: 'boolean' },
  { name: 'published', label: 'Published', type: 'boolean' },
];

export const skillFields = [
  { name: 'name', label: 'Skill' },
  { name: 'group', label: 'Group', help: 'Frontend, Backend, Database, Architecture, DevOps & Cloud, Embedded & IoT' },
  { name: 'level', label: 'Level (0-100)', type: 'number' },
  { name: 'order', label: 'Sort order', type: 'number' },
  { name: 'note', label: 'Note', full: true },
];

export const experienceFields = [
  { name: 'role', label: 'Role' },
  { name: 'company', label: 'Company / Institution' },
  { name: 'location', label: 'Location' },
  { name: 'type', label: 'Type', type: 'select', options: ['work', 'education'] },
  { name: 'start', label: 'Start' },
  { name: 'end', label: 'End' },
  { name: 'current', label: 'Currently here', type: 'boolean' },
  { name: 'order', label: 'Sort order', type: 'number' },
  { name: 'summary', label: 'Summary', type: 'textarea', full: true },
  { name: 'bullets', label: 'Achievements', type: 'list', full: true },
  { name: 'stack', label: 'Stack', type: 'list', full: true },
];

export const serviceFields = [
  { name: 'title', label: 'Title' },
  { name: 'icon', label: 'Icon', type: 'select', options: ['layers', 'store', 'network', 'cpu', 'cloud', 'sparkles'] },
  { name: 'description', label: 'Description', type: 'textarea', full: true },
  { name: 'bullets', label: 'Bullets', type: 'list', full: true },
  { name: 'order', label: 'Sort order', type: 'number' },
];

export const testimonialFields = [
  { name: 'name', label: 'Name' },
  { name: 'role', label: 'Role' },
  { name: 'company', label: 'Company' },
  { name: 'rating', label: 'Rating (1-5)', type: 'number' },
  { name: 'quote', label: 'Quote', type: 'textarea', full: true },
  { name: 'order', label: 'Sort order', type: 'number' },
];

export const profileFields = [
  { name: 'name', label: 'Full name' },
  { name: 'headline', label: 'Headline' },
  { name: 'availability', label: 'Availability badge' },
  { name: 'location', label: 'Location' },
  { name: 'email', label: 'Email' },
  { name: 'phone', label: 'Phone' },
  { name: 'resumeUrl', label: 'Résumé URL' },
  { name: 'avatarUrl', label: 'Avatar URL' },
  { name: 'roles', label: 'Rotating hero roles', type: 'list', full: true },
  { name: 'summary', label: 'Hero summary', type: 'textarea', full: true },
  { name: 'about', label: 'About text', type: 'textarea', rows: 6, full: true },
  { name: 'stats', label: 'Hero stats', type: 'objectList', full: true, subfields: [
    { name: 'value', label: 'Value' },
    { name: 'suffix', label: 'Suffix' },
    { name: 'label', label: 'Label' },
  ] },
  { name: 'socials', label: 'Social links', type: 'objectList', full: true, subfields: [
    { name: 'label', label: 'Label' },
    { name: 'url', label: 'URL' },
    { name: 'icon', label: 'icon key' },
  ] },
];

export const seoFields = [
  { name: 'title', label: 'SEO title', full: true },
  { name: 'description', label: 'Meta description', type: 'textarea', full: true },
  { name: 'keywords', label: 'Keywords', full: true },
];

export const settingsFields = [
  { name: 'siteTitle', label: 'Site title' },
  { name: 'tagline', label: 'Tagline' },
  { name: 'primaryColor', label: 'Primary colour', type: 'color' },
  { name: 'accentColor', label: 'Accent colour', type: 'color' },
  { name: 'showServices', label: 'Show services section', type: 'boolean' },
  { name: 'showTestimonials', label: 'Show testimonials', type: 'boolean' },
  { name: 'analyticsId', label: 'Analytics ID' },
  { name: 'footerNote', label: 'Footer note', type: 'textarea', full: true },
];

export const collections = {
  projects: { label: 'Projects', fields: projectFields, titleKey: 'title', subtitleKey: 'tagline', endpoint: '/projects' },
  skills: { label: 'Skills', fields: skillFields, titleKey: 'name', subtitleKey: 'group', endpoint: '/skills' },
  experience: { label: 'Experience', fields: experienceFields, titleKey: 'role', subtitleKey: 'company', endpoint: '/experience' },
  services: { label: 'Services', fields: serviceFields, titleKey: 'title', subtitleKey: 'description', endpoint: '/services' },
  testimonials: { label: 'Testimonials', fields: testimonialFields, titleKey: 'name', subtitleKey: 'company', endpoint: '/testimonials' },
};
