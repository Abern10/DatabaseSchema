// src/app/(dashboard)/client/rents/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Rent = {
  id: number;
  date: string;
  driver_name: string;
  driver_id: number;
  brand: string;
  car_id: number;
  model_id: number;
  color: string;
  status: 'Upcoming' | 'In Progress' | 'Completed' | 'Cancelled';
  total_cost?: number;
  driver_rating?: number;
};

export default function ClientRents() {
  const [rents, setRents] = useState<Rent[]>([]);
  const [filteredRents, setFilteredRents] = useState<Rent[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch this data from your API
    const fetchRents = async () => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      const mockRents: Rent[] = [
        {
          id: 1,
          date: '2025-04-25',
          driver_name: 'John Smith',
          driver_id: 1,
          brand: 'Toyota',
          car_id: 1,
          model_id: 1,
          color: 'Silver',
          status: 'Completed',
          total_cost: 75.50,
          driver_rating: 4
        },
        {
          id: 2,
          date: '2025-04-30',
          driver_name: 'Sarah Johnson',
          driver_id: 2,
          brand: 'Honda',
          car_id: 2,
          model_id: 2,
          color: 'Blue',
          status: 'Upcoming',
          total_cost: 65.00
        },
        {
          id: 3,
          date: '2025-04-15',
          driver_name: 'Michael Brown',
          driver_id: 3,
          brand: 'Ford',
          car_id: 3,
          model_id: 3,
          color: 'Black',
          status: 'Completed',
          total_cost: 82.75,
          driver_rating: 5
        },
        {
          id: 4,
          date: '2025-04-28',
          driver_name: 'Emma Wilson',
          driver_id: 4,
          brand: 'Tesla',
          car_id: 4,
          model_id: 4,
          color: 'White',
          status: 'In Progress',
          total_cost: 120.00
        },
        {
          id: 5,
          date: '2025-04-10',
          driver_name: 'James Davis',
          driver_id: 5,
          brand: 'Chevrolet',
          car_id: 5,
          model_id: 5,
          color: 'Red',
          status: 'Cancelled',
          total_cost: 0
        }
      ];
      
      setRents(mockRents);
      setFilteredRents(mockRents);
      setLoading(false);
    };
    
    fetchRents();
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredRents(rents);
    } else {
      setFilteredRents(rents.filter(rent => rent.status.toLowerCase() === filter));
    }
  }, [filter, rents]);

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
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
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-800">My Rents</h2>
        <Link href="/client/book" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-md">
          Book a New Rent
        </Link>
      </div>
      
      {/* Filter Tabs */}
      <div className="flex border-b">
        <button
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${filter === 'all' ? 'text-indigo-600 border-indigo-600' : 'text-gray-500 border-transparent hover:text-indigo-500 hover:border-indigo-300'}`}
          onClick={() => handleFilterChange('all')}
        >
          All
        </button>
        <button
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${filter === 'upcoming' ? 'text-indigo-600 border-indigo-600' : 'text-gray-500 border-transparent hover:text-indigo-500 hover:border-indigo-300'}`}
          onClick={() => handleFilterChange('upcoming')}
        >
          Upcoming
        </button>
        <button
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${filter === 'in progress' ? 'text-indigo-600 border-indigo-600' : 'text-gray-500 border-transparent hover:text-indigo-500 hover:border-indigo-300'}`}
          onClick={() => handleFilterChange('in progress')}
        >
          In Progress
        </button>
        <button
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${filter === 'completed' ? 'text-indigo-600 border-indigo-600' : 'text-gray-500 border-transparent hover:text-indigo-500 hover:border-indigo-300'}`}
          onClick={() => handleFilterChange('completed')}
        >
          Completed
        </button>
        <button
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${filter === 'cancelled' ? 'text-indigo-600 border-indigo-600' : 'text-gray-500 border-transparent hover:text-indigo-500 hover:border-indigo-300'}`}
          onClick={() => handleFilterChange('cancelled')}
        >
          Cancelled
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRents.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No rents found matching the selected filter.
                </td>
              </tr>
            ) : (
              filteredRents.map((rent) => (
                <tr key={rent.id} className="hover:bg-gray-50 transition-colors">
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    ${rent.total_cost?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {rent.driver_rating ? (
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span className="text-sm text-gray-700">{rent.driver_rating}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Not rated</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {rent.status === 'Completed' && !rent.driver_rating && (
                      <Link 
                        href={`/client/reviews/add?driver=${rent.driver_id}&rent=${rent.id}`}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium transition-colors"
                      >
                        Rate Driver
                      </Link>
                    )}
                    {rent.status === 'Upcoming' && (
                      <button 
                        className="text-red-600 hover:text-red-900 text-sm font-medium transition-colors"
                        onClick={() => {
                          // In a real app, this would make an API call to cancel the rent
                          alert(`Cancelled rent #${rent.id}`);
                        }}
                      >
                        Cancel
                      </button>
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