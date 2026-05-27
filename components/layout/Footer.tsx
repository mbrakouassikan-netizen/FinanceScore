import React from 'react';

export const Footer: React.FC = () => {
  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Quiz', href: '/quiz' },
    { name: 'À propos', href: '/a-propos' },
    { name: 'RGPD', href: '/rgpd' },
  ];

  return (
    <footer className="bg-bg-primary border-t border-bg-card">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-accent-primary font-serif mb-4">
              FinanceScore
            </h3>
            <p className="text-text-secondary mb-4">
              Ton bilan financier gratuit en 10 minutes. Découvre ton score éducatif sur 100 et reçois ton guide personnalisé.
            </p>
            <p className="text-sm text-text-secondary">
              Par Transfair · Éducation Financière
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-text-primary mb-4">
              Navigation
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-text-secondary hover:text-accent-primary transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-bg-card">
          <p className="text-center text-sm text-text-secondary">
            © 2025 FinanceScore by Transfair · Tous droits réservés
          </p>
        </div>
      </div>
    </footer>
  );
};
