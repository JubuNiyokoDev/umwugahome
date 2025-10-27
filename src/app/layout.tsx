import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Chatbot from '@/components/chatbot';
import { cn } from '@/lib/utils';
import { NProgressProvider } from '@/components/layout/nprogress-provider';
import { MotionProvider } from '@/components/motion-provider';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: 'UmwugaHome Digital',
  description: 'La Maison Digitale des Métiers du Burundi',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&family=Belleza&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NProgressProvider>
            <MotionProvider>
              {children}
              <Toaster />
              <Chatbot />
            </MotionProvider>
          </NProgressProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
