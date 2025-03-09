'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import ComboBoxAnimation from '@/app/components/animations/ComboBoxAnimation'
import CurrentProject from "@/app/components/CurrentProject";
import Link from 'next/link';
import { GoArrowDown } from "react-icons/go";
import { jwtDecode } from "jwt-decode";

interface Project {
    id: string;
    name: string;
    icon: string;
    lead: string;
}

interface ProjectMember {
    project: string;
    user: string;
}

export default function ProjectSelector({ onSelect }: { onSelect: (id: string) => void }) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [userProjects, setUserProjects] = useState<Project[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                setUserId(decoded.user_id);
            } catch (error) {
                console.error("Помилка декодування токена:", error);
            }
        }
    }, []);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const token = localStorage.getItem("access_token");
                if (!token || !userId) return;

                const [projectsRes, membersRes] = await Promise.all([
                    axios.get("http://127.0.0.1:8008/api/v1/projects/", {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get("http://127.0.0.1:8008/api/v1/project-members/", {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                const allProjects: Project[] = projectsRes.data;
                const projectMembers: ProjectMember[] = membersRes.data;

                const filteredProjects = allProjects.filter(project =>
                    project.lead === userId || projectMembers.some(member => member.project === project.id && member.user === userId)
                );

                setProjects(filteredProjects);
            } catch (error) {
                console.error("Помилка отримання проектів або учасників:", error);
            }
        };

        fetchProjects();
    }, [userId]);

    useEffect(() => {
        const savedProjectId = document.cookie
            .split('; ')
            .find(row => row.startsWith('selectedProject='))
            ?.split('=')[1];

        if (savedProjectId) {
            setSelectedProject(savedProjectId);
            onSelect(savedProjectId);
        }
    }, [onSelect]);

    const handleProjectSelect = (projectId: string) => {
        window.location.reload();
        setSelectedProject(projectId);
        onSelect(projectId);
        document.cookie = `selectedProject=${projectId}; path=/; max-age=${60 * 60 * 24 * 365}`;
    };

    return (
        <div className="relative">
            <div
                className="header-button bg-transparent rounded-lg text-white px-4 py-2 cursor-pointer flex hover:bg-white/10"
                onClick={() => setIsOpen(!isOpen)}>
                <div className="flex gap-1">
                    Projects <GoArrowDown className='m-auto'/>
                </div>
            </div>
            {isOpen && (
                <ComboBoxAnimation>
                    <div
                        className="absolute top-2 right-0 bg-white/50 backdrop-blur-md rounded-b-lg shadow-lg w-72 z-10 dark:bg-grey/50 py-2">
                        <div className="my-1 border-b border-black/20 dark:border-white/50 py-2">
                            <div className="ml-3 mt-2">
                                <h2 className='mb-2 text-[.9rem]'>Current project</h2>
                                <CurrentProject/>
                            </div>
                        </div>

                        <div className="my-1 border-b border-black/20 dark:border-white/50 py-2">
                            <div className="ml-3 mt-2">
                                <h2 className='mb-2 text-[.9rem]'>Projects</h2>
                            </div>
                            {projects.map((project) => (
                                <button
                                    key={project.id}
                                    onClick={() => {
                                        handleProjectSelect(project.id);
                                        setIsOpen(false);
                                    }}
                                    className="block w-full text-left p-3 hover:bg-black/20 cursor-pointer transition-all flex gap-5">
                                    {project.icon ? (
                                        <img src={project.icon} alt="Icon" className="w-8 h-8 object-cover rounded-lg"/>
                                    ) : (
                                        <p className="text-xs text-center">Load...</p>
                                    )}<h2 className='text-[1.2rem] text-thin'>{project.name}</h2>
                                </button>
                            ))}
                        </div>

                        <div className="">
                            <button className="block w-full text-left p-2 hover:bg-black/20 cursor-pointer transition-all">
                                <p className='ml-2'>View all projects</p>
                            </button>
                            <button className="block w-full text-left p-2 hover:bg-black/20 cursor-pointer transition-all">
                                <Link href={'/create-project'} className='ml-2'>Create project</Link>
                            </button>
                        </div>
                    </div>
                </ComboBoxAnimation>
            )}
        </div>
    );
}
