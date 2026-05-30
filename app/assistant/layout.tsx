import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Assistant IA éducation financière',
  description: 'Pose tes questions sur la finance à notre assistant IA connecté à internet. Réponses adaptées à la diaspora africaine.',
}

export default function AssistantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
