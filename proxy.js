import { updateSupabaseSession } from "./lib/supabase/proxy";

export async function proxy(request) {
  return updateSupabaseSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
