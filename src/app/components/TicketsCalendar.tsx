'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'
import axios from 'axios';
import Cookies from 'js-cookie';


export default function TicketCalendar() {
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
        params: {
          start,
          end,
          projectId: selectedProject,
        },
      });

      const tasks = response.data;

      return tasks.map((task: any) => ({
        title: task.title,
        date: task.deadline,
        id: task.id,
        extendedProps: {
          type_name: task.type_name
        }
      }));
    } catch (error) {
      console.error('Failed to fetch calendar tasks', error);
      return [];
    }
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin]}
      initialView="dayGridMonth"
      events={async (fetchInfo, successCallback, failureCallback) => {
        const start = fetchInfo.startStr;
        const end = fetchInfo.endStr;
        const events = await fetchTasks(start, end);
        successCallback(events);
      }}
      height="auto"

      eventClassNames={['bg-transparent border-none']}
      eventContent={(arg) => {
        return (
          <div className="h-full max-h-15 bg-violet-500/50 rounded-lg p-2">
            <h2 className=''>{arg.event.title.length > 15 ? `${arg.event.title.slice(0, 15)}...` : arg.event.title}</h2>
            {/* <h2 className='bg-white/20'>{arg.event.extendedProps.type_name}</h2> */}
          </div>
        );
      }}
      dayMaxEventRows={4}
        eventDisplay="block"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay',
        }}
    />
  );
}
