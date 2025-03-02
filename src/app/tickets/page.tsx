'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookie from 'js-cookie';
import Loading from "@/app/loading";
import {LoginRequired} from "@/app/lib/auth";

interface Task {
    id: number;
    type: string;
    title: string;
    description: string;
    deadline: string;
    reporter: string;
    created_at: string;
}

export default function TicketsPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const projectId = Cookie.get('selectedProject');

    useEffect(() => {
        if (!projectId) console.log("Project ID is undefined:", projectId);

        const fetchTasks = async () => {
            console.log('Fetching tasks...');
            try {
                const token = localStorage.getItem("access_token");
                const response = await axios.get(`http://127.0.0.1:8008/api/v1/tasks?projectId=${projectId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTasks(response.data);
                console.log("Tasks:", response.data);
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

    return (
        <div className="p-5">
          <LoginRequired />
            <h1 className="text-1xl mb-4">Tickets List</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full  border border-gray-900">
                    <thead className="">
                        <tr>
                            <th className="border px-4 py-2 text-left">Type</th>
                            <th className="border px-4 py-2 text-left">Title</th>
                            <th className="border px-4 py-2 text-left">Description</th>
                            <th className="border px-4 py-2 text-left">Reporter</th>
                            <th className="border px-4 py-2 text-left">Deadline</th>
                            <th className="border px-4 py-2 text-left">Created at</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task) => (
                            <tr key={task.id} className="hover:bg-black/20">
                                <td className="border px-4 py-2">{task.type}</td>
                                <td className="border px-4 py-2">{task.title}</td>
                                <td className="border px-4 py-2">{task.description}</td>
                                <td className="border px-4 py-2">{task.reporter}</td>
                                <td className="border px-4 py-2">{task.deadline}</td>
                                <td className="border px-4 py-2">{task.created_at}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
