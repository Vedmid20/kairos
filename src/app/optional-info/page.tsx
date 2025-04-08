'use client';

import axios from 'axios';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import './optional-info.scss';
import '../styles/globals.scss';

const OptionalInfoPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();

  const onSubmit = async (data : { position: string; department: string; organization: string, location: string }) => {
    try {
      const response = await axios.get('/api/tempUser');
      const userData = response.data;
      const user = { ...userData, ...data }
      console.log(user, userData)
      await axios.post('http://127.0.0.1:8008/api/v1/users/', user);
      console.log('asd')
      const tokens = await axios.post('http://127.0.0.1:8008/api/token/', {
        email: userData.email,
        password: userData.password,
      }, {
        withCredentials: true,
      });

      localStorage.setItem('access_token', tokens.data.access);
      localStorage.setItem('refresh_token', tokens.data.refresh);

      router.push('/create-project');
    } catch (error) {
      console.log(error)
      alert('Something went wrong')
    }
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="form">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h1>Optional Info</h1>

            <div className="form-group">
              <label htmlFor="position">Position</label>
              <br/>
              <input id="position" type="text" {...register('position')} placeholder='Enter your position'/>
            </div>

            <div className="form-group">
              <label htmlFor="department">Department</label>
              <br/>
              <input id="department" type="text" {...register('department')} placeholder='Enter your department'/>
            </div>

            <div className="form-group">
              <label htmlFor="organization">Organization</label>
              <br/>
              <input id="organization" type="text" {...register('organization')} placeholder='Enter your organization'/>
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <br/>
              <input id="location" type="text" {...register('location')} placeholder='Enter your location'/>
            </div>

            <button type="submit">Continue</button>
            <h5>You may not enter this data.</h5>

          </form>
        </div>
      </div>
    </>
  );
};

export default OptionalInfoPage;
