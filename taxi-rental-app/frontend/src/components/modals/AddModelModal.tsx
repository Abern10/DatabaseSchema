// src/components/modals/AddModelModal.tsx
'use client';

import { useState, FormEvent, useEffect } from 'react';

interface AddModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  selectedBrand?: string;
  selectedCarId?: number;
}

export default function AddModelModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  selectedBrand = '',
  selectedCarId
}: AddModelModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // If no brand is selected, allow user to select one
  const [brands, setBrands] = useState<string[]>([]);
  const [brand, setBrand] = useState(selectedBrand);
  const [carId, setCarId] = useState<number | undefined>(selectedCarId);
  
  // Form state
  const [modelId, setModelId] = useState<number | ''>('');
  const [color, setColor] = useState('');
  const [constructionYear, setConstructionYear] = useState<number | ''>('');
  const [transmissionType, setTransmissionType] = useState<'manual' | 'automatic'>('automatic');

  // Form validation state
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Color options with their hex values
  const colorOptions = [
    { name: 'Silver', hex: '#C0C0C0' },
    { name: 'Blue', hex: '#1E40AF' },
    { name: 'Red', hex: '#DC2626' },
    { name: 'Black', hex: '#1F2937' },
    { name: 'White', hex: '#F9FAFB' },
    { name: 'Gray', hex: '#6B7280' },
  ];

  // Load available brands if none are selected
  useEffect(() => {
    if (!selectedBrand && !selectedCarId) {
      // In a real app, fetch brands from API
      // Mock data for now
      setBrands(['Toyota', 'Honda', 'Tesla', 'Ford', 'Chevrolet']);
    }
  }, [selectedBrand, selectedCarId]);

  // Update brand and carId when props change
  useEffect(() => {
    setBrand(selectedBrand);
    setCarId(selectedCarId);
  }, [selectedBrand, selectedCarId]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!brand) errors.brand = 'Car brand is required';
    if (modelId === '') errors.modelId = 'Model ID is required';
    else if (typeof modelId === 'number' && modelId < 1) {
      errors.modelId = 'Model ID must be a positive number';
    }
    
    if (!color) errors.color = 'Color is required';
    
    if (constructionYear === '') errors.constructionYear = 'Construction year is required';
    else if (typeof constructionYear === 'number') {
      const currentYear = new Date().getFullYear();
      if (constructionYear < 2000 || constructionYear > currentYear + 1) {
        errors.constructionYear = `Year must be between 2000 and ${currentYear + 1}`;
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    
    try {
      // In a real app, make an API call to add the model
      // For example:
      // const modelData = {
      //   brand,
      //   carId,
      //   modelId,
      //   color,
      //   constructionYear,
      //   transmissionType
      // };
      //
      // const response = await fetch('/api/models', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(modelData)
      // });
      
      // Mock API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form
      setModelId('');
      setColor('');
      setConstructionYear('');
      setTransmissionType('automatic');
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Close the modal
      onClose();
    } catch (err) {
      setError('Failed to add model. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form
    setModelId('');
    setColor('');
    setConstructionYear('');
    setTransmissionType('automatic');
    setFormErrors({});
    setError('');
    
    // Close the modal
    onClose();
  };

  // Get current year and available years
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2000 + 2 }, (_, i) => currentYear - i + 1).reverse();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-grey bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {selectedBrand 
              ? `Add New Model to ${selectedBrand}` 
              : 'Add New Model'
            }
          </h2>
          <button 
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Car Selection (if not already selected) */}
            {!selectedBrand && (
              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                  Car Brand*
                </label>
                <select
                  id="brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className={`w-full px-3 py-2 border ${formErrors.brand ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                >
                  <option value="">Select a brand</option>
                  {brands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                {formErrors.brand && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.brand}</p>
                )}
              </div>
            )}
            
            {/* Model Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Model Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="modelId" className="block text-sm font-medium text-gray-700 mb-1">
                    Model ID*
                  </label>
                  <input
                    id="modelId"
                    type="number"
                    min="1"
                    value={modelId}
                    onChange={(e) => setModelId(e.target.value ? parseInt(e.target.value) : '')}
                    className={`w-full px-3 py-2 border ${formErrors.modelId ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    placeholder="1"
                  />
                  {formErrors.modelId && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.modelId}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                    Color*
                  </label>
                  <select
                    id="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className={`w-full px-3 py-2 border ${formErrors.color ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  >
                    <option value="">Select a color</option>
                    {colorOptions.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.color && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.color}</p>
                  )}
                  
                  {/* Show color preview */}
                  {color && (
                    <div className="mt-2 flex items-center">
                      <div 
                        className="h-6 w-6 rounded-full mr-2 border border-gray-300" 
                        style={{ 
                          backgroundColor: colorOptions.find(c => c.name === color)?.hex || '#FFFFFF' 
                        }}
                      ></div>
                      <span className="text-sm text-gray-700">{color}</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <label htmlFor="constructionYear" className="block text-sm font-medium text-gray-700 mb-1">
                    Construction Year*
                  </label>
                  <select
                    id="constructionYear"
                    value={constructionYear}
                    onChange={(e) => setConstructionYear(e.target.value ? parseInt(e.target.value) : '')}
                    className={`w-full px-3 py-2 border ${formErrors.constructionYear ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  >
                    <option value="">Select year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  {formErrors.constructionYear && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.constructionYear}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="transmissionType" className="block text-sm font-medium text-gray-700 mb-1">
                    Transmission Type
                  </label>
                  <div className="flex space-x-4 mt-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio h-4 w-4 text-indigo-600"
                        checked={transmissionType === 'automatic'}
                        onChange={() => setTransmissionType('automatic')}
                      />
                      <span className="ml-2 text-sm text-gray-700">Automatic</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio h-4 w-4 text-indigo-600"
                        checked={transmissionType === 'manual'}
                        onChange={() => setTransmissionType('manual')}
                      />
                      <span className="ml-2 text-sm text-gray-700">Manual</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300"
                disabled={loading}
              >
                {loading ? 'Adding Model...' : 'Add Model'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}