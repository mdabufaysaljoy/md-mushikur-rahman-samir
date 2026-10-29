#!/usr/bin/env node
/**
 * Exports the live portfolio content (profile, skills, projects, experience,
 * services, testimonials) to a single Markdown file — handy for a CV, a proposal
 * or a README. Re-run it after editing anything in the admin panel.
 *
 *   node scripts/export-content.js [--api https://md-mushikur-rahman-samir.onrender.com] [--out PORTFOLIO-CONTENT.md]
 */
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};

const API = flag('api', process.env.API_URL || 'https://md-mushikur-rahman-samir.onrender.com').replace(/\/$/, '');
const OUT = path.resolve(process.cwd(), flag('out', 'PORTFOLIO-CONTENT.md'));

const bullets = (items = []) => items.map((i) => `- ${i}`).join('\n');
const section = (lines) => lines.filter(Boolean).join('\n');

function renderProfile(p = {}) {
  const stats = (p.stats || []).map((s) => `**${s.value}${s.suffix || ''}** ${s.label.toLowerCase()}`).join(' · ');
  const socials = (p.socials || []).map((s) => `[${s.label}](${s.url})`).join(' · ');
  return section([
    `# ${p.name || 'Portfolio'}`,
    '',
    p.headline && `**${p.headline}**`,
    '',
    [p.location, p.email, p.availability].filter(Boolean).join(' · '),
    socials && `\n${socials}`,
    p.roles?.length && `\n**Roles:** ${p.roles.join(' · ')}`,
    stats && `\n${stats}`,
    p.summary && `\n## Summary\n\n${p.summary}`,
    p.about && `\n## About\n\n${p.about}`,
  ]);
}

function renderSkills(skills = []) {
  const groups = skills.reduce((acc, s) => {
    (acc[s.group] = acc[s.group] || []).push(s);
    return acc;
  }, {});
  const blocks = Object.entries(groups).map(([group, items]) => {
    const rows = items
      .sort((a, b) => (b.level || 0) - (a.level || 0))
      .map((s) => `| ${s.name} | ${s.level}% |${s.note ? ` ${s.note} |` : ''}`)
      .join('\n');
    return `### ${group}\n\n| Skill | Level |\n|---|---|\n${rows}`;
  });
  return `\n## Skills (${skills.length})\n\n${blocks.join('\n\n')}`;
}

function renderProject(p, index) {
  const links = [
    p.liveUrl && `[Live](${p.liveUrl})`,
    p.repoUrl && `[Source](${p.repoUrl})`,
  ].filter(Boolean).join(' · ');
  const metrics = (p.metrics || []).map((m) => `**${m.value}** ${m.label.toLowerCase()}`).join(' · ');

  return section([
    `### ${index}. ${p.title}`,
    '',
    p.tagline && `*${p.tagline}*`,
    '',
    [p.category, p.year, p.role].filter(Boolean).join(' · '),
    p.featured ? '\n`featured`' : '',
    links && `\n${links}`,
    p.summary && `\n**Overview.** ${p.summary}`,
    p.problem && `\n**Problem.** ${p.problem}`,
    p.solution && `\n**Approach.** ${p.solution}`,
    p.highlights?.length && `\n**Engineering highlights**\n\n${bullets(p.highlights)}`,
    p.features?.length && `\n**Features**\n\n${bullets(p.features)}`,
    p.stack?.length && `\n**Stack:** ${p.stack.join(', ')}`,
    p.architecture && `\n**Architecture:** ${p.architecture}`,
    metrics && `\n**Metrics:** ${metrics}`,
  ]);
}

function renderExperience(items = []) {
  const blocks = items.map((e) => {
    const period = `${e.start} — ${e.current ? 'Present' : e.end}`;
    return section([
      `### ${e.role}`,
      '',
      `**${e.company}**${e.location ? ` · ${e.location}` : ''} · ${period}${e.type === 'education' ? ' · education' : ''}`,
      e.summary && `\n${e.summary}`,
      e.bullets?.length && `\n${bullets(e.bullets)}`,
      e.stack?.length && `\n**Stack:** ${e.stack.join(', ')}`,
    ]);
  });
  return `\n## Experience\n\n${blocks.join('\n\n')}`;
}

function renderServices(items = []) {
  const blocks = items.map((s) =>
    section([`### ${s.title}`, '', s.description, s.bullets?.length && `\n${bullets(s.bullets)}`])
  );
  return `\n## Services\n\n${blocks.join('\n\n')}`;
}

function renderTestimonials(items = []) {
  const blocks = items.map((t) =>
    `> ${t.quote}\n>\n> — **${t.name}**, ${[t.role, t.company].filter(Boolean).join(', ')}`
  );
  return `\n## Testimonials\n\n${blocks.join('\n\n')}`;
}

async function main() {
  const res = await fetch(`${API}/api/v1/site`);
  if (!res.ok) throw new Error(`API responded ${res.status} — is the server running at ${API}?`);
  const { data } = await res.json();

  const featured = (data.projects || []).filter((p) => p.featured);
  const rest = (data.projects || []).filter((p) => !p.featured);

  const markdown = section([
    renderProfile(data.profile),
    renderSkills(data.skills),
    featured.length && `\n## Featured projects (${featured.length})\n\n${featured.map((p, i) => renderProject(p, i + 1)).join('\n\n---\n\n')}`,
    rest.length && `\n## Other projects (${rest.length})\n\n${rest.map((p, i) => renderProject(p, featured.length + i + 1)).join('\n\n---\n\n')}`,
    renderExperience(data.experience),
    renderServices(data.services),
    renderTestimonials(data.testimonials),
    `\n---\n\n*Exported from the portfolio API on ${new Date().toISOString().slice(0, 10)} · regenerate with \`npm run export:content\`*`,
  ]);

  fs.writeFileSync(OUT, `${markdown.replace(/\n{3,}/g, '\n\n')}\n`);
  console.log(`Wrote ${OUT}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
