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
import { Button } from '@/components/ui/Button';
import { calculateScore } from '@/lib/scoring';
import { ScoreResult, QuizAnswer } from '@/lib/types';
import { Share2, Copy, RotateCcw, MessageCircle, CheckCircle, Info, ExternalLink } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const { trackResultsViewed, trackPremiumCTAClicked, trackScoreShared } = useAnalytics();

  const score = parseInt(searchParams.get('score') || '0');
  const name = searchParams.get('name') || '';
  const email = searchParams.get('email') || '';

  useEffect(() => {
    setUserName(name);
    
    // Simulate loading and calculation
    const timer = setTimeout(() => {
      // Create a mock result based on the score
      const mockAnswers: QuizAnswer[] = [];
      let totalPoints = 0;
      
      // Generate mock answers that would result in the given score
      // Calcul plus précis pour éviter l'incohérence
      const targetPoints = Math.round((score / 100) * 100); // Score sur 100 points
      const pointsPerQuestion = Math.floor(targetPoints / 19);
      const remainder = targetPoints % 19;
      
      for (let i = 1; i <= 19; i++) {
        const points = pointsPerQuestion + (i <= remainder ? 1 : 0);
        totalPoints += points;
        mockAnswers.push({
          questionId: i,
          selectedOption: 0,
          points,
        });
      }
      
      const result = calculateScore(mockAnswers);
      setScoreResult(result);
      
      // Track results viewed
      trackResultsViewed(score, result.level.name);
      
      // Envoyer l'email avec le score via Brevo
      // Priorité: email parameter > name parameter (si contient @)
      const userEmail = email || (name.includes('@') ? name : '');
      if (userEmail) {
        const userPrenom = name.includes('@') ? name.split('@')[0] : name;
        
        // Utiliser le vrai score et calculer les scores de piliers proportionnellement
        // pour éviter l'incohérence entre l'affichage et l'email
        const pillarScores = {
          p1: Math.round((score / 100) * 20),  // Revenus & Dépenses (max 20)
          p2: Math.round((score / 100) * 20),  // Épargne (max 20)
          p3: Math.round((score / 100) * 20),  // Dettes (max 20)
          p4: Math.round((score / 100) * 15),  // Diaspora & Famille (max 15)
          p5: Math.round((score / 100) * 15),  // Investissement (max 15)
          p6: Math.round((score / 100) * 10),  // Vision & Objectifs (max 10)
        };
        
        fetch("/api/send-score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userEmail,
            prenom: userPrenom,
            score: score,  // Utiliser le vrai score de l'URL
            p1: pillarScores.p1,
            p2: pillarScores.p2,
            p3: pillarScores.p3,
            p4: pillarScores.p4,
            p5: pillarScores.p5,
            p6: pillarScores.p6,
          }),
        }).then(response => {
          if (response.ok) {
            console.log('✅ Email de score envoyé à:', userEmail, 'avec score:', score);
          } else {
            console.error('❌ Erreur envoi email:', response.status);
          }
        }).catch(error => console.error("Erreur envoi email:", error));
      } else {
        console.warn('⚠️ Aucun email trouvé pour envoyer le score');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [score, name, email]);

  const handleShareWhatsApp = () => {
    const level = scoreResult?.level?.name || 'Inconnu';
    const message = `J'ai fait le test FinanceScore et j'ai obtenu ${score}/100 ! Niveau : ${level}. Découvre ton score → ${process.env.NEXT_PUBLIC_SITE_URL}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    
    // Track WhatsApp share
    trackScoreShared('whatsapp');
    
    window.open(whatsappUrl, '_blank');
  };

  const handleCopyLink = () => {
    const level = scoreResult?.level?.name || 'Inconnu';
    const message = `J'ai fait le test FinanceScore et j'ai obtenu ${score}/100 ! Niveau : ${level}. Découvre ton score → ${process.env.NEXT_PUBLIC_SITE_URL}`;
    
    // Track copy share
    trackScoreShared('copy');
    
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRetakeTest = () => {
    router.push('/quiz');
  };

  if (!scoreResult) {
    return (
      <div className="min-h-screen bg-bg-primary py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl text-text-secondary">Analyse de tes résultats...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <ScoreHeader scoreResult={scoreResult} userName={userName} />
        <PillarGrid scoreResult={scoreResult} />
        <StrengthsWeaknesses scoreResult={scoreResult} />
        <ActionPlan scoreResult={scoreResult} />
        
        {/* Section ressources officielles selon le score de l'URL */}
        <motion.div
          className={`max-w-4xl mx-auto mb-12 p-6 rounded-xl ${
            score <= 39 ? 'bg-red-50 border-red-200' :
            score <= 59 ? 'bg-orange-50 border-orange-200' :
            score <= 79 ? 'bg-blue-50 border-blue-200' :
            'bg-green-50 border-green-200'
          } border`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-serif font-bold text-text-primary mb-2">
              Ressources officielles gratuites
            </h2>
            <p className={`text-sm ${
              score <= 39 ? 'text-red-700' :
              score <= 59 ? 'text-orange-700' :
              score <= 79 ? 'text-blue-700' :
              'text-green-700'
            } flex items-center justify-center gap-2`}>
              <Info className="w-4 h-4" />
              Ressources publiques officielles — aucune recommandation commerciale
            </p>
          </div>

          {/* Onglets et ressources selon le score */}
          <div className="space-y-4">
            {score <= 39 && (
              <>
                {/* Score 0-39 (Urgence) */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  <button 
                    onClick={() => window.open('https://www.banque-france.fr/fr/a-votre-service/particuliers/dossier-surendettement', '_blank')}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                  >
                    Surendettement
                  </button>
                  <button 
                    onClick={() => window.open('https://www.mesdroitssociaux.gouv.fr', '_blank')}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
                  >
                    Aides sociales
                  </button>
                  <button 
                    onClick={() => window.open('https://www.service-public.gouv.fr/particuliers/vosdroits/F134', '_blank')}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
                  >
                    Service Public
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h3 className="font-semibold text-text-primary mb-2">Surendettement</h3>
                    <p className="text-text-secondary text-sm">
                      Procédure gratuite mise en œuvre par la Banque de France. Permet de geler les poursuites et de rééchelonner tes dettes. Accessible à tous les particuliers en difficulté.
                    </p>
                    <button 
                      onClick={() => window.open('https://www.banque-france.fr/fr/a-votre-service/particuliers/dossier-surendettement', '_blank')}
                      className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Site web
                    </button>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h3 className="font-semibold text-text-primary mb-2">Aides sociales</h3>
                    <p className="text-text-secondary text-sm">
                      Simule gratuitement tes droits à plus de 58 aides (RSA, APL, allocations familiales…) en quelques minutes, sans création de compte.
                    </p>
                    <button 
                      onClick={() => window.open('https://www.mesdroitssociaux.gouv.fr', '_blank')}
                      className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Site web
                    </button>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h3 className="font-semibold text-text-primary mb-2">Service Public</h3>
                    <p className="text-text-secondary text-sm">
                      Guide officiel pour déposer un dossier de surendettement : conditions, pièces à fournir, délais.
                    </p>
                    <button 
                      onClick={() => window.open('https://www.service-public.gouv.fr/particuliers/vosdroits/F134', '_blank')}
                      className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Site web
                    </button>
                  </div>
                </div>
              </>
            )}
            
            {score >= 40 && score <= 59 && (
              <>
                {/* Score 40-59 (Fragile) */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  <button 
                    onClick={() => window.open('https://www.mesdroitssociaux.gouv.fr', '_blank')}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                  >
                    Aides sociales
                  </button>
                  <button 
                    onClick={() => window.open('https://www.service-public.gouv.fr/particuliers/vosdroits/R54933', '_blank')}
                    className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg font-medium hover:bg-orange-200 transition-colors"
                  >
                    Aides financières
                  </button>
                  <button 
                    onClick={() => window.open('https://particuliers.banque-france.fr', '_blank')}
                    className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg font-medium hover:bg-orange-200 transition-colors"
                  >
                    Banque de France
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h3 className="font-semibold text-text-primary mb-2">Aides sociales</h3>
                    <p className="text-text-secondary text-sm">
                      Simule gratuitement tes droits à plus de 58 aides (RSA, APL, allocations familiales…) en quelques minutes, sans création de compte.
                    </p>
                    <button 
                      onClick={() => window.open('https://www.mesdroitssociaux.gouv.fr', '_blank')}
                      className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Site web
                    </button>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h3 className="font-semibold text-text-primary mb-2">Aides financières</h3>
                    <p className="text-text-secondary text-sm">
                      Retrouve toutes les aides disponibles selon ta situation : logement, emploi, famille, santé. Guide officiel Service Public.
                    </p>
                    <button 
                      onClick={() => window.open('https://www.service-public.gouv.fr/particuliers/vosdroits/R54933', '_blank')}
                      className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Site web
                    </button>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h3 className="font-semibold text-text-primary mb-2">Banque de France</h3>
                    <p className="text-text-secondary text-sm">
                      Guides pratiques officiels pour mieux gérer ton budget et comprendre les bases de l'épargne et de la gestion financière.
                    </p>
                    <button 
                      onClick={() => window.open('https://particuliers.banque-france.fr', '_blank')}
                      className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Site web
                    </button>
                  </div>
                </div>
              </>
            )}
            
            {score >= 60 && score <= 79 && (
              <>
                {/* Score 60-79 (Progression) */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  <button 
                    onClick={() => window.open('https://www.info-retraite.fr', '_blank')}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                  >
                    Simulateur retraite
                  </button>
                  <button 
                    onClick={() => window.open('https://www.service-public.gouv.fr/particuliers/actualites/A18841', '_blank')}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors"
                  >
                    Plan épargne retraite
                  </button>
                  <button 
                    onClick={() => window.open('https://www.service-public.gouv.fr/particuliers/vosdroits/R54933', '_blank')}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors"
                  >
                    Aides financières
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h3 className="font-semibold text-text-primary mb-2">Simulateur retraite</h3>
                    <p className="text-text-secondary text-sm">
                      Estime gratuitement ton âge de départ à la retraite et le montant de ta pension. Service public officiel, mis à jour en 2026.
                    </p>
                    <button 
                      onClick={() => window.open('https://www.info-retraite.fr', '_blank')}
                      className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Site web
                    </button>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h3 className="font-semibold text-text-primary mb-2">Plan épargne retraite</h3>
                    <p className="text-text-secondary text-sm">
                      Tout comprendre sur le Plan Épargne Retraite (PER) et les nouvelles règles fiscales 2026. Guide officiel Service Public.
                    </p>
                    <button 
                      onClick={() => window.open('https://www.service-public.gouv.fr/particuliers/actualites/A18841', '_blank')}
                      className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Site web
                    </button>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h3 className="font-semibold text-text-primary mb-2">Aides financières</h3>
                    <p className="text-text-secondary text-sm">
                      Retrouve toutes les aides disponibles selon ta situation : logement, emploi, famille, santé.
                    </p>
                    <button 
                      onClick={() => window.open('https://www.service-public.gouv.fr/particuliers/vosdroits/R54933', '_blank')}
                      className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Site web
                    </button>
                  </div>
                </div>
              </>
            )}
            
            {score >= 80 && (
              <>
                {/* Score 80-100 (Solide) */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  <button 
                    onClick={() => window.open('https://www.info-retraite.fr', '_blank')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                  >
                    Simulateur retraite
                  </button>
                  <button 
                    onClick={() => window.open('https://www.economie.gouv.fr/particuliers/preparer-ma-retraite-et-ma-succession', '_blank')}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors"
                  >
                    Succession & héritage
                  </button>
                  <button 
                    onClick={() => window.open('https://www.service-public.gouv.fr/particuliers/actualites/A18841', '_blank')}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors"
                  >
                    Plan épargne retraite
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h3 className="font-semibold text-text-primary mb-2">Simulateur retraite</h3>
                    <p className="text-text-secondary text-sm">
                      Estime gratuitement ton âge de départ à la retraite et le montant de ta pension. Service public officiel, mis à jour en 2026.
                    </p>
                    <button 
                      onClick={() => window.open('https://www.info-retraite.fr', '_blank')}
                      className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Site web
                    </button>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h3 className="font-semibold text-text-primary mb-2">Succession & héritage</h3>
                    <p className="text-text-secondary text-sm">
                      Guide officiel sur la transmission patrimoniale, les droits de succession et les démarches à effectuer. Source : economie.gouv.fr.
                    </p>
                    <button 
                      onClick={() => window.open('https://www.economie.gouv.fr/particuliers/preparer-ma-retraite-et-ma-succession', '_blank')}
                      className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Site web
                    </button>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h3 className="font-semibold text-text-primary mb-2">Plan épargne retraite</h3>
                    <p className="text-text-secondary text-sm">
                      Tout comprendre sur le PER et les nouvelles règles fiscales 2026. Guide officiel Service Public.
                    </p>
                    <button 
                      onClick={() => window.open('https://www.service-public.gouv.fr/particuliers/actualites/A18841', '_blank')}
                      className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Site web
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
        
        <PremiumCTA />

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
            <Button
              onClick={handleShareWhatsApp}
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Partager sur WhatsApp
            </Button>
            
            <Button
              onClick={handleCopyLink}
              variant="outline"
              size="lg"
              className={`flex items-center gap-2 transition-all duration-300 ${
                copied ? 'bg-accent-primary text-black border-accent-primary' : ''
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
            </Button>
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
          <Button
            onClick={handleRetakeTest}
            variant="outline"
            size="lg"
            className="flex items-center gap-2 mx-auto"
          >
            <RotateCcw className="w-5 h-5" />
            Refaire le test
          </Button>
        </motion.div>
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
