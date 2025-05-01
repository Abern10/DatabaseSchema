// src/app/(dashboard)/client/profile/page.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { getClientAddresses, getClientCreditCards, addClientAddress, removeClientAddress, addClientCreditCard, removeClientCreditCard } from '@/lib/api';

type Address = {
  road_name: string;
  number: number;
  city: string;
};

type CreditCard = {
  card_number: string;
  road_name: string;
  number: number;
  city: string;
};

export default function ClientProfile() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  // UI states
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  
  // Form states
  const [newAddress, setNewAddress] = useState<Address>({
    road_name: '',
    number: 0,
    city: ''
  });
  
  const [newCard, setNewCard] = useState({
    card_number: '',
    payment_address: {
      road_name: '',
      number: 0,
      city: ''
    }
  });
  
  const [useExistingAddress, setUseExistingAddress] = useState(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  
  // Form submission states
  const [submittingAddress, setSubmittingAddress] = useState(false);
  const [submittingCard, setSubmittingCard] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Load user's addresses and credit cards
      loadUserData(parsedUser.email);
    } else {
      setLoading(false);
      setError("User not found. Please log in again.");
    }
  }, []);

  // Copy address data when using existing address
  useEffect(() => {
    if (useExistingAddress && addresses && addresses.length > 0) {
      const selectedAddress = addresses[selectedAddressIndex];
      setNewCard({
        ...newCard,
        payment_address: {
          road_name: selectedAddress.road_name,
          number: selectedAddress.number,
          city: selectedAddress.city
        }
      });
    }
  }, [useExistingAddress, selectedAddressIndex, addresses]);

  const loadUserData = async (email: string) => {
    try {
      setLoading(true);
      
      // Get addresses
      const addressesResponse = await getClientAddresses(email);
      if (addressesResponse.success && addressesResponse.data) {
        setAddresses(addressesResponse.data);
      } else {
        console.error('Failed to load addresses:', addressesResponse.error);
      }
      
      // Get credit cards
      const cardsResponse = await getClientCreditCards(email);
      if (cardsResponse.success && cardsResponse.data) {
        setCreditCards(cardsResponse.data);
      } else {
        console.error('Failed to load credit cards:', cardsResponse.error);
      }
      
    } catch (err) {
      console.error('Error loading profile data:', err);
      setError('Failed to load profile data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const validateAddressForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!newAddress.road_name.trim()) {
      errors.road_name = 'Road name is required';
    }
    
    if (!newAddress.number || newAddress.number <= 0) {
      errors.number = 'Valid number is required';
    }
    
    if (!newAddress.city.trim()) {
      errors.city = 'City is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateCardForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!newCard.card_number.trim()) {
      errors.card_number = 'Card number is required';
    } else if (!/^\d{16}$/.test(newCard.card_number.replace(/\s/g, ''))) {
      errors.card_number = 'Card number must be 16 digits';
    }
    
    // Only validate payment address fields if not using existing address
    if (!useExistingAddress) {
      if (!newCard.payment_address.road_name.trim()) {
        errors.payment_road_name = 'Road name is required';
      }
      
      if (!newCard.payment_address.number || newCard.payment_address.number <= 0) {
        errors.payment_number = 'Valid number is required';
      }
      
      if (!newCard.payment_address.city.trim()) {
        errors.payment_city = 'City is required';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddAddress = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateAddressForm()) return;
    if (!user?.email) return;
    
    setSubmittingAddress(true);
    setError(null);
    
    try {
      // Use API function to add address
      const response = await addClientAddress(user.email, newAddress);
      
      if (response.success) {
        // Update local state with the new address
        setAddresses([...addresses, newAddress]);
        
        // Reset form
        setNewAddress({ road_name: '', number: 0, city: '' });
        setShowAddAddress(false);
      } else {
        setError(response.error || 'Failed to add address');
      }
    } catch (err) {
      console.error('Error adding address:', err);
      setError('An error occurred while adding the address. Please try again.');
    } finally {
      setSubmittingAddress(false);
    }
  };

  const handleAddCard = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateCardForm()) return;
    if (!user?.email) return;
    
    setSubmittingCard(true);
    setError(null);
    
    try {
      // Use API function to add credit card
      const response = await addClientCreditCard(user.email, {
        card_number: newCard.card_number.replace(/\s/g, ''), // Remove spaces
        payment_address: newCard.payment_address
      });
      
      if (response.success) {
        // Update local state with the new card
        setCreditCards([...creditCards, {
          card_number: newCard.card_number,
          road_name: newCard.payment_address.road_name,
          number: newCard.payment_address.number,
          city: newCard.payment_address.city
        }]);
        
        // Reset form
        setNewCard({
          card_number: '',
          payment_address: {
            road_name: '',
            number: 0,
            city: ''
          }
        });
        setUseExistingAddress(false);
        setShowAddCard(false);
      } else {
        setError(response.error || 'Failed to add credit card');
      }
    } catch (err) {
      console.error('Error adding credit card:', err);
      setError('An error occurred while adding the credit card. Please try again.');
    } finally {
      setSubmittingCard(false);
    }
  };

  const handleRemoveAddress = async (index: number) => {
    if (!user?.email) return;
    
    try {
      const addressToRemove = addresses[index];
      
      // Use API function to remove address
      const response = await removeClientAddress(user.email, addressToRemove);
      
      if (response.success) {
        // Update local state
        const updatedAddresses = [...addresses];
        updatedAddresses.splice(index, 1);
        setAddresses(updatedAddresses);
      } else {
        setError(response.error || 'Failed to remove address');
      }
    } catch (err) {
      console.error('Error removing address:', err);
      setError('An error occurred while removing the address. Please try again.');
    }
  };

  const handleRemoveCard = async (index: number) => {
    if (!user?.email) return;
    
    try {
      const cardToRemove = creditCards[index];
      
      // Use API function to remove credit card
      const response = await removeClientCreditCard(user.email, cardToRemove.card_number.replace(/\s/g, ''));
      
      if (response.success) {
        // Update local state
        const updatedCards = [...creditCards];
        updatedCards.splice(index, 1);
        setCreditCards(updatedCards);
      } else {
        setError(response.error || 'Failed to remove credit card');
      }
    } catch (err) {
      console.error('Error removing credit card:', err);
      setError('An error occurred while removing the credit card. Please try again.');
    }
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

  if (error && !user) {
    return (
      <div className="text-center text-red-500 p-6 bg-white rounded-xl shadow-md">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}
      
      {/* Personal Information */}
      <div className="bg-white rounded-xl shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Name</h3>
              <p className="mt-1 text-gray-800">{user?.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="mt-1 text-gray-800">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Addresses */}
      <div className="bg-white rounded-xl shadow-md">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">My Addresses</h2>
          <button
            onClick={() => setShowAddAddress(!showAddAddress)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors shadow-md font-medium"
          >
            {showAddAddress ? 'Cancel' : 'Add Address'}
          </button>
        </div>
        <div className="p-6">
          {showAddAddress && (
            <div className="mb-6 p-5 border rounded-lg bg-gray-50">
              <h3 className="font-medium text-gray-800 mb-4">Add New Address</h3>
              <form onSubmit={handleAddAddress} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="road_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Road Name
                  </label>
                  <input
                    type="text"
                    id="road_name"
                    value={newAddress.road_name}
                    onChange={(e) => setNewAddress({ ...newAddress, road_name: e.target.value })}
                    className={`w-full border ${formErrors.road_name ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    required
                  />
                  {formErrors.road_name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.road_name}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
                    Number
                  </label>
                  <input
                    type="number"
                    id="number"
                    value={newAddress.number || ''}
                    onChange={(e) => setNewAddress({ ...newAddress, number: parseInt(e.target.value) || 0 })}
                    className={`w-full border ${formErrors.number ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    required
                  />
                  {formErrors.number && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.number}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className={`w-full border ${formErrors.city ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    required
                  />
                  {formErrors.city && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.city}</p>
                  )}
                </div>
                <div className="md:col-span-3">
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors shadow-md font-medium disabled:bg-indigo-300"
                    disabled={submittingAddress}
                  >
                    {submittingAddress ? 'Saving...' : 'Save Address'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {addresses.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No addresses added yet.
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((address, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-4">
                  <div>
                    <p className="text-gray-800">{address.road_name} {address.number}</p>
                    <p className="text-sm text-gray-500">{address.city}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveAddress(index)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Credit Cards */}
      <div className="bg-white rounded-xl shadow-md">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Payment Methods</h2>
          <button
            onClick={() => setShowAddCard(!showAddCard)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors shadow-md font-medium"
          >
            {showAddCard ? 'Cancel' : 'Add Credit Card'}
          </button>
        </div>
        <div className="p-6">
          {showAddCard && (
            <div className="mb-6 p-5 border rounded-lg bg-gray-50">
              <h3 className="font-medium text-gray-800 mb-4">Add New Credit Card</h3>
              <form onSubmit={handleAddCard} className="space-y-4">
                <div>
                  <label htmlFor="card_number" className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    id="card_number"
                    value={newCard.card_number}
                    onChange={(e) => {
                      // Format card number with spaces
                      const value = e.target.value.replace(/\s/g, '');
                      const formattedValue = value
                        .replace(/[^\d]/g, '')
                        .slice(0, 16)
                        .replace(/(.{4})/g, '$1 ')
                        .trim();
                      
                      setNewCard({ ...newCard, card_number: formattedValue });
                    }}
                    placeholder="1234 5678 9012 3456"
                    className={`w-full border ${formErrors.card_number ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    required
                  />
                  {formErrors.card_number && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.card_number}</p>
                  )}
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Billing Address</h4>
                  
                  {addresses.length > 0 && (
                    <div className="mb-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={useExistingAddress}
                          onChange={(e) => setUseExistingAddress(e.target.checked)}
                        />
                        <span className="ml-2 text-sm text-gray-700">Use existing address</span>
                      </label>
                      
                      {useExistingAddress && (
                        <div className="mt-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select address
                          </label>
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            value={selectedAddressIndex}
                            onChange={(e) => setSelectedAddressIndex(parseInt(e.target.value))}
                          >
                            {addresses.map((address, index) => (
                              <option key={index} value={index}>
                                {address.road_name} {address.number}, {address.city}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${useExistingAddress ? 'opacity-50' : ''}`}>
                    <div>
                      <label htmlFor="pa_road_name" className="block text-sm font-medium text-gray-700 mb-1">
                        Road Name
                      </label>
                      <input
                        type="text"
                        id="pa_road_name"
                        value={newCard.payment_address.road_name}
                        onChange={(e) => setNewCard({
                          ...newCard,
                          payment_address: {
                            ...newCard.payment_address,
                            road_name: e.target.value
                          }
                        })}
                        className={`w-full border ${formErrors.payment_road_name ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                        required
                        disabled={useExistingAddress}
                      />
                      {formErrors.payment_road_name && !useExistingAddress && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.payment_road_name}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="pa_number" className="block text-sm font-medium text-gray-700 mb-1">
                        Number
                      </label>
                      <input
                        type="number"
                        id="pa_number"
                        value={newCard.payment_address.number || ''}
                        onChange={(e) => setNewCard({
                          ...newCard,
                          payment_address: {
                            ...newCard.payment_address,
                            number: parseInt(e.target.value) || 0
                          }
                        })}
                        className={`w-full border ${formErrors.payment_number ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                        required
                        disabled={useExistingAddress}
                      />
                      {formErrors.payment_number && !useExistingAddress && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.payment_number}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="pa_city" className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        id="pa_city"
                        value={newCard.payment_address.city}
                        onChange={(e) => setNewCard({
                          ...newCard,
                          payment_address: {
                            ...newCard.payment_address,
                            city: e.target.value
                          }
                        })}
                        className={`w-full border ${formErrors.payment_city ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                        required
                        disabled={useExistingAddress}
                      />
                      {formErrors.payment_city && !useExistingAddress && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.payment_city}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors shadow-md font-medium disabled:bg-indigo-300"
                    disabled={submittingCard}
                  >
                    {submittingCard ? 'Saving...' : 'Save Card'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {creditCards.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No payment methods added yet.
            </div>
          ) : (
            <div className="space-y-4">
              {creditCards.map((card, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-4">
                  <div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <p className="text-gray-800">
                        •••• •••• •••• {card.card_number.slice(-4)}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {card.road_name} {card.number}, {card.city}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveCard(index)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}