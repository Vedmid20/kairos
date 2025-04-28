'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Briefcase, Layers, ClipboardList, Hash, CalendarDays } from 'lucide-react';

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {subscriptions.map((subscription) => (
            <div key={subscription.id} className="p-4 dark:bg-black/5 rounded-lg relative shadow flex items-center border-t-8 border border-violet-500">
              <div className="w-full">
                <div className="flex gap-4 items-center">
                  <Layers className="w-16 h-16 p-2 rounded-full bg-violet-500 text-white" />
                  <p className="text-[1.5rem]">{subscription.task_title || `Task #${subscription.task}`}</p>
                </div>
                <div className="bg-white/0 w-auto rounded-lg p-3 mt-3">
                  <p className="text-sm border-b-2 pb-2 border-black/50 dark:border-white/75 flex">
                    <Hash className='w-6 h-6 text-black/75 dark:text-white my-1 mr-2' />
                    <span className='my-auto'>Task ID: {subscription.task}</span>
                  </p>
                  <p className="text-sm flex">
                    <Briefcase className="w-6 h-6 text-black/75 dark:text-white my-1 mr-2" />
                    <span className='my-auto'>Status: {subscription.task_status || 'Unknown'}</span>
                  </p>
                  <p className="text-sm flex">
                    <ClipboardList className="w-6 h-6 text-black/75 dark:text-white my-1 mr-2" />
                    <span className='my-auto'>Subscription: {subscription.subscription_type}</span>
                  </p>
                  <p className="text-sm flex">
                    <CalendarDays className="w-6 h-6 text-black/75 dark:text-white my-1 mr-2" />
                    <span className='my-auto'>Subscribed on: {new Date(subscription.created_at).toLocaleDateString()}</span>
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
