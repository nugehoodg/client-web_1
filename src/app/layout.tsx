import type { Metadata } from "next";
import { Outfit, Oi } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "600", "800", "900"],
  variable: "--font-outfit",
});

const oi = Oi({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-oi",
});

export const metadata: Metadata = {
  title: "Your Name - Professional Title",
  description: "A highly motivated professional with extensive experience. Delivering high-quality results and value.",
  keywords: ["Professional", "Portfolio", "Services", "Your Name"],
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "Your Name - Professional Title",
    description: "A highly motivated professional with extensive experience. Delivering high-quality results and value.",
    url: "https://your-website.com/",
    type: "website",
    images: [{ url: "https://your-website.com/img/placeholder.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Name - Professional Title",
    description: "A highly motivated professional with extensive experience. Delivering high-quality results and value.",
    images: ["https://your-website.com/img/placeholder.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body className={`${outfit.variable} ${oi.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
