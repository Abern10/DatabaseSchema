'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, Users, Car, Calendar, Settings, LogOut, 
  User, List, Star, Menu, ChevronLeft, ChevronRight, 
  BarChart2, UserCheck, CreditCard, TrendingUp
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
  { name: 'Book Rent', href: '/rents/new', icon: CreditCard, roles: ['client'] },
  { name: 'Reviews', href: '/reviews', icon: Star, roles: ['client'] },
  { name: 'Reports', href: '/reports', icon: BarChart2, roles: ['manager'] },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp, roles: ['manager'] },
  { name: 'Profile', href: '/profile', icon: Settings, roles: ['manager', 'driver', 'client'] },
];

export default function CollapsibleSidebar() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  useEffect(() => {
    // In a real application, you would fetch this from an auth context
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserRole(user.role);
    }
    
    // Check if sidebar state is saved in localStorage
    const savedSidebarState = localStorage.getItem('sidebarCollapsed');
    if (savedSidebarState !== null) {
      setIsCollapsed(savedSidebarState === 'true');
    }
    
    // Handle window resize
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Initial check
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
  };

  const filteredNavigation = userRole
    ? navigation.filter(item => item.roles.includes(userRole))
    : navigation.filter(item => item.roles.includes('client')); // Default to client view

  return (
    <>
      <div className={`sidebar ${isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
        <div className="sidebar-header justify-between">
          {!isCollapsed && <h1 className="text-xl font-bold">Taxi Rental</h1>}
          <button 
            className="p-1 rounded-md hover:bg-gray-700 focus:outline-none"
            onClick={toggleSidebar}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>
        
        <nav className="sidebar-content">
          <ul className="space-y-1">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`sidebar-item ${isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'}`}
                  >
                    <item.icon className="sidebar-icon" aria-hidden="true" />
                    <span className={`sidebar-text ${isCollapsed ? 'sidebar-text-hidden' : 'sidebar-text-visible'}`}>
                      {item.name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <button
            className="sidebar-item sidebar-item-inactive w-full"
            onClick={() => {
              localStorage.removeItem('user');
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
          >
            <LogOut className="sidebar-icon" aria-hidden="true" />
            <span className={`sidebar-text ${isCollapsed ? 'sidebar-text-hidden' : 'sidebar-text-visible'}`}>
              Logout
            </span>
          </button>
        </div>
      </div>
      
      {/* Mobile menu toggle - visible only on small screens */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button
          type="button"
          className="p-2 rounded-md bg-gray-800 text-gray-200 hover:bg-gray-700 focus:outline-none"
          onClick={toggleSidebar}
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
    </>
  );
}