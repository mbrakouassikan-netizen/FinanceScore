import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mon parcours CultureFinance',
  description: 'Suis ta progression, tes badges et tes défis d\'épargne sur CultureFinance.',
}

export default function ProfilLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
