import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

const redis = Redis.fromEnv();

const NIVEAUX = [
  { level: 1, label: 'Explorateur', min: 0 },
  { level: 2, label: 'Curieux', min: 100 },
  { level: 3, label: 'Averti', min: 300 },
  { level: 4, label: 'Engagé', min: 600 },
  { level: 5, label: 'Expert CultureFinance', min: 1000 },
];

function getNiveau(pts: number) {
  for (let i = NIVEAUX.length - 1; i >= 0; i--) {
    if (pts >= NIVEAUX[i].min) return NIVEAUX[i];
  }
  return NIVEAUX[0];
}

function getProchainNiveau(pts: number) {
  return NIVEAUX.find(n => n.min > pts) ?? null;
}

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get('email');
    if (!email) return NextResponse.json({ error: 'email requis' }, { status: 400 });

    const p = `user:${email}`;

    const [pts, badges, sims, hist, nom, vc] = await Promise.all([
      redis.get<number>(`${p}:points`),
      redis.get<string[]>(`${p}:badges`),
      redis.get<string[]>(`${p}:simulateurs`),
      redis.lrange(`${p}:historique`, 0, 9),
      redis.get<string>(`${p}:nom`),
      redis.get<number>(`${p}:visitCount`),
    ]);

    const points = pts ?? 0;
    const niveau = getNiveau(points);
    const prochainNiveau = getProchainNiveau(points);

    const historique = (hist as string[]).map((entry: string) => {
      try { return JSON.parse(entry); } catch { return null; }
    }).filter(Boolean);

    return NextResponse.json({
      success: true,
      nom: nom ?? '',
      email,
      points,
      niveau,
      badges: badges ?? [],
      historique,
      simulateurs_utilises: sims ?? [],
      prochainNiveau,
      visitCount: vc ?? 0,
    });
  } catch (err) {
    console.error('Profil error:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
