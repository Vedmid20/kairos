'use client';

import { useEffect, useState } from "react";
import axios from "axios";

interface Task {
    id: number;
    title: string;
    description: string;
    deadline: string;
}

export default function TicketsPage({ projectId }: { projectId: string }) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!projectId) return;

        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const response = await axios.get(`http://127.0.0.1:8008/api/v1/tasks?projectId=${projectId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTasks(response.data);
                console.log(response.data)
            } catch (error) {
                console.error("Помилка при отриманні завдань:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [projectId]);

    if (loading) return <p>Завантаження...</p>;
    if (!tasks.length) return <p>Немає завдань</p>;

    return (
        <div>
            <h1>Завдання проекту</h1>
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        <h2>{task.title}</h2>
                        <p>{task.description}</p>
                        <p>Дедлайн: {task.deadline}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
