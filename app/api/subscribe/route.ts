import { NextRequest, NextResponse } from 'next/server';
import { GoogleSheetRow } from '@/lib/types';
import { googleSheetsService } from '@/lib/googleSheets';
import { emailService } from '@/lib/emailService';

// Configuration des headers CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, score, level, pillarScores } = body;

    // Validation des entrées
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      );
    }

    // Préparation des données pour nos services
    const percentage = Math.round((score / 100) * 100);
    const timestamp = new Date().toISOString();

    // 1. Sauvegarder dans Google Sheets
    try {
      await googleSheetsService.setupSheet();
      
      const userData = {
        name: name || '',
        email: email,
        score: score,
        percentage: percentage,
        niveau: level,
        timestamp: timestamp,
        pillarScores: {
          'Revenus & Dépenses': pillarScores[1] || 0,
          'Épargne': pillarScores[0] || 0,
          'Dettes': pillarScores[2] || 0,
          'Diaspora & Famille': pillarScores[3] || 0,
          'Investissement': pillarScores[4] || 0,
          'Vision & Objectifs': pillarScores[5] || 0,
        },
      };

      await googleSheetsService.addUser(userData);
      console.log('✅ Données sauvegardées dans Google Sheets');
    } catch (sheetsError) {
      console.error('❌ Erreur Google Sheets:', sheetsError);
      // Continue même si Google Sheets échoue
    }

    // 2. Envoyer l'email de bienvenue
    try {
      const welcomeEmailData = {
        name: name || '',
        email: email,
        score: score,
        niveau: level,
        percentage: percentage,
      };

      const emailContent = emailService.createWelcomeEmail(welcomeEmailData);
      await emailService.sendEmail(emailContent);
      
      // Notifier l'admin
      await emailService.notifyAdmin(welcomeEmailData);
      
      console.log('✅ Email de bienvenue envoyé à:', email);
    } catch (emailError) {
      console.error('❌ Erreur email:', emailError);
      // Continue même si l'email échoue
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Données enregistrées avec succès',
        data: {
          email: email,
          name: name,
          score: score,
          level: level,
          timestamp: timestamp,
        }
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('❌ Erreur générale:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement des données' },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
