import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import { ArrowRight, DraftingCompass, Globe, Star, HardHat } from 'lucide-react';
import SectionTitle from '../ui/SectionTitle';
import SectionIllustration from '../ui/SectionIllustration';
import GlowButton from '../ui/GlowButton';
import AnimatedCard from '../ui/AnimatedCard';
import type { IProject } from '../../types';

interface ProjectsSectionProps {
  projects: IProject[];
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const [filter, setFilter] = useState('all');
  
  const categories = ['all', ...Array.from(new Set(projects.map(p => p.category)))];
  
  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="py-32 relative overflow-hidden">
      <SectionIllustration icon={<DraftingCompass />} className="opacity-10" />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <SectionTitle 
          eyebrow="ENGINEERING"
          title="Structural <Solutions>" 
          subtitle="A showcase of infrastructure projects, site management, and technical blueprints."
        />
        
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-20">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 border ${
                filter === cat 
                  ? 'bg-gradient-primary text-white border-transparent shadow-glow-violet scale-105' 
                  : 'glass text-text-secondary hover:text-text-primary border-white/5 hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredProjects.sort((a, b) => Number(b.order) - Number(a.order)).map((project, i) => (
              <motion.div
                key={project._id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <AnimatedCard className="p-0 h-full flex flex-col group overflow-hidden">
                  {/* Thumbnail */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img 
                      src={project.thumbnail || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800'} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-bg-base/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-6">
                      {project.githubUrl && (
                        <motion.a 
                          whileHover={{ scale: 1.1, rotate: -5 }}
                          href={project.githubUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-text-primary hover:text-accent-violet transition-colors shadow-2xl border-white/20"
                        >
                          <FaGithub size={24} />
                        </motion.a>
                      )}
                      {project.liveUrl && (
                        <motion.a 
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          href={project.liveUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center text-white shadow-glow-violet border border-white/20"
                        >
                          <Globe size={24} />
                        </motion.a>
                      )}
                    </div>
                    
                    {project.featured && (
                      <div className="absolute top-4 left-4 px-4 py-1.5 bg-gradient-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-glow-violet flex items-center gap-2 border border-white/20">
                        <Star size={12} /> Featured
                      </div>
                    )}
                    
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-bg-card to-transparent" />
                  </div>
                  
                  {/* Content */}
                  <div className="p-8 flex-grow flex flex-col relative">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-black text-text-primary tracking-tight group-hover:text-gradient transition-all duration-500">
                        {project.title}
                      </h3>
                      <span className="text-[10px] font-black text-accent-cyan tracking-widest uppercase bg-accent-cyan/10 border border-accent-cyan/20 px-3 py-1 rounded-lg">
                        {project.status}
                      </span>
                    </div>
                    
                    <p className="text-text-secondary text-base mb-8 flex-grow line-clamp-3 font-medium tracking-wide">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-10">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span key={tech} className="text-[10px] font-mono font-bold text-text-primary glass px-3 py-1 rounded-lg border border-white/5 hover:border-accent-violet/30 transition-colors">
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <span className="text-[10px] font-mono font-black uppercase tracking-widest text-text-muted">
                        {project.category}
                      </span>
                      <motion.button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-primary hover:text-accent-violet transition-all group/btn">
                        Details <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                      </motion.button>
                    </div>
                  </div>
                </AnimatedCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        <div className="mt-24 text-center">
          <AnimatedCard className="inline-block p-12 max-w-2xl mx-auto">
            <h4 className="text-3xl font-black mb-6 text-text-primary">Interested in <span className="text-gradient">Consultation?</span></h4>
            <p className="text-text-secondary text-lg mb-10 font-medium">I am always open to discussing new structural challenges and large-scale infrastructure developments. Let's build something enduring together.</p>
            <GlowButton variant="secondary" size="lg" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
              Start a Discussion <ArrowRight size={20} className="inline ml-2" />
            </GlowButton>
          </AnimatedCard>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
