// src/app/(dashboard)/client/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getClientRents, getAvailableModels } from '@/lib/api';

export default function ClientDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  type Rent = {
    rentid: number;
    date: string;
    driver_name: string;
    brand: string;
    carid: number;
    modelid: number;
    color: string;
    status: string;
  };
  
  type CarModel = {
    brand: string;
    carid: number;
    modelid: number;
    color: string;
    construction_year: number;
    transmission_type: string;
  };
  
  const [recentRents, setRecentRents] = useState<Rent[]>([]);
  const [availableCars, setAvailableCars] = useState<CarModel[]>([]);
  const [stats, setStats] = useState({
    totalRents: 0,
    activeRents: 0,
    reviewsGiven: 0
  });

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Load user data
      loadUserData(parsedUser.email);
    } else {
      setLoading(false);
      setError("User not found. Please log in again.");
    }
  }, []);

  const loadUserData = async (email: string) => {
    try {
      // Get today's date for available models
      const today = new Date().toISOString().split('T')[0];
      
      // Get client's rents
      const rentsResponse = await getClientRents(email);
      
      if (rentsResponse.success && rentsResponse.data) {
        // Add status field based on date
        const rentsWithStatus: Rent[] = rentsResponse.data.map((rent: any) => ({
          ...rent,
          status: determineRentStatus(rent.date)
        }));
        
        // Sort by date, most recent first
        rentsWithStatus.sort((a: Rent, b: Rent) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        // Take only most recent 2 rents
        const recentRentsData = rentsWithStatus.slice(0, 2);
        
        setRecentRents(recentRentsData);
        
        // Calculate stats
        const total = rentsWithStatus.length;
        const active = rentsWithStatus.filter(r => r.status === 'Upcoming' || r.status === 'In Progress').length;
        
        setStats(prevStats => ({
          ...prevStats,
          totalRents: total,
          activeRents: active,
        }));
      }
      
      // Get available cars for today
      const availableCarsResponse = await getAvailableModels(today);
      
      if (availableCarsResponse.success && availableCarsResponse.data) {
        // Take only first 3 available cars
        setAvailableCars(availableCarsResponse.data.slice(0, 3));
      }
      
      // Note: Reviews stats would need an API endpoint to get the count
      // For now, we're keeping it at 0
      
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const determineRentStatus = (date: string): 'Upcoming' | 'In Progress' | 'Completed' => {
    const today = new Date().toISOString().split('T')[0];
    const rentDate = new Date(date).toISOString().split('T')[0];
    
    if (rentDate > today) return 'Upcoming';
    if (rentDate === today) return 'In Progress';
    return 'Completed';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="p-6 bg-white rounded-xl shadow-md">
          <div className="w-12 h-12 mx-auto mb-4 border-t-4 border-indigo-500 border-solid rounded-full animate-spin"></div>
          <p className="text-center text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
        <div className="mt-4 text-center">
          <Link href="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
            Return to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Welcome Card */}
      <div className="bg-white p-6 rounded-xl shadow-md col-span-full">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Welcome back, {user?.name || 'Client'}</h2>
        <p className="text-gray-600">Here's what's happening with your taxi rentals</p>
      </div>

      {/* Stats Cards */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center">
          <div className="bg-indigo-100 p-3 rounded-full mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total Rents</h3>
            <p className="text-2xl font-bold text-gray-800">{stats.totalRents}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Active Rents</h3>
            <p className="text-2xl font-bold text-gray-800">{stats.activeRents}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center">
          <div className="bg-indigo-100 p-3 rounded-full mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Reviews Given</h3>
            <p className="text-2xl font-bold text-gray-800">{stats.reviewsGiven}</p>
          </div>
        </div>
      </div>

      {/* Recent Rents */}
      <div className="bg-white p-6 rounded-xl shadow-md col-span-full md:col-span-2">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Recent Rents</h3>
          <Link href="/client/rents" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          {recentRents.length === 0 ? (
            <div className="bg-gray-50 p-8 text-center rounded-lg">
              <p className="text-gray-500">You have no rents yet.</p>
              <Link 
                href="/client/book" 
                className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Book Your First Rent
              </Link>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentRents.map((rent) => (
                  <tr key={rent.rentid} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{rent.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{rent.driver_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{rent.brand} ({rent.color})</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${rent.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                          rent.status === 'Upcoming' ? 'bg-indigo-100 text-indigo-800' : 
                          'bg-yellow-100 text-yellow-800'}`}
                      >
                        {rent.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Available Cars */}
      <div className="bg-white p-6 rounded-xl shadow-md col-span-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Available Cars</h3>
          <Link href="/client/book" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md">
            Book a Rent
          </Link>
        </div>
        {availableCars.length === 0 ? (
          <div className="bg-gray-50 p-8 text-center rounded-lg">
            <p className="text-gray-500">No cars available for today. Try booking for another date.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {availableCars.map((car, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all hover:border-indigo-300">
                <h4 className="font-semibold text-gray-800">{car.brand}</h4>
                <div className="text-sm text-gray-600 mt-1">
                  <p>Color: {car.color}</p>
                  <p>Year: {car.construction_year}</p>
                  <p>Transmission: {car.transmission_type}</p>
                </div>
                <Link 
                  href={`/client/book?model=${car.modelid}`} 
                  className="mt-3 inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
                >
                  Select this car
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}