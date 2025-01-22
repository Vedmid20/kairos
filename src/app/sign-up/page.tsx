'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import zxcvbn from 'zxcvbn';
import './sign-up.scss';
import '../styles/globals.scss';

const SignUpPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [password, setPassword] = useState('');

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const result = zxcvbn(newPassword);
    setPasswordStrength(result.score)
  };

  const onSubmit = (data: { email: string; password: string; username: string }) => {
    if (data.password) {
      alert('Sign Up successful!');
    } else {
      setSignUpError('Passwords do not match');
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <h1>Sign Up</h1>
            
            <div className="form-group">
              <label htmlFor="username">Username*</label>
              <br />
              <input
                id="username"
                type="username"
                {...register('username', { required: 'Required' })}
                placeholder='Enter your username'
              />
              {errors.username && <p className="error">{errors.username.message}</p>}
            </div>

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
