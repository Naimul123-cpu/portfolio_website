import React from 'react';
import { GraduationCap, Calendar, BookOpen, Star } from 'lucide-react';
import SectionTitle from '../ui/SectionTitle';
import SectionIllustration from '../ui/SectionIllustration';
import AnimatedCard from '../ui/AnimatedCard';
import type { IStudy } from '../../types';

interface StudySectionProps {
  studies: IStudy[];
}

const StudySection: React.FC<StudySectionProps> = ({ studies }) => {
  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'University': return 'border-accent-violet text-accent-violet';
      case 'College': return 'border-accent-blue text-accent-blue';
      case 'School': return 'border-accent-amber text-accent-amber';
      case 'Online Course': return 'border-accent-cyan text-accent-cyan';
      case 'Certification': return 'border-accent-pink text-accent-pink';
      default: return 'border-accent-emerald text-accent-emerald';
    }
  };

  const getTypeGradient = (type: string) => {
    switch (type) {
      case 'University': return 'bg-gradient-primary';
      case 'College': return 'bg-gradient-secondary';
      case 'Online Course': return 'bg-gradient-aurora';
      case 'Certification': return 'bg-gradient-danger';
      default: return 'bg-gradient-tertiary';
    }
  };

  return (
    <section id="study" className="py-32 relative overflow-hidden">
      <SectionIllustration icon={<BookOpen />} className="opacity-10" />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <SectionTitle 
          eyebrow="FOUNDATION"
          title="Professional <Academics>" 
          subtitle="Rigorous academic training and technical certifications from leading engineering institutions."
        />
        
        <div className="relative max-w-5xl mx-auto">
          {/* Central Timeline Line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-white/10 to-transparent -translate-x-1/2 hidden md:block" />

          {studies.sort((a, b) => Number(b.order) - Number(a.order)).map((study, i) => (
            <div key={study._id} className={`relative mb-24 md:flex items-center justify-between ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
              {/* Timeline Node */}
              <div className="absolute left-0 md:left-1/2 top-10 w-4 h-4 rounded-full -translate-x-1/2 z-20 hidden md:block">
                <div className={`w-full h-full rounded-full animate-pulse-ring absolute ${getTypeGradient(study.institutionType)}`} />
                <div className={`w-full h-full rounded-full relative z-10 ${getTypeGradient(study.institutionType)} shadow-lg shadow-black/20`} />
              </div>
              
              <div className={`w-full md:w-[45%] ${i % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                <AnimatedCard 
                  delay={i * 0.1}
                  className={`p-0 border-l-4 ${getTypeStyles(study.institutionType).split(' ')[0]}`}
                >
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-2 px-3 py-1 glass rounded-lg border border-white/10 text-[10px] font-mono font-black uppercase tracking-widest text-text-primary">
                        <Calendar size={12} className="text-accent-violet" />
                        {study.startYear} — {study.endYear || 'Present'}
                      </div>
                      <span className={`px-3 py-1 rounded-lg border text-[10px] font-mono font-black uppercase tracking-widest bg-white/5 ${getTypeStyles(study.institutionType).split(' ')[0]} ${getTypeStyles(study.institutionType).split(' ')[1]}`}>
                        {study.institutionType}
                      </span>
                    </div>
                    
                    <div className="flex items-start gap-5 mb-8">
                      <div className="w-16 h-16 glass rounded-2xl flex-shrink-0 flex items-center justify-center border border-white/10 overflow-hidden shadow-xl">
                        {study.logo ? (
                          <img src={study.logo} alt="" className="w-full h-full object-contain p-2" />
                        ) : (
                          <GraduationCap size={32} className="text-accent-violet" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-2xl font-black leading-tight text-text-primary mb-2">{study.degree}</h3>
                        <p className="text-gradient font-bold text-lg">{study.institution}</p>
                      </div>
                    </div>

                    <p className="text-text-secondary text-base leading-relaxed font-medium mb-8 whitespace-pre-wrap">
                      {study.description}
                    </p>

                    {study.subjects && study.subjects.length > 0 && (
                      <div className="space-y-4 mb-10">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-[2px] bg-accent-violet rounded-full" />
                          <span className="text-[10px] font-black text-accent-violet uppercase tracking-[0.3em]">Curriculum Pillars</span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {study.subjects.map((sub, idx) => {
                            const cleanSub = typeof sub === 'string' ? sub.replace(/[\[\]"]/g, '') : sub;
                            if (!cleanSub) return null;
                            return (
                              <div key={idx} className="group/pill relative">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-violet/50 to-accent-blue/50 rounded-xl opacity-0 group-hover/pill:opacity-100 blur transition-all duration-300" />
                                <span className="relative px-4 py-2 rounded-xl glass border border-white/10 text-xs font-black text-text-primary uppercase tracking-widest flex items-center gap-3 bg-white/[0.03] group-hover/pill:border-white/30 transition-all shadow-xl">
                                  <div className="w-1.5 h-1.5 rounded-full bg-accent-violet group-hover/pill:animate-pulse" />
                                  {cleanSub}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    {study.grade && (
                      <div className="flex items-center gap-3 p-4 glass rounded-2xl border border-white/5 bg-accent-violet/5">
                        <div className="p-2 bg-gradient-primary rounded-lg shadow-glow-violet">
                          <Star size={16} className="text-white" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Academic Excellence</p>
                          <p className="text-lg font-black text-text-primary">GPA: {study.grade}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </AnimatedCard>
              </div>
              
              <div className="hidden md:block w-[45%]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StudySection;
