import React, { useState } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

const navLinks = [
  { name: 'Home', to: 'hero', offset: 0 },
  { name: 'About', to: 'about', offset: -80 },
  { name: 'Skills', to: 'technologies', offset: -80 },
  { name: 'Services', to: 'services', offset: -80 },
  { name: 'Portfolio', to: 'portfolio', offset: -80 },
  { name: 'Contact', to: 'contact', offset: -80 },
];

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header
      className={`fixed inset-x-0 top-4 z-50 pointer-events-none transition-all duration-300 px-2 sm:px-4`}
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pointer-events-auto rounded-3xl bg-background/95 background-transparent backdrop-blur-md shadow-xl px-4 py-3 sm:px-6 sm:py-5 mx-auto max-w-sm sm:max-w-2xl md:max-w-7xl flex items-center justify-between border-2 border-primary/40"
      >
        <ScrollLink
          to="hero"
          spy={true}
          smooth={true}
          offset={0}
          duration={500}
          className="text-lg sm:text-xl md:text-2xl cursor-pointer font-bold text-white flex items-center mr-2 sm:mr-4"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <span className="text-primary mr-1">&lt;</span>
            Tahir Mehmood
            <span className="text-primary">/&gt;</span>
          </motion.div>
        </ScrollLink>

        {/* Desktop Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden md:flex space-x-8"
        >
          {navLinks.map((link) => (
            <ScrollLink
              key={link.name}
              to={link.to}
              spy={true}
              smooth={true}
              offset={link.offset}
              duration={500}
              className="text-text-primary hover:text-primary cursor-pointer transition-colors duration-300 font-medium"
            >
              {link.name}
            </ScrollLink>
          ))}
        </motion.nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center ml-auto">
          <button
            onClick={toggleMenu}
            className="text-white p-2 focus:outline-none transition-colors duration-300"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.div>

      {/* Mobile Navigation */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isOpen ? 1 : 0,
          height: isOpen ? 'auto' : 0,
        }}
        transition={{ duration: 0.3 }}
        className="md:hidden overflow-hidden"
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      >
        <div className="rounded-2xl bg-background mx-auto max-w-sm sm:bg-background-lighter shadow-lg px-3 py-3 sm:px-6 sm:py-4 mt-2 sm:max-w-2xl md:max-w-7xl">
          {navLinks.map((link) => (
            <ScrollLink
              key={link.name}
              to={link.to}
              spy={true}
              smooth={true}
              offset={link.offset}
              duration={500}
              onClick={closeMenu}
              className="block text-text-primary hover:text-primary transition-colors duration-300 font-medium py-2"
            >
              {link.name}
            </ScrollLink>
          ))}
        </div>
      </motion.div>
    </header>
  );
};

export default Header;