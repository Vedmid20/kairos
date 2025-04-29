'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Briefcase, Layers, ClipboardList, Hash, CalendarDays, Bug, Check, CheckCircle, Star, MoreHorizontal, MoreVertical } from 'lucide-react';

interface TaskSubscriber {
  id: number;
  task: number;
  subscription_type: string;
  task_title: string; // нове поле
  task_status: string; // нове поле
  created_at: string;  // нове поле
}

const getUserIdFromToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('access_token');
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    return decoded.user_id;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

const SubscribesPage = () => {
  const [subscriptions, setSubscriptions] = useState<TaskSubscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      const userId = getUserIdFromToken();
      const token = localStorage.getItem('access_token');

      if (!userId || !token) return;

      try {
        const response = await axios.get(
          `http://127.0.0.1:8008/api/v1/task-subscribers/?user=${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSubscriptions(response.data);
      } catch (error) {
        console.error('Failed to fetch subscriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="mb-4">Subscribes</h1>
      <title>Subscribes</title>
      {subscriptions.length > 0 ? (
        <div className="grid grid-cols-4 gap-4">
          {subscriptions.map((subscription) => (
            <div key={subscription.id} className="p-2 dark:bg-black/5 rounded-lg relative shadow flex border-t-8 border border-violet-500">
              <div className="w-full">
                <div className="flex my-auto justify-between">
                  <div className="flex gap-1 items-center">
                    <Hash className="w-16 h-16 p-2 rounded-full " />
                    <p className="text-[1.5rem]">{subscription.task_details.project_task_id}</p>
                  </div>
                  <div className="flex my-auto">
                    <Star className="w-10 h-10 p-2 rounded-full hover:text-yellow-400 dark:hover:text-yellow-300 transition cursor-pointer" strokeWidth={1}/>
                    <MoreVertical className="w-10 h-10 p-2 rounded-full transition cursor-pointer hover:bg-black/5 dark:hover:bg-white/10"/>
                  </div>
                </div>
                <div className="bg-transparent w-auto rounded-lg p-3">
                  <p className="flex">
                    <Bug className='w-6 h-6 text-black/75 dark:text-white my-1 mr-2' />
                    <span className='bg-violet-500/50 px-3 rounded-full text-black dark:text-white my-auto'>{subscription.task_details.type_name}</span>
                  </p>
                  <p className="flex">
                    <CheckCircle className="w-6 h-6 text-black/75 dark:text-white my-1 mr-2" />
                    <span className='bg-black/10 dark:bg-white/10 px-3 rounded-full text-black dark:text-white my-auto'>{subscription.task_details.status_name}</span>
                  </p>
                  <p className="text-sm py-2 my-2 bg-black/5 dark:bg-white/10 p-2 rounded-lg border-t-8 border-t-black/10 dark:border-t-white/15">
                    <span className='my-auto'>{subscription.task_details.title}</span>
                  </p>
                  <p className="text-sm">
                    <span className='my-auto'>Deadline {new Date(subscription.task_details.deadline).toLocaleDateString()}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No subscriptions found.</p>
      )}
    </div>
  );
};

export default SubscribesPage;
