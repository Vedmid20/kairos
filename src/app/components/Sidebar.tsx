'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LineChart, Users, List, Columns3 } from 'lucide-react';
import dynamic from "next/dynamic";
import Lottie from 'lottie-react';
import board from '../../lotties/board.json'
import CurrentProject from "@/app/components/CurrentProject";

export default function Sidebar() {
    const pathname = usePathname();
    const hiddenRoutes = ["/log-in", "/sign-up", "/optional-info", "/create-project", "/loading", "/not-found"];

    if (hiddenRoutes.includes(pathname)) return null;

    const menuItems = [
        { href: "/", label: "Statistics", icon: <LineChart /> },
        { href: "/board", label: "Board", icon: <Columns3 /> },
        { href: "/tickets", label: "Tickets", icon: <List /> },
        { href: "/members", label: "Members", icon: <Users/> }
    ];


return (
    <div className="flex-col p-3 max-w-80 min-w-72 sidebar h-full bg-black/15">
        <div className="ml-3 my-10">
            <CurrentProject/>
        </div>
        <div className="flex justify-start ml-3 mt-5">
            <h2>Main</h2>
        </div>
        <ul className="flex-col justify-normal sidebar-buttons ml-2 mr-5 mt-2 border-t border-violet-400">
            {menuItems.map(({ href, label, icon }, index) => (
                <li className="rounded-md">
                <Link href={href} key={`${href}-${index}`}
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
