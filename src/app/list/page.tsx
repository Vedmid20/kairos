'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookie from 'js-cookie';
import Loading from "@/app/loading";
import { LoginRequired } from "@/app/lib/auth";
import SelectionToast from "@/app/components/SelectionToast";
import ChangeTicketModal from "@/app/components/ChangeTicket";
import { toast } from "sonner";
import { Bug, FileText, Megaphone, CalendarDays, Clock, Bell, Search, MoreHorizontal, Dock, Filter, CheckCircle, Hash, Plus } from "lucide-react";
import '@/app/styles/globals.scss';
import '@/app/styles/mixins.scss';
import CreateTicketModal from "../components/CreateTicket";

interface Task {
    id: number;
    type_name: string;
    title: string;
    description: string;
    deadline: string;
    reporter_name: string;
    created_at: string;
}

export default function ListPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTickets, setSelectedTickets] = useState<number[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<Task | null>(null);
    const projectId = Cookie.get('selectedProject');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);


    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const response = await axios.get(`http://127.0.0.1:8008/api/v1/tasks?projectId=${projectId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTasks(response.data);
            } catch (error) {
                console.error("Error", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [projectId]);

    if (loading) return <Loading />;
    if (!tasks.length) return <p>No tickets yet :(</p>;

    const handleSelect = (taskId: number) => {
        setSelectedTickets(prev =>
            prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
        );
    };

    const handleDeleteSelected = async () => {
        if (selectedTickets.length === 0) return;

        const token = localStorage.getItem("access_token");
        const headers = { Authorization: `Bearer ${token}` };

        for (const taskId of selectedTickets) {
            try {
                await axios.delete(`http://127.0.0.1:8008/api/v1/tasks/${taskId}/`, { headers });
                setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
            } catch (error) {
                console.error(`Error deleting task ${taskId}:`, error);
            }
        }

        toast.success("Selected list deleted successfully!");
        setSelectedTickets([]);
    };

    const openTicketModal = (task: Task) => {
        setSelectedTicket(task);
    };

    const closeTicketModal = () => {
        setSelectedTicket(null);
    };

    return (
        <>
            <div className="pb-10">
                <title>List</title>
                <LoginRequired/>
                <h1 className="text-1xl mb-4">List</h1>
                <div className="flex justify-between">
                    <div className="relative">
                        <input
                            type="search"
                            className="mb-4 pl-10 pr-4 py-2 border rounded-lg"
                            placeholder="Search ticket"/>
                        <div className="absolute inset-y-1 left-0 pl-3 -top-3 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-gray-400"/>
                        </div>
                    </div>
                    <div className=" rounded-lg my-auto hover:bg-white/10 px-1 cursor-pointer">
                        <p className="flex gap-2 header-button px-2 py-2">Filter <Filter
                            className="w-5 h-5 text-gray-400 m-auto"/></p>
                    </div>
                </div>


                <div className="overflow-x-auto rounded-lg border-t-8 border border-violet-500">
                    <table className="min-w-full ">
                        <thead className="border-b-2 border-violet-500">
                        <tr>
                            <th className="border px-4 py-2 pt-3 m-auto w-10">
                                <input
                                    type="checkbox"
                                    className='w-5 h-5 text--500 border-violet-500 rounded-lg focus:ring-2 focus:ring-violet-500'
                                    onChange={(e) => setSelectedTickets(e.target.checked ? tasks.map(task => task.id) : [])}
                                    checked={selectedTickets.length === tasks.length && tasks.length > 0}/>
                            </th>
                            <th className="border px-4 py-2 text-left">
                                <div className="flex m-auto gap-2">
                                    <Bug size={16} className='my-auto'/> Type
                                </div>
                            </th>
                            <th className="border px-4 py-2 text-left min-w-[7rem]">
                                <div className="flex m-auto gap-2">
                                    <Hash size={16} className='my-auto'/> ID
                                </div>
                            </th>
                            <th className="border px-4 py-2 text-left min-w-[15rem] max-w-[25rem]">
                                <div className="flex m-auto gap-2">
                                    <FileText size={16} className='my-auto'/> Title
                                </div>
                            </th>
                            <th className="border px-4 py-2 text-left min-w-[10rem]">
                                <div className="flex m-auto gap-2">
                                    <Megaphone size={16} className='my-auto'/> Reporter
                                </div>
                            </th>
                            <th className="border px-4 py-2 text-left min-w-[10rem]">
                                <div className="flex m-auto gap-2">
                                    <CheckCircle size={16} className='my-auto'/> Status
                                </div>
                            </th>
                            <th className="border px-4 py-2 text-left">
                                <div className="flex m-auto gap-2">
                                    <CalendarDays size={16} className='my-auto'/> Deadline
                                </div>
                            </th>
                            <th className="border px-4 py-2 text-left min-w-[10rem]">
                                <div className="flex m-auto gap-2">
                                    <Clock size={16} className='my-auto'/> Created at
                                </div>
                            </th>
                            <th className="border px-4 py-2 text-left">
                                <div className="flex m-auto gap-2">
                                    <Bell size={16} className='my-auto'/> Subscribe
                                </div>
                            </th>
                            <th className="border px-4 py-2 text-left">
                                <div className="flex m-auto gap-2">
                                    <Dock size={16} className='my-auto'/> Change
                                </div>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {tasks.map((task) => (
                            <tr key={task.id} className="hover:bg-black/20">
                                <td className="border px-4 py-2 text-center">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 text--500 border-violet-500 rounded-lg focus:ring-2 focus:ring-violet-500"
                                        checked={selectedTickets.includes(task.id)}
                                        onChange={() => handleSelect(task.id)}
                                    />
                                </td>
                                <td className="border px-4 py-2 w-10"><p
                                    className=''><span
                                    className="bg-violet-500/50 px-3 rounded-full text-black dark:text-white my-auto">{task.type_name}</span>
                                </p></td>
                                <td className="border px-4 py-2"><span
                                    className="">{task.project_task_id}</span>
                                </td>
                                <td className="border px-4 py-2">{task.title}</td>
                                <td className="border px-4 py-2">{task.reporter_name}</td>
                                <td className="border px-4 py-2"><span
                                    className="bg-black/10 dark:bg-white/10 px-3 rounded-full text-black dark:text-white my-auto">{task.status_name}</span>
                                </td>
                                <td className="border px-4 py-2 w-40 relative group">
                                    <input
                                        type="date"
                                        className='bg-white/25 p-1 rounded-md text-center border-none w-36 cursor-pointer'
                                        defaultValue={task.deadline}
                                        onChange={async (e) => {
                                            const newDate = e.target.value;
                                            try {
                                                const token = localStorage.getItem("access_token");
                                                await axios.patch(`http://127.0.0.1:8008/api/v1/tasks/${task.id}/`, {
                                                    deadline: newDate
                                                }, {
                                                    headers: {Authorization: `Bearer ${token}`}
                                                });

                                                setTasks(prevTasks =>
                                                    prevTasks.map(t => t.id === task.id ? {...t, deadline: newDate} : t)
                                                );
                                                toast.success("Deadline updated!");
                                            } catch (error) {
                                                toast.error("Failed to update deadline");
                                                console.error("Deadline update error:", error);
                                            }
                                        }}
                                    />
                                </td>

                                <td className="border px-4 py-2 w-40"><p
                                    className='bg-white/25 p-1 rounded-md text-center'>{task.created_at}</p></td>
                                <td className="border px-4 py-2 text-center">
                                    <input type="checkbox"
                                           className='w-5 h-5 text--500 border-violet-500 rounded-lg focus:ring-2 focus:ring-violet-500'/>
                                </td>
                                <td className="border px-4 py-2 w-10">
                                    <button
                                        className='p-3 text-black dark:text-white rounded-lg h-10 items-center text-center flex m-auto'
                                        onClick={() => openTicketModal(task)}>
                                        <MoreHorizontal/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div className="mt-4">
                    <button
                        onClick={openModal}
                        className="fixed bottom-6 right-6 z-50 p-4 bg-violet-500 text-white rounded-full shadow-lg hover:bg-violet-600 transition">
                        <Plus size={24} />
                    </button>
                    </div>

                </div>

                <SelectionToast selectedCount={selectedTickets.length} onDelete={handleDeleteSelected}/>

                {selectedTicket && (
                    <ChangeTicketModal
                        key={selectedTicket.id}
                        ticket={selectedTicket}
                        isOpen={Boolean(selectedTicket)}
                        onClose={() => setSelectedTicket(null)}/>
                )}
                <CreateTicketModal isOpen={isModalOpen} onClose={closeModal}>
                <div></div>
                </CreateTicketModal>

            </div>
        </>
    );
}
