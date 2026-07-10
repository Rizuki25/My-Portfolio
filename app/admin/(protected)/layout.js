import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../../lib/supabase/server";

export default async function ProtectedAdminLayout({ children }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: admin } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin) redirect("/admin/login?error=unauthorized");

  return children;
}
