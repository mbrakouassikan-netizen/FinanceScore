import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Simulateur investissement locatif',
  description: 'Calcule la rentabilité de ton bien immobilier. Cashflow, fiscalité LMNP et projection patrimoniale sur 20 ans.',
}

export default function InvestissementLocatifLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
