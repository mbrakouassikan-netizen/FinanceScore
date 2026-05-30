import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';
import { sendBrevoEmail } from '@/lib/brevo';

const redis = Redis.fromEnv();

export async function GET(req: NextRequest) {
  // Protéger la route avec CRON_SECRET
  const authHeader = req.headers.get('authorization');
  if (authHeader !== 'Bearer ' + process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    // Récupérer tous les emails depuis Redis
    const keys = await redis.keys('user:*:points');
    let emailsSent = 0;

    const mois = new Date().toLocaleString('fr-FR', { month: 'long' });
    const dateFin = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0
    ).toLocaleDateString('fr-FR');

    for (const key of keys) {
      const email = key.split(':')[1];
      const nomRaw = await redis.get<string>(`user:${email}:nom`);
      const nom = nomRaw || email.split('@')[0];

      try {
        await sendBrevoEmail({
          templateId: 5,
          to: { email, name: nom },
          params: {
            DEFI: 'Utilise 3 simulateurs ce mois-ci',
            POINTS: 30,
            BADGE: 'Explorateur complet',
            DATE_FIN: dateFin,
            DESCRIPTION_DEFI: 'Utilise au moins 3 simulateurs différents avant la fin du mois pour gagner 30 pts et débloquer le badge Explorateur complet.',
          }
        });
        emailsSent++;
        console.log(`✅ Email défi du mois envoyé à ${email}`);
      } catch (err) {
        console.error(`❌ Erreur envoi email à ${email}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      emailsSent,
      message: `${emailsSent} emails de défi du mois envoyés`,
    });
  } catch (err) {
    console.error('Erreur cron défi du mois:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
