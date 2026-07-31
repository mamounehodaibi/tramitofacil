import createMiddleware from 'next-intl/middleware';
import type {NextRequest} from 'next/server';
import {locales, defaultLocale} from './i18n';
import {refreshSupabaseSession} from './lib/supabase/proxy';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export default async function proxy(request: NextRequest) {
  const response = intlMiddleware(request);
  return refreshSupabaseSession(request, response);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
