import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Simulateur budget règle 50/30/20',
  description: 'Analyse ton budget selon la règle 50/30/20 et optimise tes dépenses.',
}

export default function BudgetLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
