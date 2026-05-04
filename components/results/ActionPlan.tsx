import React, { useState } from 'react';
import { Target, Calendar } from 'lucide-react';
import { PlanCard } from '../ui/PlanCard';
import { FadeUpSection } from '../ui/FadeUpSection';
import { ScoreResult } from '@/lib/types';
import { getActionPlan } from '@/lib/plans';

interface ActionPlanProps {
  scoreResult: ScoreResult;
}

export const ActionPlan: React.FC<ActionPlanProps> = ({ scoreResult }) => {
  const [openCard, setOpenCard] = useState(0);
  const actionPlan = getActionPlan(scoreResult.percentage);

  return (
    <div className="mb-12">
      <FadeUpSection delay={0} className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-accent-primary bg-opacity-20 rounded-full flex items-center justify-center">
            <Target className="w-6 h-6 text-accent-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-text-primary">
            Plan d'action 90 jours
          </h2>
        </div>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          Un plan personnalisé basé sur ton niveau pour améliorer tes finances étape par étape
        </p>
      </FadeUpSection>

      <div className="space-y-4">
        {actionPlan.plans.map((plan, index) => (
          <PlanCard
            key={index}
            plan={plan}
            isOpen={index === openCard}
            onToggle={() => setOpenCard(index === openCard ? -1 : index)}
          />
        ))}
      </div>

      <FadeUpSection delay={0.5} className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary bg-opacity-10 rounded-full">
          <Calendar className="w-4 h-4 text-accent-primary" />
          <span className="text-sm text-accent-primary font-medium">
            Commence aujourd'hui, vois les résultats en 90 jours
          </span>
        </div>
      </FadeUpSection>
    </div>
  );
};
