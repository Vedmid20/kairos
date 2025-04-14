'use client';

import { Filter, Search, Pen, Trash } from "lucide-react";
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

interface Comment {
  id: number;
  text: string;
  author: string;
  author_name: string;
  created_at: string;
  author_avatar: string;
}

const TicketPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [comment, setComment] = useState("");
  const projectId = Cookie.get('selectedProject');
  const [comments, setComments] = useState<Comment[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [newCommentText, setNewCommentText] = useState("");
  const token: string | null = localStorage.getItem("access_token");
  const decoded: any = jwtDecode(token!);

  useEffect(() => {
    if (token) {
      const decoded: any = jwtDecode(token);
      setUserId(decoded.user_id);
    }
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
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

  useEffect(() => {
    const fetchComments = async () => {
      if (!selectedTask) return;

      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
        const res = await axios.get(`http://127.0.0.1:8008/api/v1/comments/?task_id=${selectedTask.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setComments(res.data);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    fetchComments();
  }, [selectedTask]);

  const handleCommentSubmit = async () => {
    if (!selectedTask || !comment.trim()) return;

    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
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
        console.error("Error after creating the comment", err.response.data);
      } else {
        console.error("Other error", err.message);
      }
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8008/api/v1/comments/${commentId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (err: any) {
      if (err.response) {
        console.error("Error after deleting the comment", err.response.data);
      } else {
        console.error("Other error", err.message);
      }
    }
  };

  const handleEditComment = (comment: Comment) => {
    setEditingComment(comment);
    setNewCommentText(comment.text); // Set the initial value for editing
  };

  const handleUpdateComment = async () => {
    if (!editingComment || !newCommentText.trim()) return;

    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      await axios.patch(
        `http://127.0.0.1:8008/api/v1/comments/${editingComment.id}/`,
        { text: newCommentText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      setComments(prev =>
        prev.map(comment =>
          comment.id === editingComment.id ? { ...comment, text: newCommentText } : comment
        )
      );
      setEditingComment(null); // Close the edit modal
    } catch (err: any) {
      if (err.response) {
        console.error("Error updating the comment", err.response.data);
      } else {
        console.error("Other error", err.message);
      }
    }
  };

  return (
    <div className="mb-10">
      <h1 className="mb-4">Tickets</h1>
      <title>Tickets</title>

      <div className="flex justify-between">
        <div className="relative">
          <input
            type="search"
            className="mb-4 pl-10 pr-4 py-2 border rounded-lg"
            placeholder="Search tickets"/>
          <div className="absolute inset-y-1 left-0 pl-3 -top-3 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        <div className="ml-10">
          <div className="flex gap-5">
            <div className="m-auto rounded-lg hover:bg-white/10 px-1 cursor-pointer">
              <p className="flex gap-2 header-button px-2 py-2">
                Filter <Filter className="w-5 h-5 text-gray-400 m-auto" />
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-5">
        <div className="flex flex-col w-72 border h-full max-h-[40rem] rounded-lg border-violet-500 border-t-8 overflow-auto">
          {tasks.map(task => (
            <div
              key={task.id}
              className="border p-4 rounded-lg shadow bg-white dark:bg-black/10 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10"
              onClick={() => setSelectedTask(task)}>
              <h2 className="text-md font-semibold">{task.title}</h2>
              <p className="">
                <span className="bg-violet-500/50 px-3 rounded-full text-black dark:text-white my-auto">
                  {task.type_name}
                </span>
              </p>
            </div>
          ))}
        </div>

        <div className="flex-1 max-h-[40rem] border rounded-lg p-5 shadow bg-white dark:bg-black/10 word-break h-full border-violet-500 border-t-8">
          {selectedTask ? (
            <>
              <p className="mb-2">
                <span className="bg-violet-500/50 px-3 rounded-full text-black dark:text-white my-auto">
                  {selectedTask.type_name}
                </span>
              </p>
              <h2 className="text-2xl font-bold mb-1">{selectedTask.title}</h2>
              <p className="mb-2">
                Reporter{" "}
                <span className="bg-violet-500/50 px-3 rounded-full text-black dark:text-white my-auto">
                  {selectedTask.reporter_name}
                </span>
              </p>
              <button className="header-button">Show Description</button>
              <p className="mb-2 bg-black/10 dark:bg-white/15 p-2 rounded-lg border-t-8 border-black/10 dark:border-white/20">
                {selectedTask.description.length > 250
                  ? `${selectedTask.description.slice(0, 250)}...`
                  : selectedTask.description}
              </p>
              <p>Status {selectedTask.status}</p>
              <p className="text-sm">
                Created at{" "}
                <span className="dark:bg-white/15 bg-black/10 px-3 rounded-full text-black dark:text-white my-auto">
                  {selectedTask.created_at}
                </span>
              </p>
              <p className="text-sm">
                Deadline{" "}
                <span className="dark:bg-white/15 bg-black/10 px-3 rounded-full text-black dark:text-white my-auto">
                  {selectedTask.deadline}
                </span>
              </p>

              <div className="mt-6">
                <textarea
                  className="w-full p-2 border rounded mb-2 !transform-none min-h-20 max-h-64"
                  placeholder="Write a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}/>
                <button
                  onClick={handleCommentSubmit}
                  className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700">
                  Send
                </button>
              </div>
            </>
          ) : (
            <p className="">Choose a ticket</p>
          )}
        </div>
        <div className="w-96 p-5 text-center border-violet-500 border-t-8 h-[40rem] border rounded-lg overflow-auto">
          <h3 className="text-2xl font-semibold mb-2">Comments</h3>
          {comments.length === 0 ? (
            <p className="text-gray-500">No comments yet.</p>
          ) : (
            <ul className="text-left space-y-4">
              {comments.map((comment: any, idx) => (
                <li key={idx} className="flex gap-2">
                  <img
                    src={comment.author_avatar}
                    alt="avatar"
                    className="rounded-full w-10 h-10"/>
                  <div className="bg-black/10 dark:bg-white/10 p-3 rounded-lg rounded-tl-none w-full">
                    <p className="text-sm mb-1 text-violet-500 dark:text-violet-400">
                      {comment.author_name || "Anonymous"}
                    </p>
                    <p className="text-sm">{comment.text}</p>
                    <div className="flex justify-between gap-10">
                      <p className="text-xs text-gray-400 my-auto">
                        {new Date(comment.created_at).toLocaleString()}
                      </p>

                      {userId === comment.author && (
                        <div className="flex gap-1">
                          <Pen
                            className="w-6 cursor-pointer transition-all hover:bg-violet-500/50 rounded-full px-1"
                            onClick={() => handleEditComment(comment)}/>
                          <Trash
                            className="w-6 cursor-pointer transition-all hover:bg-red-400 rounded-full px-1"
                            onClick={() => handleDeleteComment(comment.id)}/>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {editingComment && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/50">
          <div className="bg-white dark:bg-grey p-6 rounded-lg w-[50rem] h-[20rem]">
            <h3 className="text-xl font-semibold mb-4">Edit Comment</h3>
            <textarea
              className="w-full p-2 border rounded mb-4"
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
            />
            <div className="flex justify-start gap-2">
              <button
                  className="bg-violet-600 text-white px-4 py-2 rounded"
                  onClick={handleUpdateComment}>Save</button>
              <button
                className="bg-white/15 px-4 py-2 rounded"
                onClick={() => setEditingComment(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketPage;
