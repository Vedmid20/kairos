'use client';

import React, {useEffect, useState} from 'react';
import Modal from 'react-modal';
import { motion } from 'framer-motion';
import {jwtDecode} from "jwt-decode";

if (typeof window !== 'undefined') {
  Modal.setAppElement('#__next');
}

export default function InviteMembersModal({ isOpen, onClose }) {
  const [token, setToken] = useState<string | null>(null);
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
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      console.log(isOpen)
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, token]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Create Ticket Modal"
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

        <h1>OOSOD</h1>

      </motion.div>
    </Modal>
  );
}
