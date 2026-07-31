import { getTranslations } from "next-intl/server";

export default async function HowItWorks() {
  const t = await getTranslations("how");
  const steps = t.raw("steps") as { n: string; title: string; body: string }[];

  return (
    <section id="how" className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <h2 className="font-display text-2xl md:text-3xl font-semibold mb-12">
        {t("title")}
      </h2>
      <div className="grid md:grid-cols-4 gap-8">
        {steps.map((step, i) => (
          <div key={i} className="relative">
            <span className="font-utility text-3xl text-stamp-soft font-semibold">
              {step.n}
            </span>
            <h3 className="font-medium mt-3 mb-2">{step.title}</h3>
            <p className="text-sm text-ink-soft leading-relaxed">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
