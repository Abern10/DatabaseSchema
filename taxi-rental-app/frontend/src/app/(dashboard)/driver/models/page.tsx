// src/app/(dashboard)/driver/models/page.tsx
'use client';

import { useState, useEffect } from 'react';

type CarModel = {
  id: number;
  brand: string;
  car_id: number;
  model_id: number;
  color: string;
  construction_year: number;
  transmission_type: 'manual' | 'automatic';
  can_drive: boolean;
};

export default function DriverModels() {
  const [models, setModels] = useState<CarModel[]>([]);
  const [filteredModels, setFilteredModels] = useState<CarModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'can-drive' | 'cannot-drive'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [brands, setBrands] = useState<string[]>([]);

  useEffect(() => {
    // In a real app, fetch this data from your API
    const fetchModels = async () => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      const mockModels: CarModel[] = [
        {
          id: 1,
          brand: 'Toyota',
          car_id: 1,
          model_id: 1,
          color: 'Silver',
          construction_year: 2023,
          transmission_type: 'automatic',
          can_drive: true
        },
        {
          id: 2,
          brand: 'Honda',
          car_id: 2,
          model_id: 1,
          color: 'Blue',
          construction_year: 2022,
          transmission_type: 'manual',
          can_drive: true
        },
        {
          id: 3,
          brand: 'Tesla',
          car_id: 3,
          model_id: 1,
          color: 'White',
          construction_year: 2025,
          transmission_type: 'automatic',
          can_drive: false
        },
        {
          id: 4,
          brand: 'Ford',
          car_id: 4,
          model_id: 1,
          color: 'Black',
          construction_year: 2024,
          transmission_type: 'manual',
          can_drive: false
        },
        {
          id: 5,
          brand: 'Toyota',
          car_id: 1,
          model_id: 2,
          color: 'Red',
          construction_year: 2024,
          transmission_type: 'automatic',
          can_drive: true
        },
        {
          id: 6,
          brand: 'Chevrolet',
          car_id: 5,
          model_id: 1,
          color: 'Gray',
          construction_year: 2023,
          transmission_type: 'automatic',
          can_drive: false
        }
      ];
      
      setModels(mockModels);
      setFilteredModels(mockModels);
      
      // Extract unique brands for filter
      const uniqueBrands = Array.from(new Set(mockModels.map(model => model.brand)));
      setBrands(uniqueBrands);
      
      setLoading(false);
    };
    
    fetchModels();
  }, []);

  useEffect(() => {
    let result = [...models];
    
    // Apply filter based on can_drive status
    if (filter === 'can-drive') {
      result = result.filter(model => model.can_drive);
    } else if (filter === 'cannot-drive') {
      result = result.filter(model => !model.can_drive);
    }
    
    // Apply brand filter
    if (selectedBrand) {
      result = result.filter(model => model.brand === selectedBrand);
    }
    
    // Apply search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(model => 
        model.brand.toLowerCase().includes(term) ||
        model.color.toLowerCase().includes(term) ||
        model.construction_year.toString().includes(term) ||
        model.transmission_type.toLowerCase().includes(term)
      );
    }
    
    setFilteredModels(result);
  }, [filter, searchTerm, selectedBrand, models]);

  const handleRequestAccess = async (modelId: number) => {
    // In a real app, make an API call to request access
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    alert(`Access request sent for model #${modelId}`);
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
        <h2 className="text-xl font-semibold text-gray-800">Car Models</h2>
        <p className="text-sm text-gray-500 mt-1">
          Browse available car models and request access to drive them
        </p>
      </div>
      
      {/* Filters */}
      <div className="p-6 border-b bg-gray-50">
        <div className="flex flex-wrap items-center gap-4">
          {/* Status Filter */}
          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            <button
              className={`px-4 py-2 text-sm font-medium transition-colors ${filter === 'all' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setFilter('all')}
            >
              All Models
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium transition-colors ${filter === 'can-drive' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setFilter('can-drive')}
            >
              Can Drive
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium transition-colors ${filter === 'cannot-drive' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setFilter('cannot-drive')}
            >
              Cannot Drive
            </button>
          </div>
          
          {/* Brand Filter */}
          <div className="flex items-center">
            <label htmlFor="brand-filter" className="text-sm font-medium text-gray-700 mr-2">
              Brand:
            </label>
            <select
              id="brand-filter"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>
          
          {/* Search */}
          <div className="flex-1 min-w-64">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search models..."
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
      
      {/* Models Grid */}
      <div className="p-6">
        {filteredModels.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500">No car models match your filters.</p>
            <button
              onClick={() => {
                setFilter('all');
                setSearchTerm('');
                setSelectedBrand('');
              }}
              className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModels.map((model) => (
              <div
                key={model.id}
                className={`border rounded-lg p-5 hover:shadow-md transition-all 
                  ${model.can_drive ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">{model.brand}</h3>
                    <p className="text-sm text-gray-600">
                      Model ID: {model.model_id} | Car ID: {model.car_id}
                    </p>
                  </div>
                  <div>
                    {model.can_drive ? (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                        Can Drive
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full font-medium">
                        Cannot Drive
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Color:</span>
                    <span className="ml-1 text-gray-700">{model.color}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Year:</span>
                    <span className="ml-1 text-gray-700">{model.construction_year}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Transmission:</span>
                    <span className="ml-1 text-gray-700 capitalize">{model.transmission_type}</span>
                  </div>
                </div>
                
                <div className="mt-5">
                  {model.can_drive ? (
                    <div className="bg-green-50 border border-green-200 rounded-md p-3 text-sm text-green-800">
                      You are registered to drive this car model
                    </div>
                  ) : (
                    <button
                      onClick={() => handleRequestAccess(model.id)}
                      className="w-full py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Request Access
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