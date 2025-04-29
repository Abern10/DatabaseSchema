'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  BarChart, Calendar, Car, CreditCard, Loader, 
  Plus, TrendingUp, User, Users
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface User {
  role: string;
  name?: string;
  email?: string;
  ssn?: string;
}

interface Stats {
  totalRents: number;
  totalClients: number;
  totalDrivers: number;
  totalCars: number;
  totalRevenue: number;
}

interface ChartData {
  name: string;
  value: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalRents: 0,
    totalClients: 0,
    totalDrivers: 0,
    totalCars: 0,
    totalRevenue: 0
  });
  const [carData, setCarData] = useState<ChartData[]>([]);
  const [rentData, setRentData] = useState<ChartData[]>([]);

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      
      // Simulate fetching stats
      setTimeout(() => {
        setStats({
          totalRents: 156,
          totalClients: 45,
          totalDrivers: 12,
          totalCars: 30,
          totalRevenue: 24680
        });
        
        // Sample car model data
        setCarData([
          { name: 'Toyota', value: 42 },
          { name: 'Honda', value: 38 },
          { name: 'Tesla', value: 35 },
          { name: 'BMW', value: 20 },
          { name: 'Ford', value: 15 }
        ]);
        
        // Sample monthly rent data
        setRentData([
          { name: 'Jan', value: 23 },
          { name: 'Feb', value: 27 },
          { name: 'Mar', value: 32 },
          { name: 'Apr', value: 30 },
          { name: 'May', value: 44 }
        ]);
        
        setLoading(false);
      }, 1000);
    } else {
      router.push('/login');
    }
  }, [router]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <Loader className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          {user?.role === 'manager' && (
            <div>
              <Link href="/reports" className="btn-primary inline-flex items-center">
                <BarChart className="mr-2 h-5 w-5" />
                View Reports
              </Link>
            </div>
          )}
          {user?.role === 'client' && (
            <div>
              <Link href="/rents/new" className="btn-primary inline-flex items-center">
                <Plus className="mr-2 h-5 w-5" />
                Book a Rent
              </Link>
            </div>
          )}
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="dashboard-stat">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Rents</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalRents}</p>
            </div>
            <div className="dashboard-stat-primary">
              <Calendar className="h-6 w-6" />
            </div>
          </div>
          
          <div className="dashboard-stat">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Clients</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalClients}</p>
            </div>
            <div className="dashboard-stat-success">
              <Users className="h-6 w-6" />
            </div>
          </div>
          
          <div className="dashboard-stat">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Drivers</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalDrivers}</p>
            </div>
            <div className="dashboard-stat-warning">
              <User className="h-6 w-6" />
            </div>
          </div>
          
          <div className="dashboard-stat">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Cars</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalCars}</p>
            </div>
            <div className="dashboard-stat-danger">
              <Car className="h-6 w-6" />
            </div>
          </div>
        </div>
        
        {/* Charts and Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Rentals Chart */}
          <div className="card">
            <div className="card-header">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Monthly Rentals</h2>
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <div className="card-body">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={rentData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" name="Rentals" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Popular Car Models */}
          <div className="card">
            <div className="card-header">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Popular Car Models</h2>
                <Car className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <div className="card-body">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={carData} layout="vertical" margin={{ top: 20, right: 30, left: 60, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Bar dataKey="value" name="Rentals" fill="#10b981" radius={[0, 4, 4, 0]} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {user?.role === 'manager' && (
                <>
                  <Link href="/drivers/new" className="btn-primary text-center inline-flex items-center justify-center">
                    <User className="mr-2 h-5 w-5" />
                    Add Driver
                  </Link>
                  <Link href="/cars/new" className="btn-primary text-center inline-flex items-center justify-center">
                    <Car className="mr-2 h-5 w-5" />
                    Add Car
                  </Link>
                  <Link href="/reports" className="btn-primary text-center inline-flex items-center justify-center">
                    <BarChart className="mr-2 h-5 w-5" />
                    View Reports
                  </Link>
                </>
              )}
              
              {user?.role === 'client' && (
                <>
                  <Link href="/rents/new" className="btn-primary text-center inline-flex items-center justify-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Book a Rent
                  </Link>
                  <Link href="/rents" className="btn-secondary text-center inline-flex items-center justify-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    View My Rents
                  </Link>
                  <Link href="/profile" className="btn-outline text-center inline-flex items-center justify-center">
                    <User className="mr-2 h-5 w-5" />
                    Update Profile
                  </Link>
                </>
              )}
              
              {user?.role === 'driver' && (
                <>
                  <Link href="/profile" className="btn-primary text-center inline-flex items-center justify-center">
                    <User className="mr-2 h-5 w-5" />
                    Update Profile
                  </Link>
                  <Link href="/cars" className="btn-secondary text-center inline-flex items-center justify-center">
                    <Car className="mr-2 h-5 w-5" />
                    View Car Models
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}