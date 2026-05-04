// lib/brevo.ts

const PDF_LINKS: Record<string, string> = {
  urgence:     "https://drive.google.com/file/d/1Jxw8QXbZeEZ8jnaqEizffX6cTKNu6G2X/view?usp=drive_link",
  fragile:     "https://drive.google.com/file/d/1bUlx6N7__JVBWJ9GhbIRycJU8AxJvkWo/view?usp=drive_link",
  progression: "https://drive.google.com/file/d/1Bcba2Z3GAbGP-W_DHpEQBbY4Fs6MHBRj/view?usp=drive_link",
  solide:      "https://drive.google.com/file/d/1R6cvQk7rqn8NmiYqpA0BYw74avMQ2D1y/view?usp=drive_link",
};

const TEMPLATE_IDS = {
  score:   1,
  premium: 2,
};

export function getNiveau(score: number) {
  if (score <= 39) return {
    key: "urgence", label: "🔴 Urgence Financière",
    message: "Ta situation demande une action immédiate. Ce plan te donne un chemin clair pour reprendre le contrôle étape par étape.",
    pdfLink: PDF_LINKS.urgence,
  };
  if (score <= 59) return {
    key: "fragile", label: "🟠 Finances Fragiles",
    message: "Tu as les bases, mais ta situation reste vulnérable. En 90 jours, tu peux consolider et automatiser ta progression.",
    pdfLink: PDF_LINKS.fragile,
  };
  if (score <= 79) return {
    key: "progression", label: "🟡 En Bonne Progression",
    message: "Tu gères bien l'essentiel. L'objectif : optimiser chaque euro pour accélérer vers la liberté financière.",
    pdfLink: PDF_LINKS.progression,
  };
  return {
    key: "solide", label: "🟢 Finances Solides",
    message: "Félicitations ! Tu fais partie des rares personnes qui ont vraiment pris en main leur avenir financier.",
    pdfLink: PDF_LINKS.solide,
  };
}

async function callBrevoAPI(body: object): Promise<boolean> {
  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": "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",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) { console.error("Erreur Brevo:", await res.json()); return false; }
    return true;
  } catch (error) {
    console.error("Erreur réseau Brevo:", error); return false;
  }
}

export async function sendScoreEmail(params: {
  email: string; prenom: string; score: number;
  p1: number; p2: number; p3: number; p4: number; p5: number; p6: number;
  gumroadLink?: string;
}): Promise<boolean> {
  const niveau = getNiveau(params.score);
  return callBrevoAPI({
    to: [{ email: params.email, name: params.prenom }],
    templateId: TEMPLATE_IDS.score,
    params: {
      SCORE: params.score, NIVEAU: niveau.label, MESSAGE_NIVEAU: niveau.message,
      P1: params.p1, P1_PCT: Math.round((params.p1/20)*100),
      P2: params.p2, P2_PCT: Math.round((params.p2/20)*100),
      P3: params.p3, P3_PCT: Math.round((params.p3/20)*100),
      P4: params.p4, P4_PCT: Math.round((params.p4/15)*100),
      P5: params.p5, P5_PCT: Math.round((params.p5/15)*100),
      P6: params.p6, P6_PCT: Math.round((params.p6/10)*100),
      GUMROAD_LINK: params.gumroadLink ?? "https://payhip.com/b/53DCE",
    },
  });
}

export async function sendPremiumEmail(params: {
  email: string; prenom: string; score: number;
}): Promise<boolean> {
  const niveau = getNiveau(params.score);
  return callBrevoAPI({
    to: [{ email: params.email, name: params.prenom }],
    templateId: TEMPLATE_IDS.premium,
    params: {
      SCORE: params.score, NIVEAU: niveau.label,
      PDF_LINK: niveau.pdfLink, MESSAGE_MOTIVANT: niveau.message,
    },
  });
}
