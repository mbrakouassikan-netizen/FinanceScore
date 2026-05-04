import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

// Types pour les données à stocker
export interface UserData {
  name: string;
  email: string;
  score: number;
  percentage: number;
  niveau: string;
  timestamp: string;
  pillarScores: {
    'Revenus & Dépenses': number;
    'Épargne': number;
    'Dettes': number;
    'Diaspora & Famille': number;
    'Investissement': number;
    'Vision & Objectifs': number;
  };
}

// Configuration Google Sheets
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

export class GoogleSheetsService {
  private sheets: any;
  private spreadsheetId: string;

  constructor() {
    this.spreadsheetId = process.env.GOOGLE_SHEET_ID || '';
    
    // Authentification avec JWT
    const auth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '',
      key: process.env.GOOGLE_PRIVATE_KEY || '',
      scopes: SCOPES,
    });

    this.sheets = google.sheets({ version: 'v4', auth });
  }

  // Créer la feuille si elle n'existe pas
  async setupSheet(): Promise<void> {
    try {
      // Vérifier si la feuille existe
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
      });

      const sheetName = 'Utilisateurs';
      const sheet = response.data.sheets?.find((s: any) => s.properties?.title === sheetName);

      if (!sheet) {
        // Créer la feuille avec les en-têtes
        await this.sheets.spreadsheets.batchUpdate({
          spreadsheetId: this.spreadsheetId,
          requestBody: {
            requests: [
              {
                addSheet: {
                  properties: {
                    title: sheetName,
                    gridProperties: {
                      rowCount: 1000,
                      columnCount: 10,
                    },
                  },
                },
              },
            ],
          },
        });

        // Ajouter les en-têtes
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: this.spreadsheetId,
          range: `${sheetName}!A1:J1`,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [
              [
                'Timestamp',
                'Nom',
                'Email',
                'Score',
                'Pourcentage',
                'Niveau',
                'Revenus & Dépenses',
                'Épargne',
                'Dettes',
                'Diaspora & Famille',
                'Investissement',
                'Vision & Objectifs'
              ],
            ],
          },
        });
      }

      console.log('✅ Google Sheets configuré avec succès');
    } catch (error) {
      console.error('❌ Erreur configuration Google Sheets:', error);
      throw error;
    }
  }

  // Ajouter un utilisateur à Google Sheets
  async addUser(userData: UserData): Promise<void> {
    try {
      const sheetName = 'Utilisateurs';
      
      // Préparer les données
      const values = [
        [
          userData.timestamp,
          userData.name,
          userData.email,
          userData.score,
          userData.percentage,
          userData.niveau,
          userData.pillarScores['Revenus & Dépenses'],
          userData.pillarScores['Épargne'],
          userData.pillarScores['Dettes'],
          userData.pillarScores['Diaspora & Famille'],
          userData.pillarScores['Investissement'],
          userData.pillarScores['Vision & Objectifs']
        ],
      ];

      // Ajouter les données à la feuille
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A:J`,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values,
        },
      });

      console.log('✅ Utilisateur ajouté à Google Sheets:', userData.email);
    } catch (error) {
      console.error('❌ Erreur ajout utilisateur Google Sheets:', error);
      throw error;
    }
  }

  // Récupérer tous les utilisateurs
  async getUsers(): Promise<UserData[]> {
    try {
      const sheetName = 'Utilisateurs';
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A:J`,
      });

      const rows = response.data.values || [];
      const headers = rows[0] || [];
      
      return rows.slice(1).map((row: any[]) => ({
        timestamp: row[0] || '',
        name: row[1] || '',
        email: row[2] || '',
        score: parseInt(row[3]) || 0,
        percentage: parseInt(row[4]) || 0,
        niveau: row[5] || '',
        pillarScores: {
          'Revenus & Dépenses': parseInt(row[6]) || 0,
          'Épargne': parseInt(row[7]) || 0,
          'Dettes': parseInt(row[8]) || 0,
          'Diaspora & Famille': parseInt(row[9]) || 0,
          'Investissement': parseInt(row[10]) || 0,
          'Vision & Objectifs': parseInt(row[11]) || 0,
        },
      }));
    } catch (error) {
      console.error('❌ Erreur récupération utilisateurs:', error);
      return [];
    }
  }
}

// Export du service
export const googleSheetsService = new GoogleSheetsService();
