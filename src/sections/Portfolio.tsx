import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import AnimatedSection from '../components/AnimatedSection';
import SectionTitle from '../components/SectionTitle';
import { ExternalLink, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string[];
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Portfolio Website',
    description: 'A responsive and dynamic portfolio website built with React and TypeScript, featuring smooth animations, interactive project showcases, and optimized UI/UX design using Tailwind CSS and Framer Motion.',
    image: '/portfolio website.PNG',
    category: ['frontend'],
    technologies: ['React', "TypeScript", 'Tailwind CSS', 'Framer Motion', 'React-Scroll'],
    liveUrl: 'https://tahir-portfolio-red.vercel.app/',
    githubUrl: 'https://github.com',
  },
  {
    id: 2,
    title: 'Annotation Tool (ANNA)',
    description: 'An AI-powered annotation platform enabling real-time object detection, segmentation, training, and collaboration with multi-model support.',
    image: 'anna.png',
    category: ['full-stack', 'AI', 'frontend', 'backend'],
    technologies: [
      'React', 
      'TypeScript', 
      'Tailwind CSS', 
      'Chart.js', 
      'Fabric.js', 
      'FastAPI', 
      'Express.js', 
      'MongoDB', 
      'YOLOv8/v9/v11', 
      'FRCNN', 
      'Mask R-CNN'
    ],
    liveUrl: 'https://amatdt.aethero.com/',
    githubUrl: 'https://github.com',
  },
  {
    id: 3,
    title: 'Chatley.AI',
    description: 'A 24/7 AI-powered voice assistant that handles business calls at scale, reducing operational costs by up to 40% with consistent, high-quality conversations.',
    image: 'chatley ai project.PNG',
    category: ['full-stack', 'backend', 'frontend', 'AI'],
    technologies: [
      'React', 
      'JavaScript', 
      'Node.js', 
      'Express', 
      'MongoDB', 
      'JWT', 
      'VAPI.ai'
    ],
    liveUrl: 'https://www.chatley.ai/',
    githubUrl: 'https://github.com',
  },
  {
    id: 4,
    title: 'Jameel Akhtar Projects SPC',
    description: 'Trusted steel fabrication and welding specialists in Barka, providing custom trailer manufacturing, vehicle repair, furniture and electronics trading, transport services, and commercial solutions',
    image: 'jameelaktharprojects.png',
    category: ['frontend', 'backend'],
    technologies: ['React', 'Tailwind CSS', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'google-map-react', 'EmailJS'],
    liveUrl: 'https://jameelakhtarprojects.com/',
    githubUrl: 'https://github.com',
  },
  {
    id: 5,
    title: 'Travel Website',
    description: 'A responsive multi-page travel website built with React and Tailwind CSS, featuring destination pages, service details, travel packages, guides, and a contact section for seamless user experience.',
    image: 'travel website.PNG',
    category: ['frontend'],
    technologies: ['React', 'JavaScript', 'Tailwind CSS', 'React Icons', 'Styled Components'],
    liveUrl: 'https://travel-website-delta-lovat.vercel.app/',
    githubUrl: 'https://github.com',
  },
  {
    id: 6,
    title: 'Dash 180',
    description: 'Dash 180 is a fully responsive landing page for an AI-driven hotel analytics solution. Built with React and TypeScript, it features a clean, modern UI/UX powered by Tailwind CSS to deliver an intuitive and engaging experience.',
    image: 'dash 180.PNG',
    category: ['frontend'],
    technologies: ['React', 'EmailJS', 'Tailwind CSS', 'TypeScript'],
    liveUrl: 'https://dash-180.vercel.app/',
    githubUrl: 'https://github.com',
  },
  {
    id: 7,
    title: 'NOLMT.ai',
    description: 'NOLMT.ai is a full-stack generative AI SaaS for Text-to-Image, Image-to-Image, Text-to-Video, and Image-to-Video creation, powered by a granular credit system. It includes secure auth (email + Google), Stripe subscriptions/top-ups, S3 storage with signed downloads, a user dashboard, and an admin portal for analytics and plan/pricing management.',
    image: 'nolmtai.png',
    category: ['frontend', 'backend', 'AI', 'full-stack'],
    technologies: [
      'Wavespeed AI',
      'React',
      'TypeScript',
      'Vite',
      'TailwindCSS',
      'React Router',
      'React Hot Toast',
      'Recharts',
      'Lucide React',
      'Node.js',
      'Express',
      'Supabase',
      'MongoDB',
      'Mongoose',
      'Stripe',
      'AWS S3 (AWS SDK v3)',
      'JWT',
      'Passport (local & Google OAuth20)',
      'Nodemailer',
      'Twilio',
      'Express Rate Limit',
      'Node-Cron'
    ],
    liveUrl: 'https://nolmt.ai/',
    githubUrl: 'https://github.com',
  },
  {
    id: 8,
    title: 'Minibyte.Ai',
    description: 'MiniByte.AI is a high-performance, fully responsive landing page designed to work seamlessly across all screen sizes. It showcases a deep-tech engineering company specializing in Autonomous Systems, Enterprise AI Platforms, and Synthetic Environment Generation. Built with React, TypeScript, Tailwind CSS, GSAP, Framer Motion, and React-Scroll, the site delivers smooth scroll animations, dynamic text transitions, and an immersive storytelling experience. It highlights MiniByte’s technical domains—from multi-modal perception systems and distributed edge intelligence to simulation-driven synthetic data generation—while reflecting the company’s first-principles engineering philosophy, end-to-end system ownership, and technical partnerships with enterprise R&D teams, startups, industrial companies, and government agencies.',
    image: 'minibyteai.png',
    category: ['frontend'],
    technologies: ['React', 'framer', 'Tailwind CSS', 'TypeScript', 'gsap', 'react-scroll'],
    liveUrl: 'https://www.minibyte.ai/',
    githubUrl: 'https://github.com',
  },
  {
    id: 9,
    title: 'Accelerate',
    description:
    'Accelerate is an AI-powered coaching platform that gives users direct access to personalized coaching conversations with an AI version of coach Michael McIntyre. Users can explore resilience, goal-setting, and mindset through real-time text chat or live voice calls, getting immediate, thoughtful responses tailored to their questions. The platform makes professional coaching insights accessible anytime, helping users reflect on challenges, clarify objectives, and develop strategies for personal growth—all through an intuitive, conversation-driven interface that feels natural and supportive.',
  image: 'accelerate.png',
    category: ['frontend', 'backend','full-stack','AI'],
    technologies: [
      'React',
      'TypeScript',
      'Tailwind CSS',
      'ElevenLabs',
      'lucide-react',
      'WebSocket-ready architecture',
      'node.js',
      'express.js',
      'elevenlabs',
      
   
 
    ],
    liveUrl: 'https://accelerate-now.com/',
    githubUrl: 'https://github.com', // replace with your repo
  },
  {
    id: 10,
    title: 'AllThreads.ai',
    description:
      'AllThreads.ai is a multi-agent outreach platform that turns a single prompt into fully compliant, on-brand campaigns across email, LinkedIn, and phone. It helps sales teams orchestrate personalized multi-channel sequences in minutes instead of weeks, while giving revenue and ops leaders enterprise-grade governance, cost control, and full auditability. The product is designed for teams that want to scale AI-driven outreach without losing control over messaging, approvals, and compliance.',
    image: '/allthreadsai.png', // update to your actual image filename
    category: ['frontend'],
    technologies: [
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Framer Motion',
      'EmailJS',
      'context api'
    ],
    liveUrl: 'https://allthreads.ai/',      // put your real URL here
    githubUrl: 'https://github.com'        // replace with this repo’s URL
  }
  
  
  
];

type CategoryFilter = 'all' | 'full-stack' | 'frontend' | 'backend';

const Portfolio: React.FC = () => {
  useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const portfolioRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = projects.filter((project: Project) => {
    if (filter === 'all') return true;
    return project.category.includes(filter);
  });

  const addToCardRefs = (el: HTMLDivElement | null): void => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial load animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: portfolioRef.current,
          start: "top bottom",
          end: "top 60%",
          scrub: 0.5
        }
      });

      // Animate filter buttons with bounce effect
      const filterChildren = filtersRef.current?.children;
      if (filterChildren && filterChildren.length > 0) {
        tl.fromTo(Array.from(filterChildren), 
          { 
            opacity: 0, 
            scale: 0.5,
            y: -50,
            rotationX: -90
          }, 
          { 
            opacity: 1, 
            scale: 1,
            y: 0,
            rotationX: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.7)"
          }
        );
      }

      // Animate portfolio cards with masonry effect
      tl.fromTo(cardRefs.current, 
        { 
          opacity: 0, 
          y: 100,
          scale: 0.8,
          rotationX: -30,
          transformOrigin: "center bottom"
        }, 
        { 
          opacity: 1, 
          y: 0,
          scale: 1,
          rotationX: 0,
          duration: 0.8,
          stagger: {
            amount: 0.6,
            from: "start",
            grid: "auto"
          },
          ease: "power3.out"
        },
        "-=0.3"
      );

      // Add hover animations for cards
      cardRefs.current.forEach((card) => {
        if (!card) return;

        const handleMouseEnter = (): void => {
          const image = card.querySelector('.project-image');
          const overlay = card.querySelector('.project-overlay');
          const title = card.querySelector('.project-title');
          const categories = card.querySelectorAll('.project-category');
          const description = card.querySelector('.project-description');
          const techTags = card.querySelectorAll('.tech-tag');

          // Card lift and tilt effect
          gsap.to(card, {
            y: -10,
            scale: 1.02,
            rotationX: 5,
            rotationY: 5,
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            duration: 0.4,
            ease: "power2.out"
          });

          // Image zoom effect
          if (image) {
            gsap.to(image, {
              scale: 1.1,
              duration: 0.6,
              ease: "power2.out"
            });
          }

          // Overlay fade in
          if (overlay) {
            gsap.to(overlay, {
              opacity: 1,
              duration: 0.3
            });
          }

          // Title color change
          if (title) {
            gsap.to(title, {
              color: "rgb(var(--color-primary-rgb))",
              duration: 0.3
            });
          }

          // Category tags pulse
          categories.forEach((cat, i) => {
            gsap.to(cat, {
              scale: 1.1,
              duration: 0.3,
              delay: i * 0.05
            });
          });

          // Description slide up
          if (description) {
            gsap.to(description, {
              y: -5,
              duration: 0.3
            });
          }

          // Tech tags wave effect
          gsap.to(techTags, {
            y: -3,
            duration: 0.3,
            stagger: 0.05,
            ease: "power2.out"
          });
        };

        const handleMouseLeave = (): void => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            rotationX: 0,
            rotationY: 0,
            boxShadow: "none",
            duration: 0.4,
            ease: "power2.out"
          });

          const image = card.querySelector('.project-image');
          const overlay = card.querySelector('.project-overlay');
          const title = card.querySelector('.project-title');
          const categories = card.querySelectorAll('.project-category');
          const description = card.querySelector('.project-description');
          const techTags = card.querySelectorAll('.tech-tag');

          if (image) {
            gsap.to(image, {
              scale: 1,
              duration: 0.4
            });
          }

          if (overlay) {
            gsap.to(overlay, {
              opacity: 0,
              duration: 0.3
            });
          }

          if (title) {
            gsap.to(title, {
              color: "rgb(var(--color-text-rgb))",
              duration: 0.3
            });
          }

          gsap.to([...categories, description, ...techTags], {
            scale: 1,
            y: 0,
            duration: 0.3
          });
        };

        card.addEventListener('mouseenter', handleMouseEnter);
        card.addEventListener('mouseleave', handleMouseLeave);
      });

    }, portfolioRef);

    return () => ctx.revert();
  }, []);

  // Animation for filter changes
  useEffect(() => {
    if (!gridRef.current) return;

    const ctx = gsap.context(() => {
      // Clear previous refs
      cardRefs.current = [];
      
      // Animate out current cards
      const currentCards = Array.from(gridRef.current?.children || []);
      
      gsap.to(currentCards, {
        opacity: 0,
        scale: 0.8,
        y: 50,
        rotationY: 90,
        duration: 0.4,
        stagger: {
          amount: 0.2,
          from: "edges"
        },
        ease: "power2.in",
        onComplete: () => {
          // After exit animation, animate in new cards
          setTimeout(() => {
            const newCards = Array.from(gridRef.current?.children || []);
            
            gsap.fromTo(newCards, 
              { 
                opacity: 0, 
                scale: 0.8,
                y: 50,
                rotationY: -90
              },
              {
                opacity: 1,
                scale: 1,
                y: 0,
                rotationY: 0,
                duration: 0.6,
                stagger: {
                  amount: 0.4,
                  from: "center"
                },
                ease: "back.out(1.7)"
              }
            );
          }, 100);
        }
      });
    }, gridRef);

    return () => ctx.revert();
  }, [filter, filteredProjects]);

  // Modal animations
  useEffect(() => {
    if (selectedProject && modalRef.current) {
      const ctx = gsap.context(() => {
        const modal = modalRef.current;
        const modalContent = modal?.querySelector('.modal-content');

        gsap.fromTo(modal, 
          { opacity: 0 },
          { opacity: 1, duration: 0.3 }
        );

        if (modalContent) {
          gsap.fromTo(modalContent, 
            { scale: 0.8, opacity: 0, y: 50 },
            { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
          );
        }
      }, modalRef);

      return () => ctx.revert();
    }
  }, [selectedProject]);

  const openProjectDetails = (project: Project): void => {
    setSelectedProject(project);
  };

  const closeProjectDetails = (): void => {
    if (modalRef.current) {
      const modalContent = modalRef.current.querySelector('.modal-content');
      
      gsap.to(modalContent, {
        scale: 0.8,
        opacity: 0,
        y: 50,
        duration: 0.3,
        ease: "power2.in"
      });

      gsap.to(modalRef.current, {
        opacity: 0,
        duration: 0.3,
        delay: 0.1,
        onComplete: () => setSelectedProject(null)
      });
    } else {
      setSelectedProject(null);
    }
  };

  const handleFilterChange = (newFilter: CategoryFilter): void => {
    if (newFilter === filter) return;

    // Button click animation
    const clickedButton = filtersRef.current?.querySelector(`[data-filter="${newFilter}"]`);
    if (clickedButton) {
      gsap.to(clickedButton, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1
      });
    }

    setFilter(newFilter);
  };

  return (
    <AnimatedSection id="portfolio" className="bg-background">
      <div className="container mx-auto">
        <SectionTitle 
          title="My Portfolio" 
          subtitle="Explore my recent projects and see the solutions I've built." 
          centered
        />

        <div ref={portfolioRef}>
          <div ref={filtersRef} className="flex flex-wrap justify-center gap-4 mb-10">
            <button
              data-filter="all"
              onClick={() => handleFilterChange('all')}
              className={`px-6 py-3 rounded-full transition-all duration-300 opacity-0 ${
                filter === 'all'
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-background-lighter text-text-secondary hover:bg-background-light'
              }`}
            >
              All Projects
            </button>
            <button
              data-filter="full-stack"
              onClick={() => handleFilterChange('full-stack')}
              className={`px-6 py-3 rounded-full transition-all duration-300 opacity-0 ${
                filter === 'full-stack'
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-background-lighter text-text-secondary hover:bg-background-light'
              }`}
            >
              Full Stack
            </button>
            <button
              data-filter="frontend"
              onClick={() => handleFilterChange('frontend')}
              className={`px-6 py-3 rounded-full transition-all duration-300 opacity-0 ${
                filter === 'frontend'
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-background-lighter text-text-secondary hover:bg-background-light'
              }`}
            >
              Frontend
            </button>
            <button
              data-filter="backend"
              onClick={() => handleFilterChange('backend')}
              className={`px-6 py-3 rounded-full transition-all duration-300 opacity-0 ${
                filter === 'backend'
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-background-lighter text-text-secondary hover:bg-background-light'
              }`}
            >
              Backend
            </button>
          </div>

          <div 
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            style={{ perspective: '1000px' }}
          >
            {filteredProjects.map((project: Project) => (
              <div
                key={project.id}
                ref={addToCardRefs}
                className="card p-0 overflow-hidden group cursor-pointer opacity-0"
                style={{ transformStyle: 'preserve-3d' }}
                onClick={() => openProjectDetails(project)}
              >
                <div className="relative overflow-hidden h-48">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="project-image w-full h-full object-cover transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background-dark to-transparent opacity-70"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="project-title text-xl font-bold text-white">{project.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.category.map((cat: string) => (
                        <span 
                          key={cat} 
                          className="project-category text-xs px-2 py-1 bg-primary/70 rounded-full text-white"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="project-overlay absolute inset-0 flex items-center justify-center bg-background-dark/80 opacity-0 transition-opacity duration-300">
                    <a 
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary py-2 px-4 text-sm"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                      }}
                    >
                      <ExternalLink size={18} className="mr-2" />
                      View Live
                    </a>
                  </div>
                </div>
                <div className="p-6">
                  <p className="project-description text-text-secondary text-sm line-clamp-2 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 4).map((tech: string, i: number) => (
                      <span 
                        key={i} 
                        className="tech-tag text-xs px-2 py-1 bg-background-dark rounded-full text-text-secondary"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="tech-tag text-xs px-2 py-1 bg-background-dark rounded-full text-text-secondary">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Modal */}
        {selectedProject && (
          <div
            ref={modalRef}
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
            onClick={closeProjectDetails}
          >
            <div
              className="modal-content bg-background-lighter rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto hide-scrollbar"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <div className="relative h-64 sm:h-80">
                <img 
                  src={selectedProject.image} 
                  alt={selectedProject.title} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-4 right-4">
                  <button 
                    onClick={closeProjectDetails}
                    className="bg-background-dark/80 text-white p-2 rounded-full hover:bg-primary transition-colors duration-300"
                    aria-label="Close modal"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{selectedProject.title}</h3>
                <p className="text-text-secondary mb-6">{selectedProject.description}</p>
                
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3">Technologies Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech: string, i: number) => (
                      <span 
                        key={i} 
                        className="text-sm px-3 py-1 bg-background-dark rounded-full text-text-secondary"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary py-2"
                  >
                    <ExternalLink size={18} className="mr-2" />
                    Live Demo
                  </a>
                 
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AnimatedSection>
  );
};

export default Portfolio;