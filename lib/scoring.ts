import { QuizAnswer, ScoreResult, PillarScore, ScoreLevel } from './types';
import { questions, pillarMaxScores, totalMaxScore } from './questions';

export function calculateScore(answers: QuizAnswer[]): ScoreResult {
  // Group answers by pillar
  const pillarScores: Record<string, number> = {};
  const pillarCounts: Record<string, number> = {};

  // Initialize pillar scores
  (Object.keys(pillarMaxScores) as Array<keyof typeof pillarMaxScores>).forEach(pillar => {
    pillarScores[pillar] = 0;
    pillarCounts[pillar] = 0;
  });

  // Calculate scores for each answer
  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    if (question) {
      const pillar = question.pillar as keyof typeof pillarMaxScores;
      pillarScores[pillar] += answer.points;
      pillarCounts[pillar]++;
    }
  });

  // Create pillar score objects
  const pillarScoreObjects: PillarScore[] = Object.keys(pillarMaxScores).map(pillar => {
    const pillarKey = pillar as keyof typeof pillarMaxScores;
    return {
      name: pillar,
      score: pillarScores[pillarKey],
      maxScore: pillarMaxScores[pillarKey],
      percentage: Math.round((pillarScores[pillarKey] / pillarMaxScores[pillarKey]) * 100)
    };
  });

  // Calculate total score
  const totalScore = Object.values(pillarScores).reduce((sum, score) => sum + score, 0);
  const percentage = Math.round((totalScore / totalMaxScore) * 100);

  // Determine score level
  const level = getScoreLevel(percentage);

  return {
    totalScore,
    percentage,
    level,
    pillarScores: pillarScoreObjects
  };
}

function getScoreLevel(score: number): ScoreLevel {
  if (score >= 80) {
    return {
      name: "Finances solides",
      color: "#4ade80",
      emoji: "🟢",
      description: "Excellent ! Tes finances sont bien gérées et tu es sur la bonne voie pour atteindre tes objectifs."
    };
  } else if (score >= 60) {
    return {
      name: "En bonne progression",
      color: "#FFD166",
      emoji: "🟡",
      description: "Bravo ! Tu as de bonnes bases, continue comme ça et optimise quelques points pour atteindre l'excellence."
    };
  } else if (score >= 40) {
    return {
      name: "Finances fragiles",
      color: "#FF8C42",
      emoji: "🟠",
      description: "Attention ! Tes finances ont besoin d'attention. Quelques ajustements peuvent faire une grande différence."
    };
  } else {
    return {
      name: "Urgence financière",
      color: "#FF5C5C",
      emoji: "🔴",
      description: "Urgence ! Tes finances nécessitent une action immédiate. Reprends le contrôle avec un plan d'action simple."
    };
  }
}

export function getStrengthsAndWeaknesses(pillarScores: PillarScore[]) {
  const sortedPillars = [...pillarScores].sort((a, b) => b.percentage - a.percentage);
  
  return {
    strengths: sortedPillars.slice(0, 2).filter(p => p.percentage >= 60),
    weaknesses: sortedPillars.slice(-2).reverse().filter(p => p.percentage < 70)
  };
}
