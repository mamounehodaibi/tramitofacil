import { getTranslations } from "next-intl/server";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import Logo from "./Logo";

export default async function Nav({ locale }: { locale: string }) {
  const t = await getTranslations("nav");

  return (
    <header className="w-full border-b hairline">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link href={`/${locale}`} aria-label="TramitoFácil">
          <Logo />
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-ink-soft">
          <a href="#how" className="hover:text-ink transition-colors">{t("howItWorks")}</a>
          <a href="#procedures" className="hover:text-ink transition-colors">{t("procedures")}</a>
          <a href="#pricing" className="hover:text-ink transition-colors">{t("pricing")}</a>
          <Link href={`/${locale}/cuenta`} className="hover:text-ink transition-colors">{t("account")}</Link>
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher current={locale} />
          <a
            href="#pricing"
            className="hidden sm:inline-block bg-ink text-paper text-sm font-medium px-4 py-2 rounded-full hover:bg-stamp transition-colors"
          >
            {t("start")}
          </a>
        </div>
      </div>
    </header>
  );
}
