import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quiz éducatif financier gratuit',
  description: '19 questions pour évaluer ton niveau financier et recevoir un guide personnalisé. Gratuit et adapté à la diaspora.',
}

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
