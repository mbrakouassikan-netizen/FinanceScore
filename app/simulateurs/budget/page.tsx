'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, Globe, TrendingUp, TrendingDown, Minus, Download } from 'lucide-react';

type Step = 1 | 2 | 'results';

interface FormData {
  revenus: number;
  loyer: number;
  charges: number;
  alimentation: number;
  transport: number;
  assurances: number;
  envoisPays: number;
  autresCredits: number;
  loisirs: number;
  abonnements: number;
  shopping: number;
  epargne: number;
}

interface BudgetResult {
  besoins: number;
  besoinsPourcentage: number;
  envies: number;
  enviesPourcentage: number;
  epargne: number;
  epargnePourcentage: number;
  totalDepenses: number;
}

export default function BudgetSimulatorPage() {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<FormData>({
    revenus: 0,
    loyer: 0,
    charges: 0,
    alimentation: 0,
    transport: 0,
    assurances: 0,
    envoisPays: 0,
    autresCredits: 0,
    loisirs: 0,
    abonnements: 0,
    shopping: 0,
    epargne: 0,
  });

  const calculateBudget = (): BudgetResult => {
    const besoins = formData.loyer + formData.charges + formData.alimentation + formData.transport + formData.assurances + formData.envoisPays + formData.autresCredits;
    const envies = formData.loisirs + formData.abonnements + formData.shopping;
    const epargne = formData.epargne;
    const totalDepenses = besoins + envies + epargne;

    const besoinsPourcentage = formData.revenus > 0 ? (besoins / formData.revenus) * 100 : 0;
    const enviesPourcentage = formData.revenus > 0 ? (envies / formData.revenus) * 100 : 0;
    const epargnePourcentage = formData.revenus > 0 ? (epargne / formData.revenus) * 100 : 0;

    return {
      besoins,
      besoinsPourcentage,
      envies,
      enviesPourcentage,
      epargne,
      epargnePourcentage,
      totalDepenses,
    };
  };

  const getStatut = (valeur: number, objectif: number, type: 'besoins' | 'envies' | 'epargne'): { label: string; color: string } => {
    if (type === 'besoins') {
      if (valeur <= 50) return { label: 'Équilibré', color: '#4ade80' };
      if (valeur <= 60) return { label: 'À surveiller', color: '#f97316' };
      return { label: 'Trop élevé', color: '#ef4444' };
    }
    if (type === 'envies') {
      if (valeur <= 30) return { label: 'Équilibré', color: '#4ade80' };
      if (valeur <= 40) return { label: 'À surveiller', color: '#f97316' };
      return { label: 'Trop élevé', color: '#ef4444' };
    }
    if (type === 'epargne') {
      if (valeur >= 20) return { label: 'Équilibré', color: '#4ade80' };
      if (valeur >= 10) return { label: 'À surveiller', color: '#f97316' };
      return { label: 'Insuffisant', color: '#ef4444' };
    }
    return { label: 'Inconnu', color: '#94a3b8' };
  };

  const budget = calculateBudget();
  const statutBesoins = getStatut(budget.besoinsPourcentage, 50, 'besoins');
  const statutEnvies = getStatut(budget.enviesPourcentage, 30, 'envies');
  const statutEpargne = getStatut(budget.epargnePourcentage, 20, 'epargne');

  const printBudget = () => {
    const date = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
    const besoinsRecommande = formData.revenus * 0.5;
    const enviesRecommande = formData.revenus * 0.3;
    const epargneRecommande = formData.revenus * 0.2;

    let diagnosticGlobal = { title: '', description: '', color: '' };
    if (statutBesoins.color === '#ef4444') {
      diagnosticGlobal = {
        title: 'Tes charges fixes sont trop élevées',
        description: 'Tes besoins essentiels dépassent 60% de tes revenus. Cela réduit ta capacité d\'épargne et te rend vulnérable en cas d\'imprévu.',
        color: '#ef4444',
      };
    } else if (statutEpargne.color === '#ef4444') {
      diagnosticGlobal = {
        title: 'Ton épargne est insuffisante',
        description: 'Tu épargnes moins de 10% de tes revenus. Pour construire un patrimoine et préparer l\'avenir, vise au moins 20%.',
        color: '#ef4444',
      };
    } else if (statutBesoins.color === '#f97316' || statutEnvies.color === '#f97316' || statutEpargne.color === '#f97316') {
      diagnosticGlobal = {
        title: 'Ton budget est à surveiller',
        description: 'Certains postes de dépense sont légèrement au-dessus des recommandations. Quelques ajustements suffiront pour équilibrer ton budget.',
        color: '#f97316',
      };
    } else {
      diagnosticGlobal = {
        title: 'Ton budget est bien équilibré',
        description: 'Ta répartition budgétaire suit la règle 50/30/20. Continue comme ça et envisage d\'augmenter progressivement ton épargne.',
        color: '#4ade80',
      };
    }

    let conseils = [];
    if (statutBesoins.color === '#ef4444') {
      conseils.push('• Renégocie ton crédit immobilier ou ton loyer');
      conseils.push('• Réduise tes abonnements et charges fixes');
      conseils.push('• Optimise tes dépenses alimentaires et transport');
    } else if (statutEpargne.color === '#ef4444') {
      conseils.push('• Automatise ton épargne dès le versement du salaire');
      conseils.push('• Utilise la méthode des enveloppes pour contrôler tes dépenses');
      conseils.push('• Augmente progressivement ton épargne de 1% par mois');
    } else {
      conseils.push('• Envisage d\'investir ton épargne pour la faire fructifier');
      conseils.push('• Crée un fonds d\'urgence équivalent à 3 mois de revenus');
      conseils.push('• Explore des placements à long terme (PEA, assurance-vie)');
    }

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Mon plan budget - CultureFinance</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              color: #000;
              background: #fff;
              margin: 0;
              padding: 40px;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              border-bottom: 2px solid #4ade80;
              padding-bottom: 20px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #4ade80;
              margin-bottom: 10px;
            }
            .title {
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .date {
              color: #666;
              font-size: 14px;
            }
            .section {
              margin-bottom: 30px;
            }
            .section-title {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 15px;
              color: #333;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
            }
            th {
              background-color: #f5f5f5;
              font-weight: bold;
            }
            .statut-equilibre { color: #4ade80; font-weight: bold; }
            .statut-surveiller { color: #f97316; font-weight: bold; }
            .statut-eleve { color: #ef4444; font-weight: bold; }
            .statut-insuffisant { color: #ef4444; font-weight: bold; }
            .diagnostic {
              background-color: #f9f9f9;
              padding: 20px;
              border-left: 4px solid ${diagnosticGlobal.color};
              margin-bottom: 20px;
            }
            .diagnostic-title {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 10px;
              color: ${diagnosticGlobal.color};
            }
            .conseils {
              background-color: #f9f9f9;
              padding: 20px;
            }
            .conseil {
              margin-bottom: 10px;
              padding-left: 20px;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              color: #666;
              font-size: 12px;
            }
            @media print {
              body { padding: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">CultureFinance</div>
            <div class="title">Mon plan budget</div>
            <div class="date">${date}</div>
          </div>

          <div class="section">
            <div class="section-title">Revenus mensuels</div>
            <p><strong>${formData.revenus.toLocaleString('fr-FR')} €</strong></p>
          </div>

          <div class="section">
            <div class="section-title">Répartition actuelle vs recommandée</div>
            <table>
              <thead>
                <tr>
                  <th>Catégorie</th>
                  <th>Recommandé</th>
                  <th>Actuel</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Besoins essentiels</td>
                  <td>${besoinsRecommande.toLocaleString('fr-FR')} € (50%)</td>
                  <td>${budget.besoins.toLocaleString('fr-FR')} € (${budget.besoinsPourcentage.toFixed(1)}%)</td>
                  <td class="${statutBesoins.color === '#4ade80' ? 'statut-equilibre' : statutBesoins.color === '#f97316' ? 'statut-surveiller' : 'statut-eleve'}">${statutBesoins.label}</td>
                </tr>
                <tr>
                  <td>Envies & loisirs</td>
                  <td>${enviesRecommande.toLocaleString('fr-FR')} € (30%)</td>
                  <td>${budget.envies.toLocaleString('fr-FR')} € (${budget.enviesPourcentage.toFixed(1)}%)</td>
                  <td class="${statutEnvies.color === '#4ade80' ? 'statut-equilibre' : statutEnvies.color === '#f97316' ? 'statut-surveiller' : 'statut-eleve'}">${statutEnvies.label}</td>
                </tr>
                <tr>
                  <td>Épargne</td>
                  <td>${epargneRecommande.toLocaleString('fr-FR')} € (20%)</td>
                  <td>${budget.epargne.toLocaleString('fr-FR')} € (${budget.epargnePourcentage.toFixed(1)}%)</td>
                  <td class="${statutEpargne.color === '#4ade80' ? 'statut-equilibre' : statutEpargne.color === '#f97316' ? 'statut-surveiller' : 'statut-insuffisant'}">${statutEpargne.label}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Diagnostic</div>
            <div class="diagnostic">
              <div class="diagnostic-title">${diagnosticGlobal.title}</div>
              <p>${diagnosticGlobal.description}</p>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Conseils</div>
            <div class="conseils">
              ${conseils.map(conseil => `<div class="conseil">${conseil}</div>`).join('')}
            </div>
          </div>

          <div class="footer">
            Généré par CultureFinance — finance-score.vercel.app
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  if (step === 'results') {
    const besoinsRecommande = formData.revenus * 0.5;
    const enviesRecommande = formData.revenus * 0.3;
    const epargneRecommande = formData.revenus * 0.2;

    const reductionBesoins = budget.besoins - besoinsRecommande;
    const augmentationEpargnePossible = budget.envies - enviesRecommande;
    const augmentationEpargneNecessaire = epargneRecommande - budget.epargne;

    let diagnosticGlobal = { title: '', description: '', color: '' };
    if (statutBesoins.color === '#ef4444') {
      diagnosticGlobal = {
        title: 'Tes charges fixes sont trop élevées',
        description: 'Tes besoins essentiels dépassent 60% de tes revenus. Cela réduit ta capacité d\'épargne et te rend vulnérable en cas d\'imprévu.',
        color: '#ef4444',
      };
    } else if (statutEpargne.color === '#ef4444') {
      diagnosticGlobal = {
        title: 'Ton épargne est insuffisante',
        description: 'Tu épargnes moins de 10% de tes revenus. Pour construire un patrimoine et préparer l\'avenir, vise au moins 20%.',
        color: '#ef4444',
      };
    } else if (statutBesoins.color === '#f97316' || statutEnvies.color === '#f97316' || statutEpargne.color === '#f97316') {
      diagnosticGlobal = {
        title: 'Ton budget est à surveiller',
        description: 'Certains postes de dépense sont légèrement au-dessus des recommandations. Quelques ajustements suffiront pour équilibrer ton budget.',
        color: '#f97316',
      };
    } else {
      diagnosticGlobal = {
        title: 'Ton budget est bien équilibré',
        description: 'Ta répartition budgétaire suit la règle 50/30/20. Continue comme ça et envisage d\'augmenter progressivement ton épargne.',
        color: '#4ade80',
      };
    }

    let messagePersonnalise = '';
    if (statutBesoins.color === '#ef4444') {
      messagePersonnalise = `Pour équilibrer ton budget, tu dois réduire tes charges fixes de ${Math.round(reductionBesoins).toLocaleString('fr-FR')} €. Tu as ${Math.round(augmentationEpargnePossible).toLocaleString('fr-FR')} € disponibles sur tes envies que tu peux rediriger vers l'épargne.`;
    } else if (statutEpargne.color === '#ef4444') {
      messagePersonnalise = `Tu peux augmenter ton épargne de ${Math.round(augmentationEpargneNecessaire).toLocaleString('fr-FR')} € en réduisant légèrement tes envies. Objectif : atteindre ${Math.round(epargneRecommande).toLocaleString('fr-FR')} € d'épargne par mois.`;
    } else {
      messagePersonnalise = 'Ton budget est bien réparti. Pour aller plus loin, envisage d\'augmenter progressivement ton épargne au-delà de 20%.';
    }

    const fraisTransfert = formData.envoisPays * 0.05;
    const economieTransfert = fraisTransfert * 0.5;

    return (
      <div className="min-h-screen" style={{ backgroundColor: '#0d0f1a' }}>
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-8">
            <Link href="/simulateurs" className="text-[#94a3b8] hover:text-white transition-colors mb-4 inline-block">
              ← Retour aux simulateurs
            </Link>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">
              Diagnostic de ton budget
            </h1>
            <p className="text-[#94a3b8]">
              Basé sur la règle 50/30/20
            </p>
          </div>

          {/* Bloc 1 — Diagnostic visuel */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Besoins */}
            <div className="p-6 rounded-2xl border border-white/10" style={{ backgroundColor: '#1a1d2d' }}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Besoins essentiels</h3>
                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${statutBesoins.color}20`, color: statutBesoins.color }}>
                  {statutBesoins.label}
                </span>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#94a3b8]">Actuel</span>
                  <span className="text-white font-semibold">{budget.besoinsPourcentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(budget.besoinsPourcentage, 100)}%`, backgroundColor: statutBesoins.color }} />
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#94a3b8]">Objectif</span>
                <span className="text-white">50%</span>
              </div>
            </div>

            {/* Envies */}
            <div className="p-6 rounded-2xl border border-white/10" style={{ backgroundColor: '#1a1d2d' }}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Envies & loisirs</h3>
                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${statutEnvies.color}20`, color: statutEnvies.color }}>
                  {statutEnvies.label}
                </span>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#94a3b8]">Actuel</span>
                  <span className="text-white font-semibold">{budget.enviesPourcentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(budget.enviesPourcentage, 100)}%`, backgroundColor: statutEnvies.color }} />
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#94a3b8]">Objectif</span>
                <span className="text-white">30%</span>
              </div>
            </div>

            {/* Épargne */}
            <div className="p-6 rounded-2xl border border-white/10" style={{ backgroundColor: '#1a1d2d' }}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Épargne</h3>
                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${statutEpargne.color}20`, color: statutEpargne.color }}>
                  {statutEpargne.label}
                </span>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#94a3b8]">Actuel</span>
                  <span className="text-white font-semibold">{budget.epargnePourcentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(budget.epargnePourcentage, 100)}%`, backgroundColor: statutEpargne.color }} />
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#94a3b8]">Objectif</span>
                <span className="text-white">20%</span>
              </div>
            </div>
          </div>

          {/* Bloc 2 — Insight diaspora */}
          {formData.envoisPays > 0 && (
            <div className="p-6 rounded-2xl border border-[#4ade80]/30 mb-8" style={{ backgroundColor: '#1a1d2d' }}>
              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-[#4ade80] mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold mb-2">Envois d'argent au pays</h4>
                  <p className="text-[#94a3b8] text-sm">
                    Tu envoies {formData.envoisPays.toLocaleString('fr-FR')} €/mois au pays. Tu paies environ {fraisTransfert.toFixed(0)} € de frais de transfert (estimation 5%). En optimisant tes envois (Wave, Wise...), tu pourrais économiser jusqu'à {economieTransfert.toFixed(0)} €/mois et les rediriger vers ton épargne.
                  </p>
                  <Link href="/simulateurs/transfert" className="inline-flex items-center gap-2 text-[#4ade80] text-sm font-medium mt-3 hover:underline">
                    Comparer les services de transfert <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Bloc 3 — Ta répartition recommandée */}
          <div className="p-6 rounded-2xl border border-white/10 mb-8" style={{ backgroundColor: '#1a1d2d' }}>
            <h3 className="text-xl font-semibold text-white mb-4">Ta répartition recommandée</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-[#94a3b8] py-3">Catégorie</th>
                    <th className="text-right text-[#94a3b8] py-3">Recommandé</th>
                    <th className="text-right text-[#94a3b8] py-3">Actuel</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/10">
                    <td className="text-white py-3">Besoins essentiels</td>
                    <td className="text-right text-[#4ade80] py-3">{besoinsRecommande.toLocaleString('fr-FR')} € (50%)</td>
                    <td className="text-right text-white py-3">{budget.besoins.toLocaleString('fr-FR')} € ({budget.besoinsPourcentage.toFixed(1)}%)</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="text-white py-3">Envies & loisirs</td>
                    <td className="text-right text-[#4ade80] py-3">{enviesRecommande.toLocaleString('fr-FR')} € (30%)</td>
                    <td className="text-right text-white py-3">{budget.envies.toLocaleString('fr-FR')} € ({budget.enviesPourcentage.toFixed(1)}%)</td>
                  </tr>
                  <tr>
                    <td className="text-white py-3">Épargne</td>
                    <td className="text-right text-[#4ade80] py-3">{epargneRecommande.toLocaleString('fr-FR')} € (20%)</td>
                    <td className="text-right text-white py-3">{budget.epargne.toLocaleString('fr-FR')} € ({budget.epargnePourcentage.toFixed(1)}%)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[#94a3b8] text-sm mt-4">
              {messagePersonnalise}
            </p>
          </div>

          {/* Bouton télécharger */}
          <div className="flex flex-col items-center mb-8">
            <button
              onClick={printBudget}
              className="flex items-center gap-2 px-6 py-3 border-2 border-[#4ade80] text-[#4ade80] font-semibold rounded-full hover:bg-[#4ade80]/10 transition-all"
            >
              <Download className="w-4 h-4" /> Télécharger mon plan budget
            </button>
            <p className="text-[#94a3b8] text-xs mt-2">
              Choisissez "Enregistrer en PDF" dans la boîte d'impression
            </p>
          </div>

          {/* Bloc 4 — Diagnostic global */}
          <div className="p-6 rounded-2xl border border-white/10 mb-8" style={{ backgroundColor: '#1a1d2d', borderColor: `${diagnosticGlobal.color}30` }}>
            <div className="flex items-start gap-3">
              {diagnosticGlobal.color === '#4ade80' && <CheckCircle2 className="w-6 h-6 text-[#4ade80] mt-0.5 flex-shrink-0" />}
              {(diagnosticGlobal.color === '#f97316' || diagnosticGlobal.color === '#ef4444') && <AlertTriangle className="w-6 h-6 text-orange-500 mt-0.5 flex-shrink-0" />}
              <div>
                <h3 className="text-xl font-semibold text-white mb-2" style={{ color: diagnosticGlobal.color }}>
                  {diagnosticGlobal.title}
                </h3>
                <p className="text-[#94a3b8] text-sm mb-4">
                  {diagnosticGlobal.description}
                </p>
                <div className="space-y-2">
                  {statutBesoins.color === '#ef4444' && (
                    <div className="flex items-start gap-2 text-[#94a3b8] text-sm">
                      <Minus className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>Renégocie ton crédit immobilier ou ton loyer</span>
                    </div>
                  )}
                  {statutBesoins.color === '#ef4444' && (
                    <div className="flex items-start gap-2 text-[#94a3b8] text-sm">
                      <Minus className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>Réduise tes abonnements et charges fixes</span>
                    </div>
                  )}
                  {statutBesoins.color === '#ef4444' && (
                    <div className="flex items-start gap-2 text-[#94a3b8] text-sm">
                      <Minus className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>Optimise tes dépenses alimentaires et transport</span>
                    </div>
                  )}
                  {statutEpargne.color === '#ef4444' && (
                    <div className="flex items-start gap-2 text-[#94a3b8] text-sm">
                      <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>Automatise ton épargne dès le versement du salaire</span>
                    </div>
                  )}
                  {statutEpargne.color === '#ef4444' && (
                    <div className="flex items-start gap-2 text-[#94a3b8] text-sm">
                      <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>Utilise la méthode des enveloppes pour contrôler tes dépenses</span>
                    </div>
                  )}
                  {statutEpargne.color === '#ef4444' && (
                    <div className="flex items-start gap-2 text-[#94a3b8] text-sm">
                      <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>Augmente progressivement ton épargne de 1% par mois</span>
                    </div>
                  )}
                  {diagnosticGlobal.color === '#4ade80' && (
                    <div className="flex items-start gap-2 text-[#94a3b8] text-sm">
                      <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>Envisage d'investir ton épargne pour la faire fructifier</span>
                    </div>
                  )}
                  {diagnosticGlobal.color === '#4ade80' && (
                    <div className="flex items-start gap-2 text-[#94a3b8] text-sm">
                      <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>Crée un fonds d'urgence équivalent à 3 mois de revenus</span>
                    </div>
                  )}
                  {diagnosticGlobal.color === '#4ade80' && (
                    <div className="flex items-start gap-2 text-[#94a3b8] text-sm">
                      <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>Explore des placements à long terme (PEA, assurance-vie)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bloc 5 — Articles recommandés */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Articles recommandés</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {statutBesoins.color === '#ef4444' ? (
                <>
                  <div className="p-4 rounded-xl border border-white/10" style={{ backgroundColor: '#1a1d2d' }}>
                    <span className="px-2 py-1 bg-[#4ade80]/20 text-[#4ade80] text-xs font-medium rounded-full">
                      Budget
                    </span>
                    <h4 className="text-white font-medium mt-2 mb-1">Comment réduire ses charges fixes</h4>
                    <p className="text-[#94a3b8] text-sm">5 astuces pour alléger tes dépenses mensuelles</p>
                  </div>
                  <div className="p-4 rounded-xl border border-white/10" style={{ backgroundColor: '#1a1d2d' }}>
                    <span className="px-2 py-1 bg-[#4ade80]/20 text-[#4ade80] text-xs font-medium rounded-full">
                      Crédit
                    </span>
                    <h4 className="text-white font-medium mt-2 mb-1">Renégocier son crédit immobilier</h4>
                    <p className="text-[#94a3b8] text-sm">Quand et comment renégocier son prêt</p>
                  </div>
                </>
              ) : statutEpargne.color === '#ef4444' ? (
                <>
                  <div className="p-4 rounded-xl border border-white/10" style={{ backgroundColor: '#1a1d2d' }}>
                    <span className="px-2 py-1 bg-[#4ade80]/20 text-[#4ade80] text-xs font-medium rounded-full">
                      Épargne
                    </span>
                    <h4 className="text-white font-medium mt-2 mb-1">Comment épargner 20% de son salaire</h4>
                    <p className="text-[#94a3b8] text-sm">La méthode simple pour atteindre cet objectif</p>
                  </div>
                  <div className="p-4 rounded-xl border border-white/10" style={{ backgroundColor: '#1a1d2d' }}>
                    <span className="px-2 py-1 bg-[#4ade80]/20 text-[#4ade80] text-xs font-medium rounded-full">
                      Budget
                    </span>
                    <h4 className="text-white font-medium mt-2 mb-1">La méthode des enveloppes</h4>
                    <p className="text-[#94a3b8] text-sm">Organise tes dépenses par catégorie</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 rounded-xl border border-white/10" style={{ backgroundColor: '#1a1d2d' }}>
                    <span className="px-2 py-1 bg-[#4ade80]/20 text-[#4ade80] text-xs font-medium rounded-full">
                      Budget
                    </span>
                    <h4 className="text-white font-medium mt-2 mb-1">La méthode 50/30/20 pour aller plus loin</h4>
                    <p className="text-[#94a3b8] text-sm">Comment optimiser ta répartition budgétaire</p>
                  </div>
                  <div className="p-4 rounded-xl border border-white/10" style={{ backgroundColor: '#1a1d2d' }}>
                    <span className="px-2 py-1 bg-[#4ade80]/20 text-[#4ade80] text-xs font-medium rounded-full">
                      Investissement
                    </span>
                    <h4 className="text-white font-medium mt-2 mb-1">Comment faire fructifier son épargne</h4>
                    <p className="text-[#94a3b8] text-sm">Les options pour investir intelligemment</p>
                  </div>
                </>
              )}
              {formData.envoisPays > 0 && (
                <div className="p-4 rounded-xl border border-white/10" style={{ backgroundColor: '#1a1d2d' }}>
                  <span className="px-2 py-1 bg-[#4ade80]/20 text-[#4ade80] text-xs font-medium rounded-full">
                    Diaspora
                  </span>
                  <h4 className="text-white font-medium mt-2 mb-1">Optimiser ses transferts d'argent</h4>
                  <p className="text-[#94a3b8] text-sm">Comparer les services et réduire les frais</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setStep(1)}
              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Modifier mon budget
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
            Simulateur budget 50/30/20
          </h1>
          <p className="text-[#94a3b8]">
            Analyse ta répartition budgétaire et reçois un plan d'action personnalisé.
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
            {/* Section 1 — Revenus */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Revenus</h2>
              <div>
                <label className="block text-white font-medium mb-2">Revenus nets mensuels (après impôts) (€/mois)</label>
                <input
                  type="number"
                  value={formData.revenus || ''}
                  onChange={(e) => setFormData({ ...formData, revenus: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#4ade80] focus:outline-none"
                  placeholder="Ex: 2500"
                />
              </div>
            </div>

            {/* Section 2 — Besoins essentiels */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Besoins essentiels (objectif 50%)</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[#94a3b8] text-sm mb-2">Loyer / Crédit immobilier (€)</label>
                  <input
                    type="number"
                    value={formData.loyer || ''}
                    onChange={(e) => setFormData({ ...formData, loyer: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#4ade80] focus:outline-none"
                    placeholder="Optionnel"
                  />
                </div>
                <div>
                  <label className="block text-[#94a3b8] text-sm mb-2">Charges (eau, électricité, gaz, internet) (€)</label>
                  <input
                    type="number"
                    value={formData.charges || ''}
                    onChange={(e) => setFormData({ ...formData, charges: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#4ade80] focus:outline-none"
                    placeholder="Optionnel"
                  />
                </div>
                <div>
                  <label className="block text-[#94a3b8] text-sm mb-2">Alimentation (courses, repas) (€)</label>
                  <input
                    type="number"
                    value={formData.alimentation || ''}
                    onChange={(e) => setFormData({ ...formData, alimentation: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#4ade80] focus:outline-none"
                    placeholder="Optionnel"
                  />
                </div>
                <div>
                  <label className="block text-[#94a3b8] text-sm mb-2">Transport (abonnement, carburant) (€)</label>
                  <input
                    type="number"
                    value={formData.transport || ''}
                    onChange={(e) => setFormData({ ...formData, transport: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#4ade80] focus:outline-none"
                    placeholder="Optionnel"
                  />
                </div>
                <div>
                  <label className="block text-[#94a3b8] text-sm mb-2">Assurances (€)</label>
                  <input
                    type="number"
                    value={formData.assurances || ''}
                    onChange={(e) => setFormData({ ...formData, assurances: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#4ade80] focus:outline-none"
                    placeholder="Optionnel"
                  />
                </div>
                <div>
                  <label className="block text-[#4ade80] text-sm mb-2">Envois d'argent au pays (€)</label>
                  <input
                    type="number"
                    value={formData.envoisPays || ''}
                    onChange={(e) => setFormData({ ...formData, envoisPays: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#4ade80] focus:outline-none"
                    placeholder="Optionnel"
                  />
                  <p className="text-[#94a3b8] text-xs mt-1">Comptabilisé dans vos besoins essentiels</p>
                </div>
                <div>
                  <label className="block text-[#94a3b8] text-sm mb-2">Autres crédits (conso, leasing, pension...) (€)</label>
                  <input
                    type="number"
                    value={formData.autresCredits || ''}
                    onChange={(e) => setFormData({ ...formData, autresCredits: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#4ade80] focus:outline-none"
                    placeholder="Optionnel"
                  />
                </div>
              </div>
            </div>

            {/* Section 3 — Envies & loisirs */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Envies & loisirs (objectif 30%)</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[#94a3b8] text-sm mb-2">Loisirs, sorties, restaurants (€)</label>
                  <input
                    type="number"
                    value={formData.loisirs || ''}
                    onChange={(e) => setFormData({ ...formData, loisirs: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#4ade80] focus:outline-none"
                    placeholder="Optionnel"
                  />
                </div>
                <div>
                  <label className="block text-[#94a3b8] text-sm mb-2">Abonnements (streaming, téléphone...) (€)</label>
                  <input
                    type="number"
                    value={formData.abonnements || ''}
                    onChange={(e) => setFormData({ ...formData, abonnements: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#4ade80] focus:outline-none"
                    placeholder="Optionnel"
                  />
                </div>
                <div>
                  <label className="block text-[#94a3b8] text-sm mb-2">Shopping, vêtements (€)</label>
                  <input
                    type="number"
                    value={formData.shopping || ''}
                    onChange={(e) => setFormData({ ...formData, shopping: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#4ade80] focus:outline-none"
                    placeholder="Optionnel"
                  />
                </div>
              </div>
            </div>

            {/* Section 4 — Épargne */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Épargne (objectif 20%)</h2>
              <div>
                <label className="block text-[#94a3b8] text-sm mb-2">Épargne mensuelle actuelle (€)</label>
                <input
                  type="number"
                  value={formData.epargne || ''}
                  onChange={(e) => setFormData({ ...formData, epargne: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#4ade80] focus:outline-none"
                  placeholder="Optionnel"
                />
              </div>
            </div>

            {/* Aperçu temps réel */}
            {formData.revenus > 0 && (
              <div className="p-6 rounded-2xl border border-white/10 mb-8" style={{ backgroundColor: '#1a1d2d' }}>
                <h3 className="text-lg font-semibold text-white mb-4">Aperçu en temps réel</h3>
                <div className="flex justify-between gap-4">
                  <div className="text-center flex-1">
                    <div className="text-2xl font-bold text-white mb-1">{budget.besoinsPourcentage.toFixed(0)}%</div>
                    <div className="text-[#94a3b8] text-sm">Besoins</div>
                  </div>
                  <div className="text-center flex-1">
                    <div className="text-2xl font-bold text-white mb-1">{budget.enviesPourcentage.toFixed(0)}%</div>
                    <div className="text-[#94a3b8] text-sm">Envies</div>
                  </div>
                  <div className="text-center flex-1">
                    <div className="text-2xl font-bold text-white mb-1">{budget.epargnePourcentage.toFixed(0)}%</div>
                    <div className="text-[#94a3b8] text-sm">Épargne</div>
                  </div>
                </div>
              </div>
            )}

            {/* Bouton */}
            <div className="flex justify-end">
              <button
                onClick={() => setStep('results')}
                disabled={formData.revenus === 0}
                className="flex items-center gap-2 px-6 py-3 bg-[#4ade80] text-black font-semibold rounded-full hover:bg-[#4ade80]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Voir mon diagnostic <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
