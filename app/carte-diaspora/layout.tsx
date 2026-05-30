import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Carte des transferts diaspora Afrique',
  description: 'Visualise les transferts d\'argent de la diaspora africaine en France. 26 Mds€ envoyés chaque année vers l\'Afrique.',
}

export default function CarteDiasporaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
