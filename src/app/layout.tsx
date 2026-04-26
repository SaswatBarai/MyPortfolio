import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Saswat Barai — Builder & Creator",
  description: "Portfolio of Saswat Barai — CSE undergrad passionate about modern web development, AI, and creating elegant solutions to complex problems.",
  keywords: ["Saswat Barai", "Web Developer", "React", "Next.js", "Tailwind CSS", "Portfolio", "Backend Developer", "Software Engineer"],
  authors: [{ name: "Saswat Barai", url: "https://saswat.dev" }],
  creator: "Saswat Barai",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: "Saswat Barai — Builder & Creator",
    description: "Portfolio of Saswat Barai — CSE undergrad passionate about modern web development.",
    url: "https://saswat-barai.me",
    siteName: "Saswat's Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saswat Barai — Builder & Creator",
    description: "Portfolio of Saswat Barai.",
    creator: "@saswat_ig",
  },
  metadataBase: new URL('https://saswat.dev'),
  alternates: { canonical: '/' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${spaceMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
