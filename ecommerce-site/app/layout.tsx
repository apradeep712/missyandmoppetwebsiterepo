import type { Metadata, Viewport } from 'next';  
import Script from 'next/script'; // Import the Script component
import './globals.css';  
import Providers from './providers';
  
export const metadata: Metadata = {  
  title: 'Missy & Moppet | The Pastel World',  
  description: 'Artistic and minimal luxury clothing for your little ones.',  
  icons: {
    icon: [
      { url: '/hero/logomain.png?v=1', type: 'image/png' },
    ],
    shortcut: ['/hero/logomain.png?v=1'],
    apple: [
      { url: '/hero/logomain.png?v=1', sizes: '180x180', type: 'image/png' },
    ],
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
        {/* Replace YOUR_APP_ID with your actual OTPless App ID from their dashboard */}
        <Script 
          src="https://otpless.com/v2/auth.js" 
          data-appid="YOUR_APP_ID" 
          strategy="beforeInteractive" 
        />
      </head>
      <body className="antialiased selection:bg-pink-50 text-[#4b3b33]">  
        <Providers>{children}</Providers>  
      </body>  
    </html>  
  );  
}