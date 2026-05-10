import React from 'react';
import { motion } from 'framer-motion';
import { PillarScore } from '@/lib/types';
import { getPillarIcon, getPillarColor } from '@/lib/questions';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface PillarBarProps {
  pillar: PillarScore;
  delay?: number;
}

export const PillarBar: React.FC<PillarBarProps> = ({ pillar, delay = 0 }) => {
  const Icon = getPillarIcon(pillar.name);
  const color = getPillarColor(pillar.name);
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="bg-bg-card rounded-card p-4"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        duration: prefersReducedMotion ? 0 : 1, 
        delay: prefersReducedMotion ? 0 : delay 
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Icon className="w-6 h-6" style={{ color }} />
          <div>
            <h3 className="font-medium text-text-primary">{pillar.name}</h3>
            <p className="text-sm text-text-secondary">
              {pillar.score}/{pillar.maxScore} pts
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-text-primary">
            {Math.round(pillar.percentage)}%
          </span>
        </div>
      </div>
      
      <div className="w-full bg-bg-primary rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pillar.percentage}%` }}
          transition={{ 
            duration: prefersReducedMotion ? 0 : 0.8, 
            delay: prefersReducedMotion ? 0 : delay + 0.2, 
            ease: 'easeOut' 
          }}
        />
      </div>
    </motion.div>
  );
};
