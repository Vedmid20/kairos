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
        <div className="flex-col p-3 max-w-80 min-w-72 sidebar bg-black/15">
        <div className="flex justify-end mr-5 mt-5"><h2>Main</h2></div>
            <ul className="flex-col justify-normal sidebar-buttons ml-5 mt-2 border-t border-black dark:border-white">
                <li className='flex m-auto gap-2 mt-2'><LineChart className='my-auto'/><Link href={''}>Statistics</Link></li>
                <li className='flex m-auto gap-2'><LayoutDashboardIcon className='my-auto'/><Link href={''}>Board</Link></li>
                <li className='flex m-auto gap-2'><List className='my-auto'/><Link href={'/tickets'}>Tickets</Link></li>
            </ul>
        </div>
        </>

    );
}
