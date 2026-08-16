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
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/logo-icon.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
