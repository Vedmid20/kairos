'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';
import { Camera } from 'lucide-react';
import ChangeProjectInfo from "@/app/components/ChangeProjectInfo";

const ProjectSettingsPage = () => {
  const [project, setProject] = useState<any>(null);
  const [editableFields, setEditableFields] = useState({
    name: '',
    project_desc: '',
    project_prefix: '',
  });
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const iconFileRef = useRef<HTMLInputElement | null>(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const projectId = Cookie.get('selectedProject');

  useEffect(() => {
    const fetchProject = async () => {
      if (!token || !projectId) return;

      try {
        const response = await axios.get(`http://127.0.0.1:8008/api/v1/projects/${projectId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProject(response.data);
        setEditableFields({
          name: response.data.name || '',
          project_desc: response.data.project_desc || '',
          project_prefix: response.data.project_prefix || '',
        });
        setIconPreview(response.data.icon || null);
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };

    fetchProject();
  }, [token, projectId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditableFields({ ...editableFields, [e.target.name]: e.target.value });
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIconPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!token || !projectId) return;
    try {
      await axios.patch(
        `http://127.0.0.1:8008/api/v1/projects/${projectId}/`,
        editableFields,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  return (
    <>
      <title>Project Settings</title>
      <h1 className="mb-4">Project Settings</h1>

      <div className="">
        <div className="w-[30rem] rounded-lg border border-t-8 border-violet-500 p-6">
          <div
            className="relative w-36 h-36 cursor-pointer mb-6"
            onClick={() => iconFileRef.current?.click()}>
            {iconPreview ? (
              <img
                src={iconPreview}
                alt="Project Icon"
                className="w-36 h-36 object-cover rounded-lg border-2 border-violet-500 transition-all hover:opacity-80"/>
            ) : (
              <div className="w-36 h-36 rounded-lg bg-gray-300 flex items-center justify-center">
                No icon
              </div>
            )}
            <div className="absolute top-0 left-0 w-full h-full bg-black/50 rounded-lg flex justify-center items-center opacity-0 transition-opacity hover:opacity-100">
              <Camera className="text-white w-12 h-12" />
            </div>
            <input
              type="file"
              accept="image/*"
              ref={iconFileRef}
              className="hidden"
              onChange={handleIconChange}/>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-semibold">Project Name</label>
              <input
                name="name"
                value={editableFields.name}
                onChange={handleInputChange}
                className="w-72 border rounded p-2"
                placeholder='Project Name'/>
            </div>

            <div>
              <label className="block mb-1 text-sm font-semibold">Project Prefix</label>
              <input
                name="project_prefix"
                value={editableFields.project_prefix}
                onChange={handleInputChange}
                className="w-72 border rounded p-2"
                placeholder='Project Prefix'/>
            </div>

            <div>
              <label className="block mb-1 text-sm font-semibold">Project Description</label>
              <textarea
                name="project_desc"
                value={editableFields.project_desc}
                onChange={handleInputChange}
                className="w-full border rounded p-2 h-32 resize-none"
                placeholder='Project Description'/>
            </div>

          </div>
        </div>
          {project && (
            <ChangeProjectInfo
              onChange={handleSave}
              editableFields={editableFields}
              project={project}/>
          )}
      </div>
    </>
  );
};

export default ProjectSettingsPage;
