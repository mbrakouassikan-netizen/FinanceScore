import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    const response = await fetch(
      'https://api.anthropic.com/v1/messages',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY!,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5',
          max_tokens: 1024,
          tools: [
            {
              type: 'web_search_20250305',
              name: 'web_search',
              max_uses: 3
            }
          ],
          system: `Tu es l'assistant éducatif de CultureFinance, une plateforme d'éducation financière pour la diaspora africaine en France. Tu expliques les concepts financiers simplement, en contextualisant pour la réalité diaspora (envois au pays, construction au pays, famille à charge). Tu réponds en français, avec "tu", en 4-5 phrases max. Tu n'es pas un conseiller financier — tu fournis des informations éducatives générales uniquement. Pour toute décision importante, tu renvoies vers un professionnel agréé.

TAUX RÉGLEMENTÉS EN VIGUEUR (février 2026) :
- Livret A : 1,5% net — exonéré d'impôt
- LDDS : 1,5% net — exonéré d'impôt
- LEP : 2,5% net — exonéré d'impôt, sous conditions revenus
  (plafond 23 028€ pour 1 personne seule en 2026)
- CEL : 1% brut
- PEL : 1,75% brut

Ces taux sont en vigueur depuis le 1er février 2026. La prochaine révision est prévue en août 2026. Source : economie.gouv.fr et Banque de France. Si un utilisateur pose une question sur les taux, utilise toujours la recherche web pour confirmer les informations les plus récentes.`,
          messages: messages,
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error:', response.status, errorText)
      return NextResponse.json(
        { content: `Erreur API ${response.status}: ${errorText}` },
        { status: 200 }
      )
    }

    const data = await response.json()
    const textContent = data.content
      .filter((block: { type: string }) => block.type === 'text')
      .map((block: { type: string; text: string }) => block.text)
      .join('')

    return NextResponse.json({
      content: textContent
    })

  } catch (error: unknown) {
    const errorMessage = error instanceof Error
      ? error.message
      : 'Erreur inconnue'
    console.error('Assistant error:', errorMessage)
    return NextResponse.json(
      { content: `Erreur technique: ${errorMessage}` },
      { status: 200 }
    )
  }
}
