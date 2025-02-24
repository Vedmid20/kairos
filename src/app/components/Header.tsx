'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import ProjectSelector from "@/app/components/project_components/ProjectSelector";
import GetAvatar from "@/app/components/GetAvatar";
import {useState} from "react";
import '../styles/globals.scss'
import '../styles/mixins.scss'

export default function Header() {
    const pathname = usePathname();
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    const hiddenRoutes = ["/log-in", "/sign-up", "/optional-info"];

    if (hiddenRoutes.includes(pathname)) return null;

    return (
        <>
            <main className="flex justify-end bg-red-400">
                <div className="">
                    <ProjectSelector onSelect={(id) => setSelectedProject(id)} />
                    <GetAvatar />
                </div>
            </main>
        </>
    );
}
