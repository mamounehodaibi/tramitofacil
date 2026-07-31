"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

type Step = { title: string; body: string };

export default function ProcedureWizard({
  procedureId,
  namespace,
}: {
  procedureId: string;
  namespace: string;
}) {
  const t = useTranslations(namespace);
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const steps = t.raw("steps") as Step[];
  const [index, setIndex] = useState(0);

  const isLast = index === steps.length - 1;
  const isFirst = index === 0;
  const step = steps[index];

  function downloadChecklist() {
    const lines = steps
      .map((s, i) => `${i + 1}. ${s.title}\n   ${s.body}`)
      .join("\n\n");
    const blob = new Blob([`${t("title")}\n\n${lines}`], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${procedureId}-checklist.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <p className="font-utility text-xs tracking-[0.2em] text-stamp uppercase mb-3">
          {t("title")}
        </p>
        <h1 className="font-display text-3xl font-semibold">{t("subtitle")}</h1>
      </div>

      {/* progress */}
      <div className="flex items-center gap-1.5 mb-8" dir={dir}>
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= index ? "bg-stamp" : "bg-line"
            }`}
          />
        ))}
      </div>

      <div className="border hairline rounded-[28px] p-8 bg-paper-raised min-h-[220px]">
        <span className="font-utility text-xs text-ink-soft">
          {t("stepLabel", { current: index + 1, total: steps.length })}
        </span>
        <h2 className="font-display text-xl font-semibold mt-3 mb-3">
          {step.title}
        </h2>
        <p className="text-ink-soft leading-relaxed">{step.body}</p>
      </div>

      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={isFirst}
          className="text-sm font-medium px-5 py-2.5 rounded-full border hairline disabled:opacity-30 disabled:cursor-not-allowed hover:bg-paper-raised transition-colors cursor-pointer"
        >
          {t("prev")}
        </button>

        {isLast ? (
          <div className="flex items-center gap-3">
            <button
              onClick={downloadChecklist}
              className="text-sm font-medium px-5 py-2.5 rounded-full border hairline hover:bg-paper-raised transition-colors cursor-pointer"
            >
              {t("finish")}
            </button>
            <Link
              href={`/${locale}/${procedureId}/upload`}
              className="text-sm font-medium px-6 py-2.5 rounded-full bg-stamp text-paper hover:opacity-90 transition-opacity"
            >
              {t("uploadCta")}
            </Link>
          </div>
        ) : (
          <button
            onClick={() => setIndex((i) => Math.min(steps.length - 1, i + 1))}
            className="text-sm font-medium px-6 py-2.5 rounded-full bg-ink text-paper hover:bg-stamp transition-colors cursor-pointer"
          >
            {t("next")}
          </button>
        )}
      </div>
    </div>
  );
}
