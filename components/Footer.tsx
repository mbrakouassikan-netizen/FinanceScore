import Link from 'next/link';
import { Home, Calculator, FileText, Bot, Map, Info, Send, PiggyBank, Wallet, Building, Trophy, User, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#060d18] border-t border-[rgba(74,222,128,0.15)]">
      {/* Section haute - 3 colonnes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 py-12 md:px-8 md:py-12 lg:px-8 lg:py-12">
        {/* Colonne 1 - Brand */}
        <div className="md:col-span-2 lg:col-span-1">
          <Link
            href="/"
            className="text-[20px] font-extrabold text-[#4ade80] tracking-[-0.5px]"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            CultureFinance
          </Link>
          <p className="mt-4 text-[13px] text-[#64748b] leading-[1.7] max-w-[280px]">
            Plateforme d'éducation financière indépendante pour la diaspora africaine en France. Épargne, transferts, crédit, budget.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-[rgba(74,222,128,0.08)] border border-[rgba(74,222,128,0.2)] rounded-[12px]">
            <ShieldCheck size={14} className="text-[#4ade80]" />
            <span className="text-[11px] text-[#4ade80] font-medium">
              Ressources éducatives · 100% indépendant
            </span>
          </div>
        </div>

        {/* Colonne 2 - Navigation */}
        <div>
          <h3 className="text-[12px] uppercase tracking-[0.08em] text-[#e2e8f0] mb-3.5 font-semibold">
            Navigation
          </h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="flex items-center gap-1.5 text-[13px] text-[#64748b] hover:text-[#4ade80] transition-colors">
                <Home size={16} />
                Accueil
              </Link>
            </li>
            <li>
              <Link href="/quiz" className="flex items-center gap-1.5 text-[13px] text-[#64748b] hover:text-[#4ade80] transition-colors">
                <Calculator size={16} />
                Quiz éducatif
              </Link>
            </li>
            <li>
              <Link href="/simulateurs" className="flex items-center gap-1.5 text-[13px] text-[#64748b] hover:text-[#4ade80] transition-colors">
                <Calculator size={16} />
                Simulateurs
              </Link>
            </li>
            <li>
              <Link href="/blog" className="flex items-center gap-1.5 text-[13px] text-[#64748b] hover:text-[#4ade80] transition-colors">
                <FileText size={16} />
                Blog
              </Link>
            </li>
            <li>
              <Link href="/assistant" className="flex items-center gap-1.5 text-[13px] text-[#64748b] hover:text-[#4ade80] transition-colors">
                <Bot size={16} />
                Assistant IA
              </Link>
            </li>
            <li>
              <Link href="/carte-diaspora" className="flex items-center gap-1.5 text-[13px] text-[#64748b] hover:text-[#4ade80] transition-colors">
                <Map size={16} />
                Carte diaspora
              </Link>
            </li>
            <li>
              <Link href="/a-propos" className="flex items-center gap-1.5 text-[13px] text-[#64748b] hover:text-[#4ade80] transition-colors">
                <Info size={16} />
                À propos
              </Link>
            </li>
          </ul>
        </div>

        {/* Colonne 3 - Outils gratuits */}
        <div>
          <h3 className="text-[12px] uppercase tracking-[0.08em] text-[#e2e8f0] mb-3.5 font-semibold">
            Outils gratuits
          </h3>
          <ul className="space-y-2">
            <li>
              <Link href="/simulateurs/transfert" className="flex items-center gap-1.5 text-[13px] text-[#64748b] hover:text-[#4ade80] transition-colors">
                <Send size={16} />
                Comparateur transfert
              </Link>
            </li>
            <li>
              <Link href="/simulateurs/epargne" className="flex items-center gap-1.5 text-[13px] text-[#64748b] hover:text-[#4ade80] transition-colors">
                <PiggyBank size={16} />
                Simulateur épargne
              </Link>
            </li>
            <li>
              <Link href="/simulateurs/credit" className="flex items-center gap-1.5 text-[13px] text-[#64748b] hover:text-[#4ade80] transition-colors">
                <Home size={16} />
                Simulateur crédit
              </Link>
            </li>
            <li>
              <Link href="/simulateurs/budget" className="flex items-center gap-1.5 text-[13px] text-[#64748b] hover:text-[#4ade80] transition-colors">
                <Wallet size={16} />
                Simulateur budget
              </Link>
            </li>
            <li>
              <Link href="/simulateurs/investissement-locatif" className="flex items-center gap-1.5 text-[13px] text-[#64748b] hover:text-[#4ade80] transition-colors">
                <Building size={16} />
                Investissement locatif
              </Link>
            </li>
            <li>
              <Link href="/defis" className="flex items-center gap-1.5 text-[13px] text-[#64748b] hover:text-[#4ade80] transition-colors">
                <Trophy size={16} />
                Défis d'épargne
              </Link>
            </li>
            <li>
              <Link href="/profil" className="flex items-center gap-1.5 text-[13px] text-[#64748b] hover:text-[#4ade80] transition-colors">
                <User size={16} />
                Mon parcours
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Section basse - barre légale */}
      <div className="border-t border-[#1e293b] px-8 py-4 md:px-8 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <p className="text-[12px] text-[#475569]">
            © 2026 CultureFinance · Éducation Financière pour la Diaspora
          </p>
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#334155]">
            <span>Ressources éducatives uniquement · Pas de conseils financiers ·</span>
            <Link href="/rgpd" className="hover:text-[#4ade80] transition-colors">
              RGPD
            </Link>
            <span>·</span>
            <Link href="/a-propos" className="hover:text-[#4ade80] transition-colors">
              Mentions légales
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
