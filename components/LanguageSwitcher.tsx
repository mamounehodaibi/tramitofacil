"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales } from "@/i18n";

const LABELS: Record<string, string> = {
  es: "ES",
  en: "EN",
  fr: "FR",
  ar: "AR",
};

export default function LanguageSwitcher({ current }: { current: string }) {
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(locale: string) {
    const segments = pathname.split("/");
    segments[1] = locale;
    router.push(segments.join("/"));
  }

  return (
    <div className="flex items-center gap-1 rounded-full border hairline p-1 text-xs font-utility">
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          className={`px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
            l === current
              ? "bg-ink text-paper"
              : "text-ink-soft hover:text-ink"
          }`}
          aria-current={l === current}
        >
          {LABELS[l]}
        </button>
      ))}
    </div>
  );
}
