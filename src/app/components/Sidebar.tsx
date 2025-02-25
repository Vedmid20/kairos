'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();

    const hiddenRoutes = ["/log-in", "/sign-up", "/optional-info"];

    if (hiddenRoutes.includes(pathname)) return null;

    return (
        <>
        <main className="flex-col bg-transparent p-3 gap-20 w-52 sidebar">
            <ul className="gap-20 flex-col justify-normal">
                <li><Link href={''}>SKOD</Link></li>
                <li><Link href={''}>SKOD</Link></li>
                <li><Link href={''}>SKOD</Link></li>
            </ul>
        </main>
        </>

    );
}
