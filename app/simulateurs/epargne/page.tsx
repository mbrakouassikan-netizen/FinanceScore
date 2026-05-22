'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, TrendingUp, PiggyBank, Home, Briefcase, Target, Info } from 'lucide-react';

type Step = 1 | 2 | 3 | 'results';

type Objective = 'precaution' | 'projet' | 'retraite' | 'investir';

interface FormData {
  objectif: Objective | null;
  diaspora: boolean | null;
  epargneMensuelle: number;
  capitalDepart: number;
  duree: number;
}

const calculateCompoundInterest = (
  monthlyContribution: number,
  initialCapital: number,
  years: number,
  annualRate: number
): number => {
  const monthlyRate = annualRate / 12 / 100;
  const months = years * 12;
  
  let balance = initialCapital;
  for (let i = 0; i < months; i++) {
    balance = balance * (1 + monthlyRate) + monthlyContribution;
  }
  
  return Math.round(balance);
};

export default function EpargneSimulatorPage() {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<FormData>({
    objectif: null,
    diaspora: null,
    epargneMensuelle: 200,
    capitalDepart: 0,
    duree: 10,
  });

  const objectifs = [
    { id: 'precaution' as const, label: 'Épargne de précaution', icon: PiggyBank, description: 'Constituer une épargne de sécurité' },
    { id: 'projet' as const, label: 'Projet immobilier', icon: Home, description: 'Préparer un apport pour acheter' },
    { id: 'retraite' as const, label: 'Retraite', icon: Briefcase, description: 'Préparer ta retraite' },
    { id: 'investir' as const, label: 'Faire fructifier', icon: TrendingUp, description: 'Investir pour faire croître ton patrimoine' },
  ];

  // Real-time calculations
  const livretA = calculateCompoundInterest(formData.epargneMensuelle, formData.capitalDepart, formData.duree, 1.5);
  const avFondsEuros = calculateCompoundInterest(formData.epargneMensuelle, formData.capitalDepart, formData.duree, 2.5);
  const avUnitesCompte = calculateCompoundInterest(formData.epargneMensuelle, formData.capitalDepart, formData.duree, 5);
  const peaEtf = calculateCompoundInterest(formData.epargneMensuelle, formData.capitalDepart, formData.duree, 7);

  const totalVerse = formData.capitalDepart + (formData.epargneMensuelle * formData.duree * 12);
  const gains = avUnitesCompte - totalVerse;
  const fraisTransfertEconomises = formData.diaspora ? Math.round(formData.epargneMensuelle * 0.05 * formData.duree * 12) : 0;

  const getArticles = (objective: Objective) => {
    switch (objective) {
      case 'precaution':
        return [
          { title: 'Combien faut-il mettre de côté ?', category: 'Épargne' },
          { title: 'Méthode 50/30/20', category: 'Budget' },
        ];
      case 'projet':
        return [
          { title: 'Préparer son apport immobilier', category: 'Immobilier' },
          { title: 'Épargner 500€/mois', category: 'Épargne' },
        ];
      case 'retraite':
        return [
          { title: 'PEA vs assurance-vie vs PER', category: 'Investissement' },
          { title: 'Épargner pour la retraite à 30 ans', category: 'Retraite' },
        ];
      case 'investir':
        return [
          { title: 'ETF et intérêts composés', category: 'Investissement' },
          { title: 'Règle des 72', category: 'Finance' },
        ];
      default:
        return [];
    }
  };

  if (step === 'results' && formData.objectif) {
    const articles = getArticles(formData.objectif);

    return (
      <div className="min-h-screen" style={{ backgroundColor: '#0d0f1a' }}>
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-8">
            <Link href="/simulateurs" className="text-[#94a3b8] hover:text-white transition-colors mb-4 inline-block">
              ← Retour aux simulateurs
            </Link>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">
              Résultats de ton épargne
            </h1>
            <p className="text-[#94a3b8]">
              Comparatif des placements sur {formData.duree} ans
            </p>
          </div>

          {/* Real-time metrics */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 rounded-2xl border border-white/10 text-center" style={{ backgroundColor: '#1a1d2d' }}>
              <div className="text-3xl font-bold text-[#4ade80] mb-2">
                {avUnitesCompte.toLocaleString('fr-FR')} €
              </div>
              <div className="text-[#94a3b8]">Capital final (AV UC)</div>
            </div>
            <div className="p-6 rounded-2xl border border-white/10 text-center" style={{ backgroundColor: '#1a1d2d' }}>
              <div className="text-3xl font-bold text-white mb-2">
                {totalVerse.toLocaleString('fr-FR')} €
              </div>
              <div className="text-[#94a3b8]">Montant versé</div>
            </div>
            <div className="p-6 rounded-2xl border border-white/10 text-center" style={{ backgroundColor: '#1a1d2d' }}>
              <div className="text-3xl font-bold text-[#4ade80] mb-2">
                +{gains.toLocaleString('fr-FR')} €
              </div>
              <div className="text-[#94a3b8]">Gains générés</div>
            </div>
          </div>

          {/* Visual bar */}
          <div className="p-6 rounded-2xl border border-white/10 mb-8" style={{ backgroundColor: '#1a1d2d' }}>
            <div className="flex justify-between mb-2">
              <span className="text-white font-medium">Répartition</span>
              <span className="text-[#94a3b8]">Versé vs Gains</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden flex">
              <div
                className="h-full transition-all"
                style={{
                  width: `${(totalVerse / avUnitesCompte) * 100}%`,
                  backgroundColor: '#4ade80',
                }}
              />
              <div
                className="h-full transition-all"
                style={{
                  width: `${(gains / avUnitesCompte) * 100}%`,
                  backgroundColor: '#3b82f6',
                }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-[#94a3b8]">{totalVerse.toLocaleString('fr-FR')} € versé</span>
              <span className="text-[#94a3b8]">{gains.toLocaleString('fr-FR')} € gains</span>
            </div>
          </div>

          {/* Diaspora insight */}
          {formData.diaspora && (
            <div className="p-6 rounded-2xl border border-[#4ade80]/30 mb-8" style={{ backgroundColor: '#1a2e1a' }}>
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-[#4ade80] mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Insight diaspora</h3>
                  <p className="text-[#94a3b8]">
                    En épargnant {formData.epargneMensuelle} €/mois en France plutôt qu'en envoyant cet argent au pays, tu économises environ{' '}
                    <span className="text-[#4ade80] font-semibold">{fraisTransfertEconomises.toLocaleString('fr-FR')} €</span> de frais de transfert sur {formData.duree} ans.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Comparison cards */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Comparatif des placements</h2>
            <div className="grid md:grid-cols-4 gap-4">
              {/* Livret A */}
              <div className="p-6 rounded-2xl border border-white/10" style={{ backgroundColor: '#1a1d2d' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Livret A</h3>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full">
                    Sécurisé
                  </span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">1,5%</div>
                <div className="text-[#94a3b8] text-sm mb-4">Taux net</div>
                <div className="text-2xl font-bold text-[#94a3b8]">
                  {livretA.toLocaleString('fr-FR')} €
                </div>
                <div className="text-[#94a3b8] text-xs mt-1">Capital final</div>
              </div>

              {/* AV Fonds euros */}
              <div className="p-6 rounded-2xl border border-white/10" style={{ backgroundColor: '#1a1d2d' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">AV Fonds euros</h3>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full">
                    Sécurisé
                  </span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">2,5%</div>
                <div className="text-[#94a3b8] text-sm mb-4">Taux net moyen</div>
                <div className="text-2xl font-bold text-[#94a3b8]">
                  {avFondsEuros.toLocaleString('fr-FR')} €
                </div>
                <div className="text-[#94a3b8] text-xs mt-1">Capital final</div>
              </div>

              {/* AV Unités de compte */}
              <div className="p-6 rounded-2xl border-2 border-[#4ade80]" style={{ backgroundColor: '#1a1d2d' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">AV Unités de compte</h3>
                  <span className="px-3 py-1 bg-[#4ade80]/20 text-[#4ade80] text-xs font-medium rounded-full">
                    Recommandé
                  </span>
                </div>
                <div className="text-3xl font-bold text-[#4ade80] mb-2">5%</div>
                <div className="text-[#94a3b8] text-sm mb-4">Taux moyen</div>
                <div className="text-2xl font-bold text-white">
                  {avUnitesCompte.toLocaleString('fr-FR')} €
                </div>
                <div className="text-[#94a3b8] text-xs mt-1">Capital final</div>
              </div>

              {/* PEA-ETF */}
              <div className="p-6 rounded-2xl border border-white/10" style={{ backgroundColor: '#1a1d2d' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">PEA-ETF</h3>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-medium rounded-full">
                    Long terme
                  </span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">7%</div>
                <div className="text-[#94a3b8] text-sm mb-4">Taux historique</div>
                <div className="text-2xl font-bold text-[#94a3b8]">
                  {peaEtf.toLocaleString('fr-FR')} €
                </div>
                <div className="text-[#94a3b8] text-xs mt-1">Capital final</div>
              </div>
            </div>
          </div>

          {/* Articles */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Articles recommandés</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {articles.map((article, index) => (
                <div key={index} className="p-4 rounded-xl border border-white/10" style={{ backgroundColor: '#1a1d2d' }}>
                  <span className="px-2 py-1 bg-[#4ade80]/20 text-[#4ade80] text-xs font-medium rounded-full">
                    {article.category}
                  </span>
                  <h3 className="text-white font-medium mt-2 mb-1">{article.title}</h3>
                  <p className="text-[#94a3b8] text-sm">Article à venir</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setStep(3)}
              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Modifier
            </button>
            <Link
              href="/quiz"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#4ade80] text-black font-semibold rounded-full hover:bg-[#4ade80]/90 transition-all"
            >
              Faire le quiz CultureFinance <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0d0f1a' }}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/simulateurs" className="text-[#94a3b8] hover:text-white transition-colors mb-4 inline-block">
            ← Retour aux simulateurs
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">
            Simulateur d'épargne
          </h1>
          <p className="text-[#94a3b8]">
            Étape {step} sur 3
          </p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-2 mb-12">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className="flex-1 h-2 rounded-full transition-all"
              style={{
                backgroundColor: typeof step === 'number' && s <= step ? '#4ade80' : 'rgba(255, 255, 255, 0.1)',
              }}
            />
          ))}
        </div>

        {/* Step 1 — Objectif */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-semibold text-white mb-6">Quel est ton objectif ?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {objectifs.map((objectif) => {
                const Icon = objectif.icon;
                return (
                  <button
                    key={objectif.id}
                    onClick={() => setFormData({ ...formData, objectif: objectif.id })}
                    className={`p-6 rounded-2xl border text-left transition-all hover:border-[#4ade80]/30 ${
                      formData.objectif === objectif.id ? 'border-[#4ade80]' : 'border-white/10'
                    }`}
                    style={{ backgroundColor: '#1a1d2d' }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className="w-6 h-6 text-[#4ade80]" />
                      <h3 className="text-lg font-semibold text-white">{objectif.label}</h3>
                    </div>
                    <p className="text-[#94a3b8] text-sm">{objectif.description}</p>
                  </button>
                );
              })}
            </div>
            <div className="flex justify-end mt-8">
              <button
                onClick={() => setStep(2)}
                disabled={!formData.objectif}
                className="flex items-center gap-2 px-6 py-3 bg-[#4ade80] text-black font-semibold rounded-full hover:bg-[#4ade80]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuer <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Diaspora */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-semibold text-white mb-6">Envoies-tu de l'argent au pays ?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => setFormData({ ...formData, diaspora: true })}
                className={`p-6 rounded-2xl border text-left transition-all hover:border-[#4ade80]/30 ${
                  formData.diaspora === true ? 'border-[#4ade80]' : 'border-white/10'
                }`}
                style={{ backgroundColor: '#1a1d2d' }}
              >
                <h3 className="text-lg font-semibold text-white mb-2">Oui, j'envoie de l'argent au pays</h3>
                <p className="text-[#94a3b8] text-sm">Transferts réguliers vers ma famille ou mes projets</p>
              </button>
              <button
                onClick={() => setFormData({ ...formData, diaspora: false })}
                className={`p-6 rounded-2xl border text-left transition-all hover:border-[#4ade80]/30 ${
                  formData.diaspora === false ? 'border-[#4ade80]' : 'border-white/10'
                }`}
                style={{ backgroundColor: '#1a1d2d' }}
              >
                <h3 className="text-lg font-semibold text-white mb-2">Non</h3>
                <p className="text-[#94a3b8] text-sm">Je n'envoie pas d'argent régulièrement</p>
              </button>
            </div>
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 px-6 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Retour
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={formData.diaspora === null}
                className="flex items-center gap-2 px-6 py-3 bg-[#4ade80] text-black font-semibold rounded-full hover:bg-[#4ade80]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuer <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Sliders */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-semibold text-white mb-6">Configure ton épargne</h2>
            <div className="space-y-8">
              {/* Épargne mensuelle */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-white font-medium">Épargne mensuelle</label>
                  <span className="text-[#4ade80] font-semibold">{formData.epargneMensuelle} €</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="50"
                  value={formData.epargneMensuelle}
                  onChange={(e) => setFormData({ ...formData, epargneMensuelle: parseInt(e.target.value) })}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#4ade80]"
                />
                <div className="flex justify-between text-[#94a3b8] text-xs mt-1">
                  <span>50 €</span>
                  <span>1000 €</span>
                </div>
              </div>

              {/* Capital de départ */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-white font-medium">Capital de départ</label>
                  <span className="text-[#4ade80] font-semibold">{formData.capitalDepart} €</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20000"
                  step="500"
                  value={formData.capitalDepart}
                  onChange={(e) => setFormData({ ...formData, capitalDepart: parseInt(e.target.value) })}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#4ade80]"
                />
                <div className="flex justify-between text-[#94a3b8] text-xs mt-1">
                  <span>0 €</span>
                  <span>20 000 €</span>
                </div>
              </div>

              {/* Durée */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-white font-medium">Durée</label>
                  <span className="text-[#4ade80] font-semibold">{formData.duree} ans</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={formData.duree}
                  onChange={(e) => setFormData({ ...formData, duree: parseInt(e.target.value) })}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#4ade80]"
                />
                <div className="flex justify-between text-[#94a3b8] text-xs mt-1">
                  <span>1 an</span>
                  <span>30 ans</span>
                </div>
              </div>

              {/* Real-time preview */}
              <div className="p-6 rounded-2xl border border-white/10" style={{ backgroundColor: '#1a1d2d' }}>
                <h3 className="text-lg font-semibold text-white mb-4">Aperçu en temps réel</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-[#94a3b8] text-sm mb-1">Capital final</div>
                    <div className="text-2xl font-bold text-[#4ade80]">
                      {avUnitesCompte.toLocaleString('fr-FR')} €
                    </div>
                  </div>
                  <div>
                    <div className="text-[#94a3b8] text-sm mb-1">Montant versé</div>
                    <div className="text-2xl font-bold text-white">
                      {totalVerse.toLocaleString('fr-FR')} €
                    </div>
                  </div>
                  <div>
                    <div className="text-[#94a3b8] text-sm mb-1">Gains générés</div>
                    <div className="text-2xl font-bold text-[#4ade80]">
                      +{gains.toLocaleString('fr-FR')} €
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-6 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Retour
              </button>
              <button
                onClick={() => setStep('results')}
                className="flex items-center gap-2 px-6 py-3 bg-[#4ade80] text-black font-semibold rounded-full hover:bg-[#4ade80]/90 transition-all"
              >
                Voir les résultats <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
