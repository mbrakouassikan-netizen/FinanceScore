'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, Phone, Building2, Banknote, CheckCircle2, TrendingUp, Clock, DollarSign, Loader2 } from 'lucide-react';

type Step = 1 | 2 | 'results';

interface FormData {
  deviseEnvoi: string;
  montant: number;
  pays: string;
  mode: string;
  frequence: string;
}

interface Service {
  id: string;
  name: string;
  fraisFixes: number;
  pourcentage: number;
  delai: string;
  disponibilite: string[];
  color: string;
  initials: string;
}

const deviseEnvoiOptions = [
  { value: 'EUR', label: '🇪🇺 Euro (EUR)' },
  { value: 'USD', label: '🇺🇸 Dollar USD' },
  { value: 'GBP', label: '🇬🇧 Livre Sterling' },
  { value: 'CAD', label: '🇨🇦 Dollar Canadien' },
  { value: 'CHF', label: '🇨🇭 Franc Suisse' },
  { value: 'CNY', label: '🇨🇳 Yuan Chinois' },
];

const paysOptions = [
  { value: 'SN', label: '🇸🇳 Sénégal (XOF)', devise: 'XOF' },
  { value: 'CI', label: "🇨🇮 Côte d'Ivoire (XOF)", devise: 'XOF' },
  { value: 'ML', label: '🇲🇱 Mali (XOF)', devise: 'XOF' },
  { value: 'BF', label: '🇧🇫 Burkina Faso (XOF)', devise: 'XOF' },
  { value: 'GN', label: '🇬🇳 Guinée (GNF)', devise: 'GNF' },
  { value: 'TG', label: '🇹🇬 Togo (XOF)', devise: 'XOF' },
  { value: 'BJ', label: '🇧🇯 Bénin (XOF)', devise: 'XOF' },
  { value: 'CM', label: '🇨🇲 Cameroun (XAF)', devise: 'XAF' },
  { value: 'MG', label: '🇲🇬 Madagascar (MGA)', devise: 'MGA' },
  { value: 'CD', label: '🇨🇩 Congo RDC (CDF)', devise: 'CDF' },
  { value: 'NG', label: '🇳🇬 Nigeria (NGN)', devise: 'NGN' },
  { value: 'GH', label: '🇬🇭 Ghana (GHS)', devise: 'GHS' },
  { value: 'MA', label: '🇲🇦 Maroc (MAD)', devise: 'MAD' },
];

const modes = [
  { id: 'mobile', label: 'Mobile Money', description: 'Orange Money, Wave, MTN...', icon: Phone },
  { id: 'bancaire', label: 'Compte bancaire', description: 'Virement bancaire direct', icon: Building2 },
  { id: 'cash', label: 'Retrait cash', description: 'Agence ou partenaire local', icon: Banknote },
];

const frequences = [
  { id: 'semaine', label: 'Une fois par semaine' },
  { id: 'mois', label: 'Une fois par mois' },
  { id: 'trimestre', label: 'Tous les 2-3 mois' },
  { id: 'occasionnel', label: 'Occasionnellement' },
];

const services: Service[] = [
  {
    id: 'lemfi',
    name: 'LemFi',
    fraisFixes: 0,
    pourcentage: 0,
    delai: '< 7 min',
    disponibilite: ['mobile', 'bancaire'],
    color: '#4ade80',
    initials: 'LF',
  },
  {
    id: 'wave',
    name: 'Wave',
    fraisFixes: 1,
    pourcentage: 1,
    delai: 'Instantané',
    disponibilite: ['mobile'],
    color: '#00d4ff',
    initials: 'WV',
  },
  {
    id: 'wise',
    name: 'Wise',
    fraisFixes: 0.5,
    pourcentage: 0.7,
    delai: '< 1h',
    disponibilite: ['bancaire'],
    color: '#3b82f6',
    initials: 'WS',
  },
  {
    id: 'remitly',
    name: 'Remitly',
    fraisFixes: 1.99,
    pourcentage: 1.2,
    delai: '< 10 min',
    disponibilite: ['mobile', 'bancaire', 'cash'],
    color: '#f97316',
    initials: 'RM',
  },
  {
    id: 'worldremit',
    name: 'WorldRemit',
    fraisFixes: 1.99,
    pourcentage: 1.5,
    delai: '< 30 min',
    disponibilite: ['mobile', 'bancaire', 'cash'],
    color: '#8b5cf6',
    initials: 'WR',
  },
  {
    id: 'westernunion',
    name: 'Western Union',
    fraisFixes: 3.90,
    pourcentage: 2,
    delai: 'Instantané',
    disponibilite: ['cash', 'mobile'],
    color: '#fbbf24',
    initials: 'WU',
  },
];

const servicesModes: Record<string, {
  modes: string[];
  partenaires: Record<string, string[]>;
}> = {
  lemfi: {
    modes: ['mobile', 'bancaire'],
    partenaires: {
      mobile: ['Orange Money', 'Wave', 'MTN Mobile Money', 'Moov Money'],
      bancaire: ['Virement bancaire direct'],
      cash: [],
    },
  },
  wave: {
    modes: ['mobile'],
    partenaires: {
      mobile: ['Wave', 'Orange Money'],
      bancaire: [],
      cash: [],
    },
  },
  wise: {
    modes: ['bancaire'],
    partenaires: {
      mobile: [],
      bancaire: ['Virement bancaire direct'],
      cash: [],
    },
  },
  remitly: {
    modes: ['mobile', 'bancaire', 'cash'],
    partenaires: {
      mobile: ['Orange Money', 'MTN Mobile Money', 'Wave'],
      bancaire: ['Virement bancaire direct'],
      cash: ['Agences partenaires locales'],
    },
  },
  worldremit: {
    modes: ['mobile', 'bancaire', 'cash'],
    partenaires: {
      mobile: ['Orange Money', 'MTN Mobile Money', 'Airtel Money'],
      bancaire: ['Virement bancaire direct'],
      cash: ['Agences Western Union', 'Partenaires locaux'],
    },
  },
  westernunion: {
    modes: ['cash', 'mobile'],
    partenaires: {
      mobile: ['Orange Money', 'MTN Mobile Money'],
      bancaire: [],
      cash: ['Agences Western Union', 'Points de retrait partenaires'],
    },
  },
};

const tauxDeChange: Record<string, number> = {
  'XOF': 655.957,
  'XAF': 655.957,
  'CDF': 2750,
  'NGN': 1650,
  'GHS': 15.5,
  'GNF': 8900,
  'MAD': 10.9,
};

export default function TransfertSimulatorPage() {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<FormData>({
    deviseEnvoi: 'EUR',
    montant: 300,
    pays: '',
    mode: 'mobile',
    frequence: '',
  });
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [ratesLoading, setRatesLoading] = useState(false);
  const [ratesError, setRatesError] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [expandedMode, setExpandedMode] = useState<string | null>(null);
  const [unavailableMessage, setUnavailableMessage] = useState<{ service: string; mode: string } | null>(null);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      setRatesLoading(true);
      setRatesError(false);
      try {
        const response = await fetch(`/api/exchange-rate?base=${formData.deviseEnvoi}`);
        if (!response.ok) throw new Error('Failed to fetch rates');
        const data = await response.json();
        if (data.conversion_rates) {
          setExchangeRates(data.conversion_rates);
          setLastUpdate(new Date(data.time_last_update_utc));
        } else {
          setRatesError(true);
        }
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
        setRatesError(true);
      } finally {
        setRatesLoading(false);
      }
    };

    fetchExchangeRates();
  }, [formData.deviseEnvoi]);

  const getFilteredServices = () => {
    return services.filter(service => service.disponibilite.includes(formData.mode));
  };

  const calculateFrais = (service: Service) => {
    return service.fraisFixes + (formData.montant * service.pourcentage) / 100;
  };

  const getMontantRecu = (service: Service, taux: number) => {
    const frais = calculateFrais(service);
    const montantNet = (formData.montant - frais) * (1 - service.pourcentage / 100);
    return montantNet * taux;
  };

  const formatMontant = (montant: number, devise: string) => {
    const rounded = devise === 'XOF' || devise === 'XAF' ? Math.round(montant) : montant;
    return rounded.toLocaleString('fr-FR', { minimumFractionDigits: devise === 'XOF' || devise === 'XAF' ? 0 : 2, maximumFractionDigits: 2 });
  };

  const handleModeBadgeClick = (serviceId: string, mode: string) => {
    const serviceModesData = servicesModes[serviceId];
    if (!serviceModesData) return;

    const isAvailable = serviceModesData.modes.includes(mode);
    if (isAvailable) {
      if (expandedService === serviceId && expandedMode === mode) {
        setExpandedService(null);
        setExpandedMode(null);
      } else {
        setExpandedService(serviceId);
        setExpandedMode(mode);
      }
      setUnavailableMessage(null);
    } else {
      setUnavailableMessage({ service: serviceId, mode });
      setTimeout(() => setUnavailableMessage(null), 3000);
    }
  };

  const getFrequenceAnnuelle = () => {
    switch (formData.frequence) {
      case 'semaine': return 52;
      case 'mois': return 12;
      case 'trimestre': return 4;
      case 'occasionnel': return 1;
      default: return 0;
    }
  };

  if (step === 'results') {
    const filteredServices = getFilteredServices().sort((a, b) => calculateFrais(a) - calculateFrais(b));
    const meilleurService = filteredServices[0];
    const pireService = filteredServices[filteredServices.length - 1];
    const economieParEnvoi = calculateFrais(pireService) - calculateFrais(meilleurService);
    const frequenceAnnuelle = getFrequenceAnnuelle();
    const economieAnnuelle = economieParEnvoi * frequenceAnnuelle;

    const pays = paysOptions.find(p => p.value === formData.pays);
    const devise = pays ? pays.devise : '';
    const taux = ratesError || Object.keys(exchangeRates).length === 0
      ? (pays ? tauxDeChange[pays.devise] || 1 : 1)
      : (exchangeRates[devise] || 1);

    const modeLabel = modes.find(m => m.id === formData.mode)?.label || '';

    const formatDate = (date: Date | null) => {
      if (!date) return '';
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
      <div className="min-h-screen" style={{ backgroundColor: '#0d0f1a' }}>
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-8">
            <Link href="/simulateurs" className="text-[#94a3b8] hover:text-white transition-colors mb-4 inline-block">
              ← Retour aux simulateurs
            </Link>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">
              Comparateur de transfert
            </h1>
            <p className="text-[#94a3b8]">
              Résultats pour votre envoi
            </p>
          </div>

          {/* Bloc 1 — Résumé de la recherche */}
          <div className="p-6 rounded-2xl border border-white/10 mb-8" style={{ backgroundColor: '#1a1d2d' }}>
            {ratesLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-6 h-6 text-[#4ade80] animate-spin mr-2" />
                <span className="text-[#94a3b8]">Chargement des taux de change...</span>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-white mb-2">
                  Envoi de {formData.montant.toLocaleString('fr-FR')} {formData.deviseEnvoi} vers {pays?.label} par {modeLabel}
                </h2>
                <div className="flex items-center gap-2 text-[#94a3b8]">
                  <span className="text-[#4ade80] font-semibold">1 {formData.deviseEnvoi} = {taux.toLocaleString('fr-FR')} {devise}</span>
                  {ratesError ? (
                    <span className="text-xs">— Taux indicatif</span>
                  ) : (
                    <span className="text-xs">— Taux mis à jour le {formatDate(lastUpdate)}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[#4ade80] mt-2">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Avec {meilleurService.name}, vous économisez {formatMontant(getMontantRecu(pireService, taux) - getMontantRecu(meilleurService, taux), devise)} {devise} par rapport au service le plus cher
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Bloc 2 — Comparatif des services */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Comparatif des services</h2>
            <div className="space-y-4">
              {filteredServices.map((service, index) => {
                const frais = calculateFrais(service);
                const montantRecu = getMontantRecu(service, taux);
                const isMeilleur = index === 0;
                const isPlusRapide = service.id === 'westernunion' && formData.mode === 'cash';
                const serviceModesData = servicesModes[service.id];
                const isModeSelected = formData.mode && !service.disponibilite.includes(formData.mode);
                const modeLabels = { mobile: 'Mobile Money', bancaire: 'Bancaire', cash: 'Cash' };
                const modeIcons = { mobile: '📱', bancaire: '🏦', cash: '💵' };

                return (
                  <div
                    key={service.id}
                    className="p-6 rounded-2xl border border-white/10 relative"
                    style={{ backgroundColor: '#1a1d2d' }}
                  >
                    {isMeilleur && (
                      <div className="absolute top-4 right-4 px-3 py-1 bg-[#4ade80] text-black text-xs font-bold rounded-full">
                        Meilleur choix
                      </div>
                    )}
                    {isPlusRapide && (
                      <div className="absolute top-4 right-4 px-3 py-1 bg-[#f97316] text-white text-xs font-bold rounded-full">
                        Le plus rapide
                      </div>
                    )}
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                        style={{ backgroundColor: service.color }}
                      >
                        {service.initials}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{service.name}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-[#94a3b8]">Frais total</span>
                            <div className="text-white font-semibold">{frais.toFixed(2)} {formData.deviseEnvoi}</div>
                          </div>
                          <div>
                            <span className="text-[#94a3b8]">Montant reçu</span>
                            <div className={`font-semibold ${isMeilleur ? 'text-green-400' : 'text-white'}`}>
                              {formatMontant(montantRecu, devise)} {devise}
                            </div>
                            {isMeilleur && (
                              <div className="text-green-400 text-xs mt-1">Meilleur taux disponible</div>
                            )}
                            {!isMeilleur && meilleurService && (
                              <div className="text-red-400 text-xs mt-1">
                                - {formatMontant(getMontantRecu(meilleurService, taux) - montantRecu, devise)} {devise} vs {meilleurService.name}
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="text-[#94a3b8]">Délai</span>
                            <div className="text-white font-semibold flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {service.delai}
                            </div>
                          </div>
                          <div>
                            <span className="text-[#94a3b8]">Disponible</span>
                            <div className="text-white font-semibold">{service.disponibilite.length === 1 ? '1 mode' : `${service.disponibilite.length} modes`}</div>
                          </div>
                        </div>

                        {/* Modes disponibles badges */}
                        <div className="flex flex-wrap gap-2 mt-4">
                          {serviceModesData?.modes.map((mode) => {
                            const isSelected = formData.mode === mode;
                            return (
                              <button
                                key={mode}
                                onClick={() => handleModeBadgeClick(service.id, mode)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#4ade80]/20 text-[#4ade80] border-2 border-white'
                                    : 'bg-[#4ade80]/20 text-[#4ade80] border border-[#4ade80]/50 hover:bg-[#4ade80]/30'
                                }`}
                              >
                                <span>{modeIcons[mode as keyof typeof modeIcons]}</span>
                                {modeLabels[mode as keyof typeof modeLabels]}
                              </button>
                            );
                          })}
                        </div>

                        {/* Message mode non disponible */}
                        {unavailableMessage?.service === service.id && (
                          <div className="mt-3 p-2 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <p className="text-red-400 text-xs">
                              Ce mode n'est pas disponible avec {service.name}
                            </p>
                          </div>
                        )}

                        {/* Panneau déroulant partenaires */}
                        {expandedService === service.id && expandedMode && serviceModesData && (
                          <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-white font-medium text-sm">
                                Partenaires {modeLabels[expandedMode as keyof typeof modeLabels]} disponibles
                              </h4>
                              <button
                                onClick={() => { setExpandedService(null); setExpandedMode(null); }}
                                className="text-[#94a3b8] hover:text-white text-xs"
                              >
                                Fermer
                              </button>
                            </div>
                            <ul className="space-y-1">
                              {serviceModesData.partenaires[expandedMode]?.map((partenaire) => (
                                <li key={partenaire} className="flex items-center gap-2 text-sm text-white">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
                                  {partenaire}
                                </li>
                              ))}
                              {serviceModesData.partenaires[expandedMode]?.length === 0 && (
                                <li className="text-sm text-[#94a3b8]">Aucun partenaire disponible</li>
                              )}
                            </ul>
                          </div>
                        )}

                        {/* Bandeau mode non disponible */}
                        {isModeSelected && (
                          <div className="mt-3 p-2 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                            <p className="text-orange-400 text-xs">
                              Mode {formData.mode} non disponible avec ce service
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bloc 3 — Insight économie annuelle */}
          {formData.frequence && frequenceAnnuelle > 0 && (
            <div className="p-6 rounded-2xl border border-[#4ade80]/30 mb-8" style={{ backgroundColor: '#1a1d2d' }}>
              <div className="flex items-start gap-3">
                <TrendingUp className="w-6 h-6 text-[#4ade80] mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Économie annuelle estimée</h3>
                  <p className="text-[#94a3b8] text-sm mb-4">
                    En choisissant {meilleurService.name} plutôt que {pireService.name}, tu économises <span className="text-[#4ade80] font-semibold">{economieAnnuelle.toFixed(2)} €</span> par an
                  </p>
                  <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(economieParEnvoi / calculateFrais(pireService)) * 100}%`,
                        backgroundColor: '#4ade80',
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-[#94a3b8] mt-2">
                    <span>{meilleurService.name}: {calculateFrais(meilleurService).toFixed(2)} €</span>
                    <span>{pireService.name}: {calculateFrais(pireService).toFixed(2)} €</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bloc 4 — Conseils pratiques */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Conseils pratiques</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-white/10" style={{ backgroundColor: '#1a1d2d' }}>
                <CheckCircle2 className="w-5 h-5 text-[#4ade80] mb-2" />
                <p className="text-white text-sm">Comparez toujours frais + taux avant d'envoyer</p>
              </div>
              <div className="p-4 rounded-xl border border-white/10" style={{ backgroundColor: '#1a1d2d' }}>
                <Clock className="w-5 h-5 text-[#4ade80] mb-2" />
                <p className="text-white text-sm">Préférez les virements en semaine — les taux du weekend sont moins bons</p>
              </div>
              <div className="p-4 rounded-xl border border-white/10" style={{ backgroundColor: '#1a1d2d' }}>
                <DollarSign className="w-5 h-5 text-[#4ade80] mb-2" />
                <p className="text-white text-sm">Évitez les intermédiaires informels — risques de perte ou blocage</p>
              </div>
            </div>
          </div>

          {/* Bloc 5 — Articles recommandés */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Articles recommandés</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-white/10" style={{ backgroundColor: '#1a1d2d' }}>
                <span className="px-2 py-1 bg-[#4ade80]/20 text-[#4ade80] text-xs font-medium rounded-full">
                  Comparatif
                </span>
                <h4 className="text-white font-medium mt-2 mb-1">Wave, Wise, Remitly : lequel choisir pour envoyer en Afrique ?</h4>
                <p className="text-[#94a3b8] text-sm">Guide complet pour choisir le bon service</p>
              </div>
              <div className="p-4 rounded-xl border border-white/10" style={{ backgroundColor: '#1a1d2d' }}>
                <span className="px-2 py-1 bg-[#4ade80]/20 text-[#4ade80] text-xs font-medium rounded-full">
                  Économies
                </span>
                <h4 className="text-white font-medium mt-2 mb-1">Comment réduire ses frais de transfert de 50% ?</h4>
                <p className="text-[#94a3b8] text-sm">Stratégies pour optimiser vos envois</p>
              </div>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setStep(1)}
              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Modifier ma recherche
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
            Comparateur de transfert d'argent
          </h1>
          <p className="text-[#94a3b8]">
            Trouvez le service le moins cher pour envoyer de l'argent au pays.
          </p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-2 mb-12">
          {[1, 2].map((s) => (
            <div
              key={s}
              className="flex-1 h-2 rounded-full transition-all"
              style={{
                backgroundColor: typeof step === 'number' && s <= step ? '#4ade80' : 'rgba(255, 255, 255, 0.1)',
              }}
            />
          ))}
        </div>

        {/* Step 1 — Formulaire de saisie */}
        {step === 1 && (
          <div>
            {/* Champ 1 — Devise d'envoi */}
            <div className="mb-8">
              <label className="block text-white font-medium mb-2">Devise d'envoi</label>
              <select
                value={formData.deviseEnvoi}
                onChange={(e) => setFormData({ ...formData, deviseEnvoi: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-[#1a1d2e] border border-[#2a2d3e] text-white focus:border-[#4ade80] focus:outline-none"
              >
                {deviseEnvoiOptions.map((devise) => (
                  <option key={devise.value} value={devise.value}>
                    {devise.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Champ 2 — Montant */}
            <div className="mb-8">
              <label className="block text-white font-medium mb-2">Montant à envoyer ({formData.deviseEnvoi})</label>
              <input
                type="number"
                value={formData.montant || ''}
                onChange={(e) => setFormData({ ...formData, montant: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#4ade80] focus:outline-none"
                placeholder="ex : 300"
              />
            </div>

            {/* Champ 3 — Pays de destination */}
            <div className="mb-8">
              <label className="block text-white font-medium mb-2">Pays de destination</label>
              <select
                value={formData.pays}
                onChange={(e) => setFormData({ ...formData, pays: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-[#1a1d2e] border border-[#2a2d3e] text-white focus:border-[#4ade80] focus:outline-none"
              >
                <option value="">Sélectionnez un pays</option>
                {paysOptions.map((pays) => (
                  <option key={pays.value} value={pays.value}>
                    {pays.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Champ 3 — Mode de réception */}
            <div className="mb-8">
              <label className="block text-white font-medium mb-4">Mode de réception</label>
              <div className="grid md:grid-cols-3 gap-4">
                {modes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setFormData({ ...formData, mode: mode.id })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.mode === mode.id
                        ? 'border-[#4ade80] bg-[#4ade80]/10'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <mode.icon className="w-6 h-6 mb-2 mx-auto" style={{ color: formData.mode === mode.id ? '#4ade80' : '#94a3b8' }} />
                    <div className="text-white font-medium text-sm">{mode.label}</div>
                    <div className="text-[#94a3b8] text-xs mt-1">{mode.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Champ 4 — Fréquence d'envoi */}
            <div className="mb-8">
              <label className="block text-white font-medium mb-4">À quelle fréquence envoyez-vous ? (optionnel)</label>
              <div className="grid md:grid-cols-4 gap-4">
                {frequences.map((freq) => (
                  <button
                    key={freq.id}
                    onClick={() => setFormData({ ...formData, frequence: freq.id })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.frequence === freq.id
                        ? 'border-[#4ade80] bg-[#4ade80]/10'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="text-white font-medium text-sm">{freq.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Bouton */}
            <div className="flex justify-end">
              <button
                onClick={() => setStep('results')}
                disabled={!formData.montant || !formData.pays || !formData.mode}
                className="flex items-center gap-2 px-6 py-3 bg-[#4ade80] text-black font-semibold rounded-full hover:bg-[#4ade80]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Comparer les services <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
