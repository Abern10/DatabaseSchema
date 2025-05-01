// src/app/(dashboard)/driver/schedule/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type ScheduledRide = {
  id: number;
  date: string;
  time: string;
  client_name: string;
  pickup_address: string;
  dropoff_address: string;
  car_info: string;
  status: 'Upcoming' | 'In Progress' | 'Completed' | 'Cancelled';
  payment: string;
};

export default function DriverSchedule() {
  const [rides, setRides] = useState<ScheduledRide[]>([]);
  const [filteredRides, setFilteredRides] = useState<ScheduledRide[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    // In a real app, fetch this data from your API
    const fetchRides = async () => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      const mockRides: ScheduledRide[] = [
        {
          id: 1,
          date: '2025-04-30',
          time: '09:30 AM',
          client_name: 'Alice Johnson',
          pickup_address: '123 Main St, New York',
          dropoff_address: '789 Broadway, New York',
          car_info: 'Toyota Camry (Silver)',
          status: 'Upcoming',
          payment: '$35.50'
        },
        {
          id: 2,
          date: '2025-04-30',
          time: '02:00 PM',
          client_name: 'Bob Smith',
          pickup_address: '456 Park Ave, New York',
          dropoff_address: '101 5th Ave, New York',
          car_info: 'Honda Accord (Blue)',
          status: 'Upcoming',
          payment: '$42.75'
        },
        {
          id: 3,
          date: '2025-04-29',
          time: '11:15 AM',
          client_name: 'Emma Wilson',
          pickup_address: '222 Oak St, Brooklyn',
          dropoff_address: '333 Pine St, Brooklyn',
          car_info: 'Toyota Camry (Silver)',
          status: 'Completed',
          payment: '$28.30'
        },
        {
          id: 4,
          date: '2025-04-28',
          time: '04:45 PM',
          client_name: 'Michael Brown',
          pickup_address: '555 Cedar Ave, Queens',
          dropoff_address: '777 Maple Rd, Manhattan',
          car_info: 'Honda Accord (Blue)',
          status: 'Completed',
          payment: '$56.20'
        },
        {
          id: 5,
          date: '2025-05-01',
          time: '10:00 AM',
          client_name: 'Sophia Martinez',
          pickup_address: '888 Birch Blvd, Manhattan',
          dropoff_address: '999 Willow St, Brooklyn',
          car_info: 'Toyota Camry (Silver)',
          status: 'Upcoming',
          payment: '$38.90'
        }
      ];
      
      setRides(mockRides);
      applyFilters(mockRides, filter, selectedDate);
      setLoading(false);
    };
    
    fetchRides();
  }, []);

  const applyFilters = (rides: ScheduledRide[], statusFilter: string, dateFilter: string) => {
    let filtered = [...rides];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ride => ride.status.toLowerCase() === statusFilter);
    }
    
    // Apply date filter if provided
    if (dateFilter) {
      filtered = filtered.filter(ride => ride.date === dateFilter);
    }
    
    setFilteredRides(filtered);
  };

  const handleStatusFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    applyFilters(rides, newFilter, selectedDate);
  };

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    applyFilters(rides, filter, newDate);
  };

  const clearDateFilter = () => {
    setSelectedDate('');
    applyFilters(rides, filter, '');
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
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-800">My Schedule</h2>
      </div>
      
      {/* Filters */}
      <div className="p-6 border-b bg-gray-50">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Status Filter */}
          <div className="flex border-b border-gray-200">
            <button
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${filter === 'all' ? 'text-indigo-600 border-indigo-600' : 'text-gray-500 border-transparent hover:text-indigo-500 hover:border-indigo-300'}`}
              onClick={() => handleStatusFilterChange('all')}
            >
              All
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${filter === 'upcoming' ? 'text-indigo-600 border-indigo-600' : 'text-gray-500 border-transparent hover:text-indigo-500 hover:border-indigo-300'}`}
              onClick={() => handleStatusFilterChange('upcoming')}
            >
              Upcoming
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${filter === 'in progress' ? 'text-indigo-600 border-indigo-600' : 'text-gray-500 border-transparent hover:text-indigo-500 hover:border-indigo-300'}`}
              onClick={() => handleStatusFilterChange('in progress')}
            >
              In Progress
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${filter === 'completed' ? 'text-indigo-600 border-indigo-600' : 'text-gray-500 border-transparent hover:text-indigo-500 hover:border-indigo-300'}`}
              onClick={() => handleStatusFilterChange('completed')}
            >
              Completed
            </button>
          </div>
          
          {/* Date Filter */}
          <div className="flex items-center space-x-2">
            <label htmlFor="date-filter" className="text-sm font-medium text-gray-700">
              Date:
            </label>
            <input
              id="date-filter"
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {selectedDate && (
              <button
                onClick={clearDateFilter}
                className="text-xs text-gray-500 hover:text-indigo-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Rides List */}
      <div className="p-6">
        {filteredRides.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500">No rides found matching your filters.</p>
            <button
              onClick={() => {
                setFilter('all');
                setSelectedDate('');
                applyFilters(rides, 'all', '');
              }}
              className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredRides.map((ride) => (
              <div key={ride.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all hover:border-indigo-300">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center">
                      <span 
                        className={`px-2 py-1 text-xs font-semibold rounded-full mr-2
                        ${ride.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                          ride.status === 'Upcoming' ? 'bg-indigo-100 text-indigo-800' : 
                          ride.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}
                      >
                        {ride.status}
                      </span>
                      <h3 className="font-semibold text-gray-800">
                        {ride.date} - {ride.time}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Client: {ride.client_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">{ride.payment}</p>
                    <p className="text-sm text-gray-600">{ride.car_info}</p>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-2 rounded-md">
                    <p className="text-xs text-gray-500">Pickup</p>
                    <p className="text-sm text-gray-700">{ride.pickup_address}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-md">
                    <p className="text-xs text-gray-500">Dropoff</p>
                    <p className="text-sm text-gray-700">{ride.dropoff_address}</p>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Link 
                    href={`/driver/schedule/${ride.id}`}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
                  >
                    View Details
                  </Link>
                  
                  {ride.status === 'Upcoming' && (
                    <button 
                      className="ml-4 px-3 py-1 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
                      onClick={() => {
                        // In a real app, implement logic to start the ride
                        alert(`Starting ride #${ride.id}`);
                      }}
                    >
                      Start Ride
                    </button>
                  )}
                  
                  {ride.status === 'In Progress' && (
                    <button 
                      className="ml-4 px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                      onClick={() => {
                        // In a real app, implement logic to complete the ride
                        alert(`Completing ride #${ride.id}`);
                      }}
                    >
                      Complete Ride
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}