'use client';

import Modal from 'react-modal';
import { X } from 'lucide-react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { motion } from 'framer-motion';
import Cookie from 'js-cookie';

interface SubscribeModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  taskId: number;
}

if (typeof window !== 'undefined') {
  Modal.setAppElement('#__next');
}

export default function SubscribeModal({ isOpen, onRequestClose, taskId }: SubscribeModalProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const projectId = Cookie.get('selectedProject');

  useEffect(() => {
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUserId(decoded.user_id);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, [token]);

  const handleSubscribe = async (type: 'solo' | 'team') => {
    if (!userId || !taskId) return;
    try {
      await axios.post(
        'http://127.0.0.1:8008/api/v1/task-subscribers/',
        { user_subscriber: userId, task: taskId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onRequestClose();
    } catch (error) {
      console.error('Subscribe error', error);
    }
  };

  const handleUnsubscribe = async () => {
    if (!userId || !taskId) return;
    
    try {
      const response = await axios.get(
        `http://127.0.0.1:8008/api/v1/task-subscribers/?task=${taskId}&user=${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      const subscriptions = response.data;
      if (subscriptions.length > 0) {
        await axios.delete(
          `http://127.0.0.1:8008/api/v1/task-subscribers/?task=${taskId}&user=${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log('Unsubscribed successfully');
        onRequestClose();
      } else {
        console.log('No subscription found for this user');
      }
    } catch (error) {
      console.error('Unsubscribe error', error);
    }
  };  

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Subscribe Modal"
      className="relative z-50 w-[30rem] p-6 bg-white dark:bg-grey rounded-lg shadow-lg outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-15 flex justify-center items-center"
      closeTimeoutMS={200}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Subscribe</h2>
        <button onClick={onRequestClose} className="text-lg font-semibold">
          <X />
        </button>
      </div>
      <hr className="mt-5 -mb-10" />

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
        className="relative z-50 mt-10 flex flex-col gap-5"
      >
        <button
          onClick={() => handleSubscribe('solo')}
          className="form-button bg-violet-600 hover:bg-violet-700 text-white"
        >
          Solo Subscribe
        </button>
        <button
          onClick={() => handleSubscribe('team')}
          className="form-button bg-violet-500 hover:bg-violet-600 text-white">
          Team Subscribe
        </button>
        <button
          onClick={() => handleUnsubscribe()}
          className="form-button bg-red-500 hover:bg-red-600 text-white"
        >
          Unsubscribe
        </button>
      </motion.div>
    </Modal>
  );
}
