import React, { useEffect, useRef } from 'react';
import { Github, Linkedin, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Link as ScrollLink } from 'react-scroll';
import gsap from 'gsap';

const Footer: React.FC = () => {


  const socialLinks = [
    { icon: <Github size={20} />, href: 'https://github.com/Mian-Tahir', label: 'GitHub' },
    { icon: <Linkedin size={20} />, href: 'https://www.linkedin.com/in/m-tahir-mahmood/', label: 'LinkedIn' },
    { icon: <Twitter size={20} />, href: 'https://x.com/ta15159_tahir?t=IXP5Q-qg6622SnBJCPgGZw&s=09', label: 'Twitter' },
    { icon: <Mail size={20} />, href: 'https://mail.google.com/mail/?view=cm&to=tahirmehmood1827@gmail.com', label: 'Email' },
  ];

  const quickLinks = [
    { name: 'Home', to: 'hero' },
    { name: 'About', to: 'about' },
    { name: 'Skills', to: 'technologies' },
    { name: 'Services', to: 'services' },
    { name: 'Portfolio', to: 'portfolio' },
    { name: 'Contact', to: 'contact' },
  ];

  const socialRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const children = socialRef.current?.children;
    if (!children || children.length === 0) return;

    const elements = Array.from(children) as HTMLElement[];
    const disposers: Array<() => void> = [];

    elements.forEach((el) => {
      gsap.set(el, { willChange: 'transform' });

      const onEnter = () => {
        gsap.to(el, {
          y: -4,
          scale: 1.08,
          boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
          duration: 0.18,
          ease: 'power2.out'
        });
      };

      const onLeave = () => {
        gsap.to(el, {
          y: 0,
          scale: 1,
          boxShadow: 'none',
          duration: 0.18,
          ease: 'power2.out'
        });
      };

      const onPress = () => {
        gsap.to(el, {
          scale: 0.96,
          duration: 0.08,
          ease: 'power2.inOut',
          yoyo: true,
          repeat: 1
        });
      };

      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
      el.addEventListener('mousedown', onPress);
      el.addEventListener('touchstart', onPress, { passive: true } as AddEventListenerOptions);

      disposers.push(() => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
        el.removeEventListener('mousedown', onPress);
        el.removeEventListener('touchstart', onPress);
        gsap.killTweensOf(el);
      });
    });

    return () => {
      disposers.forEach((dispose) => dispose());
    };
  }, []);

  return (
    <footer className="bg-background-lighter pt-12 pb-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="text-2xl font-bold text-white">
              <span className="text-primary mr-1">&lt;</span>
              Tahir Mehmood
              <span className="text-primary">/&gt;</span>
            </div>
            <p className="text-text-secondary max-w-md">
              Building innovative web solutions with modern technologies. Let's work together to bring your ideas to life.
            </p>
            <div ref={socialRef} className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-background-dark flex items-center justify-center text-text-secondary hover:text-primary hover:bg-background transition-colors duration-300"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <ScrollLink
                    to={link.to}
                    spy={true}
                    smooth={true}
                    offset={-80}
                    duration={500}
                    className="text-text-secondary hover:text-primary transition-colors duration-300 cursor-pointer"
                  >
                    {link.name}
                  </ScrollLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Contact Info</h3>
            <ul className="space-y-4 text-text-secondary">
              <li className="flex items-center gap-2">
                <Mail size={24} className="text-primary" />
                <span>tahirmehmood1827@gmail.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={24} className="text-primary" />
                <span>+92 306 1436931</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={24} className="text-primary" />
                <span>Gojra, Punjab, Pakistan</span>
              </li>
            </ul>
          </div>
        </div>

       

<div>
        <div className="pt-8 border-t border-gray-800 text-center text-text-secondary">
          <p> Designed and Developed by <span className="text-primary font-semibold">Tahir Mehmood</span> - Full Stack Developer</p>
        </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;