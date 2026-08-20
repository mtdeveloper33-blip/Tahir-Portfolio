import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import AnimatedSection from '../components/AnimatedSection';
import SectionTitle from '../components/SectionTitle';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Proficiency level system. Each level maps to a bar width so the existing
// progress-bar animation keeps working without a redesign.
type Level = 'Advanced' | 'Proficient' | 'Working Knowledge';

const LEVEL_WIDTH: Record<Level, number> = {
  'Advanced': 95,
  'Proficient': 78,
  'Working Knowledge': 58,
};

const LEVEL_COLOR: Record<Level, string> = {
  'Advanced': 'text-primary-light',
  'Proficient': 'text-secondary-light',
  'Working Knowledge': 'text-text-secondary',
};

// Clean inline line-icons (theme primary-light) for concepts that have no
// official brand logo. Keeps them consistent with each other and dark-safe.
const svgIcon = (paths: string): string =>
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='#a78bfa' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>${paths}</svg>`
  );

const CONCEPT_ICONS = {
  oauth: svgIcon(
    "<circle cx='7.5' cy='15.5' r='4.5'/><path d='M10.7 12.3 22 1'/><path d='m17 6 3 3'/><path d='m14 9 3 3'/>"
  ),
  rbac: svgIcon(
    "<path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'/><path d='m9 12 2 2 4-4'/>"
  ),
  cicd: svgIcon(
    "<polyline points='23 4 23 10 17 10'/><polyline points='1 20 1 14 7 14'/><path d='M3.51 9a9 9 0 0 1 14.85-3.36L23 10'/><path d='M20.49 15a9 9 0 0 1-14.85 3.36L1 14'/>"
  ),
  ocr: svgIcon(
    "<path d='M3 7V5a2 2 0 0 1 2-2h2'/><path d='M17 3h2a2 2 0 0 1 2 2v2'/><path d='M21 17v2a2 2 0 0 1-2 2h-2'/><path d='M7 21H5a2 2 0 0 1-2-2v-2'/><path d='M7 8h6'/><path d='M7 12h10'/><path d='M7 16h8'/>"
  ),
  rag: svgIcon(
    "<ellipse cx='9' cy='5' rx='7' ry='3'/><path d='M2 5v6c0 1.66 3.13 3 7 3'/><path d='M2 11v6c0 1.66 3.13 3 7 3'/><path d='m18 13 1.5 3.5L23 18l-3.5 1.5L18 23l-1.5-3.5L13 18l3.5-1.5z'/>"
  ),
  voice: svgIcon(
    "<rect x='9' y='2' width='6' height='12' rx='3'/><path d='M19 10v1a7 7 0 0 1-14 0v-1'/><line x1='12' y1='18' x2='12' y2='22'/><line x1='8' y1='22' x2='16' y2='22'/>"
  ),
  audio: svgIcon(
    "<path d='M2 12h.01'/><path d='M6 8v8'/><path d='M10 4v16'/><path d='M14 7v10'/><path d='M18 10v4'/><path d='M22 12h-.01'/>"
  ),
};

interface Technology {
  name: string;
  icon: string;
  level: Level;
  proficiency: number;
}

interface RawTechnology {
  name: string;
  icon: string;
  level: Level;
}

interface TechnologyCategory {
  name: string;
  technologies: Technology[];
}

interface RawCategory {
  name: string;
  technologies: RawTechnology[];
}

const isTechnology = (t: Technology | undefined): t is Technology => Boolean(t);

const rawCategories: RawCategory[] = [
  {
    name: 'Frontend',
    technologies: [
      { name: 'React.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', level: 'Advanced' },
      { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', level: 'Advanced' },
      { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', level: 'Proficient' },
      { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', level: 'Advanced' },
      { name: 'Tailwind CSS', icon: 'https://www.svgrepo.com/show/333609/tailwind-css.svg', level: 'Advanced' },
      { name: 'Redux', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg', level: 'Proficient' },
      { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', level: 'Advanced' },
      { name: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', level: 'Advanced' },
    ],
  },
  {
    name: 'Backend',
    technologies: [
      { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', level: 'Advanced' },
      { name: 'Express.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', level: 'Advanced' },
      { name: 'REST APIs', icon: 'https://www.svgrepo.com/show/88703/api.svg', level: 'Advanced' },
      { name: 'JWT', icon: 'https://cdn.simpleicons.org/jsonwebtokens/D63AFF', level: 'Proficient' },
      { name: 'OAuth', icon: CONCEPT_ICONS.oauth, level: 'Proficient' },
      { name: 'RBAC', icon: CONCEPT_ICONS.rbac, level: 'Proficient' },
    ],
  },
  {
    name: 'Database',
    technologies: [
      { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', level: 'Advanced' },
      { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', level: 'Proficient' },
      { name: 'Supabase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg', level: 'Proficient' },
    ],
  },
  {
    name: 'Cloud & DevOps',
    technologies: [
      { name: 'AWS S3', icon: 'https://www.svgrepo.com/show/448266/aws.svg', level: 'Proficient' },
      { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', level: 'Working Knowledge' },
      { name: 'GitHub Actions', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/githubactions/githubactions-original.svg', level: 'Working Knowledge' },
      { name: 'CI/CD', icon: CONCEPT_ICONS.cicd, level: 'Working Knowledge' },
      { name: 'Vercel', icon: 'https://cdn.simpleicons.org/vercel/ffffff', level: 'Proficient' },
      { name: 'Netlify', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/netlify/netlify-original.svg', level: 'Proficient' },
    ],
  },
  {
    name: 'Tools & Integrations',
    technologies: [
      { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', level: 'Advanced' },
      { name: 'GitHub', icon: 'https://cdn.simpleicons.org/github/ffffff', level: 'Advanced' },
      { name: 'Postman', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg', level: 'Advanced' },
      { name: 'Stripe', icon: 'https://www.svgrepo.com/show/331592/stripe-v2.svg', level: 'Proficient' },
      { name: 'Axios', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/axios/axios-plain.svg', level: 'Advanced' },
    ],
  },
  {
    name: 'AI & Developer Tools',
    technologies: [
      { name: 'Vapi.ai', icon: CONCEPT_ICONS.voice, level: 'Proficient' },
      { name: 'Bolna.ai', icon: CONCEPT_ICONS.audio, level: 'Proficient' },
      { name: 'OCR', icon: CONCEPT_ICONS.ocr, level: 'Proficient' },
      { name: 'RAG', icon: CONCEPT_ICONS.rag, level: 'Working Knowledge' },
      { name: 'Cursor AI', icon: 'https://cdn.simpleicons.org/cursor/ffffff', level: 'Advanced' },
      { name: 'Claude Code', icon: 'https://cdn.simpleicons.org/claude/D97757', level: 'Proficient' },
      { name: 'GitHub Copilot', icon: 'https://cdn.simpleicons.org/githubcopilot/ffffff', level: 'Proficient' },
    ],
  },
];

// Derive the numeric proficiency (bar width) from each technology's level so
// levels stay the single source of truth.
const categories: TechnologyCategory[] = rawCategories.map((cat) => ({
  name: cat.name,
  technologies: cat.technologies.map((t) => ({
    ...t,
    proficiency: LEVEL_WIDTH[t.level],
  })),
}));

// Gather all technologies for the 'All' tab, ensuring HTML, CSS, JavaScript come first, then all others in their original order (no duplicates)
const techOrder = ['HTML5', 'CSS3', 'JavaScript'];
const allTechsFlat = categories.flatMap(cat => cat.technologies);
const allTechnologies: Technology[] = [
  ...techOrder.map(name => allTechsFlat.find(t => t.name === name)).filter(isTechnology),
  ...allTechsFlat.filter(t => !techOrder.includes(t.name)),
];

// Add 'All' as a tab
const tabNames = ['All', ...categories.map(c => c.name)];

const Technologies: React.FC = () => {
  useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const technologiesRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Current technologies based on active category
  const currentTechnologies: Technology[] = useMemo(
    () =>
      activeCategory === 'All'
        ? allTechnologies
        : categories.find(c => c.name === activeCategory)?.technologies || [],
    [activeCategory]
  );

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tabChildren = Array.from(tabsRef.current?.children ?? []);
      const gridChildren = Array.from(gridRef.current?.children ?? []);

      // Respect reduced motion: reveal everything without the entrance choreography.
      if (prefersReducedMotion) {
        gsap.set([...tabChildren, ...gridChildren], { opacity: 1, rotationX: 0, rotationY: 0, scale: 1, z: 0 });
        gridChildren.forEach((card, index) => {
          const progressBar = card.querySelector('.progress-bar');
          if (progressBar) {
            gsap.set(progressBar, { width: `${currentTechnologies[index]?.proficiency ?? 0}%` });
          }
        });
        return;
      }

      // Initial load animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: technologiesRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      });

      // Animate tabs with a wave effect
      tl.fromTo(tabChildren,
        {
          opacity: 0,
          y: -30,
          rotationX: -90,
          transformOrigin: "center bottom"
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)"
        }
      );

      // Animate initial cards with 3D flip effect
      tl.fromTo(gridChildren,
        {
          opacity: 0,
          rotationY: -90,
          z: -100,
          scale: 0.8
        },
        {
          opacity: 1,
          rotationY: 0,
          z: 0,
          scale: 1,
          duration: 0.8,
          stagger: {
            grid: "auto",
            from: "center",
            amount: 0.6
          },
          ease: "power3.out"
        },
        "-=0.3"
      );

    }, technologiesRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Animation for category switching
  useEffect(() => {
    if (!gridRef.current) return;

    // Reduced motion: swap content instantly, keep bars filled.
    if (prefersReducedMotion) {
      const gridChildren = Array.from(gridRef.current.children);
      gsap.set(gridChildren, { opacity: 1, scale: 1, rotationY: 0 });
      currentTechnologies.forEach((tech, index) => {
        const progressBar = gridChildren[index]?.querySelector('.progress-bar');
        if (progressBar) gsap.set(progressBar, { width: `${tech.proficiency}%` });
      });
      return;
    }

    const ctx = gsap.context(() => {
      // Exit animation for current cards
      const exitTl = gsap.timeline();
      exitTl.to(Array.from(gridRef.current?.children ?? []), {
        opacity: 0,
        scale: 0.7,
        rotationY: 90,
        duration: 0.4,
        stagger: {
          grid: "auto",
          from: "edges",
          amount: 0.2
        },
        ease: "power2.in",
        onComplete: () => {
          const gridChildren = Array.from(gridRef.current?.children ?? []);

          // Enter animation for new cards
          gsap.set(gridChildren, {
            opacity: 0,
            scale: 0.7,
            rotationY: -90
          });

          gsap.to(gridChildren, {
            opacity: 1,
            scale: 1,
            rotationY: 0,
            duration: 0.6,
            stagger: {
              grid: "auto",
              from: "random",
              amount: 0.4
            },
            ease: "back.out(1.7)",
            delay: 0.1
          });

          // Animate skill bars
          currentTechnologies.forEach((tech, index) => {
            const progressBar = gridRef.current?.children[index]?.querySelector('.progress-bar');
            if (progressBar) {
              gsap.fromTo(progressBar,
                { width: '0%' },
                {
                  width: `${tech.proficiency}%`,
                  duration: 1.2,
                  delay: 0.3 + (index * 0.1),
                  ease: "power2.out"
                }
              );
            }
          });
        }
      });
    }, gridRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, currentTechnologies]);

  // Enhanced hover animations (refined for smoothness and subtlety)
  useEffect(() => {
    const cards = gridRef.current?.children;
    if (!cards) return;

    const disposers: Array<() => void> = [];

    Array.from(cards).forEach((card) => {
      // Hint the browser for better performance
      gsap.set(card, { willChange: 'transform' });

      const icon = card.querySelector('img');
      const progressBar = card.querySelector('.progress-bar');

      const handleMouseEnter = () => {
        gsap.to(card, {
          y: -6,
          scale: 1.04,
          rotationY: 2,
          rotationX: 2,
          z: 30,
          duration: 0.2,
          ease: "power2.out"
        });

        if (icon) {
          gsap.to(icon, {
            scale: 1.08,
            rotation: 8,
            duration: 0.25,
            ease: "power2.out"
          });
        }

        if (progressBar) {
          gsap.to(progressBar, {
            boxShadow: "0 0 12px rgba(var(--color-primary-rgb), 0.45)",
            duration: 0.2
          });
        }
      };

      const handleMouseLeave = () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          rotationY: 0,
          rotationX: 0,
          z: 0,
          duration: 0.25,
          ease: "power2.out"
        });

        if (icon) {
          gsap.to(icon, {
            scale: 1,
            rotation: 0,
            duration: 0.2,
            ease: "power2.out"
          });
        }

        if (progressBar) {
          gsap.to(progressBar, {
            boxShadow: "none",
            duration: 0.2
          });
        }
      };

      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mouseleave', handleMouseLeave);

      disposers.push(() => {
        card.removeEventListener('mouseenter', handleMouseEnter);
        card.removeEventListener('mouseleave', handleMouseLeave);
        gsap.killTweensOf(card);
        if (icon) gsap.killTweensOf(icon);
        if (progressBar) gsap.killTweensOf(progressBar);
      });
    });

    return () => {
      disposers.forEach((dispose) => dispose());
    };
  }, [currentTechnologies]);

  const handleCategoryChange = (category: string) => {
    if (category === activeCategory) return;

    // Add button click animation
    const clickedButton = tabsRef.current?.querySelector(`[data-category="${category}"]`);
    if (clickedButton) {
      gsap.to(clickedButton, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
    }

    setActiveCategory(category);
  };

  return (
    <AnimatedSection id="technologies" className="bg-background">
      <div className="container mx-auto">
        <SectionTitle
          title="Technologies"
          subtitle="Tools and technologies I use to build scalable web applications, AI-powered products, and production-ready systems."
          centered
        />

        <div ref={technologiesRef}>
          <div className="mb-10">
            <div ref={tabsRef} className="flex flex-wrap justify-center gap-3 sm:gap-4">
              {tabNames.map((tab) => (
                <button
                  key={tab}
                  data-category={tab}
                  onClick={() => handleCategoryChange(tab)}
                  className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base whitespace-nowrap transition-all duration-300 opacity-0 ${
                    activeCategory === tab
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-background-lighter text-text-secondary hover:bg-background-light'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="transition-all duration-500 block">
            <div
              ref={gridRef}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6"
              style={{ perspective: '1000px' }}
            >
              {currentTechnologies.map((tech) => (
                <div
                  key={`${activeCategory}-${tech?.name}`}
                  className="card flex flex-col items-center text-center hover:border-primary hover:border transition-all duration-300 opacity-0"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="w-16 h-16 mb-4 flex items-center justify-center">
                    <img src={tech?.icon} alt={tech?.name} className="w-12 h-12 object-contain" loading="lazy" />
                  </div>
                  <h4 className="font-medium text-sm sm:text-base leading-tight break-words px-1 min-h-[2.5rem] flex items-center justify-center">
                    {tech?.name}
                  </h4>
                  <div className="w-full bg-background-dark rounded-full h-2.5 mt-3 overflow-hidden">
                    <div
                      className="progress-bar bg-primary h-2.5 rounded-full"
                      style={{ width: '0%' }}
                    ></div>
                  </div>
                  <span className={`text-xs mt-2 font-medium ${LEVEL_COLOR[tech.level]}`}>
                    {tech?.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default Technologies;
