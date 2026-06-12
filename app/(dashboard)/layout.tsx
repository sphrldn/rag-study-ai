import { DashboardNav } from "@/components/layout/DashboardNav";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      <DashboardNav user={session.user} />
      <main className="flex-1 min-h-screen overflow-auto">{children}</main>
    </div>
  );
}
