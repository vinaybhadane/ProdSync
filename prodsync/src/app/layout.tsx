import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: {
    default: 'ProdSync — AI-Powered Product Intelligence for Industrial Commerce',
    template: '%s | ProdSync',
  },
  description:
    'Transform scattered industrial product information into structured, validated, enriched, and commerce-ready product intelligence with AI.',
  keywords: [
    'product intelligence',
    'industrial commerce',
    'AI product data',
    'product catalog management',
    'product enrichment',
    'data validation',
    'PIM system',
  ],
  authors: [{ name: 'ProdSync' }],
  creator: 'ProdSync',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://prodsync.ai',
    siteName: 'ProdSync',
    title: 'ProdSync — AI-Powered Product Intelligence for Industrial Commerce',
    description:
      'Transform scattered industrial product information into structured, validated, enriched, and commerce-ready product intelligence with AI.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProdSync — AI-Powered Product Intelligence',
    description: 'Transform scattered industrial product information into structured, validated, and commerce-ready intelligence.',
    creator: '@prodsync',
  },
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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
