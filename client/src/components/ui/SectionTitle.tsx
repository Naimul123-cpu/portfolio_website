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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`mb-16 ${align === 'center' ? 'text-center' : 'text-left'}`}
    >
      {eyebrow && (
        <span className="inline-block text-[10px] font-mono font-black uppercase tracking-[0.3em] text-accent-violet mb-4 px-4 py-1 glass rounded-full">
          — {eyebrow} —
        </span>
      )}
      <h2 className="text-4xl md:text-5xl font-display font-black mb-6 text-text-primary">
        {title.split(' ').map((word, i) => (
          word.startsWith('<') ? (
            <span key={i} className="text-gradient mx-2">{word.replace(/<|>/g, '')}</span>
          ) : (
            <span key={i}>{word} </span>
          )
        ))}
      </h2>
      {subtitle && (
        <p className="text-text-secondary text-lg max-w-2xl mx-auto font-medium tracking-wide">
          {subtitle}
        </p>
      )}
      <div className={`mt-8 h-[3px] w-20 bg-gradient-primary rounded-full shadow-glow-violet ${align === 'center' ? 'mx-auto' : ''}`} />
    </motion.div>
  );
};

export default SectionTitle;
