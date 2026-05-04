import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface FadeUpSectionProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
}

export const FadeUpSection: React.FC<FadeUpSectionProps> = ({
  children,
  delay = 0,
  duration = 0.6,
  className = '',
  threshold = 0.1,
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration: prefersReducedMotion ? 0 : duration, 
        delay: prefersReducedMotion ? 0 : delay,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  );
};
