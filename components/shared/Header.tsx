"use client";

import { useSession } from "@/lib/auth/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
    <header className="h-16 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-6">
      <div>
        <h2 className="text-white font-semibold text-lg leading-none">
          {title}
        </h2>
        {description && (
          <p className="text-slate-400 text-sm mt-1">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-white text-sm font-medium leading-none">
            {session?.user?.name ?? "Developer"}
          </p>
          <p className="text-slate-400 text-xs mt-1">
            {session?.user?.email ?? ""}
          </p>
        </div>
        <Avatar className="h-9 w-9 bg-blue-600">
          <AvatarFallback className="bg-blue-600 text-white text-sm font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}