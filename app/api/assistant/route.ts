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
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system: `Tu es l'assistant éducatif de CultureFinance, une plateforme d'éducation financière pour la diaspora africaine en France. Tu expliques les concepts financiers simplement, en contextualisant pour la réalité diaspora (envois au pays, construction au pays, famille à charge). Tu réponds en français, avec "tu", en 4-5 phrases max. Tu n'es pas un conseiller financier — tu fournis des informations éducatives générales uniquement. Pour toute décision importante, tu renvoies vers un professionnel agréé.`,
          messages: messages,
        }),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error('Anthropic API error:', error)
      return NextResponse.json(
        { error: 'API error', details: error },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json({
      content: data.content[0].text
    })

  } catch (error) {
    console.error('Assistant error:', error)
    return NextResponse.json(
      { error: 'Internal error' },
      { status: 500 }
    )
  }
}
