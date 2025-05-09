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
      try {
        const res = await axios.get(`http://127.0.0.1:8008/api/v1/meeting-messages/`,
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
  }, []);

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    try {
      alert(userId)
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
        <div className="w-full max-w-xl h-64 overflow-y-auto bg-gray-100 p-4 rounded shadow">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-2 ${msg.from_ws ? 'text-blue-500' : 'text-black'}`}>
              {msg.content}
            </div>
          ))}
        </div>

        <div className="flex gap-3 w-full max-w-xl">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="Введіть повідомлення..."
          />
          <button
            onClick={handleSendMessage}
            className="p-2 w-12 h-12 bg-violet-500 rounded-full hover:bg-violet-600 transition-all"
          >
            <Send className="m-auto text-white" />
          </button>
        </div>

        <button onClick={handleCreateMeeting} className="bg-blue-600 text-white px-4 py-2 rounded">
          Create Zoom Meeting
        </button>
      </div>
    </>
  );
}
