'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

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

const arrayBufferToBase64 = ({arrayBuffer}: { arrayBuffer: any }) => {
  // Створюємо новий Uint8Array з ArrayBuffer
  const byteArray = new Uint8Array(arrayBuffer);

  // Перетворюємо масив байтів в строку Base64
  let binary = '';
  for (let i = 0; i < byteArray.length; i++) {
    binary += String.fromCharCode(byteArray[i]);
  }

  // Перетворюємо в base64
  const base64String = window.btoa(binary);

  return `data:image/jpeg;base64,${base64String}`;
};

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
                        responseType: "arraybuffer", // Отримуємо байти
                    }
                );

                let avatarArrayBuffer = response.data; // Масив байтів

                if (avatarArrayBuffer) {
                    // Перетворюємо ArrayBuffer в Base64
                    const avatarBase64 = arrayBufferToBase64({arrayBuffer: avatarArrayBuffer});
                    setAvatar(avatarBase64);
                    console.log(avatarBase64)
                } else {
                    console.warn("Аватар не знайдено у відповіді сервера");
                }
            } catch (error) {
                console.error("Помилка отримання аватара:", error);
            }
        };

        fetchAvatar();
    }
}, [token, userId, avatar]);


 // Видаляємо avatar із залежностей, щоб уникнути циклічного оновлення



    return (
        <div>
            {avatar ? <img src={avatar} alt="Avatar" /> : <p>Завантаження аватара...</p>}
        </div>
    );

}
