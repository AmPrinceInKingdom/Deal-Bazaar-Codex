import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminUsersPage() {
  const supabase = await createSupabaseServerClient();
  const users = supabase
    ? await supabase.from("users").select("*").order("created_at", { ascending: false })
    : { data: [] };

  return (
    <div className="surface overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email / ID</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.data?.map((user) => (
              <tr key={user.id} className="border-t border-border">
                <td className="px-4 py-3">{user.full_name || "-"}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{user.id}</td>
                <td className="px-4 py-3">{user.phone || "-"}</td>
                <td className="px-4 py-3">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
