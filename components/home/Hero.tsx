import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, BarChart3, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useAnalytics } from '@/hooks/useAnalytics';

export const Hero: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const { trackQuizStarted } = useAnalytics();
  const stats = [
    { icon: CheckCircle, label: '19 questions', value: '19' },
    { icon: BarChart3, label: '6 piliers analysés', value: '6' },
    { icon: Calendar, label: '90j plan d\'action', value: '90j' },
  ];

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-accent-primary bg-opacity-10 text-accent-primary text-sm font-medium mb-6"
          >
            Par Transfair · Éducation Financière
          </motion.div>

          {/* Main title */}
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-text-primary mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Ton bilan financier
            <span className="block text-accent-primary">en 10 minutes</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-text-secondary mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Découvre ton score de santé financière sur 100 et reçois un plan d'action personnalisé — gratuit.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12"
          >
            <motion.div
              animate={!prefersReducedMotion ? {
                scale: [1, 1.05, 1],
              } : {}}
              transition={{
                duration: 0.3,
                repeat: Infinity,
                repeatDelay: 2.7, // Total cycle: 3 seconds (0.3s animation + 2.7s delay)
                ease: "easeInOut"
              }}
            >
              <Button 
              href="/quiz" 
              size="lg" 
              className="group"
              onClick={trackQuizStarted}
            >
                Démarrer mon bilan
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2">
                  <stat.icon className="w-6 h-6 text-accent-primary" />
                </div>
                <div className="text-2xl font-bold text-text-primary">{stat.value}</div>
                <div className="text-sm text-text-secondary">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Note */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-sm text-text-secondary"
          >
            Gratuit · Confidentiel · Résultats immédiats
          </motion.p>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent-primary rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-secondary rounded-full opacity-5 blur-3xl"></div>
      </div>
    </section>
  );
};
