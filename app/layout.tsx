import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import PwaRegister from "./PwaRegister";
import AnalyticsTracker from "./AnalyticsTracker";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL || "https://hephzibahjones.online"),
  title: "Portfolio | Ideas into useful things",
  description: "A portfolio of technology, research, and creative work.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://hephzibahjones.online",
    siteName: "Hephzibah Jones Portfolio",
    title: "Portfolio | Ideas into useful things",
    description: "A portfolio of technology, research, and creative work.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"><PwaRegister /><AnalyticsTracker />{children}</body>
    </html>
  );
}
