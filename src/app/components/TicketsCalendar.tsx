'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useState } from 'react';
import TaskModal from '@/app/components/ShowTicket';

interface Task {
  id: number;
  title: string;
  description?: string;
  deadline: string;
  created_at?: string;
  updated_at?: string;
  reporter_name?: string;
  type_name?: string;
}

export default function TicketCalendar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const fetchTasks = async (startStr: string, endStr: string) => {
    try {
      const selectedProject = Cookies.get('selectedProject');
      if (!selectedProject) {
        console.warn('No project selected in cookies');
        return [];
      }

      const start = startStr.split('T')[0];
      const end = endStr.split('T')[0];

      const response = await axios.get('http://127.0.0.1:8008/api/v1/tasks/calendar/', {
        params: { start, end, projectId: selectedProject },
      });

      const tasks = response.data;

      return tasks.map((task: any) => ({
        title: task.title,
        date: task.deadline,
        id: task.id,
        extendedProps: {
          type_name: task.type_name,
          description: task.description,
          reporter_name: task.reporter_name,
          created_at: task.created_at,
          updated_at: task.updated_at,
        },
      }));
    } catch (error) {
      console.error('Failed to fetch calendar tasks', error);
      return [];
    }
  };

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        height="auto"
        dayMaxEventRows={4}
        eventDisplay="block"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek',
        }}
        events={async (fetchInfo, successCallback, failureCallback) => {
          const start = fetchInfo.startStr;
          const end = fetchInfo.endStr;
          const events = await fetchTasks(start, end);
          successCallback(events);
        }}
        eventClick={(info) => {
          const task: Task = {
            id: Number(info.event.id),
            title: info.event.title,
            deadline: info.event.startStr,
            ...info.event.extendedProps,
          };
          setSelectedTask(task);
          setIsModalOpen(true);
        }}
        eventClassNames={['bg-transparent border-none']}
        eventContent={(arg) => {
          return (
            <div className="h-full w-full max-h-15 mx-auto mt-2 bg-violet-500/50 rounded-lg px-1 flex-col gap-10 cursor-pointer hover:bg-violet-600/50">
              <h2>
                {arg.event.title.length > 15 ? `${arg.event.title.slice(0, 15)}...` : arg.event.title}
              </h2>
              <span className="text-xs text-white/70">
                {arg.event.extendedProps?.type_name}
              </span>
            </div>
          );
        }}
      />

      <TaskModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        task={selectedTask}
        onEdit={() => console.log('Редагувати', selectedTask?.id)}
        onDelete={() => console.log('Видалити', selectedTask?.id)}
      />
    </>
  );
}
