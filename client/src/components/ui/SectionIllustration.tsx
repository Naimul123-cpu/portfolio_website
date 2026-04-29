import React from 'react';
import { motion } from 'framer-motion';

interface SectionIllustrationProps {
  icon: React.ReactNode;
  className?: string;
}

const SectionIllustration: React.FC<SectionIllustrationProps> = ({ icon, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: 0.2 }}
      className={`absolute right-[5%] top-1/2 -translate-y-1/2 pointer-events-none z-0 hidden lg:block ${className}`}
    >
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="text-[var(--accent-violet)]"
        style={{ opacity: 'var(--illustration-opacity)' }}
      >
        {React.cloneElement(icon as React.ReactElement<any>, { size: 300 })}
      </motion.div>
    </motion.div>
  );
};

export default SectionIllustration;
