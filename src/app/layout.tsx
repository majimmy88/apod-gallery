import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import SkipLink from "@/components/SkipLink";
import Header from "@/components/Header";
import ClientProviders from "@/components/ClientProviders";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "APOD Gallery — NASA Astronomy Picture of the Day",
  description:
    "Browse NASA's Astronomy Picture of the Day archive in a beautiful, accessible gallery.",
};

// Runs before React hydrates to prevent flash of wrong theme
const themeScript = `
try {
  const t = localStorage.getItem('apod-theme');
  const d = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (t === 'dark' || (!t && d)) document.documentElement.classList.add('dark');
} catch(e) {}
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-gray-50 font-[family-name:var(--font-geist)] text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <ClientProviders>
          <SkipLink />
          <Header />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
