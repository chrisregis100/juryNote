"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Cog6ToothIcon,
  UsersIcon,
  CheckCircleIcon,
  ChartBarIcon,
  TrophyIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/cn";

interface EventTabsProps {
  eventId: string;
}

interface Tab {
  label: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const TABS: Tab[] = [
  { label: "Configuration", href: "", icon: Cog6ToothIcon },
  { label: "Participants", href: "/participants", icon: UsersIcon },
  { label: "Check-in", href: "/checkin", icon: CheckCircleIcon },
  { label: "Dashboard", href: "/dashboard", icon: ChartBarIcon },
  { label: "Délibération", href: "/deliberation", icon: TrophyIcon },
  { label: "Ressources", href: "/resources", icon: ArchiveBoxIcon },
];

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
    <nav
      className="-mx-4 overflow-x-auto border-b-2 border-slate-200 px-4 sm:mx-0 sm:px-0"
      aria-label="Onglets de l'événement"
    >
      <ul className="flex min-w-max gap-1">
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
                <tab.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
