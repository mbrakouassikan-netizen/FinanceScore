import { NextRequest, NextResponse } from 'next/server';
import { calculateScore } from '@/lib/scoring';
import { QuizAnswer } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { answers } = body;

    // Validation des entrées
    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'Réponses invalides' },
        { status: 400 }
      );
    }

    // Conversion des réponses en format QuizAnswer
    const quizAnswers: QuizAnswer[] = answers.map((answer: any) => ({
      questionId: answer.questionId,
      selectedOption: answer.selectedOption,
      points: answer.points,
    }));

    // Calcul du score
    const scoreResult = calculateScore(quizAnswers);

    return NextResponse.json(
      { success: true, data: scoreResult },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Erreur calcul score:', error);
    return NextResponse.json(
      { error: 'Erreur lors du calcul du score' },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

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
