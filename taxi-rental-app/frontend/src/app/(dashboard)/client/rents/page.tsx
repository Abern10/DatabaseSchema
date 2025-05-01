// src/app/(dashboard)/client/rents/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getClientRents } from '@/lib/api';

type Rent = {
  rentid: number;
  date: string;
  driver_name: string;
  brand: string;
  carid: number;
  modelid: number;
  color: string;
  status?: 'Upcoming' | 'In Progress' | 'Completed';
};

export default function ClientRents() {
  const router = useRouter();
  const [rents, setRents] = useState<Rent[]>([]);
  const [filteredRents, setFilteredRents] = useState<Rent[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get user info from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Load user's rents
      loadRents(parsedUser.email);
    } else {
      setError('User not found. Please log in again.');
      setLoading(false);
      // Redirect to login after a short delay
      setTimeout(() => router.push('/'), 2000);
    }
  }, [router]);

  const loadRents = async (email: string) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await getClientRents(email);
      
      if (response.success) {
        // Add status based on date comparison
        const today = new Date().toISOString().split('T')[0];
        const rentsWithStatus = (response.data || []).map((rent: Rent) => ({
          ...rent,
          status: determineRentStatus(rent.date)
        }));
        
        setRents(rentsWithStatus);
        filterRents(rentsWithStatus, filter);
      } else {
        setError('Failed to load rents: ' + (response.error || 'Unknown error'));
        setRents([]);
        setFilteredRents([]);
      }
    } catch (err) {
      console.error('Error loading rents:', err);
      setError('An unexpected error occurred while loading your rents.');
      setRents([]);
      setFilteredRents([]);
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

  const filterRents = (allRents: Rent[], statusFilter: string) => {
    if (statusFilter === 'all') {
      setFilteredRents(allRents);
    } else {
      const filtered = allRents.filter(rent => 
        rent.status?.toLowerCase() === statusFilter.toLowerCase()
      );
      setFilteredRents(filtered);
    }
  };

  const handleStatusFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    filterRents(rents, newFilter);
  };

  const handleRefresh = () => {
    if (user?.email) {
      loadRents(user.email);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="p-6 bg-white rounded-xl shadow-md">
          <div className="w-12 h-12 mx-auto mb-4 border-t-4 border-indigo-500 border-solid rounded-full animate-spin"></div>
          <p className="text-center text-gray-600">Loading your rents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">My Rents</h2>
        <div className="flex space-x-2">
          <button 
            onClick={handleRefresh}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Refresh"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <Link href="/client/book" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-md">
            Book a New Rent
          </Link>
        </div>
      </div>
      
      {error && (
        <div className="p-4 m-6 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
          <button 
            onClick={handleRefresh} 
            className="ml-2 text-red-700 underline hover:text-red-900"
          >
            Try Again
          </button>
        </div>
      )}
      
      {/* Filter Tabs */}
      <div className="flex border-b">
        <button
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${filter === 'all' ? 'text-indigo-600 border-indigo-600' : 'text-gray-500 border-transparent hover:text-indigo-500 hover:border-indigo-300'}`}
          onClick={() => handleStatusFilterChange('all')}
        >
          All
        </button>
        <button
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${filter === 'upcoming' ? 'text-indigo-600 border-indigo-600' : 'text-gray-500 border-transparent hover:text-indigo-500 hover:border-indigo-300'}`}
          onClick={() => handleStatusFilterChange('upcoming')}
        >
          Upcoming
        </button>
        <button
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${filter === 'in progress' ? 'text-indigo-600 border-indigo-600' : 'text-gray-500 border-transparent hover:text-indigo-500 hover:border-indigo-300'}`}
          onClick={() => handleStatusFilterChange('in progress')}
        >
          In Progress
        </button>
        <button
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${filter === 'completed' ? 'text-indigo-600 border-indigo-600' : 'text-gray-500 border-transparent hover:text-indigo-500 hover:border-indigo-300'}`}
          onClick={() => handleStatusFilterChange('completed')}
        >
          Completed
        </button>
      </div>
      
      {/* Rents Table or Empty State */}
      {!loading && rents.length === 0 ? (
        <div className="p-8 text-center">
          <div className="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No rents found</h3>
          <p className="text-gray-500 mb-6">You haven't booked any rides yet. Get started by booking your first rent!</p>
          <Link 
            href="/client/book" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Book a Rent
          </Link>
        </div>
      ) : filteredRents.length === 0 ? (
        <div className="p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No rents found for the selected filter</h3>
          <p className="text-gray-500 mb-4">Try selecting a different filter or book a new rent.</p>
          <button
            onClick={() => handleStatusFilterChange('all')}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Clear filter
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRents.map((rent) => (
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    {rent.status === 'Completed' && (
                      <Link 
                        href={`/client/reviews/add?driver=${rent.driver_name}&rent=${rent.rentid}`}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium transition-colors"
                      >
                        Rate Driver
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}