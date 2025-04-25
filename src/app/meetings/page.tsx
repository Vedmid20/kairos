'use client';

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateZoomButton({ name }: { name: string }) {
  const [meetingUrl, setMeetingUrl] = useState("");

  const handleCreateMeeting = async () => {
    try {
      const res = await axios.post("http://localhost:8008/api/zoom/create-meeting/", {
        topic: `${name} Discussion`,
      });
      setMeetingUrl(res.data.join_url);
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
  }, [meetingUrl])

  return (
    <div>
      <h1>Meetings</h1>
      <title>Meetings</title>
      <button onClick={handleCreateMeeting} className="bg-blue-600 text-white px-4 py-2 rounded">
        Create Zoom Meeting
      </button>
    </div>
  );
}
