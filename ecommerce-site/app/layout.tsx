import type { Metadata, Viewport } from 'next';
import Script from 'next/script'; // Import the Script component
import './globals.css';
import Providers from './providers';
import Footer from './components/Footer';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://missyandmoppet.com';
const siteTitle = 'Missy & Moppet | The Pastel World';
const siteDescription = 'Artistic and minimal luxury clothing for your little ones.';

// OTPless is optional. Only load its script when a real App ID is configured,
// so we never ship a broken "YOUR_APP_ID" placeholder script to production.
const otplessAppId = process.env.NEXT_PUBLIC_OTPLESS_APP_ID;
const otplessEnabled =
  !!otplessAppId &&
  otplessAppId !== 'YOUR_APP_ID_HERE' &&
  otplessAppId !== 'YOUR_APP_ID';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  icons: {
    icon: [
      { url: '/hero/logomain.png?v=1', type: 'image/png' },
    ],
    shortcut: ['/hero/logomain.png?v=1'],
    apple: [
      { url: '/hero/logomain.png?v=1', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    siteName: 'Missy & Moppet',
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    images: [{ url: '/hero/logomain.png?v=1', alt: 'Missy & Moppet' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: ['/hero/logomain.png?v=1'],
  },
};

export const viewport: Viewport = {
  themeColor: '#fdf7f2',
  width: 'device-width',
  initialScale: 1,
};
  
export default function RootLayout({  
  children,  
}: {  
  children: React.ReactNode;  
}) {  
  return (  
    <html lang="en">  
      <head>
        {/* OTPless login script — only loaded when NEXT_PUBLIC_OTPLESS_APP_ID is set (see MIGRATION-GUIDE.md §7) */}
        {otplessEnabled && (
          <Script
            src="https://otpless.com/v2/auth.js"
            data-appid={otplessAppId}
            strategy="beforeInteractive"
          />
        )}
      </head>
      <body className="antialiased selection:bg-pink-50 text-[#4b3b33]">  
        <Providers>
          {children}
          <Footer />
        </Providers>
      </body>
    </html>  
  );  
}