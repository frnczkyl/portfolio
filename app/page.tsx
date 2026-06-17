'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import FacebookIcon from './components/FacebookIcon';
import GithubIcon from './components/GithubIcon';
import LinkedInIcon from './components/LinkedInIcon';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, ExternalLink, Gamepad2, Heart, BookOpen, Palette, Globe, ChevronLeft, ChevronRight, ArrowRight, Mail } from 'lucide-react';
import IntroAnimation from './components/IntroAnimation';
import WorkCarousel from './components/WorkCarousel';
import CertCarousel from './components/CertCarousel';

type Project = {
  title: string;
  description: string;
  tags: string[];
  image: string;
  link: string;
  projectLink?: string;
  color: string;
};

type SkillItem =
  | { name: string; icon: string; desc: string }
  | { name: string; custom: true; src: string; desc: string };

function getTagIcon(tag: string) {
  const dm: Record<string, string> = {
    'Java': 'devicon-java-plain colored', 'Python': 'devicon-python-plain colored',
    'C#': 'devicon-csharp-plain colored', 'React.js': 'devicon-react-original colored',
    'React': 'devicon-react-original colored', 'Next.js': 'devicon-nextjs-plain text-white',
    'Django': 'devicon-django-plain text-emerald-400', 'Android': 'devicon-android-plain colored',
    'Godot': 'devicon-godot-plain colored', 'PostgreSQL': 'devicon-postgresql-plain colored',
  };
  if (dm[tag]) return <i className={`${dm[tag]} text-base leading-none`} />;
  const lm: Record<string, React.ReactElement> = {
    'Game Development': <Gamepad2 className="w-3.5 h-3.5 text-orange-400" />,
    'RPG': <Gamepad2 className="w-3.5 h-3.5 text-yellow-400" />,
    'Game Design': <Palette className="w-3.5 h-3.5 text-zinc-300" />,
    'Healthcare': <Heart className="w-3.5 h-3.5 text-pink-400" />,
    'Education': <BookOpen className="w-3.5 h-3.5 text-green-400" />,
    'REST API': <Globe className="w-3.5 h-3.5 text-white" />,
  };
  if (lm[tag]) return lm[tag];
  if (tag === 'XAMPP') return <Image src="/Xampp.svg" alt="XAMPP" width={14} height={14} className="object-contain" />;
  return <span className="text-[8px] font-bold text-zinc-300">{tag.slice(0, 3)}</span>;
}

function StarButton({
  href, onClick, children, small = false, xs = false, stopProp = false, target,
}: {
  href?: string; onClick?: (e: React.MouseEvent) => void; children: React.ReactNode;
  small?: boolean; xs?: boolean; stopProp?: boolean; target?: string;
}) {
  const cls = `star-btn${xs ? ' star-btn-xs' : small ? ' star-btn-sm' : ''}`;
  const handleClick = stopProp ? (e: React.MouseEvent) => { e.stopPropagation(); onClick?.(e); } : onClick;
  const inner = (
    <>
      <strong>{children}</strong>
      <div className="star-btn-stars-wrap"><div className="star-btn-stars" /></div>
      <div className="star-btn-glow"><div className="star-btn-circle" /><div className="star-btn-circle" /></div>
    </>
  );
  if (href) return <a href={href} target={target} rel={target === '_blank' ? 'noopener noreferrer' : undefined} className={cls} onClick={handleClick}>{inner}</a>;
  return <div className={cls} role="button" onClick={handleClick}>{inner}</div>;
}

export default function Portfolio() {
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [projectIndex, setProjectIndex] = useState(0);
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const projects: Project[] = [
    { title: 'Ruined Light', description: 'A game developed using only Java alone. An RPG where you defeat each level to reach the boss. Features different playable characters and combat mechanics.', tags: ['Java', 'Game Development', 'RPG'], image: '/RuinedLight.png', link: 'https://github.com/frnczkyl/Ruined_Light_OOP1_PROJECT', color: 'from-gray-400 to-gray-600' },
    { title: 'ChipIn', description: 'Collaborative expense tracking platform with expense input system, participant management, and automated cost-splitting calculations for group events.', tags: ['Java', 'React.js', 'Android'], image: '/ChipIn.png', link: 'https://github.com/Jeskunnn/ChipIn', projectLink: 'https://chip-in-phi.vercel.app/', color: 'from-zinc-300 to-zinc-500' },
    { title: 'Sleepsync', description: 'Full-stack sleep tracking web app with pattern monitoring, personalized relaxation tips, optimal bedtime calculations, and customizable alarm scheduling.', tags: ['Django', 'Python', 'Healthcare'], image: '/SleepSync.png', link: 'https://github.com/ciddysed/IT342_SleepSync', projectLink: 'https://sleepsyncapp.netlify.app', color: 'from-zinc-200 to-zinc-500' },
    { title: 'Wildlitz', description: 'Grade 3 educational learning platform with interactive activities. Built full-stack modules to enhance student engagement and learning outcomes.', tags: ['Django', 'Python', 'React.js', 'Education'], image: '/WildLitz.png', link: 'https://github.com/Nokitaki/WildLitz-Capstone', projectLink: 'https://wildlitz-capstone-raeg.onrender.com/', color: 'from-zinc-300 to-zinc-600' },
    { title: 'Russian Roulette', description: 'Turn-based Java game with XAMPP database integration, featuring complete data persistence and game state tracking throughout gameplay sessions.', tags: ['Java', 'XAMPP', 'Game Development'], image: '/RussianRoulette.jpg', link: 'https://github.com/danrave1234/OOP2_FinalProj', color: 'from-zinc-200 to-zinc-600' },
    { title: 'Identity: Fragments of Me', description: 'Turn-based 2D RPG developed for a GDAP gamified event. Created visual assets and contributed to the main concept and gameplay using Godot Engine.', tags: ['Godot', 'C#', 'Game Design'], image: '/Identity.jpg', link: 'https://github.com/danrave1234/Godot-Project', color: 'from-zinc-400 to-zinc-600' },
  ];

  const workProjects = [
    {
      title: 'BAI HR System',
      subtitle: 'Human Resources Platform',
      description: 'Internal HR management system for BAI Finance Group. Built comprehensive modules for employee records, attendance tracking, and payroll processing using Django REST Framework and React.',
      link: 'https://bai-hr-forkproduction-production.up.railway.app/',
      tags: ['Django', 'React', 'PostgreSQL', 'REST API'],
      accent: '#818cf8',
      bg: 'from-indigo-950/80 to-zinc-950',
      cardBg: 'linear-gradient(145deg, #1e1b4b 0%, #312e81 55%, #4c1d95 100%)',
      glowBg: 'radial-gradient(circle, rgba(99,102,241,0.55) 0%, transparent 70%)',
      image: '/bai-hr.png',
    },
    {
      title: 'BAI Remittance',
      subtitle: 'International Remittance App',
      description: 'Production full-stack remittance web application. Built robust backend APIs with Django REST Framework and dynamic frontends with Next.js for seamless cross-border money transfers.',
      link: 'https://bai-remit-frontend-production.up.railway.app/landingpage',
      tags: ['Django', 'Python', 'Next.js', 'React', 'REST API', 'PostgreSQL'],
      accent: '#e4e4e7',
      bg: 'from-zinc-700/50 to-zinc-950',
      cardBg: 'linear-gradient(145deg, #0f0f0f 0%, #1c1c1e 55%, #3a3a3c 100%)',
      glowBg: 'radial-gradient(circle, rgba(113,113,122,0.5) 0%, transparent 70%)',
      image: '/bai-remit.png',
    },
    {
      title: 'BAI Finance Website',
      subtitle: 'Official Corporate Website',
      description: 'Official corporate website for BAI Finance Group of Companies. Developed a modern, fully-responsive platform with Next.js showcasing company services, leadership, and client engagement.',
      link: 'https://bai-website-forkproduction-production.up.railway.app/',
      tags: ['Next.js', 'React', 'Tailwind CSS'],
      accent: '#fbbf24',
      bg: 'from-amber-950/60 to-zinc-950',
      cardBg: 'linear-gradient(145deg, #1c1007 0%, #78350f 60%, #92400e 100%)',
      glowBg: 'radial-gradient(circle, rgba(251,191,36,0.45) 0%, transparent 70%)',
      image: '/bai-website.png',
    },
  ];

  const skillsData: { languages: SkillItem[]; tools: SkillItem[] } = {
    languages: [
      { name: 'Java', icon: 'devicon-java-plain colored', desc: '' },
      { name: 'Python', icon: 'devicon-python-plain colored', desc: '' },
      { name: 'C', icon: 'devicon-c-plain colored', desc: '' },
      { name: 'C++', icon: 'devicon-cplusplus-plain colored', desc: '' },
      { name: 'C#', icon: 'devicon-csharp-plain colored', desc: '' },
      { name: 'JavaScript', icon: 'devicon-javascript-plain colored', desc: '' },
      { name: 'TypeScript', icon: 'devicon-typescript-plain colored', desc: '' },
      { name: 'HTML', icon: 'devicon-html5-plain colored', desc: '' },
      { name: 'CSS', icon: 'devicon-css3-plain colored', desc: '' },
      { name: 'Kotlin', icon: 'devicon-kotlin-plain colored', desc: '' },
      { name: 'SQL', icon: 'devicon-mysql-plain colored', desc: '' },
    ],
    tools: [
      { name: 'React.js', icon: 'devicon-react-original colored', desc: '' },
      { name: 'Next.js', icon: 'devicon-nextjs-plain text-white', desc: '' },
      { name: 'Tailwind CSS', icon: 'devicon-tailwindcss-plain colored', desc: '' },
      { name: 'Django', icon: 'devicon-django-plain text-emerald-400', desc: '' },
      { name: 'Node.js', icon: 'devicon-nodejs-plain colored', desc: '' },
      { name: 'Firebase', icon: 'devicon-firebase-plain colored', desc: '' },
      { name: 'Supabase', icon: 'devicon-supabase-plain colored', desc: '' },
      { name: 'XAMPP', custom: true, src: '/Xampp.svg', desc: '' },
      { name: 'Git', icon: 'devicon-git-plain colored', desc: '' },
      { name: 'GitHub', icon: 'devicon-github-plain text-white', desc: '' },
      { name: 'AWS', icon: 'devicon-amazonwebservices-plain-wordmark colored', desc: '' },
      { name: 'Android', icon: 'devicon-android-plain colored', desc: '' },
      { name: 'Vercel', icon: 'devicon-vercel-plain text-white', desc: '' },
      { name: 'Railway', icon: 'devicon-railway-original colored', desc: '' },
      { name: 'Godot', icon: 'devicon-godot-plain colored', desc: '' },
      { name: 'Postman', icon: 'devicon-postman-plain colored', desc: '' },
      { name: 'Bash', icon: 'devicon-bash-plain colored', desc: '' },
      { name: 'PowerShell', icon: 'devicon-powershell-plain colored', desc: '' },
    ],
  };

  const certificates = [
    { name: 'FreeCodeCamp — Front End Development Libraries V8', image: '/FreeCodeCamp.png', link: 'https://www.freecodecamp.org/certification/franciskylelorenzana/front-end-development-libraries' },
    { name: 'AWS Academy Cloud Foundations', image: '/AWS.png', link: 'https://drive.google.com/file/d/1fCfX2trjn4fW2SG6a2I0iA83Xu8QAKrt/view?usp=drive_link' },
    { name: 'Data Visualization — Kaggle', image: '/Data Visualization.png', link: 'https://drive.google.com/file/d/10JjnTdPeY67tvnqvLvlf4VUpIPViPjgb/view?usp=drive_link' },
    { name: 'Webinar on Intellectual Property Rights', image: '/Webinar.png', link: 'https://drive.google.com/file/d/1XOIgO-XjMlA-wylJwX-TfIn6LnetsS8O/view?usp=drive_link' },
    { name: 'Introduction to HTML — Sololearn', image: '/SoloLearn HTML.png', link: 'https://drive.google.com/file/d/1B7jYS0LnZhYkRSqGZPweCBUurowOaFFT/view?usp=drive_link' },
    { name: 'Introduction to JavaScript — Sololearn', image: '/SoloLearn Javascript.png', link: 'https://drive.google.com/file/d/1WtGUzpd1R6GxXitp0CUWcaKQfb30c5PT/view?usp=drive_link' },
    { name: 'AWS Academy Cloud Architecting', image: '/AwsArchitecting.png', link: 'https://drive.google.com/file/d/1hYegeloVsDd1Wd1hA7760M36DuSFxSdt/view?usp=sharing' },
    { name: 'DevFest Cebu Workshop — Google Developers', image: '/DevFest.png', link: 'https://drive.google.com/file/d/1o2CQwMvUmWUkuxW4bffvMq5SOnmoCAsN/view?usp=sharing' },
    { name: 'SQL (Basic) Certificate', image: '/SQL_Certificate.png', link: 'https://drive.google.com/file/d/18JkI21PouW3WoMEgWfv9ebLJIh1JisC3/view?usp=sharing' },
    { name: 'Introduction to AI', image: '/Introduction_toAI.png', link: 'https://drive.google.com/file/d/1-nGHVZxzndQp8nj9VNcMkFzKrPfmsqJA/view?usp=sharing' },
  ];

  useEffect(() => {
    setMounted(true);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections((p) => new Set(p).add(entry.target.id));
          setActiveSection(entry.target.id);
        } else {
          setVisibleSections((p) => { const n = new Set(p); n.delete(entry.target.id); return n; });
        }
      });
    }, { threshold: 0.15 });
    ['hero', 'about', 'experience', 'projects', 'skills', 'certificates', 'contact'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const nextProject = () => setProjectIndex((i) => (i + 1) % projects.length);
  const prevProject = () => setProjectIndex((i) => (i - 1 + projects.length) % projects.length);

  const NAV = ['About', 'Experience', 'Projects', 'Skills', 'Certificates', 'Contact'];
  const p = projects[projectIndex];

  function SectionLabel({ n, label }: { n: string; label: string }) {
    return (
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <span className="text-[10px] font-bold tracking-[0.25em] text-zinc-600 uppercase">{n}</span>
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[10px] font-bold tracking-[0.25em] text-zinc-600 uppercase">{label}</span>
      </div>
    );
  }

  return (
    <>
      <IntroAnimation onDone={() => setIntroComplete(true)} />
      <div
        className="snap-container text-zinc-50 w-full"
        style={{ opacity: introComplete ? 1 : 0, transition: introComplete ? 'opacity 0.9s ease' : 'none', pointerEvents: introComplete ? 'auto' : 'none' }}
      >

        {/* ─── NAV ─── */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-2xl border-b border-white/[0.06] w-full">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className={`flex items-center gap-2 transition-all duration-700 ${mounted ? 'opacity-100' : 'opacity-0 -translate-x-4'}`}>
              <span className="text-lg font-black text-white tracking-tight">Kyle's Portfolio</span>
              <Image src="/Giphy.gif" alt="icon" width={isMobile ? 20 : 36} height={isMobile ? 20 : 36} />
            </div>
            <div className="hidden md:flex gap-8 text-sm font-medium">
              {NAV.map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`}
                  className={`relative group transition-colors duration-200 ${activeSection === item.toLowerCase() ? 'text-white' : 'text-zinc-500 hover:text-zinc-200'}`}>
                  {item}
                  <span className={`absolute -bottom-0.5 left-0 h-px bg-white transition-all duration-300 ${activeSection === item.toLowerCase() ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </a>
              ))}
            </div>
            <button className="md:hidden text-zinc-400" onClick={() => setIsMobileMenuOpen((v) => !v)}>
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          {isMobileMenuOpen && (
            <div className="md:hidden bg-black/95 border-t border-white/[0.06]">
              <div className="flex flex-col items-center gap-5 py-6">
                {NAV.map((item) => (
                  <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-sm font-medium transition-colors ${activeSection === item.toLowerCase() ? 'text-white' : 'text-zinc-500'}`}>{item}</a>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* ─── HERO ─── */}
        <section id="hero" className="snap-section flex items-center justify-center relative overflow-hidden px-5 sm:px-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(255,255,255,0.03)_0%,transparent_100%)]" />

          <div className="relative z-10 text-center max-w-5xl mx-auto w-full flex flex-col items-center" style={{ gap: '3.5rem' }}>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={introComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-zinc-500"
            >
              Full-Stack Developer
            </motion.p>

            <div className={`typing-container ${introComplete ? 'fade-in-up' : 'opacity-0'}`}>
              <h1 className="text-[2.6rem] sm:text-7xl md:text-8xl lg:text-[7rem] font-black tracking-tighter leading-[0.88]">
                <div className="typing-animation line1 block">
                  <span className="text-white">FRANCIS KYLE</span>
                </div>
                <div className="typing-animation line2 block">
                  <span className="bg-gradient-to-r from-white via-zinc-300 to-zinc-600 bg-clip-text text-transparent">LORENZANA</span>
                </div>
              </h1>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={introComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="flex flex-row gap-3 sm:gap-4 justify-center items-center"
            >
              <StarButton href="#projects">VIEW MY WORK</StarButton>
              <StarButton href="#contact">GET IN TOUCH</StarButton>
            </motion.div>
          </div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={introComplete ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-[9px] tracking-[0.3em] uppercase text-zinc-600">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-zinc-600 to-transparent" />
          </motion.div>
        </section>

        {/* ─── ABOUT ─── */}
        <section id="about" className="snap-section px-6 py-20 flex items-center">
          <div className="max-w-5xl mx-auto w-full">
            <SectionLabel n="01" label="About Me" />

            <div className="grid grid-cols-1 md:grid-cols-[5fr_7fr] gap-6 md:gap-10 items-stretch">

              {/* Photo */}
              <motion.div
                className="relative rounded-2xl overflow-hidden"
                style={{ minHeight: 320 }}
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.55 }}
              >
                <Image src="/MeMyself.jpg" alt="Francis Kyle Lorenzana" fill className="object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                {/* Name over photo */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-2xl font-black text-white leading-tight">Francis Kyle</p>
                  <p className="text-2xl font-black text-zinc-500 leading-tight">Lorenzana</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-emerald-400 font-semibold tracking-wide">Available for hire</span>
                  </div>
                </div>
              </motion.div>

              {/* Info */}
              <motion.div
                className="flex flex-col justify-between gap-5"
                initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.55, delay: 0.08 }}
              >
                <div className="text-center md:text-left">
                  <p className="text-xs tracking-[0.25em] text-zinc-500 uppercase mb-1.5">Full-Stack Developer</p>
                  <h2 className="text-3xl font-black text-white leading-tight">
                    Building things<br />for the web.
                  </h2>
                </div>

                <p className="text-zinc-400 text-sm leading-relaxed text-center md:text-left">
                  BSIT Graduate from Cebu Institute of Technology-University. I build full-stack applications with React, Next.js, and Django. Passionate about clean architecture, thoughtful UI, and shipping products that actually solve problems.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 divide-x divide-zinc-800 border border-zinc-800 rounded-xl overflow-hidden">
                  {[['7+', 'Projects'], ['14+', 'Technologies'], ['2026', 'Graduate']].map(([v, l]) => (
                    <div key={l} className="flex flex-col items-center py-4 bg-zinc-900/40">
                      <span className="text-2xl sm:text-3xl font-black text-white">{v}</span>
                      <span className="text-[9px] tracking-widest text-zinc-500 uppercase mt-0.5">{l}</span>
                    </div>
                  ))}
                </div>

                {/* Contact details */}
                <div className="space-y-2">
                  {[
                    { icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', text: 'kaelexx12@gmail.com' },
                    { icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', text: '09458924721' },
                    { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z', text: 'Talisay, Cebu' },
                  ].map(({ icon, text }) => (
                    <div key={text} className="flex items-center gap-3 text-sm text-zinc-400">
                      <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                        </svg>
                      </div>
                      {text}
                    </div>
                  ))}
                </div>

                {/* Education */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white p-0.5 flex-shrink-0">
                    <Image src="/CITLOGO.png" alt="CIT-U" width={28} height={28} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Cebu Institute of Technology - U</p>
                    <p className="text-xs text-zinc-500">BSIT · Graduated 2026</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── EXPERIENCE ─── */}
        <section id="experience" className="snap-section px-6 pt-24 pb-6 flex items-start justify-center lg:items-center lg:py-10">
          <div className="max-w-6xl mx-auto w-full">
            <SectionLabel n="02" label="Work Experience" />

            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-5">
              Work<br />
              <span className="bg-gradient-to-r from-white via-zinc-300 to-zinc-600 bg-clip-text text-transparent">Experience</span>
            </h2>

            <WorkCarousel projects={workProjects} getTagIcon={getTagIcon} />
          </div>
        </section>

        {/* ─── PROJECTS ─── */}
        <section id="projects" className="snap-section px-6 py-10 flex flex-col items-center justify-center">
          <div className="max-w-6xl mx-auto w-full">
            <SectionLabel n="03" label="University Projects" />

            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-8">
              University<br />
              <span className="bg-gradient-to-r from-white via-zinc-300 to-zinc-600 bg-clip-text text-transparent">Projects</span>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6 lg:gap-10 items-start">

              {/* Project image */}
              <div className="w-full relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/60" style={{ minHeight: '200px' }}>
                <div className="relative w-full" style={{ aspectRatio: '16/10', minHeight: '200px' }}>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={projectIndex} className="absolute inset-0"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Image src={p.image} alt={p.title} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    </motion.div>
                  </AnimatePresence>
                  <div className="absolute bottom-3 right-4 text-6xl font-black text-white/8 leading-none select-none pointer-events-none">
                    {String(projectIndex + 1).padStart(2, '0')}
                  </div>
                </div>
              </div>

              {/* Project details */}
              <div className="flex flex-col gap-4 items-center lg:items-start text-center lg:text-left">
                <div className="w-full relative" style={{ minHeight: '8rem' }}>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-500 mb-2">
                    {String(projectIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
                  </p>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.h3
                      key={`title-${projectIndex}`}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="absolute left-0 right-0 text-3xl sm:text-4xl font-black text-white leading-tight"
                      style={{ top: '1.5rem' }}
                    >
                      {p.title}
                    </motion.h3>
                  </AnimatePresence>
                </div>

                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={`desc-${projectIndex}`}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, delay: 0.05 }}
                    className="text-zinc-400 text-sm leading-relaxed w-full"
                    style={{ minHeight: isMobile ? '8rem' : '8.5rem' }}
                  >
                    {p.description}
                  </motion.p>
                </AnimatePresence>

                {/* Tags */}
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`tags-${projectIndex}`}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, delay: 0.1 }}
                    className="flex flex-wrap gap-2 justify-center lg:justify-start content-start w-full"
                    style={{ minHeight: isMobile ? '5rem' : '6rem' }}
                  >
                    {p.tags.map((tag) => (
                      <span key={tag} className="flex items-center gap-1.5 text-xs text-zinc-400">
                        {getTagIcon(tag)}<span>{tag}</span>
                      </span>
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* CTA buttons */}
                <div className="flex gap-3 mt-1 justify-center lg:justify-start w-full">
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 h-11 min-w-[9rem] px-5 rounded-lg bg-zinc-800 border border-zinc-700 text-sm font-semibold text-zinc-200 hover:bg-zinc-700 hover:border-zinc-500 hover:text-white transition-all duration-200">
                      <GithubIcon width={16} height={16} />GitHub
                    </a>
                  )}
                  {p.projectLink && (
                    <a href={p.projectLink} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 h-11 min-w-[9rem] px-5 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-all duration-200">
                      <ExternalLink className="w-4 h-4 flex-shrink-0" />Live Demo
                    </a>
                  )}
                  {!p.link && !p.projectLink && (
                    <span className="inline-flex items-center justify-center h-11 min-w-[9rem] px-5 rounded-lg border border-zinc-800 text-sm text-zinc-600">Private Project</span>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex items-center gap-4 pt-4 border-t border-zinc-800/60 w-full justify-center lg:justify-start">
                  <button onClick={prevProject} className="p-2 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800 transition-all">
                    <ChevronLeft className="w-4 h-4 text-white" />
                  </button>
                  <div className="flex gap-1.5 items-center">
                    {projects.map((_, i) => (
                      <button key={i} onClick={() => setProjectIndex(i)}
                        className={`rounded-full transition-all duration-300 ${i === projectIndex ? 'bg-white w-5 h-1.5' : 'bg-zinc-700 w-1.5 h-1.5 hover:bg-zinc-500'}`}
                      />
                    ))}
                  </div>
                  <button onClick={nextProject} className="p-2 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800 transition-all">
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SKILLS ─── */}
        <section id="skills" className="snap-section px-6 py-20 flex items-center justify-center">
          <div className="max-w-5xl mx-auto w-full">
            <SectionLabel n="04" label="Technical Skills" />

            <div className="flex flex-col gap-8">
              {(['languages', 'tools'] as const).map((cat, ci) => {
                const cols = cat === 'languages'
                  ? 'grid-cols-4 sm:grid-cols-6'
                  : 'grid-cols-4 sm:grid-cols-9';
                return (
                  <motion.div
                    key={cat}
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                    viewport={{ once: false, amount: 0.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-xs font-bold tracking-[0.3em] uppercase text-zinc-600 mb-3">
                      {cat === 'languages' ? 'Languages' : 'Tools & Frameworks'}
                    </p>
                    <div className={`grid ${cols} gap-3`}>
                      {skillsData[cat].map((skill, idx) => (
                        <motion.div
                          key={skill.name}
                          initial={{ opacity: 0, y: 14, scale: 0.88 }}
                          whileInView={{ opacity: 1, y: 0, scale: 1 }}
                          viewport={{ once: false, amount: 0.1 }}
                          transition={{ duration: 0.28, delay: ci * 0.08 + idx * 0.045, ease: [0.16, 1, 0.3, 1] }}
                          className="group flex flex-col items-center gap-2.5 p-5 rounded-xl bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-500 hover:bg-zinc-800/60 transition-all duration-200 cursor-default"
                        >
                          {'custom' in skill && skill.custom ? (
                            <Image src={(skill as { src: string }).src} alt={skill.name} width={38} height={38} className="object-contain" />
                          ) : (
                            <i className={`${'icon' in skill ? (skill as { icon: string }).icon : ''} text-[38px] leading-none transition-transform duration-200 group-hover:scale-110`} />
                          )}
                          <span className="text-[11px] font-semibold text-zinc-600 group-hover:text-zinc-300 text-center leading-tight transition-colors">{skill.name}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── CERTIFICATES ─── */}
        <section id="certificates" className="snap-section relative overflow-hidden">
          <div className="absolute inset-0">
            <CertCarousel certs={certificates} />
          </div>
          <div className="absolute top-8 inset-x-0 z-20 pointer-events-none flex justify-center px-6">
            <div className="max-w-5xl w-full">
              <SectionLabel n="05" label="Certificates" />
            </div>
          </div>
        </section>

        {/* ─── CONTACT ─── */}
        <section id="contact" className="snap-section flex flex-col items-center px-8 py-16">

          {/* Main content — flex-1 so it fills remaining height and centers itself */}
          <div className="flex-1 flex flex-col items-center justify-center w-full max-w-xl text-center gap-12">

            {/* Label + headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <SectionLabel n="06" label="Get In Touch" />
              <h2 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-tight mt-2">
                Let's build<br />
                <span className="bg-gradient-to-r from-white via-zinc-300 to-zinc-600 bg-clip-text text-transparent">
                  something great.
                </span>
              </h2>
              <p className="text-zinc-500 text-sm mt-6">
                Open to full-stack roles, freelance, and creative collabs.
              </p>
            </motion.div>

            {/* Email button */}
            <motion.a
              href="mailto:kaelexx12@gmail.com"
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }} transition={{ duration: 0.55, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="group w-full flex items-center justify-center h-14 rounded-2xl border border-zinc-700 hover:border-zinc-400 bg-zinc-900/40 hover:bg-zinc-800 transition-all duration-200 text-base sm:text-lg font-bold text-white"
            >
              kaelexx12@gmail.com
            </motion.a>

            {/* Socials */}
            <div className="flex gap-10 justify-center">
              {[
                { href: 'https://github.com/frnczkyl', icon: <GithubIcon width={22} height={22} />, label: 'GitHub', delay: 0.2 },
                { href: 'https://www.linkedin.com/in/francis-kyle-lorenzana-a94777397/', icon: <LinkedInIcon width={22} height={22} />, label: 'LinkedIn', delay: 0.28 },
                { href: 'https://www.facebook.com/kyle.lorenzana.967522', icon: <FacebookIcon width={22} height={22} />, label: 'Facebook', delay: 0.36 },
              ].map(({ href, icon, label, delay }) => (
                <motion.a
                  key={label} href={href} target="_blank" rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 16, scale: 0.85 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
                  className="group flex flex-col items-center gap-3"
                >
                  <div className="w-16 h-16 rounded-2xl border border-zinc-800 group-hover:border-white group-hover:bg-white flex items-center justify-center text-zinc-500 group-hover:text-black transition-all duration-200">
                    {icon}
                  </div>
                  <span className="text-[10px] tracking-widest text-zinc-600 group-hover:text-zinc-300 transition-colors uppercase">{label}</span>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Copyright — sits naturally at the bottom of the flex column */}
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: false }} transition={{ duration: 0.5, delay: 0.45 }}
            className="text-[11px] text-zinc-700 pt-8"
          >
            © 2025 Francis Kyle Lorenzana · All rights reserved
          </motion.p>
        </section>

      </div>
    </>
  );
}
