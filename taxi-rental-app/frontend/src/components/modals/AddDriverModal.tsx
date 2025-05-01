// src/components/modals/AddDriverModal.tsx
'use client';

import { useState, FormEvent } from 'react';

type Address = {
  road_name: string;
  number: number | null;
  city: string;
};

interface AddDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddDriverModal({ isOpen, onClose, onSuccess }: AddDriverModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form state
  const [driverName, setDriverName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseExpiry, setLicenseExpiry] = useState('');
  const [address, setAddress] = useState<Address>({
    road_name: '',
    number: null,
    city: ''
  });

  // Form validation state
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!driverName.trim()) errors.driverName = 'Driver name is required';
    if (!email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Email is invalid';
    
    if (!phone.trim()) errors.phone = 'Phone number is required';
    if (!licenseNumber.trim()) errors.licenseNumber = 'License number is required';
    if (!licenseExpiry.trim()) errors.licenseExpiry = 'License expiry date is required';
    
    // Address validation
    if (!address.road_name.trim()) errors.road_name = 'Road name is required';
    if (!address.number) errors.number = 'Street number is required';
    if (!address.city.trim()) errors.city = 'City is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    
    try {
      // In a real app, make an API call to add the driver
      // For example:
      // const response = await fetch('/api/drivers', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     name: driverName,
      //     email,
      //     phone,
      //     license_number: licenseNumber,
      //     license_expiry: licenseExpiry,
      //     address
      //   })
      // });
      
      // Mock API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form
      setDriverName('');
      setEmail('');
      setPhone('');
      setLicenseNumber('');
      setLicenseExpiry('');
      setAddress({
        road_name: '',
        number: null,
        city: ''
      });
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Close the modal
      onClose();
    } catch (err) {
      setError('Failed to add driver. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form
    setDriverName('');
    setEmail('');
    setPhone('');
    setLicenseNumber('');
    setLicenseExpiry('');
    setAddress({
      road_name: '',
      number: null,
      city: ''
    });
    setFormErrors({});
    setError('');
    
    // Close the modal
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-grey bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Add New Driver</h2>
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
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="driverName" className="block text-sm font-medium text-gray-700 mb-1">
                    Driver Name*
                  </label>
                  <input
                    id="driverName"
                    type="text"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    className={`w-full px-3 py-2 border ${formErrors.driverName ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    placeholder="John Smith"
                  />
                  {formErrors.driverName && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.driverName}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email*
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-3 py-2 border ${formErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    placeholder="john.smith@example.com"
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number*
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full px-3 py-2 border ${formErrors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    placeholder="+1 (555) 123-4567"
                  />
                  {formErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    License Number*
                  </label>
                  <input
                    id="licenseNumber"
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className={`w-full px-3 py-2 border ${formErrors.licenseNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    placeholder="DL-123456789"
                  />
                  {formErrors.licenseNumber && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.licenseNumber}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="licenseExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                    License Expiry Date*
                  </label>
                  <input
                    id="licenseExpiry"
                    type="date"
                    value={licenseExpiry}
                    onChange={(e) => setLicenseExpiry(e.target.value)}
                    className={`w-full px-3 py-2 border ${formErrors.licenseExpiry ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                  {formErrors.licenseExpiry && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.licenseExpiry}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Address */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="roadName" className="block text-sm font-medium text-gray-700 mb-1">
                    Road Name*
                  </label>
                  <input
                    id="roadName"
                    type="text"
                    value={address.road_name}
                    onChange={(e) => setAddress({ ...address, road_name: e.target.value })}
                    className={`w-full px-3 py-2 border ${formErrors.road_name ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    placeholder="Main Street"
                  />
                  {formErrors.road_name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.road_name}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
                    Number*
                  </label>
                  <input
                    id="number"
                    type="number"
                    value={address.number || ''}
                    onChange={(e) => setAddress({ ...address, number: e.target.value ? parseInt(e.target.value) : null })}
                    className={`w-full px-3 py-2 border ${formErrors.number ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    placeholder="123"
                  />
                  {formErrors.number && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.number}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City*
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className={`w-full px-3 py-2 border ${formErrors.city ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    placeholder="New York"
                  />
                  {formErrors.city && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.city}</p>
                  )}
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
                {loading ? 'Adding Driver...' : 'Add Driver'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}