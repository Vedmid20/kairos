'use client';

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Send } from 'lucide-react';
import Cookie from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

export default function CreateZoomButton({ name }: { name: string }) {
  const [meetingUrl, setMeetingUrl] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  const projectId = Cookie.get('selectedProject')
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
              console.error("Помилка декодування токена:", error);
          }
      }
    }, []);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8008/ws/meetings/");
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.message) {
        setMessages(prev => [...prev, { content: data.message, from_ws: true }]);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => socket.close();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!token || !projectId) return;

      try {
        const res = await axios.get(`http://127.0.0.1:8008/api/v1/meeting-messages/?project_id=${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );
        setMessages(res.data);
      } catch (err) {
        console.error("Помилка при завантаженні повідомлень:", err);
      }
    };

    fetchMessages();
  }, [token]);

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    try {
      const res = await axios.post(`http://127.0.0.1:8008/api/v1/meeting-messages/`, {
        meeting_text: messageInput,
        meeting_leader: userId,
        meeting_project: projectId
      }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      const savedMessage = res.data;
      setMessages(prev => [...prev, savedMessage]);
      setMessageInput("");

      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({
          message: savedMessage.content
        }));
      }
    } catch (err) {
      console.error("Помилка при надсиланні повідомлення:", err);
      alert("Помилка при надсиланні повідомлення");
    }
  };

  const handleCreateMeeting = async () => {
    try {
      const res = await axios.post("http://localhost:8008/api/zoom/create-meeting/", {
        topic: `${name} Discussion`,
      });
      setMeetingUrl(res.data.join_url);

      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({
          message: `Meeting "${name}" created`,
        }));
      }
    } catch (err) {
      console.error("Zoom meeting error:", err);
      alert("Не вдалося створити Zoom-зустріч");
    }
  };

  useEffect(() => {
    if (meetingUrl) {
      window.open(meetingUrl, '_blank');
      setMeetingUrl("");
    }
  }, [meetingUrl]);

  return (
    <>
      <h1>Meetings</h1>
      <title>Meetings</title>
      <div className="flex flex-col items-center gap-4 p-4">
        <div className="w-full max-w-xl h-96 overflow-y-auto border border-violet-500 border-t-8 p-4 rounded shadow">
          {messages.map((msg, index) => (
            <div key={index} className="flex gap-2 p-2">
              <div className="">
                <img src={msg.meeting_leader_avatar} alt="" className="w-10 rounded-full"/>
              </div>
              <div className="bg-black/10 dark:bg-white/10 p-2 rounded-lg rounded-tl-none min-w-72">
                <p className="text-violet-500 dark:text-violet-400">{msg.meeting_leader_name}</p>
                <p>{msg.meeting_text}</p>
                <p>{new Date(msg.created_at).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 w-full max-w-xl">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            className="flex-1 p-2 border rounded !transform-none"
            placeholder="Enter message..."
          />
          <button
            onClick={handleSendMessage}
            className="p-2 w-12 h-12 bg-violet-500 rounded-full hover:bg-violet-600 transition-all"
          >
            <Send className="m-auto text-white" />
          </button>
        </div>

        <button onClick={handleCreateMeeting} className="bg-violet-500 rounded-lg hover:bg-violet-600 transition-all text-white p-2">
          Create Zoom Meeting
        </button>
      </div>
    </>
  );
}
