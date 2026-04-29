import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter, FaFacebook, FaInstagram, FaYoutube, FaDiscord } from 'react-icons/fa';
import { ArrowRight } from 'lucide-react';
import type { IProfile } from '../../types';

interface HeroSectionProps {
  profile: IProfile | null;
}

const HeroSection: React.FC<HeroSectionProps> = ({ profile }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="text-accent-primary font-medium tracking-[0.2em] text-xs uppercase mb-6">
            Based in Bangladesh
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-6xl md:text-7xl font-display font-semibold leading-[1.1] mb-8 text-text-primary">
            I craft <span className="italic font-serif text-accent-primary">purposeful</span> digital experiences.
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg text-text-secondary mb-10 max-w-lg leading-relaxed font-light">
            My name is {profile?.name || 'Developer'}. I'm a full-stack engineer focused on building clean, user-centric, and efficient software solutions.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-wrap gap-6 mb-12">
            <a href="#projects" className="group flex items-center gap-2 text-text-primary font-semibold hover:text-accent-primary transition-colors">
              Explore my work <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            {profile?.resumeUrl && (
              <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="text-text-secondary hover:text-text-primary transition-colors font-medium border-b border-transparent hover:border-text-primary py-0.5">
                Download Resume
              </a>
            )}
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex gap-6 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
            {profile?.socialLinks.github && (
              <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="text-text-secondary hover:text-accent-primary transition-colors">
                <FaGithub size={20} />
              </a>
            )}
            {profile?.socialLinks.linkedin && (
              <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-text-secondary hover:text-accent-primary transition-colors">
                <FaLinkedin size={20} />
              </a>
            )}
            {profile?.socialLinks.twitter && (
              <a href={profile.socialLinks.twitter} target="_blank" rel="noreferrer" className="text-text-secondary hover:text-accent-primary transition-colors">
                <FaTwitter size={20} />
              </a>
            )}
            {profile?.socialLinks.facebook && (
              <a href={profile.socialLinks.facebook} target="_blank" rel="noreferrer" className="text-text-secondary hover:text-accent-primary transition-colors">
                <FaFacebook size={20} />
              </a>
            )}
            {profile?.socialLinks.instagram && (
              <a href={profile.socialLinks.instagram} target="_blank" rel="noreferrer" className="text-text-secondary hover:text-accent-primary transition-colors">
                <FaInstagram size={20} />
              </a>
            )}
            {profile?.socialLinks.youtube && (
              <a href={profile.socialLinks.youtube} target="_blank" rel="noreferrer" className="text-text-secondary hover:text-accent-primary transition-colors">
                <FaYoutube size={20} />
              </a>
            )}
            {profile?.socialLinks.discord && (
              <a href={profile.socialLinks.discord} target="_blank" rel="noreferrer" className="text-text-secondary hover:text-accent-primary transition-colors">
                <FaDiscord size={20} />
              </a>
            )}
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative flex justify-center lg:justify-end"
        >
          <div className="relative w-72 h-80 md:w-96 md:h-[480px]">
            {/* Background Shape */}
            <div className="absolute inset-0 bg-accent-primary/5 rounded-[40px] rotate-3" />
            
            {/* Avatar Image Container */}
            <div className="absolute inset-0 rounded-[40px] overflow-hidden border border-border shadow-2xl bg-bg-card transition-transform hover:-rotate-1 duration-700">
              {profile?.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-bg-secondary flex items-center justify-center text-accent-violet text-6xl font-display">
                  {profile?.name?.charAt(0) || 'N'}
                </div>
              )}
            </div>
            
            {/* Minimalist Floating Label */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -right-6 bg-bg-card px-6 py-4 rounded-2xl border border-border shadow-xl z-20"
            >
              <p className="text-xs text-text-secondary uppercase tracking-widest mb-1">Current Focus</p>
              <p className="text-sm font-bold text-text-primary">React & Node.js</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Simple Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-30"
      >
        <div className="w-px h-16 bg-text-primary" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
