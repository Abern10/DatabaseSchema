// src/app/(dashboard)/manager/models/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AddModelModal from '@/components/modals/AddModelModal';

type CarModel = {
  id: number;
  brand: string;
  carId: number;
  modelId: number;
  color: string;
  constructionYear: number;
  transmissionType: 'manual' | 'automatic';
  ridesCount: number;
  driversCount: number;
};

export default function ManagerModels() {
  const [models, setModels] = useState<CarModel[]>([]);
  const [filteredModels, setFilteredModels] = useState<CarModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState<string>('');
  const [yearFilter, setYearFilter] = useState<number | ''>('');
  const [transmissionFilter, setTransmissionFilter] = useState<'manual' | 'automatic' | ''>('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modelToDelete, setModelToDelete] = useState<CarModel | null>(null);
  const [sortBy, setSortBy] = useState<'brand' | 'year' | 'rides'>('brand');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Add model modal
  const [showAddModelModal, setShowAddModelModal] = useState(false);

  // Derive unique values for filters
  const brands = models.length > 0 
    ? Array.from(new Set(models.map(model => model.brand))).sort()
    : [];
  
  const years = models.length > 0 
    ? Array.from(new Set(models.map(model => model.constructionYear))).sort((a, b) => b - a)
    : [];

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
          carId: 1,
          modelId: 1,
          color: 'Silver',
          constructionYear: 2023,
          transmissionType: 'automatic',
          ridesCount: 156,
          driversCount: 8
        },
        {
          id: 2,
          brand: 'Toyota',
          carId: 1,
          modelId: 2,
          color: 'Blue',
          constructionYear: 2022,
          transmissionType: 'manual',
          ridesCount: 134,
          driversCount: 5
        },
        {
          id: 3,
          brand: 'Toyota',
          carId: 1,
          modelId: 3,
          color: 'Red',
          constructionYear: 2024,
          transmissionType: 'automatic',
          ridesCount: 98,
          driversCount: 6
        },
        {
          id: 4,
          brand: 'Honda',
          carId: 2,
          modelId: 1,
          color: 'Black',
          constructionYear: 2023,
          transmissionType: 'automatic',
          ridesCount: 143,
          driversCount: 7
        },
        {
          id: 5,
          brand: 'Honda',
          carId: 2,
          modelId: 2,
          color: 'White',
          constructionYear: 2024,
          transmissionType: 'manual',
          ridesCount: 87,
          driversCount: 4
        },
        {
          id: 6,
          brand: 'Tesla',
          carId: 3,
          modelId: 1,
          color: 'White',
          constructionYear: 2024,
          transmissionType: 'automatic',
          ridesCount: 165,
          driversCount: 9
        },
        {
          id: 7,
          brand: 'Tesla',
          carId: 3,
          modelId: 2,
          color: 'Black',
          constructionYear: 2025,
          transmissionType: 'automatic',
          ridesCount: 91,
          driversCount: 5
        },
        {
          id: 8,
          brand: 'Ford',
          carId: 4,
          modelId: 1,
          color: 'Blue',
          constructionYear: 2022,
          transmissionType: 'manual',
          ridesCount: 76,
          driversCount: 3
        },
        {
          id: 9,
          brand: 'Chevrolet',
          carId: 5,
          modelId: 1,
          color: 'Red',
          constructionYear: 2023,
          transmissionType: 'automatic',
          ridesCount: 112,
          driversCount: 6
        },
        {
          id: 10,
          brand: 'Chevrolet',
          carId: 5,
          modelId: 2,
          color: 'Gray',
          constructionYear: 2024,
          transmissionType: 'manual',
          ridesCount: 67,
          driversCount: 4
        }
      ];
      
      setModels(mockModels);
      setFilteredModels(mockModels);
      setLoading(false);
    };
    
    fetchModels();
  }, []);

  // Apply filters whenever dependencies change
  useEffect(() => {
    let result = [...models];
    
    // Apply brand filter
    if (brandFilter) {
      result = result.filter(model => model.brand === brandFilter);
    }
    
    // Apply year filter
    if (yearFilter) {
      result = result.filter(model => model.constructionYear === yearFilter);
    }
    
    // Apply transmission filter
    if (transmissionFilter) {
      result = result.filter(model => model.transmissionType === transmissionFilter);
    }
    
    // Apply search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(model => 
        model.brand.toLowerCase().includes(term) ||
        model.color.toLowerCase().includes(term) ||
        model.constructionYear.toString().includes(term) ||
        model.transmissionType.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === 'brand') {
        // Sort by brand first, then by modelId
        const brandComparison = sortOrder === 'asc' 
          ? a.brand.localeCompare(b.brand)
          : b.brand.localeCompare(a.brand);
          
        if (brandComparison !== 0) return brandComparison;
        return a.modelId - b.modelId;
      } else if (sortBy === 'year') {
        return sortOrder === 'asc'
          ? a.constructionYear - b.constructionYear
          : b.constructionYear - a.constructionYear;
      } else { // rides
        return sortOrder === 'asc'
          ? a.ridesCount - b.ridesCount
          : b.ridesCount - a.ridesCount;
      }
    });
    
    setFilteredModels(result);
  }, [models, brandFilter, yearFilter, transmissionFilter, searchTerm, sortBy, sortOrder]);

  const handleDeleteModel = (model: CarModel) => {
    setModelToDelete(model);
    setShowDeleteModal(true);
  };

  const confirmDeleteModel = async () => {
    if (!modelToDelete) return;
    
    try {
      // In a real app, make an API call to delete the model
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setModels(models.filter(m => m.id !== modelToDelete.id));
      setShowDeleteModal(false);
      setModelToDelete(null);
      
      // Show success message (in a real app)
    } catch (err) {
      // Handle error (in a real app)
      console.error('Error deleting model:', err);
    }
  };

  const toggleSort = (field: 'brand' | 'year' | 'rides') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const clearFilters = () => {
    setBrandFilter('');
    setYearFilter('');
    setTransmissionFilter('');
    setSearchTerm('');
  };
  
  const handleModelAdded = () => {
    // In a real app, refetch models or update the state with the new model
    // For now, we'll just add a mock model
    const newModel: CarModel = {
      id: models.length + 1,
      brand: 'Toyota',
      carId: 1,
      modelId: models.filter(m => m.brand === 'Toyota' && m.carId === 1).length + 1,
      color: 'Silver',
      constructionYear: 2025,
      transmissionType: 'automatic',
      ridesCount: 0,
      driversCount: 0
    };
    
    setModels([...models, newModel]);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-md flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Manage Car Models</h2>
        <button 
          onClick={() => setShowAddModelModal(true)} 
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-md"
        >
          Add New Model
        </button>
      </div>
      
      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-4">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search models by brand, color, year..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
          
          {/* Brand Filter */}
          <div>
            <label htmlFor="brand-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Brand
            </label>
            <select
              id="brand-filter"
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>
          
          {/* Year Filter */}
          <div>
            <label htmlFor="year-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <select
              id="year-filter"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value ? parseInt(e.target.value) : '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          
          {/* Transmission Filter */}
          <div>
            <label htmlFor="transmission-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Transmission
            </label>
            <select
              id="transmission-filter"
              value={transmissionFilter}
              onChange={(e) => setTransmissionFilter(e.target.value as 'manual' | 'automatic' | '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="manual">Manual</option>
              <option value="automatic">Automatic</option>
            </select>
          </div>
          
          {/* Clear Filters Button */}
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
      
      {/* Models Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('brand')}
                >
                  <div className="flex items-center">
                    Brand & Model
                    {sortBy === 'brand' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortOrder === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                      </svg>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Color
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('year')}
                >
                  <div className="flex items-center">
                    Year
                    {sortBy === 'year' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortOrder === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                      </svg>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transmission
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Drivers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredModels.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No models found matching your criteria.
                    {(brandFilter || yearFilter || transmissionFilter || searchTerm) && (
                      <button
                        onClick={clearFilters}
                        className="ml-2 text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Clear filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredModels.map((model) => (
                  <tr key={model.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{model.brand}</div>
                      <div className="text-xs text-gray-500">Model ID: {model.modelId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="h-4 w-4 rounded-full mr-2" 
                          style={{ 
                            backgroundColor: 
                              model.color.toLowerCase() === 'silver' ? '#C0C0C0' :
                              model.color.toLowerCase() === 'blue' ? '#1E40AF' :
                              model.color.toLowerCase() === 'red' ? '#DC2626' :
                              model.color.toLowerCase() === 'black' ? '#1F2937' :
                              model.color.toLowerCase() === 'white' ? '#F9FAFB' :
                              model.color.toLowerCase() === 'gray' ? '#6B7280' :
                              '#FFFFFF',
                            border: model.color.toLowerCase() === 'white' ? '1px solid #E5E7EB' : 'none'
                          }}
                        ></div>
                        <span className="text-sm text-gray-700">{model.color}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {model.constructionYear}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">
                      {model.transmissionType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {model.ridesCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {model.driversCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link 
                          href={`/manager/models/${model.id}`}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteModel(model)}
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
      </div>
      
      {/* Delete Modal */}
      {showDeleteModal && modelToDelete && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete this {modelToDelete.brand} model (ID: {modelToDelete.modelId})? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setModelToDelete(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteModel}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Model Modal */}
      <AddModelModal 
        isOpen={showAddModelModal}
        onClose={() => setShowAddModelModal(false)}
        onSuccess={handleModelAdded}
      />
    </div>
  );
}