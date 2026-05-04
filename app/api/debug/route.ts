import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const envVars = {
      BREVO_API_KEY: process.env.BREVO_API_KEY ? 'Présente' : 'MANQUANTE',
      PAYHIP_API_KEY: process.env.PAYHIP_API_KEY ? 'Présente' : 'MANQUANTE',
      PAYHIP_WEBHOOK_SECRET: process.env.PAYHIP_WEBHOOK_SECRET ? 'Présente' : 'MANQUANTE',
      NEXT_PUBLIC_PAYHIP_URL: process.env.NEXT_PUBLIC_PAYHIP_URL || 'MANQUANTE',
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'MANQUANTE',
    };

    // Test de l'API Brevo
    let brevoTest = 'Non testé';
    if (process.env.BREVO_API_KEY) {
      try {
        const testRes = await fetch("https://api.brevo.com/v3/account", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "api-key": process.env.BREVO_API_KEY,
          },
        });
        
        if (testRes.ok) {
          brevoTest = '✅ API Brevo accessible';
        } else {
          const errorData = await testRes.json();
          brevoTest = `❌ Erreur API Brevo: ${JSON.stringify(errorData)}`;
        }
      } catch (error) {
        brevoTest = `❌ Erreur réseau Brevo: ${error}`;
      }
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      variables: envVars,
      brevoTest,
    });
  } catch (error) {
    return NextResponse.json({
      error: "Erreur diagnostic",
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
