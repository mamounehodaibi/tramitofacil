import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import {
  Zilla_Slab,
  Inter,
  IBM_Plex_Mono,
  Cairo,
  Noto_Kufi_Arabic,
} from "next/font/google";
import { locales, rtlLocales, type Locale } from "@/i18n";
import "../globals.css";

// Real fonts for the paper/ink/stamp design system: a slab-serif display
// face (evokes official stamped documents), Inter for body text, and a
// monospace face for the "stamp"/utility text. Arabic gets its own display +
// body pairing so RTL locales don't fall back to the Latin faces.
const display = Zilla_Slab({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});
const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
const utility = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-utility",
  display: "swap",
});
const displayAr = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  weight: ["600", "700"],
  variable: "--font-display-ar",
  display: "swap",
});
const bodyAr = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  variable: "--font-body-ar",
  display: "swap",
});

const fontVariables = [
  display.variable,
  body.variable,
  utility.variable,
  displayAr.variable,
  bodyAr.variable,
].join(" ");

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();

  const messages = await getMessages();
  const dir = rtlLocales.includes(locale as Locale) ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`h-full antialiased ${fontVariables}`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
