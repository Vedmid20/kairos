'use client';

import Modal from 'react-modal';
import { X } from 'lucide-react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import { motion } from 'framer-motion';
import Cookie from 'js-cookie';

interface SubscribeModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  taskId: number;
}

interface User {
  id: number;
  username: string;
  avatar?: string;
  email?: string;
}

if (typeof window !== 'undefined') {
  Modal.setAppElement('#__next');
}

export default function SubscribeModal({ isOpen, onRequestClose, taskId }: SubscribeModalProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [subscribers, setSubscribers] = useState<User[]>([]);
  const [loadingSubscribers, setLoadingSubscribers] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const projectId = Cookie.get('selectedProject');

  useEffect(() => {
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUserId(decoded.user_id);
      } catch {
        setUserId(null);
      }
    }
  }, [token]);

  useEffect(() => {
    if (isOpen && taskId && token) {
      fetchSubscribers();
    }
  }, [isOpen, taskId, token]);

  const fetchSubscribers = async () => {
    setLoadingSubscribers(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8008/api/v1/task-subscribers/?task=${taskId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const subscriberData = response.data;

      const users = await Promise.all(
        subscriberData.map(async (sub: { user_subscriber: number }) => {
          const userRes = await axios.get(
            `http://127.0.0.1:8008/api/v1/users/${sub.user_subscriber}/`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          return userRes.data;
        })
      );

      setSubscribers(users);
    } catch {
      setError('Failed to load subscribers');
    } finally {
      setLoadingSubscribers(false);
    }
  };

  const handleSubscribe = async () => {
    if (!userId || !taskId) return;
    try {
      await axios.post(
        'http://127.0.0.1:8008/api/v1/task-subscribers/',
        { user_subscriber: userId, task: taskId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchSubscribers();
    } catch {
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
          `http://127.0.0.1:8008/api/v1/task-subscribers/${subscriptions[0].id}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        fetchSubscribers();
      }
    } catch {
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
        <div>
          {loadingSubscribers && <p>Loading subscribers...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loadingSubscribers && subscribers.length === 0 && <p className='flex justify-center mt-4'>No subscribers yet</p>}
          {!loadingSubscribers && subscribers.length > 0 && (
            <ul className="max-h-40 overflow-y-auto space-y-2">
              {subscribers.map(user => (
                <li key={user.id} className="flex justify-center items-center gap-3 mt-4">
                  <img
                    src={user.avatar || '/default-avatar.png'}
                    alt={user.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <span>{user.username}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex mt-4 gap-4 justify-center">
          <button
            onClick={handleSubscribe}
            className="form-button bg-violet-600 hover:bg-violet-700 text-white"
          >
            Subscribe
          </button>
          <button
            onClick={handleUnsubscribe}
            className="form-button bg-red-600 hover:bg-red-700 text-white"
          >
            Unsubscribe
          </button>
        </div>
      </motion.div>
    </Modal>
  );
}
