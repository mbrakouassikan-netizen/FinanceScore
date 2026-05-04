import { NextRequest, NextResponse } from "next/server";
import { sendScoreEmail } from "@/lib/brevo";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('📧 API send-score reçoit:', body);
    
    const { email, prenom, score, p1, p2, p3, p4, p5, p6, gumroadLink } = body;
    
    if (!email || score === undefined) {
      console.error('❌ Paramètres manquants:', { email, score });
      return NextResponse.json({ error: "email et score obligatoires" }, { status: 400 });
    }
    
    console.log('🔑 Vérification BREVO_API_KEY:', process.env.BREVO_API_KEY ? 'Présente' : 'MANQUANTE');
    
    const success = await sendScoreEmail({
      email, prenom: prenom ?? "là", score,
      p1: p1??0, p2: p2??0, p3: p3??0, p4: p4??0, p5: p5??0, p6: p6??0,
      gumroadLink,
    });
    
    console.log('📧 Résultat envoi email:', success ? '✅ SUCCÈS' : '❌ ÉCHEC');
    
    if (!success) return NextResponse.json({ error: "Échec envoi" }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
