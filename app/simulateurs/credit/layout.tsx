import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Simulateur crédit immobilier',
  description: 'Calcule ta capacité d\'emprunt, tes mensualités et ton taux d\'endettement. Aides PTZ et Action Logement incluses.',
}

export default function CreditLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
