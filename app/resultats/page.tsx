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
    const timer = setTimeout(async () => {
      // Générer des réponses de test pour le score spécifié
      // en respectant la structure réelle des questions et leurs maximaux
      const mockAnswers: QuizAnswer[] = [];
      const targetScore = Math.min(score, 100); // Limiter à 100
      
      // Obtenir les maximaux par pilier pour distribuer correctement
      const { questions } = await import('@/lib/questions');
      const pillarMaxScores = {
        "Revenus & Dépenses": 20,
        "Épargne": 20,
        "Dettes": 20,
        "Diaspora & Famille": 15,
        "Investissement": 15,
        "Vision & Objectifs": 10,
      };
      
      // Calculer le ratio de score à atteindre
      const totalMaxScore = Object.values(pillarMaxScores).reduce((sum, max) => sum + max, 0);
      const scoreRatio = targetScore / totalMaxScore;
      
      // Distribuer les points par pilier en respectant leurs maximaux
      const pillarTargetScores: Record<string, number> = {};
      Object.entries(pillarMaxScores).forEach(([pillar, maxScore]) => {
        pillarTargetScores[pillar] = Math.round(maxScore * scoreRatio);
      });
      
      // Générer les réponses pour chaque question
      questions.forEach((question) => {
        const pillarMax = pillarMaxScores[question.pillar as keyof typeof pillarMaxScores];
        const pillarTarget = pillarTargetScores[question.pillar];
        
        // Compter combien de questions dans ce pilier
        const pillarQuestions = questions.filter(q => q.pillar === question.pillar);
        const questionIndex = pillarQuestions.findIndex(q => q.id === question.id);
        const totalPillarQuestions = pillarQuestions.length;
        
        // Distribuer les points de ce pilier sur ses questions
        const pointsPerPillarQuestion = Math.floor(pillarTarget / totalPillarQuestions);
        const remainder = pillarTarget % totalPillarQuestions;
        
        const points = pointsPerPillarQuestion + (questionIndex < remainder ? 1 : 0);
        
        mockAnswers.push({
          questionId: question.id,
          selectedOption: 0,
          points: Math.min(points, pillarMax), // Ne jamais dépasser le max de cette question
        });
      });
      
      const result = calculateScore(mockAnswers);
      setScoreResult(result);
      
      // Envoyer l'email avec le score via Brevo
      // Priorité: email parameter > name parameter (si contient @)
      const userEmail = email || (name.includes('@') ? name : '');
      if (userEmail) {
        const userPrenom = name.includes('@') ? name.split('@')[0] : name;
        
        // Utiliser les vrais scores de piliers calculés par calculateScore
        // pour garantir la cohérence entre l'affichage et l'email
        const pillarScores = {
          p1: result.pillarScores.find(p => p.name === 'Revenus & Dépenses')?.score || 0,
          p2: result.pillarScores.find(p => p.name === 'Épargne')?.score || 0,
          p3: result.pillarScores.find(p => p.name === 'Dettes')?.score || 0,
          p4: result.pillarScores.find(p => p.name === 'Diaspora & Famille')?.score || 0,
          p5: result.pillarScores.find(p => p.name === 'Investissement')?.score || 0,
          p6: result.pillarScores.find(p => p.name === 'Vision & Objectifs')?.score || 0,
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
