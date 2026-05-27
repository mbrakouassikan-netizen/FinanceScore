// Ce fichier est obsolète - utilisez lib/brevo.ts à la place
// import { MailDataRequired } from '@sendgrid/mail';

// Types pour les emails
export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface WelcomeEmailData {
  name: string;
  email: string;
  score: number;
  niveau: string;
  percentage: number;
}

export class EmailService {
  private apiKey: string;
  private fromEmail: string;
  private fromName: string;

  constructor() {
    this.apiKey = process.env.SENDGRID_API_KEY || '';
    this.fromEmail = process.env.FROM_EMAIL || 'contact@financescore.com';
    this.fromName = process.env.FROM_NAME || 'FinanceScore';
  }

  // Envoyer un email - DÉSACTIVÉ - utilisez Brevo à la place
  async sendEmail(emailData: EmailData): Promise<void> {
    console.warn('⚠️ EmailService.sendEmail est désactivé. Utilisez lib/brevo.ts à la place.');
    return;
  }

  // Créer le contenu de l'email de bienvenue
  createWelcomeEmail(data: WelcomeEmailData): EmailData {
    const subject = `🎉 Ton bilan financier FinanceScore - Score: ${data.score}/100`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FinanceScore - Ton Bilan Financier</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #C8F04A; padding: 20px; text-align: center; }
          .content { background: #1a1a1a; color: #fff; padding: 30px; }
          .score { background: #C8F04A; color: #000; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0; }
          .cta { background: #C8F04A; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
          .footer { background: #000; color: #666; padding: 20px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 FinanceScore</h1>
            <p>Ton bilan financier personnel</p>
          </div>
          
          <div class="content">
            <h2>Bonjour ${data.name},</h2>
            <p>Félicitations ! Tu viens de compléter ton bilan financier FinanceScore.</p>
            
            <div class="score">
              📊 Ton Score: ${data.score}/100<br>
              🎯 Niveau: ${data.niveau}<br>
              📈 Performance: ${data.percentage}%
            </div>
            
            <h3>🔍 Ce que ton score signifie :</h3>
            <p>${this.getScoreInterpretation(data.niveau)}</p>
            
            <h3>🚀 Prochaines étapes :</h3>
            <ul>
              <li>Consulte ton guide personnalisé sur le site</li>
              <li>Partage tes résultats avec ta communauté</li>
              <li>Suis les recommandations pour améliorer ton score</li>
            </ul>
            
            <div style="text-align: center;">
              <a href="https://financescore.vercel.app/resultats?score=${data.score}&name=${encodeURIComponent(data.name)}" class="cta">
                📊 Voir mes résultats complets
              </a>
            </div>
            
            <h3>💡 Un conseil pour commencer :</h3>
            <p>${this.getPersonalizedTip(data.niveau)}</p>
          </div>
          
          <div class="footer">
            <p>Cet email a été envoyé automatiquement par FinanceScore.</p>
            <p>Si tu ne souhaites plus recevoir d'emails, tu peux te désinscrire.</p>
            <p>© 2024 FinanceScore - Tous droits réservés</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      FinanceScore - Ton Bilan Financier
      
      Bonjour ${data.name},
      
      Félicitations ! Tu viens de compléter ton bilan financier FinanceScore.
      
      📊 Ton Score: ${data.score}/100
      🎯 Niveau: ${data.niveau}
      📈 Performance: ${data.percentage}%
      
      ${this.getScoreInterpretation(data.niveau)}
      
      Prochaines étapes :
      - Consulte ton guide personnalisé sur le site
      - Partage tes résultats avec ta communauté
      - Suis les recommandations pour améliorer ton score
      
      ${this.getPersonalizedTip(data.niveau)}
      
      Voir tes résultats: https://financescore.vercel.app/resultats?score=${data.score}&name=${encodeURIComponent(data.name)}
      
      © 2024 FinanceScore - Tous droits réservés
    `;

    return {
      to: data.email,
      subject,
      html,
      text,
    };
  }

  // Interprétation du score
  private getScoreInterpretation(niveau: string): string {
    const interpretations: Record<string, string> = {
      'Débutant': 'Tu es au début de ton parcours financier. C\'est normal ! L\'important est de commencer maintenant.',
      'Intermédiaire': 'Tu as de bonnes bases, mais il y a encore de la marge pour optimiser ta gestion financière.',
      'Avancé': 'Excellent ! Tu as une bonne maîtrise de tes finances. Continue sur cette lancée.',
      'Expert': 'Félicitations ! Tu es un modèle en matière de gestion financière. Partage tes connaissances !',
    };
    return interpretations[niveau] || 'Continue ton effort pour améliorer ta situation financière.';
  }

  // Conseil personnalisé
  private getPersonalizedTip(niveau: string): string {
    const tips: Record<string, string> = {
      'Débutant': 'Commence par suivre tes dépenses pendant un mois. C\'est la première étape pour prendre le contrôle.',
      'Intermédiaire': 'Crée un budget mensuel et essaie d\'économiser au moins 10% de tes revenus.',
      'Avancé': 'Explore les opportunités d\'investissement pour faire fructifier ton épargne.',
      'Expert': 'Pense à diversifier tes investissements et à optimiser ta fiscalité.',
    };
    return tips[niveau] || 'Continue à apprendre et à appliquer les bonnes pratiques financières.';
  }

  // Email de notification admin
  async notifyAdmin(userData: WelcomeEmailData): Promise<void> {
    const adminEmail = process.env.ADMIN_EMAIL || '';
    if (!adminEmail) return;

    const subject = `🚀 Nouvel utilisateur FinanceScore - ${userData.name}`;
    const html = `
      <h2>Nouvel utilisateur inscrit</h2>
      <p><strong>Nom:</strong> ${userData.name}</p>
      <p><strong>Email:</strong> ${userData.email}</p>
      <p><strong>Score:</strong> ${userData.score}/100</p>
      <p><strong>Niveau:</strong> ${userData.niveau}</p>
      <p><strong>Date:</strong> ${new Date().toLocaleString('fr-FR')}</p>
    `;

    await this.sendEmail({
      to: adminEmail,
      subject,
      html,
    });
  }
}

// Export du service
export const emailService = new EmailService();
