import React from 'react';
import { motion } from 'framer-motion';
import { ScoreRing } from '../ui/ScoreRing';
import { ScoreResult } from '@/lib/types';

interface ScoreHeaderProps {
  scoreResult: ScoreResult;
  userName?: string;
}

export const ScoreHeader: React.FC<ScoreHeaderProps> = ({
  scoreResult,
  userName,
}) => {
  return (
    <div className="text-center mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <ScoreRing
          score={scoreResult.percentage}
          size={200}
          color={scoreResult.level.color}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-4xl">{scoreResult.level.emoji}</span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-text-primary">
            {scoreResult.level.name}
          </h1>
        </div>
        
        <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
          {userName ? `${userName}, ` : ''}{scoreResult.level.description}
        </p>
      </motion.div>
    </div>
  );
};
