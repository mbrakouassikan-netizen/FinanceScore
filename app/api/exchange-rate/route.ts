import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const base = searchParams.get('base') || 'EUR';

  const apiKey = process.env.EXCHANGERATE_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'EXCHANGERATE_API_KEY not configured' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${base}`,
      { next: { revalidate: 3600 } }
    );
    const data = await response.json();

    if (data.result === 'error') {
      return NextResponse.json(
        { error: data['error-type'] },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch exchange rates' },
      { status: 500 }
    );
  }
}
