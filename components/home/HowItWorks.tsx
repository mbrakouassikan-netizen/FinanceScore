import React from 'react';
import { motion } from 'framer-motion';
import { FileQuestion, TrendingUp, Calendar } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: FileQuestion,
      title: 'Réponds aux questions',
      description: '19 questions simples sur tes finances, réparties en 6 piliers essentiels',
      step: '1',
    },
    {
      icon: TrendingUp,
      title: 'Reçois ton score',
      description: 'Obtiens un score sur 100 avec une analyse détaillée de chaque pilier',
      step: '2',
    },
    {
      icon: Calendar,
      title: 'Suis ton plan',
      description: 'Reçois un plan d\'action personnalisé sur 90 jours pour améliorer tes finances',
      step: '3',
    },
  ];

  return (
    <section className="py-20 bg-bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-serif font-bold text-text-primary mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Comment ça marche ?
          </motion.h2>
          <motion.p
            className="text-lg text-text-secondary max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Trois étapes simples pour obtenir une vision claire de ta santé financière
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative mb-8">
                {/* Step number */}
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-accent-primary rounded-full flex items-center justify-center text-black font-bold text-sm">
                  {step.step}
                </div>
                
                {/* Icon circle */}
                <div className="w-20 h-20 bg-bg-primary rounded-full flex items-center justify-center mx-auto border-2 border-accent-primary">
                  <step.icon className="w-10 h-10 text-accent-primary" />
                </div>
              </div>

              <h3 className="text-xl font-semibold text-text-primary mb-3">
                {step.title}
              </h3>
              <p className="text-text-secondary leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
