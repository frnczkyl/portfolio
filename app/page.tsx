'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import FacebookIcon from './components/FacebookIcon';
import GithubIcon from './components/GithubIcon';
import LinkedInIcon from './components/LinkedInIcon';

import { useDrag } from '@use-gesture/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Portfolio() {
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [skillsPage, setSkillsPage] = useState('languages');
  const [pressedButton, setPressedButton] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeProjectHoverIndex, setActiveProjectHoverIndex] = useState<number | null>(null);
  const [isSchoolImageHovered, setIsSchoolImageHovered] = useState(false);
  const [isProfileImageHovered, setIsProfileImageHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false); // New state variable

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

  const [currentProject, setCurrentProject] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(384);
  const [dragX, setDragX] = useState(0);

  const bind = useDrag(({ down, movement: [mx], cancel, direction: [dx], velocity: [vx] }) => {
    if (isMobile) {
      setIsDragging(down);
      if (down) {
        setDragX(mx);
      } else {
        setDragX(0);
        const threshold = cardWidth * 0.3; // Lower threshold for easier swipe
        const swipeVelocityThreshold = 0.5; // Velocity threshold for quick flicks
        if (Math.abs(mx) > threshold || Math.abs(vx) > swipeVelocityThreshold) {
          if (mx < 0) { // Swiped left, go to next project
            setCurrentProject(p => Math.min(projects.length - 1, p + 1));
          } else { // Swiped right, go to previous project
            setCurrentProject(p => Math.max(0, p - 1));
          }
        }
      }
    } else {
      // Existing desktop logic (or default behavior)
      if (down) {
        setDragX(mx);
      } else {
        setDragX(0);
        if (Math.abs(mx) > cardWidth / 2) {
          if (mx < 0) {
            setCurrentProject(p => Math.min(projects.length - 1, p + 1));
          } else {
            setCurrentProject(p => Math.max(0, p - 1));
          }
        }
      }
    }
  });
  
  useEffect(() => {
    const calculateCardWidth = () => {
      if (carouselRef.current) {
        // Since the ref is on the container, we find the first card element within it.
        const firstCard = carouselRef.current.querySelector('.flex-shrink-0') as HTMLDivElement;
        if (firstCard) {
          setCardWidth(firstCard.offsetWidth);
        }
      }
    };

    calculateCardWidth();
    window.addEventListener('resize', calculateCardWidth);
    return () => window.removeEventListener('resize', calculateCardWidth);
  }, []);

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

    const sections = ['hero', 'about', 'projects', 'skills', 'education', 'certificates', 'contact'];
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
      year: "2025-2026 present",
      description: "Currently pursuing a Bachelor of Science in Information Technology, developing strong foundational skills in programming, software development, database management, and IT systems. As a student, I have gained hands-on experience through various academic projects, allowing me to apply technical concepts to real-world scenarios and strengthen my problem-solving and analytical abilities. I continue to build my knowledge in both frontend and backend technologies as I work toward completing my degree.",
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
            {['About', 'Projects', 'Skills', 'Education', 'Certificates', 'Contact'].map((item) => (
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
              {['About', 'Projects', 'Skills', 'Education', 'Certificates', 'Contact'].map((item) => (
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
            <a
              href="#projects"
              className={"group flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-semibold shadow-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all duration-300 hover:scale-105"}
              style={isMobile ? {} : { padding: '0.4rem 0.8rem' }}
            >
              <Image
                src="/GithubLogo_black.svg"
                alt="GitHub Logo"
                width={isMobile ? 15 : 20}
                height={isMobile ? 15 : 20}
              />
              <span className="text-xs">View My Work</span>
            </a>
            <a
              href="#contact"
              className={"group flex items-center gap-2 border border-zinc-700 text-white rounded-full font-semibold hover:border-cyan-500 hover:bg-cyan-500/10 transition-all duration-300 hover:scale-105"}
              style={isMobile ? {} : { padding: '0.4rem 0.8rem' }}
            >
              <Image
                src="/EmailIcon.svg"
                alt="Email Icon"
                width={isMobile ? 15 : 20}
                height={isMobile ? 15 : 20}
              />
              <span className="text-xs">Get In Touch</span>
            </a>
          </div>
        </div>

        <div className={'absolute bottom-12 left-1/2 -translate-x-1/2 ' + (visibleSections.has('hero') ? 'fade-in-up' : 'opacity-0')} style={{ animationDelay: '1s' }}>
          <div className="w-6 h-10 border-2 border-zinc-700 rounded-full flex justify-center p-2">
            <div className="w-1 h-3 bg-cyan-400 rounded-full animate-bounce"></div>
          </div>
        </div>
      </section>

      <section id="about" className="snap-section relative px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-16 items-center">
            <div className={'md:col-span-2 ' + (visibleSections.has('about') ? 'fade-in-up' : 'opacity-0')}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 tracking-tight">
                About <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Me</span>
              </h2>
              <div className="space-y-4 text-zinc-400 text-lg leading-relaxed">
                <p>
                  As a 4th-year Software Development student, I specialize in full-stack development, building robust applications from front to back. I have practical experience with technologies like React, Next.js, and Django and a strong passion for creating functional, user-friendly digital experiences. I am actively seeking an OJT opportunity to apply my skills in a professional setting and contribute to real-world projects.
                </p>
              </div>
            </div>

            <div className={'relative flex justify-center items-center ' + (visibleSections.has('about') ? 'fade-in-up' : 'opacity-0')} style={{ animationDelay: '0.2s' }}>
              <div
                className={"profile-image-container w-40 h-40 md:w-60 md:h-60 overflow-hidden rounded-full cursor-pointer" + (isMobile && isProfileImageHovered ? ' mobile-active' : '')}
                onClick={() => isMobile && setIsProfileImageHovered(prev => !prev)}
              >
                <Image
                  src="/MeMyself.jpg"
                  alt="Francis Kyle Lorenzana"
                  width={288}
                  height={288}
                  className="rounded-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="h-20"></div> {/* Spacer div */}

                    <div className={'mt-16 grid sm:grid-cols-2 md:grid-cols-3 gap-8 text-center ' + (visibleSections.has('about') ? 'fade-in-up' : 'opacity-0')} style={{ animationDelay: '0.4s' }}>
                      {/* Email Contact Info */}
                      {isMobile ? (
                        <div className="flex flex-col items-center">
                          <div className="flex items-center" style={{gap: '0.2rem'}}>
                            <svg className="text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width: '10px', height: '10px'}}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm text-zinc-500" style={{fontSize: '0.5rem'}}>Email</span>
                          </div>
                          <span className="text-zinc-200" style={{fontSize: '0.6rem'}}>kaelexx12@gmail.com</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                            <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm text-zinc-500">Email</div>
                            <div className="text-zinc-200">kaelexx12@gmail.com</div>
                          </div>
                        </div>
                      )}
          
                      {/* Phone Contact Info */}
                      {isMobile ? (
                        <div className="flex flex-col items-center">
                          <div className="flex items-center" style={{gap: '0.2rem'}}>
                            <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width: '10px', height: '10px'}}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="text-sm text-zinc-500" style={{fontSize: '0.6rem'}}>Phone</span>
                          </div>
                          <span className="text-zinc-200" style={{fontSize: '0.65rem'}}>09458924721</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                            <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm text-zinc-500">Phone</div>
                            <div className="text-zinc-200">09458924721</div>
                          </div>
                        </div>
                      )}
          
                      {/* Location Contact Info */}
                      {isMobile ? (
                        <div className="flex flex-col items-center">
                          <div className="flex items-center" style={{gap: '0.2rem'}}>
                            <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width: '10px', height: '10px'}}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-sm text-zinc-500" style={{fontSize: '0.6rem'}}>Location</span>
                          </div>
                          <span className="text-zinc-200" style={{fontSize: '0.65rem'}}>Talisay, Cebu</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                            <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm text-zinc-500">Location</div>
                            <div className="text-zinc-200">Talisay, Cebu</div>
                          </div>
                        </div>
                      )}
                    </div>        </div>
      </section>

      <section id="projects" className="snap-section px-6 bg-zinc-900/50 py-20">
        <div className="max-w-7xl mx-auto h-full flex flex-col items-center">
          <div className="h-16"></div>
          <h2 className={'text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-center ' + (visibleSections.has('projects') ? 'fade-in-up' : 'opacity-0')}>
            Featured <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Projects</span>
          </h2>
                    <div className="h-16"></div>
                    <div className="relative w-full flex flex-col items-center">
            {/* Carousel container */}
            <div
              ref={carouselRef}
              className="w-full overflow-hidden"
              {...bind()}
            >
              <div
                className={`flex items-center gap-x-2 md:gap-x-8 ${isDragging ? '' : 'transition-transform duration-500 ease-in-out'}`}
                style={{
                  transform: `translateX(calc(50% - (${currentProject * (cardWidth + (isMobile ? 8 : 32))}px + ${cardWidth / 2}px) + ${dragX}px))`,
                  touchAction: 'pan-y'
                }}
              >
                {projects.map((project, index) => (
                  <div
                    key={project.title}
                    className={"flex-shrink-0 w-full sm:w-11/12 md:w-96 cursor-pointer" + (isMobile && activeProjectHoverIndex === index ? ' mobile-active' : '')}
                    onClick={() => {
                      if (!isMobile) { // Only for desktop, handle carousel navigation
                        setCurrentProject(index);
                      }
                    }}
                    style={{
                      transform: `scale(${currentProject === index ? 1 : 0.8})`,
                      opacity: currentProject === index ? 1 : 0.5,
                      transition: 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out',
                    }}
                  >
                    <div
                      className={'relative bg-zinc-900 rounded-2xl p-6 border border-zinc-800 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] w-full'}
                    >
                      <div className={'absolute inset-0 bg-gradient-to-br ' + project.color + ' opacity-0 transition-opacity duration-500'}></div>
                      
                      <div className="relative z-10 flex flex-col">
                        {project.image && (
                                                      <div
                                                        className="w-full h-48 relative hover:overflow-visible cursor-pointer hover:scale-105 transition-transform duration-300 hover:shadow-lg hover:shadow-cyan-500/50 z-10"                            onTouchStart={() => isMobile && setActiveProjectHoverIndex(index)}
                            onTouchEnd={() => isMobile && setActiveProjectHoverIndex(null)}
                            onTouchCancel={() => isMobile && setActiveProjectHoverIndex(null)}
                          >
                            <Image
                              src={project.image}
                              alt={project.title}
                              layout="fill"
                              className="rounded-t-2xl object-cover"
                            />
                          </div>
                        )}
                        <h3 className="text-2xl font-bold mt-8 mb-3 transition-colors text-cyan-400">
                          {project.title}
                        </h3>
                        <div>
                          <p className="text-zinc-400 mb-8 leading-relaxed">
                            {project.description}
                          </p>
                        </div>
                        <div className="h-8"></div>
                        <div>
                          <div className="flex justify-center gap-4">
                            {project.link && (
                              <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-semibold hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300 hover:scale-105 inline-flex items-center gap-2 justify-center"
                                style={{ padding: '0.4rem 0.8rem' }}
                              >
                                <Image
                                  src="/GithubLogo.png"
                                  alt="GitHub Logo"
                                  width={isMobile ? 15 : 20}
                                  height={isMobile ? 15 : 20}
                                />
                                <span className="text-xs">View Proof</span>
                              </a>
                            )}
                            {project.projectLink && (
                              <a
                                href={project.projectLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-semibold hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300 hover:scale-105 inline-flex items-center gap-2 justify-center"
                                style={{ padding: '0.4rem 0.8rem' }}
                              >
                                <Image
                                  src="/Books.png"
                                  alt="Book Icon"
                                  width={isMobile ? 15 : 20}
                                  height={isMobile ? 15 : 20}
                                />
                                <span className="text-xs">View Project</span>
                              </a>
                            )}
                          </div>
                        </div>
                        <div className="h-8"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-16"></div>

            {/* Navigation Dots */}
            <div className="flex gap-4">
              {projects.map((_, index) => (
                <div
                  key={index}
                  className={'cursor-pointer w-2 h-2 rounded-full transition-all duration-300 ' + (currentProject === index ? 'bg-cyan-500 scale-125' : 'bg-zinc-700')}
                  onClick={() => setCurrentProject(index)}
                ></div>
              ))}
            </div>
            <div className="h-16"></div>
          </div>
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

      <section id="certificates" className="snap-section px-6 min-h-screen py-20 flex flex-col items-center">
        <div className="max-w-4xl mx-auto w-full">
          <h2 className={'text-3xl sm:text-4xl md:text-5xl font-black mb-8 tracking-tight text-center ' + (visibleSections.has('certificates') ? 'fade-in-up' : 'opacity-0')}>
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Certificates</span>
          </h2>
          <div className="min-h-[350px] mb-8">
            <AnimatePresence mode="wait">
              {certificatePage === 'page1' && (
                <motion.div
                  key="page1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
                >
                  {certificates1.map((cert, index) => (
                    <div
                      key={cert.name + index}
                      className={`bg-zinc-900/50 rounded-2xl p-2 border border-zinc-800 transition-all duration-500 flex flex-col justify-between ${cert.status === 'completed' ? 'hover:border-cyan-500/50' : 'opacity-60'}`}
                    >
                      <div className="flex flex-col justify-between h-full">
                        <div>
                          <Image src={cert.image} alt={cert.name} width={120} height={80} className="rounded-md mb-2 w-full object-cover mx-auto" />
                          <h3 className="text-sm font-bold mb-2 text-zinc-200 text-center">{cert.name}</h3>
                        </div>
                        <div>
                          <a href={cert.link} target="_blank" rel="noopener noreferrer" className="inline-block w-full text-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-semibold py-1 px-2 text-xs transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/50">
                            Show Credentials
                          </a>
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
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
                >
                  {certificates2.map((cert, index) => (
                    <div
                      key={cert.name + index}
                      className={`bg-zinc-900/50 rounded-2xl p-2 border border-zinc-800 transition-all duration-500 flex flex-col justify-between ${cert.status === 'completed' ? 'hover:border-cyan-500/50' : 'opacity-60'}`}
                    >
                      <div className="flex flex-col justify-between h-full">
                        <div>
                          {cert.status === 'completed' ? (
                            <Image src={cert.image} alt={cert.name} width={120} height={80} className="rounded-md mb-2 w-full object-cover mx-auto" />
                          ) : (
                            <div className="w-full h-[80px] bg-zinc-800 rounded-md mb-2 flex items-center justify-center mx-auto">
                              <p className="text-zinc-500">Coming Soon</p>
                            </div>
                          )}
                          <h3 className="text-sm font-bold mb-2 text-zinc-200 text-center">{cert.name}</h3>
                        </div>
                        <div>
                          {cert.status === 'completed' ? (
                            <a href={cert.link} target="_blank" rel="noopener noreferrer" className="inline-block w-full text-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-semibold py-1 px-2 text-xs transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/50">
                              Show Credentials
                            </a>
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
          <div className="flex justify-center items-center mt-12 gap-4">
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
        <div className={'max-w-4xl mx-auto text-center ' + (visibleSections.has('contact') ? 'fade-in-up' : 'opacity-0')}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            Let's <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Connect</span>
          </h2>
          <div className="h-16"></div> {/* Explicit gap between heading and description */}
          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto" style={{ animationDelay: '0.2s' }}>
            I'm actively seeking OJT opportunities. Feel free to reach out if you'd like to discuss potential collaborations or just want to connect!
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