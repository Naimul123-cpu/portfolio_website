import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { ArrowRight, Download, Terminal } from 'lucide-react';
import type { IProfile } from '../../types';
import GlowButton from '../ui/GlowButton';

interface HeroSectionProps {
  profile: IProfile | null;
}

const HeroSection: React.FC<HeroSectionProps> = ({ profile }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] as any } },
  };

  return (
    <section className="relative min-h-screen flex items-center pt-24 overflow-hidden">
      {/* Decorative Grid */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-16 items-center z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative"
        >
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
            <span className="flex items-center gap-2 px-4 py-1.5 glass rounded-full border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-accent-violet">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-violet opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-violet"></span>
              </span>
              ✦ Available for Projects ✦
            </span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-7xl md:text-8xl font-display font-black leading-[1] mb-8 text-text-primary">
            I'm <span className="text-gradient bg-gradient-aurora animate-gradient-shift bg-[length:400%_400%] block mt-2">{profile?.name || 'Developer'}</span>
          </motion.h1>

          <motion.div variants={itemVariants} className="flex items-center gap-3 text-2xl md:text-3xl font-bold text-text-secondary mb-10 h-12">
            <Terminal size={28} className="text-accent-violet" />
            <span className="text-text-primary">Full-Stack Engineer</span>
          </motion.div>
          
          <motion.p variants={itemVariants} className="text-lg text-text-secondary mb-12 max-w-xl leading-relaxed font-medium tracking-wide">
            {profile?.bio || "Building high-performance digital experiences with a focus on modern aesthetics and technical precision. Let's turn your vision into a stunning reality."}
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-wrap gap-6 mb-12">
            <GlowButton onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
              View My Work <ArrowRight size={18} className="inline ml-2" />
            </GlowButton>
            {profile?.resumeUrl && (
              <GlowButton variant="outline" onClick={() => window.open(profile.resumeUrl, '_blank')}>
                Resume <Download size={18} className="inline ml-2" />
              </GlowButton>
            )}
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex gap-4">
            {[
              { icon: <FaGithub size={22} />, link: profile?.socialLinks.github, color: 'hover:shadow-glow-violet' },
              { icon: <FaLinkedin size={22} />, link: profile?.socialLinks.linkedin, color: 'hover:shadow-glow-blue' },
              { icon: <FaTwitter size={22} />, link: profile?.socialLinks.twitter, color: 'hover:shadow-glow-cyan' },
            ].map((social, i) => social.link && (
              <motion.a
                key={i}
                href={social.link}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.1, y: -4 }}
                className={`w-12 h-12 flex items-center justify-center glass rounded-2xl text-text-secondary hover:text-text-primary transition-all duration-300 ${social.color}`}
              >
                {social.icon}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] as any }}
          className="relative flex justify-center lg:justify-end"
        >
          <div className="relative w-80 h-80 md:w-[450px] md:h-[450px]">
            {/* Rotating Conic Border */}
            <div className="absolute inset-0 p-[2px] rounded-full bg-gradient-aurora animate-spin [animation-duration:8s] opacity-50 blur-sm" />
            <div className="absolute inset-2 p-[1px] rounded-full bg-gradient-aurora animate-spin [animation-duration:12s] [animation-direction:reverse]" />
            
            {/* Outer Glow */}
            <div className="absolute inset-0 bg-accent-violet/20 blur-[60px] rounded-full animate-pulse-slow" />

            {/* Orbiting Tech Icons */}
            <div className="absolute inset-0 animate-orbit pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 p-3 glass rounded-xl border border-white/10 shadow-glow-violet bg-bg-card">
                <span className="text-xs font-black text-accent-violet uppercase">React</span>
              </div>
            </div>
            <div className="absolute inset-0 animate-orbit [animation-delay:-5s] pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 p-3 glass rounded-xl border border-white/10 shadow-glow-blue bg-bg-card">
                <span className="text-xs font-black text-accent-blue uppercase">Node</span>
              </div>
            </div>
            <div className="absolute inset-0 animate-orbit [animation-delay:-10s] pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 p-3 glass rounded-xl border border-white/10 shadow-glow-cyan bg-bg-card">
                <span className="text-xs font-black text-accent-cyan uppercase">Next.js</span>
              </div>
            </div>

            {/* Avatar Container */}
            <div className="absolute inset-4 rounded-full overflow-hidden border-4 border-bg-surface bg-bg-card shadow-2xl relative z-10 group">
              {profile?.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              ) : (
                <div className="w-full h-full bg-gradient-aurora flex items-center justify-center text-white text-9xl font-display font-black">
                  {profile?.name?.charAt(0) || 'N'}
                </div>
              )}
            </div>

            {/* Floating Info Cards */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 glass p-6 rounded-3xl border border-white/10 shadow-glow-violet z-20 backdrop-blur-3xl"
            >
              <p className="text-2xl font-black text-text-primary">3+</p>
              <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Years Exp.</p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-4 -left-4 glass p-6 rounded-3xl border border-white/10 shadow-glow-blue z-20 backdrop-blur-3xl"
            >
              <p className="text-2xl font-black text-text-primary">50+</p>
              <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Projects</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <div className="w-6 h-10 border-2 border-text-muted rounded-full flex justify-center p-1">
          <div className="w-1.5 h-1.5 bg-accent-violet rounded-full" />
        </div>
        <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Scroll</span>
      </motion.div>
    </section>
  );
};

export default HeroSection;
