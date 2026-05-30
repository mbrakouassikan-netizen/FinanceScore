import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Simulateur épargne et placements',
  description: 'Compare Livret A, LDDS, LEP, assurance-vie et PEA. Projections sur 30 ans.',
}

export default function EpargneLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
