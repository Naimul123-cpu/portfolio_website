import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import { ExternalLink, ArrowRight } from 'lucide-react';
import SectionTitle from '../ui/SectionTitle';
import SectionIllustration from '../ui/SectionIllustration';
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
    <section id="projects" className="py-24 relative overflow-hidden">
      <SectionIllustration src="https://raw.githubusercontent.com/thoughtbot/undraw/master/lib/undraw/templates/undraw_software_engineer_re_y30v.svg" />
      
      <div className="container mx-auto px-6 relative z-10">
        <SectionTitle 
          title="Featured Projects" 
          subtitle="A showcase of my recent work, side projects, and digital experiments."
        />
        
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                filter === cat 
                  ? 'bg-accent-violet text-white shadow-lg shadow-accent-violet/30' 
                  : 'bg-bg-tertiary text-text-secondary hover:text-accent-violet border border-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.sort((a, b) => Number(b.order) - Number(a.order)).map((project, i) => (
              <motion.div
                key={project._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group relative"
              >
                <div className="glass-card overflow-hidden h-full flex flex-col group hover:border-accent-violet/30">
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={project.thumbnail || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800'} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noreferrer" className="p-3 bg-bg-card text-text-primary rounded-full hover:scale-110 transition-transform shadow-lg">
                          <FaGithub size={20} />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noreferrer" className="p-3 bg-accent-violet text-white rounded-full hover:scale-110 transition-transform shadow-lg">
                          <ExternalLink size={20} />
                        </a>
                      )}
                    </div>
                    {project.featured && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-accent-violet text-white text-[10px] font-black uppercase tracking-tighter rounded-full shadow-lg">
                        Featured
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold group-hover:text-accent-violet transition-colors text-text-primary">{project.title}</h3>
                      <span className="text-[10px] text-accent-cyan font-bold tracking-wider uppercase bg-accent-cyan/10 px-2 py-0.5 rounded">{project.status}</span>
                    </div>
                    <p className="text-text-secondary text-sm mb-6 flex-grow line-clamp-3 font-light">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span key={tech} className="text-[10px] font-bold text-accent-violet bg-accent-violet/5 border border-accent-violet/10 px-2.5 py-1 rounded-md">
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-primary group-hover:text-accent-violet transition-all">
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
