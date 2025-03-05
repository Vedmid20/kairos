'use client';

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Cookie from 'js-cookie';
import Loading from "@/app/loading";
import { LoginRequired } from "@/app/lib/auth";
import { Bug, FileText, User, CalendarDays, Clock, Bell, Info } from "lucide-react";
import { toast } from "sonner";
import SelectionToast from "@/app/components/SelectionToast";
import ChangeTicketModal from "@/app/components/ChangeTicket";
import '@/app/styles/globals.scss'
import '@/app/styles/mixins.scss'

interface Task {
    id: number;
    type_name: string;
    title: string;
    description: string;
    deadline: string;
    reporter_name: string;
    created_at: string;
}

export default function TicketsPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTickets, setSelectedTickets] = useState<number[]>([]);
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

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedTickets(tasks.map(task => task.id));
        } else {
            setSelectedTickets([]);
        }
    };

    const handleSelect = (taskId: number) => {
        setSelectedTickets(prev =>
            prev.includes(taskId)
                ? prev.filter(id => id !== taskId)
                : [...prev, taskId]
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

    toast.success("Selected tickets deleted successfully!");
    setSelectedTickets([]);
};

    return (
        <div className="p-5">
            <LoginRequired />
            <h1 className="text-1xl mb-4">Tickets List</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-900">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2 w-10">
                                <input
                                    type="checkbox"
                                    className='w-5 h-5'
                                    onChange={handleSelectAll}
                                    checked={selectedTickets.length === tasks.length && tasks.length > 0}
                                />
                            </th>
                            <th className="border px-4 py-2 text-left">
                                <div className="flex m-auto gap-2">
                                    <Bug size={16} className='my-auto'/> Type
                                </div></th>
                            <th className="border px-4 py-2 text-left">
                                <div className="flex m-auto gap-2">
                                    <FileText size={16} className='my-auto'/> Title
                                </div></th>
                            <th className="border px-4 py-2 text-left">
                                <div className="flex m-auto gap-2">
                                    <User size={16} className='my-auto'/> Reporter
                                </div>
                            </th>
                            <th className="border px-4 py-2 text-left">
                                <div className="flex m-auto gap-2">
                                    <CalendarDays size={16} className='my-auto'/> Deadline
                                </div></th>
                            <th className="border px-4 py-2 text-left">
                                <div className="flex m-auto gap-2">
                                    <Clock size={16} className='my-auto'/> Created at
                                </div></th>
                            <th className="border px-4 py-2 text-left">
                                <div className="flex m-auto gap-2">
                                    <Bell size={16} className='my-auto'/> Subscribe
                                </div></th>
                            <th className="border px-4 py-2 text-left">
                                <div className="flex m-auto gap-2">
                                    <Info size={16} className='my-auto'/> Details
                                </div></th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task) => (
                            <tr key={task.id} className="hover:bg-black/20">
                                <td className="border px-4 py-2 text-center">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5"
                                        checked={selectedTickets.includes(task.id)}
                                        onChange={() => handleSelect(task.id)}
                                    />
                                </td>
                                <td className="border px-4 py-2">{task.type_name}</td>
                                <td className="border px-4 py-2">{task.title}</td>
                                <td className="border px-4 py-2">{task.reporter_name}</td>
                                <td className="border px-4 py-2">{task.deadline}</td>
                                <td className="border px-4 py-2">{task.created_at}</td>
                                <td className="border px-4 py-2 w-10 text-center">
                                    <input type="checkbox" className='w-5 h-5' />
                                </td>
                                <td className="border px-4 py-2">
                                    <ChangeTicketModal isOpen={isModalOpen} onClose={closeModal}><div className=""></div></ChangeTicketModal>
                                    <button className='header-button p-3' onClick={openModal}>
                                        Show
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <SelectionToast selectedCount={selectedTickets.length} onDelete={handleDeleteSelected} />
        </div>
    );
}
