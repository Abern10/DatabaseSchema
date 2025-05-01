// src/app/(dashboard)/client/profile/page.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';

type Address = {
  id: number;
  road_name: string;
  number: number;
  city: string;
};

type CreditCard = {
  id: number;
  card_number: string;
  payment_address: {
    road_name: string;
    number: number;
    city: string;
  };
};

type ClientProfile = {
  name: string;
  email: string;
  addresses: Address[];
  creditCards: CreditCard[];
};

export default function ClientProfile() {
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
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

  useEffect(() => {
    // In a real app, fetch this data from your API
    const fetchProfile = async () => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      const mockProfile: ClientProfile = {
        name: 'Alice Johnson',
        email: 'alice.johnson@example.com',
        addresses: [
          {
            id: 1,
            road_name: 'Main St',
            number: 123,
            city: 'New York'
          },
          {
            id: 2,
            road_name: 'Park Ave',
            number: 456,
            city: 'Los Angeles'
          }
        ],
        creditCards: [
          {
            id: 1,
            card_number: '**** **** **** 1234',
            payment_address: {
              road_name: 'Main St',
              number: 123,
              city: 'New York'
            }
          },
          {
            id: 2,
            card_number: '**** **** **** 5678',
            payment_address: {
              road_name: 'Park Ave',
              number: 456,
              city: 'Los Angeles'
            }
          }
        ]
      };
      
      setProfile(mockProfile);
      setLoading(false);
    };
    
    fetchProfile();
  }, []);

  // Copy address data when using existing address
  useEffect(() => {
    if (useExistingAddress && profile?.addresses && profile.addresses.length > 0) {
      const selectedAddress = profile.addresses[selectedAddressIndex];
      setNewCard({
        ...newCard,
        payment_address: {
          road_name: selectedAddress.road_name,
          number: selectedAddress.number,
          city: selectedAddress.city
        }
      });
    }
  }, [useExistingAddress, selectedAddressIndex, profile?.addresses]);

  const handleAddAddress = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!profile) return;
    
    // In a real app, make an API call to add the address
    // For example:
    // const response = await fetch('/api/addresses', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(newAddress)
    // });
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update local state
    const newId = Math.max(...profile.addresses.map(a => a.id)) + 1;
    setProfile({
      ...profile,
      addresses: [...profile.addresses, { id: newId, ...newAddress }]
    });
    
    // Reset form
    setNewAddress({ road_name: '', number: 0, city: '' });
    setShowAddAddress(false);
  };

  const handleAddCard = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!profile) return;
    
    // In a real app, make an API call to add the card
    // For example:
    // const response = await fetch('/api/credit-cards', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(newCard)
    // });
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update local state
    const newId = Math.max(...profile.creditCards.map(c => c.id)) + 1;
    setProfile({
      ...profile,
      creditCards: [...profile.creditCards, { id: newId, ...newCard }]
    });
    
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
  };

  const handleRemoveAddress = async (id: number) => {
    if (!profile) return;
    
    // In a real app, make an API call to remove the address
    // For example:
    // await fetch(`/api/addresses/${id}`, {
    //   method: 'DELETE'
    // });
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update local state
    setProfile({
      ...profile,
      addresses: profile.addresses.filter(a => a.id !== id)
    });
  };

  const handleRemoveCard = async (id: number) => {
    if (!profile) return;
    
    // In a real app, make an API call to remove the card
    // For example:
    // await fetch(`/api/credit-cards/${id}`, {
    //   method: 'DELETE'
    // });
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update local state
    setProfile({
      ...profile,
      creditCards: profile.creditCards.filter(c => c.id !== id)
    });
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

  if (!profile) {
    return (
      <div className="text-center text-red-500 p-6 bg-white rounded-xl shadow-md">
        Failed to load profile
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Name</h3>
              <p className="mt-1 text-gray-800">{profile.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="mt-1 text-gray-800">{profile.email}</p>
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="md:col-span-3">
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors shadow-md font-medium"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {profile.addresses.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No addresses added yet.
            </div>
          ) : (
            <div className="space-y-4">
              {profile.addresses.map((address) => (
                <div key={address.id} className="flex justify-between items-center border-b pb-4">
                  <div>
                    <p className="text-gray-800">{address.road_name} {address.number}</p>
                    <p className="text-sm text-gray-500">{address.city}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveAddress(address.id)}
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
                    onChange={(e) => setNewCard({ ...newCard, card_number: e.target.value })}
                    placeholder="**** **** **** ****"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Billing Address</h4>
                  
                  {profile.addresses.length > 0 && (
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
                            {profile.addresses.map((address, index) => (
                              <option key={address.id} value={index}>
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
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                        disabled={useExistingAddress}
                      />
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
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                        disabled={useExistingAddress}
                      />
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
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                        disabled={useExistingAddress}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors shadow-md font-medium"
                  >
                    Save Card
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {profile.creditCards.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No payment methods added yet.
            </div>
          ) : (
            <div className="space-y-4">
              {profile.creditCards.map((card) => (
                <div key={card.id} className="flex justify-between items-center border-b pb-4">
                  <div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <p className="text-gray-800">{card.card_number}</p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {card.payment_address.road_name} {card.payment_address.number}, {card.payment_address.city}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveCard(card.id)}
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