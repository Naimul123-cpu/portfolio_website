import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, Book } from 'lucide-react';
import SectionTitle from '../ui/SectionTitle';
import SectionIllustration from '../ui/SectionIllustration';
import type { IStudy } from '../../types';

interface StudySectionProps {
  studies: IStudy[];
}

const StudySection: React.FC<StudySectionProps> = ({ studies }) => {
  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'University': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'College': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'School': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'Online Course': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default: return 'bg-accent-primary/10 text-accent-primary border-accent-primary/20';
    }
  };

  return (
    <section id="study" className="py-24 relative overflow-hidden">
      <SectionIllustration src="https://raw.githubusercontent.com/thoughtbot/undraw/master/lib/undraw/templates/undraw_education_f03y.svg" />
      
      <div className="container mx-auto px-6 relative z-10">
        <SectionTitle 
          title="Education" 
          subtitle="My academic journey and continuous learning path."
        />
        
        <div className="relative max-w-4xl mx-auto pl-8 md:pl-0">
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2 hidden md:block" />
          <div className="absolute left-0 top-0 bottom-0 w-px bg-border md:hidden" />

          {studies.sort((a, b) => Number(b.order) - Number(a.order)).map((study, i) => (
            <div key={study._id} className={`relative mb-16 flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center`}>
              <div className="absolute left-0 md:left-1/2 top-0 w-3 h-3 bg-accent-violet rounded-full -translate-x-1/2 shadow-[0_0_10px_var(--accent-violet)] z-10" />
              
              <motion.div 
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`w-full md:w-5/12 ${i % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}
              >
                <div className="glass-card p-6 group hover:border-accent-violet/30">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`badge border ${getBadgeColor(study.institutionType)}`}>
                      {study.institutionType}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-text-secondary font-mono">
                      <Calendar size={12} />
                      {study.startYear} - {study.endYear || 'Present'}
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 glass rounded-lg flex-shrink-0 flex items-center justify-center text-accent-violet overflow-hidden">
                      {study.logo ? (
                        <img src={study.logo} alt="" className="w-full h-full object-contain p-1" />
                      ) : (
                        <GraduationCap size={24} />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold leading-tight">{study.degree}</h3>
                      <p className="text-accent-violet font-medium text-sm">{study.institution}</p>
                    </div>
                  </div>

                  {study.subjects && study.subjects.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-text-secondary uppercase mb-2">
                        <Book size={10} /> Subjects
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {study.subjects.map((sub, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-bg-tertiary text-text-secondary text-[10px] font-medium border border-border">
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <p className="text-text-secondary text-sm leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                    {study.description}
                  </p>
                  
                  {study.grade && (
                    <div className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-[10px] font-bold uppercase">
                      🏆 GPA: {study.grade}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StudySection;
