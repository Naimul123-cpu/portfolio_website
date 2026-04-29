import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, Eye } from 'lucide-react';
import SectionTitle from '../ui/SectionTitle';
import SectionIllustration from '../ui/SectionIllustration';
import MediaGallery from '../ui/MediaGallery';
import type { IExperience } from '../../types';

interface ExperienceSectionProps {
  experiences: IExperience[];
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences }) => {
  const [selectedExp, setSelectedExp] = useState<IExperience | null>(null);

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'Company': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Freelance': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'Remote': return 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20';
      case 'Own Business': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-accent-violet/10 text-accent-violet border-accent-violet/20';
    }
  };

  return (
    <section id="experience" className="py-24 relative overflow-hidden">
      <SectionIllustration src="https://raw.githubusercontent.com/thoughtbot/undraw/master/lib/undraw/templates/undraw_business_deal_re_up81.svg" />
      
      <div className="container mx-auto px-6 relative z-10">
        <SectionTitle 
          title="Experience" 
          subtitle="My professional journey and the impact I've made."
        />
        
        <div className="max-w-5xl mx-auto space-y-12">
          {experiences.sort((a, b) => Number(b.order) - Number(a.order)).map((exp, i) => (
            <motion.div
              key={exp._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="glass-card p-8 group hover:border-accent-violet/30">
                <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
                  <div className="flex gap-6 items-start">
                    <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center text-accent-violet flex-shrink-0">
                      {exp.logo ? (
                        <img src={exp.logo} alt="" className="w-full h-full object-contain p-2" />
                      ) : (
                        <Briefcase size={32} />
                      )}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold">{exp.role}</h3>
                        <span className={`badge border ${getBadgeColor(exp.workplaceType)}`}>
                          {exp.workplaceType}
                        </span>
                        {exp.isCurrent && (
                          <span className="px-3 py-1 rounded-full bg-accent-violet/10 border border-accent-violet/30 text-xs font-bold text-accent-violet uppercase animate-pulse">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-accent-violet font-bold text-lg mb-2">{exp.company}</p>
                      <div className="flex flex-wrap gap-4 text-text-secondary text-sm">
                        <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} - {exp.isCurrent ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : ''}</span>
                        <span className="flex items-center gap-1.5"><MapPin size={14} /> {exp.type}</span>
                      </div>
                    </div>
                  </div>

                  {exp.workSamples && exp.workSamples.length > 0 && (
                    <div className="flex-shrink-0">
                      <button 
                        onClick={() => setSelectedExp(exp)}
                        className="btn-primary flex items-center gap-2 text-sm"
                      >
                        <Eye size={18} /> View Work Samples ({exp.workSamples.length})
                      </button>
                    </div>
                  )}
                </div>
                
                <p className="text-text-secondary leading-relaxed mb-6 whitespace-pre-wrap">
                  {exp.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech) => (
                    <span key={tech} className="px-3 py-1 rounded-md bg-bg-tertiary border border-border text-xs font-mono text-text-primary">
                      #{tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
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
