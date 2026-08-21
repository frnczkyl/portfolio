'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import FacebookIcon from './components/FacebookIcon';
import GithubIcon from './components/GithubIcon';
import LinkedInIcon from './components/LinkedInIcon';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, ExternalLink, Gamepad2, Heart, BookOpen, Palette, Globe, ArrowUpRight } from 'lucide-react';
import { Reveal, LineReveal, ThemeToggle, useNavWipe, useScrollProgress } from './components/Motion';
import CircuitRail from './components/CircuitRail';
import SkillsGrid, { type SkillItem } from './components/SkillsGrid';
import ScatterText from './components/ScatterText';
import WorkStack, { type WorkItem } from './components/WorkStack';
import ImagePlate from './components/ImagePlate';

type Project = {
  title: string;
  description: string;
  tags: string[];
  image: string;
  link: string;
  projectLink?: string;
};

function getTagIcon(tag: string) {
  const dm: Record<string, string> = {
    'Java': 'devicon-java-plain colored', 'Python': 'devicon-python-plain colored',
    'C#': 'devicon-csharp-plain colored', 'React.js': 'devicon-react-original colored',
    'React': 'devicon-react-original colored', 'Next.js': 'devicon-nextjs-plain text-[var(--foreground)]',
    'Django': 'devicon-django-plain icon-django', 'Android': 'devicon-android-plain colored',
    'Godot': 'devicon-godot-plain colored', 'PostgreSQL': 'devicon-postgresql-plain colored',
    'Tailwind CSS': 'devicon-tailwindcss-plain colored', 'Prisma': 'devicon-prisma-original text-[var(--foreground)]',
    'Docker': 'devicon-docker-plain colored', 'MySQL': 'devicon-mysql-plain colored',
    'TypeScript': 'devicon-typescript-plain colored', 'PostgreSQL + Prisma': 'devicon-postgresql-plain colored',
    'lucide-react': 'devicon-react-original colored', 'Svelte': 'devicon-svelte-plain colored',
    'JavaScript': 'devicon-javascript-plain colored', 'CSS': 'devicon-css3-plain colored',
  };
  if (dm[tag]) return <i className={`${dm[tag]} text-sm leading-none`} />;
  const lm: Record<string, React.ReactElement> = {
    'Game Development': <Gamepad2 className="w-3.5 h-3.5 text-orange-600" />,
    'RPG': <Gamepad2 className="w-3.5 h-3.5 text-amber-600" />,
    'Game Design': <Palette className="w-3.5 h-3.5 text-[var(--muted)]" />,
    'Healthcare': <Heart className="w-3.5 h-3.5 text-pink-600" />,
    'Education': <BookOpen className="w-3.5 h-3.5 text-emerald-700" />,
    'REST API': <Globe className="w-3.5 h-3.5 text-[var(--foreground)]" />,
  };
  if (lm[tag]) return lm[tag];
  if (tag === 'XAMPP') return <Image src="/Xampp.svg" alt="XAMPP" width={14} height={14} className="object-contain" />;
  if (tag === 'Go High Level') return <Image src="/GoHighLevel.svg" alt="Go High Level" width={14} height={14} className="object-contain" />;
  return <span className="text-[8px] font-bold text-[var(--muted)]">{tag.slice(0, 3)}</span>;
}

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [projectIndex, setProjectIndex] = useState(0);
  const [certPage, setCertPage] = useState(0);
  const { play: playWipe, Wipe } = useNavWipe();
  const scrollPct = useScrollProgress();

  const goToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    playWipe(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'auto', block: 'start' });
    });
  };

  const projects: Project[] = [
    { title: 'Ruined Light', description: 'A game developed using only Java alone. An RPG where you defeat each level to reach the boss. Features different playable characters and combat mechanics.', tags: ['Java', 'Game Development', 'RPG'], image: '/RuinedLight.png', link: 'https://github.com/frnczkyl/Ruined_Light_OOP1_PROJECT' },
    { title: 'ChipIn', description: 'Collaborative expense tracking platform with expense input system, participant management, and automated cost-splitting calculations for group events.', tags: ['Java', 'React.js', 'Android'], image: '/ChipIn.png', link: 'https://github.com/Jeskunnn/ChipIn', projectLink: 'https://chip-in-phi.vercel.app/' },
    { title: 'Sleepsync', description: 'Full-stack sleep tracking web app with pattern monitoring, personalized relaxation tips, optimal bedtime calculations, and customizable alarm scheduling.', tags: ['Django', 'Python', 'Healthcare'], image: '/SleepSync.png', link: 'https://github.com/ciddysed/IT342_SleepSync', projectLink: 'https://sleepsyncapp.netlify.app' },
    { title: 'Wildlitz', description: 'Grade 3 educational learning platform with interactive activities. Built full-stack modules to enhance student engagement and learning outcomes.', tags: ['Django', 'Python', 'React.js', 'Education'], image: '/WildLitz.png', link: 'https://github.com/Nokitaki/WildLitz-Capstone', projectLink: 'https://wildlitz-capstone-raeg.onrender.com/' },
    { title: 'Russian Roulette', description: 'Turn-based Java game with XAMPP database integration, featuring complete data persistence and game state tracking throughout gameplay sessions.', tags: ['Java', 'XAMPP', 'Game Development'], image: '/RussianRoulette.jpg', link: 'https://github.com/danrave1234/OOP2_FinalProj' },
    { title: 'Identity: Fragments of Me', description: 'Turn-based 2D RPG developed for a GDAP gamified event. Created visual assets and contributed to the main concept and gameplay using Godot Engine.', tags: ['Godot', 'C#', 'Game Design'], image: '/Identity.jpg', link: 'https://github.com/danrave1234/Godot-Project' },
  ];

  const workProjects: WorkItem[] = [
    { title: 'BAI HR System', category: 'Human Resources Platform', description: 'Internal HR management system for BAI Finance Group. Built comprehensive modules for employee records, attendance tracking, and payroll processing using Django REST Framework and React.', link: 'https://www.myteambai.com/', image: '/bai-hr.png', tag: 'LIVE' },
    { title: 'BAI Remittance', category: 'Web App', description: 'Production full-stack remittance web application for cross-border money transfers.', link: 'https://bai-remit-frontend-production.up.railway.app/landingpage', image: '/bai-remit.png', tag: 'LIVE' },
    { title: 'BAI Finance Website', category: 'Corporate Website', description: 'Official corporate website for BAI Finance Group of Companies.', link: 'https://www.baifinance.com.au/', image: '/bai-website.png', tag: 'LIVE' },
    { title: 'BAI Group Landing Page', category: 'Landing Page', description: 'Frontend-only landing page unifying BAI Group\'s eight specialist divisions under one brand, built with Svelte.', link: 'https://bai-group-of-companies-landing-page-fork-deplo-production.up.railway.app/', image: '/Bai Finance LandingPage.png', tag: 'LIVE' },
  ];

  const skillsData: { languages: SkillItem[]; tools: SkillItem[] } = {
    languages: [
      { name: 'Java', icon: 'devicon-java-plain colored' },
      { name: 'Python', icon: 'devicon-python-plain colored' },
      { name: 'C', icon: 'devicon-c-plain colored' },
      { name: 'C++', icon: 'devicon-cplusplus-plain colored' },
      { name: 'C#', icon: 'devicon-csharp-plain colored' },
      { name: 'JavaScript', icon: 'devicon-javascript-plain colored' },
      { name: 'TypeScript', icon: 'devicon-typescript-plain colored' },
      { name: 'HTML', icon: 'devicon-html5-plain colored' },
      { name: 'CSS', icon: 'devicon-css3-plain colored' },
      { name: 'Kotlin', icon: 'devicon-kotlin-plain colored' },
      { name: 'SQL', icon: 'devicon-mysql-plain colored' },
    ],
    tools: [
      { name: 'React.js', icon: 'devicon-react-original colored' },
      { name: 'Next.js', icon: 'devicon-nextjs-plain text-[var(--foreground)]' },
      { name: 'Tailwind CSS', icon: 'devicon-tailwindcss-plain colored' },
      { name: 'Django', icon: 'devicon-django-plain icon-django' },
      { name: 'Node.js', icon: 'devicon-nodejs-plain colored' },
      { name: 'Firebase', icon: 'devicon-firebase-plain colored' },
      { name: 'Supabase', icon: 'devicon-supabase-plain colored' },
      { name: 'XAMPP', custom: true, src: '/Xampp.svg' },
      { name: 'Git', icon: 'devicon-git-plain colored' },
      { name: 'GitHub', icon: 'devicon-github-plain text-[var(--foreground)]' },
      { name: 'AWS', icon: 'devicon-amazonwebservices-plain-wordmark colored' },
      { name: 'Android', icon: 'devicon-android-plain colored' },
      { name: 'Vercel', icon: 'devicon-vercel-plain text-[var(--foreground)]' },
      { name: 'Railway', icon: 'devicon-railway-original text-[var(--foreground)]' },
      { name: 'Godot', icon: 'devicon-godot-plain colored' },
      { name: 'Postman', icon: 'devicon-postman-plain colored' },
      { name: 'Bash', icon: 'devicon-bash-plain colored' },
      { name: 'PowerShell', icon: 'devicon-powershell-plain icon-powershell' },
      { name: 'Prisma', icon: 'devicon-prisma-original text-[var(--foreground)]' },
      { name: 'Go High Level', custom: true, src: '/GoHighLevel.svg' },
      { name: 'Docker', icon: 'devicon-docker-plain colored' },
      { name: 'MySQL', icon: 'devicon-mysql-plain colored' },
      { name: 'PostgreSQL', icon: 'devicon-postgresql-plain colored' },
      { name: 'Svelte', icon: 'devicon-svelte-plain colored' },
      { name: 'Asana', custom: true, src: '/Asana.svg' },
      { name: 'ServiceNow', custom: true, src: '/ServiceNow.svg' },
      { name: 'Claude', custom: true, src: '/Claude.svg' },
      { name: 'Gemini', custom: true, src: '/Gemini.svg' },
    ],
  };

  const certificates = [
    { name: 'Introduction to AI', image: '/Introduction_toAI.png', link: 'https://drive.google.com/file/d/1-nGHVZxzndQp8nj9VNcMkFzKrPfmsqJA/view?usp=sharing' },
    { name: 'Intro to AI Ethics', image: '/Intro to AI Ethics.png', link: 'https://drive.google.com/file/d/1ojS87Ba0QX5PPmeYn1GSqLtoHXU-nACd/view?usp=drive_link' },
    { name: 'AWS Academy Cloud Foundations', image: '/AWS.png', link: 'https://drive.google.com/file/d/1fCfX2trjn4fW2SG6a2I0iA83Xu8QAKrt/view?usp=drive_link' },
    { name: 'AWS Academy Cloud Architecting', image: '/AwsArchitecting.png', link: 'https://drive.google.com/file/d/1hYegeloVsDd1Wd1hA7760M36DuSFxSdt/view?usp=sharing' },
    { name: 'FreeCodeCamp — Front End Dev Libraries', image: '/FreeCodeCamp.png', link: 'https://www.freecodecamp.org/certification/franciskylelorenzana/front-end-development-libraries' },
    { name: 'SQL (Basic) Certificate', image: '/SQL_Certificate.png', link: 'https://drive.google.com/file/d/18JkI21PouW3WoMEgWfv9ebLJIh1JisC3/view?usp=sharing' },
    { name: 'Data Visualization — Kaggle', image: '/Data Visualization.png', link: 'https://drive.google.com/file/d/10JjnTdPeY67tvnqvLvlf4VUpIPViPjgb/view?usp=drive_link' },
    { name: 'Introduction to HTML — Sololearn', image: '/SoloLearn HTML.png', link: 'https://drive.google.com/file/d/1B7jYS0LnZhYkRSqGZPweCBUurowOaFFT/view?usp=drive_link' },
    { name: 'Introduction to JavaScript — Sololearn', image: '/SoloLearn Javascript.png', link: 'https://drive.google.com/file/d/1WtGUzpd1R6GxXitp0CUWcaKQfb30c5PT/view?usp=drive_link' },
    { name: 'DevFest Cebu Workshop', image: '/DevFest.png', link: 'https://drive.google.com/file/d/1o2CQwMvUmWUkuxW4bffvMq5SOnmoCAsN/view?usp=sharing' },
    { name: 'Webinar on IP Rights', image: '/Webinar.png', link: 'https://drive.google.com/file/d/1XOIgO-XjMlA-wylJwX-TfIn6LnetsS8O/view?usp=drive_link' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    }, { threshold: 0.15 });
    ['hero', 'about', 'experience', 'projects', 'skills', 'certificates', 'contact'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const NAV = ['About', 'Experience', 'Projects', 'Skills', 'Certificates'];
  const p = projects[projectIndex];
  // 6 per page splits 11 certificates into two even 2-row pages, and the
  // fillers keep every page the same height so paging never shifts the layout
  const CERTS_PER_PAGE = 6;
  const certPages = Math.ceil(certificates.length / CERTS_PER_PAGE);
  const visibleCerts = certificates.slice(certPage * CERTS_PER_PAGE, certPage * CERTS_PER_PAGE + CERTS_PER_PAGE);
  const certFillers = CERTS_PER_PAGE - visibleCerts.length;

  return (
    <div className="snap-container w-full">

      {Wipe}

      {/* ─── NAV ─── */}
      <nav className="nav-bar sticky top-0 z-50">
        <div className="max-w-6xl mx-auto w-full px-6 sm:px-8 h-16 flex items-center justify-between">
          <a href="#hero" onClick={goToSection('hero')} className="logo-word">kyle</a>

          <div className="hidden md:flex items-center gap-8">
            {NAV.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={goToSection(item.toLowerCase())}
                className={`nav-link text-sm font-medium transition-colors duration-200 ${
                  activeSection === item.toLowerCase() ? 'text-[var(--foreground)]' : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                }`}>
                {item}
                {activeSection === item.toLowerCase() && <span className="dot" />}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <a href="#contact" onClick={goToSection('contact')} className="btn btn-amber btn-sm hidden sm:inline-flex">Contact</a>
            <button className="md:hidden text-[var(--foreground)]" onClick={() => setIsMobileMenuOpen((v) => !v)}>
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* scroll progress rail */}
        <div className="nav-progress" style={{ width: `${scrollPct}%` }} />

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              /* absolute, so opening the menu overlays the page instead of
                 growing the sticky nav and shoving the hero down */
              className="mobile-menu md:hidden absolute left-0 right-0 top-full overflow-hidden border-t border-[var(--border)]"
            >
              <div className="flex flex-col items-center gap-4 py-6">
                {[...NAV, 'Contact'].map((item) => (
                  <a key={item} href={`#${item.toLowerCase()}`} onClick={goToSection(item.toLowerCase())}
                    className="text-sm font-semibold text-[var(--foreground)]">
                    {item}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ─── HERO ─── */}
      <section id="hero" className="hero-full px-6 sm:px-8 pt-16 sm:pt-24 pb-6">
        <div className="flex-1 flex items-center">
          <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-8 md:gap-6 items-end">
            <LineReveal
              lines={['Building web apps,', 'and a bit more.']}
              className="text-[2.6rem] sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05]"
            />

            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col gap-5"
            >
              <p className="text-[var(--muted)] text-base leading-relaxed">
                BSIT Graduate building full-stack products across web, SaaS, and mobile. Real companies, real projects — keep scrolling.
              </p>
              <div className="cta-row flex flex-wrap gap-3">
                <a href="#experience" className="btn btn-amber">View My Work <ArrowUpRight className="w-4 h-4" /></a>
                <a href="/Lorenzana_Resume.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-outline">Download Resume <ArrowUpRight className="w-4 h-4" /></a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* full-bleed: the camera pan reads better edge to edge */}
        <div className="-mx-6 sm:-mx-8">
          <CircuitRail />
        </div>
      </section>

      {/* ─── ABOUT ─── */}
      <section id="about" className="px-6 sm:px-8 py-16 sm:py-20 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-10 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }} transition={{ duration: 0.5 }}
            /* capped so the portrait does not tower over the text column */
            className="w-full max-w-md mx-auto md:mx-0"
          >
            <ImagePlate code="FIG.01" label="Talisay, Cebu">
              <div className="relative" style={{ aspectRatio: '4/5' }}>
                <Image src="/MeMyself.jpg" alt="Francis Kyle Lorenzana" fill className="object-cover object-top" />
              </div>
            </ImagePlate>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }} transition={{ duration: 0.5, delay: 0.08 }}
            className="flex flex-col gap-6"
          >
            <div>
              <span className="tag-pill mb-3 inline-flex">About</span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
                Francis Kyle Lorenzana. <span className="text-[var(--muted)]">Full-stack developer.</span>
              </h2>
            </div>
            <p className="text-[var(--muted)] leading-relaxed">
              BSIT Graduate from Cebu Institute of Technology-University. I build full-stack applications with React, Next.js, and Django. Passionate about clean architecture, thoughtful UI, and shipping products that actually solve problems.
            </p>

            <div className="grid grid-cols-3 gap-4">
              {[['7+', 'Projects'], ['14+', 'Technologies'], ['2026', 'Graduate']].map(([v, l]) => (
                <div key={l} className="border-t border-[var(--border)] pt-3">
                  <p className="text-2xl font-bold">{v}</p>
                  <p className="text-xs text-[var(--muted)] mt-0.5">{l}</p>
                </div>
              ))}
            </div>

            <div className="inline-row flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span className="text-sm text-emerald-700 font-semibold">Available for hire</span>
            </div>

            <div className="inline-row flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--muted)]">
              <span>kaelexx12@gmail.com</span>
              <span>09458924721</span>
              <span>Talisay, Cebu</span>
            </div>

            <div className="inline-row flex items-center gap-3">
              <div className="relative w-9 h-9 flex-shrink-0">
                <div className="absolute inset-0 rounded-lg overflow-hidden"><div className="cit-ring" /></div>
                <div className="absolute inset-[2px] rounded-md bg-[var(--foreground)] flex items-center justify-center overflow-hidden">
                  <Image src="/CITLOGO.png" alt="CIT-U" width={28} height={28} className="w-full h-full object-contain" />
                </div>
              </div>
              <div>
                <p className="text-sm font-bold">Cebu Institute of Technology - U</p>
                <p className="text-xs text-[var(--muted)]">BSIT · Graduated 2026</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── EXPERIENCE ─── */}
      <section id="experience" className="px-6 sm:px-8 py-16 sm:py-20 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto w-full">
          <div className="section-head flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <span className="tag-pill mb-3 inline-flex">Experience</span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
                Real work, <span className="text-[var(--muted)]">real companies.</span>
              </h2>
            </div>
            <p className="text-[var(--muted)] text-sm max-w-xs">Case studies from production work at BAI Finance Group. Click any tile to open it live.</p>
          </div>

          {/* each card pins in turn and the next slides over it */}
          <WorkStack items={workProjects} />

          <p className="text-center text-[var(--muted)] text-sm mt-10 max-w-md mx-auto">
            Plus university projects and personal builds below — scroll for more.
          </p>
        </div>
      </section>

      {/* ─── PROJECTS ─── */}
      <section id="projects" className="px-6 sm:px-8 py-16 sm:py-20 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto w-full">
          <span className="tag-pill mb-3 inline-flex">Projects</span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-10">
            Projects I&apos;ve <span className="text-[var(--muted)]">shipped for school.</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-start">
            <div>
              {projects.map((proj, i) => {
                const active = i === projectIndex;
                return (
                  <div
                    key={proj.title}
                    onClick={() => setProjectIndex(i)}
                    className={`num-row flex items-start gap-4 ${active ? 'is-active' : ''}`}
                  >
                    <span className="idx">{String(i + 1).padStart(2, '0')}</span>
                    <div className="flex-1">
                      <p className="font-bold text-lg">{proj.title}</p>
                      <AnimatePresence>
                        {active && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <p className="text-sm text-[var(--muted)] leading-relaxed mt-2 max-w-md">{proj.description}</p>
                            <div className="tag-row flex flex-wrap gap-2 mt-3">
                              {proj.tags.map((tag) => (
                                <span key={tag} className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                                  {getTagIcon(tag)}<span>{tag}</span>
                                </span>
                              ))}
                            </div>
                            <div className="action-row flex gap-3 mt-4">
                              <a href={proj.link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="btn btn-outline btn-sm">
                                <GithubIcon width={15} height={15} />GitHub
                              </a>
                              {proj.projectLink && (
                                <a href={proj.projectLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="btn btn-amber btn-sm">
                                  <ExternalLink className="w-3.5 h-3.5" />Live Demo
                                </a>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* preview only earns its place beside the list; below lg it is just a
                stacked screenshot, and being display:none keeps it unfetched */}
            <div className="hidden lg:block lg:sticky lg:top-24">
              <ImagePlate code={`PRJ.${String(projectIndex + 1).padStart(2, '0')}`} label={p.title}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={p.image}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                    className="relative"
                    style={{ aspectRatio: '16/11' }}
                  >
                    <Image src={p.image} alt={p.title} fill className="object-cover" />
                  </motion.div>
                </AnimatePresence>
              </ImagePlate>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SKILLS ─── */}
      <section id="skills" className="px-6 sm:px-8 py-16 sm:py-20 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto w-full">
          <span className="tag-pill mb-3 inline-flex">Skills</span>

          {/* letters scatter and reassemble on the way in — this section only */}
          <ScatterText
            as="h2"
            className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-3"
            segments={[
              { text: 'Everything,' },
              { text: ' I build with.', className: 'text-[var(--muted)]' },
            ]}
          />
          {/* body copy scatters per word — per letter reads as noise at this size */}
          <ScatterText
            as="p"
            className="text-[var(--muted)] text-sm mb-8 max-w-md"
            unit="word"
            spread={90}
            tilt={34}
            segments={[{ text: 'Languages I write daily, and the tools and frameworks behind every project above.' }]}
          />

          {/* Both groups are always on show. As tabs they differed by three
              rows, so switching one resized the section under the reader. */}
          <SkillsGrid label="Languages" items={skillsData.languages} />
          <SkillsGrid label={'Tools & Frameworks'} items={skillsData.tools} />
        </div>
      </section>

      {/* ─── CERTIFICATES ─── */}
      <section id="certificates" className="px-6 sm:px-8 py-16 sm:py-20 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto w-full">
          <span className="tag-pill mb-3 inline-flex">Certificates</span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-8">
            Proof I <span className="text-[var(--muted)]">did the work.</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {visibleCerts.map((cert) => (
              <a key={cert.name} href={cert.link} target="_blank" rel="noopener noreferrer" className="shot-tile cert-card flex flex-col">
                {/* viewfinder marks sit over the thumbnail so they cost no space */}
                <div className="cert-shot relative w-full" style={{ aspectRatio: '4/3' }}>
                  <Image src={cert.image} alt={cert.name} fill className="object-cover" />
                  <span className="cert-mark cm-tl" aria-hidden />
                  <span className="cert-mark cm-br" aria-hidden />
                  <span className="cert-scan" aria-hidden />
                </div>
                <div className="p-3">
                  {/* fixed two-line box so every card is the same height */}
                  <p className="text-xs font-semibold leading-snug line-clamp-2 min-h-[2.1rem]">{cert.name}</p>
                  <span className="text-[10px] text-[var(--muted)] font-semibold inline-flex items-center gap-1 mt-1">View <ArrowUpRight className="w-3 h-3" /></span>
                </div>
              </a>
            ))}

            {/* invisible cells so a short last page still fills the grid */}
            {Array.from({ length: certFillers }).map((_, i) => (
              <div key={`cert-filler-${i}`} className="shot-tile invisible flex flex-col" aria-hidden>
                <div className="w-full" style={{ aspectRatio: '4/3' }} />
                <div className="p-3">
                  <p className="text-xs leading-snug min-h-[2.1rem]" />
                  <span className="text-[10px] inline-flex mt-1">&nbsp;</span>
                </div>
              </div>
            ))}
          </div>

          {certPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {Array.from({ length: certPages }).map((_, i) => (
                <button key={i} onClick={() => setCertPage(i)} className={`page-btn ${certPage === i ? 'is-active' : ''}`}>
                  {String(i + 1).padStart(2, '0')}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── CONTACT + FOOTER ─── */}
      <section id="contact" className="px-6 sm:px-8 py-20 sm:py-28 border-t border-[var(--border)] flex flex-col items-center text-center">
        <span className="tag-pill mb-4">Get In Touch</span>
        <h2 className="text-4xl sm:text-6xl font-bold tracking-tight leading-tight max-w-2xl">
          Let&apos;s build <span className="text-[var(--muted)]">something great.</span>
        </h2>
        <p className="text-[var(--muted)] mt-4 max-w-md">Open to full-stack roles, freelance, and creative collabs.</p>
        <a href="mailto:kaelexx12@gmail.com" className="btn btn-amber mt-8">
          kaelexx12@gmail.com <ArrowUpRight className="w-4 h-4" />
        </a>

        <div className="flex gap-4 mt-8">
          {[
            { href: 'https://github.com/frnczkyl', icon: <GithubIcon width={18} height={18} /> },
            { href: 'https://www.linkedin.com/in/francis-kyle-lorenzana-a94777397/', icon: <LinkedInIcon width={18} height={18} /> },
            { href: 'https://www.facebook.com/kyle.lorenzana.967522', icon: <FacebookIcon width={18} height={18} /> },
          ].map(({ href, icon }, i) => (
            <a key={i} href={href} target="_blank" rel="noopener noreferrer"
              className="w-11 h-11 rounded-full border border-[var(--border)] flex items-center justify-center hover:border-[var(--foreground)] transition-colors">
              {icon}
            </a>
          ))}
        </div>
      </section>

      <footer className="corner-frame border-t border-[var(--border)] px-6 sm:px-8 py-12 mt-10">
        <span className="cf-tr" /><span className="cf-br" />
        <div className="max-w-6xl mx-auto w-full grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div>
            <p className="text-xs font-bold tracking-widest text-[var(--muted)] uppercase mb-3">Contact</p>
            <p className="font-semibold">kaelexx12@gmail.com</p>
            <p className="text-[var(--muted)] mt-1">Response within 24 hours</p>
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest text-[var(--muted)] uppercase mb-3">Sitemap</p>
            <div className="flex flex-col gap-1.5">
              {[...NAV, 'Contact'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">{item}</a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest text-[var(--muted)] uppercase mb-3">Elsewhere</p>
            <div className="flex flex-col gap-1.5">
              <a href="https://github.com/frnczkyl" target="_blank" rel="noopener noreferrer" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">GitHub</a>
              <a href="https://www.linkedin.com/in/francis-kyle-lorenzana-a94777397/" target="_blank" rel="noopener noreferrer" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">LinkedIn</a>
              <a href="https://www.facebook.com/kyle.lorenzana.967522" target="_blank" rel="noopener noreferrer" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">Facebook</a>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest text-[var(--muted)] uppercase mb-3">Based In</p>
            <p className="text-[var(--muted)]">Talisay, Cebu</p>
            <p className="text-[var(--muted)]">Full-Stack · BSIT 2026</p>
          </div>
        </div>
        <p className="max-w-6xl mx-auto w-full text-xs text-[var(--muted)] mt-10">© 2025 Francis Kyle Lorenzana — All rights reserved</p>
      </footer>
    </div>
  );
}
