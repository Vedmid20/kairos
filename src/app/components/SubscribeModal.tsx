'use client';

import Modal from 'react-modal';
import { X } from 'lucide-react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { motion } from 'framer-motion';

interface SubscribeModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  taskId: number;
}

Modal.setAppElement('#__next');

export default function SubscribeModal({ isOpen, onRequestClose, taskId }: SubscribeModalProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  useEffect(() => {
    if (token) {
      const decoded: any = jwtDecode(token);
      setUserId(decoded.user_id);
    }
  }, [token]);

  const handleSubscribe = async (type: 'solo' | 'team') => {
    if (!userId || !taskId) return;
    try {
      await axios.post(
        'http://127.0.0.1:8008/api/v1/task-subscribers/',
        { user: userId, task: taskId, type },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onRequestClose();
    } catch (error) {
      console.error('Subscribe error', error);
    }
  };

  const handleUnsubscribe = async () => {
    if (!userId || !taskId) return;
    try {
      await axios.delete(
        `http://127.0.0.1:8008/api/v1/task-subscribers/?user=${userId}&task=${taskId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onRequestClose();
    } catch (error) {
      console.error('Unsubscribe error', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="bg-white dark:bg-grey rounded-2xl shadow-xl w-[30rem] p-6 mx-auto m-auto relative outline-none"
      overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-20"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Subscribe</h2>
        <X className="cursor-pointer" onClick={onRequestClose} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: '5%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '25%' }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col gap-4">
          <button
            onClick={() => handleSubscribe('solo')}
            className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700"
          >
            Solo Subscribe
          </button>
          <button
            onClick={() => handleSubscribe('team')}
            className="bg-violet-500 text-white px-4 py-2 rounded hover:bg-violet-600"
          >
            Team Subscribe
          </button>
          <button
            onClick={handleUnsubscribe}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Unsubscribe
          </button>
        </div>
      </motion.div>
    </Modal>
  );
}
