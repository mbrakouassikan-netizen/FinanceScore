'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Heart, Target, Users, Shield, ArrowRight, Play, Star, TrendingUp } from 'lucide-react';
import { FadeUpSection } from '@/components/ui/FadeUpSection';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function AProposPage() {
  const { trackQuizStarted } = useAnalytics();

  return (
    <div className="min-h-screen bg-bg-primary py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <FadeUpSection delay={0} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-text-primary mb-6">
            À propos de FinanceScore
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            L'outil de bilan financier gratuit conçu pour la diaspora africaine en Europe
          </p>
        </FadeUpSection>

        {/* Story du créateur */}
        <FadeUpSection delay={0.1} className="bg-bg-card rounded-card p-8 mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-accent-primary bg-opacity-20 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-accent-primary" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-text-primary">L'histoire derrière FinanceScore</h2>
          </div>
          
          <div className="text-text-secondary space-y-4 leading-relaxed">
            <p>
              Passionné d'éducation financière depuis toujours, j'ai créé FinanceScore après avoir constaté un besoin crucial 
              au sein de notre communauté. En tant que créateur de contenu sur TikTok, je partage quotidiennement des conseils 
              financiers adaptés à la diaspora africaine en Europe.
            </p>
            <p>
              Mon parcours personnel m'a fait prendre conscience des défis spécifiques que nous rencontrons : 
              comment gérer ses finances entre deux continents, comment économiser sur les transferts d'argent, 
              comment investir intelligemment tout en soutenant sa famille au pays...
            </p>
            <p>
              FinanceScore est né de cette volonté d'offrir un outil concret, gratuit et adapté à notre réalité. 
              Parce que chaque euro compte et que chaque décision financière mérite d'être éclairée.
            </p>
          </div>
        </FadeUpSection>

        {/* Mission Transfair */}
        <FadeUpSection delay={0.2} className="bg-bg-card rounded-card p-8 mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-accent-primary bg-opacity-20 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-accent-primary" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-text-primary">La mission de Transfair</h2>
          </div>
          
          <div className="text-text-secondary space-y-4 leading-relaxed">
            <p>
              Transfair a une mission claire : aider la diaspora africaine à mieux gérer ses finances et à optimiser 
              ses transferts d'argent. Nous savons que chaque euro envoyé au pays représente un sacrifice, 
              et nous voulons t'aider à en maximiser l'impact.
            </p>
            <p>
              Notre approche est basée sur trois piliers :
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-accent-primary bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-accent-primary" />
                </div>
                <h3 className="font-semibold text-text-primary mb-2">Éducation</h3>
                <p className="text-sm text-text-secondary">
                  Des conseils financiers adaptés à notre réalité
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent-primary bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-accent-primary" />
                </div>
                <h3 className="font-semibold text-text-primary mb-2">Optimisation</h3>
                <p className="text-sm text-text-secondary">
                  Économiser sur les frais de transfert et les changes
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent-primary bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-accent-primary" />
                </div>
                <h3 className="font-semibold text-text-primary mb-2">Communauté</h3>
                <p className="text-sm text-text-secondary">
                  Un espace d'entraide et de partage d'expériences
                </p>
              </div>
            </div>
          </div>
        </FadeUpSection>

        {/* Values */}
        <FadeUpSection delay={0.3} className="mb-12">
          <h2 className="text-2xl font-serif font-bold text-text-primary text-center mb-8">
            Nos valeurs
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-bg-card rounded-card p-6 text-center">
              <div className="w-12 h-12 bg-accent-primary bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-accent-primary" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-3">Bienveillance</h3>
              <p className="text-text-secondary text-sm">
                Pas de jugement, seulement des conseils constructifs pour t'aider à progresser
              </p>
            </div>

            <div className="bg-bg-card rounded-card p-6 text-center">
              <div className="w-12 h-12 bg-accent-primary bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-accent-primary" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-3">Inclusion</h3>
              <p className="text-text-secondary text-sm">
                Conçu pour et par la diaspora, avec une compréhension profonde de nos enjeux
              </p>
            </div>

            <div className="bg-bg-card rounded-card p-6 text-center">
              <div className="w-12 h-12 bg-accent-primary bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-accent-primary" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-3">Confiance</h3>
              <p className="text-text-secondary text-sm">
                Tes données sont protégées et confidentielles. Nous respectons ta vie privée.
              </p>
            </div>
          </div>
        </FadeUpSection>

        {/* Stats */}
        <FadeUpSection delay={0.4} className="text-center mb-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-accent-primary mb-2">2400+</div>
              <div className="text-text-secondary">bilans réalisés</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent-primary mb-2">4.8/5</div>
              <div className="text-text-secondary">note moyenne</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent-primary mb-2">95%</div>
              <div className="text-text-secondary">de recommandation</div>
            </div>
          </div>
        </FadeUpSection>

        {/* CTA */}
        <FadeUpSection delay={0.5} className="text-center">
          <h2 className="text-2xl font-serif font-bold text-text-primary mb-4">
            Prêt à découvrir ton score financier ?
          </h2>
          <p className="text-text-secondary mb-8">
            Rejoins les milliers de personnes qui ont déjà pris le contrôle de leurs finances.
          </p>
          
          <Button 
            href="/quiz" 
            size="lg"
            onClick={trackQuizStarted}
          >
            Fais ton bilan financier gratuit
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </FadeUpSection>
      </div>
    </div>
  );
}
