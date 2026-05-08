export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-serif font-bold text-accent-primary mb-6">
            FinanceScore
          </h1>
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            Découvre ton score de santé financière sur 100 et reçois un plan d'action personnalisé
          </p>
          <a 
            href="/quiz" 
            className="inline-flex items-center px-8 py-4 bg-accent-primary text-black font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Démarrer mon bilan
          </a>
        </div>
        
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-serif font-bold text-text-primary mb-8">
            Comment ça marche ?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-bg-card rounded-lg p-6">
              <div className="text-2xl font-bold text-accent-primary mb-4">1</div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Réponds au quiz</h3>
              <p className="text-text-secondary">19 questions sur ta situation financière</p>
            </div>
            <div className="bg-bg-card rounded-lg p-6">
              <div className="text-2xl font-bold text-accent-primary mb-4">2</div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Découvre ton score</h3>
              <p className="text-text-secondary">Analyse personnalisée de ta santé financière</p>
            </div>
            <div className="bg-bg-card rounded-lg p-6">
              <div className="text-2xl font-bold text-accent-primary mb-4">3</div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Plan d'action</h3>
              <p className="text-text-secondary">Étapes concrètes pour améliorer tes finances</p>
            </div>
          </div>
        </div>

        {/* Section ressources officielles */}
        <div className="mt-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-bold text-text-primary mb-4">
                Ressources officielles gratuites
              </h2>
              <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
                Accède à des services publics officiels pour améliorer ta situation financière. 
                Aucune recommandation commerciale.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Surendettement */}
              <div className="bg-bg-card rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-red-600 font-bold">!</span>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary">Surendettement</h3>
                </div>
                <p className="text-text-secondary mb-4">
                  Procédure gratuite par la Banque de France pour geler les poursuites et rééchelonner tes dettes.
                </p>
                <a 
                  href="https://www.banque-france.fr/fr/a-votre-service/particuliers/dossier-surendettement"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Accéder
                </a>
              </div>

              {/* Aides sociales */}
              <div className="bg-bg-card rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold">€</span>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary">Aides sociales</h3>
                </div>
                <p className="text-text-secondary mb-4">
                  Simule gratuitement tes droits à plus de 58 aides (RSA, APL, allocations...).
                </p>
                <a 
                  href="https://www.mesdroitssociaux.gouv.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Simuler
                </a>
              </div>

              {/* Service Public */}
              <div className="bg-bg-card rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 font-bold">📋</span>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary">Service Public</h3>
                </div>
                <p className="text-text-secondary mb-4">
                  Guides officiels pour toutes les démarches administratives et aides disponibles.
                </p>
                <a 
                  href="https://www.service-public.gouv.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Consulter
                </a>
              </div>

              {/* Banque de France */}
              <div className="bg-bg-card rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 font-bold">🏦</span>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary">Banque de France</h3>
                </div>
                <p className="text-text-secondary mb-4">
                  Guides pratiques pour mieux gérer ton budget et comprendre l'épargne.
                </p>
                <a 
                  href="https://particuliers.banque-france.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Explorer
                </a>
              </div>
            </div>

            <div className="text-center mt-8">
              <p className="text-sm text-text-secondary">
                <strong>Note :</strong> Ces ressources sont gratuites et proposées par les services publics. 
                FinanceScore ne perçoit aucune commission.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
