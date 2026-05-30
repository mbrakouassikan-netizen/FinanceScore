import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Simulateur remboursement prêt',
  description: 'Calcule tes mensualités et simule le remboursement anticipé de ton prêt.',
}

export default function RemboursementLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
