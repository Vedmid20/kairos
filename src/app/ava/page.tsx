"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function AvatarUpload() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedToken = localStorage.getItem("access_token");
            if (storedToken) {
                setToken(storedToken);
                try {
                    const decoded: any = jwtDecode(storedToken);
                    setUserId(decoded.user_id);
                    console.log(decoded.user_id)
                } catch (error) {
                    console.error("Помилка декодування токена:", error);
                }
            }
        }
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Файл не вибрано.");
            return;
        }

        if (!token || !userId) {
            alert("Помилка автентифікації.");
            return;
        }

        setLoading(true);
        const reader = new FileReader();

        reader.onloadend = async () => {
            try {
                const base64Image = reader.result?.toString().split(",")[1];
                console.log(base64Image)
                const response = await axios.patch(
                    `http://localhost:8008/api/v1/users/${userId}/`,
                    { avatar: base64Image },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                    }
                );

                if (response.status === 200) {

                    alert("Аватар успішно оновлено!");
                } else {
                    alert("Не вдалося завантажити аватар.");
                }
            } catch (error) {
                console.error("Помилка при завантаженні аватарки:", error);
                alert("Не вдалося завантажити аватар.");
            } finally {
                setLoading(false);
            }
        };

        reader.readAsDataURL(selectedFile);
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            {preview && <img src={preview} alt="Preview" className="w-24 h-24 rounded-full" />}
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button
                onClick={handleUpload}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400">
                {loading ? "Завантаження..." : "Завантажити аватар"}
            </button>
        </div>
    );
}
