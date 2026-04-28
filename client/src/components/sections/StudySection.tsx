import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar } from 'lucide-react';
import SectionTitle from '../ui/SectionTitle';
import type { IStudy } from '../../types';

interface StudySectionProps {
  studies: IStudy[];
}

const StudySection: React.FC<StudySectionProps> = ({ studies }) => {
  return (
    <section id="study" className="py-20 relative">
      <div className="container mx-auto px-6">
        <SectionTitle 
          title="Education" 
          subtitle="My academic journey and continuous learning path."
        />
        
        <div className="relative max-w-4xl mx-auto pl-8 md:pl-0">
          {/* Vertical Line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-primary via-accent-secondary to-transparent -translate-x-1/2 hidden md:block" />
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-primary via-accent-secondary to-transparent md:hidden" />

          {studies.sort((a, b) => b.order - a.order).map((study, i) => (
            <div key={study._id} className={`relative mb-16 flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center`}>
              {/* Dot */}
              <div className="absolute left-0 md:left-1/2 top-0 w-4 h-4 bg-accent-primary rounded-full -translate-x-1/2 shadow-[0_0_15px_rgba(108,99,255,1)] z-10" />
              
              <motion.div 
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`w-full md:w-5/12 ${i % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}
              >
                <div className="glass-card p-6 border-l-4 border-accent-primary">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 glass rounded-xl text-accent-primary">
                      {study.logo ? (
                        <img src={study.logo} alt={study.institution} className="w-10 h-10 object-contain" />
                      ) : (
                        <GraduationCap size={24} />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-secondary font-mono">
                      <Calendar size={14} />
                      {study.startYear} - {study.endYear || 'Present'}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-1">{study.degree}</h3>
                  <p className="text-accent-secondary font-medium mb-3">{study.institution}</p>
                  <p className="text-text-secondary text-sm leading-relaxed">{study.description}</p>
                  
                  {study.grade && (
                    <div className="mt-4 inline-block px-3 py-1 rounded bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-xs font-bold uppercase">
                      Grade: {study.grade}
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
