import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Saswat Barai — Builder & Creator",
  description: "Portfolio of Saswat Barai — CSE undergrad passionate about modern web development, AI, and creating elegant solutions to complex problems. Exploring React, Next.js, TailwindCSS, Node.js, and more.",
  keywords: [
    "Saswat Barai",
    "Web Developer",
    "React",
    "Next.js",
    "Tailwind CSS",
    "AI Developer",
    "Portfolio",
    "Frontend Developer",
    "Backend Developer",
    "Software Engineer",
  ],
  authors: [{ name: "Saswat Barai", url: "https://saswat.dev" }], // Assuming a new URL; adjust if needed
  creator: "Saswat Barai",
  
  // 🎯 ICONS - Best for SEO
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
      },
    ],
  },
  
  // 🎯 MANIFEST - Important for PWA and mobile SEO
  manifest: '/site.webmanifest',
  
  openGraph: {
    title: "Saswat Barai — Builder & Creator",
    description: "Portfolio of Saswat Barai — CSE undergrad passionate about modern web development, AI, and creating elegant solutions to complex problems.",
    url: "https://saswat-barai.me", // Updated URL
    siteName: "Saswat's Portfolio",
    images: [
      {
        url: "https://saswat.dev/og-image.png", // Updated URL
        width: 1200,
        height: 630,
        alt: "Saswat Barai Portfolio"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Saswat Barai — Builder & Creator",
    description: "Portfolio of Saswat Barai — CSE undergrad passionate about modern web development, AI, and creating elegant solutions to complex problems.",
    images: ["https://saswat.dev/og-image.png"], // Updated URL
    creator: "@saswat_ig" // Updated to match page.tsx
  },
  
  // 🎯 Additional SEO metadata
  metadataBase: new URL('https://saswat.dev'), // Updated URL
  alternates: {
    canonical: '/',
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
