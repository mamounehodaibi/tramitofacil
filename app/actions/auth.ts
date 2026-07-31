"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Sends a magic-link sign-in email. No passwords to manage — the link in
 * the email carries the user back to /auth/callback, which exchanges it
 * for a session.
 */
export async function signInWithEmail(
  locale: string,
  formData: FormData
): Promise<{ error: string | null }> {
  const email = formData.get("email")?.toString().trim();
  if (!email) return { error: "missing_email" };

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback?locale=${locale}`,
    },
  });

  if (error) {
    console.error("signInWithOtp error:", error.message);
    return { error: "send_failed" };
  }

  return { error: null };
}

export async function signOut(locale: string) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(`/${locale}`);
}
