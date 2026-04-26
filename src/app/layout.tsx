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
  title: {
    default: "Saswat Barai — Backend Engineer",
    template: "%s | Saswat Barai",
  },
  description:
    "Saswat Barai's portfolio — backend-focused software engineer building scalable APIs, microservices, and real-time applications.",
  keywords: [
    "Saswat Barai",
    "Backend Engineer",
    "Node.js Developer",
    "Next.js Portfolio",
    "TypeScript",
    "Microservices",
    "Software Engineer",
  ],
  authors: [{ name: "Saswat Barai", url: "https://saswat.dev" }],
  creator: "Saswat Barai",
  icons: {
    icon: [
      { url: "/profile.jpg", sizes: "32x32", type: "image/jpeg" },
      { url: "/profile.jpg", sizes: "192x192", type: "image/jpeg" },
      { url: "/profile.jpg", sizes: "512x512", type: "image/jpeg" },
    ],
    shortcut: ["/profile.jpg"],
    apple: [{ url: "/profile.jpg", sizes: "180x180", type: "image/jpeg" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Saswat Barai — Backend Engineer",
    description:
      "Backend-focused software engineer building scalable APIs, microservices, and real-time systems.",
    url: "https://saswat-barai.me",
    siteName: "Saswat's Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/profile.jpg",
        width: 1200,
        height: 1200,
        alt: "Saswat Barai",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Saswat Barai — Backend Engineer",
    description: "Portfolio of Saswat Barai.",
    creator: "@saswat_ig",
    images: ["/profile.jpg"],
  },
  metadataBase: new URL("https://saswat.dev"),
  alternates: { canonical: "/" },
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
