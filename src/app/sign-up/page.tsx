'use client';

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import zxcvbn from 'zxcvbn';
import './sign-up.scss';
import '../styles/globals.scss';
import Loading from '../loading';

const schema = yup.object({
  username: yup
    .string()
    .matches(/^[a-zA-Z0-9 _]+$/, 'Username can only contain letters, numbers')
    .min(3, 'Username must be at least 3 characters long')
    .required('Username is required'),
  email: yup
    .string()
    .email('Enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .required('Password is required'),
});

const SignUpPage = () => {
  const { register, handleSubmit, formState: { errors }, setError } = useForm({
    resolver: yupResolver(schema)
  });

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [password, setPassword] = useState('');
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const router = useRouter()

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const result = zxcvbn(newPassword);
    setPasswordStrength(result.score);
  };

  const checkUserAvailability = async (email: string, username: string) => {
    try {
      const response = await axios.get('http://127.0.0.1:8008/api/v1/users/', {
        params: { email, username }
      });

      if (response.data.email) {
        setError('email', { type: 'manual', message: response.data.email });
      }
      if (response.data.username) {
        setError('username', { type: 'manual', message: response.data.username });
      }
    } catch (error) {
      console.error('Error checking availability:', error);
    }
  };

  const onSubmit = async (data: { email: string; password: string; username: string }) => {
    await checkUserAvailability(data.email, data.username);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      await axios.post('http://127.0.0.1:8008/api/v1/users/', data);
      router.push('/log-in');
    } catch (error) {
      setSignUpError('Something went wrong during signup.');
      console.error('Error during signup:', error);
    }
  };

  const strengthLevels = [
    'Very Weak',
    'Weak',
    'Normal',
    'Good',
    'Strong'
  ];

  const getStrengthColor = (strength: number) => {
    switch (strength) {
      case 1:
        return '#9f88cb';
      case 2:
        return '#9275c8';
      case 3:
        return '#8b68cd';
      case 4:
        return '#7b4fcd';
      default:
        return 'grey';
    }
  };

  return (
    <main>
      <div className="container mx-auto p-4">
        <div className="form">
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit)();
          }}>
            <h1>Sign Up</h1>

            <div className="form-group">
              <label htmlFor="username">Username*</label>
              <br/>
              <input
                  id="username"
                  type="text"
                  {...register('username', {required: 'Required'})}
                  placeholder='Enter your username'
              />
              {errors.username && <p className="error">{errors.username.message}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email*</label>
              <br/>
              <input
                  id="email"
                  type="text"
                  {...register('email', {required: 'Required'})}
                  placeholder='Enter your email'
              />
              {errors.email && <p className="error">{errors.email.message}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password*</label>
              <br/>
              <input
                  id="password"
                  type="password"
                  {...register('password', {required: 'Required'})}
                  placeholder='Enter your password'
                  value={password}
                  onChange={handlePasswordChange}
              />
              {errors.password && <p className="error">{errors.password.message}</p>}

              <div className="password-strength">
                <div
                    className="strength-bar"
                    style={{
                      width: `${(passwordStrength / 4) * 100}%`,
                      backgroundColor: getStrengthColor(passwordStrength),
                    }}
                ></div>
              </div>
              <div className="strength-text">
                {strengthLevels[passwordStrength]}
              </div>
            </div>

            <button type="submit">Continue</button>
            <h5>Already have an account? <Link href="/log-in" className='link'>Log In</Link></h5>

            <div className="oauth">
              <div></div>
              <p>or</p>
              <div></div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default SignUpPage;
