'use client';

import { Filter, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookie from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  reporter_name: string;
  deadline: string;
  type_name: string;
}

const TicketPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [comment, setComment] = useState("");
  const projectId = Cookie.get('selectedProject');

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
        const res = await axios.get(`http://127.0.0.1:8008/api/v1/tasks?projectId=${projectId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTasks(res.data);
      } catch (err) {
        console.error("Error", err);
      }
    };

    fetchTasks();
  }, []);

const handleCommentSubmit = async () => {
  if (!selectedTask || !comment.trim()) return;

  const token = localStorage.getItem("access_token");
  if (!token) return;

  try {
    const decoded: any = jwtDecode(token);
    console.log(selectedTask.id, comment, decoded.user_id)
    await axios.post(
      "http://127.0.0.1:8008/api/v1/comments/",
      {
        text: comment,
        comment_for_task: selectedTask.id,
        author: decoded.user_id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );

    setComment("");
    } catch (err: any) {
    if (err.response) {
      console.error("Помилка при надсиланні коментаря:", err.response.data);
    } else {
      console.error("Інша помилка:", err.message);
    }
  }
};



  return (
    <div className='mb-10'>
      <h1 className='mb-4'>Tickets</h1>
      <title>Tickets</title>

      <div className="flex justify-between">
        <div className="relative">
          <input
            type="search"
            className="mb-4 pl-10 pr-4 py-2 border rounded-lg"
            placeholder="Search tickets"/>
          <div className="absolute inset-y-1 left-0 pl-3 -top-3 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-400"/>
          </div>
        </div>
        <div className="ml-10">
          <div className="flex gap-5">
            <div className="m-auto rounded-lg hover:bg-white/10 px-1 cursor-pointer">
              <p className="flex gap-2 header-button px-2 py-2">Filter <Filter
                className="w-5 h-5 text-gray-400 m-auto"/></p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-10">
        <div className="flex flex-col gap-3 w-96">
          {tasks.map(task => (
              <div
                key={task.id}
                className="border rounded-lg p-4 shadow bg-white dark:bg-black/10 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10"
                onClick={() => setSelectedTask(task)}>
                <h2 className="text-xl font-semibold">{task.title}</h2>
                <p className="text-gray-600 dark:text-gray-300">{task.description}</p>
              </div>
          ))}
        </div>

        <div className="flex-1 border rounded-lg p-6 shadow bg-white dark:bg-black/10 word-break">
          {selectedTask ? (
            <>
              <h2 className="text-2xl font-bold mb-2">{selectedTask.title}</h2>
              <p className="mb-2">{selectedTask.description}</p>
              <p>Status: {selectedTask.status}</p>
              <p>Created: {selectedTask.created_at}</p>
              <p>Reporter: {selectedTask.reporter_name}</p>
              <p>Deadline: {selectedTask.deadline}</p>
              <p>Type: {selectedTask.type_name}</p>

              <div className="mt-6">
                <textarea
                  className="w-full p-2 border rounded mb-2 !transform-none min-h-20 max-h-96"
                  placeholder="Напиши коментар..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}/>
                <button
                  onClick={handleCommentSubmit}
                  className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700">
                  Send
                </button>
              </div>
            </>) : (
                <p className="">Choose a ticket</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default TicketPage;
