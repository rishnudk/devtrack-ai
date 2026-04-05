"use client";

import { useSession } from "@/lib/auth/client";

interface HeaderProps {
  title: string;
  description?: string;
}

export default function Header({ title, description }: HeaderProps) {
  const { data: session } = useSession();

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <header className="h-24 border-b border-neutral-900 bg-[#0A0A0A] flex items-center justify-between px-10 font-sans">
      <div>
        <h2 className="text-white font-medium text-2xl tracking-tight leading-none">
          {title}
        </h2>
        {description && (
          <p className="text-neutral-500 text-sm mt-3 font-light">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-white text-sm font-medium leading-none mb-1">
            {session?.user?.name ?? "Developer"}
          </p>
          <p className="text-neutral-600 text-xs font-mono">
            {session?.user?.email ?? "USER"}
          </p>
        </div>
        <div className="w-10 h-10 bg-white text-black flex items-center justify-center text-sm font-bold tracking-widest border border-neutral-800">
          {initials}
        </div>
      </div>
    </header>
  );
}