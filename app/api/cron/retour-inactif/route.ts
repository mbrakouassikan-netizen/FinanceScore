import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(req: NextRequest) {
  // Protéger la route avec CRON_SECRET
  const authHeader = req.headers.get('authorization');
  if (authHeader !== 'Bearer ' + process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    // Récupérer tous les emails depuis Redis
    const keys = await redis.keys('user:*:lastVisit');
    let emailsSent = 0;

    for (const key of keys) {
      const email = key.split(':')[1];
      const lastVisitRaw = await redis.get<string>(key);
      
      if (lastVisitRaw) {
        const lastVisit = new Date(lastVisitRaw);
        const daysSince = (Date.now() - lastVisit.getTime()) / 86400000;
        
        // Si absent depuis plus de 7 jours
        if (daysSince > 7) {
          const [pointsRaw, nomRaw, simulateursRaw, defiRaw] = await Promise.all([
            redis.get<number>(`user:${email}:points`),
            redis.get<string>(`user:${email}:nom`),
            redis.get<string[]>(`user:${email}:simulateurs`),
            redis.get<string>(`user:${email}:defiActif`),
          ]);

          const points = pointsRaw ?? 0;
          const nom = nomRaw || email.split('@')[0];
          const simulateurs = simulateursRaw ?? [];
          const defiActif = defiRaw || 'Aucun défi en cours';

          const niveau = getNiveau(points);
          const niveauSuivant = NIVEAUX.find(n => n.min > points);
          const ptsRestants = niveauSuivant ? niveauSuivant.min - points : 0;

          // Récupérer infos défi si actif
          const semaineActuelle = await redis.get<number>(`user:${email}:semaineActuelle`) || 1;
          const semaineTotale = await redis.get<number>(`user:${email}:semaineTotale`) || 52;

          try {
            await sendBrevoEmail({
              templateId: 6,
              to: { email, name: nom },
              params: {
                JOURS_ABSENCE: Math.round(daysSince),
                NIVEAU: niveau.label,
                POINTS: points,
                DEFI: defiActif,
                NIVEAU_SUIVANT: niveauSuivant?.label || 'Maximum',
                PTS_RESTANTS: ptsRestants,
                SEMAINE_ACTUELLE: semaineActuelle,
                SEMAINE_TOTALE: semaineTotale,
              }
            });
            emailsSent++;
            console.log(`✅ Email retour inactif envoyé à ${email}`);
          } catch (err) {
            console.error(`❌ Erreur envoi email à ${email}:`, err);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      emailsSent,
      message: `${emailsSent} emails de retour inactif envoyés`,
    });
  } catch (err) {
    console.error('Erreur cron retour inactif:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
