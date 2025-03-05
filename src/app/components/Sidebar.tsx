'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LineChart, LayoutDashboardIcon, List } from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();

    const hiddenRoutes = ["/log-in", "/sign-up", "/optional-info", "/create-project"];

    if (hiddenRoutes.includes(pathname)) return null;

    const menuItems = [
        { href: "", label: "Statistics", icon: <LineChart /> },
        { href: "", label: "Board", icon: <LayoutDashboardIcon /> },
        { href: "/tickets", label: "Tickets", icon: <List /> },
    ];


return (
    <div className="flex-col p-3 max-w-80 min-w-72 sidebar bg-black/15">
        <div className="flex justify-start ml-3 mt-5">
            <h2>Main</h2>
        </div>
        <ul className="flex-col justify-normal sidebar-buttons ml-2 mr-5 mt-2 border-l border-t border-violet-400">
            {menuItems.map(({ href, label, icon }, index) => (
                <li
                    key={`${href}-${index}`}
                    className={`flex gap-2 ml-5 mt-2 px-4 py-2 rounded-md transition ${
                        pathname === href ? "bg-black/20 text-white" : "hover:bg-black/10"
                    }`}
                >
                    {icon}
                    <Link href={href}>{label}</Link>
                </li>
            ))}
        </ul>
    </div>
);

}
