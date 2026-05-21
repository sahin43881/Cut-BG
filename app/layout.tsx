import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL('https://cutbg.app'),
  title: {
    default: 'CutBG — Remove image backgrounds in your browser',
    template: '%s · CutBG',
  },
  description:
    'Free, fast, private background remover. Drag, drop, download a transparent PNG. Your images never leave your device.',
  keywords: [
    'background remover',
    'remove background',
    'transparent png',
    'image editor',
    'free',
    'browser',
    'no signup',
  ],
  openGraph: {
    title: 'CutBG — Remove image backgrounds in your browser',
    description:
      'Free, fast, private background remover. Your images never leave your device.',
    url: 'https://cutbg.app',
    siteName: 'CutBG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CutBG — Remove image backgrounds in your browser',
    description: 'Free, fast, private background remover.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0b1220' },
  ],
  width: 'device-width',
  initialScale: 1,
};

// Runs synchronously before the first paint to set the `dark` class on <html>.
// Without this, the page paints in light mode first and then "flashes" to dark
// once React hydrates and useEffect runs.
const themeBootstrap = `(function(){try{var s=localStorage.getItem('cutbg-theme');var d=s==='dark'||(!s&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d){document.documentElement.classList.add('dark');}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
