'use client';

import Modal from 'react-modal';
import { Pen, Trash, X, Megaphone } from 'lucide-react';
import React, { use, useEffect, useState } from "react";
import axios from 'axios';
import {jwtDecode} from "jwt-decode";
import {motion} from "framer-motion";
import ChangeTicketModal from './ChangeTicket';
import '@/app/components/components-styles.scss'

interface Task {
  id: number;
  title: string;
  description: string;
  deadline: string;
  created_at: string;
  updated_at: string;
  reporter_name: string;
  type_name: string;
  project_task_id: string;
}

interface Comment {
  id: number;
  author: string;
  text: string;
  created_at: string;
}

interface TaskModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  task: Task | null;
  onEdit: () => void;
  onDelete: () => void;
}

Modal.setAppElement('#__next');

export default function TaskModal({ isOpen, onRequestClose, task, onEdit, onDelete }: TaskModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState("");
  const token: string | null = localStorage.getItem("access_token");
  const decoded: any = jwtDecode(token!);
  const [userId, setUserId] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [newCommentText, setNewCommentText] = useState("");
  const [commentToDelete, setCommentToDelete] = useState<Comment | null>(null);
  const [projectTaskId, setProjectTaskId] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Task | null>(null);

  useEffect(() => {
    if (token) {
      const decoded: any = jwtDecode(token);
      setUserId(decoded.user_id);
    }
  }, []);

  useEffect(() => {
    if (task?.id && isOpen) {
      console.log("task", task);
      axios.get(`http://127.0.0.1:8008/api/v1/tasks/${task.id}`)
        .then(res => setProjectTaskId(res.data.project_task_id))
      axios.get(`http://127.0.0.1:8008/api/v1/comments/?task_id=${task.id}`)
        .then(res => setComments(res.data))
        .catch(err => console.error('Error fetching comments', err));
    }

    document.body.style.overflow = isOpen ? 'hidden' : '';
  }, [task?.id, isOpen]);

  const handleCommentSubmit = async () => {
    try {
        await axios.post(
          "http://127.0.0.1:8008/api/v1/comments/",
          {
            text: comment,
            comment_for_task: task.id,
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
    setNewCommentText(comment.text);
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
      setEditingComment(null);
    } catch (err: any) {
      if (err.response) {
        console.error("Error updating the comment", err.response.data);
      } else {
        console.error("Other error", err.message);
      }
    }
  };

  if (!task) return null;

  const openTicketModal = (task: Task) => {
    setSelectedTicket(task);
  };

  const closeTicketModal = () => {
      setSelectedTicket(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="bg-white z-50 dark:bg-grey rounded-2xl shadow-xl w-[80rem] h-full max-h-[45rem] overflow-auto p-6 mx-auto m-auto relative outline-none"
      overlayClassName="fixed inset-0 bg-black/50 flex items-start justify-center z-20">
      <div className="flex justify-between">
        <div className="flex gap-5">
        <h2 className="text-xl mb-4">{projectTaskId}</h2> |
        <span className='flex gap-2'><Megaphone /> {task.reporter_name}</span> |
        <p><span className="px-2 bg-violet-500/50 rounded-full">{task.type_name}</span></p>
        </div>
        <button onClick={onRequestClose} className="text-gray-500 hover:text-black my-auto">
          <X className="w-5 h-5" />
        </button>
      </div>

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
        className="relative z-50">
      <div className="flex justify-between gap-10">
        <div className="max-w-[45rem]">
          <div className="space-y-2">
            <h2 className='text-2xl mb-3'>{task.title}</h2>
            <p className='bg-black/10 p-2 text-lg rounded-lg border-t-8 border-black/10 dark:bg-white/15 dark:border-white/20'>{task.description}</p>
            <div className="flex justify-between">
                <div className="flex-col">
                  <p>Created at <span className="dark:bg-white/15 bg-black/10 px-3 rounded-full text-black dark:text-white my-auto">{task.created_at}</span></p>
                  <p>Deadline <span className="dark:bg-white/15 bg-black/10 px-3 rounded-full text-black dark:text-white my-auto">{task.deadline}</span></p>
                </div>
                <div className="flex gap-5 my-auto">
                <Pen
                    className="w-8 cursor-pointer transition-all hover:bg-violet-500/50 rounded-full h-8 px-1"
                    onClick={() => openTicketModal(task)}
                    />
                <Trash
                    className="w-8 cursor-pointer transition-all hover:bg-red-400 rounded-full h-8 p-1"
                    />
                </div>
            </div>
          </div>
        </div>

        <div
            className="w-[30rem] space-y-2 ">
          <ul className="text-left space-y-4 border-violet-500 border-t-8 border p-5 rounded-lg overflow-auto max-h-[40rem] ">
            <h3 className="text-2xl font-semibold mb-2 text-center">Comments</h3>
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
                                onClick={() => setEditingComment(comment)}/>
                            <Trash
                                className="w-6 cursor-pointer transition-all hover:bg-red-400 rounded-full px-1"
                                onClick={() => setCommentToDelete(comment)}/>
                          </div>
                      )}
                    </div>
                  </div>
                </li>
            ))}
          </ul>
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
        </div>
      </div>

      {editingComment && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/50">
          <div className="bg-white dark:bg-grey p-6 rounded-lg w-[40rem]">
            <div className="flex justify-between">
              <h3 className="text-xl font-semibold mb-4">Edit Comment</h3>
              <X className="cursor-pointer" onClick={() => setEditingComment(null)}/>
            </div>
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
                className="relative z-50">
            <textarea
              className="w-full p-2 border rounded mb-4 !transform-none min-h-[10rem] max-h-[15rem]"
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
            />
            <div className="flex justify-start gap-2">
              <button
                  className="bg-violet-600 text-white px-4 py-2 rounded"
                  onClick={handleUpdateComment}>Save</button>
              <button
                className="bg-black/20 dark:bg-white/15 px-4 py-2 rounded hover:bg-black/15 dark:hover:bg-white/20"
                onClick={() => setEditingComment(null)}>Cancel</button>
            </div>
            </motion.div>
          </div>
        </div>
      )}

      {commentToDelete && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/50 z-50">
          <div className="bg-white dark:bg-grey p-6 rounded-lg w-[30rem]">
            <div className="flex justify-between">
              <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
              <X className="cursor-pointer" onClick={() => setCommentToDelete(null)}/>
            </div>
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
              className="relative z-50">
            <p>Are you sure you want to delete this comment?</p>
            <div className="flex justify-start gap-2 mt-6">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => {
                  handleDeleteComment(commentToDelete.id);
                  setCommentToDelete(null);
                }}>
                Delete
              </button>
              <button
                className="bg-black/20 dark:bg-white/15 px-4 py-2 rounded hover:bg-black/15 dark:hover:bg-white/20"
                onClick={() => setCommentToDelete(null)}>
                Cancel
              </button>
            </div>
            </motion.div>
          </div>
        </div>
      )}
      {selectedTicket && (
          <ChangeTicketModal
              key={selectedTicket.id}
              ticket={selectedTicket}
              isOpen={Boolean(selectedTicket)}
              onClose={() => setSelectedTicket(null)}/>
      )}
      </motion.div>
    </Modal>
  );
}
