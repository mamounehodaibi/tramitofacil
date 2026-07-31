import { getTranslations } from "next-intl/server";

export default async function Pricing({ locale }: { locale: string }) {
  const t = await getTranslations("pricing");

  return (
    <section id="pricing" className="border-y hairline bg-paper-raised">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <h2 className="font-display text-2xl md:text-3xl font-semibold mb-12">
          {t("title")}
        </h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
          <div className="border hairline rounded-[28px] p-8 bg-paper">
            <h3 className="font-medium text-ink-soft">{t("free.name")}</h3>
            <p className="font-display text-4xl font-semibold mt-3">{t("free.price")}</p>
            <p className="text-sm text-ink-soft mt-4 leading-relaxed">{t("free.desc")}</p>
            <a
              href={`/${locale}/nie`}
              className="mt-6 inline-block text-sm font-medium border hairline rounded-full px-5 py-2.5 hover:bg-paper-raised transition-colors"
            >
              {t("free.cta")}
            </a>
          </div>
          <div className="border border-stamp rounded-[28px] p-8 bg-paper relative">
            <h3 className="font-medium text-stamp">{t("paid.name")}</h3>
            <p className="font-display text-4xl font-semibold mt-3">
              {t("paid.price")}
              <span className="text-base font-normal text-ink-soft">{t("paid.period")}</span>
            </p>
            <p className="text-sm text-ink-soft mt-4 leading-relaxed">{t("paid.desc")}</p>
            <a
              href={`/${locale}/nie`}
              className="mt-6 inline-block text-sm font-medium bg-stamp text-paper rounded-full px-5 py-2.5 hover:opacity-90 transition-opacity"
            >
              {t("paid.cta")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
