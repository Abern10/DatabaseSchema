// src/app/(dashboard)/manager/cars/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AddCarModal from '@/components/modals/AddCarModal';
import AddModelModal from '@/components/modals/AddModelModal';

type Car = {
  id: number;
  brand: string;
  totalModels: number;
  models: {
    id: number;
    modelId: number;
    color: string;
    constructionYear: number;
    transmissionType: 'manual' | 'automatic';
    ridesCount: number;
  }[];
};

export default function ManagerCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCarId, setExpandedCarId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);
  const [modelToDelete, setModelToDelete] = useState<{carId: number, modelId: number} | null>(null);
  
  // Modal states
  const [showAddCarModal, setShowAddCarModal] = useState(false);
  const [showAddModelModal, setShowAddModelModal] = useState(false);
  const [selectedCarForModel, setSelectedCarForModel] = useState<{id: number, brand: string} | null>(null);

  useEffect(() => {
    // In a real app, fetch this data from your API
    const fetchCars = async () => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      const mockCars: Car[] = [
        {
          id: 1,
          brand: 'Toyota',
          totalModels: 3,
          models: [
            {
              id: 1,
              modelId: 1,
              color: 'Silver',
              constructionYear: 2023,
              transmissionType: 'automatic',
              ridesCount: 156
            },
            {
              id: 2,
              modelId: 2,
              color: 'Blue',
              constructionYear: 2022,
              transmissionType: 'manual',
              ridesCount: 134
            },
            {
              id: 3,
              modelId: 3,
              color: 'Red',
              constructionYear: 2024,
              transmissionType: 'automatic',
              ridesCount: 98
            }
          ]
        },
        {
          id: 2,
          brand: 'Honda',
          totalModels: 2,
          models: [
            {
              id: 4,
              modelId: 1,
              color: 'Black',
              constructionYear: 2023,
              transmissionType: 'automatic',
              ridesCount: 143
            },
            {
              id: 5,
              modelId: 2,
              color: 'White',
              constructionYear: 2024,
              transmissionType: 'manual',
              ridesCount: 87
            }
          ]
        },
        {
          id: 3,
          brand: 'Tesla',
          totalModels: 2,
          models: [
            {
              id: 6,
              modelId: 1,
              color: 'White',
              constructionYear: 2024,
              transmissionType: 'automatic',
              ridesCount: 165
            },
            {
              id: 7,
              modelId: 2,
              color: 'Black',
              constructionYear: 2025,
              transmissionType: 'automatic',
              ridesCount: 91
            }
          ]
        },
        {
          id: 4,
          brand: 'Ford',
          totalModels: 1,
          models: [
            {
              id: 8,
              modelId: 1,
              color: 'Blue',
              constructionYear: 2022,
              transmissionType: 'manual',
              ridesCount: 76
            }
          ]
        },
        {
          id: 5,
          brand: 'Chevrolet',
          totalModels: 2,
          models: [
            {
              id: 9,
              modelId: 1,
              color: 'Red',
              constructionYear: 2023,
              transmissionType: 'automatic',
              ridesCount: 112
            },
            {
              id: 10,
              modelId: 2,
              color: 'Gray',
              constructionYear: 2024,
              transmissionType: 'manual',
              ridesCount: 67
            }
          ]
        }
      ];
      
      setCars(mockCars);
      setFilteredCars(mockCars);
      setLoading(false);
    };
    
    fetchCars();
  }, []);

  // Apply filters whenever search term changes
  useEffect(() => {
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      const filtered = cars.filter(car => 
        car.brand.toLowerCase().includes(term) ||
        car.models.some(model => 
          model.color.toLowerCase().includes(term) ||
          model.constructionYear.toString().includes(term) ||
          model.transmissionType.toLowerCase().includes(term)
        )
      );
      setFilteredCars(filtered);
    } else {
      setFilteredCars(cars);
    }
  }, [searchTerm, cars]);

  const toggleExpandCar = (id: number) => {
    if (expandedCarId === id) {
      setExpandedCarId(null);
    } else {
      setExpandedCarId(id);
    }
  };

  const handleDeleteCar = (car: Car) => {
    setCarToDelete(car);
    setModelToDelete(null);
    setShowDeleteModal(true);
  };

  const handleDeleteModel = (carId: number, modelId: number) => {
    setCarToDelete(null);
    setModelToDelete({ carId, modelId });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      // In a real app, make an API call to delete the car or model
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      if (carToDelete) {
        setCars(cars.filter(c => c.id !== carToDelete.id));
      } else if (modelToDelete) {
        const updatedCars = cars.map(car => {
          if (car.id === modelToDelete.carId) {
            const updatedModels = car.models.filter(model => model.id !== modelToDelete.modelId);
            return {
              ...car,
              models: updatedModels,
              totalModels: updatedModels.length
            };
          }
          return car;
        });
        
        // If no models left for this car, remove the car as well
        const filteredCars = updatedCars.filter(car => car.totalModels > 0);
        
        setCars(filteredCars);
      }
      
      setShowDeleteModal(false);
      setCarToDelete(null);
      setModelToDelete(null);
      
      // Show success message (in a real app)
    } catch (err) {
      // Handle error (in a real app)
      console.error('Error deleting:', err);
    }
  };

  const getTotalRidesForCar = (car: Car) => {
    return car.models.reduce((sum, model) => sum + model.ridesCount, 0);
  };
  
  const handleCarAdded = () => {
    // In a real app, refetch cars or update the state with the new car
    // For now, we'll just add a mock car
    const newCar: Car = {
      id: cars.length + 1,
      brand: 'New Car Brand',
      totalModels: 1,
      models: [
        {
          id: 100,
          modelId: 1,
          color: 'Black',
          constructionYear: 2025,
          transmissionType: 'automatic',
          ridesCount: 0
        }
      ]
    };
    
    setCars([...cars, newCar]);
  };
  
  const handleAddModel = (carId: number, brand: string) => {
    setSelectedCarForModel({ id: carId, brand });
    setShowAddModelModal(true);
  };
  
  const handleModelAdded = () => {
    // In a real app, refetch cars or update the state with the new model
    if (selectedCarForModel) {
      const updatedCars = cars.map(car => {
        if (car.id === selectedCarForModel.id) {
          const newModelId = Math.max(...car.models.map(m => m.id)) + 1;
          const newModel = {
            id: newModelId,
            modelId: car.models.length + 1,
            color: 'Silver',
            constructionYear: 2025,
            transmissionType: 'automatic' as const,
            ridesCount: 0
          };
          
          return {
            ...car,
            totalModels: car.totalModels + 1,
            models: [...car.models, newModel]
          };
        }
        return car;
      });
      
      setCars(updatedCars);
    }
  };
  
  const handleAddModelToCar = (brand: string, carId: number) => {
    setSelectedCarForModel({ id: carId, brand });
    setShowAddModelModal(true);
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
        <h2 className="text-xl font-semibold text-gray-800">Manage Cars</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowAddModelModal(true)}
            className="bg-white border border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors"
          >
            Add New Model
          </button>
          <button 
            onClick={() => setShowAddCarModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-md"
          >
            Add New Car
          </button>
        </div>
      </div>
      
      {/* Search */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="relative max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search cars by brand, color, year..."
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
      
      {/* Cars List */}
      {filteredCars.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <p className="text-gray-500">No cars found matching your search criteria.</p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCars.map((car) => (
            <div key={car.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Car Header */}
              <div 
                className="p-6 border-b flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleExpandCar(car.id)}
              >
                <div className="flex items-center">
                  <div className="mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{car.brand}</h3>
                    <p className="text-sm text-gray-600">
                      {car.totalModels} {car.totalModels === 1 ? 'Model' : 'Models'} | 
                      {' '}{getTotalRidesForCar(car)} Total Rides
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCar(car);
                    }}
                    className="text-red-600 hover:text-red-800 mr-4 transition-colors"
                  >
                    Delete
                  </button>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 text-gray-400 transition-transform ${expandedCarId === car.id ? 'transform rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {/* Car Models (Expandable) */}
              {expandedCarId === car.id && (
                <div className="p-6 bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-700 mb-4">Available Models</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transmission</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rides</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {car.models.map((model) => (
                          <tr key={model.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{model.modelId}</td>
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
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{model.constructionYear}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">{model.transmissionType}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{model.ridesCount}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <Link 
                                  href={`/manager/models/${model.id}`}
                                  className="text-indigo-600 hover:text-indigo-900 transition-colors"
                                >
                                  Edit
                                </Link>
                                <button
                                  onClick={() => handleDeleteModel(car.id, model.id)}
                                  className="text-red-600 hover:text-red-900 transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button 
                      onClick={() => handleAddModel(car.id, car.brand)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Add Model to {car.brand}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
            {carToDelete && (
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to delete the car brand <span className="font-semibold">{carToDelete.brand}</span> and all its models? 
                This action cannot be undone.
              </p>
            )}
            {modelToDelete && (
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to delete this model? This action cannot be undone.
              </p>
            )}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setCarToDelete(null);
                  setModelToDelete(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Car Modal */}
      <AddCarModal 
        isOpen={showAddCarModal}
        onClose={() => setShowAddCarModal(false)}
        onSuccess={handleCarAdded}
        onAddModel={handleAddModelToCar}
      />
      
      {/* Add Model Modal */}
      <AddModelModal 
        isOpen={showAddModelModal}
        onClose={() => setShowAddModelModal(false)}
        onSuccess={handleModelAdded}
        selectedBrand={selectedCarForModel?.brand || ''}
        selectedCarId={selectedCarForModel?.id}
      />
    </div>
  );
}