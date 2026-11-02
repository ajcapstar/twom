import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import AddProductForm from "@/components/AddProductForm";

export const instant = false;

export default async function AdminDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const handleSignOut = async () => {
    "use server";
    const client = await createClient();
    await client.auth.signOut();
    redirect("/admin/login");
  };

  return (
    <div className="min-h-screen bg-twom-bg pt-28 pb-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-zinc-200">
          <div>
            <h1 className="font-zodiak text-4xl text-twom-title mb-1">
              Admin Dashboard
            </h1>
            <p className="text-twom-muted text-sm">
              Authenticated as {user?.email}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/orders"
              className="px-4 py-2 text-xs uppercase tracking-wider text-twom-title border border-twom-title hover:bg-twom-title hover:text-white transition-colors"
            >
              Manage Orders →
            </Link>

            <form action={handleSignOut}>
              <button
                type="submit"
                className="px-4 py-2 text-xs uppercase tracking-wider text-zinc-600 border border-zinc-300 hover:text-black hover:border-black transition-colors cursor-pointer"
              >
                Log Out
              </button>
            </form>
          </div>
        </div>

        {/* The Product Form */}
        <div className="bg-white p-8 border border-zinc-200 shadow-sm">
          <h2 className="font-zodiak text-2xl mb-6">Add New Product</h2>
          <AddProductForm />
        </div>
      </div>
    </div>
  );
}
