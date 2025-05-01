// src/app/(dashboard)/manager/drivers/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AddDriverModal from '@/components/modals/AddDriverModal';

type Driver = {
  id: number;
  name: string;
  address: {
    road_name: string;
    number: number;
    city: string;
  };
  phone: string;
  email: string;
  total_rides: number;
  average_rating: number;
  status: 'Active' | 'Inactive';
  joining_date: string;
};

export default function ManagerDrivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'rides' | 'rating'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState<Driver | null>(null);
  
  // Add driver modal state
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);

  useEffect(() => {
    // In a real app, fetch this data from your API
    const fetchDrivers = async () => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      const mockDrivers: Driver[] = [
        {
          id: 1,
          name: 'John Smith',
          address: {
            road_name: 'Main Street',
            number: 123,
            city: 'New York'
          },
          phone: '+1 (555) 123-4567',
          email: 'john.smith@example.com',
          total_rides: 248,
          average_rating: 4.8,
          status: 'Active',
          joining_date: '2023-06-01'
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          address: {
            road_name: 'Park Avenue',
            number: 456,
            city: 'Chicago'
          },
          phone: '+1 (555) 987-6543',
          email: 'sarah.johnson@example.com',
          total_rides: 215,
          average_rating: 4.9,
          status: 'Active',
          joining_date: '2023-08-15'
        },
        {
          id: 3,
          name: 'Michael Brown',
          address: {
            road_name: 'Oak Street',
            number: 789,
            city: 'Chicago'
          },
          phone: '+1 (555) 567-8901',
          email: 'michael.brown@example.com',
          total_rides: 192,
          average_rating: 4.6,
          status: 'Active',
          joining_date: '2023-09-22'
        },
        {
          id: 4,
          name: 'Emma Wilson',
          address: {
            road_name: 'Pine Road',
            number: 321,
            city: 'Boston'
          },
          phone: '+1 (555) 234-5678',
          email: 'emma.wilson@example.com',
          total_rides: 187,
          average_rating: 4.7,
          status: 'Active',
          joining_date: '2023-10-05'
        },
        {
          id: 5,
          name: 'David Miller',
          address: {
            road_name: 'Cedar Lane',
            number: 654,
            city: 'Chicago'
          },
          phone: '+1 (555) 876-5432',
          email: 'david.miller@example.com',
          total_rides: 145,
          average_rating: 4.5,
          status: 'Inactive',
          joining_date: '2024-01-12'
        },
        {
          id: 6,
          name: 'Olivia Davis',
          address: {
            road_name: 'Maple Avenue',
            number: 987,
            city: 'Los Angeles'
          },
          phone: '+1 (555) 345-6789',
          email: 'olivia.davis@example.com',
          total_rides: 132,
          average_rating: 4.4,
          status: 'Active',
          joining_date: '2024-02-28'
        },
        {
          id: 7,
          name: 'James Wilson',
          address: {
            road_name: 'Birch Street',
            number: 753,
            city: 'Chicago'
          },
          phone: '+1 (555) 789-0123',
          email: 'james.wilson@example.com',
          total_rides: 98,
          average_rating: 4.2,
          status: 'Inactive',
          joining_date: '2024-03-15'
        }
      ];
      
      setDrivers(mockDrivers);
      setFilteredDrivers(mockDrivers);
      setLoading(false);
    };
    
    fetchDrivers();
  }, []);

  // Apply filters and sorting whenever dependencies change
  useEffect(() => {
    let result = [...drivers];
    
    // Apply status filter
    if (filter === 'active') {
      result = result.filter(driver => driver.status === 'Active');
    } else if (filter === 'inactive') {
      result = result.filter(driver => driver.status === 'Inactive');
    }
    
    // Apply search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(driver => 
        driver.name.toLowerCase().includes(term) ||
        driver.email.toLowerCase().includes(term) ||
        driver.address.city.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'rides') {
        return sortOrder === 'asc'
          ? a.total_rides - b.total_rides
          : b.total_rides - a.total_rides;
      } else { // rating
        return sortOrder === 'asc'
          ? a.average_rating - b.average_rating
          : b.average_rating - a.average_rating;
      }
    });
    
    setFilteredDrivers(result);
  }, [drivers, filter, searchTerm, sortBy, sortOrder]);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'text-yellow-500' : 'text-gray-300'}>
          ★
        </span>
      );
    }
    return stars;
  };

  const toggleSort = (field: 'name' | 'rides' | 'rating') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleDeleteDriver = (driver: Driver) => {
    setDriverToDelete(driver);
    setShowDeleteModal(true);
  };

  const confirmDeleteDriver = async () => {
    if (!driverToDelete) return;
    
    try {
      // In a real app, make an API call to delete the driver
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setDrivers(drivers.filter(d => d.id !== driverToDelete.id));
      setShowDeleteModal(false);
      setDriverToDelete(null);
      
      // Show success message (in a real app)
    } catch (err) {
      // Handle error (in a real app)
      console.error('Error deleting driver:', err);
    }
  };

  const toggleDriverStatus = async (driver: Driver) => {
    try {
      // In a real app, make an API call to update the driver's status
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      const updatedDrivers = drivers.map(d => {
        if (d.id === driver.id) {
          return {
            ...d,
            status: d.status === 'Active' ? 'Inactive' : 'Active'
          };
        }
        return d;
      });
      
      setDrivers(updatedDrivers);
      
      // Show success message (in a real app)
    } catch (err) {
      // Handle error (in a real app)
      console.error('Error updating driver status:', err);
    }
  };
  
  const handleDriverAdded = () => {
    // In a real app, refetch drivers or update the state with the new driver
    // For now, we'll just add a mock driver
    const newDriver: Driver = {
      id: drivers.length + 1,
      name: 'New Driver',
      address: {
        road_name: 'Some Street',
        number: 123,
        city: 'Some City'
      },
      phone: '+1 (555) 123-4567',
      email: 'new.driver@example.com',
      total_rides: 0,
      average_rating: 0,
      status: 'Active',
      joining_date: new Date().toISOString().split('T')[0]
    };
    
    setDrivers([...drivers, newDriver]);
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
        <h2 className="text-xl font-semibold text-gray-800">Manage Drivers</h2>
        <button 
          onClick={() => setShowAddDriverModal(true)} 
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-md"
        >
          Add New Driver
        </button>
      </div>
      
      {/* Filters and Search */}
      <div className="p-6 border-b bg-gray-50">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Status Filter */}
          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            <button
              className={`px-4 py-2 text-sm font-medium transition-colors ${filter === 'all' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setFilter('all')}
            >
              All Drivers
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium transition-colors ${filter === 'active' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium transition-colors ${filter === 'inactive' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setFilter('inactive')}
            >
              Inactive
            </button>
          </div>
          
          {/* Search */}
          <div className="flex-1 min-w-64 max-w-md">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search drivers by name, email, or city..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 absolute left-3 top-2.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Drivers Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => toggleSort('name')}
              >
                <div className="flex items-center">
                  Driver
                  {sortBy === 'name' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortOrder === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                    </svg>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => toggleSort('rides')}
              >
                <div className="flex items-center">
                  Rides
                  {sortBy === 'rides' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortOrder === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                    </svg>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => toggleSort('rating')}
              >
                <div className="flex items-center">
                  Rating
                  {sortBy === 'rating' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortOrder === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                    </svg>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDrivers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No drivers found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredDrivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-medium">
                        {driver.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                        <div className="text-xs text-gray-500">Joined {new Date(driver.joining_date).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{driver.email}</div>
                    <div className="text-sm text-gray-500">{driver.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">
                      {driver.address.road_name} {driver.address.number}
                    </div>
                    <div className="text-sm text-gray-500">{driver.address.city}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {driver.total_rides}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-700 mr-2">{driver.average_rating.toFixed(1)}</span>
                      <div className="flex text-sm">{renderStars(Math.round(driver.average_rating))}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${driver.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      {driver.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link 
                        href={`/manager/drivers/${driver.id}`}
                        className="text-indigo-600 hover:text-indigo-900 transition-colors"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => toggleDriverStatus(driver)}
                        className={`${driver.status === 'Active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'} transition-colors`}
                      >
                        {driver.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteDriver(driver)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Delete Modal */}
      {showDeleteModal && driverToDelete && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete driver <span className="font-semibold">{driverToDelete.name}</span>? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteDriver}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Driver Modal */}
      <AddDriverModal 
        isOpen={showAddDriverModal}
        onClose={() => setShowAddDriverModal(false)}
        onSuccess={handleDriverAdded}
      />
    </div>
  );
}