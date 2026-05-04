import { Question } from './types';

export const questions: Question[] = [
  // PILIER 1 — REVENUS & DÉPENSES (max 20 pts)
  {
    id: 1,
    pillar: "Revenus & Dépenses",
    text: "À la fin du mois, que reste-t-il généralement dans ton compte ?",
    options: [
      { text: "Je suis souvent à découvert", points: 0 },
      { text: "Rien, je dépense tout", points: 3 },
      { text: "Un peu, mais irrégulièrement", points: 5 },
      { text: "Je mets de côté chaque mois", points: 8 }
    ]
  },
  {
    id: 2,
    pillar: "Revenus & Dépenses",
    text: "Quel % de tes revenus pars en loyer / logement ?",
    options: [
      { text: "Plus de 50%", points: 0 },
      { text: "Entre 40 et 50%", points: 2 },
      { text: "Entre 30 et 40%", points: 4 },
      { text: "Moins de 30%", points: 6 }
    ]
  },
  {
    id: 3,
    pillar: "Revenus & Dépenses",
    text: "Est-ce que tu suis tes dépenses ?",
    options: [
      { text: "Non, jamais", points: 0 },
      { text: "De temps en temps", points: 2 },
      { text: "Oui, mentalement", points: 3 },
      { text: "Oui, avec une app ou un tableau", points: 6 }
    ]
  },

  // PILIER 2 — ÉPARGNE (max 20 pts)
  {
    id: 4,
    pillar: "Épargne",
    text: "As-tu une épargne de sécurité (3 mois de dépenses) ?",
    options: [
      { text: "Non, pas du tout", points: 0 },
      { text: "Moins d'un mois", points: 3 },
      { text: "1 à 2 mois", points: 5 },
      { text: "Plus de 3 mois", points: 8 }
    ]
  },
  {
    id: 5,
    pillar: "Épargne",
    text: "Épargnes-tu chaque mois automatiquement ?",
    options: [
      { text: "Non, je dépense d'abord", points: 0 },
      { text: "Parfois, quand il reste quelque chose", points: 2 },
      { text: "Oui, mais irrégulièrement", points: 4 },
      { text: "Oui, virement automatique dès le salaire", points: 8 }
    ]
  },
  {
    id: 6,
    pillar: "Épargne",
    text: "Quel est ton taux d'épargne mensuel ?",
    options: [
      { text: "0%, je n'épargne pas", points: 0 },
      { text: "1 à 5%", points: 3 },
      { text: "5 à 15%", points: 6 },
      { text: "Plus de 15%", points: 8 }
    ]
  },
  {
    id: 7,
    pillar: "Épargne",
    text: "As-tu un objectif d'épargne chiffré avec une date ?",
    options: [
      { text: "Non, aucun objectif", points: 0 },
      { text: "Un objectif vague", points: 2 },
      { text: "Un montant sans date", points: 4 },
      { text: "Montant + date précise", points: 4 }
    ]
  },

  // PILIER 3 — DETTES (max 20 pts)
  {
    id: 8,
    pillar: "Dettes",
    text: "As-tu des crédits à la consommation en cours ?",
    options: [
      { text: "Oui, plusieurs, je peine à rembourser", points: 0 },
      { text: "Oui, mais je gère", points: 4 },
      { text: "Non, plus depuis peu", points: 6 },
      { text: "Non, jamais", points: 8 }
    ]
  },
  {
    id: 9,
    pillar: "Dettes",
    text: "Utilises-tu le BNPL (Klarna, Alma, PayPal 3x) ?",
    options: [
      { text: "Oui, souvent", points: 0 },
      { text: "Oui, parfois", points: 3 },
      { text: "Rarement", points: 5 },
      { text: "Non, jamais", points: 7 }
    ]
  },
  {
    id: 10,
    pillar: "Dettes",
    text: "Es-tu souvent à découvert ?",
    options: [
      { text: "Oui, presque tous les mois", points: 0 },
      { text: "Quelques fois par an", points: 3 },
      { text: "Très rarement", points: 5 },
      { text: "Jamais", points: 5 }
    ]
  },

  // PILIER 4 — DIASPORA & FAMILLE (max 15 pts)
  {
    id: 11,
    pillar: "Diaspora & Famille",
    text: "Envoies-tu de l'argent à ta famille à l'étranger ?",
    options: [
      { text: "Non, pas de famille à l'étranger", points: 5 },
      { text: "Oui, de façon impulsive", points: 0 },
      { text: "Oui, sans budget défini", points: 3 },
      { text: "Oui, avec un budget mensuel", points: 5 }
    ]
  },
  {
    id: 12,
    pillar: "Diaspora & Famille",
    text: "Quel % de tes revenus pars en transferts familiaux ?",
    options: [
      { text: "Plus de 30%", points: 0 },
      { text: "Entre 20 et 30%", points: 2 },
      { text: "Entre 10 et 20%", points: 4 },
      { text: "Moins de 10%", points: 5 }
    ]
  },
  {
    id: 13,
    pillar: "Diaspora & Famille",
    text: "As-tu déjà renoncé à épargner pour ta famille ?",
    options: [
      { text: "Oui, souvent", points: 0 },
      { text: "Quelques fois", points: 2 },
      { text: "Rarement", points: 4 },
      { text: "Non, j'ai trouvé l'équilibre", points: 5 }
    ]
  },

  // PILIER 5 — INVESTISSEMENT (max 15 pts)
  {
    id: 14,
    pillar: "Investissement",
    text: "As-tu un Livret A ou compte épargne rémunéré ?",
    options: [
      { text: "Non, tout est sur compte courant", points: 0 },
      { text: "Oui, mais presque vide", points: 3 },
      { text: "Oui, avec quelques économies", points: 5 },
      { text: "Oui, bien alimenté régulièrement", points: 6 }
    ]
  },
  {
    id: 15,
    pillar: "Investissement",
    text: "Investis-tu en bourse (PEA, ETF, actions) ?",
    options: [
      { text: "Non, j'ai peur", points: 0 },
      { text: "Non, mais ça m'intéresse", points: 2 },
      { text: "Oui, récemment", points: 4 },
      { text: "Oui, de façon régulière", points: 5 }
    ]
  },
  {
    id: 16,
    pillar: "Investissement",
    text: "As-tu une assurance-vie ou PER ?",
    options: [
      { text: "Non", points: 0 },
      { text: "C'est dans mes projets", points: 2 },
      { text: "Oui, j'en ai une", points: 4 },
      { text: "Oui, plusieurs", points: 4 }
    ]
  },

  // PILIER 6 — VISION & OBJECTIFS (max 10 pts)
  {
    id: 17,
    pillar: "Vision & Objectifs",
    text: "As-tu un objectif financier clair à 5 ans ?",
    options: [
      { text: "Non", points: 0 },
      { text: "J'y pense vaguement", points: 1 },
      { text: "Oui, un objectif défini", points: 2 },
      { text: "Oui, avec un plan chiffré", points: 4 }
    ]
  },
  {
    id: 18,
    pillar: "Vision & Objectifs",
    text: "Te sens-tu stressé(e) par l'argent ?",
    options: [
      { text: "Oui, anxiety constante", points: 0 },
      { text: "Souvent, surtout fin de mois", points: 1 },
      { text: "Parfois", points: 2 },
      { text: "Non, situation sous contrôle", points: 3 }
    ]
  },
  {
    id: 19,
    pillar: "Vision & Objectifs",
    text: "Comment évalues-tu tes connaissances financières ?",
    options: [
      { text: "Faibles", points: 0 },
      { text: "Basiques", points: 1 },
      { text: "Correctes, je me forme", points: 2 },
      { text: "Bonnes", points: 3 }
    ]
  }
];

export const pillarMaxScores = {
  "Revenus & Dépenses": 20,
  "Épargne": 20,
  "Dettes": 20,
  "Diaspora & Famille": 15,
  "Investissement": 15,
  "Vision & Objectifs": 10,
};

export const totalMaxScore = Object.values(pillarMaxScores).reduce((sum, score) => sum + score, 0);

// Fonctions pour obtenir les couleurs et icônes des piliers
export const getPillarColor = (pillarName: string): string => {
  const colors: Record<string, string> = {
    "Revenus & Dépenses": "#C8F04A", // accent-primary
    "Épargne": "#3B82F6", // blue
    "Dettes": "#EF4444", // red
    "Diaspora & Famille": "#F59E0B", // amber
    "Investissement": "#10B981", // green
    "Vision & Objectifs": "#8B5CF6", // purple
  };
  return colors[pillarName] || "#C8F04A";
};

export const getPillarIcon = (pillarName: string) => {
  const icons: Record<string, React.ComponentType<any>> = {
    "Revenus & Dépenses": require('lucide-react').Wallet,
    "Épargne": require('lucide-react').PiggyBank,
    "Dettes": require('lucide-react').CreditCard,
    "Diaspora & Famille": require('lucide-react').Users,
    "Investissement": require('lucide-react').TrendingUp,
    "Vision & Objectifs": require('lucide-react').Target,
  };
  return icons[pillarName] || require('lucide-react').Target;
};
