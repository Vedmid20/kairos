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
import { X } from 'lucide-react';

if (typeof window !== 'undefined') {
  Modal.setAppElement('#__next');
}

const schema = yup.object({
  search: yup.string()
    .email('Invalid email format')
    .required('Email is required'),
});

export default function InviteMembersModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { register, handleSubmit, setError, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const [token, setToken] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>('');
  const projectId = Cookies.get('selectedProject');
  const [userId, setUserId] = useState<string | null>(null);


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
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  const onInvite = async () => {
    try {
      await schema.validate({ search: searchInput });

      if (!token || !projectId) {
        toast.error("Missing token or project ID");
        return;
      }

      const response = await axios.get("http://127.0.0.1:8008/api/v1/users/", {
        params: { search: searchInput }
      });

      const matchedUser = response.data.find((user: any) => user.email === searchInput);
      if (!matchedUser) {
        toast.error("User with this email not found");
        return;
      }

      await axios.post("http://127.0.0.1:8008/api/v1/project-invites/", {
        invited_user: matchedUser.id,
        project: projectId,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(`Invite sent to ${searchInput}`);
      reset();
      setSearchInput('');
      onClose();

    } catch (error: any) {
      if (error.name === 'ValidationError') {
        setError('search', { message: error.message });
      } else {
        toast.error("Failed to send invite");
        console.error(error);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Invite Members Modal"
      className="relative z-50 max-w-lg w-full p-6 bg-white dark:bg-grey rounded-lg shadow-lg"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      closeTimeoutMS={200}
    >
      <div className="flex">
        <h2 className="text-xl">Invite colleagues</h2>
        <button
          onClick={onClose}
          className="absolute right-10 text-lg font-semibold text-gray-500 hover:text-gray-700"
        >
          <X />
        </button>
      </div>
      <hr className="mt-5" />
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
        className="relative z-50"
      >
        <form onSubmit={handleSubmit(() => onInvite())}>
          <div className="form-group flex-col justify-center m-auto">
            <label htmlFor="user" className="flex">User email</label>
            <input
              type="search"
              id="user"
              {...register('search')}
              placeholder="Enter user email"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              autoComplete="off"
            />
            {errors.search && <p className="error">{errors.search.message}</p>}
          </div>

          <button type="submit" className="form-button m-auto mt-4">
            Invite
          </button>
        </form>
      </motion.div>
    </Modal>
  );
}
