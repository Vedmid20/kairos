'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        const isDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
        setTheme(isDark ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', isDark);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    return (
        <div className="flex justify-center items-center">
            <button
                onClick={toggleTheme}
                className="p-2 rounded-full transition-colors duration-300 hover:bg-gray-400 dark:hover:bg-yellow-100/30">
                {theme === 'light' ? <Moon className="w-6 h-6 text-gray-300" /> : <Sun className="w-6 h-6 text-yellow-200" />}
            </button>
        </div>
    );
}
