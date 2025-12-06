'use client';

import { useEffect, useState } from 'react';

export default function Portfolio() {
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      const sections = ['hero', 'about', 'projects', 'skills', 'education', 'certificates'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const projects = [
    {
      title: "Wildroute",
      description: "Route-finding application with Firebase integration, featuring fast route optimization with jeepney codes for schools, malls, and destinations across Cebu City.",
      tags: ["Firebase", "Route Optimization", "Geolocation"],
      color: "from-orange-500 to-red-600"
    },
    {
      title: "ChipIn",
      description: "Collaborative expense tracking platform with expense input system, participant management, and automated cost-splitting calculations. Clean, user-friendly interface for group events.",
      tags: ["Java", "React.js", "Android"],
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Sleepsync",
      description: "Full-stack sleep tracking web application with pattern monitoring, personalized relaxation tips, optimal bedtime calculations, and customizable alarm scheduling.",
      tags: ["Django", "Python", "Healthcare"],
      color: "from-purple-500 to-pink-600"
    },
    {
      title: "Wildlitz",
      description: "Grade 3 learning platform with interactive educational activities. Full-stack development for assigned modules to enhance student engagement.",
      tags: ["Django", "Python", "React.js", "Education"],
      color: "from-green-500 to-teal-600"
    },
    {
      title: "Russian Roulette",
      description: "Turn-based Java game with XAMPP database management, featuring data persistence and game state tracking throughout gameplay.",
      tags: ["Java", "XAMPP", "Game Development"],
      color: "from-red-500 to-rose-600"
    },
    {
      title: "Identity: Fragments of Me",
      description: "Turn-based 2D game developed for GDAP gamified event. Created visual assets and contributed to main concept using Godot IDE.",
      tags: ["Godot", "C#", "Game Design"],
      color: "from-indigo-500 to-purple-600"
    }
  ];

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
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className={'text-2xl font-bold tracking-tight transition-all duration-700 ' + (mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4')}>
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">FK</span>
          </div>
          <div className={'flex gap-8 text-sm font-medium transition-all duration-700 delay-200 ' + (mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4')}>
            {['About', 'Projects', 'Skills', 'Contact'].map((item) => (
              
                key={item}
                href={'#' + item.toLowerCase()}
                className="hover:text-cyan-400 transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </div>
        </div>
      </nav>

      <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden px-6">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#111111_1px,transparent_1px),linear-gradient(to_bottom,#111111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className={'transition-all duration-1000 ' + (mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
            <div className="inline-block mb-4 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm font-medium">
              Available for OJT Opportunities
            </div>
          </div>
          
          <h1 className={'text-7xl md:text-9xl font-black mb-6 tracking-tighter transition-all duration-1000 delay-200 ' + (mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
            <span className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
              FRANCIS KYLE
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              LORENZANA
            </span>
          </h1>
          
          <p className={'text-xl md:text-2xl text-zinc-400 mb-12 max-w-3xl mx-auto transition-all duration-1000 delay-400 ' + (mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
            Full-Stack Developer & Software Development Student
          </p>
          
          <div className={'flex gap-6 justify-center items-center transition-all duration-1000 delay-600 ' + (mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
            
              href="#projects"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-semibold hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300 hover:scale-105"
            >
              View My Work
            </a>
            
              href="#contact"
              className="px-8 py-4 border border-zinc-700 rounded-full font-semibold hover:border-cyan-500 hover:bg-cyan-500/10 transition-all duration-300"
            >
              Get In Touch
            </a>
          </div>
        </div>

        <div className={'absolute bottom-12 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-1000 ' + (mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
          <div className="w-6 h-10 border-2 border-zinc-700 rounded-full flex justify-center p-2">
            <div className="w-1 h-3 bg-cyan-400 rounded-full animate-bounce"></div>
          </div>
        </div>
      </section>

      <section id="about" className="py-32 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
                About <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Me</span>
              </h2>
              <div className="space-y-4 text-zinc-400 text-lg leading-relaxed">
                <p>
                  I am a 4th-year Software Developer student seeking an OJT opportunity to apply my technical skills in a professional environment.
                </p>
                <p>
                  I have hands-on experience in full-stack development, working with frontend technologies to build responsive user interfaces, backend frameworks to develop server-side applications, and database systems to manage data effectively.
                </p>
                <p>
                  I am passionate about building functional applications, eager to learn from industry professionals, and committed to delivering quality work while gaining real-world software development experience.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-3xl p-8 border border-cyan-500/20 backdrop-blur-sm">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
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

                  <div className="flex items-center gap-4">
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

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                      <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-zinc-500">Location</div>
                      <div className="text-zinc-200">Talisay City, Cebu</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="py-32 px-6 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black mb-16 tracking-tight text-center">
            Featured <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Projects</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div
                key={project.title}
                className="group relative bg-zinc-900 rounded-2xl p-6 border border-zinc-800 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] overflow-hidden"
              >
                <div className={'absolute inset-0 bg-gradient-to-br ' + project.color + ' opacity-0 group-hover:opacity-10 transition-opacity duration-500'}></div>
                
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-cyan-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-zinc-400 mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-zinc-800 rounded-full text-xs font-medium text-cyan-400 border border-zinc-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="skills" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black mb-16 tracking-tight text-center">
            Technical <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Skills</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((skillSet, index) => (
              <div
                key={skillSet.category}
                className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800 hover:border-cyan-500/50 transition-all duration-300"
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

      <section id="education" className="py-32 px-6 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black mb-16 tracking-tight text-center">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Education</span>
          </h2>

          <div className="space-y-8">
            {education.map((edu, index) => (
              <div
                key={edu.school}
                className="relative pl-8 border-l-2 border-cyan-500/30"
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

      <section id="certificates" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black mb-16 tracking-tight text-center">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Certificates</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {certificates.map((cert, index) => (
              <div
                key={cert}
                className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800 hover:border-cyan-500/50 transition-all duration-300 flex items-center gap-4"
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

      <section id="contact" className="py-32 px-6 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tight">
            Let's <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Connect</span>
          </h2>
          <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto">
            I'm actively seeking OJT opportunities. Feel free to reach out if you'd like to discuss potential collaborations or just want to connect!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            
              href="mailto:kaelexx12@gmail.com"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-semibold hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300 hover:scale-105"
            >
              Send me an email
            </a>
            
              href="tel:09458924721"
              className="px-8 py-4 border border-zinc-700 rounded-full font-semibold hover:border-cyan-500 hover:bg-cyan-500/10 transition-all duration-300"
            >
              Give me a call
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-800 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-zinc-500">
            © 2024 Francis Kyle Lorenzana. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#hero" className="text-zinc-500 hover:text-cyan-400 transition-colors">
              Back to top ↑
            </a>
          </div>
        </div>
      </footer>

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
      `}</style>
    </div>
  );
}