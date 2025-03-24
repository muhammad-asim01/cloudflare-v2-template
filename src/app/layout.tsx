import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const Providers = dynamic(
  () => import("@/components/Providers").then((mod) => mod.Providers),
  {
    ssr: true,
  }
);

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Web3 DApp",
    template: "%s | Web3 DApp",
  },
  description:
    "A modern Web3 decentralized application with wallet integration",
  keywords: ["Web3", "DApp", "Blockchain", "Ethereum", "Wallet", "Crypto"],
  authors: [{ name: "Maryam naveed" }],
  creator: "Funavry technologies",
  publisher: "Funavry technologies",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cgpt-dot-fun-frontend.vercel.app/",
    siteName: "Web3 DApp",
    title: "Web3 DApp - Connect Your Wallet",
    description:
      "A modern Web3 decentralized application with wallet integration",
    images: [
      {
        url: "https://cgpt-dot-fun-frontend.vercel.app/assets/icons/header/top-logo-dark.svg",
        width: 1200,
        height: 630,
        alt: "Web3 DApp Open Graph Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Web3 DApp - Connect Your Wallet",
    description:
      "A modern Web3 decentralized application with wallet integration",
    images: ["https://your-domain.com/twitter-image.jpg"],
    creator: "@yourtwitter",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense fallback={null}>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}
