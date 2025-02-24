'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import ProjectSelector from "@/app/components/header_components/ProjectSelector";
import GetAvatar from "./header_components/GetAvatar";
import ThemeToggle from "./ThemeToggle";
import {useState} from "react";
import '../styles/globals.scss'
import '../styles/mixins.scss'

export default function Header() {
    const pathname = usePathname();
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    const hiddenRoutes = ["/log-in", "/sign-up", "/optional-info", "/create-project"];

    if (hiddenRoutes.includes(pathname)) return null;

    return (
        <>
            <main className="flex justify-end header">
                <div className="flex gap-10 mr-20 m-2">
                    <ThemeToggle />
                    <ProjectSelector onSelect={(id) => setSelectedProject(id)} />
                    <GetAvatar />
                </div>
            </main>
        </>
    );
}
