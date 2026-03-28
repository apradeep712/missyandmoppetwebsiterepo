import type { Metadata, Viewport } from 'next';  
import './globals.css';  
import Providers from './providers';
  
/**
 * METADATA: Controls the Browser Tab Title and Logo 
 */
export const metadata: Metadata = {  
  title: 'Missy & Moppet | The Pastel World',  
  description: 'Artistic and minimal luxury clothing for your little ones.',  
  icons: {
    // Path updated to /hero/logomain.png
    icon: [
      { url: '/hero/logomain.png?v=1', type: 'image/png' },
    ],
    shortcut: ['/hero/logomain.png?v=1'],
    apple: [
      { url: '/hero/logomain.png?v=1', sizes: '180x180', type: 'image/png' },
    ],
  },
};

/**
 * VIEWPORT: Sets the top bar color on mobile browsers to match your luxe theme
 */
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
      <body className="antialiased selection:bg-pink-50 text-[#4b3b33]">  
        <Providers>{children}</Providers>  
      </body>  
    </html>  
  );  
}