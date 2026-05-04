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
      </div>
    </div>
  );
}
