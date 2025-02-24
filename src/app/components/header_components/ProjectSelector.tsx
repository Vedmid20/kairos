'use client';

import { useEffect, useState } from "react";
import axios from "axios";

interface Project {
    id: string;
    name: string;
}

export default function ProjectSelector({ onSelect }: { onSelect: (id: string) => void }) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);

    useEffect(() => {
        const savedProjectId = document.cookie
            .split('; ')
            .find(row => row.startsWith('selectedProject='))
            ?.split('=')[1];

        if (savedProjectId) {
            setSelectedProject(savedProjectId);
            onSelect(savedProjectId);
        }
        const fetchProjects = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const response = await axios.get("http://127.0.0.1:8008/api/v1/projects/", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProjects(response.data);
            } catch (error) {
                console.error("Помилка отримання проектів:", error);
            }
        };

        fetchProjects();
    }, [onSelect]);

    const handleProjectSelect = (projectId: string) => {
        setSelectedProject(projectId);
        onSelect(projectId);

        document.cookie = `selectedProject=${projectId}; path=/; max-age=${60 * 60 * 24 * 365}`;
    };

    return (
        <select onChange={(e) => handleProjectSelect(e.target.value)} value={selectedProject || ""}>
            <option value="" disabled>Choose a project</option>
            {projects.map((project) => (
                <option key={project.id} value={project.id}>
                    {project.name}
                </option>
            ))}
        </select>
    );
}
