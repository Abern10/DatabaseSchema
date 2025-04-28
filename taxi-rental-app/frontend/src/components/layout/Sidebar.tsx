// frontend/src/components/layout/Sidebar.tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  Home, Users, Car, Calendar, Settings, LogOut, 
  User, List, Star, Menu, X, UserCheck
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  roles: string[];
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: Home, roles: ['manager', 'driver', 'client'] },
  { name: 'Managers', href: '/managers', icon: UserCheck, roles: ['manager'] },
  { name: 'Drivers', href: '/drivers', icon: User, roles: ['manager'] },
  { name: 'Clients', href: '/clients', icon: Users, roles: ['manager'] },
  { name: 'Cars', href: '/cars', icon: Car, roles: ['manager', 'driver'] },
  { name: 'Rents', href: '/rents', icon: Calendar, roles: ['manager', 'client'] },
  { name: 'Reviews', href: '/reviews', icon: Star, roles: ['client'] },
  { name: 'Profile', href: '/profile', icon: Settings, roles: ['manager', 'driver', 'client'] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // In a real application, you would fetch this from an auth context
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserRole(user.role);
    }
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const filteredNavigation = userRole
    ? navigation.filter(item => item.roles.includes(userRole))
    : navigation.filter(item => item.roles.includes('client')); // Default to client view

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        className="fixed top-4 left-4 z-50 md:hidden flex items-center justify-center"
        onClick={toggleSidebar}
      >
        {isOpen ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          <Menu className="h-6 w-6" aria-hidden="true" />
        )}
      </button>

      {/* Sidebar for mobile */}
      <div className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 z-40 transition duration-200 ease-in-out md:relative md:flex`}>
        <div className="flex flex-col w-64 bg-gray-800 text-white h-full">
          <div className="flex items-center justify-center h-20 border-b border-gray-700">
            <h1 className="text-xl font-bold">Taxi Rental</h1>
          </div>
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-2 px-2">
              {filteredNavigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center p-2 rounded-md ${
                        isActive
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="mr-3 h-5 w-5" aria-hidden="true" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="p-4 border-t border-gray-700">
            <button
              className="flex items-center w-full p-2 text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
              onClick={() => {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                window.location.href = '/login';
              }}
            >
              <LogOut className="mr-3 h-5 w-5" aria-hidden="true" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}