'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import './log-in.scss';
import '../styles/globals.scss';

const LogInPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [logInError, setLoginError] = useState<string | null>(null);

  const onSubmit = (data: { email: string; password: string }) => {
    if (data.email === 'admin@gmail.com' && data.password === '1111') {
      alert('Login successful!');
    } else {
      setLoginError('Invalid username or password');
    }
  };

  return (
    <>
    <main>
        <div className="container mx-auto p-4">
            <div className="form grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
            {logInError && <p className="error">{logInError}</p>}
            <form onSubmit={handleSubmit(onSubmit)}>
            <h1>Log In</h1>
                <div className="form-group">
                <label htmlFor="email">Email*</label>
                <br />
                <input
                    id="email"
                    type="email"
                    {...register('email', { required: 'Required' })}
                    placeholder='Enter your email'
                />
                {errors.email && <p className="error">{errors.email.message}</p>}
                </div>

                <div className="form-group">
                <label htmlFor="password">Password*</label>
                <br />
                <input
                    id="password"
                    type="password"
                    {...register('password', { required: 'Required' })}
                    placeholder='Enter your password'
                />
                {errors.password && <p className="error">{errors.password.message}</p>}
                </div>

                <button type="submit">Continue</button>
            </form>
            </div>
        </div>
    </main>
    </>
  );
};

export default LogInPage;
