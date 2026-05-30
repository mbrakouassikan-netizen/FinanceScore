import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Défis d\'épargne gamifiés',
  description: 'Relève des défis d\'épargne pour atteindre tes objectifs financiers. Défi 52 semaines, apport immobilier et plus.',
}

export default function DefisLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
