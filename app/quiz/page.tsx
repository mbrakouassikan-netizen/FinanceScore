'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { QuizQuestion } from '@/components/quiz/QuizQuestion';
import { QuizProgress } from '@/components/quiz/QuizProgress';
import { Button } from '@/components/ui/Button';
import { questions } from '@/lib/questions';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ArrowLeft, ArrowRight, Mail, User, CheckCircle } from 'lucide-react';
import { QuizAnswer } from '@/lib/types';

export default function QuizPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [rgpdAccepted, setRgpdAccepted] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; rgpd?: string }>({});

  const currentQuestionData = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleOptionSelect = (optionIndex: number, points: number) => {
    setSelectedOption(optionIndex);
    
    // Auto-advance after 400ms
    setTimeout(() => {
      handleNext();
    }, 400);
  };

  const handleNext = () => {
    if (selectedOption === null) return;

    // Save answer
    const answer: QuizAnswer = {
      questionId: currentQuestionData.id,
      selectedOption,
      points: currentQuestionData.options[selectedOption].points,
    };

    setAnswers([...answers, answer]);
    setSelectedOption(null);

    if (isLastQuestion) {
      setShowEmailCapture(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      // Restore previous selection
      const previousAnswer = answers.find(a => a.questionId === questions[currentQuestion - 1].id);
      setSelectedOption(previousAnswer?.selectedOption || null);
    }
  };

  const validateEmailForm = () => {
    const newErrors: { email?: string; rgpd?: string } = {};

    if (!email || !email.includes('@')) {
      newErrors.email = 'Email invalide';
    }

    if (!rgpdAccepted) {
      newErrors.rgpd = 'Tu dois accepter les conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitEmail = async () => {
    if (!validateEmailForm()) return;

    setIsLoading(true);

    try {
      // Calculate score
      const scoreResponse = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });

      const scoreData = await scoreResponse.json();

      if (scoreData.success) {
        // Save to Google Sheets
        const subscribeData = {
          email,
          name,
          score: scoreData.data.totalScore,
          level: scoreData.data.level.name,
          pillarScores: scoreData.data.pillarScores.map((p: any) => p.score),
        };

        await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subscribeData),
        });

        // Redirect to results
        router.push(`/resultats?score=${scoreData.data.totalScore}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrors({ email: 'Une erreur est survenue, veuillez réessayer' });
    } finally {
      setIsLoading(false);
    }
  };

  if (showEmailCapture) {
    return (
      <div className="min-h-screen bg-bg-primary py-12 px-4">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-bg-card rounded-card p-8"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-accent-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-black" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-text-primary mb-2">
                Où envoyer tes résultats ?
              </h2>
              <p className="text-text-secondary">
                Entre ton email pour recevoir ton score et ton plan d'action personnalisé
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Prénom (optionnel)
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-bg-primary border border-bg-card rounded-card text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-primary"
                    placeholder="Jean"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-bg-primary border rounded-card text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-primary ${
                      errors.email ? 'border-red-500' : 'border-bg-card'
                    }`}
                    placeholder="jean@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rgpdAccepted}
                    onChange={(e) => setRgpdAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 text-accent-primary bg-bg-primary border-bg-card rounded focus:ring-accent-primary"
                  />
                  <span className="text-sm text-text-secondary leading-relaxed">
                    J'accepte de recevoir mon score et des conseils financiers. 
                    Désinscription possible à tout moment. Conforme RGPD.
                  </span>
                </label>
                {errors.rgpd && (
                  <p className="mt-1 text-sm text-red-500">{errors.rgpd}</p>
                )}
              </div>

              <Button
                onClick={handleSubmitEmail}
                disabled={isLoading}
                loading={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? 'Calcul en cours...' : 'Voir mon score maintenant →'}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <QuizProgress
          currentQuestion={currentQuestion}
          totalQuestions={questions.length}
          currentPillar={currentQuestionData.pillar}
          className="mb-8"
        />

        {/* Navigation buttons */}
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={handlePrevious}
            variant="outline"
            size="sm"
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>

          <div className="text-sm text-text-secondary">
            Question {currentQuestion + 1} sur {questions.length}
          </div>

          <Button
            onClick={handleNext}
            size="sm"
            disabled={selectedOption === null}
          >
            Continuer
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <QuizQuestion
              question={currentQuestionData}
              selectedOption={selectedOption}
              onOptionSelect={handleOptionSelect}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
