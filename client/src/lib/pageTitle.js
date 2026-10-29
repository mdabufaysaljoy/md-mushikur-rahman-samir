import { useEffect } from 'react';

/**
 * The build bakes "<page> | <site>" into each pre-rendered shell for crawlers; this
 * keeps the runtime title in step as the user navigates. Page and site titles arrive
 * in either order — a route's effect runs before the provider's on first mount — so
 * both are held here and the title is recomposed whenever one of them lands.
 */
let siteTitle = '';
let pageTitle = '';

function apply() {
  const next = pageTitle && siteTitle ? `${pageTitle} | ${siteTitle}` : pageTitle || siteTitle;
  if (next) document.title = next;
}

export function setSiteTitle(title) {
  siteTitle = title || '';
  apply();
}

export function usePageTitle(title) {
  useEffect(() => {
    pageTitle = title || '';
    apply();
    return () => {
      pageTitle = '';
      apply();
    };
  }, [title]);
}
