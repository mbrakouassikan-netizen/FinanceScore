import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '6 simulateurs financiers gratuits',
  description: 'Simulateurs crédit, épargne, budget, transfert, locatif et remboursement. Calculs adaptés à la réalité de la diaspora.',
}

export default function SimulateursLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
