'use client';

import axios from "axios";
import { useEffect, useRef, useState } from "react";

export default function CreateZoomButton({ name }: { name: string }) {
  const [meetingUrl, setMeetingUrl] = useState("");
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8008/ws/meetings/");

    socketRef.current = socket;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("WebSocket message received:", data.message);
    };

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => socket.close();
  }, []);

  const handleCreateMeeting = async () => {
    try {
      const res = await axios.post("http://localhost:8008/api/zoom/create-meeting/", {
        topic: `${name} Discussion`,
      });
      setMeetingUrl(res.data.join_url);

      // Надсилаємо повідомлення через WebSocket
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({
          message: `Meeting "${name}" created`,
        }));
      }
    } catch (err) {
      console.error("Zoom meeting error:", err);
      alert("Cant create zoom meeting");
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
      <div className="flex justify-center">
        <button onClick={handleCreateMeeting} className="bg-blue-600 text-white px-4 py-2 rounded">
          Create Zoom Meeting
        </button>
      </div>
    </>
  );
}
