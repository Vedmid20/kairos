'use client';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Camera, Building, Users, MapPin, Briefcase, AtSign } from 'lucide-react';
import { toast } from 'sonner';
import ChangeProfileInfo from "@/app/components/ChangeProfileInfo";

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editableFields, setEditableFields] = useState({ position: '', department: '', organization: '', location: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('No token found');
        setLoading(false);
        return;
      }

      try {
        const decoded: any = jwtDecode(token);
        const userId = decoded.user_id;

        const response = await axios.get(`http://127.0.0.1:8008/api/v1/users/${userId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
        setEditableFields({
          position: response.data.position || '',
          department: response.data.department || '',
          organization: response.data.organization || '',
          location: response.data.location || '',
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditableFields({ ...editableFields, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    const decoded: any = jwtDecode(token);
    const userId = decoded.user_id;

    try {
      const response = await axios.patch(
        `http://127.0.0.1:8008/api/v1/users/${userId}/`,
        editableFields,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success('Information is successfully updated!');
        setUser((prevUser: any) => ({ ...prevUser, ...editableFields }));
      }
    } catch (error) {
      console.error('Error when info is update', error);
      toast.error('Cant update information');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64Image = reader.result?.toString().split(',')[1];
        const token = localStorage.getItem('access_token');
        const decoded: any = jwtDecode(token!);
        const userId = decoded.user_id;

        const response = await axios.patch(
          `http://127.0.0.1:8008/api/v1/users/${userId}/`,
          { avatar: base64Image },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          toast.success('Аватар успішно оновлено!');
          setUser((prevUser: any) => ({ ...prevUser, avatar: response.data.avatar }));
        } else {
          toast.error('Cant upload the avatar.');
        }
      } catch (error) {
        console.error('Error when the avatar is uploaded', error);
        toast.error('Cant upload the avatar.');
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-5">
      <title>Profile</title>
      <h1 className="text-1xl mb-4">Profile</h1>
      <div className="p-4 rounded-lg flex bg-violet-500/50">
        <div className=" p-10 w-[30rem] border border-black/50 dark:border-white/50 rounded-lg">
          <div className="relative w-36 h-36 mt-4 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <img src={preview || user.avatar} alt="Avatar"
                 className="w36 h-36 object-cover rounded-full transition-all hover:opacity-80 border-violet-500 border-2"/>
            <div
                className="absolute top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center opacity-0 transition-opacity hover:opacity-100 rounded-full">
              <Camera className="text-white w-12 h-12"/>
            </div>
          </div>
          <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileChange}/>
          <h2 className="text-[2rem] mt-5 font-semibold mb-2">{user.username}</h2>
          <h5 className='border-b border-white dark:border-white/50 mb-2'>Information</h5>
          <div className="gap-10 ml-3">
            <div className="flex m-auto">
              <Briefcase className="w-6 h-6 text-black/75 dark:text-white my-1 mr-2"/>
              <input name="position" value={editableFields.position} onChange={handleInputChange} placeholder='Position'
                     className="border-transparent rounded p-1 mb-2 w-52"/>
            </div>

            <div className="flex">
              <Users className="w-6 h-6 text-black/75 dark:text-white my-1 mr-2"/>
              <input name="department" value={editableFields.department} onChange={handleInputChange} placeholder='Department'
                     className="border-transparent rounded p-1 mb-2 w-52"/>
            </div>
            <div className="flex">
              <Building className="w-6 h-6 text-black/75 dark:text-white my-1 mr-2"/>
              <input name="organization" value={editableFields.organization} onChange={handleInputChange} placeholder='Organization'
                     className="border-transparent rounded p-1 mb-2 w-52"/>
            </div>

            <div className="flex">
              <MapPin className="w-6 h-6 text-black/75 dark:text-white my-1 mr-2"/>
              <input name="location" value={editableFields.location} onChange={handleInputChange} placeholder='Location'
                     className="border-transparent rounded p-1 mb-2 w-52"/>
            </div>
          </div>

          <h5 className='border-b border-white dark:border-white/50 mb-3 mt-2'>Contacts</h5>
          <div className="flex ml-3">
            <AtSign className="w-6 h-6 text-black/75 dark:text-white my-1 mr-2" />
            <h5 className='p-1 cursor-default'>{user.email}</h5>
          </div>
        </div>
      </div>
      <ChangeProfileInfo onChange={handleSave} editableFields={editableFields} user={user}/>

    </div>
  );
};

export default ProfilePage;