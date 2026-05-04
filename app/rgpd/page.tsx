import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function RGPDPage() {
  return (
    <div className="min-h-screen bg-bg-primary py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-accent-primary bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-accent-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-text-primary mb-6">
            Politique de Confidentialité
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Ta vie privée est notre priorité. Voici comment nous protégeons tes données.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Introduction */}
          <motion.div
            className="bg-bg-card rounded-card p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-2xl font-serif font-bold text-text-primary mb-4">
              Notre engagement
            </h2>
            <p className="text-text-secondary leading-relaxed">
              Chez FinanceScore, nous nous engageons à protéger tes informations personnelles. 
              Cette politique explique quelles données nous collectons, pourquoi nous les collectons, 
              et comment nous les utilisons, conformément au RGPD et à la législation française.
            </p>
          </motion.div>

          {/* Data Collection */}
          <motion.div
            className="bg-bg-card rounded-card p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-accent-primary bg-opacity-20 rounded-full flex items-center justify-center">
                <Eye className="w-6 h-6 text-accent-primary" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-text-primary">
                Données collectées
              </h2>
            </div>
            
            <div className="space-y-4 text-text-secondary">
              <div>
                <h3 className="font-semibold text-text-primary mb-2">Données personnelles</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Adresse email (pour recevoir tes résultats)</li>
                  <li>Prénom (optionnel, pour personnaliser ton expérience)</li>
                  <li>Réponses au questionnaire financier</li>
                  <li>Score financier et résultats associés</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-text-primary mb-2">Données techniques</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Adresse IP (anonymisée)</li>
                  <li>Type de navigateur et appareil</li>
                  <li>Données d'utilisation du site</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Data Usage */}
          <motion.div
            className="bg-bg-card rounded-card p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-accent-primary bg-opacity-20 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-accent-primary" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-text-primary">
                Utilisation des données
              </h2>
            </div>
            
            <div className="space-y-4 text-text-secondary">
              <p>Tes données sont utilisées uniquement pour :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>T'envoyer tes résultats financiers et ton plan d'action personnalisé</li>
                <li>Améliorer nos services et l'algorithme de scoring</li>
                <li>Te contacter avec des conseils financiers pertinents (avec ton consentement)</li>
                <li>Analyser les données anonymisées pour des statistiques globales</li>
              </ul>
            </div>
          </motion.div>

          {/* Data Protection */}
          <motion.div
            className="bg-bg-card rounded-card p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-accent-primary bg-opacity-20 rounded-full flex items-center justify-center">
                <Lock className="w-6 h-6 text-accent-primary" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-text-primary">
                Protection des données
              </h2>
            </div>
            
            <div className="space-y-4 text-text-secondary">
              <p>Nous protégeons tes données grâce à :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Chiffrement SSL/TLS pour toutes les communications</li>
                <li>Serveurs sécurisés hébergés en Europe</li>
                <li>Accès limité aux données personnelles</li>
                <li>Sauvegardes régulières et sécurisées</li>
                <li>Conformité totale au RGPD</li>
              </ul>
            </div>
          </motion.div>

          {/* Rights */}
          <motion.div
            className="bg-bg-card rounded-card p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-2xl font-serif font-bold text-text-primary mb-6">
              Tes droits RGPD
            </h2>
            
            <div className="space-y-6 text-text-secondary">
              <div>
                <h3 className="font-semibold text-text-primary mb-2">Droit d'accès</h3>
                <p>Tu peux demander une copie de toutes tes données personnelles.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-text-primary mb-2">Droit de rectification</h3>
                <p>Tu peux demander la correction de tes données inexactes.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-text-primary mb-2">Droit à l'effacement</h3>
                <p>Tu peux demander la suppression de tes données personnelles.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-text-primary mb-2">Droit à la portabilité</h3>
                <p>Tu peux récupérer tes données dans un format lisible.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-text-primary mb-2">Droit d'opposition</h3>
                <p>Tu peux t'opposer au traitement de tes données.</p>
              </div>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            className="bg-bg-card rounded-card p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className="text-2xl font-serif font-bold text-text-primary mb-6">
              Nous contacter
            </h2>
            
            <div className="text-text-secondary space-y-4">
              <p>
                Pour exercer tes droits ou poser des questions sur cette politique, 
                contacte-nous à :
              </p>
              <div className="bg-bg-primary rounded-card p-4">
                <p className="font-mono text-accent-primary">contact@financescore.fr</p>
              </div>
              <p>
                Nous répondrons à ta demande dans un délai de 30 jours maximum.
              </p>
            </div>
          </motion.div>

          {/* Updates */}
          <motion.div
            className="bg-bg-card rounded-card p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <h2 className="text-2xl font-serif font-bold text-text-primary mb-4">
              Mises à jour
            </h2>
            
            <p className="text-text-secondary">
              Cette politique peut être mise à jour pour refléter les changements 
              dans nos pratiques ou pour des raisons réglementaires. 
              Toute modification sera publiée sur cette page avec la date de mise à jour.
            </p>
            
            <p className="text-sm text-text-secondary mt-4">
              Dernière mise à jour : 1er janvier 2025
            </p>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Button href="/quiz" size="lg">
            Faire mon bilan en toute confiance
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
