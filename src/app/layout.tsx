import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "YogaHub — Find & Book Yoga Classes Near You",
    template: "%s | YogaHub",
  },
  description:
    "Discover and book yoga classes at studios near you. Fair pricing for small studios.",
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
  return children;
}
