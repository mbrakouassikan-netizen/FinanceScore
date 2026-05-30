'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ScoreHeader } from '@/components/results/ScoreHeader';
import { PillarGrid } from '@/components/results/PillarGrid';
import { StrengthsWeaknesses } from '@/components/results/StrengthsWeaknesses';
import { ActionPlan } from '@/components/results/ActionPlan';
import { PremiumCTA } from '@/components/results/PremiumCTA';
import OfficialResources from '@/components/results/OfficialResources';
import { calculateScore } from '@/lib/scoring';
import { ScoreResult, QuizAnswer, PillarScore, ScoreLevel } from '@/lib/types';
import { Share2, Copy, RotateCcw, MessageCircle, CheckCircle, Info, ExternalLink } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { sendBrevoEmail } from '@/lib/brevo';

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { trackResultsViewed, trackPremiumCTAClicked, trackScoreShared } = useAnalytics();

  // Parsing sécurisé du score avec guards et validation
  const getScoreFromUrl = (): number => {
    const scoreParam = searchParams.get('score');
    if (!scoreParam) return 0;
    
    const parsed = parseInt(scoreParam, 10);
    if (isNaN(parsed)) return 0;
    if (parsed < 0) return 0;
    if (parsed > 100) return 100;
    
    return parsed;
  };

  const scoreFromUrl = getScoreFromUrl();
  const name = searchParams.get('name') || '';
  const email = searchParams.get('email') || '';

  useEffect(() => {
    setUserName(name);
    
    // Sauvegarder le score dans Upstash Redis dès le chargement
    if (scoreFromUrl > 0 && email) {
      const userEmail = email || (name.includes('@') ? name : '');
      if (userEmail) {
        fetch("/api/save-score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userEmail,
            score: scoreFromUrl,
          }),
        }).then(saveResponse => {
          if (saveResponse.ok) {
            console.log('✅ Score sauvegardé dans Upstash Redis au chargement');
            
            // Envoyer email de bienvenue (template #3)
            sendBrevoEmail({
              templateId: 3,
              to: { email: userEmail, name: name },
              params: {
                SCORE: scoreFromUrl,
                NIVEAU: scoreFromUrl >= 80 ? 'Expert' : scoreFromUrl >= 60 ? 'Avancé' : scoreFromUrl >= 40 ? 'Intermédiaire' : 'Débutant',
              }
            }).then(() => {
              console.log('✅ Email de bienvenue envoyé');
            }).catch(err => {
              console.error('❌ Erreur envoi email bienvenue:', err);
            });
          } else {
            console.error('❌ Erreur sauvegarde score Upstash Redis:', saveResponse.status);
          }
        }).catch(error => console.error("Erreur sauvegarde score Upstash Redis:", error));
      }
    }
    
    // Générer un résultat basé sur le score réel sans mockAnswers
    const timer = setTimeout(() => {
      // Créer un résultat de score direct et cohérent
      const generateScoreResult = (score: number): ScoreResult => {
        // Calculer les scores de piliers proportionnellement au score total
        const pillarScores: PillarScore[] = [
          { name: 'Revenus & Dépenses', score: Math.min(Math.round((score / 100) * 20), 20), maxScore: 20, percentage: (Math.min(Math.round((score / 100) * 20), 20) / 20) * 100 },
          { name: 'Épargne', score: Math.min(Math.round((score / 100) * 20), 20), maxScore: 20, percentage: (Math.min(Math.round((score / 100) * 20), 20) / 20) * 100 },
          { name: 'Dettes', score: Math.min(Math.round((score / 100) * 20), 20), maxScore: 20, percentage: (Math.min(Math.round((score / 100) * 20), 20) / 20) * 100 },
          { name: 'Diaspora & Famille', score: Math.min(Math.round((score / 100) * 15), 15), maxScore: 15, percentage: (Math.min(Math.round((score / 100) * 15), 15) / 15) * 100 },
          { name: 'Investissement', score: Math.min(Math.round((score / 100) * 15), 15), maxScore: 15, percentage: (Math.min(Math.round((score / 100) * 15), 15) / 15) * 100 },
          { name: 'Vision & Objectifs', score: Math.min(Math.round((score / 100) * 10), 10), maxScore: 10, percentage: (Math.min(Math.round((score / 100) * 10), 10) / 10) * 100 }
        ];

        // Déterminer le niveau selon le score
        let level: ScoreLevel = { name: 'Débutant', description: 'Commence ton voyage financier', color: 'red', emoji: '🌱' };
        if (score >= 80) {
          level = { name: 'Expert', description: 'Maîtrise totale de tes finances', color: 'green', emoji: '🏆' };
        } else if (score >= 60) {
          level = { name: 'Avancé', description: 'Bonnes bases financières', color: 'blue', emoji: '📈' };
        } else if (score >= 40) {
          level = { name: 'Intermédiaire', description: 'En progression', color: 'orange', emoji: '🚀' };
        }

        return {
          totalScore: score,
          percentage: score,
          level,
          pillarScores
        };
      };

      const result = generateScoreResult(scoreFromUrl);
      setScoreResult(result);
      
      // Track results viewed (uniquement si le score est valide)
      if (scoreFromUrl > 0) {
        trackResultsViewed(scoreFromUrl, result.level.name);
      }
      
      // Envoyer l'email avec le score via Brevo (une seule fois)
      if (!emailSent && scoreFromUrl > 0) {
        // Priorité: email parameter > name parameter (si contient @)
        const userEmail = email || (name.includes('@') ? name : '');
        if (userEmail) {
          const userPrenom = name.includes('@') ? name.split('@')[0] : name;
          
          // Utiliser les scores de piliers calculés
          const pillarScores = result.pillarScores;
          
          fetch("/api/send-score", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: userEmail,
              prenom: userPrenom,
              score: scoreFromUrl,
              p1: pillarScores[0]?.score || 0,
              p2: pillarScores[1]?.score || 0,
              p3: pillarScores[2]?.score || 0,
              p4: pillarScores[3]?.score || 0,
              p5: pillarScores[4]?.score || 0,
              p6: pillarScores[5]?.score || 0,
            }),
          }).then(response => {
            if (response.ok) {
              console.log('✅ Email de score envoyé à:', userEmail, 'avec score:', scoreFromUrl);
              setEmailSent(true);
              
              // Valider le code de parrainage si présent
              const refCode = localStorage.getItem('cf_ref');
              if (refCode) {
                fetch('/api/referral/validate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    email: userEmail,
                    refCode: refCode
                  })
                }).then(refResponse => {
                  if (refResponse.ok) {
                    console.log('✅ Parrainage validé pour', userEmail);
                  } else {
                    console.log('⚠️ Erreur validation parrainage:', refResponse.status);
                  }
                }).catch(err => {
                  console.error('❌ Erreur validation parrainage:', err);
                }).finally(() => {
                  localStorage.removeItem('cf_ref');
                });
              }
            } else {
              console.error('❌ Erreur envoi email:', response.status);
            }
          }).catch(error => console.error("Erreur envoi email:", error));
        } else {
          console.warn('⚠️ Aucun email trouvé pour envoyer le score');
        }
      }
    }, 500); // Réduit à 500ms pour meilleure UX

    return () => clearTimeout(timer);
  }, [scoreFromUrl, name, email, emailSent]);

  const handleShareWhatsApp = () => {
    const level = scoreResult?.level?.name || 'Inconnu';
    const message = `J'ai fait le test FinanceScore et j'ai obtenu ${scoreFromUrl}/100 ! Niveau : ${level}. Découvre ton score → ${process.env.NEXT_PUBLIC_SITE_URL}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    
    // Track WhatsApp share
    trackScoreShared('whatsapp');
    
    window.open(whatsappUrl, '_blank');
  };

  const handleCopyLink = () => {
    const level = scoreResult?.level?.name || 'Inconnu';
    const message = `J'ai fait le test FinanceScore et j'ai obtenu ${scoreFromUrl}/100 ! Niveau : ${level}. Découvre ton score → ${process.env.NEXT_PUBLIC_SITE_URL}`;
    
    // Track copy share
    trackScoreShared('copy');
    
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRetakeTest = () => {
    router.push('/quiz');
  };

  return (
    <div className="min-h-screen bg-bg-primary py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Afficher les ressources officielles immédiatement avec le score de l'URL */}
        {(() => {
          console.log('Score passé à OfficialResources:', scoreFromUrl, 'Type:', typeof scoreFromUrl);
          return null;
        })()}
        {!scoreResult ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl text-text-secondary">Analyse de tes résultats...</p>
          </div>
        ) : (
          <>
            <ScoreHeader scoreResult={scoreResult} userName={userName} />
            <PillarGrid scoreResult={scoreResult} />
            <StrengthsWeaknesses scoreResult={scoreResult} />
            <ActionPlan scoreResult={scoreResult} />
            <OfficialResources score={scoreFromUrl} />
            <PremiumCTA score={scoreFromUrl} />

            {/* Share Section */}
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-serif font-bold text-text-primary mb-6">
                Partage tes résultats
              </h2>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={handleShareWhatsApp}
                  className="flex items-center gap-2 px-6 py-3 bg-[#4ade80] text-[#052e16] font-semibold rounded-full hover:bg-[#4ade80]/90 transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  Partager sur WhatsApp
                </button>

                <button
                  onClick={handleCopyLink}
                  className={`flex items-center gap-2 px-6 py-3 border font-semibold rounded-full transition-all ${
                    copied ? 'bg-[#4ade80] text-[#052e16] border-[#4ade80]' : 'border-[#4ade80] text-[#4ade80] bg-transparent hover:bg-[#4ade80]/10'
                  }`}
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Copié !
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Copier le message
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Retake Test Button */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <button
                onClick={handleRetakeTest}
                className="flex items-center gap-2 px-6 py-3 border border-[#334155] text-[#94a3b8] bg-transparent font-medium rounded-full hover:bg-white/5 transition-all mx-auto"
              >
                <RotateCcw className="w-5 h-5" />
                Refaire le test
              </button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bg-primary py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl text-text-secondary">Chargement...</p>
          </div>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
