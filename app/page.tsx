'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

export default function Portfolio() {
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

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

  useEffect(() => {
    if (carouselRef.current) {
      const cardWidth = 384; // w-96
      const margin = 16; // mx-4
      const scrollTo = currentProject * (cardWidth + margin * 2) + cardWidth / 2 - carouselRef.current.offsetWidth / 2;
      carouselRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth',
      });
    }
  }, [currentProject]);

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

  const skills = [
    {
      category: "Frontend Development",
      items: ["React.js", "Next.js", "Tailwind CSS", "Responsive Design"]
    },
    {
      category: "Backend Development",
      items: ["Django Python", "Java", "Node.js", "RESTful APIs"]
    },
    {
      category: "Database Management",
      items: ["MySQL", "Firebase", "Supabase", "XAMPP"]
    },
    {
      category: "Full-Stack Development",
      items: ["System Integration", "API Development", "State Management"]
    },
    {
      category: "Tools & Technologies",
      items: ["Git", "AWS", "Godot IDE", "Android Development"]
    }
  ];

  const education = [
    {
      level: "Tertiary",
      school: "CEBU INSTITUTE OF TECHNOLOGY-UNIVERSITY",
      year: "Present",
      program: "Software Development"
    },
    {
      level: "Secondary",
      school: "CEBU INSTITUTE OF TECHNOLOGY-UNIVERSITY",
      year: "2022"
    },
    {
      level: "Primary",
      school: "ST. THOMAS AQUINAS SCHOOL PARDO ANNEX",
      year: "2014"
    }
  ];

  const certificates = [
    "Introduction to JavaScript — Sololearn",
    "Introduction to HTML — Sololearn",
    "AWS Academy Cloud Foundations",
    "AWS Academy Cloud Architecting",
    "Data Visualization — Kaggle",
    "DevFest Cebu Workshop — Google Developers Cebu",
    "Webinar on Intellectual Property Rights for CCS"
  ];

  return (
    <div className="snap-container text-zinc-50 w-full">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800 w-full">

        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center w-full">
          <div className={'text-2xl font-bold tracking-tight transition-all duration-700 flex items-center gap-2 ' + (mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4')}>
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Kyle's Portfolio</span>
            <Image src="/PixelatedIcon.gif" alt="Pixelated Icon" width={48} height={48} />
          </div>
          <div className={'flex gap-8 text-sm font-medium transition-all duration-700 delay-200 ' + (mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4')}>
            {['About', 'Projects', 'Skills', 'Contact'].map((item) => (
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
        </div>
      </nav>

      <section id="hero" className="snap-section flex items-center justify-center relative overflow-hidden px-6">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#111111_1px,transparent_1px),linear-gradient(to_bottom,#111111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="typing-container">
            <h1 className={'text-7xl md:text-9xl font-black mb-6 tracking-tighter ' + (visibleSections.has('hero') ? 'fade-in-up' : 'opacity-0')} style={{ animationDelay: '0.2s' }}>
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
            <p className={'text-xl md:text-2xl text-zinc-400 mb-12 ' + (visibleSections.has('hero') ? 'fade-in-up' : 'opacity-0')} style={{ animationDelay: '0.4s' }}>
              Full-Stack Developer
            </p>
          </div>

          <div className="h-24"></div>
          
          <div className={'flex gap-6 justify-center items-center ' + (visibleSections.has('hero') ? 'fade-in-up' : 'opacity-0')} style={{ animationDelay: '0.6s' }}>
            <a
              href="#projects"
              className="group flex items-center gap-3 px-24 py-4 bg-gradient-to-b from-zinc-300 to-zinc-400 rounded-md font-mono text-zinc-800 border-b-4 border-zinc-600 hover:from-zinc-400 hover:to-zinc-500 hover:border-b-2 hover:translate-y-[2px] transition-all duration-150"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
              <span className="text-md">View My Work</span>
            </a>
            <a
              href="#contact"
              className="group flex items-center gap-3 px-24 py-4 bg-gradient-to-b from-zinc-300 to-zinc-400 rounded-md font-mono text-zinc-800 border-b-4 border-zinc-600 hover:from-zinc-400 hover:to-zinc-500 hover:border-b-2 hover:translate-y-[2px] transition-all duration-150"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-md">Get In Touch</span>
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
              <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
                About <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Me</span>
              </h2>
              <div className="space-y-4 text-zinc-400 text-lg leading-relaxed">
                <p>
                  As a 4th-year Software Development student, I specialize in full-stack development, building robust applications from front to back. I have practical experience with technologies like React, Next.js, and Django and a strong passion for creating functional, user-friendly digital experiences. I am actively seeking an OJT opportunity to apply my skills in a professional setting and contribute to real-world projects.
                </p>
              </div>
            </div>

            <div className={'relative flex justify-center items-center ' + (visibleSections.has('about') ? 'fade-in-up' : 'opacity-0')} style={{ animationDelay: '0.2s' }}>
              <div className="profile-image-container w-72 h-72 overflow-hidden rounded-full">
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

          <div className={'mt-16 grid md:grid-cols-3 gap-8 text-center ' + (visibleSections.has('about') ? 'fade-in-up' : 'opacity-0')} style={{ animationDelay: '0.4s' }}>
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
          </div>
        </div>
      </section>

      <section id="projects" className="snap-section px-6 bg-zinc-900/50 py-20">
        <div className="max-w-7xl mx-auto h-full flex flex-col items-center">
          <div className="h-16"></div>
          <h2 className={'text-5xl md:text-6xl font-black tracking-tight text-center ' + (visibleSections.has('projects') ? 'fade-in-up' : 'opacity-0')}>
            Featured <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Projects</span>
                    </h2>
                    <div className="h-16"></div>
                    <div className="relative w-full flex flex-col items-center">
            {/* Carousel container */}
            <div className="w-full overflow-hidden">
              <div
                className="flex items-center transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(calc(50% - ${currentProject * 384}px - 192px + 1rem))` }}
              >
                {projects.map((project, index) => (
                  <div
                    key={project.title}
                    className="flex-shrink-0 w-96 mx-4 cursor-pointer"
                    onClick={() => setCurrentProject(index)}
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
                          <div className="w-full h-48 relative hover:overflow-visible">
                            <Image
                              src={project.image}
                              alt={project.title}
                              layout="fill"
                              className="rounded-t-2xl object-cover hover:scale-125 hover:translate-y-8 transition-all duration-500 hover:shadow-cyan-500/50 hover:shadow-2xl"
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
                                  width={20}
                                  height={20}
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
                                  width={20}
                                  height={20}
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

      <section id="skills" className="snap-section px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className={'text-5xl md:text-6xl font-black mb-16 tracking-tight text-center ' + (visibleSections.has('skills') ? 'fade-in-up' : 'opacity-0')}>
            Technical <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Skills</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {skills.map((skillSet, index) => (
              <div
                key={skillSet.category}
                className={'bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800 hover:border-cyan-500/50 transition-all duration-500 max-w-sm ' + (visibleSections.has('skills') ? 'fade-in-up' : 'opacity-0')}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="text-xl font-bold mb-4 text-cyan-400">{skillSet.category}</h3>
                <ul className="space-y-2">
                  {skillSet.items.map(item => (
                    <li key={item} className="flex items-center gap-2 text-zinc-400">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="education" className="snap-section px-6 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className={'text-5xl md:text-6xl font-black mb-16 tracking-tight text-center ' + (visibleSections.has('education') ? 'fade-in-up' : 'opacity-0')}>
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Education</span>
          </h2>

          <div className="space-y-8">
            {education.map((edu, index) => (
              <div
                key={`${edu.school}-${index}`}
                className={'relative pl-8 border-l-2 border-cyan-500/30 transition-all duration-700 max-w-2xl mx-auto ' + (visibleSections.has('education') ? 'fade-in-up' : 'opacity-0')}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="absolute left-0 top-0 w-4 h-4 -translate-x-[9px] rounded-full bg-cyan-500 border-4 border-zinc-950"></div>
                
                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm font-medium text-cyan-400">{edu.level}</div>
                    <div className="text-sm text-zinc-500">{edu.year}</div>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-200 mb-1">{edu.school}</h3>
                  {edu.program && <p className="text-zinc-400">{edu.program}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="certificates" className="snap-section px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className={'text-5xl md:text-6xl font-black mb-16 tracking-tight text-center ' + (visibleSections.has('certificates') ? 'fade-in-up' : 'opacity-0')}>
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Certificates</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-4 justify-items-center">
            {certificates.map((cert, index) => (
              <div
                key={cert}
                className={'bg-zinc-900/50 rounded-xl p-6 border border-zinc-800 hover:border-cyan-500/50 transition-all duration-500 flex items-center gap-4 max-w-lg ' + (visibleSections.has('certificates') ? 'fade-in-up' : 'opacity-0')}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div className="text-zinc-300">{cert}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="snap-section px-6 bg-zinc-900/50">
        <div className={'max-w-4xl mx-auto text-center ' + (visibleSections.has('contact') ? 'fade-in-up' : 'opacity-0')}>
          <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tight">
            Let's <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Connect</span>
          </h2>
          <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto" style={{ animationDelay: '0.2s' }}>
            I'm actively seeking OJT opportunities. Feel free to reach out if you'd like to discuss potential collaborations or just want to connect!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center" style={{ animationDelay: '0.4s' }}>
            <a
              href="mailto:kaelexx12@gmail.com"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-semibold hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300 hover:scale-105"
            >
              Send me an email
            </a>
            <a
              href="tel:09458924721"
              className="px-8 py-4 border border-zinc-700 rounded-full font-semibold hover:border-cyan-500 hover:bg-cyan-500/10 transition-all duration-300"
            >
              Give me a call
            </a>
          </div>
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