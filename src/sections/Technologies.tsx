import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import AnimatedSection from '../components/AnimatedSection';
import SectionTitle from '../components/SectionTitle';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Technology {
  name: string;
  icon: string;
  proficiency: number;
}

interface TechnologyCategory {
  name: string;
  technologies: Technology[];
}

const isTechnology = (t: Technology | undefined): t is Technology => Boolean(t);

const Technologies: React.FC = () => {
  useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const technologiesRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const categories: TechnologyCategory[] = [
    {
      name: 'Frontend',
      technologies: [
        { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', proficiency: 95 },
        { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', proficiency: 70 },
        { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', proficiency: 95 },
        { name: 'Tailwind CSS', icon: 'https://www.svgrepo.com/show/333609/tailwind-css.svg', proficiency: 90 },
        { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', proficiency: 85 },
        { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', proficiency: 95 },
        { name: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', proficiency: 90 },
        { name: 'Redux', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg', proficiency: 85 },
      ],
    },
    {
      name: 'Backend',
      technologies: [
        { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', proficiency: 90 },
        { name: 'Express.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', proficiency: 90 },
        { name: 'REST API', icon: 'https://www.svgrepo.com/show/88703/api.svg', proficiency: 85 },
        { name: 'GraphQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg', proficiency: 80 },
        { name: 'AWS S3 (S3 Bucket)', icon: 'https://www.svgrepo.com/show/448266/aws.svg', proficiency: 80 },
        { name: 'Stripe', icon: 'https://www.svgrepo.com/show/331592/stripe-v2.svg', proficiency: 80 },
      ],
    },
    {
      name: 'Database',
      technologies: [
        { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', proficiency: 90 },
        { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', proficiency: 85 },
        { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', proficiency: 80 },
        { name: 'Supabase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg', proficiency: 85 },
      ],
    },
  ];

  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Gather all technologies for the 'All' tab, ensuring HTML, CSS, JavaScript come first, then all others in their original order (no duplicates)
  const techOrder = ['HTML5', 'CSS3', 'JavaScript'];
  const allTechsFlat = categories.flatMap(cat => cat.technologies);
  const allTechnologies: Technology[] = [
    ...techOrder.map(name => allTechsFlat.find(t => t.name === name)).filter(isTechnology),
    ...allTechsFlat.filter(t => !techOrder.includes(t.name)),
  ];

  // Add 'All' as a tab
  const tabNames = ['All', ...categories.map(c => c.name)];

  // Current technologies based on active category
  const currentTechnologies: Technology[] = activeCategory === 'All' 
    ? allTechnologies
    : categories.find(c => c.name === activeCategory)?.technologies || [];

  useEffect(() => {
    const ctx = gsap.context(() => {
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
      tl.fromTo(Array.from(tabsRef.current?.children ?? []), 
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
      tl.fromTo(Array.from(gridRef.current?.children ?? []), 
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
  }, []);

  // Animation for category switching
  useEffect(() => {
    if (!gridRef.current) return;

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
          subtitle="Here are the technologies I work with, categorized by expertise."
          centered
        />

        <div ref={technologiesRef}>
          <div className="mb-10">
            <div ref={tabsRef} className="flex flex-wrap justify-center gap-4">
              {tabNames.map((tab) => (
                <button
                  key={tab}
                  data-category={tab}
                  onClick={() => handleCategoryChange(tab)}
                  className={`px-6 py-3 rounded-full transition-all duration-300 opacity-0 ${
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
                    <img src={tech?.icon} alt={tech?.name} className="w-12 h-12" />
                  </div>
                  <h4 className="font-medium">{tech?.name}</h4>
                  <div className="w-full bg-background-dark rounded-full h-2.5 mt-3 overflow-hidden">
                    <div
                      className="progress-bar bg-primary h-2.5 rounded-full"
                      style={{ width: '0%' }}
                    ></div>
                  </div>
                  <span className="text-text-secondary text-sm mt-2">{tech?.proficiency}%</span>
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