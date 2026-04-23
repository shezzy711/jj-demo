import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "J&J Plumbing",
  description: "Field-to-office workflow for J&J Plumbing — powered by Evios",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "J&J Plumbing",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full`}>
      <body className="min-h-full bg-background text-foreground antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
