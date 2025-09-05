import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/globals.css";
import { Toaster } from "@/components/ui/toaster";
import PWAProvider from "@/components/pwa-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Goatius Notes",
  description: "The goat of note-taking apps - Rich markdown editor with real-time preview",
  keywords: ["notes", "markdown", "editor", "productivity", "writing"],
  authors: [{ name: "Goatius" }],
  applicationName: "Goatius Notes",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Goatius Notes",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Goatius Notes",
    description: "The goat of note-taking apps - Rich markdown editor with real-time preview",
    url: "https://goatius-notes.vercel.app",
    siteName: "Goatius Notes",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Goatius Notes - The goat of note-taking apps",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Goatius Notes",
    description: "The goat of note-taking apps - Rich markdown editor with real-time preview",
    images: ["/og.png"],
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4d5eff" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Goatius Notes" />
        <meta name="msapplication-TileColor" content="#4d5eff" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no, viewport-fit=cover" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icon.png" />
        
        {/* Splash Screens for iOS */}
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/icon.png" as="image" />
      </head>
      <body className={`${inter.variable} font-body antialiased`}>
        <PWAProvider>
          <div className="flex h-screen w-full overflow-hidden">
            {children}
          </div>
          <Toaster />
        </PWAProvider>
      </body>
    </html>
  );
}
