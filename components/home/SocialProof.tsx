import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { Button } from '../ui/Button';

export const SocialProof: React.FC = () => {
  const [counter, setCounter] = useState(0);
  const targetCount = 2400;

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = targetCount / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetCount) {
        setCounter(targetCount);
        clearInterval(timer);
      } else {
        setCounter(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  const testimonials = [
    {
      name: 'Marie K.',
      role: 'Ingénieure, Paris',
      content: 'Financescore m\'a permis de prendre conscience de mes dépenses et de commencer à épargner sérieusement. En 3 mois, j\'ai déjà économisé 800€ !',
      rating: 5,
    },
    {
      name: 'Ahmed B.',
      role: 'Développeur, Lyon',
      content: 'Le plan d\'action personnalisé est génial. J\'ai enfin ouvert mon PEA et je commence à investir. Les explications sont claires et adaptées à la diaspora.',
      rating: 5,
    },
    {
      name: 'Sophie L.',
      role: 'Consultante, Marseille',
      content: 'Simple, rapide et efficace. Le score m\'a montré exactement où je devais améliorer ma gestion financière. Je recommande vivement !',
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Counter */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-5xl md:text-6xl font-serif font-bold text-accent-primary mb-4">
              {counter.toLocaleString('fr-FR')}+
            </div>
            <p className="text-xl text-text-secondary">
              bilans financiers réalisés
            </p>
          </motion.div>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-bg-card rounded-card p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-accent-primary fill-current" />
                ))}
              </div>
              
              <Quote className="w-8 h-8 text-accent-primary mb-4 opacity-50" />
              
              <p className="text-text-secondary mb-4 leading-relaxed">
                "{testimonial.content}"
              </p>
              
              <div>
                <div className="font-semibold text-text-primary">
                  {testimonial.name}
                </div>
                <div className="text-sm text-text-secondary">
                  {testimonial.role}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button href="/quiz" variant="outline" size="lg">
              Voir mon résultat financier
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
