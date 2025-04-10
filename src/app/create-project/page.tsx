'use client';

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { jwtDecode } from 'jwt-decode';
import { LoginRequired } from '@/app/lib/auth';
import '../styles/globals.scss'
import './create-project.scss'
import {router} from "next/client";

const schema = yup.object({
  name: yup
    .string()
    .matches(/^[a-zA-Z0-9 _]+$/, 'Project name can only contain letters, numbers')
    .min(5, 'Project name must be at least 5 characters long')
    .max(25, 'Project name cant be longer then 25 characters')
    .required('Project name is required'),
  project_prefix: yup
    .string()
    .matches(/^[a-zA-Z0-9]+$/, 'Project prefix can only letters or numbers')
    .min(2, 'Prefix must be at least 2 characters long')
    .max(5, 'Prefix cant be longer than 5 charcters')
    .required('Prefix is required'),
  project_desc: yup
    .string()
    .matches(/^[a-zA-Z0-9 !?,._-]+$/, 'Project description can only letters or numbers')
    .min(10, 'Description must be at least 10 characters long')
    .max(200, 'Description cant be longer than 200 charcters')
    .required('Description is required'),
});

const CreateProjectPage = () => {
  const { register, handleSubmit, setError, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [createProjectError, setCreateProjectError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) {
      setToken(storedToken);
      try {
        const decoded: any = jwtDecode(storedToken);
        setUserId(decoded.user_id);
      } catch (error) {
        console.error("Error decoding token:", error);
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

  const checkUserProjectAvailability = async (name: string, lead: string) => {
    try {
      const response = await axios.get('http://127.0.0.1:8008/api/v1/projects/', {
        params: { name, lead }
      });
      if (response.data.name) {
        setError('name', { type: 'manual', message: response.data.name });
      }
    } catch (error) {
      console.error('Error checking availability:', error);
    }
  };

  const onSubmit = async (data: { name: string, project_prefix: string, project_desc: string }) => {
    if (!userId) {
      setCreateProjectError("User ID is missing.");
      return;
    }

    await checkUserProjectAvailability(data.name, userId);
    if (Object.keys(errors).length > 0) {
      return;
    }

    let base64Image = "";
    if (selectedFile) {
      const reader = new FileReader();
      base64Image = await new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result?.toString().split(",")[1] || "");
        reader.readAsDataURL(selectedFile);
      });
    }
    try {
      await axios.post(
        'http://127.0.0.1:8008/api/v1/projects/',
        {
          name: data.name,
          lead: userId,
          icon: base64Image,
          project_prefix: data.project_prefix,
          project_desc: data.project_desc,
        },
          {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-type": "application/json"
            }
          }
      );
      
      router.push('/')
    } catch (error) {
      setCreateProjectError('Something went wrong during project creation.');
      console.error('Error during project creation@@@:', error);
    }
  };

  return (
    <>
      <LoginRequired />
      <div className="container mx-auto p-4">
        <div className="form">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h1>Create Project</h1>
            <div className="form-group">
              <label htmlFor="icon" className='flex'>Upload Project Icon<p className='text-red-400'>*</p></label>
              <div className="flex gap-5">
                <input id="icon" type="file" accept="image/*" onChange={handleFileChange} className='hidden'/>
                <label htmlFor="icon" className='file-button rounded-lg w-10 h-10'>Upload icon</label>
                {preview && <img src={preview} alt="Preview" className="w-10 h-10 rounded-full m-auto" />}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="name" className='flex'>Project Name<p className='text-red-400'>*</p></label>
              <input
                  id="name"
                  type="text"
                {...register('name', { required: 'Project name is required' })}
                placeholder='Enter project name'
              />
              {errors.name && <p className="error">{errors.name.message}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="project_desc" className='flex'>Project Description<p className='text-red-400'>*</p></label>
              <textarea
                  className='max-h-32 min-h-10 p-2 text-sm'
                  id="project_desc"
                {...register('project_desc', { required: 'Project description is required' })}
                placeholder='Enter description'
              />
              {errors.project_desc && <p className="error">{errors.project_desc.message}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="prefix" className='flex'>Project Prefix<p className='text-red-400'>*</p></label>
              <input
                  id="prefix"
                  type="text"
                {...register('project_prefix', { required: 'Project prefix is required' })}
                placeholder='Enter project prefix'
              />
              {errors.project_prefix && <p className="error">{errors.project_prefix.message}</p>}
            </div>

            <button type="submit">Start</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateProjectPage;