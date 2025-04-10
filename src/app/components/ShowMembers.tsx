'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MoreVertical } from 'lucide-react';

interface Member {
  id: number;
  user: number;
}

interface User {
  id: number;
  email: string;
  avatar?: string; 
  username: string;
  position: string;
  department: string;
  organization: string;
  location: string;
}

interface ShowMembersProps {
  projectId: number;
}

export default function ShowMembers({ projectId }: ShowMembersProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(projectId, '@@@')
    const fetchMembers = async () => {
      try {
        const [membersRes, usersRes] = await Promise.all([
          axios.get(`http://127.0.0.1:8008/api/v1/project-members`, {
            params: { projectId: projectId }
          }),
          axios.get(`http://127.0.0.1:8008/api/v1/users/`)
        ]);

        const memberIds = new Set(membersRes.data.map((member: Member) => member.user));
        const uniqueUsers = usersRes.data.filter((user: User) => memberIds.has(user.id));

        setUsers(uniqueUsers);
      } catch (err) {
        console.error('Error fetching project members:', err);
        setError('Failed to load project members');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [projectId]);

  if (loading) return <p>Loading members...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      {users.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {users.map(user => (
            <div key={user.id} className="p-4 bg-violet-500/50 rounded-lg relative shadow flex items-center border-t-8 border-t-violet-500">
              <div className="w-full">
                <div className="flex gap-4">
                  <img src={user.avatar} alt={user.username} className="w-16 h-16 rounded-full mb-2" />
                  <p className="text-[1.5rem] mt-[1rem]">{user.username}</p>
                </div>
                <div className="bg-white/0 w-auto rounded-lg p-3">
                  <p className="text-sm border-b-2 mb-2 pb-2 border-black/50 dark:border-white/75">Email: {user.email || "None"}</p>
                  <p className="text-xs text-black/50 dark:text-white/75">Position: {user.position || "None"}</p>
                  <p className="text-xs text-black/50 dark:text-white/75">Department: {user.department || "None"}</p>
                  <p className="text-xs text-black/50 dark:text-white/75">Organization: {user.organization || "None"}</p>
                  <p className="text-xs text-black/50 dark:text-white/75">Location: {user.location || "None"}</p>
                </div>
              </div>
              <div className="absolute top-5 right-2">
                <MoreVertical className='ml-2 cursor-pointer hover:bg-white/20 rounded-full transition-all'/>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No members found for this project.</p>
      )}
    </div>
  );
}
