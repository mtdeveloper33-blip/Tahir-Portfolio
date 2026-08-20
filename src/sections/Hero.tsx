import React, { useEffect, useRef } from 'react';
import { Download, ArrowRight } from 'lucide-react';
import { Link as ScrollLink } from 'react-scroll';
import ParticleBackground from '../components/ParticleBackground';
import { Typewriter } from 'react-simple-typewriter';
import gsap from 'gsap';

const techIcons = [
  { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
  { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
  { name: 'Express.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
  { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
];

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const helloRef = useRef<HTMLSpanElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const techStackRef = useRef<HTMLDivElement>(null);
  const techItemsRef = useRef<HTMLDivElement>(null);
  const profileImageRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Main content animation - top to bottom step by step
    const tl = gsap.timeline();
    
    // Animate hello text
    tl.fromTo(helloRef.current, 
      { opacity: 0, y: -50 }, 
      { opacity: 1, y: 0, duration: 0.6 }
    );
    
    // Animate name
    tl.fromTo(nameRef.current, 
      { opacity: 0, y: -50 }, 
      { opacity: 1, y: 0, duration: 0.6 },
      "-=0.3"
    );
    
    // Animate title
    tl.fromTo(titleRef.current, 
      { opacity: 0, y: -50 }, 
      { opacity: 1, y: 0, duration: 0.6 },
      "-=0.3"
    );
    
    // Animate description
    tl.fromTo(descriptionRef.current, 
      { opacity: 0, y: -50 }, 
      { opacity: 1, y: 0, duration: 0.7 },
      "-=0.3"
    );
    
    // Animate buttons
    tl.fromTo(buttonsRef.current, 
      { opacity: 0, y: -50 }, 
      { opacity: 1, y: 0, duration: 0.7 },
      "-=0.3"
    );
    
    // Animate tech stack title
    tl.fromTo(techStackRef.current, 
      { opacity: 0, y: -50 }, 
      { opacity: 1, y: 0, duration: 0.7 },
      "-=0.3"
    );
    
    // Animate tech icons
    const techItems = techItemsRef.current?.children;
    if (techItems && techItems.length > 0) {
      tl.fromTo(Array.from(techItems), 
        { opacity: 0, y: -50 }, 
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 },
        "-=0.3"
      );
    }
    
    // Profile image animation - dot to full size with infinite movement
    gsap.fromTo(profileImageRef.current, 
      { scale: 0.01, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 2.5, ease: "power2.out", delay: 0.5 }
    );
    
    // Infinite subtle movement animation
    gsap.to(profileImageRef.current, {
      y: 10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    
  }, []);

  // Micro-interactions: Buttons hover/click
  useEffect(() => {
    const btnChildren = buttonsRef.current?.children;
    if (!btnChildren || btnChildren.length === 0) return;

    const elements = Array.from(btnChildren) as HTMLElement[];
    const disposers: Array<() => void> = [];

    elements.forEach((el) => {
      gsap.set(el, { willChange: 'transform' });

      const handleEnter = () => {
        gsap.to(el, {
          y: -4,
          scale: 1.03,
          boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
          duration: 0.2,
          ease: 'power2.out'
        });
      };

      const handleLeave = () => {
        gsap.to(el, {
          y: 0,
          scale: 1,
          boxShadow: 'none',
          duration: 0.2,
          ease: 'power2.out'
        });
      };

      const handlePress = () => {
        gsap.to(el, {
          scale: 0.97,
          duration: 0.08,
          ease: 'power2.inOut',
          yoyo: true,
          repeat: 1
        });
      };

      el.addEventListener('mouseenter', handleEnter);
      el.addEventListener('mouseleave', handleLeave);
      el.addEventListener('mousedown', handlePress);
      el.addEventListener('touchstart', handlePress, { passive: true } as AddEventListenerOptions);

      disposers.push(() => {
        el.removeEventListener('mouseenter', handleEnter);
        el.removeEventListener('mouseleave', handleLeave);
        el.removeEventListener('mousedown', handlePress);
        el.removeEventListener('touchstart', handlePress);
        gsap.killTweensOf(el);
      });
    });

    return () => {
      disposers.forEach((dispose) => dispose());
    };
  }, []);

  // Micro-interactions: Tech stack icons hover
  useEffect(() => {
    const items = techItemsRef.current?.children;
    if (!items || items.length === 0) return;

    const elements = Array.from(items) as HTMLElement[];
    const disposers: Array<() => void> = [];

    elements.forEach((item) => {
      const bubble = item.querySelector('div');
      const img = item.querySelector('img');

      if (!bubble || !img) return;

      gsap.set([item, bubble, img], { willChange: 'transform' });

      const onEnter = () => {
        gsap.to(bubble, {
          y: -6,
          scale: 1.08,
          rotation: 6,
          boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
          duration: 0.2,
          ease: 'power2.out'
        });
        gsap.to(img, {
          scale: 1.06,
          rotation: 6,
          duration: 0.2,
          ease: 'power2.out'
        });
      };

      const onLeave = () => {
        gsap.to(bubble, {
          y: 0,
          scale: 1,
          rotation: 0,
          boxShadow: 'none',
          duration: 0.2,
          ease: 'power2.out'
        });
        gsap.to(img, {
          scale: 1,
          rotation: 0,
          duration: 0.2,
          ease: 'power2.out'
        });
      };

      item.addEventListener('mouseenter', onEnter);
      item.addEventListener('mouseleave', onLeave);
      disposers.push(() => {
        item.removeEventListener('mouseenter', onEnter);
        item.removeEventListener('mouseleave', onLeave);
        gsap.killTweensOf([item, bubble, img]);
      });
    });

    return () => {
      disposers.forEach((dispose) => dispose());
    };
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-20" ref={heroRef}>
      <ParticleBackground />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col space-y-6" ref={introRef}>
            <div className="space-y-3">
              <span ref={helloRef} className="text-primary font-medium">
                Hello, I'm
              </span>
              <h1 ref={nameRef} className="text-4xl sm:text-5xl lg:text-6xl font-bold">
                Tahir Mehmood
              </h1>
              <h2 ref={titleRef} className="text-2xl sm:text-3xl text-primary font-bold">
                <Typewriter
                  words={[
                    'Full Stack Developer',
                    'Frontend Developer',
                    'MERN Stack Developer',
                    'Backend Developer'
                  ]}
                  loop={0}
                  cursor
                  cursorStyle="|"
                  typeSpeed={70}
                  deleteSpeed={50}
                  delaySpeed={1500}
                />
              </h2>
              <p ref={descriptionRef} className="text-text-secondary max-w-xl mt-4">
               I like building things from the ground up—taking an idea, figuring out how it should work, and turning it into a product that feels simple to use.

Over the past 2.5+ years, I’ve worked across the full stack, building web applications and AI-powered products with React.js, Next.js, TypeScript, Node.js, and modern databases.

For me, good software isn’t just about making features work. It’s about solving the right problem, keeping the code maintainable, and creating an experience that makes the complexity feel invisible.

              </p>
            </div>

            <div ref={buttonsRef}  className="flex flex-wrap gap-4">
              <ScrollLink
                to="contact"
                spy={true}
                smooth={true}
                offset={-80}
                duration={500}
                className="btn-primary cursor-pointer"
              >
                Hire Me <ArrowRight className="ml-2 " size={18} />
              </ScrollLink>
              <a href="/Tahir_Mehmood_CV.pdf" className="btn-primary" download>
                Download CV <Download className="ml-2" size={18} />
              </a>
            </div>

            <div ref={techStackRef}>
              <p className="text-text-secondary mb-3">Tech Stack</p>
              <div ref={techItemsRef} className="flex flex-wrap gap-6">
                {techIcons.map((tech) => (
                  <div
                    key={tech.name}
                    className="flex flex-col items-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-background-lighter p-2 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110">
                      <img 
                        src={tech.icon} 
                        alt={tech.name} 
                        className="w-8 h-8 object-contain" 
                      />
                    </div>
                    <span className="text-xs text-text-secondary mt-2">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden lg:flex justify-center items-center">
            <div className="relative" ref={profileImageRef}>
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl opacity-30"></div>
              <div className="w-80 h-80 sm:w-96 sm:h-96 rounded-full overflow-hidden border-4 border-primary/30 relative z-10">
                <img
                  src="/profile.jpeg"
                  alt="Tahir Mehmood"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;