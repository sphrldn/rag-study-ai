"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import {
  Sparkles, MessageSquare, LayoutDashboard, FileText, Settings, LogOut, Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavProps {
  user?: { name?: string | null; email?: string | null; image?: string | null };
}

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/chat", icon: MessageSquare, label: "Chat" },
  { href: "/documents", icon: FileText, label: "Dokumen" },
  { href: "/settings", icon: Settings, label: "Pengaturan" },
];

export function DashboardNav({ user }: NavProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen glass border-r border-white/5 flex flex-col py-4 sticky top-0">
      {/* Logo */}
      <div className="px-4 mb-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold">StudyAI</span>
        </Link>
      </div>

      {/* New chat button */}
      <div className="px-4 mb-4">
        <Link
          href="/chat"
          className="flex items-center gap-2 btn-gradient px-3 py-2.5 rounded-xl text-sm font-semibold text-white w-full"
        >
          <Plus className="w-4 h-4" />
          Chat Baru
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                active
                  ? "bg-indigo-500/15 text-white border border-indigo-500/20"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className={cn("w-4 h-4", active ? "text-indigo-400" : "")} />
              {item.label}
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-4 pt-4 border-t border-white/5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user?.name ?? "User"}</p>
            <p className="text-white/40 text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          Keluar
        </button>
      </div>
    </aside>
  );
}
