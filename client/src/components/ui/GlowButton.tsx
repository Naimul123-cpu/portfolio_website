import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const GlowButton: React.FC<GlowButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  ...props 
}) => {
  const variants = {
    primary: 'bg-gradient-primary text-white shadow-glow-violet hover:shadow-[0_0_50px_rgba(124,58,237,0.5)]',
    secondary: 'bg-gradient-secondary text-white shadow-glow-blue hover:shadow-[0_0_50px_rgba(37,99,235,0.5)]',
    outline: 'border border-border-card text-text-primary glass hover:border-accent-violet/50',
  };

  const sizes = {
    sm: 'px-4 py-1.5 text-xs font-mono uppercase tracking-widest',
    md: 'px-6 py-2.5 text-sm font-bold uppercase tracking-widest',
    lg: 'px-8 py-3.5 text-base font-bold uppercase tracking-widest',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'relative group rounded-full overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...(props as any)}
    >
      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

export default GlowButton;
