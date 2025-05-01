// src/app/page.tsx
'use client';

import { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(true);
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-gray-100 to-indigo-50">
      {/* Main Card Container */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Column - Promotional Content */}
        <div className="md:w-1/2 bg-indigo-50 text-indigo-900 flex-col justify-center p-8 hidden md:flex">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl lg:text-4xl font-bold mb-3">Taxi Rental Management System</h1>
            <p className="text-lg mb-6">
              Manage your taxi rental service with ease. Book rides, manage drivers, 
              and track your fleet all in one place.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center bg-white p-4 rounded-lg shadow-sm">
                <div className="bg-indigo-500 p-2 rounded-full mr-3 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-indigo-900">Easy booking and management</p>
              </div>
              
              <div className="flex items-center bg-white p-4 rounded-lg shadow-sm">
                <div className="bg-indigo-500 p-2 rounded-full mr-3 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-indigo-900">Comprehensive driver ratings</p>
              </div>
              
              <div className="flex items-center bg-white p-4 rounded-lg shadow-sm">
                <div className="bg-indigo-500 p-2 rounded-full mr-3 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-indigo-900">Quick access to ride history</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Auth Forms */}
        <div className="w-full md:w-1/2 flex justify-center items-center p-6 sm:p-8 bg-white">
          <div className="w-full max-w-md">
            {showLogin ? (
              <>
                <LoginForm onSuccessRedirect="/dashboard" />
                <div className="mt-6 text-center">
                  <p className="text-indigo-900">
                    Don't have an account?{' '}
                    <button 
                      onClick={() => setShowLogin(false)}
                      className="text-indigo-600 font-medium hover:underline focus:outline-none"
                    >
                      Register here!
                    </button>
                  </p>
                </div>
              </>
            ) : (
              <>
                <RegisterForm onSuccessRedirect="/login" />
                <div className="mt-6 text-center">
                  <p className="text-indigo-900">
                    Already have an account?{' '}
                    <button 
                      onClick={() => setShowLogin(true)}
                      className="text-indigo-600 font-medium hover:underline focus:outline-none"
                    >
                      Login
                    </button>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}