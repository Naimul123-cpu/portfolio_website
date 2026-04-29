import React from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '../ui/SectionTitle';
import SectionIllustration from '../ui/SectionIllustration';
import type { IProfile } from '../../types';

interface AboutSectionProps {
  profile: IProfile | null;
}

import { User, Cpu, Rocket, Code2 } from 'lucide-react';
import AnimatedCard from '../ui/AnimatedCard';

const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  const stats = [
    { label: 'Experience', value: '3+', icon: <Cpu className="text-accent-violet" /> },
    { label: 'Projects', value: '50+', icon: <Rocket className="text-accent-blue" /> },
    { label: 'Technologies', value: '20+', icon: <Code2 className="text-accent-cyan" /> },
  ];

  const getSkillCategory = (skill: string) => {
    const frontend = ['React', 'Next.js', 'Tailwind', 'CSS', 'HTML', 'JavaScript', 'TypeScript'];
    const backend = ['Node.js', 'Express', 'MongoDB', 'Python', 'SQL', 'PostgreSQL'];
    if (frontend.some(s => skill.includes(s))) return 'frontend';
    if (backend.some(s => skill.includes(s))) return 'backend';
    return 'tools';
  };

  const skillColors = {
    frontend: 'text-accent-blue border-accent-blue/20 bg-accent-blue/5 hover:bg-accent-blue/10 shadow-glow-blue',
    backend: 'text-accent-violet border-accent-violet/20 bg-accent-violet/5 hover:bg-accent-violet/10 shadow-glow-violet',
    tools: 'text-accent-emerald border-accent-emerald/20 bg-accent-emerald/5 hover:bg-accent-emerald/10 shadow-glow-emerald'
  };

  return (
    <section id="about" className="py-32 relative overflow-hidden">
      <SectionIllustration icon={<User />} className="opacity-10" />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <SectionTitle 
          eyebrow="ABOUT ME"
          title="The Story Behind The <Code>" 
          subtitle="Combining technical precision with creative vision to build the future."
        />
        
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <AnimatedCard gradient className="p-10 mb-10">
              <h3 className="text-3xl font-display font-black mb-8 text-text-primary leading-tight">
                Crafting digital experiences through <span className="text-gradient">clean code</span> and elegant design.
              </h3>
              <p className="text-text-secondary text-lg leading-relaxed mb-10 whitespace-pre-wrap font-medium">
                {profile?.bio || 'Passionate developer dedicated to creating high-quality, efficient, and user-friendly web applications.'}
              </p>
              
              <div className="grid grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                  <div key={i} className="text-center group">
                    <div className="w-12 h-12 flex items-center justify-center glass rounded-2xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-black text-text-primary mb-1">{stat.value}</div>
                    <div className="text-[10px] text-text-secondary font-black uppercase tracking-widest">{stat.label}</div>
                  </div>
                ))}
              </div>
            </AnimatedCard>
          </motion.div>
          
          <div>
            <h4 className="text-[11px] font-mono font-black mb-10 uppercase tracking-[0.3em] text-text-primary flex items-center gap-4">
              <span className="w-12 h-[2px] bg-gradient-primary rounded-full" />
              Technical Arsenal
            </h4>
            
            <div className="flex flex-wrap gap-4 mb-16">
              {profile?.skills.map((skill, i) => {
                const category = getSkillCategory(skill);
                return (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className={`px-5 py-2 rounded-2xl border text-xs font-bold font-mono tracking-wide transition-all duration-300 cursor-default hover:scale-105 ${skillColors[category as keyof typeof skillColors]}`}
                  >
                    {skill}
                  </motion.div>
                );
              })}
            </div>
            
            <AnimatedCard className="p-8 border-l-4 border-accent-violet">
              <h5 className="text-lg font-bold mb-4 text-text-primary flex items-center gap-3">
                <Rocket className="text-accent-violet" size={20} /> Philosophy
              </h5>
              <p className="text-text-secondary text-base font-medium leading-relaxed italic">
                "I believe in software that is not only functional but also a joy to use. Simplicity and clarity are the cornerstones of every line of code I write."
              </p>
            </AnimatedCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
