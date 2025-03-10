'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

        // Запити всіх користувачів за їх ID
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {members.map(member => {
            const user = users[member.user];

            return user ? (
              <div key={member.id} className="p-4 bg-violet-500/50 rounded-lg shadow flex flex-col items-center">
                <img src={user.avatar} alt={user.username} className="w-16 h-16 rounded-full mb-2" />
                <p className="font-semibold">{user.username}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
                {}
                <p className="text-xs text-gray-400">{user.position}</p>
              </div>
            ) : (
              <div key={member.id} className="p-3 bg-violet-500/50 rounded-lg shadow flex items-center justify-center">
                Loading...
              </div>
            );
          })}
        </div>
      ) : (
        <p>No members found for this project.</p>
      )}
    </div>
  );
}
