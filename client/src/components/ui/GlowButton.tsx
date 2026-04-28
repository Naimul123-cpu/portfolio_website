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
    primary: 'bg-accent-primary text-white shadow-sm hover:shadow-md hover:bg-opacity-90',
    secondary: 'bg-accent-secondary text-white shadow-sm hover:shadow-md hover:bg-opacity-90',
    outline: 'border border-border text-text-primary hover:bg-bg-secondary',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg font-bold',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'rounded-full font-semibold transition-all duration-300 btn-glow disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      onClick={props.onClick}
      type={props.type as any}
      disabled={props.disabled}
    >
      {children}
    </motion.button>
  );
};

export default GlowButton;
