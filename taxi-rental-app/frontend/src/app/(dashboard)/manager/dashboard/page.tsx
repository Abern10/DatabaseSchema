// src/app/(dashboard)/manager/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AddDriverModal from '@/components/modals/AddDriverModal';
import AddCarModal from '@/components/modals/AddCarModal';
import AddModelModal from '@/components/modals/AddModelModal';

export default function ManagerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [showAddCarModal, setShowAddCarModal] = useState(false);
  const [showAddModelModal, setShowAddModelModal] = useState(false);

  type Driver = {
    id: number;
    name: string;
    total_rides: number;
    average_rating: number;
  };
  
  type Car = {
    id: number;
    brand: string;
    total_models: number;
    rides_count: number;
  };

  type RentStats = {
    today: number;
    week: number;
    month: number;
    total: number;
  };
  
  const [topDrivers, setTopDrivers] = useState<Driver[]>([]);
  const [topCars, setTopCars] = useState<Car[]>([]);
  const [rentStats, setRentStats] = useState<RentStats | null>(null);
  const [recentRents, setRecentRents] = useState<any[]>([]);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      
      // In a real application, you would fetch this data from your API
      // Simulating API calls with mock data
      setTopDrivers([
        {
          id: 1,
          name: 'John Smith',
          total_rides: 248,
          average_rating: 4.8
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          total_rides: 215,
          average_rating: 4.9
        },
        {
          id: 3,
          name: 'Michael Brown',
          total_rides: 192,
          average_rating: 4.6
        },
        {
          id: 4,
          name: 'Emma Wilson',
          total_rides: 187,
          average_rating: 4.7
        },
      ]);
      
      setTopCars([
        {
          id: 1,
          brand: 'Toyota',
          total_models: 5,
          rides_count: 423
        },
        {
          id: 2,
          brand: 'Honda',
          total_models: 3,
          rides_count: 312
        },
        {
          id: 3,
          brand: 'Tesla',
          total_models: 2,
          rides_count: 256
        },
      ]);
      
      setRentStats({
        today: 48,
        week: 312,
        month: 1254,
        total: 15872
      });
      
      setRecentRents([
        {
          id: 1,
          date: '2025-04-30',
          client_name: 'Alice Johnson',
          driver_name: 'John Smith',
          car_info: 'Toyota Camry (Silver)',
          status: 'Completed'
        },
        {
          id: 2,
          date: '2025-04-30',
          client_name: 'Bob Smith',
          driver_name: 'Sarah Johnson',
          car_info: 'Honda Accord (Blue)',
          status: 'In Progress'
        },
        {
          id: 3,
          date: '2025-04-30',
          client_name: 'Emma Wilson',
          driver_name: 'Michael Brown',
          car_info: 'Tesla Model 3 (White)',
          status: 'Upcoming'
        },
        {
          id: 4,
          date: '2025-04-29',
          client_name: 'James Davis',
          driver_name: 'Emma Wilson',
          car_info: 'Toyota Corolla (Red)',
          status: 'Completed'
        },
      ]);
    }
    setLoading(false);
  }, []);

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
  
  // Handle successful operations and redirects
  const handleDriverAdded = () => {
    router.push('/manager/drivers');
  };
  
  const handleCarAdded = () => {
    router.push('/manager/cars');
  };
  
  const handleModelAdded = () => {
    router.push('/manager/models');
  };
  
  // Handle car addition with model redirect
  const handleAddModelToCar = (brand: string, carId: number) => {
    // In a real app, you'd store this info and pass it to the models page
    router.push('/manager/models');
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Welcome Card */}
      <div className="bg-white p-6 rounded-xl shadow-md col-span-full">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Welcome back, {user?.name || 'Manager'}</h2>
        <p className="text-gray-600">Here's an overview of your taxi rental service</p>
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
            <h3 className="text-sm font-medium text-gray-500">Today's Rents</h3>
            <p className="text-2xl font-bold text-gray-800">{rentStats?.today}</p>
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
            <h3 className="text-sm font-medium text-gray-500">Weekly Rents</h3>
            <p className="text-2xl font-bold text-gray-800">{rentStats?.week}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center">
          <div className="bg-indigo-100 p-3 rounded-full mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total Drivers</h3>
            <p className="text-2xl font-bold text-gray-800">32</p>
          </div>
        </div>
      </div>

      {/* Recent Rents */}
      <div className="bg-white p-6 rounded-xl shadow-md col-span-full md:col-span-2">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Recent Rents</h3>
          <Link href="/manager/reports" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors">
            View All Reports
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentRents.map((rent: any) => (
                <tr key={rent.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{rent.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{rent.client_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{rent.driver_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{rent.car_info}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Drivers */}
      <div className="bg-white p-6 rounded-xl shadow-md col-span-full md:col-span-1">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Top Drivers</h3>
          <Link href="/manager/drivers" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors">
            View All
          </Link>
        </div>
        <div className="space-y-4">
          {topDrivers.map((driver) => (
            <div key={driver.id} className="flex justify-between items-center border-b pb-3">
              <div>
                <p className="font-medium text-gray-800">{driver.name}</p>
                <p className="text-sm text-gray-600">{driver.total_rides} rides</p>
              </div>
              <div className="flex items-center">
                <span className="text-lg mr-1">{driver.average_rating}</span>
                <div className="flex text-sm">{renderStars(Math.round(driver.average_rating))}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Car Brands */}
      <div className="bg-white p-6 rounded-xl shadow-md col-span-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Top Car Brands by Rides</h3>
          <Link href="/manager/cars" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors">
            Manage Cars
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topCars.map((car) => (
            <div key={car.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all hover:border-indigo-300">
              <h4 className="font-semibold text-gray-800">{car.brand}</h4>
              <div className="text-sm text-gray-600 mt-1">
                <p>{car.total_models} models available</p>
                <p>{car.rides_count} total rides</p>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full" 
                  style={{ width: `${Math.min(car.rides_count / 5, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-md col-span-full">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => setShowAddDriverModal(true)} 
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all hover:border-indigo-300 flex flex-col items-center text-center"
          >
            <div className="bg-indigo-100 p-3 rounded-full mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <p className="font-medium text-gray-800">Add Driver</p>
          </button>
          
          <button 
            onClick={() => setShowAddCarModal(true)} 
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all hover:border-indigo-300 flex flex-col items-center text-center"
          >
            <div className="bg-green-100 p-3 rounded-full mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="font-medium text-gray-800">Add Car</p>
          </button>
          
          <button 
            onClick={() => setShowAddModelModal(true)} 
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all hover:border-indigo-300 flex flex-col items-center text-center"
          >
            <div className="bg-indigo-100 p-3 rounded-full mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="font-medium text-gray-800">Add Model</p>
          </button>
          
          <Link 
            href="/manager/reports" 
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all hover:border-indigo-300 flex flex-col items-center text-center"
          >
            <div className="bg-green-100 p-3 rounded-full mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="font-medium text-gray-800">Generate Report</p>
          </Link>
        </div>
      </div>
      
      {/* Modals */}
      <AddDriverModal 
        isOpen={showAddDriverModal}
        onClose={() => setShowAddDriverModal(false)}
        onSuccess={handleDriverAdded}
      />
      
      <AddCarModal 
        isOpen={showAddCarModal}
        onClose={() => setShowAddCarModal(false)}
        onSuccess={handleCarAdded}
        onAddModel={handleAddModelToCar}
      />
      
      <AddModelModal 
        isOpen={showAddModelModal}
        onClose={() => setShowAddModelModal(false)}
        onSuccess={handleModelAdded}
      />
    </div>
  );
}