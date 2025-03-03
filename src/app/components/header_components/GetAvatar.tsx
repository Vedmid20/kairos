'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import '@/app/styles/globals.scss';
import '@/app/styles/mixins.scss';


export default function GetAvatar() {
    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [avatar, setAvatar] = useState<string | null>(null);

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

                let userAvatar = response.data['avatar']
                setAvatar(userAvatar)
                

            } catch (error) {
                console.error("Помилка отримання аватара:", error);
            }
        };

        fetchAvatar();
    }
}, [token, userId]);

    return (
        <div className="flex justify-center items-center">
            <div className="w-10 h-10 rounded-full bg-transparent overflow-hidden">
                {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                    <p className="text-xs text-center">Load...</p>
                )}
            </div>
        </div>
    );

}
