import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';
import { sendBrevoEmail } from '@/lib/brevo';

const redis = Redis.fromEnv();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Vérifier que c'est un événement de publication d'article Sanity
    if (body._type !== 'article' || !body.slug?.current) {
      return NextResponse.json({ error: 'Événement non reconnu' }, { status: 400 });
    }

    const article = {
      title: body.title || 'Nouvel article',
      slug: body.slug.current,
      excerpt: body.excerpt || '',
      category: body.category || 'Finance',
      publishedAt: body.publishedAt || new Date().toISOString(),
      readingTime: body.readingTime || '5 min de lecture',
    };

    // Récupérer tous les emails depuis Redis
    const keys = await redis.keys('user:*:points');
    let emailsSent = 0;

    for (const key of keys) {
      const email = key.split(':')[1];
      const nomRaw = await redis.get<string>(`user:${email}:nom`);
      const nom = nomRaw || email.split('@')[0];

      try {
        await sendBrevoEmail({
          templateId: 8,
          to: { email, name: nom },
          params: {
            TITRE_ARTICLE: article.title,
            RESUME_ARTICLE: article.excerpt,
            CATEGORIE: article.category,
            DATE_PUBLICATION: new Date(article.publishedAt).toLocaleDateString('fr-FR'),
            TEMPS_LECTURE: article.readingTime,
            URL_ARTICLE: `https://finance-score.vercel.app/blog/${article.slug}`,
          }
        });
        emailsSent++;
        console.log(`✅ Email nouvel article envoyé à ${email}`);
      } catch (err) {
        console.error(`❌ Erreur envoi email à ${email}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      emailsSent,
      message: `${emailsSent} emails de nouvel article envoyés`,
    });
  } catch (err) {
    console.error('Erreur webhook Sanity:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
