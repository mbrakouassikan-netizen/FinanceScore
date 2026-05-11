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

const categories: Category[] = [
  {
    name: "S'informer",
    emoji: "📚",
    resources: [
      {
        title: "MesQuestionsDArgent",
        summary: "Site officiel de la Banque de France dédié à l'éducation financière. Guides pratiques, simulateurs et conseils pour gérer ton budget au quotidien.",
        url: "https://www.mesquestionsdargent.fr"
      },
      {
        title: "AMF Épargne Info Service",
        summary: "L'Autorité des Marchés Financiers informe gratuitement sur les produits financiers, les risques et les bonnes pratiques d'investissement.",
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
        summary: "Service gratuit pour résoudre les litiges avec ta banque à l'amiable. Accessible à tout client bancaire en cas de désaccord non résolu.",
        url: "https://www.lemediateur.fr"
      },
      {
        title: "Médiateur assurance",
        summary: "Service gratuit de médiation pour les assurés en conflit avec leur assureur. Règlement amiable des litiges en assurance.",
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
        summary: "Consulte la liste noire officielle de l'AMF recensant les sites et entités non autorisés à proposer des investissements en France.",
        url: "https://www.amf-france.org/fr/espace-epargnants/proteger-son-epargne/listes-noires-et-mises-en-garde"
      },
      {
        title: "Banque de France — Arnaques",
        summary: "Guide officiel pour identifier et éviter les arnaques financières. Signalement et ressources de protection.",
        url: "https://www.banque-france.fr/fr/particuliers/proteger-son-argent"
      }
    ]
  }
];

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

  // Guard pour l'activeTab
  if (activeTab < 0 || activeTab >= categories.length) {
    setActiveTab(0);
  }

  // Debug: Afficher les informations reçues
  console.log('OfficialResources - Score reçu:', score, 'Type:', typeof score);
  console.log('OfficialResources - Catégories:', categories.length, categories);

  return (
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
  );
}
