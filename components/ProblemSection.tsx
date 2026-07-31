import { getTranslations } from "next-intl/server";

export default async function ProblemSection() {
  const t = await getTranslations("problem");
  const items = t.raw("items") as { title: string; body: string }[];

  return (
    <section className="border-y hairline bg-paper-raised">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <h2 className="font-display text-2xl md:text-3xl font-semibold mb-10 max-w-lg">
          {t("title")}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <div key={i} className="border-t-2 border-ink pt-4">
              <h3 className="font-medium text-ink mb-2">{item.title}</h3>
              <p className="text-sm text-ink-soft leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
