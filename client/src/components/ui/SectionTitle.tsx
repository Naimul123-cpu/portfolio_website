import React from 'react';
import { motion } from 'framer-motion';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle, align = 'center' }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`mb-12 ${align === 'center' ? 'text-center' : 'text-left'}`}
    >
      <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4 text-text-primary">
        {title}
      </h2>
      {subtitle && (
        <p className="text-text-secondary text-base max-w-2xl mx-auto font-light">
          {subtitle}
        </p>
      )}
      <div className={`mt-6 h-px w-12 bg-accent-violet ${align === 'center' ? 'mx-auto' : ''}`} />
    </motion.div>
  );
};

export default SectionTitle;
