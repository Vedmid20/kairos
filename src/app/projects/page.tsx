'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import '@/app/styles/globals.scss'
import '@/app/styles/mixins.scss'
import {Filter, Search} from "lucide-react";

interface Project {
  id: string;
  name: string;
  icon: string;
  lead: string;
  project_prefix: string;
  lead_username: string;
  members_count: string;
  tasks_count: string;
  project_desc: string;
  created_at: string;
  joined_at: string;
}

interface ProjectMember {
  project: string;
  user: string;
}

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

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
        const members: ProjectMember[] = membersRes.data;

        const filtered = allProjects.filter(project =>
          project.lead === userId ||
          members.some(member => member.project === project.id && member.user === userId)
        );

        setProjects(filtered);
      } catch (err) {
        console.error("Error loading projects", err);
      }
    };

    fetchProjects();
  }, [userId]);

  const handleProjectSelect = (projectId: string) => {
    document.cookie = `selectedProject=${projectId}; path=/; max-age=${60 * 60 * 24 * 365}`;
    window.location.reload();
  };

  return (
      <div className="">
        <title>Projects</title>
        <h1 className="mb-4">Your Projects</h1>

        <div className="flex justify-between">
          <div className="relative">
            <input
                type="search"
                className="mb-4 pl-10 pr-4 py-2 border rounded-lg"
                placeholder="Search project"
            />
            <div className="absolute inset-y-1 left-0 pl-3 -top-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400"/>
            </div>
          </div>
          <div className="ml-10">
            <div className="flex gap-5">
              <div className="m-auto rounded-lg hover:bg-white/10 px-1 cursor-pointer">
                <p className="flex gap-2 header-button px-2 py-2">Filter <Filter
                    className="w-5 h-5 text-gray-400 m-auto"/></p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-10 ">

          {projects.map(project => (
              <div key={project.id}
                   className="flex flex-col h-full p-4 pb-8 border rounded-lg shadow-md border-violet-500 dark:bg-black/5 border-t-8">
                <div className="flex items-center gap-4">
                  {project.icon ? (
                      <img src={project.icon} alt="Icon" className="w-20 h-20 rounded-md object-cover"/>
                  ) : (
                      <div className="w-20 h-20 rounded-md"/>
                  )}
                  <div className="flex-col">
                    <h2 className="text-2xl">{project.name}</h2>
                    <p>Prefix <span className="bg-violet-500/50 px-3 rounded-full">{project.project_prefix}</span></p>
                    <p className="mb-1">Leader <span
                        className="bg-violet-500/50 px-3 rounded-full">{project.lead_username}</span></p>
                  </div>
                </div>

                <div className="flex-grow">
                  <p className="text-md mt-3">{project.project_desc}</p>
                  <div className="mt-3 border-t-2 pt-2 border-black/50 dark:border-white/75">
                    <p className="mb-1">Members <span
                        className="bg-violet-500/50 px-3 rounded-full">{project.members_count}</span></p>
                    <p>Bugs <span className="bg-violet-500/50 px-3 rounded-full">{project.tasks_count}</span></p>
                    <p className="text-xs mt-2">Created at <span
                        className="px-1 rounded-full">{project.created_at}</span></p>
                    <p className="text-xs mt-2">Joined at <span className="px-1 rounded-full">{project.joined_at}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-auto pt-4 flex justify-center">
                  <button onClick={() => handleProjectSelect(project.id)} className='px-10 py-2 form-button'>Select
                  </button>
                </div>
              </div>

          ))}
        </div>
      </div>
  );
};

export default ProjectsPage;
