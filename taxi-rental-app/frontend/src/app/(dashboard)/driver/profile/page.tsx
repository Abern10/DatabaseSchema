// src/app/(dashboard)/driver/profile/page.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { updateDriverAddress, updateDriverContact, getDriverProfile } from '@/lib/api';

type Address = {
  road_name: string;
  number: number;
  city: string;
};

type Driver = {
  name: string;
  id: number;
  address: Address;
  license_number: string;
  license_expiry: string;
  phone_number: string;
  email: string;
  joining_date: string;
  total_rides: number;
  average_rating: number;
};

export default function DriverProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingAddress, setEditingAddress] = useState(false);
  const [editingContact, setEditingContact] = useState(false);
  const [error, setError] = useState('');
  const [addressForm, setAddressForm] = useState<Address>({
    road_name: '',
    number: 0,
    city: ''
  });
  const [contactForm, setContactForm] = useState({
    phone_number: '',
    email: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);

        if (parsedUser.userType !== 'driver') {
          setError('Access denied. Only drivers can view this page.');
          setTimeout(() => router.push('/'), 2000);
          return;
        }

        // Fetch driver profile from API
        getDriverProfile(parsedUser.name)
          .then(response => {
            if (response.success && response.data) {
              setProfile(response.data);

              // Initialize form values with current data
              setAddressForm(response.data.address);
              setContactForm({
                phone_number: response.data.phone_number,
                email: response.data.email
              });
            } else {
              throw new Error(response.error || 'Failed to load profile');
            }
          })
          .catch((err: Error) => {
            console.error('Error fetching driver profile:', err);
            setError(err.message || 'Failed to load profile. Please try again later.');
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (err) {
        console.error('Error parsing user data:', err);
        setError('Invalid user data. Please log in again.');
        setTimeout(() => router.push('/'), 2000);
      }
    } else {
      setError('User not found. Please log in again.');
      setLoading(false);
      setTimeout(() => router.push('/'), 2000);
    }
  }, [router]);

  const handleAddressSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (!profile?.name) {
        throw new Error('Driver name is missing');
      }

      // Call API to update address
      const response = await updateDriverAddress(profile.name, addressForm);

      if (response.success) {
        // Update local state
        setProfile({
          ...profile,
          address: addressForm
        });

        setEditingAddress(false);
      } else {
        throw new Error(response.error || 'Failed to update address');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update address. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (!profile?.name) {
        throw new Error('Driver name is missing');
      }

      // Call API to update contact information
      const response = await updateDriverContact(profile.name, contactForm);

      if (response.success) {
        // Update local state
        setProfile({
          ...profile,
          phone_number: contactForm.phone_number,
          email: contactForm.email
        });

        setEditingContact(false);
      } else {
        throw new Error(response.error || 'Failed to update contact information');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update contact information. Please try again.');
    } finally {
      setSubmitting(false);
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

  if (error && !profile) {
    return (
      <div className="text-center text-red-500 p-6 bg-white rounded-xl shadow-md">
        {error}
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
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center">
          <div className="h-16 w-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
            {profile.name.charAt(0)}
          </div>
          <div className="ml-4">
            <h2 className="text-2xl font-semibold text-gray-800">{profile.name}</h2>
            <p className="text-xs text-gray-500">Driver ID: {profile.id}</p>
          </div>
        </div>
      </div>

      {/* Driver Stats */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Driver Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Rides</p>
            <p className="text-2xl font-bold text-gray-800">{profile.total_rides}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Average Rating</p>
            <div className="flex items-center">
              <p className="text-2xl font-bold text-gray-800 mr-2">{profile.average_rating.toFixed(1)}</p>
              <div className="text-yellow-500">★</div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Joined On</p>
            <p className="text-2xl font-bold text-gray-800">{new Date(profile.joining_date).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* License Information */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">License Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">License Number</h4>
            <p className="text-gray-800">{profile.license_number}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Expiry Date</h4>
            <p className="text-gray-800">{new Date(profile.license_expiry).toLocaleDateString()}</p>
            {new Date(profile.license_expiry) < new Date(new Date().setMonth(new Date().getMonth() + 3)) && (
              <p className="text-sm text-orange-600 mt-1">License expires in less than 3 months</p>
            )}
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Address</h3>
          {!editingAddress && (
            <button
              onClick={() => setEditingAddress(true)}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
            >
              Edit
            </button>
          )}
        </div>

        {editingAddress ? (
          <form onSubmit={handleAddressSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="road_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Road Name
                </label>
                <input
                  type="text"
                  id="road_name"
                  value={addressForm.road_name}
                  onChange={(e) => setAddressForm({ ...addressForm, road_name: e.target.value })}
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
                  value={addressForm.number || ''}
                  onChange={(e) => setAddressForm({ ...addressForm, number: parseInt(e.target.value) || 0 })}
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
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setEditingAddress(false);
                  setAddressForm(profile.address);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
              >
                {submitting ? 'Saving...' : 'Save Address'}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <p className="text-gray-800">
              {profile.address.road_name} {profile.address.number}, {profile.address.city}
            </p>
          </div>
        )}
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
          {!editingContact && (
            <button
              onClick={() => setEditingContact(true)}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
            >
              Edit
            </button>
          )}
        </div>

        {editingContact ? (
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone_number"
                  value={contactForm.phone_number}
                  onChange={(e) => setContactForm({ ...contactForm, phone_number: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setEditingContact(false);
                  setContactForm({
                    phone_number: profile.phone_number,
                    email: profile.email
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
              >
                {submitting ? 'Saving...' : 'Save Contact Info'}
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Phone Number</h4>
              <p className="text-gray-800">{profile.phone_number}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
              <p className="text-gray-800">{profile.email}</p>
            </div>
          </div>
        )}
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Settings</h3>
        <div className="space-y-4">
          <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors block">
            Change Password
          </button>
          <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors block">
            Notification Preferences
          </button>
          <button className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors block">
            Deactivate Account
          </button>
        </div>
      </div>
    </div>
  );
}