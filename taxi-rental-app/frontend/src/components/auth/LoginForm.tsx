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
        credentials = { email };
        break;
      case 'manager':
        credentials = { ssn };
        break;
      case 'driver':
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
    <div className="bg-white rounded-lg shadow-md p-5">
      <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
      
      {error && (
        <div className="mb-3 p-2 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <div className="flex gap-2 justify-center">
          <button
            type="button"
            className={`px-3 py-1 text-sm rounded ${userType === 'client' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setUserType('client')}
          >
            Client
          </button>
          <button
            type="button"
            className={`px-3 py-1 text-sm rounded ${userType === 'driver' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setUserType('driver')}
          >
            Driver
          </button>
          <button
            type="button"
            className={`px-3 py-1 text-sm rounded ${userType === 'manager' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setUserType('manager')}
          >
            Manager
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {userType === 'client' && (
          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-semibold mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
        )}
        
        {userType === 'driver' && (
          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-semibold mb-1" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
        )}
        
        {userType === 'manager' && (
          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-semibold mb-1" htmlFor="ssn">
              SSN
            </label>
            <input
              id="ssn"
              type="text"
              value={ssn}
              onChange={(e) => setSsn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
        )}
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded text-sm hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}