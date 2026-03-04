'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import FacebookIcon from './components/FacebookIcon';
import GithubIcon from './components/GithubIcon';
import LinkedInIcon from './components/LinkedInIcon';

import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';
import { Menu, X, ArrowRight, ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';

type Project = {
  title: string;
  description: string;
  tags: string[];
  image: string;
  link: string;
  projectLink?: string;
  color: string;
};

function ProjectCard({
  project,
  index,
  total,
  activeCard,
  onCardClick,
  isMobile,
}: {
  project: Project;
  index: number;
  total: number;
  activeCard: number;
  onCardClick: (index: number) => void;
  isMobile: boolean;
}) {
  const n = total;
  const raw = index - activeCard;
  const offset = ((raw % n) + n) % n;
  const displayOffset = offset >= Math.ceil(n / 2) ? offset - n : offset;
  const absOffset = Math.abs(displayOffset);
  const isActive = displayOffset === 0;

  const dragX = useMotionValue(0);
  // Skip tilt on mobile — reduces per-frame JS work during drag
  const dragTilt = useTransform(dragX, [-260, 0, 260], isMobile ? [0, 0, 0] : [-14, 0, 14]);
  const dragZIndex = useTransform(dragX, (v) => (Math.abs(v) > 35 ? 0 : n));

  return (
    <motion.div
      animate={{
        rotateZ: isActive ? 0 : displayOffset * 12,
        scale: 1 - absOffset * 0.055,
        opacity: absOffset >= Math.ceil(n / 2) ? 0 : 1 - Math.max(0, absOffset - 1) * 0.18,
      }}
      // Mobile: tween is far cheaper than spring (no iterative physics each frame)
      transition={isMobile
        ? { type: 'tween', duration: 0.18, ease: 'easeOut' }
        : { type: 'spring', stiffness: 300, damping: 30 }}
      drag={isActive ? 'x' : false}
      dragSnapToOrigin
      dragElastic={isMobile ? 0.08 : 0.13}
      dragConstraints={{ left: -320, right: 320 }}
      onDragEnd={(_, info) => {
        const OFFSET = 65;
        const VELOCITY = 350;
        if (info.offset.x < -OFFSET || info.velocity.x < -VELOCITY) {
          dragX.set(0);
          onCardClick((index + 1) % n);
        } else if (info.offset.x > OFFSET || info.velocity.x > VELOCITY) {
          dragX.set(0);
          onCardClick((index - 1 + n) % n);
        }
      }}
      style={{
        position: 'absolute',
        inset: 0,
        cursor: isActive ? 'grab' : 'pointer',
        transformOrigin: 'bottom center',
        x: isActive ? dragX : 0,
        rotate: isActive ? dragTilt : undefined,
        zIndex: isActive ? dragZIndex : n - absOffset,
        willChange: 'transform, opacity',
      }}
      whileDrag={isMobile ? undefined : { cursor: 'grabbing' }}
      onClick={() => !isActive && onCardClick(index)}
      // Skip hover scale on mobile — no hover events anyway, just wastes listeners
      whileHover={(!isActive && !isMobile) ? { scale: 1 - absOffset * 0.055 + 0.025 } : undefined}
    >
      <div
        className={`relative bg-zinc-900 rounded-2xl border h-full flex flex-col overflow-hidden shadow-2xl transition-shadow duration-300 ${
          isActive
            ? 'border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.12)]'
            : 'border-zinc-800'
        }`}
      >
        {/* Colored top accent bar */}
        <div className={`h-1.5 bg-gradient-to-r ${project.color} w-full flex-shrink-0`} />

        {/* Project image */}
        {project.image && (
          <div className="relative flex-shrink-0" style={{ height: isMobile ? '35%' : '42%' }}>
            <Image src={project.image} alt={project.title} layout="fill" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/30 to-transparent" />
            <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-10`} />
          </div>
        )}

        {/* Content */}
        <div className="px-5 pt-4 flex flex-col flex-1 items-center text-center">
          <h3 className="text-lg font-bold text-cyan-400 mb-2 w-full">{project.title}</h3>
          <p className="text-zinc-400 text-xs leading-relaxed mb-3 line-clamp-3 w-full">{project.description}</p>
          <div className="flex flex-wrap gap-1 justify-center">
            {project.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 text-[10px] rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Buttons — circle icons with label below */}
        <div className="flex flex-shrink-0 py-3 justify-center gap-8">
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-14 h-14 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center group-hover:border-violet-500 group-hover:bg-zinc-700 transition-all duration-200">
                <GithubIcon width={26} height={26} className="text-violet-400" />
              </div>
              <span className="text-[11px] text-zinc-400 group-hover:text-zinc-200 transition-colors font-medium">GitHub</span>
            </a>
          )}
          {project.projectLink && (
            <a
              href={project.projectLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center group-hover:shadow-[0_0_18px_rgba(6,182,212,0.5)] transition-all duration-200">
                <ExternalLink className="w-6 h-6 text-white" />
              </div>
              <span className="text-[11px] text-zinc-400 group-hover:text-zinc-200 transition-colors font-medium">Live Demo</span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function StarButton({
  href, onClick, children, small = false, xs = false, stopProp = false, target,
}: {
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  small?: boolean;
  xs?: boolean;
  stopProp?: boolean;
  target?: string;
}) {
  const cls = `star-btn${xs ? ' star-btn-xs' : small ? ' star-btn-sm' : ''}`;
  const handleClick = stopProp
    ? (e: React.MouseEvent) => { e.stopPropagation(); onClick?.(e); }
    : onClick;
  const inner = (
    <>
      <strong>{children}</strong>
      <div className="star-btn-stars-wrap"><div className="star-btn-stars" /></div>
      <div className="star-btn-glow"><div className="star-btn-circle" /><div className="star-btn-circle" /></div>
    </>
  );
  if (href) {
    return <a href={href} target={target} rel={target === '_blank' ? 'noopener noreferrer' : undefined} className={cls} onClick={handleClick}>{inner}</a>;
  }
  return <div className={cls} role="button" onClick={handleClick}>{inner}</div>;
}

export default function Portfolio() {
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [skillsPage, setSkillsPage] = useState('languages');
  const [pressedButton, setPressedButton] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeCard, setActiveCard] = useState(0);
  const [isSchoolImageHovered, setIsSchoolImageHovered] = useState(false);
  const [isProfileImageHovered, setIsProfileImageHovered] = useState(false);
  const [isExperienceFlipped, setIsExperienceFlipped] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const projects = [
    {
      title: "Ruined Light",
      description: "A game developed using only Java alone. This is an RPG game where you have to defeat each level to reach the boss level. It also has different characters.",
      tags: ["Java", "Game Development", "RPG"],
      image: "/RuinedLight.png",
      link: "https://github.com/frnczkyl/Ruined_Light_OOP1_PROJECT",
      color: "from-gray-400 to-gray-600"
    },
    {
      title: "ChipIn",
      description: "Collaborative expense tracking platform with expense input system, participant management, and automated cost-splitting calculations. Clean, user-friendly interface for group events.",
      tags: ["Java", "React.js", "Android"],
      image: "/ChipIn.png",
      link: "https://github.com/Jeskunnn/ChipIn",
      projectLink: "https://chip-in-phi.vercel.app/",
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Sleepsync",
      description: "Full-stack sleep tracking web application with pattern monitoring, personalized relaxation tips, optimal bedtime calculations, and customizable alarm scheduling.",
      tags: ["Django", "Python", "Healthcare"],
      image: "/SleepSync.png",
      link: "https://github.com/ciddysed/IT342_SleepSync",
      projectLink: "https://sleepsyncapp.netlify.app",
      color: "from-purple-500 to-pink-600"
    },
    {
      title: "Wildlitz",
      description: "Grade 3 learning platform with interactive educational activities. Full-stack development for assigned modules to enhance student engagement.",
      tags: ["Django", "Python", "React.js", "Education"],
      image: "/WildLitz.png",
      link: "https://github.com/Nokitaki/WildLitz-Capstone",
      projectLink: "https://wildlitz-capstone-raeg.onrender.com/",
      color: "from-green-500 to-teal-600"
    },
    {
      title: "Russian Roulette",
      description: "Turn-based Java game with XAMPP database management, featuring data persistence and game state tracking throughout gameplay.",
      tags: ["Java", "XAMPP", "Game Development"],
      image: "/RussianRoulette.jpg",
      link: "https://github.com/danrave1234/OOP2_FinalProj",
      color: "from-red-500 to-rose-600"
    },
    {
      title: "Identity: Fragments of Me",
      description: "Turn-based 2D game developed for GDAP gamified event. Created visual assets and contributed to main concept using Godot IDE.",
      tags: ["Godot", "C#", "Game Design"],
      image: "/Identity.jpg",
      link: "https://github.com/danrave1234/Godot-Project",
      color: "from-indigo-500 to-purple-600"
    }
  ];


  useEffect(() => {
    setMounted(true);

    const observerOptions = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => new Set(prev).add(entry.target.id));
          setActiveSection(entry.target.id);
        } else {
          setVisibleSections(prev => {
            const newSet = new Set(prev);
            newSet.delete(entry.target.id);
            return newSet;
          });
        }
      });
    }, observerOptions);

    const sections = ['hero', 'about', 'projects', 'skills', 'education', 'experience', 'certificates', 'contact'];
    sections.forEach(sectionId => {
      const element = document.getElementById(sectionId);
      if (element) observer.observe(element);
    });

    const typingInterval = setInterval(() => {
      const line1 = document.querySelector('.line1');
      const line2 = document.querySelector('.line2');
      if (line1 && line2) {
        line1.classList.remove('typing-animation');
        line2.classList.remove('typing-animation');
        setTimeout(() => {
          line1.classList.add('typing-animation');
          line2.classList.add('typing-animation');
        }, 100);
      }
    }, 13500);

    return () => {
      observer.disconnect();
      clearInterval(typingInterval);
    };
  }, []);

  const skillsData = {
    languages: [
      { name: "Java", icon: "devicon-java-plain" },
      { name: "Python", icon: "devicon-python-plain" },
      { name: "C#", icon: "devicon-csharp-plain" },
      { name: "JavaScript", icon: "devicon-javascript-plain" },
      { name: "HTML", icon: "devicon-html5-plain" },
      { name: "CSS", icon: "devicon-css3-plain" },
      { name: "Kotlin", icon: "devicon-kotlin-plain" },
      { name: "SQL (MySQL)", icon: "devicon-mysql-plain" }
    ],
    tools: [
      { name: "React.js", icon: "devicon-react-original" },
      { name: "Next.js", icon: "devicon-nextjs-original-wordmark" },
      { name: "Tailwind CSS", icon: "devicon-tailwindcss-plain" },
      { name: "Django", icon: "devicon-django-plain" },
      { name: "Node.js", icon: "devicon-nodejs-plain" },
      { name: "MySQL", icon: "devicon-mysql-plain" },
      { name: "Firebase", icon: "devicon-firebase-plain" },
      { name: "Supabase", icon: "devicon-supabase-plain" },
      { name: "XAMPP", custom: true, src: "/Xampp.svg" },
      { name: "Git", icon: "devicon-git-plain" },
      { name: "GitHub", icon: "devicon-github-plain" },
      { name: "AWS", icon: "devicon-amazonwebservices-plain-wordmark" },
      { name: "Godot IDE", icon: "devicon-godot-plain" },
      { name: "Android", icon: "devicon-android-plain" }
    ]
  };


  const education = [
    {
      school: "Cebu Institute of Technology-University",
      year: "Graduated 2025",
      description: "Completed a Bachelor of Science in Information Technology, building strong skills in programming, software development, database management, and IT systems. Gained hands-on experience through various academic projects, applying technical concepts to real-world scenarios and strengthening problem-solving and analytical abilities. Proficient in both frontend and backend technologies with a focus on full-stack web development.",
      image: "/GLE-Building.jpg",
      logo: "/CITLOGO.png"
    }
  ];

  const certificates1 = [
    { 
      name: "FreeCodeCamp - Front End Development Libraries V8", 
      image: "/FreeCodeCamp.png",
      link: "https://www.freecodecamp.org/certification/franciskylelorenzana/front-end-development-libraries",
      status: "completed"
    },
    { 
      name: "AWS Academy Cloud Foundations", 
      image: "/AWS.png",
      link: "https://drive.google.com/file/d/1fCfX2trjn4fW2SG6a2I0iA83Xu8QAKrt/view?usp=drive_link",
      status: "completed"
    },
    { 
      name: "Data Visualization — Kaggle", 
      image: "/Data Visualization.png",
      link: "https://drive.google.com/file/d/10JjnTdPeY67tvnqvLvlf4VUpIPViPjgb/view?usp=drive_link",
      status: "completed"
    },
    { 
      name: "Webinar on Intellectual Property Rights for CCS", 
      image: "/Webinar.png",
      link: "https://drive.google.com/file/d/1XOIgO-XjMlA-wylJwX-TfIn6LnetsS8O/view?usp=drive_link",
      status: "completed"
    },
    { 
      name: "Introduction to HTML — Sololearn", 
      image: "/SoloLearn HTML.png",
      link: "https://drive.google.com/file/d/1B7jYS0LnZhYkRSqGZPweCBUurowOaFFT/view?usp=drive_link",
      status: "completed"
    },
    { 
      name: "Introduction to JavaScript — Sololearn", 
      image: "/SoloLearn Javascript.png",
      link: "https://drive.google.com/file/d/1WtGUzpd1R6GxXitp0CUWcaKQfb30c5PT/view?usp=drive_link",
      status: "completed"
    },
    {
      name: "AWS Academy Cloud Architecting",
      image: "/AwsArchitecting.png",
      link: "https://drive.google.com/file/d/1hYegeloVsDd1Wd1hA7760M36DuSFxSdt/view?usp=sharing",
      status: "completed"
    },
    {
      name: "DevFest Cebu Workshop — Google Developers Cebu",
      image: "/DevFest.png",
      link: "https://drive.google.com/file/d/1o2CQwMvUmWUkuxW4bffvMq5SOnmoCAsN/view?usp=sharing",
      status: "completed"
    }
  ];

  const certificates2 = [
    {
      name: "SQL(Basic) Certificate",
      image: "/SQL_Certificate.png",
      link: "https://drive.google.com/file/d/18JkI21PouW3WoMEgWfv9ebLJIh1JisC3/view?usp=sharing",
      status: "completed"
    },
    {
      name: "Introduction to AI",
      image: "/Introduction_toAI.png",
      link: "https://drive.google.com/file/d/1-nGHVZxzndQp8nj9VNcMkFzKrPfmsqJA/view?usp=sharing",
      status: "completed"
    },
    {
      name: "Coming Soon",
      image: "",
      link: "",
      status: "coming_soon"
    },
    {
      name: "Coming Soon",
      image: "",
      link: "",
      status: "coming_soon"
    },
    {
      name: "Coming Soon",
      image: "",
      link: "",
      status: "coming_soon"
    },
    {
      name: "Coming Soon",
      image: "",
      link: "",
      status: "coming_soon"
    },
    {
      name: "Coming Soon",
      image: "",
      link: "",
      status: "coming_soon"
    },
    {
      name: "Coming Soon",
      image: "",
      link: "",
      status: "coming_soon"
    }
  ];
  
  const [certificatePage, setCertificatePage] = useState('page1');

  return (
    <div className="snap-container text-zinc-50 w-full">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800 w-full">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center w-full">
          <div className={'text-2xl font-bold tracking-tight transition-all duration-700 flex items-center gap-2 ' + (mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4')}>
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Kyle's Portfolio</span>
            <Image src="/Giphy.gif" alt="Pixelated Icon" width={isMobile ? 24 : 48} height={isMobile ? 24 : 48} />
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium transition-all duration-700 delay-200">
            {['About', 'Projects', 'Skills', 'Education', 'Experience', 'Certificates', 'Contact'].map((item) => (
              <a
                key={item}
                href={'#' + item.toLowerCase()}
                className={'hover:text-cyan-400 transition-colors relative group ' + (activeSection === item.toLowerCase() ? 'text-cyan-400' : '')}
              >
                {item}
                <span className={'absolute -bottom-1 left-0 h-0.5 bg-cyan-400 transition-all duration-300 ' + (activeSection === item.toLowerCase() ? 'w-full' : 'w-0 group-hover:w-full')}></span>
              </a>
            ))}
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden bg-zinc-950/80 backdrop-blur-xl">
            <div className="flex flex-col items-center gap-4 py-4">
              {['About', 'Projects', 'Skills', 'Education', 'Experience', 'Certificates', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={'#' + item.toLowerCase()}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={'hover:text-cyan-400 transition-colors ' + (activeSection === item.toLowerCase() ? 'text-cyan-400' : '')}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      <section id="hero" className="snap-section flex items-center justify-center relative overflow-hidden px-6">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#111111_1px,transparent_1px),linear-gradient(to_bottom,#111111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="typing-container">
            <h1 className={'text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tighter ' + (visibleSections.has('hero') ? 'fade-in-up' : 'opacity-0')} style={{ animationDelay: '0.2s' }}>
              <div className="typing-animation line1">
                <span className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
                  FRANCIS KYLE
                </span>
              </div>
              <div className="typing-animation line2">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  LORENZANA
                </span>
              </div>
            </h1>
          </div>
          
          <div className="text-center">
            <p className={'text-lg sm:text-xl md:text-2xl text-zinc-400 mb-12 ' + (visibleSections.has('hero') ? 'fade-in-up' : 'opacity-0')} style={{ animationDelay: '0.4s' }}>
              Full-Stack Developer
            </p>
          </div>

          <div className="h-24"></div>
          
          <div className={'flex flex-col sm:flex-row gap-6 justify-center items-center ' + (visibleSections.has('hero') ? 'fade-in-up' : 'opacity-0')} style={{ animationDelay: '0.6s' }}>
            <StarButton href="#projects">VIEW MY WORK</StarButton>
            <StarButton href="#contact">GET IN TOUCH</StarButton>
          </div>
        </div>

        <div className={'absolute bottom-12 left-1/2 -translate-x-1/2 ' + (visibleSections.has('hero') ? 'fade-in-up' : 'opacity-0')} style={{ animationDelay: '1s' }}>
          <div className="w-6 h-10 border-2 border-zinc-700 rounded-full flex justify-center p-2">
            <div className="w-1 h-3 bg-cyan-400 rounded-full animate-bounce"></div>
          </div>
        </div>
      </section>

      <section id="about" className="snap-section relative px-6 py-16">
        <div className="max-w-6xl mx-auto">

          {/* Section label + heading */}
          <div className={visibleSections.has('about') ? 'fade-in-up' : 'opacity-0'}>
            <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-2">Who I Am</p>
            <h2 className="text-3xl sm:text-4xl font-black mb-6 tracking-tight">
              About <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Me</span>
            </h2>
          </div>

          {/* Bento Grid — cards flip in one by one when section enters viewport */}
          <div className="about-bento grid grid-cols-2 gap-3">

            {/* Profile photo */}
            <motion.div
              className="bento-photo col-span-2 relative rounded-2xl overflow-hidden border border-zinc-800 h-48"
              initial={{ rotateY: 90, opacity: 0 }}
              animate={visibleSections.has('about') ? { rotateY: 0, opacity: 1 } : { rotateY: 90, opacity: 0 }}
              transition={visibleSections.has('about') ? { delay: 0, duration: 0.5, type: 'spring', stiffness: 180, damping: 22 } : { duration: 0 }}
              style={{ transformPerspective: 1000 }}
            >
              <Image src="/MeMyself.jpg" alt="Francis Kyle Lorenzana" fill className="object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <p className="text-white text-sm font-bold">Francis Kyle Lorenzana</p>
                <p className="text-cyan-400 text-xs">Full-Stack Dev</p>
              </div>
            </motion.div>

            {/* Bio card */}
            <motion.div
              className="col-span-2 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex items-center justify-center"
              initial={{ rotateY: 90, opacity: 0 }}
              animate={visibleSections.has('about') ? { rotateY: 0, opacity: 1 } : { rotateY: 90, opacity: 0 }}
              transition={visibleSections.has('about') ? { delay: 0.1, duration: 0.5, type: 'spring', stiffness: 180, damping: 22 } : { duration: 0 }}
              style={{ transformPerspective: 1000 }}
            >
              <p className="text-zinc-400 text-xs leading-relaxed text-center">
                BSIT Graduate specializing in full-stack development. Experienced with React, Next.js, and Django. Passionate about building functional, user-friendly digital experiences.
              </p>
            </motion.div>

            {/* Projects stat */}
            <motion.div
              className="col-span-1 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center gap-1"
              initial={{ rotateY: 90, opacity: 0 }}
              animate={visibleSections.has('about') ? { rotateY: 0, opacity: 1 } : { rotateY: 90, opacity: 0 }}
              transition={visibleSections.has('about') ? { delay: 0.2, duration: 0.5, type: 'spring', stiffness: 180, damping: 22 } : { duration: 0 }}
              style={{ transformPerspective: 1000 }}
            >
              <p className="text-4xl font-black text-cyan-400">6+</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Projects</p>
            </motion.div>

            {/* Technologies stat */}
            <motion.div
              className="col-span-1 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center gap-1"
              initial={{ rotateY: 90, opacity: 0 }}
              animate={visibleSections.has('about') ? { rotateY: 0, opacity: 1 } : { rotateY: 90, opacity: 0 }}
              transition={visibleSections.has('about') ? { delay: 0.3, duration: 0.5, type: 'spring', stiffness: 180, damping: 22 } : { duration: 0 }}
              style={{ transformPerspective: 1000 }}
            >
              <p className="text-4xl font-black text-blue-400">14+</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Technologies</p>
            </motion.div>

            {/* OJT badge */}
            <motion.div
              className="col-span-1 bg-green-500/10 border border-green-500/30 rounded-2xl p-4 flex flex-col items-center justify-center gap-1"
              initial={{ rotateY: 90, opacity: 0 }}
              animate={visibleSections.has('about') ? { rotateY: 0, opacity: 1 } : { rotateY: 90, opacity: 0 }}
              transition={visibleSections.has('about') ? { delay: 0.4, duration: 0.5, type: 'spring', stiffness: 180, damping: 22 } : { duration: 0 }}
              style={{ transformPerspective: 1000 }}
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <p className="text-xl font-black text-green-400">Hire Me</p>
              <p className="text-[10px] text-zinc-400">Available Now</p>
            </motion.div>

            {/* Year / School */}
            <motion.div
              className="col-span-1 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center gap-1"
              initial={{ rotateY: 90, opacity: 0 }}
              animate={visibleSections.has('about') ? { rotateY: 0, opacity: 1 } : { rotateY: 90, opacity: 0 }}
              transition={visibleSections.has('about') ? { delay: 0.5, duration: 0.5, type: 'spring', stiffness: 180, damping: 22 } : { duration: 0 }}
              style={{ transformPerspective: 1000 }}
            >
              <p className="text-xl font-black text-purple-400">Graduate</p>
              <p className="text-[10px] text-zinc-500">BSIT · CIT-U</p>
            </motion.div>

            {/* Email */}
            <motion.div
              className="col-span-1 md:col-span-2 aspect-square md:aspect-auto bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center gap-2"
              initial={{ rotateY: 90, opacity: 0 }}
              animate={visibleSections.has('about') ? { rotateY: 0, opacity: 1 } : { rotateY: 90, opacity: 0 }}
              transition={visibleSections.has('about') ? { delay: 0.6, duration: 0.5, type: 'spring', stiffness: 180, damping: 22 } : { duration: 0 }}
              style={{ transformPerspective: 1000 }}
            >
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-zinc-500">Email</p>
                <p className="text-xs text-zinc-200 font-medium">kaelexx12@gmail.com</p>
              </div>
            </motion.div>

            {/* Phone */}
            <motion.div
              className="col-span-1 md:col-span-2 aspect-square md:aspect-auto bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center gap-2"
              initial={{ rotateY: 90, opacity: 0 }}
              animate={visibleSections.has('about') ? { rotateY: 0, opacity: 1 } : { rotateY: 90, opacity: 0 }}
              transition={visibleSections.has('about') ? { delay: 0.7, duration: 0.5, type: 'spring', stiffness: 180, damping: 22 } : { duration: 0 }}
              style={{ transformPerspective: 1000 }}
            >
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-zinc-500">Phone</p>
                <p className="text-xs text-zinc-200 font-medium">09458924721</p>
              </div>
            </motion.div>

            {/* Location */}
            <motion.div
              className="bento-location col-span-2 h-16 md:h-auto bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex items-center justify-center gap-3"
              initial={{ rotateY: 90, opacity: 0 }}
              animate={visibleSections.has('about') ? { rotateY: 0, opacity: 1 } : { rotateY: 90, opacity: 0 }}
              transition={visibleSections.has('about') ? { delay: 0.8, duration: 0.5, type: 'spring', stiffness: 180, damping: 22 } : { duration: 0 }}
              style={{ transformPerspective: 1000 }}
            >
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-zinc-500">Location</p>
                <p className="text-xs text-zinc-200 font-medium">Talisay, Cebu</p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <section id="projects" className="snap-section px-6 bg-zinc-900/50 flex flex-col items-center justify-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(6,182,212,0.06)_0%,transparent_65%)] pointer-events-none" />

        <div className={`text-center mb-8 relative z-10 ${visibleSections.has('projects') ? 'fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            Featured <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Projects</span>
          </h2>
          <p className="text-zinc-500 text-xs mt-2 tracking-widest uppercase font-medium">{isMobile ? 'Swipe or tap to browse' : 'Click cards to browse'}</p>
        </div>

        <div
          className="relative z-10"
          style={{ width: isMobile ? '82vw' : '360px', height: isMobile ? '56vh' : '460px' }}
        >
          {projects.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={index}
              total={projects.length}
              activeCard={activeCard}
              onCardClick={setActiveCard}
              isMobile={isMobile}
            />
          ))}
        </div>

        <div className="mt-8 flex items-center gap-5 relative z-10">
          <button
            onClick={() => setActiveCard(prev => (prev - 1 + projects.length) % projects.length)}
            className="p-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-cyan-500/50 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
          </button>
          <div className="flex gap-2 items-center">
            {projects.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveCard(i)}
                className={`rounded-full transition-all duration-300 ${activeCard === i ? 'bg-cyan-400 w-6 h-2' : 'bg-zinc-700 w-2 h-2 hover:bg-zinc-500'}`}
              />
            ))}
          </div>
          <button
            onClick={() => setActiveCard(prev => (prev + 1) % projects.length)}
            className="p-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-cyan-500/50 transition-all duration-300"
          >
            <ArrowRight className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </section>

      <section id="skills" className="snap-section px-6 flex items-center justify-center">
        <div className="max-w-4xl w-full mx-auto">
          <h2 className={'text-3xl sm:text-4xl md:text-5xl font-black mb-8 tracking-tight text-center ' + (visibleSections.has('skills') ? 'fade-in-up' : 'opacity-0')}>
            Technical <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Skills</span>
          </h2>
          <p className={'text-lg sm:text-xl text-zinc-400 text-center mb-8 ' + (visibleSections.has('skills') ? 'fade-in-up' : 'opacity-0')} style={{ animationDelay: '100ms' }}>
            These are the tools and languages I'm proficient in.
          </p>

          <div className="h-16"></div> {/* Explicit gap between heading and box */}

          <div className={'bg-zinc-900/50 rounded-2xl p-8 border border-zinc-800 transition-all duration-500 w-full ' + (visibleSections.has('skills') ? 'fade-in-up' : 'opacity-0')} style={{ animationDelay: '200ms' }}>
            <div className="flex justify-center mb-8">
              <div className="bg-zinc-800 rounded-full p-1 flex gap-2">
                <button
                  onMouseDown={() => setPressedButton('languages')}
                  onMouseUp={() => setPressedButton(null)}
                  onClick={() => setSkillsPage('languages')}
                  className={`transform px-6 py-2 rounded-full text-sm font-semibold transition-transform duration-200 ease-in-out ${skillsPage === 'languages' ? 'bg-cyan-500 text-white' : 'text-zinc-400 hover:bg-zinc-700'} ${pressedButton === 'languages' ? 'button-pressed' : ''}`}
                >
                  Languages
                </button>
                <button
                  onMouseDown={() => setPressedButton('tools')}
                  onMouseUp={() => setPressedButton(null)}
                  onClick={() => setSkillsPage('tools')}
                  className={`transform px-6 py-2 rounded-full text-sm font-semibold transition-transform duration-200 ease-in-out ${skillsPage === 'tools' ? 'bg-cyan-500 text-white' : 'text-zinc-400 hover:bg-zinc-700'} ${pressedButton === 'tools' ? 'button-pressed' : ''}`}
                >
                  Tools
                </button>
              </div>
            </div>
            
            <div className="h-8"></div> {/* Explicit gap between buttons and logos */}

            <div className="min-h-[300px]">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 text-center h-full items-start">
                {(skillsPage === 'languages' ? skillsData.languages : skillsData.tools).map((skill) => (
                  <div key={skill.name} className="flex flex-col items-center gap-3">
                    {'custom' in skill && skill.custom ? (
                      <Image src={skill.src as string} alt={skill.name} width={48} height={48} />
                    ) : (
                      <i className={`${skill.icon} text-5xl text-zinc-400 group-hover:text-cyan-400 transition-colors`}></i>
                    )}
                    <span className="text-sm text-zinc-400">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="education" className="snap-section px-6 flex items-center justify-center">
                  <div className="max-w-6xl mx-auto w-full">
                  <h2 className={'text-3xl sm:text-4xl md:text-5xl font-black mb-8 tracking-tight text-center ' + (visibleSections.has('education') ? 'fade-in-up' : 'opacity-0')}>
                    My <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Education</span>
                  </h2>
          <div className="h-16"></div> {/* Explicit gap */}

          {education.map((edu) => (
            <div key={edu.school} className={'grid md:grid-cols-2 gap-12 items-center bg-zinc-900/50 rounded-2xl p-8 border border-zinc-800 ' + (visibleSections.has('education') ? 'fade-in-up' : 'opacity-0')} style={{ animationDelay: '200ms' }}>
              {/* Left Column: Image with Hover Effect */}
              <div
                className={"relative group overflow-hidden rounded-xl cursor-pointer" + (isMobile && isSchoolImageHovered ? ' mobile-active' : '')}
                onTouchStart={() => isMobile && setIsSchoolImageHovered(true)}
                onTouchEnd={() => isMobile && setIsSchoolImageHovered(false)}
                onTouchCancel={() => isMobile && setIsSchoolImageHovered(false)}
              >
                <Image
                  src={edu.image}
                  alt={`${edu.school} Campus`}
                  width={700}
                  height={400}
                  className="rounded-xl object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Image
                    src={edu.logo}
                    alt={`${edu.school} Logo`}
                    width={150}
                    height={150}
                    className="transition-all duration-300 transform scale-75 group-hover:scale-100"
                  />
                </div>
              </div>

              {/* Right Column: Description */}
              <div className="space-y-4 text-zinc-400">
                <h3 className="text-2xl sm:text-3xl font-bold text-zinc-50 mb-2">{edu.school}</h3>
                <p className="text-lg text-cyan-400">{edu.year}</p>
                <p className="leading-relaxed">
                  {edu.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="experience" className="snap-section px-6 flex items-center justify-center">
        <div className="max-w-md mx-auto w-full">
          <h2 className={'text-3xl sm:text-4xl md:text-5xl font-black mb-4 tracking-tight text-center ' + (visibleSections.has('experience') ? 'fade-in-up' : 'opacity-0')}>
            Work <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Experience</span>
          </h2>

          <div className="h-10" />

          {/* Flip card — preserve-3d so card never goes invisible */}
          {/* Outer div handles fade-in-up CSS animation only */}
          <div
            className={visibleSections.has('experience') ? 'fade-in-up' : 'opacity-0'}
            style={{ animationDelay: '200ms' }}
          >
          {/* Inner motion.div handles the bounce — no CSS animation conflict */}
          <motion.div
            className="cursor-pointer select-none"
            style={{ perspective: '1200px' }}
            onClick={() => setIsExperienceFlipped(f => !f)}
            animate={!isExperienceFlipped ? { y: [0, -10, 0, -5, 0] } : { y: 0 }}
            transition={!isExperienceFlipped ? {
              duration: 0.7,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatDelay: 2.5,
            } : { duration: 0.3 }}
          >
            <motion.div
              animate={{ rotateY: isExperienceFlipped ? 180 : 0 }}
              transition={{ duration: 0.7, type: 'spring', stiffness: 120, damping: 18 }}
              style={{ transformStyle: 'preserve-3d', position: 'relative', minHeight: '460px' }}
            >
              {/* ── FRONT ── */}
              <div
                style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                className="absolute inset-0 bg-zinc-900/80 border border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-6 p-10"
              >
                {/* Logo */}
                <div className="w-24 h-24 rounded-2xl bg-white flex items-center justify-center p-2 shadow-lg">
                  <Image
                    src="https://bai-remit-frontend-production.up.railway.app/Loading/Bai%20logo.png"
                    alt="BAI Finance Logo"
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>

                {/* Company name */}
                <div className="text-center space-y-1">
                  <h3 className="text-2xl font-black text-zinc-50">BAI Finance</h3>
                  <p className="text-zinc-500 text-sm tracking-wide">Group of Companies</p>
                </div>

                <div className="w-full border-t border-zinc-800" />

                {/* Role */}
                <p className="text-lg font-bold text-cyan-400 tracking-tight">Full Stack Developer</p>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {['Django', 'Python', 'Next.js', 'React', 'REST API', 'PostgreSQL'].map(tag => (
                    <span key={tag} className="px-3 py-1 text-xs rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">{tag}</span>
                  ))}
                </div>

                {/* Flip hint badge */}
                <StarButton small>↻ FLIP ME</StarButton>
              </div>

              {/* ── BACK ── */}
              <div
                style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                className="absolute inset-0 bg-zinc-900/80 border border-zinc-800 rounded-2xl flex flex-col justify-center gap-6 p-10"
              >
                {/* X — absolute top-right of card */}
                <button
                  onClick={(e) => { e.stopPropagation(); setIsExperienceFlipped(false); }}
                  className="absolute top-4 right-4 text-zinc-600 hover:text-zinc-300 transition-colors z-10"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Centered header */}
                <div className="text-center space-y-0.5">
                  <p className="text-base font-bold text-zinc-50">Full Stack Developer</p>
                  <p className="text-cyan-400 text-xs">BAI Finance Group of Companies</p>
                </div>

                <div className="w-full border-t border-zinc-800" />

                {/* Description */}
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Developed and maintained full-stack web applications, building robust backend APIs with Django and Python while delivering responsive, modern frontends using Next.js and React.
                </p>

                {/* Bullet points */}
                <ul className="space-y-3 text-sm text-zinc-400">
                  <li className="flex items-start gap-3"><span className="text-cyan-400 mt-0.5 flex-shrink-0">▹</span> Built RESTful APIs with Django REST Framework for internal finance systems</li>
                  <li className="flex items-start gap-3"><span className="text-cyan-400 mt-0.5 flex-shrink-0">▹</span> Developed dynamic frontends with Next.js for seamless user experiences</li>
                  <li className="flex items-start gap-3"><span className="text-cyan-400 mt-0.5 flex-shrink-0">▹</span> Integrated backend and frontend systems end-to-end in a full-stack workflow</li>
                </ul>

                {/* Live app link */}
                <div className="flex justify-center">
                  <StarButton href="https://bai-remit-frontend-production.up.railway.app/login" target="_blank" stopProp>
                    VIEW LIVE APP
                  </StarButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
          </div>
        </div>
      </section>

      <section id="certificates" className="snap-section px-6 min-h-screen py-20 flex flex-col items-center">
        <div className="max-w-4xl mx-auto w-full">
          <h2 className={'text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-center ' + (visibleSections.has('certificates') ? 'fade-in-up' : 'opacity-0')}>
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Certificates</span>
          </h2>
          <div className="h-8" />
          <div className="min-h-[350px]">
            <AnimatePresence mode="wait">
              {certificatePage === 'page1' && (
                <motion.div
                  key="page1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-4 gap-4"
                >
                  {certificates1.map((cert, index) => (
                    <div
                      key={cert.name + index}
                      className={`bg-zinc-900/50 rounded-2xl p-2 border border-zinc-800 transition-all duration-500 flex flex-col justify-between ${cert.status === 'completed' ? 'hover:border-cyan-500/50' : 'opacity-60'}`}
                    >
                      <div className="flex flex-col justify-between h-full">
                        <div>
                          <div className="relative w-full" style={{ paddingTop: '75%' }}>
                            <div className="absolute top-0 left-0 w-full h-full">
                              <Image src={cert.image} alt={cert.name} layout="fill" className="rounded-md object-contain" />
                            </div>
                          </div>
                          <h3 className="text-sm font-bold mt-2 mb-2 text-zinc-200 text-center truncate">{cert.name}</h3>
                        </div>
                        <div className="flex justify-center mt-1">
                          <StarButton href={cert.link} target="_blank" xs>CREDENTIALS</StarButton>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {certificatePage === 'page2' && (
                <motion.div
                  key="page2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-4 gap-4"
                >
                  {certificates2.map((cert, index) => (
                    <div
                      key={cert.name + index}
                      className={`bg-zinc-900/50 rounded-2xl p-2 border border-zinc-800 transition-all duration-500 flex flex-col justify-between ${cert.status === 'completed' ? 'hover:border-cyan-500/50' : 'opacity-60'}`}
                    >
                      <div className="flex flex-col justify-between h-full">
                        <div>
                          <div className="relative w-full" style={{ paddingTop: '75%' }}>
                            <div className="absolute top-0 left-0 w-full h-full">
                              {cert.status === 'completed' ? (
                                <Image src={cert.image} alt={cert.name} layout="fill" className="rounded-md object-contain" />
                              ) : (
                                <div className="w-full h-full bg-zinc-800 rounded-md flex items-center justify-center">
                                  <p className="text-zinc-500">Coming Soon</p>
                                </div>
                              )}
                            </div>
                          </div>
                          <h3 className="text-sm font-bold mt-2 mb-2 text-zinc-200 text-center truncate">{cert.name}</h3>
                        </div>
                        <div className="flex justify-center mt-1">
                          {cert.status === 'completed' ? (
                            <StarButton href={cert.link} target="_blank" xs>CREDENTIALS</StarButton>
                          ) : (
                            <button disabled className="w-full text-center bg-zinc-800 text-zinc-500 rounded-full font-semibold py-1 px-2 text-xs cursor-not-allowed">
                              Coming Soon
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="h-16" />
          <div className="flex justify-center items-center gap-4">
            <button onClick={() => setCertificatePage('page1')} className={`p-2 rounded-full transition-colors ${certificatePage === 'page1' ? 'bg-cyan-500/50' : 'bg-zinc-800/50 hover:bg-zinc-700/50'}`}>
              <ArrowLeft className="w-6 h-6 text-cyan-400" />
            </button>
            <p className="text-zinc-400 text-sm font-medium">
              {certificatePage === 'page1' ? '1/2' : '2/2'}
            </p>
            <button onClick={() => setCertificatePage('page2')} className={`p-2 rounded-full transition-colors ${certificatePage === 'page2' ? 'bg-cyan-500/50' : 'bg-zinc-800/50 hover:bg-zinc-700/50'}`}>
              <ArrowRight className="w-6 h-6 text-cyan-400" />
            </button>
          </div>
        </div>
      </section>

      <section id="contact" className="snap-section px-6 bg-zinc-900/50 flex items-center justify-center">
        <div className="max-w-4xl mx-auto text-center fade-in-up">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            Let's <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Connect</span>
          </h2>
          <div className="h-16"></div> {/* Explicit gap between heading and description */}
          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto" style={{ animationDelay: '0.2s' }}>
            I'm actively seeking full-stack developer opportunities. Feel free to reach out if you'd like to discuss potential collaborations or just want to connect!
          </p>

          <div className="h-24"></div> {/* Explicit gap between description and icons */}

          <div className="flex justify-center gap-x-16" style={{ animationDelay: '0.4s' }}>
            <a href="https://www.facebook.com/kyle.lorenzana.967522" target="_blank" rel="noopener noreferrer" className="block transform hover:scale-110 transition-transform duration-300 text-blue-600">
              <FacebookIcon />
            </a>
            <a href="https://github.com/frnczkyl" target="_blank" rel="noopener noreferrer" className="block transform hover:scale-110 transition-transform duration-300 text-white">
              <GithubIcon />
            </a>
            <a href="https://www.linkedin.com/in/francis-kyle-lorenzana-a94777397/" target="_blank" rel="noopener noreferrer" className="block transform hover:scale-110 transition-transform duration-300 text-blue-500">
              <LinkedInIcon />
            </a>
          </div>

          <div className="h-24"></div> {/* Explicit gap between icons and copyright */}

          <p className="text-sm text-zinc-500">© 2025 Francis Kyle Lorenzana. All rights reserved.</p>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}