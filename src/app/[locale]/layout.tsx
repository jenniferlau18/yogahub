import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Inter } from "next/font/google";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

type Params = { params: Promise<{ locale: string }> };

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
} & Params) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "zh")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <div className={`${inter.variable} font-sans`}>
      <NextIntlClientProvider messages={messages} locale={locale}>
        {children}
      </NextIntlClientProvider>
    </div>
  );
}
