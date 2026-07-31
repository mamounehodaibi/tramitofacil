import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Logo from "./Logo";

export async function CtaSection({ locale }: { locale: string }) {
  const t = await getTranslations("cta");

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:py-28 text-center">
      <h2 className="font-display text-3xl md:text-4xl font-semibold max-w-xl mx-auto leading-tight">
        {t("title")}
      </h2>
      <p className="text-ink-soft mt-4 max-w-md mx-auto">{t("body")}</p>
      <Link
        href={`/${locale}/nie`}
        className="inline-block mt-8 bg-ink text-paper font-medium px-7 py-3.5 rounded-full hover:bg-stamp transition-colors"
      >
        {t("button")}
      </Link>
    </section>
  );
}

export async function Footer({ locale }: { locale: string }) {
  const t = await getTranslations();

  return (
    <footer className="border-t hairline mt-auto">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-xs text-ink-soft leading-relaxed max-w-2xl">
          {t("disclaimer")}
        </p>
        <div className="flex items-center justify-between mt-6 text-sm text-ink-soft">
          <Logo />
          <span>© {new Date().getFullYear()} TramitoFácil — {t("footer.rights")}</span>
        </div>
      </div>
    </footer>
  );
}
