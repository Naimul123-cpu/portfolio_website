import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import { ExternalLink, ArrowRight } from 'lucide-react';
import SectionTitle from '../ui/SectionTitle';
import GlowButton from '../ui/GlowButton';
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
    <section id="projects" className="py-20">
      <div className="container mx-auto px-6">
        <SectionTitle 
          title="Featured Projects" 
          subtitle="A showcase of my recent work, side projects, and digital experiments."
        />
        
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-6 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1 text-sm transition-all duration-300 capitalize ${
                filter === cat 
                  ? 'text-accent-primary font-bold border-b-2 border-accent-primary' 
                  : 'text-text-secondary hover:text-text-primary font-medium'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.sort((a, b) => b.order - a.order).map((project, i) => (
              <motion.div
                key={project._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group relative"
              >
                <div className="glass-card overflow-hidden h-full flex flex-col">
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={project.thumbnail || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800'} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noreferrer" className="p-3 bg-white text-bg-primary rounded-full hover:scale-110 transition-transform">
                          <FaGithub size={20} />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noreferrer" className="p-3 bg-accent-primary text-white rounded-full hover:scale-110 transition-transform">
                          <ExternalLink size={20} />
                        </a>
                      )}
                    </div>
                    {project.featured && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-accent-primary text-white text-[10px] font-black uppercase tracking-tighter rounded-full shadow-lg">
                        Featured
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold group-hover:text-accent-primary transition-colors text-text-primary">{project.title}</h3>
                      <span className="text-[10px] text-accent-secondary font-medium tracking-wider uppercase">{project.status}</span>
                    </div>
                    <p className="text-text-secondary text-sm mb-6 flex-grow line-clamp-3 font-light">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span key={tech} className="text-[10px] font-medium text-accent-primary bg-accent-primary/5 px-2.5 py-1 rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-primary group-hover:text-accent-primary transition-all">
                      View details <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        <div className="mt-20 text-center">
          <p className="text-text-secondary mb-8">Want to see more work? Check out my GitHub profile.</p>
          <GlowButton variant="outline" onClick={() => window.open('https://github.com', '_blank')}>
            Browse Full Catalog
          </GlowButton>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
