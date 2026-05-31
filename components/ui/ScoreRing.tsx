import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface ScoreRingProps {
  score: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  showPercentage?: boolean;
  animated?: boolean;
  className?: string;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  size = 200,
  strokeWidth = 12,
  color = '#4ade80',
  showPercentage = true,
  animated = true,
  className = '',
}) => {
  const [displayScore, setDisplayScore] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Count-up animation
  useEffect(() => {
    if (!animated || prefersReducedMotion) {
      setDisplayScore(score);
      return;
    }

    const duration = 1500; // 1.5 seconds
    const startTime = Date.now();
    
    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setDisplayScore(Math.floor(easeOutQuart * score));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [score, animated, prefersReducedMotion]);

  // Motion values for ring animation
  const motionProgress = useMotionValue(0);
  const springProgress = useSpring(motionProgress, { 
    duration: prefersReducedMotion ? 0 : 1500,
    bounce: 0 
  });
  const animatedOffset = useTransform(springProgress, v => 
    circumference - (v / 100) * circumference
  );

  useEffect(() => {
    if (animated && !prefersReducedMotion) {
      motionProgress.set(score);
    }
  }, [score, animated, prefersReducedMotion, motionProgress]);

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress circle with animation */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: animated ? animatedOffset : strokeDashoffset }}
          strokeLinecap="round"
          initial={false}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.3,
            delay: prefersReducedMotion ? 0 : 0.1,
          }}
        />
      </svg>
      
      {showPercentage && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            className="text-4xl font-bold text-text-primary"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: prefersReducedMotion ? 0 : 0.5,
              delay: prefersReducedMotion ? 0 : 0.3,
            }}
          >
            {displayScore}
          </motion.span>
          <span className="text-sm text-text-secondary">/100</span>
        </div>
      )}
    </div>
  );
};
