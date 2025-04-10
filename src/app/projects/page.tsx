'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

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

  return (
    <main>
    <div className="p-5">
        <title>Projects</title>
      <h1 className="">Your Projects</h1>
      <div className="grid grid-cols-3 gap-10">
        {projects.map(project => (
          <div key={project.id} className="p-4 pb-8 border rounded-lg shadow-md border-t-violet-500 bg-violet-500/50 border-t-8">
            <div className="flex items-center gap-4">
              {project.icon ? (
                <img src={project.icon} alt="Icon" className="w-20 h-20 rounded-md object-cover" />
              ) : (
                <div className="w-20 h-20 rounded-md" />
              )}
              <div className="flex-col">
                <h2 className="text-2xl">{project.name}</h2>
                <p className="">Prefix <span className="bg-violet-500/50 px-3 rounded-full">{project.project_prefix}</span></p>
                <p className="mb-1">Leader <span className="bg-violet-500/50 px-3 rounded-full">{project.lead_username}</span></p>
              </div>
            </div>
            <p className="text-md mt-3">{project.project_desc}</p>
            <div className="mt-3 border-t-2 pt-2 border-black/50 dark:border-white/75">
                <p className="mb-1">Members <span className="bg-violet-500/50 px-3 rounded-full">{project.members_count}</span></p>
                <p>Bugs <span className="bg-violet-500/50 px-3 rounded-full">{project.tasks_count}</span></p>
                <p className="text-xs mt-2">Created at <span className="px-1 rounded-full">{project.created_at}</span></p>
                <p className="text-xs mt-2">Joined at <span className="px-1 rounded-full">{project.joined_at}</span></p>
            </div>
            <button>Select</button>
          </div>
        ))}
      </div>
    </div>
    </main>
  );
};

export default ProjectsPage;
