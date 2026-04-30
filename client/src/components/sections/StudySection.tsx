import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, BookOpen, Award } from 'lucide-react';
import SectionTitle from '../ui/SectionTitle';
import type { IStudy } from '../../types';

interface StudySectionProps {
  studies: IStudy[];
}

const StudySection: React.FC<StudySectionProps> = ({ studies }) => {
  const getAccentColor = (type: string) => {
    switch (type) {
      case 'University': return { text: 'text-accent-violet', border: 'border-accent-violet/40', bg: 'bg-accent-violet/10', glow: 'from-accent-violet/30 to-accent-cyan/20', dot: 'bg-accent-violet' };
      case 'College':    return { text: 'text-accent-cyan',   border: 'border-accent-cyan/40',   bg: 'bg-accent-cyan/10',   glow: 'from-accent-cyan/30 to-accent-violet/20',  dot: 'bg-accent-cyan' };
      case 'Online Course': return { text: 'text-accent-pink', border: 'border-accent-pink/40', bg: 'bg-accent-pink/10', glow: 'from-accent-pink/30 to-accent-violet/20', dot: 'bg-accent-pink' };
      case 'Certification': return { text: 'text-yellow-400', border: 'border-yellow-400/40', bg: 'bg-yellow-400/10', glow: 'from-yellow-400/30 to-accent-violet/20', dot: 'bg-yellow-400' };
      default: return { text: 'text-accent-cyan', border: 'border-accent-cyan/40', bg: 'bg-accent-cyan/10', glow: 'from-accent-cyan/30 to-accent-violet/20', dot: 'bg-accent-cyan' };
    }
  };

  const sorted = [...studies].sort((a, b) => Number(b.order) - Number(a.order));

  return (
    <section id="study" className="py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-accent-violet/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent-cyan/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-8 -translate-y-1/2 opacity-[0.025] pointer-events-none">
          <GraduationCap size={500} />
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <SectionTitle
          eyebrow="ACADEMIC FOUNDATION"
          title="Educational <Blueprint>"
          subtitle="Rigorous academic training and specialized certifications from leading institutions."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {sorted.map((study, i) => {
            const accent = getAccentColor(study.institutionType);
            return (
              <motion.div
                key={study._id}
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ 
                  duration: 0.7, 
                  delay: i * 0.1,
                  ease: [0.16, 1, 0.3, 1] 
                }}
                className="group relative"
              >
                {/* Glow Effect */}
                <div className={`absolute -inset-[1px] bg-gradient-to-br ${accent.glow} rounded-[28px] opacity-0 group-hover:opacity-100 blur-lg transition-all duration-700`} />

                {/* Card */}
                <div className="relative h-full flex flex-col bg-[#0A0A12]/80 backdrop-blur-xl border border-white/8 rounded-[28px] overflow-hidden shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">

                  {/* Top accent bar */}
                  <div className={`h-1 w-full bg-gradient-to-r ${accent.glow}`} />

                  <div className="p-8 flex flex-col h-full">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-4 mb-6">
                      {/* Logo */}
                      <div className={`w-16 h-16 rounded-2xl border ${accent.border} ${accent.bg} flex items-center justify-center overflow-hidden flex-shrink-0 transition-transform duration-500 group-hover:scale-110 shadow-lg`}>
                        {study.logo ? (
                          <img src={study.logo} alt="" className="w-full h-full object-contain p-2" />
                        ) : (
                          <BookOpen size={28} className={accent.text} />
                        )}
                      </div>

                      {/* Type Badge */}
                      <span className={`px-3 py-1.5 rounded-xl border ${accent.border} ${accent.bg} ${accent.text} text-[9px] font-black uppercase tracking-widest flex-shrink-0`}>
                        {study.institutionType}
                      </span>
                    </div>

                    {/* Institution & Degree */}
                    <div className="mb-5">
                      <p className="text-text-muted text-[11px] font-black uppercase tracking-widest mb-1">{study.institution}</p>
                      <h3 className={`text-xl font-black ${accent.text} leading-tight`}>{study.degree}</h3>
                      {study.field && (
                        <p className="text-text-secondary text-sm font-medium mt-1 opacity-70">{study.field}</p>
                      )}
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-2 mb-5">
                      <Calendar size={13} className={accent.text} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                        {study.startYear} — {study.endYear || 'Present'}
                      </span>
                    </div>

                    {/* Description */}
                    {study.description && (
                      <p className="text-text-secondary text-sm leading-relaxed mb-5 opacity-70 line-clamp-3 flex-grow">
                        {study.description}
                      </p>
                    )}

                    {/* Subjects */}
                    {study.subjects && study.subjects.length > 0 && (
                      <div className="mb-5">
                        <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${accent.text} mb-3`}>Subjects</p>
                        <div className="flex flex-wrap gap-2">
                          {study.subjects.slice(0, 4).map((sub, idx) => {
                            const clean = typeof sub === 'string' ? sub.replace(/[\[\]"]/g, '') : sub;
                            return (
                              <span key={idx} className={`px-3 py-1 rounded-lg border ${accent.border} ${accent.bg} text-[9px] font-black uppercase tracking-wider text-text-secondary`}>
                                {clean}
                              </span>
                            );
                          })}
                          {study.subjects.length > 4 && (
                            <span className="px-3 py-1 rounded-lg border border-white/10 bg-white/5 text-[9px] font-black text-text-muted">
                              +{study.subjects.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* GPA Row */}
                    {study.grade && (
                      <div className={`mt-auto flex items-center gap-3 p-4 rounded-xl border ${accent.border} ${accent.bg}`}>
                        <div className={`w-8 h-8 rounded-lg ${accent.bg} border ${accent.border} flex items-center justify-center`}>
                          <Award size={14} className={accent.text} />
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-text-muted uppercase tracking-widest">Academic Merit</p>
                          <p className={`text-base font-black ${accent.text}`}>GPA: {study.grade}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom index number */}
                  <div className="absolute bottom-6 right-7 text-[40px] font-black text-white/[0.03] select-none leading-none">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StudySection;
