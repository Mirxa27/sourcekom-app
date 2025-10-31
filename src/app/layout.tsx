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

const themeInitScript = `
(() => {
  try {
    const root = document.documentElement;
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    const systemMode = prefersDark && prefersDark.matches ? 'dark' : 'light';
    const mode = stored === 'light' || stored === 'dark'
      ? stored
      : stored === 'system'
        ? systemMode
        : systemMode;
    root.setAttribute('data-theme', mode);
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  } catch (error) {
    // ignore - theme will fall back to system preference
  }
})();`;

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-app text-app`}
      >
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
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
