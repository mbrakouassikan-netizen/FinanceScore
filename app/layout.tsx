import { Inter } from 'next/font/google';
import { Fraunces } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces' });

export const metadata: Metadata = {
  title: 'CultureFinance — Ton bilan financier gratuit en 10 min',
  description: 'Découvre ton score de santé financière sur 100 et reçois un plan d\'action personnalisé. Gratuit. Pour la diaspora.',
  openGraph: {
    title: 'CultureFinance — Ton bilan financier gratuit en 10 min',
    description: 'Découvre ton score de santé financière sur 100 et reçois un plan d\'action personnalisé. Gratuit. Pour la diaspora.',
    type: 'website',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CultureFinance — Ton bilan financier gratuit en 10 min',
    description: 'Découvre ton score de santé financière sur 100 et reçois un plan d\'action personnalisé. Gratuit. Pour la diaspora.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="bg-bg-primary text-text-primary min-h-screen">
        <GoogleAnalytics />
        <Navbar />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
