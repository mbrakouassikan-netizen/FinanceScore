'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, Star, TrendingUp, AlertTriangle, CheckCircle2, Home, DollarSign } from 'lucide-react';

type Step = 1 | 2 | 3 | 4;

interface FormData {
  prixAchat: number;
  typeBien: string;
  etat: string;
  ville: string;
  surface: number;
  travaux: number;
  apport: number;
  tauxInteret: number;
  dureeEmprunt: number;
  tauxAssurance: number;
  loyerMensuel: number;
  typeLocation: string;
  vacanceLocative: number;
  chargesCopro: number;
  taxeFonciere: number;
  fraisGestion: number;
}

const typesBien = [
  { id: 'appartement', label: 'Appartement' },
  { id: 'maison', label: 'Maison' },
  { id: 'studio', label: 'Studio' },
  { id: 'parking', label: 'Parking' },
];

const vacances = [
  { value: 0, label: 'Aucune', desc: '0%' },
  { value: 4, label: 'Faible', desc: '4%' },
  { value: 8, label: 'Moyenne', desc: '8%' },
  { value: 15, label: 'Élevée', desc: '15%' },
];

const fraisGestionOptions = [
  { value: 0, label: 'Aucun' },
  { value: 7, label: '7%' },
  { value: 10, label: '10%' },
];

export default function InvestissementLocatifPage() {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<FormData>({
    prixAchat: 150000,
    typeBien: 'appartement',
    etat: 'ancien',
    ville: '',
    surface: 40,
    travaux: 0,
    apport: 30000,
    tauxInteret: 3.5,
    dureeEmprunt: 20,
    tauxAssurance: 0.3,
    loyerMensuel: 700,
    typeLocation: 'vide',
    vacanceLocative: 4,
    chargesCopro: 100,
    taxeFonciere: 800,
    fraisGestion: 0,
  });

  const update = (key: keyof FormData, value: string | number) =>
    setFormData(prev => ({ ...prev, [key]: value }));

  const fraisNotaire = formData.prixAchat * (formData.etat === 'neuf' ? 0.07 : 0.10);
  const coutTotal = formData.prixAchat + fraisNotaire + formData.travaux;
  const montantEmprunt = Math.max(0, coutTotal - formData.apport);
  const tauxMensuel = formData.tauxInteret / 100 / 12;
  const n = formData.dureeEmprunt * 12;
  const mensualiteCapital = tauxMensuel > 0 && n > 0
    ? montantEmprunt * tauxMensuel * Math.pow(1 + tauxMensuel, n) / (Math.pow(1 + tauxMensuel, n) - 1)
    : n > 0 ? montantEmprunt / n : 0;
  const mensualiteAssurance = montantEmprunt * formData.tauxAssurance / 100 / 12;
  const mensualiteTotale = mensualiteCapital + mensualiteAssurance;

  const loyerAnnuelBrut = formData.loyerMensuel * 12;
  const loyerAnnuelNet = loyerAnnuelBrut * (1 - formData.vacanceLocative / 100);
  const fraisGestionMontant = loyerAnnuelNet * formData.fraisGestion / 100;
  const chargesAnnuelles = formData.chargesCopro * 12 + formData.taxeFonciere + fraisGestionMontant;
  const loyerNetApresCharges = loyerAnnuelNet - chargesAnnuelles;
  const loyerMensuelNet = loyerNetApresCharges / 12;
  const cashflow = loyerMensuelNet - mensualiteTotale;
  const rentabiliteBrute = coutTotal > 0 ? (loyerAnnuelBrut / coutTotal) * 100 : 0;
  const rentabiliteNette = coutTotal > 0 ? (loyerNetApresCharges / coutTotal) * 100 : 0;

  const interetsAnnuels = montantEmprunt * formData.tauxInteret / 100;
  const revenuBrut = loyerAnnuelNet;

  const microFoncierImposable = revenuBrut * 0.7;
  const microFoncierImpot = microFoncierImposable * 0.30;
  const microFoncierNet = revenuBrut - microFoncierImpot;

  const reelImposable = Math.max(0, revenuBrut - chargesAnnuelles - interetsAnnuels);
  const reelImpot = reelImposable * 0.30;
  const reelNet = revenuBrut - reelImpot;

  const lmnpImposable = revenuBrut * 0.5;
  const lmnpImpot = lmnpImposable * 0.30;
  const lmnpNet = revenuBrut - lmnpImpot;

  const netRevenues = [microFoncierNet, reelNet, lmnpNet];
  const bestRegime = netRevenues.indexOf(Math.max(...netRevenues));

  const projection = [10, 15, 20].map(years => {
    const valeur = formData.prixAchat * Math.pow(1.015, years);
    const capitalRestant = tauxMensuel > 0 && n > 0
      ? montantEmprunt * (Math.pow(1 + tauxMensuel, n) - Math.pow(1 + tauxMensuel, years * 12)) / (Math.pow(1 + tauxMensuel, n) - 1)
      : Math.max(0, montantEmprunt - (montantEmprunt / formData.dureeEmprunt) * years);
    const capitalRembourse = montantEmprunt - Math.max(0, capitalRestant);
    return { years, valeur, capitalRembourse, patrimoineNet: valeur - Math.max(0, capitalRestant) };
  });

  const score = rentabiliteNette >= 6 ? 5 : rentabiliteNette >= 4 ? 4 : rentabiliteNette >= 3 ? 3 : rentabiliteNette >= 2 ? 2 : 1;
  const scoreLabels = ['', 'Insuffisant', 'Faible', 'Correct', 'Très bon', 'Excellent'];

  const fmt = (v: number) => v.toLocaleString('fr-FR', { maximumFractionDigits: 0 });
  const fmtPct = (v: number) => v.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const canGoNext = (s: Step): boolean => {
    if (s === 1) return !!formData.prixAchat && !!formData.typeBien && !!formData.etat;
    if (s === 2) return !!formData.apport && !!formData.tauxInteret && !!formData.dureeEmprunt;
    if (s === 3) return !!formData.loyerMensuel && !!formData.typeLocation;
    return true;
  };

  const stepTitles = ['Le bien', 'Financement', 'Revenus', 'Résultats'];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0d0f1a' }}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/simulateurs" className="text-[#94a3b8] hover:text-white transition-colors mb-4 inline-block">
            ← Retour aux simulateurs
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">Investissement locatif</h1>
          <p className="text-[#94a3b8]">Évaluez la rentabilité de votre investissement immobilier.</p>
        </div>

        {/* Progress */}
        <div className="mb-10">
          <div className="flex gap-2 mb-3">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className="flex-1 h-2 rounded-full transition-all"
                style={{ backgroundColor: s <= step ? '#4ade80' : 'rgba(255,255,255,0.1)' }} />
            ))}
          </div>
          <div className="flex justify-between text-xs">
            {stepTitles.map((t, i) => (
              <span key={i} style={{ color: i + 1 <= step ? '#4ade80' : '#94a3b8' }}>{t}</span>
            ))}
          </div>
        </div>

        {/* ÉTAPE 1 */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">Le bien</h2>
            <div>
              <label className="block text-white font-medium mb-2">Prix d'achat (€)</label>
              <input type="number" value={formData.prixAchat || ''} onChange={e => update('prixAchat', +e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#4ade80] focus:outline-none" placeholder="ex : 150 000" />
            </div>
            <div>
              <label className="block text-white font-medium mb-3">Type de bien</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {typesBien.map(t => (
                  <button key={t.id} onClick={() => update('typeBien', t.id)}
                    className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${formData.typeBien === t.id ? 'border-[#4ade80] bg-[#4ade80]/10 text-[#4ade80]' : 'border-white/10 text-white hover:border-white/30'}`}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-white font-medium mb-3">État du bien</label>
              <div className="grid grid-cols-2 gap-3">
                {[{ id: 'ancien', label: 'Ancien' }, { id: 'neuf', label: 'Neuf' }].map(e => (
                  <button key={e.id} onClick={() => update('etat', e.id)}
                    className={`p-3 rounded-xl border-2 font-medium transition-all ${formData.etat === e.id ? 'border-[#4ade80] bg-[#4ade80]/10 text-[#4ade80]' : 'border-white/10 text-white hover:border-white/30'}`}>
                    {e.label}
                  </button>
                ))}
              </div>
              <p className="text-[#94a3b8] text-xs mt-2">
                Frais de notaire : {formData.etat === 'neuf' ? '7%' : '10%'} — soit <span className="text-white">{fmt(fraisNotaire)} €</span>
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">Ville</label>
                <input type="text" value={formData.ville} onChange={e => update('ville', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#4ade80] focus:outline-none" placeholder="ex : Lyon" />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Surface (m²)</label>
                <input type="number" value={formData.surface || ''} onChange={e => update('surface', +e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#4ade80] focus:outline-none" placeholder="ex : 40" />
              </div>
            </div>
            <div>
              <label className="block text-white font-medium mb-2">Travaux prévus (€) <span className="text-[#94a3b8] font-normal text-sm">— optionnel</span></label>
              <input type="number" value={formData.travaux || ''} onChange={e => update('travaux', +e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#4ade80] focus:outline-none" placeholder="ex : 10 000" />
            </div>
            <div className="p-4 rounded-xl border border-white/10 bg-white/5 text-sm space-y-1">
              <div className="flex justify-between"><span className="text-[#94a3b8]">Prix d'achat</span><span className="text-white">{fmt(formData.prixAchat)} €</span></div>
              <div className="flex justify-between"><span className="text-[#94a3b8]">Frais de notaire ({formData.etat === 'neuf' ? '7%' : '10%'})</span><span className="text-white">{fmt(fraisNotaire)} €</span></div>
              {formData.travaux > 0 && <div className="flex justify-between"><span className="text-[#94a3b8]">Travaux</span><span className="text-white">{fmt(formData.travaux)} €</span></div>}
              <div className="flex justify-between font-semibold pt-2 border-t border-white/10"><span className="text-white">Coût total d'acquisition</span><span className="text-[#4ade80]">{fmt(coutTotal)} €</span></div>
            </div>
          </div>
        )}

        {/* ÉTAPE 2 */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">Financement</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">Apport personnel (€)</label>
                <input type="number" value={formData.apport || ''} onChange={e => update('apport', +e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#4ade80] focus:outline-none" placeholder="ex : 30 000" />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Taux d'intérêt (%)</label>
                <input type="number" step="0.1" value={formData.tauxInteret || ''} onChange={e => update('tauxInteret', +e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#4ade80] focus:outline-none" placeholder="ex : 3.5" />
              </div>
            </div>
            <div>
              <label className="block text-white font-medium mb-3">Durée du prêt : <span className="text-[#4ade80]">{formData.dureeEmprunt} ans</span></label>
              <input type="range" min={5} max={25} value={formData.dureeEmprunt} onChange={e => update('dureeEmprunt', +e.target.value)}
                className="w-full accent-[#4ade80]" />
              <div className="flex justify-between text-xs text-[#94a3b8] mt-1"><span>5 ans</span><span>25 ans</span></div>
            </div>
            <div>
              <label className="block text-white font-medium mb-2">Assurance emprunteur (%/an)</label>
              <input type="number" step="0.05" value={formData.tauxAssurance || ''} onChange={e => update('tauxAssurance', +e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#4ade80] focus:outline-none" placeholder="ex : 0.3" />
            </div>
            <div>
              <label className="block text-white font-medium mb-2">Frais de notaire <span className="text-[#94a3b8] font-normal text-sm">— calculés automatiquement</span></label>
              <div className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-[#94a3b8]">
                {fmt(fraisNotaire)} € ({formData.etat === 'neuf' ? '7%' : '10%'} — bien {formData.etat})
              </div>
            </div>
            <div className="p-4 rounded-xl border border-white/10 bg-white/5 text-sm space-y-1">
              <div className="flex justify-between"><span className="text-[#94a3b8]">Montant à emprunter</span><span className="text-white">{fmt(montantEmprunt)} €</span></div>
              <div className="flex justify-between"><span className="text-[#94a3b8]">Mensualité capital + intérêts</span><span className="text-white">{fmt(mensualiteCapital)} €/mois</span></div>
              <div className="flex justify-between"><span className="text-[#94a3b8]">Assurance</span><span className="text-white">{fmt(mensualiteAssurance)} €/mois</span></div>
              <div className="flex justify-between font-semibold pt-2 border-t border-white/10"><span className="text-white">Mensualité totale</span><span className="text-[#4ade80]">{fmt(mensualiteTotale)} €/mois</span></div>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">Revenus locatifs</h2>
            <div>
              <label className="block text-white font-medium mb-2">Loyer mensuel estimé (€)</label>
              <input type="number" value={formData.loyerMensuel || ''} onChange={e => update('loyerMensuel', +e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#4ade80] focus:outline-none" placeholder="ex : 700" />
            </div>
            <div>
              <label className="block text-white font-medium mb-3">Type de location</label>
              <div className="grid grid-cols-2 gap-3">
                {[{ id: 'vide', label: 'Vide' }, { id: 'meuble', label: 'Meublé' }].map(t => (
                  <button key={t.id} onClick={() => update('typeLocation', t.id)}
                    className={`p-3 rounded-xl border-2 font-medium transition-all ${formData.typeLocation === t.id ? 'border-[#4ade80] bg-[#4ade80]/10 text-[#4ade80]' : 'border-white/10 text-white hover:border-white/30'}`}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-white font-medium mb-3">Vacance locative</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {vacances.map(v => (
                  <button key={v.value} onClick={() => update('vacanceLocative', v.value)}
                    className={`p-3 rounded-xl border-2 transition-all ${formData.vacanceLocative === v.value ? 'border-[#4ade80] bg-[#4ade80]/10 text-[#4ade80]' : 'border-white/10 text-white hover:border-white/30'}`}>
                    <div className="font-medium text-sm">{v.label}</div>
                    <div className="text-xs opacity-70">{v.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">Charges copropriété (€/mois)</label>
                <input type="number" value={formData.chargesCopro || ''} onChange={e => update('chargesCopro', +e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#4ade80] focus:outline-none" placeholder="ex : 100" />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Taxe foncière (€/an)</label>
                <input type="number" value={formData.taxeFonciere || ''} onChange={e => update('taxeFonciere', +e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#4ade80] focus:outline-none" placeholder="ex : 800" />
              </div>
            </div>
            <div>
              <label className="block text-white font-medium mb-3">Frais de gestion locative</label>
              <div className="grid grid-cols-3 gap-3">
                {fraisGestionOptions.map(f => (
                  <button key={f.value} onClick={() => update('fraisGestion', f.value)}
                    className={`p-3 rounded-xl border-2 font-medium transition-all ${formData.fraisGestion === f.value ? 'border-[#4ade80] bg-[#4ade80]/10 text-[#4ade80]' : 'border-white/10 text-white hover:border-white/30'}`}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 4 — RÉSULTATS */}
        {step === 4 && (
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-white">Résultats de votre simulation</h2>

            {/* Bloc 1 — Rentabilité */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Rentabilité</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl border border-white/10 text-center" style={{ backgroundColor: '#1a1d2d' }}>
                  <div className="text-[#94a3b8] text-sm mb-1">Rentabilité brute</div>
                  <div className="text-3xl font-bold text-white">{fmtPct(rentabiliteBrute)}%</div>
                </div>
                <div className="p-5 rounded-2xl border border-white/10 text-center" style={{ backgroundColor: '#1a1d2d' }}>
                  <div className="text-[#94a3b8] text-sm mb-1">Rentabilité nette</div>
                  <div className="text-3xl font-bold text-white">{fmtPct(rentabiliteNette)}%</div>
                </div>
                <div className="p-5 rounded-2xl border border-white/10 text-center" style={{ backgroundColor: '#1a1d2d' }}>
                  <div className="text-[#94a3b8] text-sm mb-1">Cashflow mensuel</div>
                  <div className={`text-3xl font-bold ${cashflow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {cashflow >= 0 ? '+' : ''}{fmt(cashflow)} €
                  </div>
                </div>
              </div>
            </div>

            {/* Bloc 2 — Fiscalité */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Comparatif régimes fiscaux</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { name: 'Micro-foncier', note: 'Abattement 30%', imposable: microFoncierImposable, impot: microFoncierImpot, net: microFoncierNet, idx: 0 },
                  { name: 'Réel', note: 'Charges déductibles', imposable: reelImposable, impot: reelImpot, net: reelNet, idx: 1 },
                  { name: 'LMNP', note: 'Abattement 50% (meublé)', imposable: lmnpImposable, impot: lmnpImpot, net: lmnpNet, idx: 2 },
                ].map(regime => (
                  <div key={regime.name}
                    className={`p-5 rounded-2xl border relative ${regime.idx === bestRegime ? 'border-[#4ade80]/50 bg-[#4ade80]/5' : 'border-white/10'}`}
                    style={regime.idx !== bestRegime ? { backgroundColor: '#1a1d2d' } : undefined}>
                    {regime.idx === bestRegime && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 bg-[#4ade80] text-black text-xs font-bold rounded-full">Optimal</span>
                    )}
                    <div className="text-white font-semibold mb-1">{regime.name}</div>
                    <div className="text-[#94a3b8] text-xs mb-3">{regime.note}</div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between"><span className="text-[#94a3b8]">Revenu imposable</span><span className="text-white">{fmt(regime.imposable)} €</span></div>
                      <div className="flex justify-between"><span className="text-[#94a3b8]">Impôt (TMI 30%)</span><span className="text-white">{fmt(regime.impot)} €</span></div>
                      <div className="flex justify-between font-semibold border-t border-white/10 pt-1 mt-1">
                        <span className="text-white">Net après impôt</span>
                        <span className="text-[#4ade80]">{fmt(regime.net)} €/an</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bloc 3 — Projection */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Projection patrimoniale</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {projection.map(p => (
                  <div key={p.years} className="p-5 rounded-2xl border border-white/10" style={{ backgroundColor: '#1a1d2d' }}>
                    <div className="text-[#4ade80] font-bold text-lg mb-3 text-center">Dans {p.years} ans</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-[#94a3b8]">Valeur du bien</span><span className="text-white">{fmt(p.valeur)} €</span></div>
                      <div className="flex justify-between"><span className="text-[#94a3b8]">Capital remboursé</span><span className="text-white">{fmt(p.capitalRembourse)} €</span></div>
                      <div className="flex justify-between font-semibold border-t border-white/10 pt-2">
                        <span className="text-white">Patrimoine net</span>
                        <span className="text-[#4ade80]">{fmt(p.patrimoineNet)} €</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bloc 4 — Insight diaspora */}
            <div className="p-6 rounded-2xl border border-[#4ade80]/30" style={{ backgroundColor: '#1a1d2d' }}>
              <h3 className="text-lg font-semibold text-white mb-4">💡 Ce que ça représente pour toi</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#4ade80] mt-1.5 flex-shrink-0" />
                  <p className="text-[#94a3b8]">Ton loyer mensuel couvre <span className="text-white font-semibold">{(() => { const c = Math.floor(Math.max(0, loyerMensuelNet) / 300); return c === 1 ? '1 transfert de 300 €' : `${c} transferts de 300 €`; })()}</span> vers l'Afrique chaque mois</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#4ade80] mt-1.5 flex-shrink-0" />
                  <p className="text-[#94a3b8]">Dans 20 ans, ce bien vaut <span className="text-white font-semibold">{fmt(projection[2].valeur)} €</span> — soit <span className="text-white font-semibold">{Math.round(projection[2].valeur / (500 * 12))} années d'épargne</span> à 500 €/mois</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#4ade80] mt-1.5 flex-shrink-0" />
                  {cashflow >= 0 ? (
                    <p className="text-[#94a3b8]">Ton cashflow de <span className="font-semibold text-green-400">+{fmt(cashflow)} €/mois</span> couvre ta cotisation retraite complémentaire</p>
                  ) : (
                    <p className="text-[#94a3b8]">Ton effort d'épargne de <span className="font-semibold text-red-400">{fmt(Math.abs(cashflow))} €/mois</span> construit ton patrimoine — le locataire rembourse 80% de ton crédit</p>
                  )}
                </div>
              </div>
            </div>

            {/* Bloc 5 — Score */}
            <div className="p-6 rounded-2xl border border-white/10 text-center" style={{ backgroundColor: '#1a1d2d' }}>
              <h3 className="text-lg font-semibold text-white mb-4">Score de rentabilité</h3>
              <div className="flex justify-center gap-2 mb-3">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className={`w-8 h-8 ${s <= score ? 'text-[#4ade80] fill-[#4ade80]' : 'text-white/20'}`} />
                ))}
              </div>
              <div className="text-2xl font-bold text-[#4ade80] mb-1">{scoreLabels[score]}</div>
              <div className="text-[#94a3b8] text-sm">Rentabilité nette de {fmtPct(rentabiliteNette)}%</div>
            </div>

            {/* Bloc 6 — Conseils */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Conseils pratiques</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {cashflow < 0 ? (
                  <div className="p-4 rounded-xl border border-orange-500/30 bg-orange-500/5">
                    <AlertTriangle className="w-5 h-5 text-orange-400 mb-2" />
                    <p className="text-white text-sm font-medium mb-1">Cashflow négatif</p>
                    <p className="text-[#94a3b8] text-sm">Augmente ton apport ou réduis la durée du prêt pour améliorer le cashflow</p>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-[#4ade80]/30 bg-[#4ade80]/5">
                    <CheckCircle2 className="w-5 h-5 text-[#4ade80] mb-2" />
                    <p className="text-white text-sm font-medium mb-1">Cashflow positif ✓</p>
                    <p className="text-[#94a3b8] text-sm">Ton investissement génère un flux positif dès le départ</p>
                  </div>
                )}
                {rentabiliteNette < 4 ? (
                  <div className="p-4 rounded-xl border border-orange-500/30 bg-orange-500/5">
                    <TrendingUp className="w-5 h-5 text-orange-400 mb-2" />
                    <p className="text-white text-sm font-medium mb-1">Rentabilité faible</p>
                    <p className="text-[#94a3b8] text-sm">Négocie le prix d'achat à la baisse ou augmente le loyer estimé</p>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-[#4ade80]/30 bg-[#4ade80]/5">
                    <DollarSign className="w-5 h-5 text-[#4ade80] mb-2" />
                    <p className="text-white text-sm font-medium mb-1">Bonne rentabilité ✓</p>
                    <p className="text-[#94a3b8] text-sm">Ta rentabilité est satisfaisante. Pense à diversifier avec d'autres biens.</p>
                  </div>
                )}
                {bestRegime === 2 ? (
                  <div className="p-4 rounded-xl border border-[#4ade80]/30 bg-[#4ade80]/5">
                    <Home className="w-5 h-5 text-[#4ade80] mb-2" />
                    <p className="text-white text-sm font-medium mb-1">LMNP optimal</p>
                    <p className="text-[#94a3b8] text-sm">Passe en location meublée pour optimiser ta fiscalité avec le régime LMNP</p>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-white/10" style={{ backgroundColor: '#1a1d2d' }}>
                    <Link href="/simulateurs/credit" className="flex flex-col h-full">
                      <TrendingUp className="w-5 h-5 text-[#94a3b8] mb-2" />
                      <p className="text-white text-sm font-medium mb-1">Simuler mon financement</p>
                      <p className="text-[#94a3b8] text-sm">Calcule ta capacité d'emprunt pour affiner ce projet</p>
                      <div className="flex items-center gap-1 text-[#4ade80] text-xs mt-2">Simulateur crédit <ArrowRight className="w-3 h-3" /></div>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <button onClick={() => { setStep(1); }}
              className="flex items-center gap-2 px-6 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-all">
              <ArrowLeft className="w-4 h-4" /> Nouvelle simulation
            </button>
          </div>
        )}

        {/* Navigation étapes 1-3 */}
        {step !== 4 && (
          <div className="flex justify-between mt-10">
            {step > 1 ? (
              <button onClick={() => setStep((step - 1) as Step)}
                className="flex items-center gap-2 px-6 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-all">
                <ArrowLeft className="w-4 h-4" /> Précédent
              </button>
            ) : <div />}
            <button onClick={() => setStep((step + 1) as Step)} disabled={!canGoNext(step)}
              className="flex items-center gap-2 px-6 py-3 bg-[#4ade80] text-black font-semibold rounded-full hover:bg-[#4ade80]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {step === 3 ? 'Voir les résultats' : 'Suivant'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
