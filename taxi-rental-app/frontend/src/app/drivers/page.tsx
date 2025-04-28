'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, Loader, Plus, Search, Trash, Star,
  Check, X, MapPin, Car, Filter,
  ChevronDown
} from 'lucide-react';

interface Driver {
  name: string;
  address_road_name: string;
  address_number: string;
  address_city: string;
  average_rating?: number;
  total_rents?: number;
}

interface Model {
  brand: string;
  carid: number;
  modelid: number;
  color: string;
  construction_year: number;
  transmission_type: string;
}

export default function DriversPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [driverModels, setDriverModels] = useState<Record<string, Model[]>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [cities, setCities] = useState<string[]>([]);
  
  const [isAddingDriver, setIsAddingDriver] = useState(false);
  const [newDriverData, setNewDriverData] = useState({
    name: '',
    address_road_name: '',
    address_number: '',
    address_city: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // In a real app, you would fetch this from an API
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      
      if (userData.role !== 'manager') {
        router.push('/');
        return;
      }
      
      // Simulating fetching drivers and their models
      setTimeout(() => {
        const mockDrivers = [
          {
            name: 'John Smith',
            address_road_name: 'Main St',
            address_number: '123',
            address_city: 'New York',
            average_rating: 4.5,
            total_rents: 12
          },
          {
            name: 'Jane Doe',
            address_road_name: 'Oak Ave',
            address_number: '456',
            address_city: 'Chicago',
            average_rating: 4.8,
            total_rents: 8
          },
          {
            name: 'Bob Johnson',
            address_road_name: 'Pine St',
            address_number: '789',
            address_city: 'Los Angeles',
            average_rating: 3.9,
            total_rents: 5
          },
          {
            name: 'Alice Brown',
            address_road_name: 'Maple Blvd',
            address_number: '101',
            address_city: 'Chicago',
            average_rating: 4.2,
            total_rents: 10
          }
        ];
        
        const mockModels = [
          {
            brand: 'Toyota',
            carid: 1,
            modelid: 1,
            color: 'Red',
            construction_year: 2022,
            transmission_type: 'automatic'
          },
          {
            brand: 'Toyota',
            carid: 1,
            modelid: 2,
            color: 'Blue',
            construction_year: 2021,
            transmission_type: 'manual'
          },
          {
            brand: 'Honda',
            carid: 2,
            modelid: 1,
            color: 'Silver',
            construction_year: 2023,
            transmission_type: 'automatic'
          },
          {
            brand: 'Tesla',
            carid: 3,
            modelid: 1,
            color: 'White',
            construction_year: 2023,
            transmission_type: 'automatic'
          }
        ];
        
        // Mock driver to model relationships
        const mockDriverModels: Record<string, Model[]> = {
          'John Smith': [mockModels[0], mockModels[2]],
          'Jane Doe': [mockModels[1], mockModels[3]],
          'Bob Johnson': [mockModels[0], mockModels[1], mockModels[2]],
          'Alice Brown': [mockModels[3]]
        };
        
        setDrivers(mockDrivers);
        setModels(mockModels);
        setDriverModels(mockDriverModels);
        
        // Extract unique cities
        const uniqueCities = [...new Set(mockDrivers.map(driver => driver.address_city))];
        setCities(uniqueCities);
        
        setLoading(false);
      }, 1000);
    } else {
      router.push('/login');
    }
  }, [router]);
  
  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = searchTerm === '' || 
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.address_city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCity = cityFilter === '' || driver.address_city === cityFilter;
    
    return matchesSearch && matchesCity;
  });
  
  const handleAddDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newDriverData.name.trim() || !newDriverData.address_road_name.trim() || 
        !newDriverData.address_number.trim() || !newDriverData.address_city.trim()) {
      setError('All fields are required');
      return;
    }
    
    setSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      // In a real app, you would make an API call to your backend
      // const response = await fetch('/api/managers/drivers', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(newDriverData),
      // });
      
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulating success response
      const newDriver: Driver = {
        ...newDriverData,
        average_rating: 0,
        total_rents: 0
      };
      
      setDrivers([...drivers, newDriver]);
      setDriverModels({ ...driverModels, [newDriver.name]: [] });
      
      // Add new city if it doesn't exist
      if (!cities.includes(newDriver.address_city)) {
        setCities([...cities, newDriver.address_city]);
      }
      
      setNewDriverData({
        name: '',
        address_road_name: '',
        address_number: '',
        address_city: ''
      });
      setIsAddingDriver(false);
      setSuccess('Driver added successfully!');
      
      // Clear success message after a few seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      setError('Failed to add driver. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleDeleteDriver = async (name: string) => {
    if (!confirm(`Are you sure you want to delete driver ${name}?`)) {
      return;
    }
    
    try {
      // In a real app, you would make an API call to your backend
      // const response = await fetch(`/api/managers/drivers/${name}`, {
      //   method: 'DELETE'
      // });
      
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      setDrivers(drivers.filter(driver => driver.name !== name));
      
      // Remove driver from driverModels
      const updatedDriverModels = { ...driverModels };
      delete updatedDriverModels[name];
      setDriverModels(updatedDriverModels);
      
      setSuccess('Driver deleted successfully!');
      
      // Clear success message after a few seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      setError('Failed to delete driver. Please try again.');
    }
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setCityFilter('');
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
      <h1 className="text-2xl font-bold mb-6">Driver Management</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1 flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                className="shadow appearance-none border rounded-md w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Search drivers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div className="relative">
              <select
                className="shadow appearance-none border rounded-md py-2 pl-10 pr-8 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
              >
                <option value="">All Cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            {(searchTerm || cityFilter) && (
              <button
                className="text-gray-600 hover:text-gray-800 flex items-center"
                onClick={resetFilters}
              >
                <X className="h-5 w-5 mr-1" />
                <span>Reset</span>
              </button>
            )}
          </div>
          
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
            onClick={() => setIsAddingDriver(true)}
          >
            <Plus className="h-5 w-5 mr-2" />
            <span>Add Driver</span>
          </button>
        </div>
        
        {isAddingDriver && (
          <div className="mb-6 p-4 border rounded-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Add New Driver</h3>
              <button
                className="text-gray-600 hover:text-gray-800"
                onClick={() => setIsAddingDriver(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddDriver}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={newDriverData.name}
                    onChange={(e) => setNewDriverData({...newDriverData, name: e.target.value})}
                    placeholder="Driver's full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Street Name
                  </label>
                  <input
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={newDriverData.address_road_name}
                    onChange={(e) => setNewDriverData({...newDriverData, address_road_name: e.target.value})}
                    placeholder="e.g. Main St"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Street Number
                  </label>
                  <input
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={newDriverData.address_number}
                    onChange={(e) => setNewDriverData({...newDriverData, address_number: e.target.value})}
                    placeholder="e.g. 123"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={newDriverData.address_city}
                    onChange={(e) => setNewDriverData({...newDriverData, address_city: e.target.value})}
                    placeholder="e.g. Chicago"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  disabled={submitting}
                >
                  {submitting ? (
                    <div className="flex items-center">
                      <Loader className="animate-spin h-4 w-4 mr-2" />
                      <span>Adding...</span>
                    </div>
                  ) : (
                    'Add Driver'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
        
        {filteredDrivers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm || cityFilter ? 'No drivers match your filters.' : 'No drivers available.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Driver
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Models
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stats
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDrivers.map((driver) => (
                  <tr key={driver.name} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-2" />
                        <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm text-gray-900">
                            {driver.address_road_name}, {driver.address_number}
                          </div>
                          <div className="text-sm text-gray-500">{driver.address_city}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <Car className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          {driverModels[driver.name]?.length > 0 ? (
                            <div className="text-sm text-gray-900">
                              {driverModels[driver.name].map((model, index) => (
                                <span key={`${model.brand}-${model.carid}-${model.modelid}`}>
                                  {model.brand} ({model.color})
                                  {index < driverModels[driver.name].length - 1 ? ', ' : ''}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500">No models assigned</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-4">
                        <div>
                          <div className="text-xs text-gray-500">Rating</div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                            <span className="text-sm font-medium">{driver.average_rating?.toFixed(1) || 'N/A'}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Rents</div>
                          <div className="text-sm font-medium">{driver.total_rents || 0}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteDriver(driver.name)}
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}