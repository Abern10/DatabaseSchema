'use client';

import React, { useState, useEffect } from 'react';
import CollapsibleSidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  useEffect(() => {
    // Get sidebar state from localStorage
    const savedSidebarState = localStorage.getItem('sidebarCollapsed');
    if (savedSidebarState !== null) {
      setSidebarCollapsed(savedSidebarState === 'true');
    }
    
    // Listen for changes in sidebar state
    const handleStorageChange = () => {
      const currentState = localStorage.getItem('sidebarCollapsed');
      if (currentState !== null) {
        setSidebarCollapsed(currentState === 'true');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event listener for sidebar toggle from the sidebar component
    const handleSidebarToggle = (e: Event) => {
      if ((e as CustomEvent).detail) {
        setSidebarCollapsed((e as CustomEvent).detail.collapsed);
      }
    };
    
    window.addEventListener('sidebarToggle', handleSidebarToggle as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sidebarToggle', handleSidebarToggle as EventListener);
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <CollapsibleSidebar />
      
      <main className={`flex-1 overflow-auto transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'main-content-collapsed' : 'main-content-expanded'
      }`}>
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}