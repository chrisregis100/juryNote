"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Événements",
    href: "/admin",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin" || pathname.startsWith("/admin/events");
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r-2 border-black bg-white md:flex sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto justify-between">
      <nav className="flex-1 p-4" aria-label="Navigation latérale">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-indigo-50 text-indigo-700 border-2 border-indigo-600"
                    : "text-slate-700 hover:bg-slate-100 hover:text-black"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t-2 border-black p-4">
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs font-medium text-slate-600">Besoin d&apos;aide ?</p>
          <a
            href="mailto:support@juryflow.app"
            className="mt-1 text-xs text-indigo-600 hover:underline"
          >
            Contacter le support
          </a>
        </div>
      </div>
    </aside>
  );
}
