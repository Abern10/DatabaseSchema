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
  construction_year: number;
  transmission_type: string;
  status?: 'Upcoming' | 'In Progress' | 'Completed' | 'Cancelled'; // This will be derived
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
      router.push('/'); // Redirect to login if not logged in
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
        setError('Failed to load rents: ' + (response.error || ''));
        setRents([]);
        setFilteredRents([]);
      }
    } catch (err) {
      console.error('Error loading rents:', err);
      setError('An unexpected error occurred while loading your rents.');
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

  return (
    <div className="bg-white rounded-xl shadow-md">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">My Rents</h2>
        <Link href="/client/book" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-md">
          Book a New Rent
        </Link>
      </div>
      
      {error && (
        <div className="p-4 m-6 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
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
      
      {/* Rents Table */}
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
            {filteredRents.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No rents found matching the selected filter.
                </td>
              </tr>
            ) : (
              filteredRents.map((rent) => (
                <tr key={rent.rentid} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{rent.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{rent.driver_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{rent.brand} ({rent.color})</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${rent.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                        rent.status === 'Upcoming' ? 'bg-indigo-100 text-indigo-800' : 
                        rent.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}