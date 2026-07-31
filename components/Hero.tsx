import { getTranslations } from "next-intl/server";
import Link from "next/link";
import StampSeal from "./StampSeal";

export default async function Hero({ locale }: { locale: string }) {
  const t = await getTranslations("hero");
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 md:pt-24 md:pb-28">
      <div className="grid md:grid-cols-[1.3fr_0.7fr] gap-12 items-center">
        <div>
          <p className="font-utility text-xs tracking-[0.2em] text-stamp uppercase mb-5">
            {t("eyebrow")}
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-[3.4rem] font-semibold leading-[1.08] tracking-tight text-ink">
            {t("title")}
          </h1>
          <p className="mt-6 text-lg text-ink-soft max-w-xl leading-relaxed">
            {t("subtitle")}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href={`/${locale}/nie`}
              className="bg-stamp text-paper font-medium px-6 py-3.5 rounded-full hover:opacity-90 transition-opacity"
            >
              {t("cta")}
            </Link>
            <a
              href="#procedures"
              className="text-ink font-medium px-6 py-3.5 rounded-full border hairline hover:bg-paper-raised transition-colors"
            >
              {t("ctaSecondary")}
            </a>
          </div>
        </div>
        <div className="flex justify-center md:justify-end">
          <StampSeal text={t("stampText")} sub={t("stampSub")} dir={dir} />
        </div>
      </div>
    </section>
  );
}
