'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ScoreHeader } from '@/components/results/ScoreHeader';
import { PillarGrid } from '@/components/results/PillarGrid';
import { StrengthsWeaknesses } from '@/components/results/StrengthsWeaknesses';
import { ActionPlan } from '@/components/results/ActionPlan';
import { PremiumCTA } from '@/components/results/PremiumCTA';
import { Button } from '@/components/ui/Button';
import { calculateScore } from '@/lib/scoring';
import { ScoreResult, QuizAnswer } from '@/lib/types';
import { Share2, Copy, RotateCcw, MessageCircle, CheckCircle } from 'lucide-react';

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [copied, setCopied] = useState(false);

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
    
    window.open(whatsappUrl, '_blank');
  };

  const handleCopyLink = () => {
    const level = scoreResult?.level?.name || 'Inconnu';
    const message = `J'ai fait le test FinanceScore et j'ai obtenu ${score}/100 ! Niveau : ${level}. Découvre ton score → ${process.env.NEXT_PUBLIC_SITE_URL}`;
    
        
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
