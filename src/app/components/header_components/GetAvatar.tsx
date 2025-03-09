'use client';

import { useEffect, useState } from "react";
import { Combobox } from '@headlessui/react';
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import ComboBoxAnimation from '@/app/components/animations/ComboBoxAnimation'
import '@/app/styles/globals.scss';
import '@/app/styles/mixins.scss';

export default function GetAvatar() {
    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [avatar, setAvatar] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

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

    const menuItems = [
        { label: "Profile", action: () => console.log("Profile clicked") },
        { label: "Activity", action: () => console.log("Activity clicked") },
        { label: "Settings", action: () => console.log("Settings clicked") },
        { label: "Log Out", action: () => console.log("Log Out clicked") },
    ];

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
                    <div className="absolute top-7 right-0 bg-white/50 backdrop-blur-md rounded-b-lg shadow-md w-52 z-10 dark:bg-grey/50 py-2">
                        {menuItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => {
                                    item.action();
                                    setIsOpen(false);
                                }}
                                className="block w-full text-left p-2 hover:bg-black/20 cursor-pointer transition-all">
                                {item.label}
                            </button>
                        ))}
                    </div>
                </ComboBoxAnimation>

            )}
        </div>
    );
}