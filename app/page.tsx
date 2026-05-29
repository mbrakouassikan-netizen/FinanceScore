import Link from 'next/link'
import { getAllArticles } from '@/lib/sanity.queries'
import { BarChart3, Calculator, Map, Play, ArrowRight, CheckCircle, MessageSquare } from 'lucide-react'
import ProfilWidget from '@/components/ProfilWidget'
import AnimatedStats from '@/components/AnimatedStats'

export default async function HomePage() {
  const articles = await getAllArticles()

  return (
    <div className="min-h-screen">
      {/* HERO SECTION */}
      <section className="relative py-24 md:py-32 px-4 overflow-hidden">
        {/* Halo animé */}
        <div style={{
          position: 'absolute',
          width: '600px', height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(74,222,128,0.12) 0%, transparent 70%)',
          top: '-200px', left: '50%',
          transform: 'translateX(-50%)',
          animation: 'pulse 4s ease-in-out infinite',
          pointerEvents: 'none',
        }} />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8" style={{ backgroundColor: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.4)', boxShadow: '0 0 20px rgba(74,222,128,0.15)' }}>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#4ade80', animation: 'blink 2s infinite' }} />
            <span className="text-[#4ade80] font-medium" style={{ fontSize: '13px' }}>Éducation financière pour la diaspora</span>
          </div>

          {/* Titre */}
          <h1 className="font-bold text-white mb-6 md:whitespace-nowrap" style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, letterSpacing: '-2px' }}>
            <span className="text-4xl md:text-5xl lg:text-6xl">Prends enfin le{' '}</span>
            <span className="text-4xl md:text-5xl lg:text-6xl text-[#4ade80]" style={{ display: 'inline', background: 'rgba(74,222,128,0.15)', borderRadius: '6px', padding: '0 8px', position: 'relative' }}>contrôle</span>
            <br className="hidden md:block" />
            <span className="text-4xl md:text-5xl lg:text-6xl">de tes finances</span>
          </h1>

          {/* Sous-titre */}
          <p className="text-base text-[#64748b] mb-10 max-w-xl mx-auto">
            Quiz gratuit · Simulateurs · Assistant IA · Défis d'épargne — Conçu pour la réalité de la diaspora africaine en France
          </p>

          {/* Boutons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
            <Link
              href="/quiz"
              className="flex items-center gap-2 px-7 py-3 font-semibold rounded-full transition-all hover:shadow-lg hover:shadow-green-500/20"
              style={{ backgroundColor: '#4ade80', color: '#052e16', fontFamily: 'var(--font-syne)' }}
            >
              <Play className="w-4 h-4" /> Faire le quiz gratuit
            </Link>
            <Link
              href="/simulateurs"
              className="px-7 py-3 font-semibold rounded-full transition-all"
              style={{ backgroundColor: 'transparent', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              Explorer les outils
            </Link>
          </div>

          {/* Widget parcours */}
          <div className="flex justify-center mb-8">
            <ProfilWidget />
          </div>

          {/* Avatar stack + social proof */}
          <div className="flex items-center justify-center gap-3">
            <div className="flex">
              {[
                { initiales: 'MK', bg: '#4ade80', color: '#052e16' },
                { initiales: 'AS', bg: '#60a5fa', color: '#1e3a5f' },
                { initiales: 'FD', bg: '#f472b6', color: '#500724' },
                { initiales: 'BT', bg: '#fb923c', color: '#431407' },
              ].map((av, i) => (
                <div key={i} style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: av.bg, color: av.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: '500',
                  border: '2px solid #060d18',
                  marginLeft: i === 0 ? '0' : '-8px',
                  zIndex: 4 - i, position: 'relative',
                }}>{av.initiales}</div>
              ))}
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: '#1e293b', color: '#64748b',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '10px', border: '2px solid #060d18',
                marginLeft: '-8px', position: 'relative',
              }}>+1k</div>
            </div>
            <span className="text-sm text-[#64748b]">
              <span className="text-[#4ade80] font-medium">+ 1 200 personnes</span> ont déjà fait leur bilan
            </span>
          </div>
        </div>
      </section>

      {/* STATS ANIMÉS */}
      <section className="px-4 mb-16">
        <div className="max-w-4xl mx-auto">
          <AnimatedStats />
        </div>
      </section>

      {/* CARDS FONCTIONNALITÉS */}
      <section className="px-4 mb-16">
        <div className="max-w-4xl mx-auto" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
          {/* Card principale - Bilan éducatif */}
          <Link href="/quiz" className="p-6 rounded-2xl transition-all hover:border-[#4ade80]/40" style={{ backgroundColor: '#0a1628', border: '1px solid rgba(74,222,128,0.3)' }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#052e16' }}>
                <BarChart3 className="w-6 h-6 text-[#4ade80]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-white" style={{ fontFamily: 'var(--font-syne)', fontSize: '18px' }}>Bilan éducatif</h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(74,222,128,0.15)', color: '#4ade80' }}>Commencer ici</span>
                </div>
                <p className="text-sm text-[#64748b] mb-4">
                  19 questions pour évaluer ton niveau en épargne, crédit, transferts et budget. Reçois un guide personnalisé selon ton profil.
                </p>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-all hover:shadow-lg hover:shadow-green-500/20" style={{ backgroundColor: '#4ade80', color: '#052e16', fontFamily: 'var(--font-syne)' }}>
                  Faire le bilan <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Link>

          {/* Cards secondaires - grille 2 cols sur desktop */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }} className="md:grid-cols-2">
            {[
              {
                icon: Calculator,
                title: '6 simulateurs',
                desc: 'Crédit, épargne, transfert, budget, locatif, remboursement.',
                href: '/simulateurs',
              },
              {
                icon: Map,
                title: 'Carte diaspora',
                desc: '26 Mds€ envoyés chaque année — compare les meilleurs services de transfert.',
                href: '/carte-diaspora',
              },
            ].map((card, i) => (
              <Link key={i} href={card.href} className="p-5 rounded-2xl transition-all hover:border-[#4ade80]/30" style={{ backgroundColor: '#0a1628', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#052e16' }}>
                  <card.icon className="w-5 h-5 text-[#4ade80]" />
                </div>
                <h3 className="font-semibold text-white mb-2" style={{ fontFamily: 'var(--font-syne)' }}>{card.title}</h3>
                <p className="text-sm text-[#64748b] mb-3">{card.desc}</p>
                <span className="text-[#4ade80] text-sm font-medium flex items-center gap-1">
                  Découvrir <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PREVIEW ASSISTANT IA */}
      <section className="px-4 mb-16">
        <div className="max-w-4xl mx-auto p-6 rounded-2xl relative" style={{ backgroundColor: '#0a1628', border: '1px solid rgba(74,222,128,0.3)', boxShadow: '0 0 40px rgba(74,222,128,0.08), inset 0 0 40px rgba(74,222,128,0.02)' }}>
          {/* Halo secondaire */}
          <div style={{
            position: 'absolute',
            width: '300px', height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(74,222,128,0.06), transparent)',
            right: '-50px', top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }} />
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#4ade80', animation: 'blink 2s infinite' }} />
            <h3 className="font-semibold text-white" style={{ fontFamily: 'var(--font-syne)' }}>Assistant CultureFinance</h3>
            <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: '#052e16', color: '#4ade80' }}>IA — connectée à internet</span>
          </div>

          <div className="space-y-4 mb-6 relative z-10">
            {/* Bulle utilisateur */}
            <div className="flex justify-end">
              <div className="max-w-xs px-4 py-3 rounded-2xl rounded-tr-sm" style={{ backgroundColor: 'rgba(74,222,128,0.08)', color: '#86efac' }}>
                Quelle épargne choisir en 2026 ?
              </div>
            </div>
            {/* Bulle assistant */}
            <div className="flex justify-start">
              <div className="max-w-md px-4 py-3 rounded-2xl rounded-tl-sm" style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: '#94a3b8' }}>
                Le LEP à 2,5% est le plus avantageux si tu es éligible — exonéré d'impôt et garanti par l'État. Le Livret A à 1,5% reste une base solide pour commencer...
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 relative z-10">
            <Link href="/simulateurs/transfert" className="px-3 py-1.5 rounded-full text-sm transition-all" style={{ backgroundColor: 'rgba(74,222,128,0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }}>
              Comparer les transferts
            </Link>
            <Link href="/simulateurs/epargne" className="px-3 py-1.5 rounded-full text-sm transition-all" style={{ backgroundColor: 'rgba(74,222,128,0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }}>
              Simuler mon épargne
            </Link>
            <Link href="/simulateurs/credit" className="px-3 py-1.5 rounded-full text-sm transition-all" style={{ backgroundColor: 'rgba(74,222,128,0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }}>
              Calculer ma capacité
            </Link>
          </div>
        </div>
      </section>

      {/* BLOG PREVIEW */}
      <section className="px-4 mb-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-syne)' }}>Derniers articles</h2>
            <Link href="/blog" className="text-[#4ade80] hover:underline flex items-center gap-2 text-sm">
              Voir tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {articles && articles.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {articles.slice(0, 2).map((article) => (
                <Link
                  key={article._id}
                  href={`/blog/${article.slug.current}`}
                  className="rounded-2xl transition-all hover:border-[#4ade80]/30 flex flex-col"
                  style={{ backgroundColor: '#0a1628', border: '1px solid rgba(255,255,255,0.06)', minHeight: '280px' }}
                >
                  {/* Image area */}
                  <div className="h-40 rounded-t-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #052e16 0%, #14532d 100%)' }}>
                    <span style={{ color: '#4ade80', fontSize: '14px', fontWeight: '600', fontFamily: 'var(--font-syne)', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', padding: '6px 16px', borderRadius: '20px' }}>
                      {article.category || 'Article'}
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <span className="px-2 py-1 rounded-full text-xs w-fit" style={{ backgroundColor: 'rgba(74,222,128,0.1)', color: '#4ade80' }}>
                      {article.category}
                    </span>
                    <h3 className="font-bold text-white mt-3 mb-2" style={{ fontFamily: 'var(--font-syne)', fontSize: '16px' }}>{article.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-[#64748b] mb-3">
                      <span>12 mai 2026</span>
                      <span>•</span>
                      <span>5 min de lecture</span>
                    </div>
                    <p className="text-sm text-[#64748b] line-clamp-2 mb-4 flex-1">{article.excerpt}</p>
                    <span className="text-[#4ade80] text-sm font-medium flex items-center gap-1 mt-auto">
                      Lire l'article <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { category: 'Budget', title: 'Comment gérer ton budget efficacement', excerpt: 'Découvre les meilleures pratiques pour maîtriser tes finances...' },
                { category: 'Investissement', title: 'Investir pour la diaspora : guide complet', excerpt: 'Les opportunités d\'investissement adaptées à ta situation...' },
              ].map((article, i) => (
                <div key={i} className="rounded-2xl flex flex-col" style={{ backgroundColor: '#0a1628', border: '1px solid rgba(255,255,255,0.06)', minHeight: '280px' }}>
                  <div className="h-40 rounded-t-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #052e16 0%, #14532d 100%)' }}>
                    <span style={{ color: '#4ade80', fontSize: '14px', fontWeight: '600', fontFamily: 'var(--font-syne)', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', padding: '6px 16px', borderRadius: '20px' }}>
                      {article.category}
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <span className="px-2 py-1 rounded-full text-xs w-fit" style={{ backgroundColor: 'rgba(74,222,128,0.1)', color: '#4ade80' }}>{article.category}</span>
                    <h3 className="font-bold text-white mt-3 mb-2" style={{ fontFamily: 'var(--font-syne)', fontSize: '16px' }}>{article.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-[#64748b] mb-3">
                      <span>12 mai 2026</span>
                      <span>•</span>
                      <span>5 min de lecture</span>
                    </div>
                    <p className="text-sm text-[#64748b] mb-4 flex-1">{article.excerpt}</p>
                    <span className="text-[#64748b] text-sm font-medium flex items-center gap-1 mt-auto">
                      Lire l'article <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto text-center p-10 rounded-2xl" style={{ background: 'linear-gradient(135deg, #0a1f0f 0%, #051a0a 100%)' }}>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-syne)' }}>Prêt à connaître ton score éducatif ?</h2>
          <p className="text-[#64748b] mb-6">Gratuit · 5 minutes · Résultat immédiat</p>
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 px-8 py-4 font-semibold rounded-full transition-all hover:shadow-lg hover:shadow-green-500/30"
            style={{ backgroundColor: '#4ade80', color: '#052e16', fontFamily: 'var(--font-syne)' }}
          >
            Faire le quiz maintenant <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
