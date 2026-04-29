import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, Eye, Zap } from 'lucide-react';
import SectionTitle from '../ui/SectionTitle';
import SectionIllustration from '../ui/SectionIllustration';
import MediaGallery from '../ui/MediaGallery';
import AnimatedCard from '../ui/AnimatedCard';
import GlowButton from '../ui/GlowButton';
import type { IExperience } from '../../types';

interface ExperienceSectionProps {
  experiences: IExperience[];
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences }) => {
  const [selectedExp, setSelectedExp] = useState<IExperience | null>(null);

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'Company': return 'text-accent-blue border-accent-blue/20 bg-accent-blue/5';
      case 'Business': return 'text-accent-violet border-accent-violet/20 bg-accent-violet/5';
      case 'Freelance': return 'text-accent-cyan border-accent-cyan/20 bg-accent-cyan/5';
      case 'Remote': return 'text-accent-emerald border-accent-emerald/20 bg-accent-emerald/5';
      default: return 'text-accent-pink border-accent-pink/20 bg-accent-pink/5';
    }
  };

  return (
    <section id="experience" className="py-32 relative overflow-hidden">
      <SectionIllustration icon={<Briefcase />} className="opacity-10" />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <SectionTitle 
          eyebrow="EXPERIENCE"
          title="My Professional <Journey>" 
          subtitle="Building impactful solutions and leading technical excellence across diverse industries."
        />
        
        <div className="max-w-5xl mx-auto space-y-12">
          {experiences.sort((a, b) => Number(b.order) - Number(a.order)).map((exp, i) => (
            <AnimatedCard 
              key={exp._id} 
              delay={i * 0.1}
              gradient
              className="p-0"
            >
              <div className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row justify-between gap-8 mb-10">
                  <div className="flex gap-8 items-start">
                    <div className="w-20 h-20 glass rounded-3xl flex items-center justify-center border border-white/10 overflow-hidden shadow-2xl relative group-hover:scale-105 transition-transform duration-500">
                      <div className="absolute inset-0 bg-gradient-aurora opacity-10" />
                      {exp.logo ? (
                        <img src={exp.logo} alt="" className="w-full h-full object-contain p-3" />
                      ) : (
                        <Briefcase size={36} className="text-accent-violet" />
                      )}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <h3 className="text-3xl font-black text-text-primary tracking-tight">{exp.role}</h3>
                        <span className={`px-3 py-1 rounded-lg border text-[10px] font-mono font-black uppercase tracking-widest ${getTypeStyles(exp.workplaceType)}`}>
                          {exp.workplaceType}
                        </span>
                        {exp.isCurrent && (
                          <span className="flex items-center gap-2 px-3 py-1 rounded-lg bg-accent-emerald/10 border border-accent-emerald/30 text-[10px] font-black text-accent-emerald uppercase tracking-widest">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-emerald opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-emerald"></span>
                            </span>
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-gradient font-bold text-xl mb-4">{exp.company}</p>
                      <div className="flex flex-wrap gap-6 text-text-secondary text-xs font-bold tracking-widest uppercase">
                        <span className="flex items-center gap-2"><Calendar size={16} className="text-accent-violet" /> {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} — {exp.isCurrent ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : ''}</span>
                        <span className="flex items-center gap-2"><MapPin size={16} className="text-accent-blue" /> {exp.type}</span>
                      </div>
                    </div>
                  </div>

                  {exp.workSamples && exp.workSamples.length > 0 && (
                    <div className="flex-shrink-0">
                      <GlowButton 
                        onClick={() => setSelectedExp(exp)}
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Eye size={16} /> Work Samples ({exp.workSamples.length})
                      </GlowButton>
                    </div>
                  )}
                </div>
                
                <div className="bg-white/5 rounded-3xl p-8 mb-8 border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                    <Zap size={60} className="text-accent-violet" />
                  </div>
                  <p className="text-text-secondary text-lg leading-relaxed font-medium whitespace-pre-wrap relative z-10">
                    {exp.description}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {exp.technologies.map((tech) => (
                    <span key={tech} className="px-4 py-1.5 rounded-xl glass border border-white/5 text-[11px] font-mono font-bold text-text-primary hover:border-accent-violet/30 hover:text-accent-violet transition-colors">
                      #{tech}
                    </span>
                  ))}
                </div>

                {/* Work Samples Preview */}
                {exp.workSamples && exp.workSamples.length > 0 && (
                  <div className="mt-10 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {exp.workSamples.slice(0, 3).map((sample, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.05, y: -5 }}
                        onClick={() => setSelectedExp(exp)}
                        className="w-32 h-20 rounded-2xl overflow-hidden glass border border-white/10 cursor-pointer flex-shrink-0 relative group"
                      >
                        {sample.type === 'image' ? (
                          <img src={sample.url} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-bg-surface">
                            <Zap size={24} className="text-accent-violet" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.div>
                    ))}
                    {exp.workSamples.length > 3 && (
                      <div 
                        onClick={() => setSelectedExp(exp)}
                        className="w-32 h-20 rounded-2xl glass border border-white/10 flex items-center justify-center cursor-pointer text-text-muted font-bold text-xs hover:text-text-primary transition-colors"
                      >
                        +{exp.workSamples.length - 3} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            </AnimatedCard>
          ))}
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
