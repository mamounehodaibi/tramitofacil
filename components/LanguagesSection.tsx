import { getTranslations } from "next-intl/server";

export default async function LanguagesSection() {
  const t = await getTranslations("languages");

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="grid md:grid-cols-[1fr_auto] gap-10 items-center">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-semibold mb-4 max-w-lg">
            {t("title")}
          </h2>
          <p className="text-ink-soft max-w-lg leading-relaxed">{t("body")}</p>
        </div>
        <div className="flex flex-wrap gap-3 font-utility text-sm">
          {["Español", "English", "Français", "العربية"].map((l) => (
            <span
              key={l}
              className="border hairline rounded-full px-4 py-2 text-ink-soft"
            >
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
