import React, { useState } from 'react';
import { Crown, Star, CheckCircle, ExternalLink, Loader } from 'lucide-react';
import { Button } from '../ui/Button';
import { FadeUpSection } from '../ui/FadeUpSection';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useSearchParams } from 'next/navigation';

interface PremiumCTAProps {
  score?: number;
}

export const PremiumCTA: React.FC<PremiumCTAProps> = ({ score: propScore }) => {
  const { trackPremiumCTAClicked } = useAnalytics();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string>('');
  
  // Récupérer les infos utilisateur depuis les params ou utiliser la prop
  const userEmail = searchParams.get('email') || '';
  const userName = searchParams.get('name') || '';
  const score = propScore !== undefined ? propScore : parseInt(searchParams.get('score') || '0');
  
  // Vérifier si c'est un retour de paiement réussi
  React.useEffect(() => {
    const isSuccess = searchParams.get('success');
    const purchaserEmail = searchParams.get('purchaser_email');
    const purchaserName = searchParams.get('purchaser_name');
    const paymentScore = searchParams.get('score');
    
    if (isSuccess === 'true' && purchaserEmail) {
      // Le webhook a déjà traité le paiement, afficher message de succès
      console.log('🎉 Paiement réussi pour:', purchaserEmail);
    }
  }, [searchParams]);

  // Créer le lien de paiement Payhip
  const handlePremiumPurchase = async () => {
    // Logique améliorée pour récupérer l'email et le nom
    let finalEmail = userEmail;
    let finalName = userName;
    
    // Si pas d'email dans les params, vérifier si name contient un email
    if (!finalEmail && userName.includes('@')) {
      finalEmail = userName;
      finalName = userName.split('@')[0];
    }
    
    if (!finalEmail || !finalName) {
      console.warn('⚠️ Informations manquantes:', { finalEmail, finalName, userEmail, userName });
      alert('Veuillez vous reconnecter pour accéder à l\'offre Premium');
      return;
    }

    setIsLoading(true);
    trackPremiumCTAClicked();

    try {
      // Construire directement l'URL Payhip avec les paramètres personnalisés
      const payhipUrl = `https://payhip.com/b/53DCE?suggested_price=4.99&custom_score=${score}&custom_email=${encodeURIComponent(finalEmail)}`;
      
      console.log('🔗 URL Payhip générée:', payhipUrl);
      console.log('📊 Score passé:', score);
      console.log('📧 Email passé:', finalEmail);

      // Rediriger directement vers la page de paiement Payhip
      window.location.href = payhipUrl;
    } catch (error) {
      console.error('Erreur création paiement:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const features = [
    'Analyse financière approfondie',
    'Plan d\'action personnalisé mensuel',
    'Suivi des progrès avec graphiques',
    'Conseils d\'experts adaptés à la diaspora',
    'Accès à la communauté privée',
    'Support prioritaire 7j/7',
  ];

  return (
    <FadeUpSection className="bg-gradient-to-br from-accent-primary from-5% to-accent-secondary to-95% rounded-card p-8 md:p-12 text-center mb-12">
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="w-12 h-12 bg-black bg-opacity-20 rounded-full flex items-center justify-center">
          <Crown className="w-6 h-6 text-black" />
        </div>
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-black fill-current" />
          <span className="text-xl font-bold text-black">FinanceScore Premium</span>
        </div>
      </div>

      <h2 className="text-3xl md:text-4xl font-serif font-bold text-black mb-4">
        Va encore plus loin avec le suivi complet
      </h2>

      <p className="text-lg text-black text-opacity-90 mb-8 max-w-2xl mx-auto">
        Transforme ton bilan financier en un véritable plan de développement patrimonial avec notre accompagnement premium
      </p>

      <div className="grid md:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-3 text-left">
            <CheckCircle className="w-5 h-5 text-black flex-shrink-0" />
            <span className="text-black text-opacity-90">{feature}</span>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <div className="inline-flex items-center gap-4 px-6 py-3 bg-black bg-opacity-20 rounded-full">
          <span className="text-2xl font-bold text-black">4,99€</span>
          <span className="text-black text-opacity-90">· accès complet · livraison instantanée</span>
        </div>
      </div>

      <Button
        onClick={handlePremiumPurchase}
        size="lg"
        className="bg-black text-white hover:bg-opacity-90 mb-4"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader className="w-4 h-4 mr-2 animate-spin" />
            Chargement...
          </>
        ) : (
          <>
            Accéder à la version Premium
            <ExternalLink className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>

      <p className="text-sm text-black text-opacity-70">
        Paiement sécurisé par Payhip · Reçu par email en 1min
      </p>
    </FadeUpSection>
  );
};
