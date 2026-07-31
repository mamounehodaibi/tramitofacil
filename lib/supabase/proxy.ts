import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the Supabase auth session cookie on every request that passes
 * through the proxy, and copies any updated cookies onto `response` (which
 * is the response next-intl's middleware already produced, e.g. a locale
 * redirect) so the session survives regardless of what next-intl does.
 *
 * This does NOT gate access to any route — it only keeps the session alive.
 * Actual access control is done via RLS policies in Postgres/Storage, and
 * page-level checks (e.g. redirecting signed-out users away from /cuenta).
 */
export async function refreshSupabaseSession(
  request: NextRequest,
  response: NextResponse
): Promise<NextResponse> {
  // If Supabase isn't configured yet (no env vars set), skip silently so the
  // rest of the app still works without it.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return response;

  let updatedResponse = response;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        // Cookies must be set on a response tied to the *current* request,
        // so we rebuild `updatedResponse` while preserving next-intl's
        // rewrite/redirect/headers already present on `response`.
        updatedResponse = new NextResponse(response.body, response);
        cookiesToSet.forEach(({ name, value, options }) =>
          updatedResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Required so an expired access token gets refreshed before it's used
  // anywhere downstream (Server Components, Route Handlers, etc.).
  await supabase.auth.getUser();

  return updatedResponse;
}
