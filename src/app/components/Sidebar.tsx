'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();

    const hiddenRoutes = ["/log-in", "/sign-up", "/optional-info"];

    if (hiddenRoutes.includes(pathname)) return null;

    return (
        <>
            <main>
                <div className="">
                    <Link href={''}></Link>
                </div>
            </main>
        </>
    );
}
