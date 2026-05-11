"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Info } from "lucide-react";

interface Resource {
  title: string;
  summary: string;
  url: string;
}

interface Category {
  name: string;
  emoji: string;
  resources: Resource[];
}

interface ScoreLevelResources {
  [key: string]: Resource[];
}

const categories: Category[] = [
  {
    name: "S'informer",
    emoji: "📚",
    resources: [
      {
        title: "MesQuestionsDArgent",
        summary: "Site officiel de la Banque de France dédié à l'éducation financière. Guides pratiques et simulateurs.",
        url: "https://www.mesquestionsdargent.fr"
      },
      {
        title: "AMF Épargne Info Service",
        summary: "L'AMF informe gratuitement sur les produits financiers et les bonnes pratiques d'investissement.",
        url: "https://www.amf-france.org"
      }
    ]
  },
  {
    name: "Mes droits",
    emoji: "🛡️",
    resources: [
      {
        title: "Médiateur bancaire",
        summary: "Service gratuit pour résoudre les litiges avec ta banque à l'amiable.",
        url: "https://www.lemediateur.fr"
      },
      {
        title: "Médiateur assurance",
        summary: "Service gratuit de médiation pour les assurés en conflit avec leur assureur.",
        url: "https://www.mediation-assurance.org"
      }
    ]
  },
  {
    name: "Éviter les arnaques",
    emoji: "⚠️",
    resources: [
      {
        title: "AMF — Liste noire",
        summary: "Liste officielle des sites non autorisés à proposer des investissements en France.",
        url: "https://www.amf-france.org/fr/espace-epargnants/proteger-son-epargne/listes-noires-et-mises-en-garde"
      },
      {
        title: "Banque de France — Arnaques",
        summary: "Guide officiel pour identifier et éviter les arnaques financières.",
        url: "https://www.banque-france.fr/fr/particuliers/proteger-son-argent"
      }
    ]
  }
];

const resourcesByScore: ScoreLevelResources = {
  "0-39": [
    {
      title: "Surendettement",
      summary: "Procédure gratuite mise en œuvre par la Banque de France. Permet de geler les poursuites et de rééchelonner tes dettes. Accessible à tous les particuliers en difficulté.",
      url: "https://www.banque-france.fr/fr/a-votre-service/particuliers/dossier-surendettement"
    },
    {
      title: "Aides sociales",
      summary: "Simule gratuitement tes droits à plus de 58 aides (RSA, APL, allocations familiales…) en quelques minutes, sans création de compte.",
      url: "https://www.mesdroitssociaux.gouv.fr"
    },
    {
      title: "Service Public",
      summary: "Guide officiel pour déposer un dossier de surendettement : conditions, pièces à fournir, délais.",
      url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F134"
    }
  ],
  "40-59": [
    {
      title: "Aides sociales",
      summary: "Simule gratuitement tes droits à plus de 58 aides (RSA, APL, allocations familiales…) en quelques minutes, sans création de compte.",
      url: "https://www.mesdroitssociaux.gouv.fr"
    },
    {
      title: "Aides financières",
      summary: "Retrouve toutes les aides disponibles selon ta situation : logement, emploi, famille, santé. Guide officiel Service Public.",
      url: "https://www.service-public.gouv.fr/particuliers/vosdroits/R54933"
    },
    {
      title: "Banque de France",
      summary: "Guides pratiques officiels pour mieux gérer ton budget et comprendre les bases de l'épargne et de la gestion financière.",
      url: "https://particuliers.banque-france.fr"
    }
  ],
  "60-79": [
    {
      title: "Simulateur retraite",
      summary: "Estime gratuitement ton âge de départ à la retraite et le montant de ta pension. Service public officiel, mis à jour en 2026.",
      url: "https://www.info-retraite.fr"
    },
    {
      title: "Plan épargne retraite",
      summary: "Tout comprendre sur le Plan Épargne Retraite (PER) et les nouvelles règles fiscales 2026. Guide officiel Service Public.",
      url: "https://www.service-public.gouv.fr/particuliers/actualites/A18841"
    },
    {
      title: "Aides financières",
      summary: "Retrouve toutes les aides disponibles selon ta situation : logement, emploi, famille, santé.",
      url: "https://www.service-public.gouv.fr/particuliers/vosdroits/R54933"
    }
  ],
  "80-100": [
    {
      title: "Simulateur retraite",
      summary: "Estime gratuitement ton âge de départ à la retraite et le montant de ta pension. Service public officiel, mis à jour en 2026.",
      url: "https://www.info-retraite.fr"
    },
    {
      title: "Succession & héritage",
      summary: "Guide officiel sur la transmission patrimoniale, les droits de succession et les démarches à effectuer. Source : economie.gouv.fr.",
      url: "https://www.economie.gouv.fr/particuliers/preparer-ma-retraite-et-ma-succession"
    },
    {
      title: "Plan épargne retraite",
      summary: "Tout comprendre sur le PER et les nouvelles règles fiscales 2026. Guide officiel Service Public.",
      url: "https://www.service-public.gouv.fr/particuliers/actualites/A18841"
    }
  ]
};

const getScoreRange = (score: number): string => {
  if (score <= 39) return "0-39";
  if (score <= 59) return "40-59";
  if (score <= 79) return "60-79";
  return "80-100";
};

const getLevelColors = (score: number) => {
  if (score <= 39) return {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    tabActive: "bg-red-500 text-white",
    tabInactive: "bg-red-100 text-red-700 hover:bg-red-200",
    button: "bg-red-500 hover:bg-red-600 text-white"
  };
  if (score <= 59) return {
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
    tabActive: "bg-orange-500 text-white",
    tabInactive: "bg-orange-100 text-orange-700 hover:bg-orange-200",
    button: "bg-orange-500 hover:bg-orange-600 text-white"
  };
  if (score <= 79) return {
    bg: "bg-white",
    border: "border-blue-200",
    text: "text-blue-700",
    tabActive: "bg-blue-500 text-white",
    tabInactive: "bg-blue-100 text-blue-700 hover:bg-blue-200",
    button: "bg-blue-500 hover:bg-blue-600 text-white"
  };
  return {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    tabActive: "bg-green-500 text-white",
    tabInactive: "bg-green-100 text-green-700 hover:bg-green-200",
    button: "bg-green-500 hover:bg-green-600 text-white"
  };
};

export default function OfficialResources({ score }: { score: number }) {
  const [activeTab, setActiveTab] = useState(0);
  
  // Guards et validation
  if (typeof score !== 'number' || isNaN(score) || score < 0 || score > 100) {
    console.warn('OfficialResources - Score invalide:', score);
    return null;
  }
  
  const colors = getLevelColors(score);
  const scoreRange = getScoreRange(score);
  const scoreResources = resourcesByScore[scoreRange] || [];

  // Guard pour l'activeTab
  if (activeTab < 0 || activeTab >= categories.length) {
    setActiveTab(0);
  }

  // Debug: Afficher les informations reçues
  console.log('OfficialResources - Score reçu:', score, 'Type:', typeof score);
  console.log('OfficialResources - Catégories fixes:', categories.length);
  console.log('OfficialResources - ScoreRange:', scoreRange, 'Resources:', scoreResources.length);

  return (
    <>
      {/* Section 1 - 3 catégories fixes pour tous les scores */}
      <motion.div
        className={`max-w-4xl mx-auto mb-12 p-6 rounded-xl ${colors.bg} ${colors.border} border`}
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
            Ressources officielles gratuites
          </h2>
          <p className={`text-sm ${colors.text} flex items-center justify-center gap-2`}>
            <Info className="w-4 h-4" />
            Ressources publiques officielles — aucune recommandation commerciale
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {categories.map((category, index) => {
            return (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeTab === index 
                    ? colors.tabActive 
                    : colors.tabInactive
                }`}
              >
                <span className="text-lg">{category.emoji}</span>
                {category.name}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          {/* Guard pour la catégorie active */}
          {categories[activeTab] ? (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {categories[activeTab].name}
                </h3>
                
                {categories[activeTab].resources.map((resource, resourceIndex) => (
                  <div key={resourceIndex} className="mb-6 last:mb-0">
                    <h4 className="text-base font-medium text-gray-900 mb-2">
                      {resource.title}
                    </h4>
                    <p className="text-text-secondary leading-relaxed mb-3">
                      {resource.summary}
                    </p>
                    <div className="flex justify-center">
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${colors.button} hover:shadow-lg transform hover:scale-105`}
                      >
                        <ExternalLink className="w-4 h-4" />
                        Site web
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center text-text-secondary">
              Catégorie non disponible
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Section 2 - Ressources spécifiques selon le score */}
      {scoreResources.length > 0 && (
        <motion.div
          className={`max-w-4xl mx-auto mb-12 p-6 rounded-xl ${colors.bg} ${colors.border} border`}
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
              Ressources adaptées à ton niveau
            </h2>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="grid gap-6">
              {scoreResources.map((resource, index) => (
                <div key={index} className="mb-6 last:mb-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {resource.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed mb-4">
                    {resource.summary}
                  </p>
                  <div className="flex justify-center">
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${colors.button} hover:shadow-lg transform hover:scale-105`}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Site web
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
