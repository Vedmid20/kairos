'use client';

import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { motion } from 'framer-motion';
import { jwtDecode } from "jwt-decode";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import '@/app/styles/globals.scss';
import '@/app/styles/mixins.scss';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

if (typeof window !== 'undefined') {
  Modal.setAppElement('#__next');
}

const schema = yup.object({
  search: yup.string()
    .matches(/^[a-zA-Z0-9 _.,!]+$/, 'Search term can only contain letters, numbers, and punctuation')
    .optional(),
});

export default function InviteMembersModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void, projectId: string }) {
  const { register, handleSubmit, setError, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string | null>('');
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const projectId = Cookies.get('selectedProject')

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) {
      setToken(storedToken);
      try {
        const decoded: any = jwtDecode(storedToken);
        setUserId(decoded.user_id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, token]);

  useEffect(() => {
    if (searchInput?.trim()) {
      const timeout = setTimeout(async () => {
        try {
          const response = await axios.get("http://127.0.0.1:8008/api/v1/users/", {
            params: { search: searchInput }
          });
          console.log(response.data);
          setUsers(response.data);
        } catch (error) {
          console.error("Error", error);
        }
      }, 500);

      return () => clearTimeout(timeout);
    } else {
      setUsers([]);
    }
  }, [searchInput]);

  const handleUserClick = (user: any) => {
    setSearchInput(user.email); 
    setSelectedUser(user);
    setUsers([]); 
  };

  const handleInviteClick = async () => {
    if (!selectedUser) {
      console.log("No user selected");
      return;
    }
    console.log(selectedUser.id, projectId);
    
    try {
      const response = await axios.post("http://127.0.0.1:8008/api/v1/project-members/", {
        user: selectedUser.id,
        project: projectId, 
      });
      onClose();
    } catch {
      toast.error(`User ${searchInput} project member`)
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Invite Members Modal"
      className="relative z-50 max-w-lg w-full p-6 bg-white dark:bg-grey rounded-lg shadow-lg"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      closeTimeoutMS={200}>
      
      <div className="flex">
        <h2 className="text-xl">Invite colleagues</h2>
        <button
          onClick={onClose}
          className="absolute right-10 text-lg font-semibold text-gray-500 hover:text-gray-700">
          x
        </button>
      </div>
      <hr className='mt-5' />

      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={{
          hidden: { opacity: 0, y: '5%' },
          visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 75, damping: 7 } },
          exit: { opacity: 0, y: '25%' },
        }}
        transition={{ duration: 0.3 }}
        className="relative z-50">
          
        <form action="">
          <div className="form-group flex-col justify-center">
            <label htmlFor="user" className='flex'>User email</label>
            <input
              type='search'
              id='user'
              {...register('search')}
              placeholder='Enter user email'
              value={searchInput || ''}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {errors.search && <p className="error">{errors.search.message}</p>}
          </div>

          <div className="mt-4">
            {searchInput?.trim() && users.length > 0 ? (
              <ul>
                {users.map((user: any) => (
                  <li
                    key={user.id}
                    onClick={() => handleUserClick(user)}
                    className="cursor-pointer header-button px-2 rounded-lg hover:bg-white/10 py-2">
                    {user.email}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No users found</p>
            )}
          </div>

          <button type="button" onClick={handleInviteClick} className='form-button'>
            Invite
          </button>
        </form>

      </motion.div>
    </Modal>
  );
}
