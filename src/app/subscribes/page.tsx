'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Hash, Bug, CheckCircle, Star, MoreVertical, Search, Filter } from 'lucide-react';
import { Popover } from '@headlessui/react';
import TaskModal from '../components/ShowTicket';
import Cookie from 'js-cookie';

interface TaskSubscriber {
  id: number;
  task: number;
  subscription_type: string;
  task_title: string;
  task_status: string;
  created_at: string;
}


const SubscribesPage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [subscriptions, setSubscriptions] = useState<TaskSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const projectId = Cookie.get('selectedProject');

  useEffect(() => {
    const fetchSubscriptions = async () => {
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
  }, [userId, token]);

  useEffect(() => {
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUserId(decoded.user_id);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, [token]);


  const handleUnsubscribe = async (taskId: number) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8008/api/v1/task-subscribers/?task=${taskId}&user=${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const subscriptions = response.data;
    if (subscriptions.length > 0) {
      await axios.delete(
        `http://127.0.0.1:8008/api/v1/task-subscribers/?task=${taskId}&user=${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      window.location.reload()
    } else {
      console.log('No subscription found for this user');
    }
  } catch (error) {
    console.error('Unsubscribe error', error);
  }
};


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="mb-4">Subscribes</h1>
      <title>Subscribes</title>
      
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

          <div className=" rounded-lg my-auto hover:bg-white/10 px-1 cursor-pointer">
              <p className="flex gap-2 header-button px-2 py-2">Filter <Filter
                  className="w-5 h-5 text-gray-400 m-auto"/></p>
          </div>
      </div>

      {subscriptions.length > 0 ? (
        <div className="grid grid-cols-4 gap-4">
          {subscriptions.map((subscription) => (
            <div key={subscription.id} className="p-2 dark:bg-black/5 rounded-lg relative shadow flex border-t-8 border border-violet-500">
              <div className="w-full">
                <div className="flex my-auto justify-between">
                  <div className="flex gap-1 items-center">
                    <Hash className="w-12 h-12 p-2 rounded-full " />
                    <p className="text-[1.5rem]">{subscription.task_details.project_task_id}</p>
                  </div>
                  <div className="flex my-auto">
                    <Popover className="relative">
                        <Popover.Button className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full">
                          <MoreVertical className='w-6 h-6'/>
                        </Popover.Button>
                        <Popover.Panel className="absolute z-10 right-0 mt-2 w-36 border border-violet-500 rounded shadow-md bg-white dark:bg-grey">
                          <div className="flex flex-col text-sm">
                            <button
                              onClick={() => {
                                setSelectedTicket(subscription.task_details);
                                setIsTaskModalOpen(true);
                            }}
                              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-violet-500 transition-all text-left rounded">
                              Show
                            </button>
                            <button
                              onClick={() => handleUnsubscribe(subscription.task)}
                              className="px-4 py-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 transition-all text-left rounded">
                              Unsubscribe
                            </button>
                          </div>
                        </Popover.Panel>
                      </Popover>
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

          {isTaskModalOpen && selectedTicket && (
              <TaskModal
                  isOpen={isTaskModalOpen}
                  onRequestClose={() => setIsTaskModalOpen(false)}
                  task={selectedTicket}
                  onEdit={() => console.log('Редагувати', selectedTicket.id)}
                  onDelete={() => console.log('Видалити', selectedTicket.id)}/>
          )}
        </div>
      ) : (
        <p>No subscriptions found.</p>
      )}
    </div>
  );
};

export default SubscribesPage;
