'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, XCircle } from 'lucide-react';
import axios from 'axios';
import ComboBoxAnimation from "@/app/components/animations/ComboBoxAnimation";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import Modal from "react-modal";

interface Notification {
  id: number;
  content: string;
  created_at: string;
  read: boolean;
  type: string;
  invite_id?: number;
}

if (typeof window !== 'undefined') {
  Modal.setAppElement('#__next');
}

export default function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const projectID = Cookies.get('selectedProject');
  const [userId, setUserId] = useState<string | null>(null);


    useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) {
      try {
        const decoded: any = jwtDecode(storedToken);
        setUserId(decoded.user_id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`http://127.0.0.1:8008/api/v1/notifications/?projectId=${projectID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
  const fetchInvites = async () => {
    try {
      const token = localStorage.getItem('access_token');

      const response = await axios.get(`http://127.0.0.1:8008/api/v1/project-invites/?invited_user=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const inviteNotifications = response.data.map((invite: any) => ({
        id: invite.id,
        content: `You were invited to project "Kairos"`,
        created_at: invite.created_at,
        read: false,
        type: 'invite',
        invite_id: invite.id,
      }));

      setNotifications(prev => [...inviteNotifications, ...prev]);
    } catch (error) {
      console.error('Error fetching invites:', error);
    }
  };

  fetchInvites();
}, [userId]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8008/ws/invites/");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setNotifications(prev => [data, ...prev]);
    };

    return () => socket.close();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAcceptInvite = async (inviteId: number) => {
  try {
    const token = localStorage.getItem('access_token');

    const res = await axios.get(
      `http://127.0.0.1:8008/api/v1/project-invites/?invited_user=${userId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const invite = res.data.find((i: any) => i.id === inviteId);
    if (!invite) {
      console.error("Invite not found");
      return;
    }

    await axios.post(
      `http://127.0.0.1:8008/api/v1/project-members/`,
      {
        user: userId,
        project: invite.project,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setNotifications(prev => prev.filter(n => n.invite_id !== inviteId));
  } catch (error) {
    console.error("Error accepting invite:", error);
  }
};



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
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-grey border border-gray-300 dark:border-white/10 shadow-lg rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-300 dark:border-white/10 flex justify-between items-center">
              <span className="font-semibold">Notifications</span>
              <button onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-72 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <div key={notification.id} className="p-3 border-b border-gray-300 dark:border-white/10 bg-white dark:bg-grey">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{notification.content}</p>
                    <span className="text-xs text-gray-500">{new Date(notification.created_at).toLocaleString()}</span>

                    {notification.type === 'invite' && notification.invite_id && (
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleAcceptInvite(notification.invite_id!)}
                          className="flex items-center gap-1 bg-violet-500 text-white px-2 py-1 rounded hover:bg-violet-600 text-xs"
                        >
                          <Check size={14} /> Accept
                        </button>
                        <button
                          onClick={() => handleDeclineInvite(notification.invite_id!)}
                          className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs"
                        >
                          <XCircle size={14} /> Decline
                        </button>
                      </div>
                    )}
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
