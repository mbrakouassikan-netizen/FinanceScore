import { NextRequest, NextResponse } from "next/server";
import { sendPremiumEmail } from "@/lib/brevo";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email  = body.email ?? body.purchaser_email;
    const prenom = body.prenom ?? body.purchaser_name?.split(" ")[0] ?? "là";
    const score  = body.score ?? 0;
    if (!email) return NextResponse.json({ error: "email obligatoire" }, { status: 400 });
    const success = await sendPremiumEmail({ email, prenom, score });
    if (!success) return NextResponse.json({ error: "Échec envoi" }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
