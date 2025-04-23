'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bell, X } from 'lucide-react';
import axios from 'axios';
import ComboBoxAnimation from "@/app/components/animations/ComboBoxAnimation";

interface Notification {
  id: number;
  message: string;
  created_at: string;
  read: boolean;
}

export default function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://127.0.0.1:8008/api/v1/notifications/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative my-auto" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 rounded-full hover:bg-white/25 transition-all">
        <Bell className="w-6 h-6 text-white" />
        {notifications.some(n => !n.read) && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
        )}
      </button>
      {isOpen && (
          <ComboBoxAnimation>
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-lg rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center">
            <span className="font-semibold">Notifications</span>
            <button onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div key={notification.id} className={`p-3 border-b border-gray-300 dark:border-gray-700 ${notification.read ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}`}>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{notification.message}</p>
                  <span className="text-xs text-gray-500">{new Date(notification.created_at).toLocaleString()}</span>
                </div>
              ))
            ) : (
              <p className="p-4 text-center text-gray-500">No notifications</p>
            )}
          </div>
        </div>
          </ComboBoxAnimation>
      )}
    </div>
  );
}
