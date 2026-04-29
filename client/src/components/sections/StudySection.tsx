import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, Star, BookOpen } from 'lucide-react';
import SectionTitle from '../ui/SectionTitle';
import type { IStudy } from '../../types';

interface StudySectionProps {
  studies: IStudy[];
}

const StudySection: React.FC<StudySectionProps> = ({ studies }) => {
  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'University': return 'text-accent-violet border-accent-violet/30 bg-accent-violet/5';
      case 'College': return 'text-accent-cyan border-accent-cyan/30 bg-accent-cyan/5';
      case 'Online Course': return 'text-accent-pink border-accent-pink/30 bg-accent-pink/5';
      default: return 'text-accent-blue border-accent-blue/30 bg-accent-blue/5';
    }
  };

  return (
    <section id="study" className="py-32 relative overflow-hidden">
      {/* Background Icon */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 p-20 opacity-[0.02] pointer-events-none rotate-12">
        <GraduationCap size={400} />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <SectionTitle 
          eyebrow="ACADEMIC FOUNDATION"
          title="Educational <Blueprint>" 
          subtitle="Rigorous engineering training and specialized certifications from leading technical institutions."
        />
        
        <div className="relative max-w-5xl mx-auto">
          {/* Central Timeline Line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent md:-translate-x-1/2 hidden md:block" />

          <div className="space-y-16 md:space-y-24">
            {studies.sort((a, b) => Number(b.order) - Number(a.order)).map((study, i) => (
              <motion.div 
                key={study._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className={`relative flex flex-col md:flex-row items-center gap-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-0 md:left-1/2 top-10 w-4 h-4 rounded-full -translate-x-1/2 z-20 hidden md:block">
                  <div className="absolute inset-0 bg-accent-cyan animate-pulse rounded-full opacity-40" />
                  <div className="relative w-full h-full bg-accent-cyan rounded-full shadow-glow-cyan" />
                </div>

                {/* Study Card */}
                <div className={`w-full md:w-[45%] ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-br from-accent-cyan/20 to-accent-violet/20 rounded-[32px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative glass-card glass-card-hover p-10 rounded-[32px] shadow-2xl">
                      <div className={`flex items-center gap-5 mb-8 ${i % 2 === 0 ? 'md:flex-row-reverse' : 'flex-row'}`}>
                        <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center border border-white/10 overflow-hidden bg-bg-surface shadow-xl group-hover:scale-110 transition-transform duration-500">
                          {study.logo ? (
                            <img src={study.logo} alt="" className="w-full h-full object-contain p-2" />
                          ) : (
                            <BookOpen size={28} className="text-accent-cyan" />
                          )}
                        </div>
                        <div>
                          <span className={`px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${getTypeStyles(study.institutionType)}`}>
                            {study.institutionType}
                          </span>
                          <h3 className="text-2xl font-black text-text-primary mt-2">{study.institution}</h3>
                        </div>
                      </div>

                      <div className="mb-8">
                        <h4 className="text-xl font-bold text-gradient inline-block mb-3">{study.degree}</h4>
                        <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted ${i % 2 === 0 ? 'md:justify-end' : 'justify-start'}`}>
                          <Calendar size={14} className="text-accent-cyan" />
                          {study.startYear} — {study.endYear || 'Present'}
                        </div>
                      </div>

                      <p className="text-text-secondary text-sm leading-relaxed mb-8 font-medium opacity-70 line-clamp-3">
                        {study.description}
                      </p>

                      {study.subjects && study.subjects.length > 0 && (
                        <div className="mb-8">
                          <p className={`text-[9px] font-black uppercase tracking-[0.2em] text-accent-cyan mb-4 ${i % 2 === 0 ? 'md:text-right' : 'text-left'}`}>Curriculum Pillars</p>
                          <div className={`flex flex-wrap gap-2 ${i % 2 === 0 ? 'md:justify-end' : 'justify-start'}`}>
                            {study.subjects.map((sub, idx) => {
                              const cleanSub = typeof sub === 'string' ? sub.replace(/[\[\]"]/g, '') : sub;
                              return (
                                <span key={idx} className="tech-badge">
                                  {cleanSub}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {study.grade && (
                        <div className={`flex items-center gap-3 p-4 glass rounded-2xl border border-white/5 bg-accent-cyan/5 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                          <div className="p-2 bg-gradient-primary rounded-lg shadow-glow-violet">
                            <Star size={14} className="text-white" />
                          </div>
                          <div className={i % 2 === 0 ? 'text-right' : 'text-left'}>
                            <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">Academic Merit</p>
                            <p className="text-lg font-black text-text-primary">GPA: {study.grade}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Spacing for Timeline */}
                <div className="hidden md:block w-[45%]" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudySection;
