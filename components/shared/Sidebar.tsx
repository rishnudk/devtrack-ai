"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  Settings,
  LogOut,
  Code2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Topics",
    href: "/topics",
    icon: BookOpen,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    router.push("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-[#0A0A0A] border-r border-neutral-900 flex flex-col font-sans">
      {/* Logo */}
      <div className="p-8 border-b border-neutral-900">
        <div className="flex flex-col gap-4">
          <div className="w-8 h-8 bg-white flex items-center justify-center rounded-none shadow-none">
            <Code2 className="h-5 w-5 text-black" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-white font-semibold text-xl tracking-tight leading-none">
              DevTrack
            </h1>
            <p className="text-neutral-500 font-mono text-[10px] uppercase mt-2 tracking-widest">Workspace</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-8 py-3 text-sm font-medium transition-colors border-l-2",
                  isActive
                    ? "border-white bg-[#111] text-white"
                    : "border-transparent text-neutral-500 hover:text-white hover:bg-[#111]"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="p-4 border-t border-neutral-900">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-neutral-500 hover:text-white hover:bg-[#111] rounded-none h-12"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          <span className="font-medium text-sm">Sign out</span>
        </Button>
      </div>
    </aside>
  );
}