export interface Question {
  id: number;
  pillar: string;
  text: string;
  options: Option[];
}

export interface Option {
  text: string;
  points: number;
}

export interface QuizAnswer {
  questionId: number;
  selectedOption: number;
  points: number;
}

export interface PillarScore {
  name: string;
  score: number;
  maxScore: number;
  percentage: number;
}

export interface ScoreResult {
  totalScore: number;
  percentage: number;
  level: ScoreLevel;
  pillarScores: PillarScore[];
}

export interface ScoreLevel {
  name: string;
  color: string;
  emoji: string;
  description: string;
}

export interface UserInfo {
  name: string;
  email: string;
  score: number;
  level: string;
  pillarScores: number[];
  date: string;
}

export interface ActionPlan {
  title: string;
  period: string;
  actions: string[];
}

export interface PlanContent {
  scoreRange: [number, number];
  title: string;
  plans: ActionPlan[];
}

export interface GoogleSheetRow {
  timestamp: string;
  name: string;
  email: string;
  score: number;
  level: string;
  scoreEpargne: number;
  scoreRevenus: number;
  scoreDettes: number;
  scoreDiaspora: number;
  scoreInvest: number;
  scoreVision: number;
  dateTest: string;
}
