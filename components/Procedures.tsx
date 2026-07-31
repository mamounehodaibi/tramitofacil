import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function Procedures({ locale }: { locale: string }) {
  const t = await getTranslations("procedures");

  const cards = [
    { key: "nie", href: `/${locale}/nie`, live: true },
    { key: "empadronamiento", href: `/${locale}/empadronamiento`, live: true },
    { key: "autonomo", href: `/${locale}/autonomo`, live: true },
    { key: "seguridad", href: `/${locale}/seguridad`, live: true },
  ];

  return (
    <section id="procedures" className="border-y hairline bg-paper-raised">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <h2 className="font-display text-2xl md:text-3xl font-semibold mb-10">
          {t("title")}
        </h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {cards.map((card) => (
            <Link
              key={card.key}
              href={card.href}
              className="group border hairline rounded-[28px] p-6 flex items-start justify-between gap-4 hover:border-stamp transition-colors bg-paper"
            >
              <div>
                <h3 className="font-medium text-ink">
                  {t(`${card.key}.name` as "nie.name")}
                </h3>
                <p className="text-sm text-ink-soft mt-1">
                  {t(`${card.key}.desc` as "nie.desc")}
                </p>
              </div>
              {card.live && (
                <span className="shrink-0 font-utility text-[10px] tracking-wider uppercase text-stamp border border-stamp rounded-full px-2 py-1 mt-1">
                  live
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
