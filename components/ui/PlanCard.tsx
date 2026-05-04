import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ActionPlan } from '../../lib/types';

interface PlanCardProps {
  plan: ActionPlan;
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  isOpen = false,
  onToggle,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(isOpen);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    if (onToggle) onToggle();
  };

  return (
    <motion.div
      className={`bg-bg-card rounded-card overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={handleToggle}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-opacity-80 transition-colors"
        aria-expanded={isExpanded}
        aria-label={`Toggle ${plan.title}`}
      >
        <div>
          <h3 className="font-semibold text-text-primary text-lg">{plan.title}</h3>
          <p className="text-sm text-text-secondary mt-1">{plan.period}</p>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-accent-primary" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-4">
              <ul className="space-y-3">
                {plan.actions.map((action, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <span className="text-accent-primary mt-1">•</span>
                    <span className="text-text-secondary leading-relaxed">{action}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
