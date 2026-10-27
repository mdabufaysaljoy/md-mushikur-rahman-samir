import { useMemo } from 'react';
import { useSite } from '../lib/useSite.jsx';
import Loader from '../components/Loader.jsx';
import Hero from '../sections/Hero.jsx';
import About from '../sections/About.jsx';
import Skills from '../sections/Skills.jsx';
import Projects from '../sections/Projects.jsx';
import Journey from '../sections/Journey.jsx';
import Services from '../sections/Services.jsx';
import Testimonials from '../sections/Testimonials.jsx';
import Contact from '../sections/Contact.jsx';

export default function Home() {
  const { data, loading, error } = useSite();

  const techs = useMemo(() => {
    const names = (data?.skills || []).map((s) => s.name);
    return names.length ? names.slice(0, 18) : ['React', 'Node.js', 'MongoDB', 'Next.js', 'Docker', 'ESP32'];
  }, [data]);

  if (loading) return <Loader label="Booting experience" />;
  if (error) {
    return (
      <div className="container-x flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="text-2xl text-white">The API is not responding</h1>
        <p className="mt-3 max-w-md text-sm text-slate-400">
          Start the backend with <code className="font-mono text-neon-400">npm run dev</code> from the project root, then reload.
        </p>
      </div>
    );
  }

  const { profile, settings, projects, skills, experience, services, testimonials } = data;

  return (
    <>
      <Hero profile={profile} settings={settings} techs={techs} />
      <About profile={profile} />
      <Skills skills={skills} />
      <Projects projects={projects} />
      <Journey experience={experience} />
      {settings?.showServices !== false && <Services services={services} />}
      {settings?.showTestimonials !== false && <Testimonials testimonials={testimonials} />}
      <Contact profile={profile} />
    </>
  );
}
