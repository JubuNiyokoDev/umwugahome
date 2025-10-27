import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Chatbot from '@/components/chatbot';
import { cn } from '@/lib/utils';
import { NProgressProvider } from '@/components/layout/nprogress-provider';
import { MotionProvider } from '@/components/motion-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { FirebaseClientProvider } from '@/firebase';

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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Montserrat:wght@400;500;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <NProgressProvider>
            <MotionProvider>
              <FirebaseClientProvider>
                <div className="flex min-h-screen flex-col bg-background">
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
                <Toaster />
                <Chatbot />
              </FirebaseClientProvider>
            </MotionProvider>
          </NProgressProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
