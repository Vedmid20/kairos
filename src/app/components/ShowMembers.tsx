'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Building, Users, MapPin, Briefcase, AtSign, MoreVertical } from 'lucide-react';
import { Popover } from '@headlessui/react';

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
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kickingId, setKickingId] = useState<number | null>(null);

  const [confirmKickUser, setConfirmKickUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const [membersRes, usersRes] = await Promise.all([
          axios.get<Member[]>(`http://127.0.0.1:8008/api/v1/project-members`, { params: { projectId } }),
          axios.get<User[]>(`http://127.0.0.1:8008/api/v1/users/`)
        ]);
        setMembers(membersRes.data);
        const memberIds = new Set(membersRes.data.map(member => member.user));
        const uniqueUsers = usersRes.data.filter(user => memberIds.has(user.id));
        setUsers(uniqueUsers);
      } catch {
        setError('Failed to load project members');
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [projectId]);

  const kickMember = async (userId: number) => {
    const member = members.find(m => m.user === userId);
    if (!member) return;
    setKickingId(userId);
    try {
      await axios.delete(`http://127.0.0.1:8008/api/v1/project-members/${member.id}/`);
      setUsers(users.filter(u => u.id !== userId));
      setMembers(members.filter(m => m.user !== userId));
      setConfirmKickUser(null);
    } catch {
      alert('Failed to remove member');
    } finally {
      setKickingId(null);
    }
  };

  if (loading) return <p>Loading members...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      {users.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {users.map(user => (
            <div key={user.id} className="p-4 dark:bg-black/5 rounded-lg relative shadow flex items-center border-t-8 border border-violet-500">
              <div className="w-full">
                <div className="flex gap-4 items-center">
                  <img src={user.avatar || '/default-avatar.png'} alt={user.username} className="w-16 h-16 rounded-full mb-2" />
                  <p className="text-[1.5rem]">{user.username}</p>
                </div>
                <div className="bg-white/0 w-auto rounded-lg p-3">
                  <p className="text-sm border-b-2 pb-2 border-black/50 dark:border-white/75 flex">
                    <AtSign className='w-6 h-6 text-black/75 dark:text-white my-1 mr-2' /> <span className='my-auto'>{user.email || "None"}</span>
                  </p>
                  <p className="text-sm text-black/50 dark:text-white/75 flex">
                    <Briefcase className="w-6 h-6 text-black/75 dark:text-white my-1 mr-2" /> <span className='px-1 rounded-full text-black dark:text-white my-auto'>{user.position || "None"}</span>
                  </p>
                  <p className="text-sm text-black/50 dark:text-white/75 flex">
                    <Users className="w-6 h-6 text-black/75 dark:text-white my-1 mr-2" /> <span className='px-1 rounded-full text-black dark:text-white my-auto'>{user.department || "None"}</span>
                  </p>
                  <p className="text-sm text-black/50 dark:text-white/75 flex">
                    <Building className="w-6 h-6 text-black/75 dark:text-white my-1 mr-2" /> <span className='px-1 rounded-full text-black dark:text-white my-auto'>{user.organization || "None"}</span>
                  </p>
                  <p className="text-sm text-black/50 dark:text-white/75 flex">
                    <MapPin className="w-6 h-6 text-black/75 dark:text-white my-1 mr-2" /> <span className='px-1 rounded-full text-black dark:text-white my-auto'>{user.location || "None"}</span>
                  </p>
                </div>
              </div>
              <div className="absolute top-5 right-2">
                <Popover className="relative">
                  <Popover.Button className='p-2 text-black dark:text-white rounded-full h-9 w-9 flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition'>
                    <MoreVertical />
                  </Popover.Button>
                  <Popover.Panel className="absolute z-10 right-0 p-0 w-40 border border-violet-500 rounded shadow-md">
                    <div className="py-1">
                      <button
                        onClick={() => setConfirmKickUser(user)}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 bg-white dark:bg-gray-800 hover:bg-red-100 dark:hover:bg-red-900"
                      >
                        Kick
                      </button>
                    </div>
                  </Popover.Panel>
                </Popover>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No members found for this project.</p>
      )}

      {confirmKickUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-96">
            <h3 className="text-xl mb-4">Delete confirm</h3>
            <p className="mb-6">
              Are you sure you want to kick the <strong>{confirmKickUser.username}</strong> from project?
            </p>
            <div className="flex justify-start gap-2">
              <button
                  onClick={() => kickMember(confirmKickUser.id)}
                  disabled={kickingId === confirmKickUser.id}
                  className="px-4 py-2 bg-red-600 text-white rounded w-20 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Kick
              </button>
              <button
                  onClick={() => setConfirmKickUser(null)}
                  className="px-4 py-2 border rounded hover:bg-gray-200 w-20 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
