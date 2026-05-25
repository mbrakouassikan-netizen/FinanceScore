'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Lock } from 'lucide-react';

type Tab = 'Tous' | 'Épargne' | 'Transfert' | 'Budget' | 'Investissement' | 'Crédit';

interface SimulatorCard {
  id: string;
  title: string;
  description: string;
  tab: Tab;
  badge?: string;
  active: boolean;
  link?: string;
}

const tabs: Tab[] = ['Tous', 'Épargne', 'Transfert', 'Budget', 'Investissement', 'Crédit'];

const simulators: SimulatorCard[] = [
  {
    id: 'epargne',
    title: 'Épargne & intérêts composés',
    description: 'Calcule combien ton épargne peut rapporter sur 10, 20 ou 30 ans',
    tab: 'Épargne',
    badge: 'Populaire',
    active: true,
    link: '/simulateurs/epargne',
  },
  {
    id: 'transfert',
    title: 'Comparateur de transfert',
    description: 'Compare les frais et les taux des services de transfert d\'argent',
    tab: 'Transfert',
    active: true,
    link: '/simulateurs/transfert',
  },
  {
    id: 'budget',
    title: 'Budget 50/30/20',
    description: 'Organise tes dépenses selon la règle 50/30/20',
    tab: 'Budget',
    active: true,
    link: '/simulateurs/budget',
  },
  {
    id: 'credit',
    title: 'Capacité d\'emprunt',
    description: 'Calcule combien tu peux emprunter pour ton projet immobilier',
    tab: 'Crédit',
    active: true,
    link: '/simulateurs/credit',
  },
  {
    id: 'remboursement',
    title: 'Simulateur de remboursement',
    description: 'Simule tes mensualités selon le montant et la durée',
    tab: 'Crédit',
    badge: 'Bientôt',
    active: false,
  },
  {
    id: 'investissement',
    title: 'Investissement locatif',
    description: 'Évalue la rentabilité d\'un investissement immobilier',
    tab: 'Investissement',
    badge: 'Bientôt',
    active: false,
  },
];

export default function SimulateursPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Tous');

  const filteredSimulators = activeTab === 'Tous' 
    ? simulators 
    : simulators.filter(s => s.tab === activeTab);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0d0f1a' }}>
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Simulateurs financiers
          </h1>
          <p className="text-lg text-[#94a3b8] max-w-3xl mx-auto">
            Des outils concrets pour prendre les bonnes décisions, adaptés à la réalité de la diaspora.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-12 md:justify-center flex-nowrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-[#4ade80] text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredSimulators.map((simulator) => (
            <div
              key={simulator.id}
              className="p-6 rounded-2xl border border-white/10 hover:border-[#4ade80]/30 transition-all"
              style={{ backgroundColor: '#1a1d2d' }}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">
                  {simulator.title}
                </h3>
                {simulator.badge && (
                  <span className="px-3 py-1 bg-[#4ade80]/20 text-[#4ade80] text-xs font-medium rounded-full">
                    {simulator.badge}
                  </span>
                )}
              </div>
              <p className="text-[#94a3b8] mb-6">
                {simulator.description}
              </p>
              {simulator.active && simulator.link ? (
                <Link
                  href={simulator.link}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#4ade80] text-black font-semibold rounded-full hover:bg-[#4ade80]/90 transition-all"
                >
                  Démarrer <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-[#94a3b8] font-semibold rounded-full cursor-not-allowed"
                >
                  <Lock className="w-4 h-4" /> Bientôt disponible
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
