'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, AlertTriangle, CheckCircle2, Info, ChevronDown, ChevronUp, TrendingDown } from 'lucide-react';

type Step = 1 | 2 | 3;

interface FormData {
  montant: number;
  tauxInteret: number;
  duree: number;
  typeTaux: string;
  tauxAssurance: number;
  revenus: number;
  charges: number;
  envoiPays: number;
  epargneSouhaitee: number;
}

const formatDuree = (mois: number) => {
  const ans = Math.floor(mois / 12);
  const m = mois % 12;
  if (ans === 0) return `${m} mois`;
  if (m === 0) return `${ans} an${ans > 1 ? 's' : ''}`;
  return `${ans} an${ans > 1 ? 's' : ''} et ${m} mois`;
};

export default function RemboursementPage() {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<FormData>({
    montant: 200000,
    tauxInteret: 3.5,
    duree: 20,
    typeTaux: 'fixe',
    tauxAssurance: 0.3,
    revenus: 3000,
    charges: 500,
    envoiPays: 200,
    epargneSouhaitee: 200,
  });
  const [extraMensuel, setExtraMensuel] = useState(0);
  const [showAmort, setShowAmort] = useState(false);

  const update = (key: keyof FormData, value: string | number) =>
    setFormData(prev => ({ ...prev, [key]: value }));

  const tauxMensuel = formData.tauxInteret / 100 / 12;
  const n = formData.duree * 12;
  const mensualiteCapital = tauxMensuel > 0 && n > 0
    ? formData.montant * tauxMensuel * Math.pow(1 + tauxMensuel, n) / (Math.pow(1 + tauxMensuel, n) - 1)
    : n > 0 ? formData.montant / n : 0;
  const mensualiteAssurance = formData.montant * formData.tauxAssurance / 100 / 12;
  const mensualiteTotale = mensualiteCapital + mensualiteAssurance;
  const totalInterets = Math.max(0, mensualiteCapital * n - formData.montant);
  const totalAssurance = mensualiteAssurance * n;
  const tauxEndettement = formData.revenus > 0 ? (mensualiteTotale + formData.charges) / formData.revenus * 100 : 0;
  const resteAVivre = formData.revenus - mensualiteTotale - formData.charges - formData.envoiPays;
  const pctRevenu = formData.revenus > 0 ? (resteAVivre / formData.revenus) * 100 : 0;

  const computeAnticipe = (extra: number) => {
    if (extra <= 0 || formData.montant <= 0 || tauxMensuel <= 0) return { gainMois: 0, economieInterets: 0, nouvelleDuree: n };
    let solde = formData.montant;
    let mois = 0;
    let totalInt = 0;
    const paiement = mensualiteCapital + extra;
    while (solde > 0.01 && mois < n) {
      const int = solde * tauxMensuel;
      const cap = Math.min(solde, Math.max(0, paiement - int));
      if (cap <= 0) break;
      totalInt += int;
      solde -= cap;
      mois++;
    }
    return { gainMois: Math.max(0, n - mois), economieInterets: Math.max(0, totalInterets - totalInt), nouvelleDuree: mois };
  };

  const anticipe = computeAnticipe(extraMensuel);
  const anticipeRef = computeAnticipe(100);

  const amortRows = (() => {
    if (formData.montant <= 0 || n <= 0) return [];
    const rows: { year: number; capitalYear: number; interetsYear: number; soldeRestant: number }[] = [];
    let solde = formData.montant;
    let yearCap = 0, yearInt = 0;
    for (let m = 1; m <= n; m++) {
      const int = solde * tauxMensuel;
      const cap = Math.min(solde, Math.max(0, mensualiteCapital - int));
      yearCap += cap;
      yearInt += int;
      solde = Math.max(0, solde - cap);
      if (m % 12 === 0 || m === n) {
        rows.push({ year: Math.ceil(m / 12), capitalYear: yearCap, interetsYear: yearInt, soldeRestant: solde });
        yearCap = 0; yearInt = 0;
        if (rows.length >= 12) break;
      }
    }
    return rows;
  })();

  const fmt = (v: number) => Math.round(v).toLocaleString('fr-FR');
  const fmtPct = (v: number) => v.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  const colorEndettement = tauxEndettement < 30 ? 'text-green-400' : tauxEndettement <= 35 ? 'text-orange-400' : 'text-red-400';
  const colorResteAVivre = resteAVivre > 800 ? 'text-green-400' : resteAVivre >= 400 ? 'text-orange-400' : 'text-red-400';

  const canGoNext = (s: Step) => {
    if (s === 1) return formData.montant > 0 && formData.tauxInteret > 0 && formData.duree > 0;
    if (s === 2) return formData.revenus > 0;
    return true;
  };

  const totalBarWidth = formData.montant + totalInterets + totalAssurance;
  const pctCapital = totalBarWidth > 0 ? (formData.montant / totalBarWidth) * 100 : 0;
  const pctInterets = totalBarWidth > 0 ? (totalInterets / totalBarWidth) * 100 : 0;
  const pctAssurance = totalBarWidth > 0 ? (totalAssurance / totalBarWidth) * 100 : 0;
  const economiePotentielle = Math.round(totalAssurance * 0.3);

  const stepTitles = ['Ton prêt', 'Ta situation', 'Résultats'];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0d0f1a' }}>
      <div className="max-w-4xl mx-auto px-4 py-12">

        <div className="mb-8">
          <Link href="/simulateurs" className="text-[#94a3b8] hover:text-white transition-colors mb-4 inline-block">
            ← Retour aux simulateurs
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">Simulateur de remboursement</h1>
          <p className="text-[#94a3b8]">Calcule tes mensualités et optimise le remboursement de ton prêt.</p>
        </div>

        {/* Progress */}
        <div className="mb-10">
          <div className="flex gap-2 mb-3">
            {[1, 2, 3].map(s => (
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
            <h2 className="text-2xl font-semibold text-white">Ton prêt</h2>
            <div>
              <label className="block text-white font-medium mb-2">Montant emprunté (€)</label>
              <input type="number" value={formData.montant || ''} onChange={e => update('montant', +e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#4ade80] focus:outline-none" placeholder="ex : 200 000" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">Taux d'intérêt (%)</label>
                <input type="number" step="0.1" value={formData.tauxInteret || ''} onChange={e => update('tauxInteret', +e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#4ade80] focus:outline-none" placeholder="ex : 3.5" />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Assurance emprunteur (%/an)</label>
                <input type="number" step="0.05" value={formData.tauxAssurance || ''} onChange={e => update('tauxAssurance', +e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#4ade80] focus:outline-none" placeholder="ex : 0.3" />
              </div>
            </div>
            <div>
              <label className="block text-white font-medium mb-3">Durée du prêt : <span className="text-[#4ade80]">{formData.duree} ans</span></label>
              <input type="range" min={5} max={30} value={formData.duree} onChange={e => update('duree', +e.target.value)}
                className="w-full accent-[#4ade80]" />
              <div className="flex justify-between text-xs text-[#94a3b8] mt-1"><span>5 ans</span><span>30 ans</span></div>
            </div>
            <div>
              <label className="block text-white font-medium mb-3">Type de taux</label>
              <div className="grid grid-cols-2 gap-3">
                {[{ id: 'fixe', label: 'Fixe' }, { id: 'variable', label: 'Variable' }].map(t => (
                  <button key={t.id} onClick={() => update('typeTaux', t.id)}
                    className={`p-3 rounded-xl border-2 font-medium transition-all ${formData.typeTaux === t.id ? 'border-[#4ade80] bg-[#4ade80]/10 text-[#4ade80]' : 'border-white/10 text-white hover:border-white/30'}`}>
                    {t.label}
                  </button>
                ))}
              </div>
              {formData.typeTaux === 'variable' && (
                <p className="text-orange-400 text-xs mt-2">⚠️ Le taux variable peut évoluer — la simulation est basée sur le taux actuel saisi</p>
              )}
            </div>
            {formData.montant > 0 && (
              <div className="p-4 rounded-xl border border-white/10 bg-white/5 text-sm space-y-1">
                <div className="flex justify-between"><span className="text-[#94a3b8]">Mensualité (capital + intérêts)</span><span className="text-white">{fmt(mensualiteCapital)} €/mois</span></div>
                <div className="flex justify-between"><span className="text-[#94a3b8]">Assurance</span><span className="text-white">{fmt(mensualiteAssurance)} €/mois</span></div>
                <div className="flex justify-between font-semibold pt-2 border-t border-white/10"><span className="text-white">Mensualité totale</span><span className="text-[#4ade80]">{fmt(mensualiteTotale)} €/mois</span></div>
              </div>
            )}
          </div>
        )}

        {/* ÉTAPE 2 */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">Ta situation</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">Revenus nets mensuels (€)</label>
                <input type="number" value={formData.revenus || ''} onChange={e => update('revenus', +e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#4ade80] focus:outline-none" placeholder="ex : 3 000" />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Autres charges mensuelles (€)</label>
                <input type="number" value={formData.charges || ''} onChange={e => update('charges', +e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#4ade80] focus:outline-none" placeholder="ex : loyer, crédits..." />
              </div>
            </div>
            <div>
              <label className="block text-white font-medium mb-2">Combien envoies-tu au pays chaque mois ? (€) <span className="text-[#94a3b8] font-normal text-sm">— optionnel</span></label>
              <input type="number" value={formData.envoiPays || ''} onChange={e => update('envoiPays', +e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#4ade80] focus:outline-none" placeholder="ex : 200" />
            </div>
            <div>
              <label className="block text-white font-medium mb-2">Épargne mensuelle souhaitée (€) <span className="text-[#94a3b8] font-normal text-sm">— optionnel</span></label>
              <input type="number" value={formData.epargneSouhaitee || ''} onChange={e => update('epargneSouhaitee', +e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#4ade80] focus:outline-none" placeholder="ex : 200" />
            </div>
            {formData.revenus > 0 && (
              <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[#94a3b8] text-sm">Taux d'endettement</span>
                  <span className={`font-bold text-lg ${colorEndettement}`}>{fmtPct(tauxEndettement)}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="h-2 rounded-full transition-all" style={{
                    width: `${Math.min(100, tauxEndettement)}%`,
                    backgroundColor: tauxEndettement < 30 ? '#4ade80' : tauxEndettement <= 35 ? '#f97316' : '#ef4444'
                  }} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#94a3b8] text-sm">Reste à vivre</span>
                  <span className={`font-bold text-lg ${colorResteAVivre}`}>{fmt(resteAVivre)} €/mois</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ÉTAPE 3 — RÉSULTATS */}
        {step === 3 && (
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-white">Résultats de ta simulation</h2>

            {/* Bloc 1 — Métriques */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl border border-white/10 text-center" style={{ backgroundColor: '#1a1d2d' }}>
                <div className="text-[#94a3b8] text-sm mb-1">Mensualité totale</div>
                <div className="text-3xl font-bold text-white">{fmt(mensualiteTotale)} €</div>
                <div className="text-[#94a3b8] text-xs mt-1">par mois</div>
              </div>
              <div className="p-5 rounded-2xl border border-white/10 text-center" style={{ backgroundColor: '#1a1d2d' }}>
                <div className="text-[#94a3b8] text-sm mb-1">Coût total du crédit</div>
                <div className="text-3xl font-bold text-white">{fmt(totalInterets + totalAssurance)} €</div>
                <div className="text-[#94a3b8] text-xs mt-1">intérêts + assurance</div>
              </div>
              <div className="p-5 rounded-2xl border border-white/10 text-center" style={{ backgroundColor: '#1a1d2d' }}>
                <div className="text-[#94a3b8] text-sm mb-1">Taux d'endettement</div>
                <div className={`text-3xl font-bold ${colorEndettement}`}>{fmtPct(tauxEndettement)}%</div>
                <div className="text-[#94a3b8] text-xs mt-1">limite bancaire : 35%</div>
              </div>
            </div>

            {/* Bloc 2 — Répartition visuelle */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Répartition du coût total</h3>
              <div className="p-5 rounded-2xl border border-white/10" style={{ backgroundColor: '#1a1d2d' }}>
                <div className="flex rounded-full overflow-hidden h-6 mb-4">
                  <div style={{ width: `${pctCapital}%`, backgroundColor: '#4ade80' }} />
                  <div style={{ width: `${pctInterets}%`, backgroundColor: '#f97316' }} />
                  <div style={{ width: `${pctAssurance}%`, backgroundColor: '#60a5fa' }} />
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#4ade80]" />
                    <span className="text-[#94a3b8]">Capital : <span className="text-white">{fmt(formData.montant)} €</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#f97316]" />
                    <span className="text-[#94a3b8]">Intérêts : <span className="text-white">{fmt(totalInterets)} €</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#60a5fa]" />
                    <span className="text-[#94a3b8]">Assurance : <span className="text-white">{fmt(totalAssurance)} €</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bloc 3 — Remboursement anticipé */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Et si tu remboursais plus vite ?</h3>
              <p className="text-[#94a3b8] text-sm mb-4">Ajoute un versement mensuel supplémentaire</p>
              <div className="p-5 rounded-2xl border border-white/10" style={{ backgroundColor: '#1a1d2d' }}>
                <div className="mb-4">
                  <label className="block text-white font-medium mb-2">Montant supplémentaire : <span className="text-[#4ade80]">+{extraMensuel} €/mois</span></label>
                  <input type="range" min={0} max={500} step={50} value={extraMensuel} onChange={e => setExtraMensuel(+e.target.value)}
                    className="w-full accent-[#4ade80]" />
                  <div className="flex justify-between text-xs text-[#94a3b8] mt-1"><span>0 €</span><span>500 €</span></div>
                </div>
                {extraMensuel > 0 ? (
                  <div className="grid md:grid-cols-3 gap-3 mt-4">
                    <div className="text-center p-3 rounded-xl bg-[#4ade80]/10 border border-[#4ade80]/20">
                      <div className="text-[#94a3b8] text-xs mb-1">Durée gagnée</div>
                      <div className="text-green-400 font-bold">{anticipe.gainMois > 0 ? `${anticipe.gainMois} mois` : '—'}</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-[#4ade80]/10 border border-[#4ade80]/20">
                      <div className="text-[#94a3b8] text-xs mb-1">Intérêts économisés</div>
                      <div className="text-green-400 font-bold">{fmt(anticipe.economieInterets)} €</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-[#4ade80]/10 border border-[#4ade80]/20">
                      <div className="text-[#94a3b8] text-xs mb-1">Nouvelle durée</div>
                      <div className="text-green-400 font-bold">{formatDuree(anticipe.nouvelleDuree)}</div>
                    </div>
                  </div>
                ) : (
                  <p className="text-[#94a3b8] text-sm text-center py-2">Bouge le slider pour voir l'impact d'un remboursement anticipé</p>
                )}
              </div>
            </div>

            {/* Bloc 4 — Insight diaspora */}
            <div className="p-6 rounded-2xl border border-[#4ade80]/30" style={{ backgroundColor: '#1a1d2d' }}>
              <h3 className="text-lg font-semibold text-white mb-4">💡 Ce que ça représente pour toi</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#4ade80] mt-1.5 flex-shrink-0" />
                  <p className="text-[#94a3b8]">
                    Avec ce prêt{formData.envoiPays > 0 ? ` + tes ${fmt(formData.envoiPays)} €/mois au pays` : ''}, ton reste à vivre est de{' '}
                    <span className={`font-semibold ${colorResteAVivre}`}>{fmt(resteAVivre)} €</span> — soit{' '}
                    <span className="text-white font-semibold">{fmtPct(Math.max(0, pctRevenu))}%</span> de tes revenus
                  </p>
                </div>
                {tauxEndettement > 35 && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                    <p className="text-[#94a3b8]">
                      <span className="text-red-400 font-semibold">⚠️ Ton taux d'endettement dépasse la limite bancaire de 35%</span> — pense à allonger la durée ou augmenter l'apport
                    </p>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#4ade80] mt-1.5 flex-shrink-0" />
                  <p className="text-[#94a3b8]">
                    En remboursant <span className="text-white font-semibold">100 € de plus/mois</span>, tu finis ton prêt{' '}
                    <span className="text-green-400 font-semibold">{anticipeRef.gainMois} mois plus tôt</span> et économises{' '}
                    <span className="text-green-400 font-semibold">{fmt(anticipeRef.economieInterets)} € d'intérêts</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Bloc 5 — Amortissement accordéon */}
            <div>
              <button onClick={() => setShowAmort(!showAmort)}
                className="w-full flex items-center justify-between p-4 rounded-2xl border border-white/10 text-white font-medium hover:border-[#4ade80]/30 transition-all"
                style={{ backgroundColor: '#1a1d2d' }}>
                <span>Voir le tableau d'amortissement complet</span>
                {showAmort ? <ChevronUp className="w-5 h-5 text-[#4ade80]" /> : <ChevronDown className="w-5 h-5 text-[#4ade80]" />}
              </button>
              {showAmort && (
                <div className="mt-2 rounded-2xl border border-white/10 overflow-hidden" style={{ backgroundColor: '#1a1d2d' }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left px-4 py-3 text-[#94a3b8] font-medium">Année</th>
                        <th className="text-right px-4 py-3 text-[#94a3b8] font-medium">Capital remboursé</th>
                        <th className="text-right px-4 py-3 text-[#94a3b8] font-medium">Intérêts</th>
                        <th className="text-right px-4 py-3 text-[#94a3b8] font-medium">Capital restant dû</th>
                      </tr>
                    </thead>
                    <tbody>
                      {amortRows.map((row, i) => (
                        <tr key={row.year} className={`border-b border-white/5 ${i % 2 !== 0 ? 'bg-white/[0.02]' : ''}`}>
                          <td className="px-4 py-3 text-white">Année {row.year}</td>
                          <td className="px-4 py-3 text-right text-green-400">{fmt(row.capitalYear)} €</td>
                          <td className="px-4 py-3 text-right text-orange-400">{fmt(row.interetsYear)} €</td>
                          <td className="px-4 py-3 text-right text-white">{fmt(row.soldeRestant)} €</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Bloc 6 — Conseils */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Conseils personnalisés</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {tauxEndettement > 35 ? (
                  <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5">
                    <AlertTriangle className="w-5 h-5 text-red-400 mb-2" />
                    <p className="text-white text-sm font-medium mb-1">Taux d'endettement trop élevé</p>
                    <p className="text-[#94a3b8] text-sm">Allonge la durée du prêt ou augmente ton apport pour passer sous les 35%</p>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-[#4ade80]/30 bg-[#4ade80]/5">
                    <CheckCircle2 className="w-5 h-5 text-[#4ade80] mb-2" />
                    <p className="text-white text-sm font-medium mb-1">Taux d'endettement correct ✓</p>
                    <p className="text-[#94a3b8] text-sm">Ton dossier est dans les normes bancaires. Tu peux envisager un remboursement anticipé.</p>
                  </div>
                )}
                {resteAVivre < 400 ? (
                  <div className="p-4 rounded-xl border border-orange-500/30 bg-orange-500/5">
                    <AlertTriangle className="w-5 h-5 text-orange-400 mb-2" />
                    <p className="text-white text-sm font-medium mb-1">Reste à vivre serré</p>
                    <p className="text-[#94a3b8] text-sm">Réduis tes envois au pays temporairement ou envisage d'augmenter tes revenus</p>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-[#4ade80]/30 bg-[#4ade80]/5">
                    <TrendingDown className="w-5 h-5 text-[#4ade80] mb-2" />
                    <p className="text-white text-sm font-medium mb-1">Capacité de remboursement anticipé</p>
                    <p className="text-[#94a3b8] text-sm">Ton reste à vivre te permet d'accélérer le remboursement et d'économiser sur les intérêts</p>
                  </div>
                )}
                <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/5">
                  <Info className="w-5 h-5 text-blue-400 mb-2" />
                  <p className="text-white text-sm font-medium mb-1">Compare tes assurances</p>
                  <p className="text-[#94a3b8] text-sm">En délégant ton assurance emprunteur, tu peux économiser jusqu'à <span className="text-white">{fmt(economiePotentielle)} €/an</span></p>
                </div>
              </div>
            </div>

            {/* Lien investissement locatif */}
            <div className="p-4 rounded-xl border border-white/10 flex items-center justify-between gap-4" style={{ backgroundColor: '#1a1d2d' }}>
              <div>
                <p className="text-white font-medium text-sm">Envisages-tu un investissement locatif ?</p>
                <p className="text-[#94a3b8] text-sm">Calcule la rentabilité de ton bien avec notre simulateur</p>
              </div>
              <Link href="/simulateurs/investissement-locatif"
                className="flex items-center gap-2 px-4 py-2 bg-[#4ade80] text-black font-semibold rounded-full text-sm whitespace-nowrap flex-shrink-0">
                Voir <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <button onClick={() => { setStep(1); setExtraMensuel(0); setShowAmort(false); }}
              className="flex items-center gap-2 px-6 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-all">
              <ArrowLeft className="w-4 h-4" /> Nouvelle simulation
            </button>
          </div>
        )}

        {/* Navigation */}
        {step !== 3 && (
          <div className="flex justify-between mt-10">
            {step > 1 ? (
              <button onClick={() => setStep((step - 1) as Step)}
                className="flex items-center gap-2 px-6 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-all">
                <ArrowLeft className="w-4 h-4" /> Précédent
              </button>
            ) : <div />}
            <button onClick={() => setStep((step + 1) as Step)} disabled={!canGoNext(step)}
              className="flex items-center gap-2 px-6 py-3 bg-[#4ade80] text-black font-semibold rounded-full hover:bg-[#4ade80]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {step === 2 ? 'Voir les résultats' : 'Suivant'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
