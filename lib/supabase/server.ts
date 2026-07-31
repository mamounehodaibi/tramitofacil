import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase client for use in Server Components, Server Actions, and Route
 * Handlers. Reads/writes the auth session via cookies, so the logged-in
 * user's identity flows through automatically and RLS policies apply.
 *
 * Note: calling `.set()` from a Server Component (rather than a Server
 * Action or Route Handler) will throw — that's expected and safe to ignore,
 * since the proxy (see proxy.ts / lib/supabase/proxy.ts) is what actually
 * refreshes the session cookie on every request.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — the proxy already refreshes
            // the session, so this can be safely ignored.
          }
        },
      },
    }
  );
}
