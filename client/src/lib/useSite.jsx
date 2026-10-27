import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getSite } from './api.js';

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
    if (seo?.title) document.title = seo.title;
    if (seo?.description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', seo.description);
    }
  }, [state.data]);

  return <SiteContext.Provider value={{ ...state, refresh }}>{children}</SiteContext.Provider>;
}

export const useSite = () => useContext(SiteContext);
