"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

interface EventTabsProps {
  eventId: string;
}

const TABS = [
  { label: "Configuration", href: "", icon: "⚙️" },
  { label: "Participants", href: "/participants", icon: "👥" },
  { label: "Check-in", href: "/checkin", icon: "✅" },
  { label: "Dashboard", href: "/dashboard", icon: "📊" },
  { label: "Délibération", href: "/deliberation", icon: "🏆" },
  { label: "Ressources", href: "/resources", icon: "📦" },
] as const;

export function EventTabs({ eventId }: EventTabsProps) {
  const pathname = usePathname();

  const isActive = (tabHref: string) => {
    const fullPath = `/admin/events/${eventId}${tabHref}`;
    if (tabHref === "") {
      return pathname === `/admin/events/${eventId}`;
    }
    return pathname.startsWith(fullPath);
  };

  return (
    <nav className="border-b-2 border-slate-200" aria-label="Onglets de l'événement">
      <ul className="flex flex-wrap gap-1">
        {TABS.map((tab) => {
          const href = `/admin/events/${eventId}${tab.href}`;
          const active = isActive(tab.href);
          return (
            <li key={tab.href}>
              <Link
                href={href}
                className={cn(
                  "inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                  active
                    ? "border-indigo-600 text-indigo-700"
                    : "border-transparent text-slate-600 hover:border-slate-300 hover:text-black"
                )}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
