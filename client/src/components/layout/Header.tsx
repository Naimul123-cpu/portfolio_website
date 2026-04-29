import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Rocket } from 'lucide-react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
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
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${
        isScrolled 
          ? 'py-4 bg-bg-base/80 backdrop-blur-2xl border-b border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]' 
          : 'py-8 bg-transparent'
      }`}
    >
      {/* Scroll Progress Bar */}
      <motion.div 
        className="absolute top-0 left-0 h-[2px] bg-gradient-primary z-[110]"
        style={{ width: '100%', scaleX: 0, transformOrigin: '0%' }}
        animate={{ scaleX: 1 }}
      />

      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative group cursor-pointer"
        >
          <a href="#" className="text-2xl font-display font-black tracking-tighter flex items-center gap-1">
            <span className="text-gradient-aurora">NAIM</span>
            <span className="text-text-primary">.DEV</span>
            <motion.span 
              animate={{ opacity: [1, 0, 1] }} 
              transition={{ duration: 1, repeat: Infinity }}
              className="w-[8px] h-[24px] bg-accent-violet ml-1"
            />
          </a>
        </motion.div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-10">
          <div className="flex gap-10">
            {navLinks.map((link, i) => (
              <motion.a
                key={link.name}
                href={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative group text-[11px] font-black uppercase tracking-[0.3em] text-text-muted hover:text-text-primary transition-colors"
              >
                {link.name}
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-primary group-hover:w-full transition-all duration-500 rounded-full" />
              </motion.a>
            ))}
          </div>
          
          <div className="h-6 w-px bg-white/10 mx-2" />

          <button 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest overflow-hidden border border-white/10 hover:border-accent-violet/50 transition-all"
          >
            <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity" />
            <span className="relative flex items-center gap-2">
              Consult Expert <Rocket size={14} className="text-accent-violet group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </span>
          </button>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden w-12 h-12 flex items-center justify-center rounded-2xl glass border border-white/10 text-text-primary"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[200] bg-bg-base/95 backdrop-blur-3xl lg:hidden flex flex-col"
          >
            <div className="flex justify-between items-center p-8 border-b border-white/5">
              <span className="text-2xl font-display font-black text-gradient-aurora">NAIM.DEV</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-text-primary">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-grow flex flex-col justify-center p-12 gap-10">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-4xl font-black text-text-primary hover:text-accent-violet transition-all tracking-tighter"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </motion.a>
              ))}
            </div>

            <div className="p-12 border-t border-white/5">
              <button className="w-full py-5 bg-gradient-primary rounded-[32px] font-black text-xs uppercase tracking-[0.3em] shadow-glow-violet">
                Initialize Consultation
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
