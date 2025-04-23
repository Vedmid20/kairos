'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import ProjectSelector from "@/app/components/header_components/ProjectSelector";
import GetAvatar from "./header_components/GetAvatar";
import ThemeToggle from "./ThemeToggle";
import CreateTicketModal from "@/app/components/CreateTicket";
import {useState} from "react";
import '../styles/globals.scss'
import '../styles/mixins.scss'
import NotificationsDropdown from "@/app/components/header_components/NotificationsDropdown";
import { LayoutGrid } from "lucide-react";

export default function Header() {
    const pathname = usePathname();
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    const hiddenRoutes = ["/log-in", "/sign-up", "/optional-info", "/create-project", "projects"];
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    if (hiddenRoutes.includes(pathname)) return null;

    return (
        <>  
        <div className="header">
            <div className="flex justify-between">
                <div className="flex gap-2 ml-5">
                    <LayoutGrid className="text-violet-300 hover:text-violet-500 transition-all w-8 h-8 my-auto cursor-pointer" strokeWidth={1}/>
                    <img src="/head_logo.png" alt="dsa" className="w-[6rem] bg-red"/>
                </div>
                <div className="flex justify-end">
                    <div className="flex gap-5 mr-10 m-2">
                            <CreateTicketModal isOpen={isModalOpen} onClose={closeModal}>
                                <div className=""></div>
                            </CreateTicketModal>
                        <button className='header-button px-2 rounded-lg hover:bg-white/10' onClick={openModal}>Create ticket</button>
                        <ProjectSelector onSelect={(id) => setSelectedProject(id)}/>
                        <button
                            className="header-button border px-3 h-10 m-auto rounded-lg border-gray-500 dark:hover:text-yellow-300 dark:hover:border-yellow-300 dark:hover:bg-transparent hover:bg-yellow-200 hover:text-black">
                            <Link href={'/get-premium'}>Get PREMIUM</Link></button>
                        <ThemeToggle/>
                        <NotificationsDropdown />
                        <GetAvatar/>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}
