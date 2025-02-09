'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();

    const hiddenRoutes = ["/log-in", "/sign-up", "/optional-info"];

    if (hiddenRoutes.includes(pathname)) return null;

    return (
        <aside className="w-64 h-screen bg-gray-800 text-white p-4 fixed">
            <nav className="space-y-4">
                <Link href={''}/>
            </nav>
        </aside>
    );
}
