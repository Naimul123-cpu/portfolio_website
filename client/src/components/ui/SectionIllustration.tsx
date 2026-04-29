import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface SectionIllustrationProps {
  src: string;
  className?: string;
}

const SectionIllustration: React.FC<SectionIllustrationProps> = ({ src, className }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className={`section-bg-illustration float-animation ${className || ''}`}
    >
      <img 
        src={src} 
        alt="illustration" 
        className="w-full h-full object-contain"
      />
    </motion.div>
  );
};

export default SectionIllustration;
