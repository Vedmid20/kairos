'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LineChart, LayoutDashboardIcon, List } from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();

    const hiddenRoutes = ["/log-in", "/sign-up", "/optional-info", "/create-project"];

    if (hiddenRoutes.includes(pathname)) return null;



    return (
        <>
        <div className="flex-col bg-transparent p-3 max-w-80 min-w-72 sidebar">
            <ul className="flex-col justify-normal sidebar-buttons font-medium ml-2">
                <li className='flex m-auto gap-2'><LineChart className='my-auto'/><Link href={''}>Statistics</Link></li>
                <li className='flex m-auto gap-2'><LayoutDashboardIcon className='my-auto'/><Link href={''}>Board</Link></li>
                <li className='flex m-auto gap-2'><List className='my-auto'/><Link href={'/tickets'}>Tickets</Link></li>
            </ul>
        </div>
        </>

    );
}
