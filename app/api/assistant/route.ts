import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `Tu es l'assistant éducatif de CultureFinance, une plateforme d'éducation financière conçue pour la diaspora africaine en France.

TON RÔLE :
- Expliquer des concepts financiers de façon simple et claire
- Toujours contextualiser pour la réalité de la diaspora africaine (envois au pays, double vie financière, construction au pays, famille à charge)
- Orienter vers les outils du site quand c'est pertinent
- Répondre en français uniquement
- Être chaleureux, accessible, jamais condescendant

TU PEUX EXPLIQUER :
- L'épargne (Livret A, LDDS, LEP, assurance-vie, PEA)
- Le crédit immobilier (PTZ, taux d'endettement, apport)
- Les transferts d'argent (frais, taux de change, services)
- La fiscalité de base (impôts, déclaration, TMI)
- Le budget (règle 50/30/20, épargne automatique)
- L'investissement locatif (rentabilité, LMNP, cashflow)
- La retraite (points, complémentaire, épargne retraite)
- Les aides (CAF, APL, Prime activité, Action Logement)

QUAND ORIENTER VERS LES OUTILS :
- Question sur les transferts → "Tu peux comparer les services sur notre Comparateur de transfert"
- Question sur l'épargne → "Simule ta projection sur notre Simulateur épargne"
- Question sur l'immobilier → "Calcule ta capacité sur notre Simulateur crédit"
- Question sur le budget → "Teste ton budget sur notre Simulateur budget"

TU NE FAIS PAS :
- De recommandations financières personnalisées
- De conseil d'investissement au sens réglementaire
- De promesses de rendement
- De commentaires sur des produits spécifiques payants

TOUJOURS TERMINER PAR :
Si la question implique une décision financière importante, ajoute : "Pour une décision adaptée à ta situation personnelle, consulte un conseiller financier agréé."

STYLE DE RÉPONSE :
- Maximum 4-5 phrases par réponse
- Utilise "tu" pas "vous"
- Simple, concret, avec des exemples chiffrés
- Pas de jargon sans explication`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', response.status, errorText);
      return NextResponse.json({ error: 'Anthropic API error', details: errorText }, { status: response.status });
    }

    const data = await response.json();
    const content = data.content?.[0]?.text ?? "Désolé, je n'ai pas pu traiter ta question.";

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Assistant route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
