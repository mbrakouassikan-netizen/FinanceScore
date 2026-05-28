import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rateLimit';

const redis = Redis.fromEnv();

const POINTS: Record<string, number> = {
  quiz_complete: 50,
  simulateur_use: 20,
  blog_read: 10,
  site_share: 30,
  return_visit: 15,
};

const ALL_SIMS = ['transfert', 'epargne', 'budget', 'credit', 'investissement-locatif', 'remboursement'];

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

export async function POST(req: NextRequest) {
  try {
    const { email, action, details } = await req.json();
    if (!email || !action) {
      return NextResponse.json({ error: 'email et action requis' }, { status: 400 });
    }
    if (typeof email !== 'string' || email.length > 500) {
      return NextResponse.json({ error: 'email invalide' }, { status: 400 });
    }
    if (typeof action !== 'string' || action.length > 100) {
      return NextResponse.json({ error: 'action invalide' }, { status: 400 });
    }

    const limited = await rateLimit(req, 'gamification', 30);
    if (limited) return limited;

    const p = `user:${email}`;

    const [currentPts, currentBadges, currentSims, visitCountRaw, lastVisitRaw, quizDoneRaw] = await Promise.all([
      redis.get<number>(`${p}:points`),
      redis.get<string[]>(`${p}:badges`),
      redis.get<string[]>(`${p}:simulateurs`),
      redis.get<number>(`${p}:visitCount`),
      redis.get<string>(`${p}:lastVisit`),
      redis.get<string>(`${p}:quizDone`),
    ]);

    let pts = currentPts ?? 0;
    const badges = currentBadges ?? [];
    const sims = currentSims ?? [];
    let vc = visitCountRaw ?? 0;
    let pointsGagnes = POINTS[action] ?? 0;

    if (action === 'simulateur_use' && details?.simulateur) {
      if (sims.includes(details.simulateur)) {
        pointsGagnes = 0;
      } else {
        sims.push(details.simulateur);
        await redis.set(`${p}:simulateurs`, sims);
      }
    }

    if (action === 'return_visit') {
      const last = lastVisitRaw ? new Date(lastVisitRaw) : null;
      const daysSince = last ? (Date.now() - last.getTime()) / 86400000 : 999;
      if (daysSince < 7) pointsGagnes = 0;
      vc += 1;
      await Promise.all([
        redis.set(`${p}:visitCount`, vc),
        redis.set(`${p}:lastVisit`, new Date().toISOString()),
      ]);
    }

    if (action === 'quiz_complete') {
      await redis.set(`${p}:quizDone`, '1');
      if (details?.nom) await redis.set(`${p}:nom`, details.nom);
    }

    pts += pointsGagnes;
    await redis.set(`${p}:points`, pts);

    const niveau = getNiveau(pts);
    await redis.set(`${p}:niveau`, niveau.level);

    const isQuizDone = quizDoneRaw === '1' || action === 'quiz_complete';
    const checks = [
      { id: 'premier_pas', label: 'Premier pas', ok: isQuizDone },
      { id: 'transfert_malin', label: 'Transfert malin', ok: sims.includes('transfert') },
      { id: 'epargnant_actif', label: 'Épargnant actif', ok: sims.includes('epargne') },
      { id: 'budget_controle', label: 'Budget sous contrôle', ok: sims.includes('budget') },
      { id: 'projet_immo', label: 'Projet immo', ok: sims.includes('credit') },
      { id: 'rentier_herbe', label: 'Rentier en herbe', ok: sims.includes('investissement-locatif') },
      { id: 'maitre_remboursement', label: 'Maître du remboursement', ok: sims.includes('remboursement') },
      { id: 'explorateur_complet', label: 'Explorateur complet', ok: ALL_SIMS.every(s => sims.includes(s)) },
      { id: 'fidele', label: 'Fidèle', ok: vc >= 4 },
    ];

    let nouveauBadge: string | null = null;
    for (const b of checks) {
      if (b.ok && !badges.includes(b.id)) {
        badges.push(b.id);
        nouveauBadge = nouveauBadge ?? b.label;
      }
    }
    await redis.set(`${p}:badges`, badges);

    if (pointsGagnes > 0 || nouveauBadge) {
      const entry = JSON.stringify({
        action,
        details: details ?? {},
        points: pointsGagnes,
        date: new Date().toISOString(),
      });
      await redis.lpush(`${p}:historique`, entry);
      await redis.ltrim(`${p}:historique`, 0, 9);
    }

    return NextResponse.json({
      success: true,
      points_gagnes: pointsGagnes,
      total_points: pts,
      nouveau_badge: nouveauBadge,
      niveau: niveau.label,
    });
  } catch (err) {
    console.error('Gamification action error:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
