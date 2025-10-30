import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "@/components/error-boundary";
import { StructuredData } from "@/components/layout/structured-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SourceKom - Resource Management & Legal Consultancy in Saudi Arabia",
  description: "SourceKom is an innovative resource sharing and legal consultancy platform operating in Saudi Arabia. We connect businesses to maximize potential and foster sustainable growth through resource optimization.",
  keywords: ["SourceKom", "Saudi Arabia", "resource management", "legal consultancy", "business optimization", "logistics", "supply chain", "sustainability", "Abdullah Mirza"],
  authors: [{ name: "SourceKom Team" }],
  openGraph: {
    title: "SourceKom - Adding strength to businesses, businesses to strengths",
    description: "Innovative resource sharing and legal consultancy platform in Saudi Arabia, empowering businesses through resource optimization and legal expertise.",
    url: "https://sourcekom.com",
    siteName: "SourceKom",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SourceKom - Resource Management & Legal Consultancy",
    description: "Transforming the Saudi market through resource optimization and legal expertise",
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
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.myfatoorah.com" />
        
        {/* DNS prefetch for likely navigation */}
        <link rel="dns-prefetch" href="//sourcekom.com" />
        
        {/* Theme and color scheme */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="color-scheme" content="light dark" />
        
        {/* Apple touch icon */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Manifest */}
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <StructuredData 
          type="Organization" 
          data={{
            foundingDate: "2024",
            founder: {
              '@type': 'Person',
              name: 'Abdullah Mirza'
            }
          }}
        />
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <Toaster />
      </body>
    </html>
  );
}
