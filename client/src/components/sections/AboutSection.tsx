import React from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '../ui/SectionTitle';
import type { IProfile } from '../../types';
import { HardHat, Building, Settings, Rocket, Zap } from 'lucide-react';

interface AboutSectionProps {
  profile: IProfile | null;
}

const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  const stats = [
    { label: 'Project Cycles', value: '50+', icon: <Rocket size={20} />, color: 'accent-violet' },
    { label: 'Engineering Years', value: '03+', icon: <Zap size={20} />, color: 'accent-cyan' },
    { label: 'Tech Stack', value: '15+', icon: <Settings size={20} />, color: 'accent-pink' },
  ];

  return (
    <section id="about" className="py-32 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-accent-violet/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <SectionTitle 
          eyebrow="SYSTEM CORE"
          title="Architecting Digital & <Physical> Landscapes" 
          subtitle="Merging mathematical precision with creative engineering to build the next generation of infrastructure."
        />
        
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left Side: Bio Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-accent-violet/20 to-accent-cyan/20 rounded-[32px] blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="relative glass p-10 md:p-14 rounded-[32px] border border-white/10 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                  <HardHat size={200} />
                </div>
                
                <h3 className="text-3xl md:text-4xl font-display font-black mb-8 text-text-primary leading-tight">
                  Crafting resilient solutions through <span className="text-gradient">precision engineering</span>.
                </h3>
                
                <div className="space-y-6 text-text-secondary text-lg leading-relaxed font-medium opacity-80">
                  <p>
                    {profile?.bio || 'Professional Civil Engineer dedicated to creating safe, efficient, and sustainable infrastructure solutions for modern urban development.'}
                  </p>
                  <p>
                    Focused on the intersection of structural integrity and technical innovation, I ensure every project is built to endure the challenges of the future.
                  </p>
                </div>

                <div className="mt-12 flex flex-wrap gap-4">
                  {profile?.skills.map((skill, i) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.4, 
                        delay: i * 0.05,
                        ease: "easeOut"
                      }}
                      whileHover={{ scale: 1.1, y: -2 }}
                      className="px-5 py-2.5 rounded-xl glass border border-white/5 text-[11px] font-black uppercase tracking-widest text-text-primary hover:border-accent-violet/50 transition-all cursor-default"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Stats & Details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ x: 10 }}
                  className="glass p-8 rounded-[24px] border border-white/5 flex items-center justify-between group hover:border-white/20 transition-all duration-500"
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl bg-bg-surface flex items-center justify-center text-${stat.color} shadow-2xl border border-white/5 group-hover:scale-110 transition-transform`}>
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                      <h4 className="text-3xl font-black text-text-primary tracking-tighter">{stat.value}</h4>
                    </div>
                  </div>
                  <div className={`w-1 h-12 bg-${stat.color} opacity-20 rounded-full group-hover:opacity-100 transition-opacity`} />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative group mt-8"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-accent-violet to-accent-cyan rounded-[32px] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
              <div className="relative glass p-10 rounded-[32px] border border-white/5 bg-accent-violet/[0.02]">
                <h5 className="text-xl font-black text-text-primary mb-4 flex items-center gap-3">
                  <Building size={20} className="text-accent-violet" /> 
                  Engineering Philosophy
                </h5>
                <p className="text-text-secondary text-base font-medium leading-relaxed italic opacity-80">
                  "I believe in structures that are not only architecturally sound but also safe for generations. Integrity and sustainability are the cornerstones of every blueprint I sign."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
