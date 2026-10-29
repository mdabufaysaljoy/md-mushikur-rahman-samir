import fs from 'node:fs';
import path from 'node:path';

/**
 * Crawlers (WhatsApp, Facebook, X, Slack, Google) read the HTML as served and never
 * run the app, so meta set by React at runtime never reaches a link preview. This
 * plugin bakes the admin panel's SEO section into the HTML at build time, and emits
 * one pre-rendered shell per project so a shared project link previews that project.
 *
 * Source of truth is the API: SEO_API_URL, else VITE_API_URL. With neither set the
 * build is left untouched, which is what local dev and the single-service deploy want.
 */

const MARK_START = '<!--seo:start-->';
const MARK_END = '<!--seo:end-->';

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const trimSlash = (s = '') => s.replace(/\/+$/, '');

/** Uploads come back root-relative; a crawler needs an absolute URL. */
const absolute = (url, origin) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return url.startsWith('/') ? `${origin}${url}` : url;
};

const clamp = (s = '', max = 300) => {
  const text = String(s).replace(/\s+/g, ' ').trim();
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
};

function renderHead({ title, description, keywords, image, url, siteName, jsonLd, favicon }) {
  const tags = [
    `<title>${esc(title)}</title>`,
    description && `<meta name="description" content="${esc(description)}" />`,
    keywords && `<meta name="keywords" content="${esc(keywords)}" />`,
    url && `<link rel="canonical" href="${esc(url)}" />`,
    favicon && `<link rel="icon" href="${esc(favicon)}" />`,
    `<meta property="og:type" content="website" />`,
    siteName && `<meta property="og:site_name" content="${esc(siteName)}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    description && `<meta property="og:description" content="${esc(description)}" />`,
    url && `<meta property="og:url" content="${esc(url)}" />`,
    image && `<meta property="og:image" content="${esc(image)}" />`,
    image && `<meta property="og:image:alt" content="${esc(title)}" />`,
    `<meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    description && `<meta name="twitter:description" content="${esc(description)}" />`,
    image && `<meta name="twitter:image" content="${esc(image)}" />`,
    jsonLd && `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
  ].filter(Boolean);
  return `${MARK_START}\n    ${tags.join('\n    ')}\n    ${MARK_END}`;
}

/**
 * Replaces the head block the plugin owns. On the first pass the stock tags are
 * stripped BEFORE the block goes in, otherwise the cleanup regexes match the freshly
 * injected tags instead of the originals.
 */
function applyHead(html, head) {
  if (html.includes(MARK_START)) {
    return html.replace(new RegExp(`${MARK_START}[\\s\\S]*?${MARK_END}`), head);
  }
  let out = html.replace(/\s*<meta\s+name="description"[\s\S]*?\/>/, '');
  // The stock favicon only goes if the admin panel supplies a replacement.
  if (head.includes('rel="icon"')) out = out.replace(/\s*<link rel="icon"[^>]*>/, '');
  return out.replace(/<title>[\s\S]*?<\/title>/, head);
}

async function fetchSite(apiOrigin) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`${apiOrigin}/api/v1/site`, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()).data;
  } finally {
    clearTimeout(timer);
  }
}

export default function seoPlugin() {
  let site = null;
  let apiOrigin = '';
  let siteUrl = '';

  const meta = () => {
    const settings = site.settings || {};
    const profile = site.profile || {};
    const seo = profile.seo || {};
    const title = settings.siteTitle || seo.title || profile.name || 'Portfolio';
    const image = absolute(profile.avatarUrl || settings.logoUrl, apiOrigin);
    return {
      siteName: title,
      title,
      description: clamp(seo.description || profile.summary || settings.tagline),
      keywords: seo.keywords,
      image,
      favicon: absolute(settings.faviconUrl, apiOrigin),
      url: siteUrl || '',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: profile.name,
        jobTitle: profile.headline,
        description: seo.description || profile.summary,
        ...(image ? { image } : {}),
        ...(siteUrl ? { url: siteUrl } : {}),
        ...(profile.email ? { email: profile.email } : {}),
        ...(profile.location ? { address: { '@type': 'PostalAddress', addressLocality: profile.location } } : {}),
        ...(profile.socials?.length ? { sameAs: profile.socials.map((s) => s.url).filter(Boolean) } : {}),
      },
    };
  };

  return {
    name: 'portfolio-seo',
    apply: 'build',

    async buildStart() {
      apiOrigin = trimSlash(process.env.SEO_API_URL || process.env.VITE_API_URL || '');
      siteUrl = trimSlash(
        process.env.VITE_SITE_URL ||
          (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : ''),
      );
      if (!apiOrigin) {
        this.warn('[seo] no SEO_API_URL/VITE_API_URL — leaving the HTML meta as written');
        return;
      }
      try {
        site = await fetchSite(apiOrigin);
      } catch (err) {
        // A link preview is not worth a failed deploy; ship the stock meta instead.
        this.warn(`[seo] could not read ${apiOrigin}/api/v1/site (${err.message}) — keeping the stock meta`);
      }
    },

    transformIndexHtml(html) {
      if (!site) return html;
      return applyHead(html, renderHead(meta()));
    },

    /** One shell per project URL so a shared project link previews that project. */
    closeBundle() {
      if (!site) return;
      const outDir = path.resolve('dist');
      const indexPath = path.join(outDir, 'index.html');
      if (!fs.existsSync(indexPath)) return;
      const shell = fs.readFileSync(indexPath, 'utf8');
      const base = meta();

      const pages = [
        {
          dir: 'projects',
          head: {
            ...base,
            title: `Projects | ${base.siteName}`,
            description: clamp(`Case studies and shipped work by ${site.profile?.name || base.siteName}.`),
            jsonLd: null,
          },
        },
        ...(site.projects || [])
          .filter((p) => p.published !== false && p.slug)
          .map((p) => ({
            dir: path.join('projects', p.slug),
            head: {
              ...base,
              title: `${p.title} | ${base.siteName}`,
              description: clamp(p.tagline || p.summary || base.description),
              image: absolute(p.coverImage, apiOrigin) || base.image,
              url: base.url ? `${base.url}/projects/${p.slug}` : '',
              jsonLd: null,
            },
          })),
      ];

      for (const page of pages) {
        const dir = path.join(outDir, page.dir);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'index.html'), applyHead(shell, renderHead(page.head)));
      }
      console.log(`[seo] baked meta from ${apiOrigin} into index.html + ${pages.length} page shells`);
    },
  };
}
