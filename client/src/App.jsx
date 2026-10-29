import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { SiteProvider, useSite } from './lib/useSite.jsx';
import { assetUrl } from './lib/api.js';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import Cursor from './components/Cursor.jsx';
import Home from './pages/Home.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import NotFound from './pages/NotFound.jsx';
import AdminApp from './admin/AdminApp.jsx';

function ScrollToHash() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) return void setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 120);
    }
    if (!hash) window.scrollTo({ top: 0 });
  }, [pathname, hash]);
  return null;
}

function PublicSite() {
  const { data } = useSite();
  const location = useLocation();

  return (
    <>
      <Cursor />
      <Nav
        name={data?.profile?.name?.split(' ').slice(-2).join(' ') || 'Faysal Joy'}
        logo={assetUrl(data?.settings?.logoUrl)}
        avatar={assetUrl(data?.profile?.avatarUrl)}
      />
      <ScrollToHash />
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:slug" element={<ProjectDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer profile={data?.profile} settings={data?.settings} />
    </>
  );
}

export default function App() {
  return (
    <SiteProvider>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="*" element={<PublicSite />} />
      </Routes>
    </SiteProvider>
  );
}
