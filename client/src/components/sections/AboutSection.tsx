import React from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '../ui/SectionTitle';
import SectionIllustration from '../ui/SectionIllustration';
import type { IProfile } from '../../types';

interface AboutSectionProps {
  profile: IProfile | null;
}

const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  const stats = [
    { label: 'Experience', value: '2+ Years' },
    { label: 'Projects', value: '15+' },
    { label: 'Tech Stack', value: '10+' },
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <SectionIllustration src="https://raw.githubusercontent.com/thoughtbot/undraw/master/lib/undraw/templates/undraw_personal_info_re_0663.svg" />
      
      <div className="container mx-auto px-6 relative z-10">
        <SectionTitle 
          title="About Me" 
          subtitle="Behind every great code is a story of curiosity and constant learning."
        />
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl md:text-3xl font-display font-semibold mb-6 text-text-primary">
              Crafting stories through <span className="text-gradient">clean code</span> and elegant design.
            </h3>
            <p className="text-text-secondary text-base leading-relaxed mb-10 whitespace-pre-wrap font-light">
              {profile?.bio || 'Passionate developer dedicated to creating high-quality, efficient, and user-friendly web applications.'}
            </p>
            
            <div className="flex gap-12">
              {stats.map((stat, i) => (
                <div key={i}>
                  <div className="text-2xl font-display font-bold text-accent-violet">{stat.value}</div>
                  <div className="text-text-secondary text-xs uppercase tracking-[0.2em]">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
          
          <div>
            <h4 className="text-sm font-display font-semibold mb-8 uppercase tracking-widest text-text-primary border-b border-border pb-2 inline-block">Expertise</h4>
            <div className="flex flex-wrap gap-3">
              {profile?.skills.map((skill, i) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="px-4 py-1.5 glass-card rounded-full text-text-secondary text-xs font-medium hover:border-accent-violet/50 hover:text-accent-violet transition-colors cursor-default"
                >
                  {skill}
                </motion.div>
              ))}
            </div>
            
            <div className="mt-12 p-8 glass-card">
              <h5 className="font-semibold mb-3 text-text-primary flex items-center gap-2">
                <span className="w-8 h-px bg-accent-violet"></span> Philosophy
              </h5>
              <p className="text-text-secondary text-sm font-light leading-relaxed">
                I believe in software that is not only functional but also a joy to use. Simplicity and clarity are the cornerstones of my work.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
