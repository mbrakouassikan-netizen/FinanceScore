'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Compass, Lightbulb, BookOpen, Rocket, Crown, Star, ArrowLeftRight, Wallet, Calculator, Home, Building2, CreditCard, Map, Heart, Lock, ArrowRight, Share2, CheckCircle, Clock, Trophy } from 'lucide-react';

const NIVEAUX_META = [
  { level: 1, label: 'Explorateur', min: 0, icon: Compass },
  { level: 2, label: 'Curieux', min: 100, icon: Lightbulb },
  { level: 3, label: 'Averti', min: 300, icon: BookOpen },
  { level: 4, label: 'Engagé', min: 600, icon: Rocket },
  { level: 5, label: 'Expert CultureFinance', min: 1000, icon: Crown },
];

const BADGES_META = [
  { id: 'premier_pas', label: 'Premier pas', desc: 'Quiz complété', pts: 50, icon: Star },
  { id: 'transfert_malin', label: 'Transfert malin', desc: 'Comparateur de transferts utilisé', pts: 20, icon: ArrowLeftRight },
  { id: 'epargnant_actif', label: 'Épargnant actif', desc: 'Simulateur épargne utilisé', pts: 20, icon: Wallet },
  { id: 'budget_controle', label: 'Budget sous contrôle', desc: 'Simulateur budget utilisé', pts: 20, icon: Calculator },
  { id: 'projet_immo', label: 'Projet immo', desc: 'Simulateur crédit utilisé', pts: 20, icon: Home },
  { id: 'rentier_herbe', label: 'Rentier en herbe', desc: 'Simulateur locatif utilisé', pts: 20, icon: Building2 },
  { id: 'maitre_remboursement', label: 'Maître du remboursement', desc: 'Simulateur remboursement utilisé', pts: 20, icon: CreditCard },
  { id: 'explorateur_complet', label: 'Explorateur complet', desc: 'Tous les simulateurs utilisés', pts: 30, icon: Map },
  { id: 'fidele', label: 'Fidèle', desc: '4 visites sur le site', pts: 15, icon: Heart },
];

const SIMS_META = [
  { id: 'transfert', label: "Transfert d'argent", icon: ArrowLeftRight, href: '/simulateurs/transfert' },
  { id: 'epargne', label: 'Épargne progressive', icon: Wallet, href: '/simulateurs/epargne' },
  { id: 'budget', label: 'Budget mensuel', icon: Calculator, href: '/simulateurs/budget' },
  { id: 'credit', label: "Capacité d'emprunt", icon: Home, href: '/simulateurs/credit' },
  { id: 'investissement-locatif', label: 'Investissement locatif', icon: Building2, href: '/simulateurs/investissement-locatif' },
  { id: 'remboursement', label: 'Remboursement', icon: CreditCard, href: '/simulateurs/remboursement' },
];

const ACTION_LABELS: Record<string, string> = {
  quiz_complete: 'Quiz complété',
  simulateur_use: 'Simulateur utilisé',
  blog_read: 'Article lu',
  site_share: 'Site partagé',
  return_visit: 'Retour sur le site',
};

interface ProfilData {
  nom: string; email: string; points: number;
  niveau: { level: number; label: string; min: number };
  badges: string[];
  historique: { action: string; details: Record<string, string>; points: number; date: string }[];
  simulateurs_utilises: string[];
  prochainNiveau: { level: number; label: string; min: number } | null;
}

const fmt = (iso: string) => { try { return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }); } catch { return ''; } };
const daysLeft = () => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth() + 1, 0).getDate() - n.getDate(); };

export default function ProfilPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [profil, setProfil] = useState<ProfilData | null>(null);
  const [loading, setLoading] = useState(true);
  const [shared, setShared] = useState(false);
  const visitCalled = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem('cf_email');
    setEmail(saved);
    if (saved) {
      fetch(`/api/gamification/profil?email=${encodeURIComponent(saved)}`)
        .then(r => r.json()).then(d => { if (d.success) setProfil(d); setLoading(false); })
        .catch(() => setLoading(false));
      if (!visitCalled.current) {
        visitCalled.current = true;
        fetch('/api/gamification/action', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: saved, action: 'return_visit', details: {} }) }).catch(() => {});
      }
    } else { setLoading(false); }
  }, []);

  const handleShare = async () => {
    if (!email) return;
    await fetch('/api/gamification/action', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, action: 'site_share', details: {} }) }).catch(() => {});
    navigator.clipboard.writeText('Découvre CultureFinance et teste ta santé financière ! https://culturefinance.fr').catch(() => {});
    setShared(true); setTimeout(() => setShared(false), 3000);
  };

  if (!loading && !email) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#0d0f1a' }}>
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-[#4ade80]/10 border-2 border-[#4ade80]/30 flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-10 h-10 text-[#4ade80]" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-white mb-3">Ton parcours t'attend</h1>
        <p className="text-[#94a3b8] mb-8">Fais le quiz pour créer ton parcours et suivre ta progression sur CultureFinance.</p>
        <Link href="/quiz" className="inline-flex items-center gap-2 px-8 py-4 bg-[#4ade80] text-black font-bold rounded-full hover:bg-[#4ade80]/90 transition-all">
          Faire le quiz <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0d0f1a' }}>
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#4ade80] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#94a3b8]">Chargement de ton parcours...</p>
      </div>
    </div>
  );

  if (!profil) return null;

  const currentN = NIVEAUX_META.find(n => n.level === profil.niveau.level) ?? NIVEAUX_META[0];
  const prochainMeta = profil.prochainNiveau ? NIVEAUX_META.find(n => n.level === profil.prochainNiveau!.level) : null;
  const progressToNext = profil.prochainNiveau ? ((profil.points - profil.niveau.min) / (profil.prochainNiveau.min - profil.niveau.min)) * 100 : 100;
  const initials = (profil.nom || email || 'CF').substring(0, 2).toUpperCase();
  const defiProgress = Math.min(3, profil.simulateurs_utilises.length) / 3 * 100;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0d0f1a' }}>
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <div><Link href="/" className="text-[#94a3b8] hover:text-white transition-colors inline-block">← Accueil</Link></div>

        {/* S1 — Header */}
        <div className="p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center gap-5" style={{ backgroundColor: '#1a1d2d' }}>
          <div className="w-16 h-16 rounded-full bg-[#4ade80] flex items-center justify-center text-black text-xl font-bold flex-shrink-0">{initials}</div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-serif font-bold text-white mb-1">{profil.nom || email}</h1>
            {profil.nom && <p className="text-[#94a3b8] text-sm mb-3">{email}</p>}
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4ade80]/10 border border-[#4ade80]/30 text-[#4ade80] text-sm font-semibold">
              <currentN.icon className="w-4 h-4" />{currentN.label}
            </span>
          </div>
          <div className="text-center"><div className="text-3xl font-bold text-[#4ade80]">{profil.points}</div><div className="text-[#94a3b8] text-xs">points</div></div>
        </div>

        {/* S2 — Progression */}
        <div className="p-6 rounded-2xl border border-white/10" style={{ backgroundColor: '#1a1d2d' }}>
          <h2 className="text-lg font-semibold text-white mb-5">Ma progression</h2>
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-[#94a3b8]">{profil.points} pts</span>
              <span className="text-[#94a3b8]">{prochainMeta ? `${profil.prochainNiveau?.min} pts → ${prochainMeta.label}` : 'Niveau maximum !'}</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3">
              <div className="h-3 rounded-full transition-all" style={{ width: `${Math.min(100, progressToNext)}%`, backgroundColor: '#4ade80' }} />
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {NIVEAUX_META.map(n => {
              const isActive = n.level === profil.niveau.level;
              const isDone = n.level < profil.niveau.level;
              const I = n.icon;
              return (
                <div key={n.level} className={`flex flex-col items-center gap-1 p-2 rounded-xl ${isActive ? 'bg-[#4ade80]/10 border border-[#4ade80]/30' : 'border border-white/5'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive || isDone ? 'bg-[#4ade80]' : 'bg-white/10'}`}>
                    <I className={`w-4 h-4 ${isActive || isDone ? 'text-black' : 'text-white/30'}`} />
                  </div>
                  <span className={`text-xs text-center leading-tight ${isActive ? 'text-[#4ade80] font-semibold' : isDone ? 'text-white/60' : 'text-white/30'}`}>{n.label.split(' ')[0]}</span>
                  <span className={`text-xs ${isActive ? 'text-[#4ade80]' : 'text-white/20'}`}>{n.min}pts</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* S3 — Défi du mois */}
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: '#1a0533', borderColor: '#4c1d95' }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">🎯 Défi du mois</h2>
              <p className="text-purple-300 text-sm font-medium">Utilise 3 simulateurs ce mois-ci</p>
            </div>
            <div className="flex items-center gap-1 text-purple-400 text-xs"><Clock className="w-3 h-3" /><span>{daysLeft()} jours restants</span></div>
          </div>
          <div className="w-full bg-purple-900/40 rounded-full h-2 mb-3">
            <div className="h-2 rounded-full" style={{ width: `${defiProgress}%`, backgroundColor: '#a78bfa' }} />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-purple-300 text-sm">{Math.min(3, profil.simulateurs_utilises.length)} / 3 simulateurs</span>
            <span className="text-xs px-2 py-1 rounded-full bg-purple-800/50 text-purple-300">+30 pts + badge Explorateur complet</span>
          </div>
        </div>

        {/* S4 — Badges */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Mes badges</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {BADGES_META.map(b => {
              const unlocked = profil.badges.includes(b.id);
              const I = b.icon;
              return (
                <div key={b.id} className={`p-4 rounded-xl border ${unlocked ? 'border-[#166534] bg-[#052e16]' : 'border-white/10 bg-white/[0.03] opacity-50'}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${unlocked ? 'bg-[#4ade80]/20' : 'bg-white/10'}`}>
                      {unlocked ? <I className="w-5 h-5 text-[#4ade80]" /> : <Lock className="w-4 h-4 text-white/40" />}
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{b.label}</div>
                      <div className="text-[#94a3b8] text-xs mt-0.5">{b.desc}</div>
                      <div className={`text-xs mt-1 ${unlocked ? 'text-[#4ade80]' : 'text-white/30'}`}>+{b.pts} pts</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* S5 — Outils */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Outils utilisés</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {SIMS_META.map(s => {
              const used = profil.simulateurs_utilises.includes(s.id);
              const I = s.icon;
              return (
                <div key={s.id} className="p-4 rounded-xl border border-white/10" style={{ backgroundColor: '#1a1d2d' }}>
                  <div className="flex items-center justify-between mb-2">
                    <I className={`w-5 h-5 ${used ? 'text-[#4ade80]' : 'text-white/20'}`} />
                    <span className={`text-xs font-semibold ${used ? 'text-[#4ade80]' : 'text-white/20'}`}>{used ? '+20 pts' : '0 pt'}</span>
                  </div>
                  <div className={`text-sm font-medium mb-2 ${used ? 'text-white' : 'text-white/40'}`}>{s.label}</div>
                  {used ? <span className="text-[#4ade80] text-xs">✓ Utilisé</span> : <Link href={s.href} className="text-[#4ade80] text-xs hover:underline">Essayer →</Link>}
                </div>
              );
            })}
          </div>
        </div>

        {/* S6 — Historique */}
        {profil.historique.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Historique</h2>
            <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ backgroundColor: '#1a1d2d' }}>
              {profil.historique.map((e, i) => (
                <div key={i} className={`flex items-center justify-between px-4 py-3 ${i < profil.historique.length - 1 ? 'border-b border-white/5' : ''}`}>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-[#4ade80] flex-shrink-0" />
                    <div>
                      <div className="text-white text-sm">{ACTION_LABELS[e.action] ?? e.action}</div>
                      {e.details?.simulateur && <div className="text-[#94a3b8] text-xs">{e.details.simulateur}</div>}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[#94a3b8] text-xs">{fmt(e.date)}</span>
                    <span className="text-[#4ade80] text-sm font-semibold">+{e.points} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* S7 — Partager */}
        <div className="p-6 rounded-2xl border border-white/10" style={{ backgroundColor: '#1a1d2d' }}>
          <h2 className="text-lg font-semibold text-white mb-1">Partager CultureFinance</h2>
          <p className="text-[#94a3b8] text-sm mb-4">+30 pts pour chaque ami qui fait le quiz</p>
          <button onClick={handleShare} className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-full transition-all ${shared ? 'bg-[#4ade80]/20 text-[#4ade80] border border-[#4ade80]/30' : 'bg-[#4ade80] text-black hover:bg-[#4ade80]/90'}`}>
            {shared ? <><CheckCircle className="w-4 h-4" /> Lien copié !</> : <><Share2 className="w-4 h-4" /> Partager le site</>}
          </button>
        </div>

        <p className="text-center text-xs text-white/30 pb-4">
          Les niveaux et badges CultureFinance reflètent uniquement ton parcours d'apprentissage sur notre plateforme. Il ne s'agit pas d'une évaluation ou d'un bilan financier professionnel.
        </p>
      </div>
    </div>
  );
}
