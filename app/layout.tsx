import { Inter, Syne } from 'next/font/google';
import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const syne = Syne({ subsets: ['latin'], weight: ['400', '700', '800'], variable: '--font-syne' });

export const metadata: Metadata = {
  metadataBase: new URL('https://finance-score.vercel.app'),
  title: {
    default: 'CultureFinance — Éducation financière pour la diaspora africaine',
    template: '%s | CultureFinance'
  },
  description: 'Quiz gratuit, simulateurs et assistant IA pour maîtriser ta finance. Conçu pour la diaspora africaine en France : épargne, transferts, crédit, budget.',
  keywords: [
    'éducation financière diaspora',
    'finance diaspora africaine France',
    'simulateur transfert argent Afrique',
    'épargne diaspora',
    'crédit immobilier diaspora',
    'Livret A LEP épargne',
    'envoyer argent Sénégal Côte d\'Ivoire',
    'LemFi Wave Wise comparateur',
    'budget diaspora africaine',
    'CultureFinance'
  ],
  authors: [{ name: 'CultureFinance' }],
  creator: 'CultureFinance',
  publisher: 'CultureFinance',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://finance-score.vercel.app',
    siteName: 'CultureFinance',
    title: 'CultureFinance — Éducation financière pour la diaspora africaine',
    description: 'Quiz gratuit, simulateurs et assistant IA pour maîtriser ta finance. Conçu pour la diaspora africaine en France.',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'CultureFinance — Éducation financière pour la diaspora africaine',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CultureFinance — Éducation financière pour la diaspora africaine',
    description: 'Quiz gratuit, simulateurs et assistant IA pour maîtriser ta finance.',
    images: ['/og-image.svg'],
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
    <html lang="fr" className={`${inter.variable} ${syne.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "CultureFinance",
              "url": "https://finance-score.vercel.app",
              "description": "Plateforme d'éducation financière pour la diaspora africaine en France",
              "inLanguage": "fr-FR",
              "publisher": {
                "@type": "Organization",
                "name": "CultureFinance",
                "url": "https://finance-score.vercel.app"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://finance-score.vercel.app/blog?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
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
