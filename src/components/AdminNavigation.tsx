"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
    {
        name: "Dashboard",
        href: "/admin",
    },
    {
        name: "Youth",
        href: "/admin/youth",
    },
    {
        name: "Officials",
        href: "/admin/officials",
    },
    {
        name: "Programs",
        href: "/admin/programs",
    },
    {
        name: "Announcements",
        href: "/admin/announcements",
    },
    {
        name: "Statistics",
        href: "/admin/statistics",
    },
];

export default function AdminNavigation() {
    const pathname = usePathname();

    return (
        <nav className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-7xl gap-7 overflow-x-auto px-5 sm:px-8">
                {navigation.map((item) => {
                    const active =
                        item.href === "/admin"
                            ? pathname === "/admin"
                            : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`whitespace-nowrap border-b-2 py-4 text-sm transition ${active
                                    ? "border-green-700 font-bold text-green-700"
                                    : "border-transparent font-semibold text-slate-500 hover:border-green-300 hover:text-green-700"
                                }`}
                        >
                            {item.name}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}