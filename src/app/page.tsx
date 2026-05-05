"use client";

import { useEffect, useRef, useState } from "react";
import { useTina } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { client } from "../../tina/__generated__/client";

export default function Home(props: any) {
  const [data, setData] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  // Fetch data from Tina
  useEffect(() => {
    async function fetchData() {
      const pageRes = await client.queries.page({ relativePath: "home.json" });
      const projectsRes = await client.queries.projectConnection();
      const experienceRes = await client.queries.experienceConnection();

      setData(pageRes);
      setProjects(projectsRes.data.projectConnection.edges?.map((e: any) => e.node) || []);
      setExperiences(experienceRes.data.experienceConnection.edges?.map((e: any) => e.node) || []);
    }
    fetchData();
  }, []);

  const { data: tinaData } = useTina({
    query: data?.query,
    variables: data?.variables,
    data: data?.data,
  });

  const page = tinaData?.page || {};
  const links = page.links || {};
  const services = page.services || [];

  const navbar = page.navbar || {
    brand: "Brand",
    navLinks: [
      { label: "About", link: "#about" },
      { label: "Projects", link: "#projects" },
      { label: "Experience", link: "#experience" }
    ]
  };

  const theme = page.theme || {};
  const bgColor = theme.backgroundColor || '#f5ead3';
  const primaryColor = theme.primaryColor || '#2449a6';
  const accentColor = theme.accentColor || '#ed4024';

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (page.name && page.professionalTitle) {
      document.title = `${page.name} | ${page.professionalTitle}`;
    } else if (page.name) {
      document.title = page.name;
    }
  }, [page.name, page.professionalTitle]);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isInitialized = false;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isInitialized) {
        ringX = mouseX;
        ringY = mouseY;
        isInitialized = true;
      }

      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;

      if (Math.random() > 0.6) {
        const particleChars = ['✦', '✧', '★', '☆', '✨'];
        const particle = document.createElement('div');
        particle.className = 'cursor-particle';
        particle.textContent = particleChars[Math.floor(Math.random() * particleChars.length)];
        particle.style.left = `${e.clientX}px`;
        particle.style.top = `${e.clientY}px`;
        const colors = ['var(--accent-color)', 'var(--primary-color)', '#f09433'];
        particle.style.color = colors[Math.floor(Math.random() * colors.length)];
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 800);
      }
    };

    if (window.matchMedia("(pointer: fine)").matches) {
      document.addEventListener('mousemove', handleMouseMove);
      const render = () => {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;
        requestAnimationFrame(render);
      };
      render();
    }

    // Scroll Reveal
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    // 3D Tilt Effect
    const bentoItems = document.querySelectorAll('.bento-item');
    bentoItems.forEach(item => {
      const handleTilt = (e: any) => {
        const rect = (item as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        (item as HTMLElement).style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
      };
      const resetTilt = () => {
        (item as HTMLElement).style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
      };
      item.addEventListener('mousemove', handleTilt);
      item.addEventListener('mouseleave', resetTilt);
    });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [tinaData, projects, experiences]); // Re-observe when data changes

  // Loading state
  if (!tinaData) return <div className="min-h-screen bg-[var(--bg-color)] flex items-center justify-center text-[var(--primary-color)] font-bold">Loading...</div>;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        :root {
          --bg-color: ${bgColor};
          --primary-color: ${primaryColor};
          --accent-color: ${accentColor};
          --bg-color-90: ${bgColor}E6;
          --primary-color-10: ${primaryColor}1A;
          --primary-color-20: ${primaryColor}33;
          --primary-color-70: ${primaryColor}B3;
          --primary-color-80: ${primaryColor}CC;
          --accent-color-30: ${accentColor}4D;
        }
      `}} />
      <div className="min-h-screen flex flex-col selection:bg-[var(--accent-color)] selection:text-white relative z-0 bg-[var(--bg-color)]">
      <div className="bg-shape bg-[var(--accent-color)] w-64 h-64 top-[-10%] left-[-5%]"></div>
      <div className="bg-shape bg-[var(--primary-color)] w-96 h-96 bottom-[10%] right-[-10%]" style={{ animationDuration: '25s', animationDelay: '-5s' }}></div>
      <div className="bg-shape bg-[#f09433] w-48 h-48 top-[40%] left-[30%]" style={{ animationDuration: '18s', animationDelay: '-2s', opacity: 0.2 }}></div>

      <div className="w-full bg-[var(--primary-color)] text-white py-3 overflow-hidden border-b-4 border-[var(--accent-color)] flex shadow-md relative z-10">
        <div className="marquee-content whitespace-nowrap flex items-center gap-8 text-sm md:text-base font-bold uppercase tracking-widest w-[200%]">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="flex gap-8">
              {services.map((s: any, idx: number) => (
                <span key={idx} className="flex-shrink-0">{s.icon} {s.label}</span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <header className="w-full sticky top-0 z-50 bg-[var(--bg-color-90)] backdrop-blur-md pt-6 pb-4 px-6 md:px-12 flex items-center justify-between border-b-[2px] border-[var(--primary-color)] shadow-sm transition-all duration-300">
        <div className="flex items-center gap-2">
          <a href="#about" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <h1 className="text-3xl sm:text-4xl text-[var(--primary-color)] logo-text tracking-tighter uppercase font-black">{navbar.brand || "Brand"}</h1>
          </a>
        </div>
        <nav className="hidden md:flex gap-8 items-center text-[var(--primary-color)] font-bold text-lg">
          {navbar.navLinks?.map((item: any, idx: number) => (
            <a key={idx} href={item.link} className="hover:text-[var(--accent-color)] transition-colors relative after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-[var(--accent-color)] after:bottom-0 after:left-0 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-bottom-right hover:after:origin-bottom-left">{item.label}</a>
          ))}
        </nav>
      </header>

      <main id="about" className="flex-grow w-full max-w-7xl mx-auto px-6 md:px-12 py-10 flex flex-col lg:flex-row gap-12 items-center lg:items-start relative scroll-mt-24">
        <section className="w-full lg:w-5/12 flex justify-center lg:justify-start relative pt-10">
          <div className="relative group">
            <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[400px] md:h-[400px] rounded-full bg-[var(--accent-color)] flex justify-center items-end overflow-hidden shadow-2xl transition-transform duration-500 ease-out border-[8px] border-white/50 backdrop-blur-sm group-hover:scale-105">
              <img src={page.profileImage || "https://picsum.photos/id/400/500"} alt={page.name} className="w-full h-auto object-contain" />
            </div>
            <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-10 md:right-10 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-white rounded-full border-4 border-[var(--bg-color)] flex items-center justify-center shadow-md z-20 cursor-default group hover:scale-110 transition-transform">
              <span className="text-lg sm:text-xl md:text-2xl">✨</span>
              <div className="absolute left-full ml-2 px-3 py-1 bg-[var(--primary-color)] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">{page.status}</div>
            </div>
          </div>
        </section>

        <section className="w-full lg:w-7/12 flex flex-col gap-10">
          <div className="flex flex-col gap-5">
            <header className="flex flex-col sm:flex-row sm:items-center gap-4 reveal-text delay-100">
              <h2 className="text-5xl sm:text-6xl font-black text-[var(--accent-color)] tracking-tight hover:scale-110 hover:rotate-2 transition-transform duration-300 origin-left cursor-default drop-shadow-sm">{page.name}</h2>
              <div className="bg-[var(--primary-color)] text-white text-sm md:text-base font-bold px-5 py-2 md:py-2.5 rounded-full inline-flex self-start sm:self-center shadow-md transform hover:-translate-y-1 transition-transform cursor-default hover:bg-[#1a3780]">{page.professionalTitle}</div>
            </header>
            <p className="text-[var(--primary-color)] text-lg md:text-xl font-medium leading-relaxed max-w-2xl reveal-text delay-300">{page.description}</p>
          </div>

          <nav className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full auto-rows-[120px]">
            {page.bentoItems?.map((item: any, idx: number) => {
              let sizeClass = "col-span-1 row-span-1";
              if (item.size === "long") sizeClass = "col-span-1 md:col-span-2 row-span-1";
              if (item.size === "big") sizeClass = "col-span-1 md:col-span-2 row-span-2";

              let styleClass = "";
              if (item.style === "primary-gradient") {
                styleClass = "bg-gradient-to-br from-[var(--primary-color)] to-[#1a3780] text-white";
              } else if (item.style === "white-outline") {
                styleClass = "bg-white border-2 border-[var(--primary-color-20)] text-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-white hover:border-[var(--primary-color)]";
              } else if (item.style === "warning-gradient") {
                styleClass = "bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] text-white";
              } else if (item.style === "accent-solid") {
                styleClass = "bg-[var(--accent-color)] text-white";
              }

              let iconContent: any = item.icon;
              if (item.icon === "linkedin-svg") {
                iconContent = <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>;
              } else if (item.icon === "instagram-svg") {
                iconContent = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 group-hover:opacity-100 group-hover:rotate-45 group-hover:scale-125 transition-all duration-300"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>;
              }

              return (
                <a key={idx} href={item.link} target={item.link?.startsWith('#') ? '_self' : '_blank'} rel="noopener noreferrer" className={`bento-item bento-delay-${(idx % 4) + 1} group ${sizeClass} rounded-3xl ${styleClass} p-5 flex ${item.size === 'long' ? 'items-center justify-between' : item.size === 'big' ? 'flex-col justify-between p-6' : 'flex-col justify-between'} relative overflow-hidden transition-all duration-300`}>
                  {item.style === "primary-gradient" && (
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  )}
                  
                  {item.size === "long" ? (
                    <>
                      <div>
                        <h3 className={`text-xl font-bold ${item.style === 'white-outline' ? 'group-hover:text-white transition-colors' : ''}`}>{item.title}</h3>
                        <p className={`text-sm ${item.style === 'white-outline' ? 'text-gray-500 group-hover:text-white/80 transition-colors' : 'text-white/70 italic'}`}>{item.description}</p>
                      </div>
                      <div className={`${item.style === 'white-outline' ? 'bg-[var(--bg-color)] group-hover:bg-white/20 p-3 rounded-full group-hover:scale-110 group-hover:rotate-6 transition-all duration-300' : 'text-4xl group-hover:rotate-12 group-hover:scale-125 transition-transform duration-300'}`}>
                        {iconContent}
                      </div>
                    </>
                  ) : item.size === "big" ? (
                    <>
                      <div>
                        <h3 className="text-2xl font-bold mb-1 group-hover:translate-x-1 transition-transform">{item.title}</h3>
                        <p className="text-white/70 text-sm italic font-medium">{item.description}</p>
                      </div>
                      <div className="flex justify-between items-end w-full">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-[var(--primary-color)] transition-all duration-300 group-hover:scale-110">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                        </div>
                        <span className="text-4xl group-hover:rotate-12 group-hover:scale-125 transition-transform duration-300">{iconContent}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-start w-full">
                        <h3 className="text-lg font-bold">{item.title}</h3>
                        <span className={`text-xl ${item.style === 'accent-solid' ? 'group-hover:scale-150 group-hover:rotate-12 transition-transform duration-300 origin-bottom-right' : ''}`}>
                          {iconContent}
                        </span>
                      </div>
                      <p className="text-xs font-medium opacity-90">{item.description}</p>
                    </>
                  )}
                </a>
              );
            })}
          </nav>
        </section>
      </main>

      <section id="projects" className="w-full max-w-7xl mx-auto px-6 md:px-12 py-20 border-t-2 border-[var(--primary-color-10)] relative z-10 scroll-mt-24">
        <div className="mb-12 reveal-on-scroll">
          <h2 className="text-4xl sm:text-5xl font-black text-[var(--primary-color)] tracking-tight mb-4">Featured Projects</h2>
          <p className="text-lg text-[var(--primary-color-80)] font-medium max-w-2xl">A selection of recent work and case studies highlighting my problem-solving approach.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((p, i) => (
            <div key={i} onClick={() => setSelectedProject(p)} className="cursor-pointer group reveal-on-scroll bg-white rounded-3xl overflow-hidden border-2 border-[var(--primary-color-20)] hover:border-[var(--accent-color)] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-full h-64 bg-gray-200 overflow-hidden relative">
                <img src={p.image || `https://picsum.photos/id/${801 + i}/600`} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-8">
                <div className="flex gap-2 mb-4">
                  {p.tags?.map((tag: string, idx: number) => (
                    <span key={idx} className="bg-[var(--primary-color-10)] text-[var(--primary-color)] text-xs font-bold px-3 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
                <h3 className="text-2xl font-bold text-[var(--primary-color)] mb-3 group-hover:text-[var(--accent-color)] transition-colors">{p.title}</h3>
                <p className="text-gray-600 mb-6 font-medium leading-relaxed">{p.description}</p>
                <a href={p.link} onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-2 text-[var(--accent-color)] font-bold hover:gap-4 transition-all">
                  View Project <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="experience" className="w-full max-w-7xl mx-auto px-6 md:px-12 py-20 border-t-2 border-[var(--primary-color-10)] relative z-10 scroll-mt-24">
        <div className="mb-16 reveal-on-scroll text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-[var(--primary-color)] tracking-tight mb-4">Experience</h2>
          <p className="text-lg text-[var(--primary-color-80)] font-medium max-w-2xl mx-auto">My professional journey and the roles that have shaped my expertise.</p>
        </div>
        <div className="max-w-4xl mx-auto relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-[var(--primary-color)]/20 transform md:-translate-x-1/2 rounded-full"></div>
          {experiences.map((exp, i) => (
            <div key={i} className={`relative flex flex-col ${exp.reverse ? "md:flex-row-reverse" : "md:flex-row"} items-start md:items-center justify-between mb-12 reveal-on-scroll group`}>
              <div className="absolute left-4 md:left-1/2 w-5 h-5 bg-[var(--accent-color)] rounded-full transform -translate-x-1/2 mt-1.5 md:mt-0 border-4 border-[var(--bg-color)] z-10 group-hover:scale-150 transition-transform"></div>
              <div className={`md:w-5/12 pl-12 md:pl-0 ${exp.reverse ? "md:pl-10" : "md:text-right md:pr-10"}`}>
                <h3 className="text-2xl font-bold text-[var(--primary-color)] group-hover:text-[var(--accent-color)] transition-colors">{exp.title}</h3>
                <p className="text-[var(--primary-color-70)] font-bold mb-2">{exp.company} | {exp.date}</p>
              </div>
              <div className={`md:w-5/12 pl-12 ${exp.reverse ? "md:pr-10 md:text-right" : "md:pl-10"} mt-2 md:mt-0`}>
                <p className="text-gray-600 font-medium leading-relaxed bg-white p-5 rounded-2xl border-2 border-[var(--primary-color-10)] shadow-sm group-hover:border-[var(--accent-color-30)] group-hover:shadow-md transition-all">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="w-full mt-auto py-6 border-t-[3px] border-[var(--primary-color-10)] text-center text-[var(--primary-color-70)] text-sm font-medium">
        <p>{page.footer?.text || "\u00a9 2026 Your Brand. All rights reserved."}</p>
      </footer>

      <div ref={dotRef} className="hidden md:block fixed top-0 left-0 w-3 h-3 bg-[var(--accent-color)] rounded-full pointer-events-none z-[10000] transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-150 ease-out"></div>
      <div ref={ringRef} className="hidden md:block fixed top-0 left-0 w-10 h-10 border-2 border-[var(--primary-color)] rounded-full pointer-events-none z-[9999] transform -translate-x-1/2 -translate-y-1/2 magic-ring-transition"></div>

      {selectedProject && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6" onClick={() => setSelectedProject(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div 
            className="bg-[var(--bg-color)] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl relative z-10 flex flex-col shadow-2xl border-[3px] border-[var(--primary-color)] animate-fadeUp"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-[var(--bg-color)] border-2 border-[var(--primary-color)] rounded-full flex items-center justify-center text-[var(--primary-color)] hover:bg-[var(--accent-color)] hover:text-white hover:border-[var(--accent-color)] transition-all duration-300 z-20"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div className="w-full h-64 sm:h-80 md:h-96 bg-gray-200 relative shrink-0">
              <img src={selectedProject.image || `https://picsum.photos/id/801/1200/800`} alt={selectedProject.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-8 md:p-12">
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedProject.tags?.map((tag: string, idx: number) => (
                  <span key={idx} className="bg-[var(--primary-color-10)] text-[var(--primary-color)] text-sm font-bold px-4 py-1.5 rounded-full">{tag}</span>
                ))}
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-[var(--primary-color)] mb-6">{selectedProject.title}</h2>
              
              {selectedProject.content ? (
                <div className="text-gray-700 leading-relaxed font-medium mb-8 flex flex-col gap-4 [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:text-[var(--primary-color)] [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-[var(--primary-color)] [&>ul]:list-disc [&>ul]:pl-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>a]:text-[var(--accent-color)] [&>a]:underline">
                  <TinaMarkdown content={selectedProject.content} />
                </div>
              ) : (
                <p className="text-xl text-gray-700 leading-relaxed font-medium mb-8">{selectedProject.description}</p>
              )}
              
              {selectedProject.link && (
                <div className="mt-10">
                  <a href={selectedProject.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-[var(--accent-color)] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[var(--primary-color)] hover:scale-105 transition-all duration-300 shadow-lg">
                    Visit Project <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
