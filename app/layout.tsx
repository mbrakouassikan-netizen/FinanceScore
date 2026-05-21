import { Inter } from 'next/font/google';
import { Fraunces } from 'next/font/google';
import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
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
  verification: {
    google: '8lkx5tw_fZ3Lj0W14b148R3bPpJBYCK3xn4_LuPQmNk',
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
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-SNWL61PBJF"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SNWL61PBJF');
          `}
        </Script>
        <Navbar />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
