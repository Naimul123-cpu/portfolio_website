import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { Menu, X, Sun, Moon } from 'lucide-react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Study', href: '#study' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'py-4 glass border-b border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)]' 
          : 'py-8 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative group"
        >
          <a href="#" className="text-2xl font-display font-extrabold tracking-tight text-gradient bg-gradient-aurora animate-gradient-shift bg-[length:400%_400%]">
            NAIM.DEV
          </a>
          <div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-primary group-hover:w-full transition-all duration-500" />
        </motion.div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          <nav className="flex gap-10">
            {navLinks.map((link, i) => (
              <motion.a
                key={link.name}
                href={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative group text-text-secondary hover:text-text-primary transition-colors font-semibold text-[13px] uppercase tracking-[0.2em]"
              >
                {link.name}
                <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-gradient-primary group-hover:w-full transition-all duration-300 rounded-full" />
              </motion.a>
            ))}
          </nav>
          
          <div className="h-6 w-px bg-white/10 mx-2" />

          <button 
            onClick={toggleTheme}
            className="relative w-14 h-7 rounded-full glass p-1 flex items-center transition-all duration-500 group"
          >
            <motion.div 
              animate={{ x: theme === 'light' ? 0 : 28 }}
              className="w-5 h-5 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg shadow-accent-violet/30"
            >
              {theme === 'light' ? <Sun size={12} className="text-white" /> : <Moon size={12} className="text-white" />}
            </motion.div>
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-6">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-xl glass text-accent-violet"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button 
            className="w-10 h-10 flex items-center justify-center rounded-xl glass text-text-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="md:hidden glass border-b border-white/10 backdrop-blur-2xl overflow-hidden"
          >
            <div className="flex flex-col p-8 gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-text-secondary hover:text-accent-violet transition-all text-xl font-bold tracking-tight flex items-center justify-between group"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                  <div className="w-0 h-[2px] bg-gradient-primary group-hover:w-12 transition-all duration-300" />
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
