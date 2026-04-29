import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, Eye } from 'lucide-react';
import SectionTitle from '../ui/SectionTitle';
import MediaGallery from '../ui/MediaGallery';
import type { IExperience } from '../../types';

interface ExperienceSectionProps {
  experiences: IExperience[];
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences }) => {
  const [selectedExp, setSelectedExp] = useState<IExperience | null>(null);

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'Company': return 'text-accent-cyan border-accent-cyan/30 bg-accent-cyan/5';
      case 'Freelance': return 'text-accent-pink border-accent-pink/30 bg-accent-pink/5';
      case 'Business': return 'text-accent-orange border-accent-orange/30 bg-accent-orange/5';
      default: return 'text-accent-violet border-accent-violet/30 bg-accent-violet/5';
    }
  };

  return (
    <section id="experience" className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <SectionTitle 
          eyebrow="DEPLOYMENT HISTORY"
          title="Professional <Impact>" 
          subtitle="Strategic leadership and technical execution across major engineering infrastructures."
        />
        
        <div className="relative max-w-5xl mx-auto">
          {/* Vertical Timeline Line */}
          <div className="absolute left-0 md:left-[50%] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-accent-violet/50 to-transparent md:-translate-x-1/2 hidden md:block" />

          <div className="space-y-24">
            {experiences.sort((a, b) => Number(b.order) - Number(a.order)).map((exp, i) => (
              <motion.div 
                key={exp._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className={`relative flex flex-col md:flex-row items-center gap-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                {/* Timeline Node Dot */}
                <div className="absolute left-0 md:left-1/2 top-10 w-4 h-4 rounded-full -translate-x-1/2 z-20 hidden md:block">
                  <div className="absolute inset-0 bg-accent-violet animate-ping rounded-full opacity-40" />
                  <div className="relative w-full h-full bg-gradient-primary rounded-full shadow-glow-violet" />
                </div>

                {/* Content Card */}
                <div className={`w-full md:w-[45%] ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-accent-violet/20 to-accent-cyan/20 rounded-[32px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative glass p-8 md:p-10 rounded-[32px] border border-white/5 hover:border-white/20 transition-all duration-500 shadow-2xl">
                      <div className={`flex items-center gap-4 mb-6 ${i % 2 === 0 ? 'md:flex-row-reverse' : 'flex-row'}`}>
                        <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center border border-white/10 overflow-hidden bg-bg-surface group-hover:scale-110 transition-transform duration-500 shadow-xl">
                          {exp.logo ? (
                            <img src={exp.logo} alt="" className="w-full h-full object-contain p-2" />
                          ) : (
                            <Briefcase size={28} className="text-accent-violet" />
                          )}
                        </div>
                        <div>
                          <span className={`px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${getTypeStyles(exp.workplaceType)}`}>
                            {exp.workplaceType}
                          </span>
                          <h3 className="text-2xl font-black text-text-primary mt-2">{exp.company}</h3>
                        </div>
                      </div>

                      <div className="mb-6">
                        <p className="text-xl font-bold text-gradient inline-block">{exp.role}</p>
                        <div className={`flex flex-wrap gap-4 mt-3 text-[10px] font-black uppercase tracking-widest text-text-muted ${i % 2 === 0 ? 'md:justify-end' : 'justify-start'}`}>
                          <span className="flex items-center gap-2"><Calendar size={14} className="text-accent-violet" /> {new Date(exp.startDate).getFullYear()} - {exp.isCurrent ? 'Present' : new Date(exp.endDate!).getFullYear()}</span>
                          <span className="flex items-center gap-2"><MapPin size={14} className="text-accent-cyan" /> {exp.type}</span>
                        </div>
                      </div>

                      <p className="text-text-secondary text-sm leading-relaxed mb-8 font-medium opacity-70 line-clamp-3">
                        {exp.description}
                      </p>

                      <div className={`flex flex-wrap gap-2 mb-8 ${i % 2 === 0 ? 'md:justify-end' : 'justify-start'}`}>
                        {exp.technologies.slice(0, 4).map((tech) => (
                          <span key={tech} className="px-3 py-1 rounded-lg glass border border-white/5 text-[9px] font-black text-text-primary uppercase tracking-widest hover:border-accent-violet/30 transition-colors">
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className={`flex items-center gap-4 ${i % 2 === 0 ? 'md:flex-row-reverse' : 'flex-row'}`}>
                        {exp.workSamples && exp.workSamples.length > 0 && (
                          <button 
                            onClick={() => setSelectedExp(exp)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-text-primary transition-all group/btn"
                          >
                            <Eye size={14} className="group-hover/btn:text-accent-violet transition-colors" />
                            View Assets ({exp.workSamples.length})
                          </button>
                        )}
                        {exp.isCurrent && (
                          <div className="flex items-center gap-2 text-accent-emerald">
                            <div className="w-2 h-2 rounded-full bg-accent-emerald shadow-glow-emerald animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Active Node</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Empty Side for Spacing */}
                <div className="hidden md:block w-[45%]" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <MediaGallery 
        isOpen={!!selectedExp} 
        onClose={() => setSelectedExp(null)} 
        items={selectedExp?.workSamples || []} 
      />
    </section>
  );
};

export default ExperienceSection;
