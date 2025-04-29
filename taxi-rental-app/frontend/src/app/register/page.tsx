'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader, Plus, X } from 'lucide-react';

type UserRole = 'client' | 'driver' | 'manager';

interface Address {
  road_name: string;
  number: string;
  city: string;
}

interface CreditCard {
  card_number: string;
  payment_address: Address;
}

export default function Register() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>('client');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [ssn, setSsn] = useState('');
  const [addresses, setAddresses] = useState<Address[]>([{ road_name: '', number: '', city: '' }]);
  const [creditCards, setCreditCards] = useState<CreditCard[]>([
    { 
      card_number: '', 
      payment_address: { road_name: '', number: '', city: '' } 
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addAddress = () => {
    setAddresses([...addresses, { road_name: '', number: '', city: '' }]);
  };

  const removeAddress = (index: number) => {
    if (addresses.length > 1) {
      setAddresses(addresses.filter((_, i) => i !== index));
    }
  };

  const updateAddress = (index: number, field: keyof Address, value: string) => {
    const newAddresses = [...addresses];
    newAddresses[index][field] = value;
    setAddresses(newAddresses);
  };

  const addCreditCard = () => {
    setCreditCards([
      ...creditCards, 
      { 
        card_number: '', 
        payment_address: { road_name: '', number: '', city: '' } 
      }
    ]);
  };

  const removeCreditCard = (index: number) => {
    if (creditCards.length > 1) {
      setCreditCards(creditCards.filter((_, i) => i !== index));
    }
  };

  const updateCreditCard = (index: number, field: 'card_number', value: string) => {
    const newCreditCards = [...creditCards];
    newCreditCards[index][field] = value;
    setCreditCards(newCreditCards);
  };

  const updateCreditCardAddress = (index: number, field: keyof Address, value: string) => {
    const newCreditCards = [...creditCards];
    newCreditCards[index].payment_address[field] = value;
    setCreditCards(newCreditCards);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: In a real app, you would make an API call to your backend
      let endpoint = '';
      let payload = {};

      switch (role) {
        case 'client':
          endpoint = '/api/clients/register';
          payload = { name, email, addresses, creditCards };
          break;
        case 'driver':
          endpoint = '/api/drivers';
          payload = { 
            name, 
            address_road_name: addresses[0].road_name,
            address_number: addresses[0].number,
            address_city: addresses[0].city
          };
          break;
        case 'manager':
          endpoint = '/api/managers/register';
          payload = { name, ssn, email };
          break;
      }

      // TODO: Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // TODO: Simulating successful registration
      const userData = {
        role,
        ...(role === 'client' && { email, name }),
        ...(role === 'driver' && { name }),
        ...(role === 'manager' && { ssn, name, email }),
      };

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', 'fake-jwt-token');

      // Redirect to dashboard
      router.push('/');
    } catch (error) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Register As
              </label>
              <div className="flex space-x-2">
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 rounded-md ${
                    role === 'client'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  onClick={() => setRole('client')}
                >
                  Client
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 rounded-md ${
                    role === 'driver'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  onClick={() => setRole('driver')}
                >
                  Driver
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 rounded-md ${
                    role === 'manager'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  onClick={() => setRole('manager')}
                >
                  Manager
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                required
              />
            </div>
            
            {(role === 'client' || role === 'manager') && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  required
                />
              </div>
            )}
            
            {role === 'manager' && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ssn">
                  SSN
                </label>
                <input
                  id="ssn"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={ssn}
                  onChange={(e) => setSsn(e.target.value)}
                  placeholder="Social Security Number"
                  required
                />
              </div>
            )}
            
            {(role === 'client' || role === 'driver') && (
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Address{role === 'client' ? '(es)' : ''}
                </label>
                {addresses.map((address, index) => (
                  <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Address #{index + 1}</h3>
                      {role === 'client' && addresses.length > 1 && (
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-800"
                          onClick={() => removeAddress(index)}
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 text-sm mb-1">
                          Street Name
                        </label>
                        <input
                          type="text"
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          value={address.road_name}
                          onChange={(e) => updateAddress(index, 'road_name', e.target.value)}
                          placeholder="Street Name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm mb-1">
                          Number
                        </label>
                        <input
                          type="text"
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          value={address.number}
                          onChange={(e) => updateAddress(index, 'number', e.target.value)}
                          placeholder="123"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-gray-700 text-sm mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          value={address.city}
                          onChange={(e) => updateAddress(index, 'city', e.target.value)}
                          placeholder="City"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {role === 'client' && (
                  <button
                    type="button"
                    className="flex items-center text-blue-600 hover:text-blue-800 mt-2"
                    onClick={addAddress}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Another Address
                  </button>
                )}
              </div>
            )}
            
            {role === 'client' && (
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Credit Card(s)
                </label>
                {creditCards.map((card, index) => (
                  <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Credit Card #{index + 1}</h3>
                      {creditCards.length > 1 && (
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-800"
                          onClick={() => removeCreditCard(index)}
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={card.card_number}
                        onChange={(e) => updateCreditCard(index, 'card_number', e.target.value)}
                        placeholder="XXXX XXXX XXXX XXXX"
                        required
                      />
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Payment Address</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 text-sm mb-1">
                            Street Name
                          </label>
                          <input
                            type="text"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={card.payment_address.road_name}
                            onChange={(e) => updateCreditCardAddress(index, 'road_name', e.target.value)}
                            placeholder="Street Name"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm mb-1">
                            Number
                          </label>
                          <input
                            type="text"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={card.payment_address.number}
                            onChange={(e) => updateCreditCardAddress(index, 'number', e.target.value)}
                            placeholder="123"
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-gray-700 text-sm mb-1">
                            City
                          </label>
                          <input
                            type="text"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={card.payment_address.city}
                            onChange={(e) => updateCreditCardAddress(index, 'city', e.target.value)}
                            placeholder="City"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="flex items-center text-blue-600 hover:text-blue-800 mt-2"
                  onClick={addCreditCard}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Another Credit Card
                </button>
              </div>
            )}
            
            <div className="flex items-center justify-between mb-6">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader className="animate-spin h-5 w-5 mr-2" />
                    <span>Registering...</span>
                  </div>
                ) : (
                  'Register'
                )}
              </button>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-600 hover:text-blue-800">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}