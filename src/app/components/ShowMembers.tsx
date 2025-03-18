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
  const [members, setMembers] = useState<Member[]>([]);
  const [users, setUsers] = useState<{ [key: number]: User }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8008/api/v1/project-members/`, {
          params: { project_id: projectId }
        });
        setMembers(response.data);

        const userRequests = response.data.map((member: Member) =>
          axios.get(`http://127.0.0.1:8008/api/v1/users/${member.user}/`)
        );

        const userResponses = await Promise.all(userRequests);
        const userData: { [key: number]: User } = {};
        userResponses.forEach((res) => {
          const user: User = res.data;
          userData[user.id] = user;
        });

        setUsers(userData);
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
    <div className="">
      {members.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4">
          {members.map(member => {
            const user = users[member.user];

            return (
              <div key={member.id} className="p-4 bg-violet-500/50 rounded-lg relative shadow flex  items-center border-t-8 border-t-violet-500">
                <div className="w-full">
                    <div className="flex gap-4">
                      <img src={user.avatar} alt={user.username} className="w-16 h-16 rounded-full mb-2" />
                      <p className="text-[1.5rem] mt-[1rem]">{user.username}</p>
                    </div>
                    <div className="bg-white/0 w-auto rounded-lg p-3">
                      <p className="text-sm border-b mb-2 pb-2 border-black/50 dark:border-white/75">Email: {user.email && user.email.length > 0 ? user.email : "None"}</p>
                      <p className="text-xs text-black/50 dark:text-white/75">Position: {user.position && user.position.length > 0 ? user.position : "None"}</p>
                      <p className="text-xs text-black/50 dark:text-white/75">Department: {user.department && user.department.length > 0 ? user.department : "None"}</p>
                      <p className="text-xs text-black/50 dark:text-white/75">Organization: {user.organization && user.organization.length > 0 ? user.organization : "None"}</p>
                      <p className="text-xs text-black/50 dark:text-white/75">Location: {user.location && user.location.length > 0 ? user.location : "None"}</p>
                    </div>
                </div>
                <div className=" absolute top-5 right-2">
                    <MoreVertical className='ml-2 cursor-pointer hover:bg-white/20 rounded-full transition-all'/>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <p>No members found for this project.</p>
      )}
    </div>
  );
}
