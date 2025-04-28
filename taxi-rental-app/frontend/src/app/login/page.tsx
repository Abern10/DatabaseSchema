// frontend/src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader } from 'lucide-react';

type UserRole = 'client' | 'driver' | 'manager';

export default function Login() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>('client');
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // In a real app, you would make an API call to your backend
      let endpoint = '';
      let payload = {};

      switch (role) {
        case 'client':
          endpoint = '/api/clients/login';
          payload = { email: identifier };
          break;
        case 'driver':
          endpoint = '/api/drivers/login';
          payload = { name: identifier };
          break;
        case 'manager':
          endpoint = '/api/managers/login';
          payload = { ssn: identifier };
          break;
      }

      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulating successful login
      const userData = {
        role,
        ...(role === 'client' && { email: identifier, name: 'John Doe' }),
        ...(role === 'driver' && { name: identifier }),
        ...(role === 'manager' && { ssn: identifier, name: 'Admin User', email: 'admin@example.com' }),
      };

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', 'fake-jwt-token');

      // Redirect to dashboard
      router.push('/');
    } catch (error) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Login As
              </label>
              <div className="flex space-x-2">
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 rounded-md ${
                    role === 'client'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  onClick={() => setRole('client')}
                >
                  Client
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 rounded-md ${
                    role === 'driver'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  onClick={() => setRole('driver')}
                >
                  Driver
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 rounded-md ${
                    role === 'manager'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  onClick={() => setRole('manager')}
                >
                  Manager
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="identifier">
                {role === 'client' ? 'Email Address' : role === 'driver' ? 'Name' : 'SSN'}
              </label>
              <input
                id="identifier"
                type={role === 'client' ? 'email' : 'text'}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={role === 'client' ? 'example@email.com' : role === 'driver' ? 'Driver Name' : 'SSN'}
                required
              />
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader className="animate-spin h-5 w-5 mr-2" />
                    <span>Logging in...</span>
                  </div>
                ) : (
                  'Login'
                )}
              </button>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/register" className="text-blue-600 hover:text-blue-800">
                  Register
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}