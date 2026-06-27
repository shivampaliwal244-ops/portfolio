import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from '@/components/Nav-bar/Nav';
import Footer from '@/components/Footer/Footer';
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shivam Paliwal - Portfolio",
  description: "Full Stack Developer Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Nav />
        {children}
        <Footer />
        <SpeedInsights />

        <Script
  src="https://ai-voice-assistant-y7a8.onrender.com/assistant.js"
  data-user-id="6a3ea3bdd25603316e0a2a92"
  strategy="afterInteractive"
/>
      </body>
    </html>
  );
}
