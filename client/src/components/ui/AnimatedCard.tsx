import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  gradient?: boolean;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  className = '', 
  delay = 0,
  gradient = false
}) => {
  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.34, 1.56, 0.64, 1] as any }}
      whileHover={{ y: -8 }}
      className={`group relative glass-card p-6 ${className}`}
    >
      {gradient && (
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}
      <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-[0.02] transition-opacity duration-500" />
      <div className="relative z-10">{children}</div>
      <div className="absolute inset-0 border border-white/0 group-hover:border-white/10 transition-colors duration-500 rounded-3xl pointer-events-none" />
    </motion.div>
  );
};

export default AnimatedCard;
