import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  if (!supabase) redirect("/admin/login");
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  return <>{children}</>;
}
