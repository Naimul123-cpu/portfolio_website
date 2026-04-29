import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import { ArrowRight, Globe, Star, Zap } from 'lucide-react';
import SectionTitle from '../ui/SectionTitle';
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
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <SectionTitle 
          eyebrow="ENGINEERING SHOWCASE"
          title="Structural <Masterpieces>" 
          subtitle="Advanced infrastructure projects and technical blueprints designed for resilience and performance."
        />
        
        {/* Advanced Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-20">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`relative px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 ${
                filter === cat 
                  ? 'text-white' 
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {filter === cat && (
                <motion.div 
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-gradient-primary rounded-2xl shadow-glow-violet -z-10"
                />
              )}
              {cat}
            </button>
          ))}
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          <AnimatePresence mode="popLayout">
            {filteredProjects.sort((a, b) => Number(b.order) - Number(a.order)).map((project, i) => (
              <motion.div
                key={project._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group relative"
              >
                {/* Card Glow Background */}
                <div className="absolute -inset-1 bg-gradient-to-br from-accent-violet/20 to-accent-cyan/20 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative glass rounded-[40px] overflow-hidden group border border-white/5 hover:border-white/20 transition-all duration-500 shadow-2xl h-full flex flex-col">
                  {/* Thumbnail Container */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img 
                      src={project.thumbnail || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800'} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-bg-base/60 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-6">
                      {project.githubUrl && (
                        <motion.a 
                          whileHover={{ scale: 1.1, rotate: -5 }}
                          href={project.githubUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="w-16 h-16 glass rounded-2xl flex items-center justify-center text-text-primary hover:bg-white hover:text-bg-base transition-all shadow-2xl border-white/20"
                        >
                          <FaGithub size={28} />
                        </motion.a>
                      )}
                      {project.liveUrl && (
                        <motion.a 
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          href={project.liveUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center text-white shadow-glow-violet border border-white/20"
                        >
                          <Globe size={28} />
                        </motion.a>
                      )}
                    </div>
                    
                    {/* Badge Overlays */}
                    {project.featured && (
                      <div className="absolute top-6 left-6 px-4 py-2 bg-gradient-primary text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-glow-violet flex items-center gap-2 border border-white/20">
                        <Star size={12} fill="white" /> Featured
                      </div>
                    )}
                    <div className="absolute top-6 right-6 px-3 py-1.5 glass rounded-xl text-[9px] font-black uppercase tracking-widest text-text-primary border border-white/10 backdrop-blur-xl">
                      {project.status}
                    </div>
                  </div>
                  
                  {/* Content Container */}
                  <div className="p-10 flex-grow flex flex-col relative">
                    <div className="mb-6">
                      <p className="text-[10px] font-black text-accent-violet uppercase tracking-[0.3em] mb-2">{project.category}</p>
                      <h3 className="text-3xl font-display font-black text-text-primary tracking-tight group-hover:text-gradient transition-all duration-500 leading-tight">
                        {project.title}
                      </h3>
                    </div>
                    
                    <p className="text-text-secondary text-sm mb-10 flex-grow line-clamp-3 font-medium leading-relaxed opacity-70">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-10">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span key={tech} className="text-[9px] font-black text-text-primary glass px-3 py-1.5 rounded-lg border border-white/5 hover:border-accent-violet/30 transition-colors uppercase tracking-widest">
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-8 border-t border-white/5">
                      <div className="flex items-center gap-2 text-accent-cyan">
                        <Zap size={14} className="animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest">System Active</span>
                      </div>
                      <motion.button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-text-primary group/btn hover:text-accent-violet transition-colors">
                        Launch <ArrowRight size={14} className="group-hover/btn:translate-x-1.5 transition-transform" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
