import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "YogaHub — Find & Book Yoga Classes Near You",
    template: "%s | YogaHub",
  },
  description:
    "Discover and book yoga classes at studios near you. Studio owners — list your space and reach more students. Fair pricing for small studios.",
  keywords: ["yoga", "yoga classes", "book yoga", "yoga studio", "yoga near me"],
  openGraph: {
    title: "YogaHub — Find & Book Yoga Classes Near You",
    description:
      "Discover and book yoga classes at studios near you. Fair pricing for small studios.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#FAFAF8] text-[#2D2D2D]">
        {children}
      </body>
    </html>
  );
}
