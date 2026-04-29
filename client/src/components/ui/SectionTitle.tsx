import React from 'react';
import { motion } from 'framer-motion';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  eyebrow?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle, align = 'center', eyebrow }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }}
      className={`mb-24 ${align === 'center' ? 'text-center' : 'text-left'}`}
    >
      {eyebrow && (
        <div className={`flex items-center gap-3 mb-6 ${align === 'center' ? 'justify-center' : 'justify-start'}`}>
          <div className="w-10 h-[1px] bg-gradient-primary opacity-50" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-violet">
            ✦ {eyebrow}
          </span>
          <div className="w-10 h-[1px] bg-gradient-primary opacity-50" />
        </div>
      )}
      <h2 className="text-3xl sm:text-4xl md:text-6xl font-display font-black mb-8 text-text-primary leading-tight">
        {title.split(' ').map((word, i) => (
          word.startsWith('<') ? (
            <span key={i} className="text-gradient-aurora block md:inline mx-1">{word.replace(/<|>/g, '')}</span>
          ) : (
            <span key={i} className="mr-3">{word}</span>
          )
        ))}
      </h2>
      
      {subtitle && (
        <p className="text-text-muted text-lg max-w-2xl font-medium tracking-wide leading-relaxed mx-auto">
          {subtitle}
        </p>
      )}

      <div className={`mt-10 h-[4px] w-16 bg-gradient-primary rounded-full shadow-glow-violet ${align === 'center' ? 'mx-auto' : ''}`} />
    </motion.div>
  );
};

export default SectionTitle;
