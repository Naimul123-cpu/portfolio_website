import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { ArrowRight, Download } from 'lucide-react';
import type { IProfile } from '../../types';

interface HeroSectionProps {
  profile: IProfile | null;
}

const HeroSection: React.FC<HeroSectionProps> = ({ profile }) => {
  const roles = ["Civil Engineer", "Structural Designer", "Project Manager", "Site Supervisor"];
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any } 
    },
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none" />
      
      <div className="container mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12 items-center z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative order-2 lg:order-1"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-accent-cyan shadow-glow-cyan/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-cyan"></span>
              </span>
              Available for new projects ✦
            </span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl md:text-8xl font-display font-black leading-[0.9] mb-6 text-text-primary">
            I'm <span className="text-gradient-aurora block mt-4">{profile?.name || 'Engineer'}</span>
          </motion.h1>

          <motion.div variants={itemVariants} className="min-h-[3rem] mb-8">
            <AnimatePresence mode="wait">
              <motion.p
                key={roleIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-2xl md:text-3xl font-bold text-gradient-secondary"
              >
                {roles[roleIndex]}
              </motion.p>
            </AnimatePresence>
          </motion.div>
          
          <motion.p variants={itemVariants} className="text-lg text-text-secondary/80 mb-10 max-w-lg leading-relaxed font-medium">
            {profile?.bio || "Expert in structural integrity and modern engineering solutions. Transforming complex blueprints into resilient, high-performance infrastructure."}
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-wrap gap-5 mb-12">
            <button 
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative px-8 py-4 bg-gradient-primary rounded-2xl font-black text-sm tracking-widest uppercase overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-glow-violet"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
              <span className="relative flex items-center gap-2">
                Launch Projects <ArrowRight size={18} />
              </span>
            </button>
            
            <button 
              onClick={() => profile?.resumeUrl && window.open(profile.resumeUrl, '_blank')}
              className="px-8 py-4 glass border border-white/10 rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-white/5 transition-all flex items-center gap-2 group"
            >
              System Profile <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
            </button>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex gap-6">
            {[
              { icon: <FaGithub size={22} />, link: profile?.socialLinks.github, color: 'hover:text-white', glow: 'hover:shadow-glow-violet' },
              { icon: <FaLinkedin size={22} />, link: profile?.socialLinks.linkedin, color: 'hover:text-accent-cyan', glow: 'hover:shadow-glow-cyan' },
              { icon: <FaTwitter size={22} />, link: profile?.socialLinks.twitter, color: 'hover:text-accent-blue', glow: 'hover:shadow-glow-blue' },
            ].map((social, i) => social.link && (
              <a
                key={i}
                href={social.link}
                target="_blank"
                rel="noreferrer"
                className={`w-12 h-12 flex items-center justify-center glass rounded-2xl text-text-muted transition-all duration-300 ${social.color} ${social.glow}`}
              >
                {social.icon}
              </a>
            ))}
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as any }}
          className="relative order-1 lg:order-2 flex justify-center lg:justify-end"
        >
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-[500px] md:h-[500px]">
            {/* Rotating Cyber Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-accent-violet/30 animate-spin [animation-duration:20s]" />
            <div className="absolute inset-8 rounded-full border border-dashed border-accent-cyan/20 animate-spin [animation-duration:15s] [animation-direction:reverse]" />
            
            {/* Outer Glows */}
            <div className="absolute -inset-10 bg-accent-violet/10 blur-[100px] rounded-full animate-pulse-slow" />
            <div className="absolute inset-20 bg-accent-cyan/10 blur-[80px] rounded-full animate-pulse-slow [animation-delay:1s]" />

            {/* Orbiting Tech Nodes */}
            {[
              { name: 'AutoCAD', delay: '0s', color: 'accent-cyan', icon: '📐' },
              { name: 'Revit', delay: '-5s', color: 'accent-violet', icon: '🏗️' },
              { name: 'SAP2000', delay: '-10s', color: 'accent-pink', icon: '📊' }
            ].map((tech, i) => (
              <div key={i} className="absolute inset-0 animate-orbit" style={{ animationDelay: tech.delay }}>
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 glass p-4 rounded-2xl border border-white/10 shadow-2xl bg-bg-card/80 backdrop-blur-xl flex items-center gap-3`}>
                  <span className="text-xl">{tech.icon}</span>
                  <span className={`text-[10px] font-black uppercase tracking-widest text-${tech.color}`}>{tech.name}</span>
                </div>
              </div>
            ))}

            {/* Avatar Frame */}
            <div className="absolute inset-4 rounded-[60px] md:rounded-[80px] overflow-hidden border-8 border-bg-surface bg-bg-card relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.8)] group">
              {profile?.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              ) : (
                <div className="w-full h-full bg-gradient-primary flex items-center justify-center text-white text-9xl font-display font-black">
                  {profile?.name?.charAt(0) || 'N'}
                </div>
              )}
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-bg-base/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Stats Badges */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 glass p-6 rounded-[32px] border border-white/10 shadow-glow-violet z-20 backdrop-blur-3xl min-w-[140px]"
            >
              <p className="text-3xl font-black text-text-primary tracking-tighter">03+</p>
              <p className="text-[9px] font-black text-accent-violet uppercase tracking-[0.2em] mt-1">Exp. Cycle</p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-6 -left-6 glass p-6 rounded-[32px] border border-white/10 shadow-glow-cyan z-20 backdrop-blur-3xl min-w-[140px]"
            >
              <p className="text-3xl font-black text-text-primary tracking-tighter">50+</p>
              <p className="text-[9px] font-black text-accent-cyan uppercase tracking-[0.2em] mt-1">Deployments</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none"
      >
        <div className="w-[30px] h-[50px] border-2 border-white/10 rounded-full flex justify-center p-2 backdrop-blur-md">
          <motion.div 
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-gradient-primary rounded-full shadow-glow-violet" 
          />
        </div>
        <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em]">Vertical Drift</span>
      </motion.div>
    </section>
  );
};

export default HeroSection;
