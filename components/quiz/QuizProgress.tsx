import React from 'react';
import { motion } from 'framer-motion';

interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  currentPillar: string;
  className?: string;
}

export const QuizProgress: React.FC<QuizProgressProps> = ({
  currentQuestion,
  totalQuestions,
  currentPillar,
  className = '',
}) => {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className={`bg-bg-card rounded-card p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-accent-primary">
          {currentPillar}
        </span>
        <span className="text-sm text-text-secondary">
          Question {currentQuestion + 1} sur {totalQuestions}
        </span>
      </div>
      
      <div className="w-full bg-bg-primary rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-accent-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};
