'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';

export default function MerciPage() {
  return (
    <div className="min-h-screen bg-bg-primary py-12 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Success Icon */}
          <div className="w-20 h-20 bg-accent-primary bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-10 h-10 text-accent-primary" />
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-text-primary mb-6">
            Merci !
          </h1>

          {/* Message */}
          <div className="text-lg text-text-secondary mb-8 space-y-4">
            <p>
              Ton bilan financier a bien été envoyé à ton adresse email.
            </p>
            <p>
              Tu y trouveras ton score détaillé, ton guide personnalisé et des ressources éducatives exclusives pour améliorer ta situation financière.
            </p>
          </div>

          {/* Email Icon */}
          <div className="w-16 h-16 bg-bg-card rounded-full flex items-center justify-center mx-auto mb-8">
            <Mail className="w-8 h-8 text-accent-primary" />
          </div>

          {/* Info Box */}
          <motion.div
            className="bg-bg-card rounded-card p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Prochaines étapes
            </h2>
            <div className="text-left space-y-3 text-text-secondary">
              <div className="flex items-start gap-3">
                <span className="text-accent-primary mt-1">1.</span>
                <span>Consulte ton email dès maintenant pour découvrir tes résultats</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-accent-primary mt-1">2.</span>
                <span>Suis les premières étapes de ton plan d'action 90 jours</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-accent-primary mt-1">3.</span>
                <span>Reviens faire le test dans 3 mois pour mesurer tes progrès</span>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/" variant="outline" size="lg">
              Retour à l'accueil
            </Button>
            <Button href="/quiz" size="lg">
              Refaire le test
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Note */}
          <motion.p
            className="text-sm text-text-secondary mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Si tu ne reçois pas l'email dans les 5 minutes, vérifie tes spams.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
