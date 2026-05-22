'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

type Step = 1 | 2 | 3 | 4 | 'results' | 'redirect';

type Project = 'residence-principale' | 'investissement-locatif' | 'construction-pays' | 'residence-secondaire';
type Situation = 'salarie-cdi' | 'fonctionnaire' | 'independant' | 'cdd';
type Duration = 10 | 15 | 20 | 25;

interface FormData {
  project: Project | null;
  situation: Situation | null;
  revenus: number;
  coEmprunteur: boolean;
  revenusCoEmprunteur: number;
  loyer: number;
  autresCredits: number;
  revenusLocatifs: number;
  apport: number;
  duration: Duration | null;
  taux: number;
}

export default function CreditSimulatorPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<FormData>({
    project: null,
    situation: null,
    revenus: 0,
    coEmprunteur: false,
    revenusCoEmprunteur: 0,
    loyer: 0,
    autresCredits: 0,
    revenusLocatifs: 0,
    apport: 0,
    duration: null,
    taux: 3.7,
  });

  const projects = [
    { id: 'residence-principale' as const, label: 'Résidence principale', description: 'Acheter ton logement principal en France' },
    { id: 'investissement-locatif' as const, label: 'Investissement locatif', description: 'Acheter pour louer et générer des revenus' },
    { id: 'construction-pays' as const, label: 'Construction au pays', description: 'Construire un bien immobilier dans ton pays d\'origine' },
    { id: 'residence-secondaire' as const, label: 'Résidence secondaire', description: 'Acheter une maison de vacances' },
  ];

  const situations = [
    { id: 'salarie-cdi' as const, label: 'Salarié CDI', description: 'Contrat à durée indéterminée' },
    { id: 'fonctionnaire' as const, label: 'Fonctionnaire', description: 'Titulaire ou stagiaire' },
    { id: 'independant' as const, label: 'Indépendant', description: 'Entrepreneur, freelance, profession libérale' },
    { id: 'cdd' as const, label: 'CDD', description: 'Contrat à durée déterminée' },
  ];

  const durations: Duration[] = [10, 15, 20, 25];

  // Redirect to construction page if construction-pays is selected
  const handleProjectSelect = (project: Project) => {
    if (project === 'construction-pays') {
      router.push('/simulateurs/credit/construction-pays');
    } else {
      setFormData({ ...formData, project });
      setStep(2);
    }
  };

  const calculateResults = () => {
    const totalRevenus = formData.revenus + (formData.coEmprunteur ? formData.revenusCoEmprunteur : 0);
    const tauxInteret = formData.taux / 100;
    const dureeMois = (formData.duration || 20) * 12;
    
    // Calcul de la capacité d'emprunt basé sur 35% d'endettement
    const tauxEndettementMax = 0.35;
    
    // Calcul des charges selon le projet
    let chargesPourEndettement = 0;
    
    if (formData.project === 'residence-principale') {
      // Loyer NON inclus (sera remplacé par la future mensualité)
      // Autres crédits inclus
      // Revenus locatifs inclus s'ils existent (réduisent le taux d'endettement)
      chargesPourEndettement = formData.autresCredits - formData.revenusLocatifs;
    } else if (formData.project === 'investissement-locatif') {
      // Loyer inclus
      // Autres crédits inclus
      // Revenus locatifs attendus inclus (réduisent le taux d'endettement)
      // Les banques retiennent 70% des revenus locatifs
      chargesPourEndettement = formData.loyer + formData.autresCredits - (formData.revenusLocatifs * 0.7);
    } else if (formData.project === 'residence-secondaire') {
      // Loyer inclus
      // Autres crédits inclus
      chargesPourEndettement = formData.loyer + formData.autresCredits;
    }
    
    const revenuDisponible = totalRevenus - chargesPourEndettement;
    const mensualiteMax = revenuDisponible * tauxEndettementMax;
    
    // Calcul de la capacité d'emprunt
    const capaciteEmprunt = (mensualiteMax * dureeMois) / (1 - Math.pow(1 + tauxInteret / 12, -dureeMois));
    
    // Mensualité pour la capacité calculée
    const mensualite = (capaciteEmprunt * (tauxInteret / 12) * Math.pow(1 + tauxInteret / 12, dureeMois)) / (Math.pow(1 + tauxInteret / 12, dureeMois) - 1);
    
    // Taux d'endettement réel selon le projet
    let tauxEndettement = 0;
    if (formData.project === 'residence-principale') {
      tauxEndettement = ((mensualite + formData.autresCredits) / totalRevenus) * 100;
    } else if (formData.project === 'investissement-locatif') {
      tauxEndettement = ((mensualite + formData.loyer + formData.autresCredits - (formData.revenusLocatifs * 0.7)) / totalRevenus) * 100;
    } else if (formData.project === 'residence-secondaire') {
      tauxEndettement = ((mensualite + formData.loyer + formData.autresCredits) / totalRevenus) * 100;
    }

    return {
      capaciteEmprunt: Math.round(capaciteEmprunt),
      mensualite: Math.round(mensualite),
      tauxEndettement: Math.round(tauxEndettement * 10) / 10,
      tauxUtilise: formData.taux,
    };
  };

  const results = step === 'results' ? calculateResults() : null;

  if (step === 'results' && results) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#0d0f1a' }}>
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-8">
            <Link href="/simulateurs" className="text-[#94a3b8] hover:text-white transition-colors mb-4 inline-block">
              ← Retour aux simulateurs
            </Link>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">
              Résultats de ta capacité d'emprunt
            </h1>
            <p className="text-[#94a3b8]">
              Calcul basé sur un taux de {results.tauxUtilise}%
            </p>
          </div>

          {/* Metrics */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 rounded-2xl border border-white/10 text-center" style={{ backgroundColor: '#1a1d2d' }}>
              <div className="text-3xl font-bold text-[#4ade80] mb-2">
                {results.capaciteEmprunt.toLocaleString('fr-FR')} €
              </div>
              <div className="text-[#94a3b8]">Capacité d'emprunt</div>
            </div>
            <div className="p-6 rounded-2xl border border-white/10 text-center" style={{ backgroundColor: '#1a1d2d' }}>
              <div className="text-3xl font-bold text-white mb-2">
                {results.mensualite.toLocaleString('fr-FR')} €
              </div>
              <div className="text-[#94a3b8]">Mensualité</div>
            </div>
            <div className="p-6 rounded-2xl border border-white/10 text-center" style={{ backgroundColor: '#1a1d2d' }}>
              <div className="text-3xl font-bold mb-2" style={{ color: results.tauxEndettement <= 35 ? '#4ade80' : '#f97316' }}>
                {results.tauxEndettement}%
              </div>
              <div className="text-[#94a3b8]">Taux d'endettement</div>
            </div>
          </div>

          {/* Visual bar */}
          <div className="p-6 rounded-2xl border border-white/10 mb-8" style={{ backgroundColor: '#1a1d2d' }}>
            <div className="flex justify-between mb-2">
              <span className="text-white font-medium">Taux d'endettement</span>
              <span className="text-[#94a3b8]">{results.tauxEndettement}% / 35%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(results.tauxEndettement, 100)}%`,
                  backgroundColor: results.tauxEndettement <= 35 ? '#4ade80' : '#f97316',
                }}
              />
            </div>
            {results.tauxEndettement > 35 && (
              <div className="mt-3 flex items-start gap-2 text-[#f97316]">
                <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  Ton taux d'endettement dépasse les 35% recommandés. Considère d'augmenter ton apport ou de réduire la durée.
                </p>
              </div>
            )}
            {formData.project === 'investissement-locatif' && (
              <div className="mt-3 flex items-start gap-2 text-[#94a3b8]">
                <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  Les revenus locatifs sont retenus à 70% par les banques.
                </p>
              </div>
            )}
          </div>

          {/* Aides */}
          <div className="p-6 rounded-2xl border border-white/10 mb-8" style={{ backgroundColor: '#1a1d2d' }}>
            <h3 className="text-xl font-semibold text-white mb-4">Aides possibles</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#4ade80] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">PTZ (Prêt à Taux Zéro)</div>
                  <div className="text-[#94a3b8] text-sm">Pour les primo-accédants sous conditions de ressources</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#4ade80] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">Action Logement</div>
                  <div className="text-[#94a3b8] text-sm">Prêt Action Logement pour les salariés d'entreprises non agricoles</div>
                </div>
              </div>
            </div>
          </div>

          {/* Articles placeholders */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Articles recommandés</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-white/10" style={{ backgroundColor: '#1a1d2d' }}>
                <span className="px-2 py-1 bg-[#4ade80]/20 text-[#4ade80] text-xs font-medium rounded-full">
                  Crédit
                </span>
                <h4 className="text-white font-medium mt-2 mb-1">Comprendre le taux d'endettement</h4>
                <p className="text-[#94a3b8] text-sm">Comment les banques calculent ta capacité d'emprunt</p>
              </div>
              <div className="p-4 rounded-xl border border-white/10" style={{ backgroundColor: '#1a1d2d' }}>
                <span className="px-2 py-1 bg-[#4ade80]/20 text-[#4ade80] text-xs font-medium rounded-full">
                  Immobilier
                </span>
                <h4 className="text-white font-medium mt-2 mb-1">Préparer son apport personnel</h4>
                <p className="text-[#94a3b8] text-sm">Combien mettre de côté avant de demander un crédit</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setStep(1)}
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
            Simulateur de capacité d'emprunt
          </h1>
          <p className="text-[#94a3b8]">
            Étape {step} sur 4
          </p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-2 mb-12">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className="flex-1 h-2 rounded-full transition-all"
              style={{
                backgroundColor: typeof step === 'number' && s <= step ? '#4ade80' : 'rgba(255, 255, 255, 0.1)',
              }}
            />
          ))}
        </div>

        {/* Step 1 — Project */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-semibold text-white mb-6">Quel est ton projet ?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => handleProjectSelect(project.id)}
                  className={`p-6 rounded-2xl border text-left transition-all hover:border-[#4ade80]/30 ${
                    formData.project === project.id ? 'border-[#4ade80]' : 'border-white/10'
                  }`}
                  style={{ backgroundColor: '#1a1d2d' }}
                >
                  <h3 className="text-lg font-semibold text-white mb-2">{project.label}</h3>
                  <p className="text-[#94a3b8] text-sm">{project.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 — Situation */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-semibold text-white mb-6">Quelle est ta situation professionnelle ?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {situations.map((situation) => (
                <button
                  key={situation.id}
                  onClick={() => setFormData({ ...formData, situation: situation.id })}
                  className={`p-6 rounded-2xl border text-left transition-all hover:border-[#4ade80]/30 ${
                    formData.situation === situation.id ? 'border-[#4ade80]' : 'border-white/10'
                  }`}
                  style={{ backgroundColor: '#1a1d2d' }}
                >
                  <h3 className="text-lg font-semibold text-white mb-2">{situation.label}</h3>
                  <p className="text-[#94a3b8] text-sm">{situation.description}</p>
                </button>
              ))}
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
                disabled={!formData.situation}
                className="flex items-center gap-2 px-6 py-3 bg-[#4ade80] text-black font-semibold rounded-full hover:bg-[#4ade80]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuer <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Revenus */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-semibold text-white mb-6">Quels sont tes revenus et charges ?</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">Revenus nets mensuels (€)</label>
                <input
                  type="number"
                  value={formData.revenus || ''}
                  onChange={(e) => setFormData({ ...formData, revenus: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#4ade80] focus:outline-none"
                  placeholder="Ex: 2500"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="coEmprunteur"
                  checked={formData.coEmprunteur}
                  onChange={(e) => setFormData({ ...formData, coEmprunteur: e.target.checked })}
                  className="w-5 h-5 accent-[#4ade80]"
                />
                <label htmlFor="coEmprunteur" className="text-white">
                  J'ai un co-emprunteur
                </label>
              </div>
              {formData.coEmprunteur && (
                <div>
                  <label className="block text-white font-medium mb-2">Revenus nets du co-emprunteur (€)</label>
                  <input
                    type="number"
                    value={formData.revenusCoEmprunteur || ''}
                    onChange={(e) => setFormData({ ...formData, revenusCoEmprunteur: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#4ade80] focus:outline-none"
                    placeholder="Ex: 2000"
                  />
                </div>
              )}
              <div>
                <label className="block text-white font-medium mb-2">Loyer actuel mensuel (€)</label>
                <input
                  type="number"
                  value={formData.loyer || ''}
                  onChange={(e) => setFormData({ ...formData, loyer: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#4ade80] focus:outline-none"
                  placeholder="Ex: 800"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Autres crédits en cours (€)</label>
                <input
                  type="number"
                  value={formData.autresCredits || ''}
                  onChange={(e) => setFormData({ ...formData, autresCredits: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#4ade80] focus:outline-none"
                  placeholder="(crédit conso, leasing, pension alimentaire...)"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Revenus locatifs mensuels (€)</label>
                <input
                  type="number"
                  value={formData.revenusLocatifs || ''}
                  onChange={(e) => setFormData({ ...formData, revenusLocatifs: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#4ade80] focus:outline-none"
                  placeholder="(si vous avez déjà un bien en location)"
                />
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
                onClick={() => setStep(4)}
                disabled={!formData.revenus}
                className="flex items-center gap-2 px-6 py-3 bg-[#4ade80] text-black font-semibold rounded-full hover:bg-[#4ade80]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuer <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4 — Apport + Durée */}
        {step === 4 && (
          <div>
            <h2 className="text-2xl font-semibold text-white mb-6">Apport personnel et durée</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">Apport personnel (€)</label>
                <input
                  type="number"
                  value={formData.apport || ''}
                  onChange={(e) => setFormData({ ...formData, apport: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#4ade80] focus:outline-none"
                  placeholder="Ex: 30000"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-4">Durée du crédit</label>
                <div className="grid grid-cols-4 gap-4">
                  {durations.map((duration) => (
                    <button
                      key={duration}
                      onClick={() => setFormData({ ...formData, duration })}
                      className={`p-4 rounded-xl border text-center transition-all ${
                        formData.duration === duration
                          ? 'border-[#4ade80] bg-[#4ade80]/10'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                      style={{ backgroundColor: formData.duration === duration ? undefined : '#1a1d2d' }}
                    >
                      <div className="text-2xl font-bold text-white">{duration}</div>
                      <div className="text-[#94a3b8] text-sm">ans</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Taux du crédit (%)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="15"
                  value={formData.taux}
                  onChange={(e) => setFormData({ ...formData, taux: parseFloat(e.target.value) || 3.7 })}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#4ade80] focus:outline-none"
                />
                <p className="text-[#94a3b8] text-xs mt-1">
                  Taux indicatif 2025 — modifiez selon votre banque
                </p>
              </div>
            </div>
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-2 px-6 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Retour
              </button>
              <button
                onClick={() => setStep('results')}
                disabled={!formData.duration}
                className="flex items-center gap-2 px-6 py-3 bg-[#4ade80] text-black font-semibold rounded-full hover:bg-[#4ade80]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
