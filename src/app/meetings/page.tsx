'use client';

import axios from "axios";
import { useState } from "react";

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

  return (
    <div>
      <button onClick={handleCreateMeeting} className="bg-blue-600 text-white px-4 py-2 rounded">
        Create Zoom Meeting
      </button>
      {meetingUrl && (
        <p className="mt-2">
          <a href={meetingUrl} target="_blank" className="text-blue-500 underline">
            Go to discussion
          </a>
        </p>
      )}
    </div>
  );
}
