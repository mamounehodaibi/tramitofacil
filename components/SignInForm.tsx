"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { signInWithEmail } from "@/app/actions/auth";

export default function SignInForm({ locale }: { locale: string }) {
  const t = useTranslations("account");
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="max-w-sm">
      {sent ? (
        <p className="text-ink-soft">{t("checkYourEmail")}</p>
      ) : (
        <form
          action={(formData) => {
            setError(null);
            startTransition(async () => {
              const result = await signInWithEmail(locale, formData);
              if (result.error) {
                setError(t(`error.${result.error}`));
              } else {
                setSent(true);
              }
            });
          }}
          className="flex flex-col gap-3"
        >
          <label htmlFor="email" className="text-sm font-medium text-ink">
            {t("emailLabel")}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="tu@email.com"
            className="border hairline rounded-lg px-4 py-2 bg-paper text-ink focus:outline-none focus:ring-2 focus:ring-stamp"
          />
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={isPending}
            className="bg-ink text-paper text-sm font-medium px-4 py-2 rounded-full hover:bg-stamp transition-colors disabled:opacity-60"
          >
            {isPending ? t("sending") : t("sendLink")}
          </button>
        </form>
      )}
    </div>
  );
}
