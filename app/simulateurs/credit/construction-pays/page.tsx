import Link from 'next/link';
import { AlertTriangle, ArrowRight, Lock } from 'lucide-react';

export default function ConstructionPaysPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0d0f1a' }}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/simulateurs" className="text-[#94a3b8] hover:text-white transition-colors mb-4 inline-block">
            ← Retour aux simulateurs
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">
            Construction au pays
          </h1>
        </div>

        {/* Orange banner */}
        <div className="p-6 rounded-2xl mb-8 flex items-start gap-4" style={{ backgroundColor: '#f97316' }}>
          <AlertTriangle className="w-6 h-6 text-white mt-1 flex-shrink-0" />
          <div>
            <h2 className="text-xl font-bold text-white mb-2">
              Les banques françaises ne financent pas les projets immobiliers à l'étranger
            </h2>
            <p className="text-white/90">
              Pour construire dans ton pays d'origine, tu devras te tourner vers des solutions alternatives.
            </p>
          </div>
        </div>

        {/* Alternative cards */}
        <div className="space-y-6 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Solutions alternatives</h2>
          
          {/* Card 1: Épargne progressive */}
          <Link
            href="/simulateurs/epargne"
            className="p-6 rounded-2xl border border-white/10 hover:border-[#4ade80]/30 transition-all block"
            style={{ backgroundColor: '#1a1d2d' }}
          >
            <h3 className="text-xl font-semibold text-white mb-2">Épargne progressive</h3>
            <p className="text-[#94a3b8] mb-4">
              Calcule combien épargner chaque mois pour atteindre ton objectif de construction
            </p>
            <div className="flex items-center gap-2 text-[#4ade80] font-medium">
              Démarrer le simulateur <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 2: Optimiser ses transferts */}
          <div className="p-6 rounded-2xl border border-white/10" style={{ backgroundColor: '#1a1d2d' }}>
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Optimiser ses transferts</h3>
              <span className="px-3 py-1 bg-[#4ade80]/20 text-[#4ade80] text-xs font-medium rounded-full">
                Bientôt disponible
              </span>
            </div>
            <p className="text-[#94a3b8] mb-4">
              Compare les frais et les taux des services de transfert d'argent pour maximiser tes envois
            </p>
            <button disabled className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-[#94a3b8] font-medium rounded-full cursor-not-allowed">
              <Lock className="w-4 h-4" /> Bientôt disponible
            </button>
          </div>

          {/* Card 3: Crédit banque locale */}
          <div className="p-6 rounded-2xl border border-white/10" style={{ backgroundColor: '#1a1d2d' }}>
            <h3 className="text-xl font-semibold text-white mb-2">Crédit banque locale</h3>
            <p className="text-[#94a3b8] mb-4">
              Certaines banques africaines financent les projets immobiliers pour la diaspora. Renseigne-toi auprès de :
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white/10 text-white text-sm rounded-full">Ecobank</span>
              <span className="px-3 py-1 bg-white/10 text-white text-sm rounded-full">UBA</span>
              <span className="px-3 py-1 bg-white/10 text-white text-sm rounded-full">Banque Atlantique</span>
              <span className="px-3 py-1 bg-white/10 text-white text-sm rounded-full">Société Générale Afrique</span>
            </div>
          </div>
        </div>

        {/* Articles placeholders */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Articles recommandés</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-white/10" style={{ backgroundColor: '#1a1d2d' }}>
              <span className="px-2 py-1 bg-[#4ade80]/20 text-[#4ade80] text-xs font-medium rounded-full">
                Immobilier
              </span>
              <h3 className="text-white font-medium mt-2 mb-1">Construire au pays : guide complet</h3>
              <p className="text-[#94a3b8] text-sm">Les étapes et les alternatives pour financer ton projet</p>
            </div>
            <div className="p-4 rounded-xl border border-white/10" style={{ backgroundColor: '#1a1d2d' }}>
              <span className="px-2 py-1 bg-[#4ade80]/20 text-[#4ade80] text-xs font-medium rounded-full">
                Transfert
              </span>
              <h3 className="text-white font-medium mt-2 mb-1">Comment transférer de l'argent efficacement</h3>
              <p className="text-[#94a3b8] text-sm">Comparatif des services et astuces pour réduire les frais</p>
            </div>
          </div>
        </div>

        {/* Back button */}
        <Link
          href="/simulateurs"
          className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-all"
        >
          ← Retour aux simulateurs
        </Link>
      </div>
    </div>
  );
}
