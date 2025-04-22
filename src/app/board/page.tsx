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

const TaskBoard = () => {
  const [statuses, setStatuses] = useState([]);
  const [tasksByStatus, setTasksByStatus] = useState({});
  const projectId = Cookie.get('selectedProject');
  const token = localStorage.getItem('access_token');

  const fetchStatuses = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8008/api/v1/task-status/`);
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

    if (
      sourceStatusId === destStatusId &&
      source.index === destination.index
    ) {
      return;
    }

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
                        <h2 className="font-semibold capitalize mb-3">
                        {status.task_status_name}
                      </h2>
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
                                    <span className="bg-violet-500/50 px-3 rounded-full text-black dark:text-white my-auto">{task.type_name}</span>
                                    <span className='bg-black/10 dark:bg-white/10 px-3 rounded-full text-black dark:text-white my-auto'>{task.project_task_id}</span>
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
        </DragDropContext>
      </div>
    </>
  );
};

export default TaskBoard;
