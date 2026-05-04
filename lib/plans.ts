import { PlanContent } from './types';

export const actionPlans: PlanContent[] = [
  // PLAN ROUGE (score 0-39) — Urgence
  {
    scoreRange: [0, 39],
    title: "Plan d'Action - Urgence Financière",
    plans: [
      {
        title: "Semaine 1-2 : Cartographie complète",
        period: "Semaines 1-2",
        actions: [
          "Note TOUTES tes dépenses pendant 14 jours sans exception",
          "Catégorise chaque dépense : logement, alimentation, transport, loisirs",
          "Identifie les 3 plus grosses dépenses non essentielles",
          "Crée un tableau simple pour suivre ton flux d'argent"
        ]
      },
      {
        title: "Semaine 3-4 : Budget 50/30/20",
        period: "Semaines 3-4",
        actions: [
          "Applique la règle 50/30/20 : 50% besoins, 30% envies, 20% épargne+dettes",
          "Ouvre un compte dédié pour l'épargne automatique",
          "Mets en place des alertes quand tu approches des limites",
          "Fais le point chaque dimanche sur la semaine écoulée"
        ]
      },
      {
        title: "Mois 2 : Matelas de sécurité 500€",
        period: "Mois 2",
        actions: [
          "Ouvre un Livret A si tu n'en as pas",
          "Vire automatiquement 50€ par mois dès le jour du salaire",
          "Trouve 50€ supplémentaires en coupant 2-3 abonnements inutiles",
          "Visualise ton progrès avec une jauge d'épargne"
        ]
      },
      {
        title: "Mois 3 : Méthode Avalanche",
        period: "Mois 3",
        actions: [
          "Liste toutes tes dettes avec leur taux d'intérêt",
          "Attaque la dette la plus chère en premier (méthode avalanche)",
          "Consolide tes crédits si possible pour baisser les taux",
          "Célèbre chaque victoire : une dette remboursée = récompense"
        ]
      }
    ]
  },

  // PLAN ORANGE (score 40-59) — Fragile
  {
    scoreRange: [40, 59],
    title: "Plan d'Action - Consolidation",
    plans: [
      {
        title: "Semaine 1-2 : Automatisation maximale",
        period: "Semaines 1-2",
        actions: [
          "Mets en place virement épargne automatique jour du salaire",
          "Crée 3 comptes : besoin, épargne, projets",
          "Configure alertes bas de compte et haut de dépenses",
          "Bloque 1h par semaine pour admin financière"
        ]
      },
      {
        title: "Semaine 3-4 : Audit abonnements",
        period: "Semaines 3-4",
        actions: [
          "Liste TOUS tes abonnements (même cachés)",
          "Annule au moins 2 abonnements non essentiels",
          "Renégocie tes contrats : internet, assurance, téléphone",
          "Réinjecte 50-150€/mois économisés dans l'épargne"
        ]
      },
      {
        title: "Mois 2 : Premier investissement - PEA",
        period: "Mois 2",
        actions: [
          "Ouvre un PEA si tu n'en as pas (avantage fiscal)",
          "Commence avec ETF Monde (CW8 Amundi)",
          "Vire 50€/mois automatique vers ton PEA",
          "Apprends les bases : diversification, long terme"
        ]
      },
      {
        title: "Mois 3 : Fonds Famille dédié",
        period: "Mois 3",
        actions: [
          "Crée un compte séparé pour transferts familiaux",
          "Fixe un budget mensuel maximum pour la famille",
          "Communique ce budget à ta famille avec transparence",
          "Prévois un fonds d'urgence pour imprévus familiaux"
        ]
      }
    ]
  },

  // PLAN JAUNE (score 60-79) — Progression
  {
    scoreRange: [60, 79],
    title: "Plan d'Action - Optimisation",
    plans: [
      {
        title: "Semaine 1-2 : Optimisation placements",
        period: "Semaines 1-2",
        actions: [
          "Fais le point : Livret A plein ? Ouvre LDDS ou LEP",
          "Compare assurances-vie : frais d'entrée, fonds euros",
          "Vérifie ton allocation actuel : actions/obligations",
          "Optimise pour ton âge et tolérance au risque"
        ]
      },
      {
        title: "Semaine 3-4 : DCA mensuel systématique",
        period: "Semaines 3-4",
        actions: [
          "Mets en place DCA : même montant chaque mois",
          "Choisis 2-3 ETF complémentaires (monde + S&P 500)",
          "Automatise tout : virement vers PEA/assurance-vie",
          "Fixe objectif : 15% de revenus en investissement"
        ]
      },
      {
        title: "Mois 2 : Fonds projet patrimonial",
        period: "Mois 2",
        actions: [
          "Définis objectif chiffré : 'Avoir 50k€ d'ici 5 ans'",
          "Ouvre compte-titres ou PEA dédié à ce projet",
          "Calcule montant mensuel nécessaire pour l'objectif",
          "Suivi mensuel avec graphique de progression"
        ]
      },
      {
        title: "Mois 3 : Revenus complémentaires",
        period: "Mois 3",
        actions: [
          "Identifie tes compétences monétisables",
          "Lance une activité freelance (même 2h/semaine)",
          "Crée un produit digital (guide, template, cours)",
          "Objectif : +500€/mois revenus passifs actifs"
        ]
      }
    ]
  },

  // PLAN VERT (score 80-100) — Solide
  {
    scoreRange: [80, 100],
    title: "Plan d'Action - Excellence Patrimoniale",
    plans: [
      {
        title: "Semaine 1-2 : SCPI - immobilier papier",
        period: "Semaines 1-2",
        actions: [
          "Découvre les SCPI : rendement 4-6%/an sans gestion",
          "Commence avec 200€/mois sur SCPI France/Europe",
          "Diversifie : 2-3 SCPI complémentaires",
          "Avantages : mutualisation, liquidité, fiscalité optimisée"
        ]
      },
      {
        title: "Semaine 3-4 : PER - optimisation fiscale",
        period: "Semaines 3-4",
        actions: [
          "Ouvre un PER si tu es dans tranche d'imposition >30%",
            "Versement déductible : économie d'impôts immédiate",
          "Choisis fonds adaptés à ton horizon de retraite",
          "Simule économie d'impôts avec versement maximum"
        ]
      },
      {
        title: "Mois 2 : Stratégie 10 ans patrimoniale",
        period: "Mois 2",
        actions: [
          "Fixe objectif patrimoine net : 200k€, 500k€, 1M€ ?",
          "Calcule revenu passif visé : 1000€/mois ? 2000€ ?",
          "Crée roadmap annuelle avec étapes claires",
          "Simule scénarios : optimiste, réaliste, pessimiste"
        ]
      },
      {
        title: "Mois 3 : Création de valeur",
        period: "Mois 3",
        actions: [
          "Lance un projet aligné avec ta passion",
          "Monétise ton expertise : consulting, formation",
          "Crée un actif digital : SaaS, marketplace, contenu",
          "Objectif : transformer actif actif en source passive"
        ]
      }
    ]
  }
];

export function getActionPlan(score: number): PlanContent {
  const plan = actionPlans.find(p => score >= p.scoreRange[0] && score <= p.scoreRange[1]);
  return plan || actionPlans[0]; // Default to emergency plan if no match
}
