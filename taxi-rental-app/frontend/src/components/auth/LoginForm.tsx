// src/components/auth/LoginForm.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { login, LoginCredentials } from '@/lib/api';

type UserType = 'client' | 'manager' | 'driver';

interface LoginFormProps {
  onSuccessRedirect?: string;
}

export default function LoginForm({ onSuccessRedirect }: LoginFormProps) {
  const router = useRouter();
  const [userType, setUserType] = useState<UserType>('client');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [ssn, setSsn] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    let credentials: LoginCredentials = {};
    
    switch (userType) {
      case 'client':
        if (!email) {
          setError('Email is required');
          setLoading(false);
          return;
        }
        credentials = { email };
        break;
      case 'manager':
        if (!ssn) {
          setError('SSN is required');
          setLoading(false);
          return;
        }
        credentials = { ssn };
        break;
      case 'driver':
        if (!name) {
          setError('Name is required');
          setLoading(false);
          return;
        }
        credentials = { name };
        break;
    }
    
    try {
      const response = await login(credentials);
      
      if (response.success && response.data) {
        localStorage.setItem('user', JSON.stringify({
          ...response.data,
          userType
        }));
        
        if (onSuccessRedirect) {
          router.push(onSuccessRedirect);
        } else {
          switch (userType) {
            case 'client':
              router.push('/client/dashboard');
              break;
            case 'manager':
              router.push('/manager/dashboard');
              break;
            case 'driver':
              router.push('/driver/dashboard');
              break;
          }
        }
      } else {
        setError(response.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex gap-2 justify-center p-1 bg-gray-100 rounded-lg">
          <button
            type="button"
            className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${userType === 'client' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setUserType('client')}
          >
            Client
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${userType === 'driver' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setUserType('driver')}
          >
            Driver
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${userType === 'manager' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setUserType('manager')}
          >
            Manager
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {userType === 'client' && (
          <div className="space-y-2">
            <label className="block text-gray-700 text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="your.email@example.com"
              required
            />
          </div>
        )}
        
        {userType === 'driver' && (
          <div className="space-y-2">
            <label className="block text-gray-700 text-sm font-medium" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="John Smith"
              required
            />
          </div>
        )}
        
        {userType === 'manager' && (
          <div className="space-y-2">
            <label className="block text-gray-700 text-sm font-medium" htmlFor="ssn">
              SSN
            </label>
            <input
              id="ssn"
              type="text"
              value={ssn}
              onChange={(e) => setSsn(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="XXX-XX-XXXX"
              required
            />
          </div>
        )}
        
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300 transition-colors duration-200 shadow-md"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}