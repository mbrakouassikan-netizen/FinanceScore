import Link from 'next/link';
import { getAllArticles } from '@/lib/sanity.queries';
import { Target, FileText, Zap, ArrowRight, CheckCircle2, TrendingUp, BookOpen } from 'lucide-react';
import ProfilWidget from '@/components/ProfilWidget';

export default async function HomePage() {
  const articles = await getAllArticles();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0d0f1a' }}>
      {/* SECTION 1 — Hero principal */}
      <section className="relative py-20 md:py-32 px-4 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d0f1a] via-[#0a1a1a] to-[#0d0f1a] opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/10 via-transparent to-blue-900/10"></div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            {/* Badge animé */}
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-green-400/30 text-green-400 text-sm font-medium mb-8 animate-pulse">
              ✦ Éducation Financière pour la Diaspora
            </div>

            {/* Titre principal */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight">
              Prends enfin le <span className="text-[#4ade80]">contrôle</span> de tes finances
            </h1>

            {/* Sous-titre */}
            <p className="text-lg md:text-xl text-[#94a3b8] mb-10 max-w-3xl mx-auto">
              Quiz gratuit · Plan d'action personnalisé · Ressources exclusives — Conçu pour la réalité de la diaspora
            </p>

            {/* Boutons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                href="/quiz"
                className="px-8 py-4 bg-[#4ade80] text-black font-semibold rounded-full text-lg hover:bg-[#4ade80]/90 transition-all hover:shadow-lg hover:shadow-green-500/20"
              >
                Faire le quiz gratuit
              </Link>
              <Link
                href="/blog"
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full text-lg hover:bg-white/10 transition-all"
              >
                Lire le blog
              </Link>
            </div>

            {/* Widget parcours */}
            <div className="flex justify-center mb-4">
              <ProfilWidget />
            </div>

            {/* Compteur animé */}
            <div className="text-[#94a3b8] text-sm">
              + 1 200 personnes ont déjà fait leur bilan
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — Barre de stats */}
      <section className="py-12 px-4 border-y border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-[#4ade80]" />
              <div>
                <div className="text-2xl font-bold text-white">19</div>
                <div className="text-sm text-[#94a3b8]">questions — Quiz rapide</div>
              </div>
            </div>
            <div className="hidden md:block w-px h-12 bg-white/20"></div>
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-[#4ade80]" />
              <div>
                <div className="text-2xl font-bold text-white">4</div>
                <div className="text-sm text-[#94a3b8]">profils — Plan personnalisé</div>
              </div>
            </div>
            <div className="hidden md:block w-px h-12 bg-white/20"></div>
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-[#4ade80]" />
              <div>
                <div className="text-2xl font-bold text-white">5</div>
                <div className="text-sm text-[#94a3b8]">minutes — Résultat immédiat</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — Comment ça marche */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white text-center mb-16">
            Comment ça marche ?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-6xl font-bold text-[#4ade80]/30 mb-4">01</div>
              <h3 className="text-xl font-semibold text-white mb-2">Tu fais le quiz</h3>
              <p className="text-[#94a3b8]">19 questions sur ta situation</p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-[#4ade80]/30 mb-4">02</div>
              <h3 className="text-xl font-semibold text-white mb-2">Tu reçois ton score</h3>
              <p className="text-[#94a3b8]">Score financier sur 100</p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-[#4ade80]/30 mb-4">03</div>
              <h3 className="text-xl font-semibold text-white mb-2">Tu obtiens ton plan</h3>
              <p className="text-[#94a3b8]">Plan d'action personnalisé PDF</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — Cards des 3 piliers */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl border border-white/10 hover:border-[#4ade80]/30 transition-all hover:shadow-xl hover:shadow-green-500/10 hover:-translate-y-1" style={{ backgroundColor: '#1a1d2d' }}>
              <CheckCircle2 className="w-12 h-12 text-[#4ade80] mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Score financier</h3>
              <p className="text-[#94a3b8]">Évalue ta santé financière sur 100 avec 6 piliers analysés</p>
            </div>
            <div className="p-8 rounded-2xl border border-white/10 hover:border-[#4ade80]/30 transition-all hover:shadow-xl hover:shadow-green-500/10 hover:-translate-y-1" style={{ backgroundColor: '#1a1d2d' }}>
              <TrendingUp className="w-12 h-12 text-[#4ade80] mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Plan d'action 90j</h3>
              <p className="text-[#94a3b8]">Reçois un plan personnalisé pour améliorer tes finances</p>
            </div>
            <div className="p-8 rounded-2xl border border-white/10 hover:border-[#4ade80]/30 transition-all hover:shadow-xl hover:shadow-green-500/10 hover:-translate-y-1" style={{ backgroundColor: '#1a1d2d' }}>
              <BookOpen className="w-12 h-12 text-[#4ade80] mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Blog & Formation</h3>
              <p className="text-[#94a3b8]">Articles et ressources pour approfondir tes connaissances</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — Aperçu blog */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
              Derniers articles
            </h2>
            <Link href="/blog" className="text-[#4ade80] hover:underline flex items-center gap-2">
              Voir tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {articles && articles.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {articles.slice(0, 2).map((article) => (
                <Link
                  key={article._id}
                  href={`/blog/${article.slug.current}`}
                  className="p-6 rounded-2xl border border-white/10 hover:border-[#4ade80]/30 transition-all hover:shadow-xl hover:shadow-green-500/10 hover:-translate-y-1"
                  style={{ backgroundColor: '#1a1d2d' }}
                >
                  <span className="px-3 py-1 bg-[#4ade80]/20 text-[#4ade80] text-sm font-medium rounded-full">
                    {article.category}
                  </span>
                  <h3 className="text-xl font-semibold text-white mt-4 mb-2">
                    {article.title}
                  </h3>
                  <p className="text-[#94a3b8] line-clamp-2">
                    {article.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 rounded-2xl border border-white/10" style={{ backgroundColor: '#1a1d2d' }}>
                <span className="px-3 py-1 bg-[#4ade80]/20 text-[#4ade80] text-sm font-medium rounded-full">
                  Budget
                </span>
                <h3 className="text-xl font-semibold text-white mt-4 mb-2">
                  Comment gérer ton budget efficacement
                </h3>
                <p className="text-[#94a3b8]">
                  Découvre les meilleures pratiques pour maîtriser tes finances...
                </p>
              </div>
              <div className="p-6 rounded-2xl border border-white/10" style={{ backgroundColor: '#1a1d2d' }}>
                <span className="px-3 py-1 bg-[#4ade80]/20 text-[#4ade80] text-sm font-medium rounded-full">
                  Investissement
                </span>
                <h3 className="text-xl font-semibold text-white mt-4 mb-2">
                  Investir pour la diaspora : guide complet
                </h3>
                <p className="text-[#94a3b8]">
                  Les opportunités d'investissement adaptées à ta situation...
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 6 — CTA final */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center p-12 rounded-3xl" style={{ background: 'linear-gradient(135deg, #1a2e1a 0%, #0d1f0d 100%)' }}>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
            Prêt à connaître ton score financier ?
          </h2>
          <p className="text-lg text-[#94a3b8] mb-8">
            Gratuit · 5 minutes · Résultat immédiat
          </p>
          <Link
            href="/quiz"
            className="inline-flex items-center px-8 py-4 bg-[#4ade80] text-black font-semibold rounded-full text-lg hover:bg-[#4ade80]/90 transition-all hover:shadow-lg hover:shadow-green-500/30"
          >
            Faire le quiz maintenant
          </Link>
        </div>
      </section>

      {/* SECTION 7 — Footer simple */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-2xl font-serif font-bold text-[#4ade80]">
              CultureFinance
            </div>
            <div className="flex gap-6">
              <Link href="/quiz" className="text-[#94a3b8] hover:text-white transition-colors">
                Quiz
              </Link>
              <Link href="/blog" className="text-[#94a3b8] hover:text-white transition-colors">
                Blog
              </Link>
              <Link href="/a-propos" className="text-[#94a3b8] hover:text-white transition-colors">
                Contact
              </Link>
            </div>
            <div className="text-sm text-[#94a3b8]">
              © 2025 CultureFinance — Tous droits réservés
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
