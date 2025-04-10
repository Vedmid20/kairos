'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import '@/app/styles/globals.scss';
import '@/app/styles/mixins.scss';

const CurrentProject = () => {
    const [project, setProject] = useState<{ name: string, icon: string } | null>(null);
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

    useEffect(() => {
        const fetchProject = async () => {
            const projectId = Cookies.get("selectedProject");
            if (!projectId || !token) return;

            try {
                const response = await axios.get(`http://127.0.0.1:8008/api/v1/projects/${projectId}/`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                setProject(response.data);
            } catch (error) {
                console.error("Помилка отримання проєкту:", error);
            }
        };

        fetchProject();
    }, [token]);

    console.log()

    return (
        <div className="flex items-center gap-2 cursor-default">
            {project ? (
                <>
                    <img src={project.icon} alt="Project Icon" className="w-12 h-12 object-cover rounded-lg" />
                    <h2 className="text-[1.2rem]">{project.name}</h2>
                </>
            ) : (
                <p className="text-xs">Load...</p>
            )}
        </div>
    );
}

export default CurrentProject;
