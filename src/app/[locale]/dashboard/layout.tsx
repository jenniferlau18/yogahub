import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth/actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "owner") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
        <div className="text-center p-8">
          <p className="text-5xl mb-4">🏠</p>
          <h1 className="text-xl font-semibold text-[#2D2D2D] mb-2">
            Studio Owners Only
          </h1>
          <p className="text-gray-500 mb-6">
            This area is for studio owners. Sign up as an owner to list your
            studio.
          </p>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-100 p-4 flex flex-col">
        <Link href="/dashboard" className="text-lg font-semibold text-[#2D2D2D] mb-8">
          🧘 YogaHub
        </Link>

        <nav className="space-y-1 flex-1">
          <SidebarLink href="/dashboard">📊 Overview</SidebarLink>
          <SidebarLink href="/dashboard/studios/new">➕ Add Studio</SidebarLink>
          <SidebarLink href="/dashboard/bookings">📋 Bookings</SidebarLink>
        </nav>

        <div className="border-t pt-4 mt-auto">
          <p className="text-sm text-gray-500 mb-3 truncate">
            {profile.full_name || user.email}
          </p>
          <Link href="/profile">
            <Button variant="outline" size="sm" className="w-full mb-2">
              Edit Profile
            </Button>
          </Link>
          <form action={signOut}>
            <Button variant="ghost" size="sm" className="w-full text-gray-500">
              Sign Out
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

function SidebarLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-[#7C9082]/10 hover:text-[#7C9082] transition-colors"
    >
      {children}
    </Link>
  );
}
