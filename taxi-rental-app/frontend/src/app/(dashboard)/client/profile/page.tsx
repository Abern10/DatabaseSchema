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
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  if (!profile) {
    return <div className="text-center text-red-500">Failed to load profile</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Personal Information</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Name</h3>
              <p className="mt-1">{profile.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="mt-1">{profile.email}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Addresses */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">My Addresses</h2>
          <button
            onClick={() => setShowAddAddress(!showAddAddress)}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
          >
            {showAddAddress ? 'Cancel' : 'Add Address'}
          </button>
        </div>
        <div className="p-6">
          {showAddAddress && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-semibold mb-3">Add New Address</h3>
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
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                    value={newAddress.number}
                    onChange={(e) => setNewAddress({ ...newAddress, number: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="md:col-span-3">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {profile.addresses.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No addresses added yet.
            </div>
          ) : (
            <div className="space-y-4">
              {profile.addresses.map((address) => (
                <div key={address.id} className="flex justify-between items-center border-b pb-3">
                  <div>
                    <p>{address.road_name} {address.number}</p>
                    <p className="text-sm text-gray-500">{address.city}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveAddress(address.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
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
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Payment Methods</h2>
          <button
            onClick={() => setShowAddCard(!showAddCard)}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
          >
            {showAddCard ? 'Cancel' : 'Add Credit Card'}
          </button>
        </div>
        <div className="p-6">
          {showAddCard && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-semibold mb-3">Add New Credit Card</h3>
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
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Billing Address</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="pa_number" className="block text-sm font-medium text-gray-700 mb-1">
                        Number
                      </label>
                      <input
                        type="number"
                        id="pa_number"
                        value={newCard.payment_address.number}
                        onChange={(e) => setNewCard({
                          ...newCard,
                          payment_address: {
                            ...newCard.payment_address,
                            number: parseInt(e.target.value) || 0
                          }
                        })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
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
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                  >
                    Save Card
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {profile.creditCards.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No payment methods added yet.
            </div>
          ) : (
            <div className="space-y-4">
              {profile.creditCards.map((card) => (
                <div key={card.id} className="flex justify-between items-center border-b pb-3">
                  <div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <p>{card.card_number}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {card.payment_address.road_name} {card.payment_address.number}, {card.payment_address.city}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveCard(card.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
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