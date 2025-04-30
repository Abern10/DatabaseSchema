// src/app/page.tsx
'use client';

import { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(true);
  
  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Left Column - Promotional Content */}
      <div className="hidden md:flex md:w-1/2 bg-blue-600 text-white flex-col justify-center items-center p-8 overflow-hidden">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl lg:text-4xl font-bold mb-3">Taxi Rental Management System</h1>
          <p className="text-lg mb-6">
            Manage your taxi rental service with ease. Book rides, manage drivers, 
            and track your fleet all in one place.
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="bg-blue-500 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p>Easy booking and management</p>
            </div>
            
            <div className="flex items-center">
              <div className="bg-blue-500 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p>Comprehensive driver ratings</p>
            </div>
            
            <div className="flex items-center">
              <div className="bg-blue-500 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p>Quick access to ride history</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Column - Auth Forms */}
      <div className="w-full md:w-1/2 flex justify-center items-center bg-gray-50 overflow-auto">
        <div className="w-full max-w-md p-4">
          {showLogin ? (
            <>
              <LoginForm onSuccessRedirect="/dashboard" />
              <div className="mt-4 text-center">
                <p>
                  Don't have an account?{' '}
                  <button 
                    onClick={() => setShowLogin(false)}
                    className="text-blue-600 hover:underline"
                  >
                    Register
                  </button>
                </p>
              </div>
            </>
          ) : (
            <>
              <RegisterForm onSuccessRedirect="/login" />
              <div className="mt-4 text-center">
                <p>
                  Already have an account?{' '}
                  <button 
                    onClick={() => setShowLogin(true)}
                    className="text-blue-600 hover:underline"
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
  );
}