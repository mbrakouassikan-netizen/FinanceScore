import React from 'react';
import { TrendingUp, TrendingDown, CheckCircle, AlertCircle } from 'lucide-react';
import { ScoreResult } from '@/lib/types';
import { getStrengthsAndWeaknesses } from '@/lib/scoring';
import { FadeUpSection } from '../ui/FadeUpSection';

interface StrengthsWeaknessesProps {
  scoreResult: ScoreResult;
}

export const StrengthsWeaknesses: React.FC<StrengthsWeaknessesProps> = ({ scoreResult }) => {
  const { strengths, weaknesses } = getStrengthsAndWeaknesses(scoreResult.pillarScores);

  return (
    <div className="mb-12">
      <FadeUpSection delay={0} className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-text-primary">
          Tes forces & points à améliorer
        </h2>
      </FadeUpSection>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Strengths */}
        <FadeUpSection delay={0.2}>
          <div className="bg-bg-card rounded-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-score-green bg-opacity-20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-score-green" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary">Tes points forts</h3>
            </div>

            {strengths.length > 0 ? (
              <div className="space-y-3">
                {strengths.map((pillar, index) => (
                  <div key={pillar.name} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-score-green flex-shrink-0" />
                    <div>
                      <div className="font-medium text-text-primary">{pillar.name}</div>
                      <div className="text-sm text-text-secondary">
                        {Math.round(pillar.percentage)}% - Excellent niveau !
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-secondary">
                Continue tes efforts, tu es sur la bonne voie !
              </p>
            )}
          </div>
        </FadeUpSection>

        {/* Weaknesses */}
        <FadeUpSection delay={0.3}>
          <div className="bg-bg-card rounded-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-score-red bg-opacity-20 rounded-full flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-score-red" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary">Axes d'amélioration</h3>
            </div>

            {weaknesses.length > 0 ? (
              <div className="space-y-3">
                {weaknesses.map((pillar, index) => (
                  <div key={pillar.name} className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-score-red flex-shrink-0" />
                    <div>
                      <div className="font-medium text-text-primary">{pillar.name}</div>
                      <div className="text-sm text-text-secondary">
                        {Math.round(pillar.percentage)}% - Peut être optimisé
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-secondary">
                Bravo ! Tu n'as pas de points faibles majeurs.
              </p>
            )}
          </div>
        </FadeUpSection>
      </div>
    </div>
  );
};
