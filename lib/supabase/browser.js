import { createBrowserClient } from "@supabase/ssr";

let client;

export function getSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) return null;

  if (!client) {
    client = createBrowserClient(url, publishableKey);
  }

  return client;
}

export function getPortfolioAssetUrl(path) {
  if (!path) return null;
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;
  return supabase.storage.from("portfolio-assets").getPublicUrl(path).data.publicUrl;
}
