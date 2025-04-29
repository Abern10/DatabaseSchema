'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BarChart3, Calendar, Car, DollarSign, Loader, 
  Star, TrendingUp, User, Users, X, Zap
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Driver {
  name: string;
  total_rents: number;
  average_rating: number;
}

interface CarModelStat {
  brand: string;
  modelid: number;
  color: string;
  rent_count: number;
}

interface TopClient {
  name: string;
  email: string;
  rent_count: number;
}

export default function ManagerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRents: 0,
    totalDrivers: 0,
    totalClients: 0,
    totalCars: 0,
    totalRevenue: 0
  });
  
  const [driverStats, setDriverStats] = useState<Driver[]>([]);
  const [carModelStats, setCarModelStats] = useState<CarModelStat[]>([]);
  const [topClients, setTopClients] = useState<TopClient[]>([]);
  const [topK, setTopK] = useState(5);
  const [cityFilter, setCityFilter] = useState('');
  const [isSelectingCity, setIsSelectingCity] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const [cityClients, setCityClients] = useState<any[]>([]);

  useEffect(() => {
      // TODO: fetch this from an API
  
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      
      if (userData.role !== 'manager') {
        router.push('/');
        return;
      }
      
      // TODO: Simulating fetching dashboard data
      setTimeout(() => {
        setStats({
          totalRents: 156,
          totalDrivers: 12,
          totalClients: 45,
          totalCars: 20,
          totalRevenue: 15680
        });
        
        setDriverStats([
          { name: 'John Smith', total_rents: 32, average_rating: 4.7 },
          { name: 'Jane Doe', total_rents: 28, average_rating: 4.9 },
          { name: 'Bob Johnson', total_rents: 24, average_rating: 4.2 },
          { name: 'Alice Brown', total_rents: 18, average_rating: 4.5 },
          { name: 'Mike Wilson', total_rents: 12, average_rating: 3.8 }
        ]);
        
        setCarModelStats([
          { brand: 'Toyota', modelid: 1, color: 'Red', rent_count: 42 },
          { brand: 'Honda', modelid: 1, color: 'Blue', rent_count: 38 },
          { brand: 'Tesla', modelid: 1, color: 'White', rent_count: 35 },
          { brand: 'Toyota', modelid: 2, color: 'Silver', rent_count: 21 },
          { brand: 'BMW', modelid: 1, color: 'Black', rent_count: 20 }
        ]);
        
        setTopClients([
          { name: 'David Miller', email: 'david@example.com', rent_count: 12 },
          { name: 'Sarah Johnson', email: 'sarah@example.com', rent_count: 10 },
          { name: 'Michael Brown', email: 'michael@example.com', rent_count: 8 },
          { name: 'Emily Davis', email: 'emily@example.com', rent_count: 7 },
          { name: 'James Wilson', email: 'james@example.com', rent_count: 6 }
        ]);
        
        setCities(['New York', 'Chicago', 'Los Angeles', 'Miami', 'Seattle']);
        
        setLoading(false);
      }, 1000);
    } else {
      router.push('/login');
    }
  }, [router]);
  
  const handleCitySelect = (city1: string, city2: string) => {
    setCityFilter(`${city1} to ${city2}`);
    
    // TODO: Simulating API call to fetch clients who have address in city1 and booked a ride with driver from city2
    setTimeout(() => {
      setCityClients([
        { name: 'David Miller', email: 'david@example.com' },
        { name: 'Sarah Johnson', email: 'sarah@example.com' },
        { name: 'James Wilson', email: 'james@example.com' }
      ]);
    }, 500);
  };
  
  const fetchTopClients = (k: number) => {
    setTopK(k);
    
    // TODO: Simulating API call
    setTimeout(() => {
      // In a real app, you would fetch the top k clients from your API
      const allClients = [
        { name: 'David Miller', email: 'david@example.com', rent_count: 12 },
        { name: 'Sarah Johnson', email: 'sarah@example.com', rent_count: 10 },
        { name: 'Michael Brown', email: 'michael@example.com', rent_count: 8 },
        { name: 'Emily Davis', email: 'emily@example.com', rent_count: 7 },
        { name: 'James Wilson', email: 'james@example.com', rent_count: 6 },
        { name: 'Robert Taylor', email: 'robert@example.com', rent_count: 5 },
        { name: 'Jennifer Lee', email: 'jennifer@example.com', rent_count: 4 },
        { name: 'William Moore', email: 'william@example.com', rent_count: 3 },
        { name: 'Lisa Anderson', email: 'lisa@example.com', rent_count: 2 },
        { name: 'Thomas Martin', email: 'thomas@example.com', rent_count: 1 }
      ];
      
      setTopClients(allClients.slice(0, k));
    }, 500);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Manager Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold">${stats.totalRevenue}</p>
            </div>
            <div className="p-3 rounded-full bg-emerald-100 text-emerald-600">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Driver Statistics */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-gray-500" />
            Driver Statistics
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Driver
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Rents
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg. Rating
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {driverStats.map((driver) => (
                  <tr key={driver.name} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{driver.total_rents}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Star className={`h-4 w-4 ${driver.average_rating >= 4.5 ? 'text-green-500' : driver.average_rating >= 4.0 ? 'text-yellow-500' : 'text-red-500'} fill-current mr-1`} />
                        <span className="text-sm font-medium">{driver.average_rating.toFixed(1)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Car Model Statistics */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Car className="h-5 w-5 mr-2 text-gray-500" />
            Car Model Statistics
          </h2>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={carModelStats}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="brand" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="rent_count" name="Rent Count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Car
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Color
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rent Count
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {carModelStats.map((model, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{model.brand}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{model.color}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{model.rent_count}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Clients */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-gray-500" />
              Top Clients
            </h2>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Show top:</span>
              <select
                className="shadow border rounded py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={topK}
                onChange={(e) => fetchTopClients(parseInt(e.target.value))}
              >
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="10">10</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rent Count
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topClients.map((client) => (
                  <tr key={client.email} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{client.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{client.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{client.rent_count}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* City to City Clients */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Zap className="h-5 w-5 mr-2 text-gray-500" />
            City Cross-Rentals
          </h2>
          
          {isSelectingCity ? (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Select Cities</h3>
                <button
                  className="text-gray-600 hover:text-gray-800"
                  onClick={() => setIsSelectingCity(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Client City
                  </label>
                  <select
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="city1"
                  >
                    {cities.map((city) => (
                      <option key={`city1-${city}`} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Driver City
                  </label>
                  <select
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="city2"
                  >
                    {cities.map((city) => (
                      <option key={`city2-${city}`} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => {
                    const city1 = (document.getElementById('city1') as HTMLSelectElement).value;
                    const city2 = (document.getElementById('city2') as HTMLSelectElement).value;
                    handleCitySelect(city1, city2);
                    setIsSelectingCity(false);
                  }}
                >
                  Find Clients
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <p className="text-gray-600 mb-4">
                Find clients who have an address in one city and booked a rent with a driver from another city.
              </p>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => setIsSelectingCity(true)}
              >
                Select Cities
              </button>
            </div>
          )}
          
          {cityFilter && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Results: {cityFilter}</h3>
              
              {cityClients.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No clients found matching these criteria.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {cityClients.map((client) => (
                        <tr key={client.email} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{client.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{client.email}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}