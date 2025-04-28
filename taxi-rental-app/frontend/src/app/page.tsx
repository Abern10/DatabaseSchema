// frontend/src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Loader, AlertCircle, CheckCircle, TrendingUp, Calendar, Users, User, Car } from 'lucide-react';
import Link from 'next/link';

interface User {
  role: string;
  name?: string;
  email?: string;
  ssn?: string;
}

interface Stats {
  totalRents: number;
  totalClients: number;
  totalDrivers: number;
  totalCars: number;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<Stats>({
    totalRents: 0,
    totalClients: 0,
    totalDrivers: 0,
    totalCars: 0,
  });

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Simulate fetching stats
    setTimeout(() => {
      setStats({
        totalRents: 123,
        totalClients: 45,
        totalDrivers: 12,
        totalCars: 30,
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">Welcome to Taxi Rental</h1>
          <p className="text-gray-600 mb-6 text-center">Please login or register to continue.</p>
          <div className="flex flex-col space-y-4">
            <Link 
              href="/login" 
              className="py-2 px-4 bg-blue-600 text-white rounded-md text-center hover:bg-blue-700"
            >
              Login
            </Link>
            <Link 
              href="/register" 
              className="py-2 px-4 border border-gray-300 text-gray-700 rounded-md text-center hover:bg-gray-50"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Rents</p>
              <p className="text-2xl font-semibold">{stats.totalRents}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Calendar className="h-6 w-6" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Clients</p>
              <p className="text-2xl font-semibold">{stats.totalClients}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Drivers</p>
              <p className="text-2xl font-semibold">{stats.totalDrivers}</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <User className="h-6 w-6" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Cars</p>
              <p className="text-2xl font-semibold">{stats.totalCars}</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <Car className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
      
      {user.role === 'manager' && (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              href="/drivers/new" 
              className="py-2 px-4 bg-purple-600 text-white rounded-md text-center hover:bg-purple-700"
            >
              Add Driver
            </Link>
            <Link 
              href="/cars/new" 
              className="py-2 px-4 bg-yellow-600 text-white rounded-md text-center hover:bg-yellow-700"
            >
              Add Car
            </Link>
            <Link 
              href="/rents" 
              className="py-2 px-4 bg-blue-600 text-white rounded-md text-center hover:bg-blue-700"
            >
              View Rents
            </Link>
          </div>
        </div>
      )}

      {user.role === 'client' && (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              href="/rents/new" 
              className="py-2 px-4 bg-blue-600 text-white rounded-md text-center hover:bg-blue-700"
            >
              Book a Rent
            </Link>
            <Link 
              href="/rents" 
              className="py-2 px-4 bg-gray-600 text-white rounded-md text-center hover:bg-gray-700"
            >
              View My Rents
            </Link>
          </div>
        </div>
      )}

      {user.role === 'driver' && (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              href="/profile" 
              className="py-2 px-4 bg-green-600 text-white rounded-md text-center hover:bg-green-700"
            >
              Update Profile
            </Link>
            <Link 
              href="/cars" 
              className="py-2 px-4 bg-yellow-600 text-white rounded-md text-center hover:bg-yellow-700"
            >
              View Car Models
            </Link>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
            <div>
              <p className="font-medium">New rent booked</p>
              <p className="text-sm text-gray-500">A client booked a new rent for tomorrow</p>
            </div>
          </div>
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
            <div>
              <p className="font-medium">New driver added</p>
              <p className="text-sm text-gray-500">Administrator added a new driver to the system</p>
            </div>
          </div>
          <div className="flex items-start">
            <TrendingUp className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
            <div>
              <p className="font-medium">Monthly report ready</p>
              <p className="text-sm text-gray-500">The monthly report for April is ready to view</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}