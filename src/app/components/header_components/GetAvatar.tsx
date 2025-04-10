'use client';

import { useEffect, useState, useRef } from "react";
import { Combobox } from '@headlessui/react';
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import ComboBoxAnimation from '@/app/components/animations/ComboBoxAnimation'
import '@/app/styles/globals.scss';
import '@/app/styles/mixins.scss';
import { useRouter } from "next/navigation";
import { Activity, User, UserCogIcon, LogOut } from 'lucide-react';

export default function GetAvatar() {
    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [avatar, setAvatar] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("access_token");
        if (storedToken) {
            setToken(storedToken);
            try {
                const decoded: any = jwtDecode(storedToken);
                setUserId(decoded.user_id);
            } catch (error) {
                console.error("Помилка декодування токена:", error);
            }
        }
    }, []);

    useEffect(() => {
        if (token && userId && !avatar) {
            const fetchAvatar = async () => {
                try {
                    const response = await axios.get(
                        `http://127.0.0.1:8008/api/v1/users/${userId}/`,
                        {
                            headers: {
                                "Authorization": `Bearer ${token}`,
                            },
                        }
                    );

                    setAvatar(response.data['avatar']);
                } catch (error) {
                    console.error("Помилка отримання аватара:", error);
                }
            };

            fetchAvatar();
        }
    }, [token, userId]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const menuItems = [
        { label: "Profile", action: () => router.push('/profile'), icon: <User /> },
        { label: "Activity", action: () => router.push('/activity'), icon: <Activity /> },
        { label: "Settings", action: () => router.push('/settings'), icon: <UserCogIcon /> },
        { label: "Log Out", action: () => handleLogOut(), icon: <LogOut /> },
    ];

    const handleLogOut = () => {
        localStorage.removeItem("access_token");
        router.push('/log-in')
    }

    return (
        <div className="relative flex justify-center items-center">
            <div
                className="w-10 h-10 rounded-full bg-transparent overflow-hidden cursor-pointer hover:shadow-2xl"
                onClick={() => setIsOpen(!isOpen)}>
                {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                    <p className="text-xs text-center">Load...</p>
                )}
            </div>

            {isOpen && (
                <ComboBoxAnimation>
                    <div ref={menuRef} className="absolute top-7 right-0 bg-white/50 backdrop-blur-md rounded-b-lg shadow-md w-52 z-10 dark:bg-grey/50 py-2">
                        {menuItems.map((item) => ( item.label === "Log Out" ? 
                        (<button
                            key={item.label}
                            onClick={() => {
                                item.action();
                                setIsOpen(false);
                            }}
                            className="flex gap-3 w-full text-red-500 text-left p-3 hover:bg-red-500/10 cursor-pointer transition-all">
                                {item.icon}
                            {item.label}
                        </button>) : 
                        (<button
                            key={item.label}
                            onClick={() => {
                                item.action();
                                setIsOpen(false);
                            }}
                            className="flex gap-3 w-full text-left p-3 hover:bg-black/20 cursor-pointer transition-all">
                                {item.icon}
                            {item.label}
                        </button>)
                        ))}
                    </div>
                </ComboBoxAnimation>
            )}
        </div>
    );
}
