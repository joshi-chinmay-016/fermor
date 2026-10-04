import type { Metadata, Viewport } from 'next';
import { Instrument_Serif, Inter } from 'next/font/google';
import './globals.css';

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Fermor — Where is your money taking you?',
  description:
    'Your money isn’t a number. It’s a trajectory. Explore honest financial projections, calculators, comparisons, and live scenario modelling without black boxes.',
  keywords: [
    'financial trajectory',
    'SIP calculator',
    'financial planning India',
    'EMI decision tool',
    'compound interest',
  ],
  authors: [{ name: 'Fermor' }],
  metadataBase: new URL('https://fermor.in'),
  openGraph: {
    title: 'Fermor — Where is your money taking you?',
    description: 'Your money isn’t a number. It’s a trajectory. Show the math.',
    url: 'https://fermor.in',
    siteName: 'Fermor',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Fermor — Where is your money taking you?',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fermor — Where is your money taking you?',
    description: 'Your money isn’t a number. It’s a trajectory.',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: '#F7F6F2',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${inter.variable}`}
    >
      <body className="font-sans bg-bg text-ink min-h-screen selection:bg-accent selection:text-bg">
        {children}
      </body>
    </html>
  );
}
