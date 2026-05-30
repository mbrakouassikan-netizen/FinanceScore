import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rateLimit';
import { sendBrevoEmail } from '@/lib/brevo';

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

// GET /api/referral?email=xxx
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'email requis' }, { status: 400 });
    }

    const limited = await rateLimit(req, 'referral', 30);
    if (limited) return limited;

    const p = `user:${email}`;
    const [code, filleulsRaw, pointsRaw] = await Promise.all([
      redis.get<string>(`${p}:referral_code`),
      redis.get<string[]>(`${p}:filleuls`),
      redis.get<number>(`${p}:points`),
    ]);

    if (!code) {
      return NextResponse.json({ error: 'Code de parrainage non trouvé' }, { status: 404 });
    }

    const filleuls = filleulsRaw ?? [];
    const points = pointsRaw ?? 0;
    const pointsGagnes = filleuls.length * 30;

    return NextResponse.json({
      code,
      url: `https://finance-score.vercel.app/?ref=${code}`,
      filleuls: filleuls.length,
      pointsGagnes,
    });
  } catch (err) {
    console.error('Referral GET error:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST /api/referral/validate
export async function POST(req: NextRequest) {
  try {
    const { email, refCode } = await req.json();

    if (!email || !refCode) {
      return NextResponse.json({ error: 'email et refCode requis' }, { status: 400 });
    }

    const limited = await rateLimit(req, 'referral', 10);
    if (limited) return limited;

    // Vérifier que le code existe
    const referrerEmail = await redis.get<string>(`referral:${refCode}`);
    if (!referrerEmail) {
      return NextResponse.json({ error: 'Code de parrainage invalide' }, { status: 400 });
    }

    // Vérifier que l'email n'est pas le même que le parrain
    if (email.toLowerCase() === referrerEmail.toLowerCase()) {
      return NextResponse.json({ error: 'Tu ne peux pas te parrainer toi-même' }, { status: 400 });
    }

    // Vérifier que cet email n'a pas déjà été parrainé
    const p = `user:${referrerEmail}`;
    const existingFilleuls = await redis.get<string[]>(`${p}:filleuls`);
    if (existingFilleuls?.includes(email.toLowerCase())) {
      return NextResponse.json({ error: 'Tu as déjà été parrainé' }, { status: 400 });
    }

    // Ajouter +30 pts au parrain
    const currentPts = await redis.get<number>(`${p}:points`) ?? 0;
    const newPts = currentPts + 30;
    await redis.set(`${p}:points`, newPts);

    // Stocker le filleul
    const filleuls = existingFilleuls ?? [];
    filleuls.push(email.toLowerCase());
    await redis.set(`${p}:filleuls`, filleuls);

    // Mettre à jour le niveau
    const niveau = getNiveau(newPts);
    await redis.set(`${p}:niveau`, niveau.level);

    // Vérifier et attribuer les badges de parrainage
    const currentBadges = await redis.get<string[]>(`${p}:badges`) ?? [];
    const newBadges = [...currentBadges];
    let nouveauBadge: string | null = null;

    if (filleuls.length >= 1 && !newBadges.includes('ambassadeur')) {
      newBadges.push('ambassadeur');
      nouveauBadge = 'Ambassadeur';
    }
    if (filleuls.length >= 5 && !newBadges.includes('super_ambassadeur')) {
      newBadges.push('super_ambassadeur');
      nouveauBadge = nouveauBadge || 'Super Ambassadeur';
    }

    if (nouveauBadge) {
      await redis.set(`${p}:badges`, newBadges);
    }

    // Envoyer email de notification au parrain
    const niveauSuivant = NIVEAUX.find(n => n.min > newPts);
    const ptsRestants = niveauSuivant ? niveauSuivant.min - newPts : 0;

    try {
      await sendBrevoEmail({
        templateId: 4,
        to: { email: referrerEmail },
        params: {
          NIVEAU_ACTUEL: niveau.label,
          NIVEAU_SUIVANT: niveauSuivant?.label || 'Maximum',
          POINTS: newPts,
          PTS_RESTANTS: ptsRestants,
          POINTS_NIVEAU_SUIVANT: niveauSuivant?.min || 0,
          PROGRESSION_PCT: niveauSuivant ? Math.round((newPts / niveauSuivant.min) * 100) : 100,
        }
      });
      console.log('✅ Email de parrainage envoyé à', referrerEmail);
    } catch (err) {
      console.error('❌ Erreur envoi email parrainage:', err);
    }

    // Ajouter à l'historique
    const entry = JSON.stringify({
      action: 'referral',
      details: { filleul: email },
      points: 30,
      date: new Date().toISOString(),
    });
    await redis.lpush(`${p}:historique`, entry);
    await redis.ltrim(`${p}:historique`, 0, 9);

    return NextResponse.json({
      success: true,
      points_gagnes: 30,
      total_points: newPts,
      niveau: niveau.label,
    });
  } catch (err) {
    console.error('Referral POST error:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
