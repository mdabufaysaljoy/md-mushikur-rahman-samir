import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getSite, assetUrl } from './api.js';

const absolute = (url) => {
  const resolved = assetUrl(url);
  return resolved?.startsWith('/') ? `${window.location.origin}${resolved}` : resolved;
};

function setMeta(attr, key, content) {
  if (!content) return;
  let tag = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

/** Favicons are cached hard, so the old link is removed and a fresh one appended. */
function setFavicon(url) {
  document.head.querySelectorAll('link[rel~="icon"]').forEach((el) => el.remove());
  const link = document.createElement('link');
  link.rel = 'icon';
  link.href = url;
  if (/\.svg(\?|$)/i.test(url)) link.type = 'image/svg+xml';
  else if (/\.png(\?|$)/i.test(url)) link.type = 'image/png';
  document.head.appendChild(link);
}

const SiteContext = createContext({ data: null, loading: true, error: null, refresh: () => {} });

export function SiteProvider({ children }) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  const refresh = useCallback(async () => {
    try {
      const data = await getSite();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error });
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const s = state.data?.settings;
    if (!s) return;
    const root = document.documentElement;
    if (s.primaryColor) root.style.setProperty('--brand', s.primaryColor);
    if (s.accentColor) root.style.setProperty('--accent', s.accentColor);

    const seo = state.data?.profile?.seo;
    const title = s.siteTitle || seo?.title;
    if (title) document.title = title;
    if (seo?.description) setMeta('name', 'description', seo.description);
    if (seo?.keywords) setMeta('name', 'keywords', seo.keywords);
    setMeta('property', 'og:title', title || '');
    setMeta('property', 'og:description', seo?.description || s.tagline || '');
    const ogImage = state.data?.profile?.avatarUrl || s.logoUrl;
    if (ogImage) setMeta('property', 'og:image', absolute(ogImage));
    if (s.faviconUrl) setFavicon(assetUrl(s.faviconUrl));
  }, [state.data]);

  return <SiteContext.Provider value={{ ...state, refresh }}>{children}</SiteContext.Provider>;
}

export const useSite = () => useContext(SiteContext);
