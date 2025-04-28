'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, List, Columns3, CogIcon, CalendarClock, LucideChartNoAxesCombined, Speech, NotebookText, BotMessageSquare, Handshake, Pin } from 'lucide-react';
import dynamic from "next/dynamic";
import Lottie from 'lottie-react';
import board from '../../lotties/board.json'
import CurrentProject from "@/app/components/CurrentProject";

export default function Sidebar() {
    const pathname = usePathname();
    const hiddenRoutes = ["/log-in", "/sign-up", "/optional-info", "/create-project", "/loading", "/not-found", "projects"];

    if (hiddenRoutes.includes(pathname)) return null;

    const menuItems = [
        { href: "/", label: "Statistics", icon: <LucideChartNoAxesCombined /> },
        { href: "/calendar", label: "Calendar", icon: <CalendarClock /> },
        { href: "/subscribes", label: "Subscribes", icon: <Pin /> },
        { href: "/board", label: "Board", icon: <Columns3 /> },
        { href: "/list", label: "List", icon: <List /> },
        { href: "/tickets", label: "Tickets", icon: <NotebookText /> },
        { href: "/", label: "Project settings", icon: <CogIcon /> },
    ];

    const menuItems2 = [
        { href: "/members", label: "Members", icon: <Users /> },
        { href: "/meetings", label: "Meetings", icon: <Speech /> },
        { href: "/teams", label: "Teams", icon: <Handshake /> },
    ]


return (
    <div className="flex-col p-3 max-w-80 min-w-72 sidebar h-full pb-24 overflow-auto bg-black/5 dark:bg-black/15">
        <div className="ml-3 my-5">
            <CurrentProject/>
        </div>
        <div className="flex justify-start ml-3 mt-5">
            <h2>Workspace</h2>
        </div>
        <ul className="flex-col justify-normal sidebar-buttons ml-2 mr-5 mt-2 border-t border-violet-400">
            {menuItems.map(({ href, label, icon }, index) => (
                <li key={`${href}-${index}`} className="rounded-md">
                    <Link href={href}
                          className={`flex gap-2 ml-5 mt-2 px-4 py-2 rounded-md transition ${
                              pathname === href ? "bg-black/20 text-white" : "hover:bg-black/10"
                          }`}>
                        {icon}
                        {label}
                    </Link>
                </li>
            ))}
        </ul>
        <div className="flex justify-start ml-3 mt-5">
            <h2>People</h2>
        </div>
        <ul className="flex-col justify-normal sidebar-buttons ml-2 mr-5 mt-2 border-t border-violet-400">
            {menuItems2.map(({ href, label, icon }, index) => (
                <li key={`${href}-${index}`} className="rounded-md">
                    <Link href={href}
                          className={`flex gap-2 ml-5 mt-2 px-4 py-2 rounded-md transition ${
                              pathname === href ? "bg-black/20 text-white" : "hover:bg-black/10"
                          }`}>
                        {icon}
                        {label}
                    </Link>
                </li>
            ))}
        </ul>
    </div>
);

}
