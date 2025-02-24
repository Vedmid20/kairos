'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function LoginRequired() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem('access_token') : null;
        if (status === "loading") return;

        if (!token) {
            router.push('/log-in');
        }
    }, [session, status, router]);

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    return null;
}
