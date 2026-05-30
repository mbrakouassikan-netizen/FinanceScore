import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Comparateur transfert argent Afrique',
  description: 'Compare LemFi, Wave, Wise, Remitly, WorldRemit et Western Union. Trouve le service le moins cher pour envoyer au Sénégal, Côte d\'Ivoire, Mali et plus.',
}

export default function TransfertLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
