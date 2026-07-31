import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import SignInForm from "@/components/SignInForm";
import { signOut } from "@/app/actions/auth";

const STATUS_STYLES: Record<string, string> = {
  accepted: "border-emerald-600 text-emerald-700 bg-emerald-50",
  needs_review: "border-stamp text-stamp bg-stamp/5",
  rejected: "border-red-700 text-red-700 bg-red-50",
};

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("account");
  const supabaseConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

  if (!supabaseConfigured) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="font-display text-3xl text-ink mb-4">{t("title")}</h1>
        <p className="text-ink-soft">{t("notConfigured")}</p>
      </main>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="font-display text-3xl text-ink mb-2">{t("title")}</h1>
        <p className="text-ink-soft mb-8">{t("signInPrompt")}</p>
        <SignInForm locale={locale} />
      </main>
    );
  }

  const { data: validations } = await supabase
    .from("document_validations")
    .select("id, procedure_id, filename, status, notes, demo, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-display text-3xl text-ink">{t("title")}</h1>
        <form
          action={async () => {
            "use server";
            await signOut(locale);
          }}
        >
          <button
            type="submit"
            className="text-sm text-ink-soft hover:text-ink transition-colors"
          >
            {t("signOut")}
          </button>
        </form>
      </div>
      <p className="text-ink-soft mb-8">{user.email}</p>

      <h2 className="font-display text-xl text-ink mb-4">{t("history")}</h2>
      {!validations || validations.length === 0 ? (
        <p className="text-ink-soft">{t("noHistory")}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {validations.map((v) => (
            <li
              key={v.id}
              className={`border rounded-lg px-4 py-3 ${STATUS_STYLES[v.status] ?? "hairline"}`}
            >
              <div className="flex items-center justify-between text-sm font-medium">
                <span>
                  {v.procedure_id} · {v.filename}
                </span>
                <span>{new Date(v.created_at).toLocaleDateString(locale)}</span>
              </div>
              <p className="text-sm mt-1">{v.notes}</p>
              {v.demo && (
                <p className="text-xs mt-1 opacity-70">{t("demoTag")}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
