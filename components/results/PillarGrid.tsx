import React from 'react';
import { motion } from 'framer-motion';
import { PillarBar } from '../ui/PillarBar';
import { ScoreResult } from '@/lib/types';

interface PillarGridProps {
  scoreResult: ScoreResult;
}

export const PillarGrid: React.FC<PillarGridProps> = ({ scoreResult }) => {
  return (
    <div className="mb-12">
      <motion.h2
        className="text-2xl md:text-3xl font-serif font-bold text-text-primary text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        Les 6 piliers de tes finances
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-6">
        {scoreResult.pillarScores.map((pillar, index) => (
          <PillarBar
            key={pillar.name}
            pillar={pillar}
            delay={index * 0.1}
          />
        ))}
      </div>
    </div>
  );
};
