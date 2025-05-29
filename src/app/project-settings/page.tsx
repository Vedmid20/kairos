'use client';

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';
import { Camera, Pen, Trash } from 'lucide-react';
import ChangeProjectInfo from "@/app/components/ChangeProjectInfo";
import CreateTicketTypeModal from "@/app/components/CreateTicketType";

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
  const [ticketTypes, setTicketTypes] = useState<any[]>([]);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<any | null>(null);
  const [typeNameInput, setTypeNameInput] = useState('');
  const [typeToDelete, setTypeToDelete] = useState<any | null>(null);

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

  useEffect(() => {
    const fetchTicketTypes = async () => {
      if (!token || !projectId) return;
      try {
        const response = await axios.get(`http://127.0.0.1:8008/api/v1/task-types/?projectId=${projectId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTicketTypes(response.data);
      } catch (error) {
        console.error('Error fetching ticket types:', error);
      }
    };

    fetchTicketTypes();
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

  const handleEditType = (type: any) => {
    setEditingType(type);
    setTypeNameInput(type.task_type_name);
  };

  const handleSaveEditedType = async () => {
    if (!editingType || !token) return;

    try {
      await axios.patch(
        `http://127.0.0.1:8008/api/v1/task-types/${editingType.id}/`,
        { task_type_name: typeNameInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTicketTypes(prev => prev.map(t => t.id === editingType.id ? { ...t, task_type_name: typeNameInput } : t));
      setEditingType(null);
    } catch (error) {
      console.error("Error updating type:", error);
    }
  };

  const handleDeleteType = async () => {
    if (!token || !typeToDelete) return;

    try {
      await axios.delete(`http://127.0.0.1:8008/api/v1/task-types/${typeToDelete.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTicketTypes(prev => prev.filter(type => type.id !== typeToDelete.id));
      setTypeToDelete(null);
    } catch (error) {
      console.error('Error deleting ticket type:', error);
    }
  };

  return (
    <>
      <title>Project Settings</title>
      <h1 className="mb-4">Project Settings</h1>
      <div className="flex gap-10">
        <div className="">
          <div className="w-[30rem] h-[35rem] rounded-lg border border-t-8 border-violet-500 p-6">
            <div
              className="relative w-36 h-36 cursor-pointer mb-6"
              onClick={() => iconFileRef.current?.click()}>
              {iconPreview ? (
                <img
                  src={iconPreview}
                  alt="Project Icon"
                  className="w-36 h-36 object-cover rounded-lg border-2 border-violet-500 transition-all hover:opacity-80" />
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
                onChange={handleIconChange} />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-semibold">Project Name</label>
                <input
                  name="name"
                  value={editableFields.name}
                  onChange={handleInputChange}
                  className="w-72 border rounded p-2"
                  placeholder='Project Name' />
              </div>

              <div>
                <label className="block mb-1 text-sm font-semibold">Project Prefix</label>
                <input
                  name="project_prefix"
                  value={editableFields.project_prefix}
                  onChange={handleInputChange}
                  className="w-72 border rounded p-2"
                  placeholder='Project Prefix' />
              </div>

              <div>
                <label className="block mb-1 text-sm font-semibold">Project Description</label>
                <textarea
                  name="project_desc"
                  value={editableFields.project_desc}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 h-32 resize-none"
                  placeholder='Project Description' />
              </div>
            </div>
          </div>
          {project && (
            <ChangeProjectInfo
              onChange={handleSave}
              editableFields={editableFields}
              project={project} />
          )}
        </div>

        <div className="w-[30rem] h-[35rem] rounded-lg border border-t-8 border-violet-500 p-6 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className='text-[2rem]'>Ticket types</h2>
            <button className='header-button text-[1rem]' onClick={() => setIsTypeModalOpen(true)}>New type</button>
          </div>

          <div className="space-y-3">
            {ticketTypes.length > 0 ? (
              ticketTypes.map((type) => (
                <div
                  key={type.id}
                  className="flex justify-between items-center border p-3 rounded border-black/10 dark:border-white/15">
                  <span>{type.task_type_name}</span>
                  {!type.is_default && (
                    <div className="flex gap-2">
                      <Pen
                        className="w-8 h-8 cursor-pointer transition-all hover:bg-violet-500/50 rounded-full px-2"
                        onClick={() => handleEditType(type)}
                      />
                      <Trash
                        className="w-8 h-8 cursor-pointer transition-all hover:bg-red-400 rounded-full px-2"
                        onClick={() => setTypeToDelete(type)}
                      />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">None</p>
            )}
          </div>
        </div>
      </div>

      {isTypeModalOpen && (
        <CreateTicketTypeModal
          isOpen={isTypeModalOpen}
          onClose={() => setIsTypeModalOpen(false)}
          onCreated={() => {
            axios.get(`http://localhost:8008/api/v1/task-types/?projectId=${projectId}`, {
              headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => setTicketTypes(response.data));
          }}
        />
      )}

      {editingType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl mb-4">Edit the type</h3>
            <input
              type="text"
              value={typeNameInput}
              onChange={(e) => setTypeNameInput(e.target.value)}
              className="w-full border rounded p-2 mb-4"
            />
            <div className="flex justify-start gap-2">
              <button
                  className="px-4 py-2 bg-violet-500 text-white rounded hover:bg-violet-600"
                  onClick={handleSaveEditedType}
              >
                Change
              </button>
              <button
                  className="px-4 py-2 border rounded hover:bg-gray-200"
                  onClick={() => setEditingType(null)}
              >
                Cancel
              </button>

            </div>
          </div>
        </div>
      )}

      {typeToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl mb-4">Delete confirm</h3>
            <p className="mb-6">Delete the <strong>{typeToDelete.task_type_name}</strong>?</p>
              <div className="flex justify-start gap-2">
                <button
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={handleDeleteType}
                >
                  Delete
                </button>
                <button
                    className="px-4 py-2 border rounded hover:bg-gray-200"
                    onClick={() => setTypeToDelete(null)}
                >
                  Cancel
                </button>

              </div>
            </div>
          </div>
      )}
    </>
  );
};

export default ProjectSettingsPage;
