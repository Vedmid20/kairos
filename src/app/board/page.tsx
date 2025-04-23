'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import Cookie from 'js-cookie';
import { MoreHorizontal, Check, Plus } from 'lucide-react';
import { Popover, Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import CreateTicketModal from '../components/CreateTicket';

const TaskBoard = () => {
  const [statuses, setStatuses] = useState([]);
  const [tasksByStatus, setTasksByStatus] = useState({});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [editName, setEditName] = useState('');
  const [newStatusName, setNewStatusName] = useState('');
  const projectId = Cookie.get('selectedProject');
  const token = localStorage.getItem('access_token');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const fetchStatuses = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8008/api/v1/task-status/?projectId=${projectId}`);
      const sortedStatuses = [
        ...res.data.filter((s) => s.task_status_name.toLowerCase() !== 'done'),
        ...res.data.filter((s) => s.task_status_name.toLowerCase() === 'done'),
      ];
      setStatuses(sortedStatuses);
    } catch (err) {
      console.error('Error fetching statuses:', err);
    }
  };

  const fetchTasks = async (statusList) => {
    try {
      const res = await axios.get(`http://127.0.0.1:8008/api/v1/tasks?projectId=${projectId}`);
      const grouped = {};
      statusList.forEach((status) => {
        grouped[status.id] = [];
      });
      res.data.forEach((task) => {
        const statusId = task.status || task.status_id || statusList[0].id;
        if (grouped[statusId]) {
          grouped[statusId].push(task);
        } else {
          grouped[statusList[0].id].push(task);
        }
      });
      setTasksByStatus(grouped);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const updateTaskStatus = async (taskId, newStatusId) => {
    try {
      const response = await axios.patch(
        `http://127.0.0.1:8008/api/v1/tasks/${taskId}/`,
        { status: newStatusId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const confirmEditStatus = async () => {
    try {
      await axios.patch(`http://127.0.0.1:8008/api/v1/task-status/${selectedStatus.id}/`, {
        task_status_name: editName,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditModalOpen(false);
      fetchStatuses();
    } catch (err) {
      console.error('Failed to update status name', err);
    }
  };

  const confirmDeleteStatus = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8008/api/v1/task-status/${selectedStatus.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteModalOpen(false);
      fetchStatuses();
    } catch (err) {
      console.error('Failed to delete status', err);
    }
  };

  const confirmCreateStatus = async () => {
    try {
      await axios.post(
        `http://127.0.0.1:8008/api/v1/task-status/?projectId=${projectId}`,
        { task_status_name: newStatusName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCreateModalOpen(false);
      setNewStatusName('');
      fetchStatuses();
    } catch (err) {
      console.error('Failed to create status', err);
    }
  };

  const handleEditStatus = (status) => {
    setSelectedStatus(status);
    setEditName(status.task_status_name);
    setEditModalOpen(true);
  };

  const handleDeleteStatus = (status) => {
    setSelectedStatus(status);
    setDeleteModalOpen(true);
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  useEffect(() => {
    if (statuses.length > 0) {
      fetchTasks(statuses);
    }
  }, [statuses, projectId]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    const sourceStatusId = source.droppableId;
    const destStatusId = destination.droppableId;
    if (sourceStatusId === destStatusId && source.index === destination.index) return;
    const sourceItems = [...tasksByStatus[sourceStatusId]];
    const [movedItem] = sourceItems.splice(source.index, 1);
    const destItems = [...tasksByStatus[destStatusId]];
    destItems.splice(destination.index, 0, movedItem);
    setTasksByStatus({
      ...tasksByStatus,
      [sourceStatusId]: sourceItems,
      [destStatusId]: destItems,
    });
    updateTaskStatus(movedItem.id, destStatusId).catch(() => {
      fetchTasks(statuses);
    });
  };

  return (
    <>
      <div>
        <title>Board</title>
        <h1>Board</h1>

        <div className="flex justify-end px-4">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="header-button px-2 rounded-lg hover:bg-white/10 py-2">
            New Status
          </button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="overflow-x-auto">
            <div className="flex gap-4 p-4 min-w-[1000px]">
              {statuses.map((status) => (
                <Droppable droppableId={status.id.toString()} key={status.id}>
                  {(provided) => (
                    <div
                      className="p-4 rounded w-[20rem] flex-shrink-0 border-violet-500 border-t-8 border max-h-[30rem]"
                      ref={provided.innerRef}
                      {...provided.droppableProps}>
                      <div className="flex justify-between items-center mb-3">
                      <h2 className="font-semibold capitalize flex items-center gap-2">
                          {status.task_status_name}
                          {status.task_status_name.toLowerCase() === 'done' && <Check size={18} className="text-green-600" />}
                        </h2>

                        {!status.is_default && (
                          <Popover className="relative">
                            <Popover.Button className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full">
                              <MoreHorizontal />
                            </Popover.Button>
                            <Popover.Panel className="absolute z-10 right-0 mt-2 w-36  border border-violet-500 rounded shadow-md">
                              <div className="flex flex-col text-sm">
                                <button
                                  onClick={() => handleEditStatus(status)}
                                  className="px-4 py-2 hover:bg-black/10 dark:hover:bg-white/15 text-left rounded">
                                  Change
                                </button>
                                <button
                                  onClick={() => handleDeleteStatus(status)}
                                  className="px-4 py-2 text-red-600 hover:bg-red-400/20 text-left rounded">
                                  Delete
                                </button>
                              </div>
                            </Popover.Panel>
                          </Popover>
                        )}
                      </div>
                      <div className="overflow-auto max-h-[25rem]">
                        {tasksByStatus[status.id] &&
                          tasksByStatus[status.id].map((task, index) => (
                            <Draggable
                              draggableId={task.id.toString()}
                              index={index}
                              key={task.id}>
                              {(provided) => (
                                <div
                                  className="flex-col p-2 rounded shadow-md mb-2 bg-black/5 dark:bg-white/10 hover:bg-black/10 transition-all dark:hover:bg-white/20"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}>
                                  <p>{task.title}</p>
                                  <div className="flex gap-2">
                                    <span className="bg-violet-500/50 px-3 rounded-full text-black dark:text-white my-auto">
                                      {task.type_name}
                                    </span>
                                    <span className="bg-black/10 dark:bg-white/10 px-3 rounded-full text-black dark:text-white my-auto">
                                      {task.project_task_id}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                      </div>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </div>
            <button
                onClick={openModal}
                className="fixed bottom-6 right-6 z-50 p-4 bg-violet-500 text-white rounded-full shadow-lg hover:bg-violet-600 transition">
                <Plus size={24} />
            </button>
        </DragDropContext>
        <CreateTicketModal isOpen={isModalOpen} onClose={closeModal}>
          <div></div>
        </CreateTicketModal>
      </div>

      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white dark:bg-grey p-6 rounded max-w-sm w-full">
            <Dialog.Title className="text-lg font-semibold">Update status</Dialog.Title>
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
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full mt-3 p-2 border rounded bg-white dark:bg-gray-800"
              placeholder="Name of status"/>
            <div className="flex justify-start gap-2 mt-4">
              <button onClick={confirmEditStatus} className="px-3 py-1 rounded bg-violet-500 text-white hover:bg-violet-600 transition-all">
                Confirm
              </button>
              <button onClick={() => setEditModalOpen(false)} className="px-3 py-2 rounded bg-black/10 hover:bg-black/15 dark:bg-white/15 dark:hover:bg-white/20 transition-all">
                Cancel
              </button>
            </div>
            </motion.div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white dark:bg-grey p-6 rounded max-w-sm w-full">
            <Dialog.Title className="text-lg font-semibold ">Delete status</Dialog.Title>
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
            <p className="mt-2">Are you sure you want to delete "{selectedStatus?.task_status_name}"?</p>
            <div className="flex justify-start gap-2 mt-4">
            <button onClick={confirmDeleteStatus} className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 transition-all text-white">
                Delete
              </button>
              <button onClick={() => setDeleteModalOpen(false)} className="px-3 py-2 rounded bg-black/10 hover:bg-black/15 dark:bg-white/15 dark:hover:bg-white/20 transition-all">
                Cancel
              </button>
            </div>
            </motion.div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <Dialog open={createModalOpen} onClose={() => setCreateModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white dark:bg-gray-900 p-6 rounded max-w-sm w-full">
            <Dialog.Title className="text-lg font-semibold">Create new status</Dialog.Title>
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
            <input
              value={newStatusName}
              onChange={(e) => setNewStatusName(e.target.value)}
              className="w-full mt-3 p-2 border rounded bg-white dark:bg-gray-800"
              placeholder="Name of new status"
            />
            <div className="flex justify-start gap-2 mt-4">
            <button onClick={confirmCreateStatus} className="px-3 py-2 rounded bg-violet-500 text-white hover:bg-violet-600 transition-all">
                Create
              </button>
              <button onClick={() => setCreateModalOpen(false)} className="px-3 py-2 rounded bg-black/10 hover:bg-black/15 dark:bg-white/15 dark:hover:bg-white/20 transition-all">
                Cancel
              </button>
            </div>
            </motion.div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default TaskBoard;
