import React from 'react';
import { motion } from 'framer-motion';
import { Question as QuizQuestionType, Option as QuizOption } from '@/lib/types';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useAnalytics } from '@/hooks/useAnalytics';

interface QuizQuestionProps {
  question: QuizQuestionType;
  selectedOption: number | null;
  onOptionSelect: (optionIndex: number, points: number) => void;
  className?: string;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  selectedOption,
  onOptionSelect,
  className = '',
}) => {
  const prefersReducedMotion = useReducedMotion();
  const { trackQuizQuestionAnswered } = useAnalytics();

  return (
    <motion.div
      className={`bg-bg-card rounded-card p-6 md:p-8 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
    >
      <div className="mb-6">
        <div className="text-sm font-medium text-accent-primary mb-2">
          {question.pillar}
        </div>
        <h2 className="text-xl md:text-2xl font-serif text-text-primary leading-tight">
          {question.text}
        </h2>
      </div>

      <div className="space-y-3">
        {question.options.map((option: QuizOption, index: number) => (
          <motion.button
            key={index}
            onClick={() => {
              onOptionSelect(index, option.points);
              trackQuizQuestionAnswered(question.id, question.pillar);
            }}
            className={`w-full text-left p-4 rounded-card border-2 transition-all duration-200 ${
              selectedOption === index
                ? 'border-accent-primary bg-accent-primary bg-opacity-10'
                : 'border-bg-card hover:border-accent-secondary hover:bg-accent-secondary hover:bg-opacity-5'
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={!prefersReducedMotion ? { scale: 1.02 } : {}}
            whileTap={!prefersReducedMotion ? { scale: 0.98 } : {}}
          >
            <div className="flex items-center justify-between">
              <span className="text-text-primary leading-relaxed">
                {option.text}
              </span>
              {selectedOption === index && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 rounded-full bg-accent-primary flex items-center justify-center"
                >
                  <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </motion.div>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};
