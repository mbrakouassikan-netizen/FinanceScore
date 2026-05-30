import { Metadata } from 'next'
import Link from 'next/link'
import { Target, Shield, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'À propos | CultureFinance',
  description: 'CultureFinance est une plateforme d\'éducation financière dédiée à la diaspora africaine en France. Découvrez notre mission, nos valeurs et l\'histoire du projet.',
}

export default function AProposPage() {
  return (
    <div className="min-h-screen pt-16 pb-16 px-4" style={{ backgroundColor: '#0d0f1a' }}>
      <div className="max-w-4xl mx-auto space-y-16">

        {/* Back */}
        <div><Link href="/" className="text-[#94a3b8] hover:text-white transition-colors text-sm">← Accueil</Link></div>

        {/* 1. HERO */}
        <section className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">
            L'éducation financière, enfin à <span className="text-[#4ade80]">notre portée</span>
          </h1>
          <p className="text-lg md:text-xl text-[#94a3b8] max-w-2xl mx-auto">
            CultureFinance est une plateforme d'éducation financière indépendante, conçue pour la diaspora africaine en France. Épargne, transferts, crédit, budget.
          </p>
        </section>

        {/* 2. CHIFFRES CLÉS */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '+ 1 200', label: 'bilans éducatifs réalisés' },
              { value: '6', label: 'simulateurs actifs' },
              { value: '100%', label: 'indépendant et gratuit' },
              { value: 'Gratuit', label: 'pour toujours' },
            ].map((stat, i) => (
              <div key={i} className="p-6 rounded-2xl border border-white/10 text-center" style={{ backgroundColor: '#1e293b' }}>
                <div className="text-3xl font-bold text-[#4ade80] mb-2">{stat.value}</div>
                <div className="text-[#64748b] text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. NOTRE MISSION */}
        <section className="p-8 rounded-2xl border border-white/10" style={{ backgroundColor: '#0f172a' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#052e16' }}>
              <Target className="w-6 h-6 text-[#4ade80]" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-white">Notre mission</h2>
          </div>
          <p className="text-[#94a3b8] leading-relaxed">
            La gestion de l'argent n'est presque jamais enseignée. Et les ressources qui existent ne sont pas faites pour nous. Elles ne parlent pas d'envoyer de l'argent au pays, d'épargner ici tout en soutenant la famille là-bas, ni d'obtenir un crédit avec un parcours atypique.
          </p>
          <p className="text-[#94a3b8] leading-relaxed mt-4">
            CultureFinance est né de ce constat. Notre mission : fournir des ressources éducatives concrètes, adaptées à la réalité de la diaspora, 100% indépendantes. Nous ne sommes pas des conseillers financiers. Nous sommes un outil d'éducation.
          </p>
        </section>

        {/* 4. NOTRE PARCOURS — timeline */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-white mb-8 text-center">Notre parcours</h2>
          <div className="relative pl-8 space-y-12">
            {/* Ligne verticale */}
            <div className="absolute left-3 top-0 bottom-0 w-0.5" style={{ backgroundColor: '#4ade80' }} />

            {[
              {
                title: 'Le constat',
                subtitle: 'Tout le monde veut investir, personne ne s\'éduque d\'abord',
                text: 'En observant la diaspora africaine en France, un constat s\'impose : beaucoup se lancent dans l\'épargne et l\'investissement sans bases solides. Les ressources existantes ne sont pas adaptées à leur réalité : envoyer au pays, épargner ici, construire là-bas.',
              },
              {
                title: 'La construction',
                subtitle: 'Un outil clé en main',
                text: 'Création du quiz éducatif 19 questions, des 6 simulateurs (crédit, épargne, budget, transfert, locatif, remboursement), du système de gamification et des défis d\'épargne. Plus de 1 200 bilans éducatifs réalisés.',
              },
              {
                title: 'Aujourd\'hui, CultureFinance en 2026',
                subtitle: 'CultureFinance en 2026',
                text: 'Assistant IA connecté à internet, carte interactive des transferts diaspora, défis d\'épargne gamifiés, système de progression. Un écosystème complet d\'éducation financière pour la diaspora africaine.',
              },
            ].map((step, i) => (
              <div key={i} className="relative">
                {/* Point sur la ligne */}
                <div className="absolute left-[-1.375rem] w-5 h-5 rounded-full border-2" style={{ backgroundColor: '#0d0f1a', borderColor: '#4ade80' }} />
                <div className="p-6 rounded-2xl border border-white/10" style={{ backgroundColor: '#1e293b' }}>
                  <h3 className="text-lg font-bold text-white mb-1">{step.title}</h3>
                  <p className="text-[#4ade80] text-sm font-semibold mb-3">{step.subtitle}</p>
                  <p className="text-[#94a3b8] text-sm leading-relaxed">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. NOS VALEURS — grille 2x2 */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-white mb-8 text-center">Nos valeurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                emoji: '🎓',
                title: 'Éducation avant tout',
                text: "L'éducation financière doit venir avant l'investissement. Comprendre avant d'agir, c'est notre philosophie.",
              },
              {
                emoji: '🌍',
                title: 'Ancré dans la réalité diaspora',
                text: 'Épargner ici, envoyer au pays, construire là-bas. On parle de ta vraie vie, pas d\'un cas théorique.',
              },
              {
                emoji: '🔒',
                title: 'Confiance et transparence',
                text: 'Pas d\'affiliation bancaire, pas de commission, pas de conflit d\'intérêt. Jamais.',
              },
              {
                emoji: '🤝',
                title: 'Motivation et progression',
                text: 'La gamification, les défis d\'épargne et le système de niveaux sont là pour te garder motivé sur le long terme.',
              },
            ].map((v, i) => (
              <div key={i} className="p-6 rounded-2xl border border-white/10" style={{ backgroundColor: '#1e293b' }}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#0d0f1a' }}>
                    <span className="text-2xl">{v.emoji}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">{v.title}</h3>
                    <p className="text-[#94a3b8] text-sm leading-relaxed">{v.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. INDÉPENDANCE TOTALE */}
        <section className="p-8 rounded-2xl border" style={{ backgroundColor: '#052e16', borderColor: '#166534' }}>
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-[#4ade80]" />
            <h2 className="text-xl font-bold text-white">Indépendance totale</h2>
          </div>
          <p className="text-[#94a3b8] leading-relaxed mb-6">
            CultureFinance est 100% indépendant. Nous n'avons aucune affiliation avec une banque, un assureur ou un service de transfert. Nous ne touchons aucune commission sur les services que nous comparons. Notre seule source de revenus : les guides éducatifs premium disponibles après le bilan.
          </p>
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold" style={{ backgroundColor: '#052e16', color: '#4ade80', border: '1px solid #166534' }}>
            Ressources éducatives — pas de conseils financiers
          </div>
        </section>

        {/* 7. CTA FINAL */}
        <section className="text-center pt-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/quiz"
              className="px-8 py-4 bg-[#4ade80] text-black font-semibold rounded-full text-lg hover:bg-[#4ade80]/90 transition-all hover:shadow-lg hover:shadow-green-500/20"
            >
              Faire mon bilan gratuit <ArrowRight className="w-5 h-5 inline ml-2" />
            </Link>
            <Link
              href="/simulateurs"
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full text-lg hover:bg-white/10 transition-all"
            >
              Explorer les simulateurs
            </Link>
          </div>
        </section>

      </div>
    </div>
  )
}
