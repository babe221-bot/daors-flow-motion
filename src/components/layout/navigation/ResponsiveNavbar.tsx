import React, { useState } from 'react';
import { Search, Bell, User, Menu, X } from 'lucide-react';
import { NavigationConfig } from '@/types/navigation';
import { useAnimations } from '@/hooks/useAnimations';

interface ResponsiveNavbarProps {
  config: NavigationConfig;
  onMenuToggle: () => void;
  className?: string;
}

export const ResponsiveNavbar: React.FC<ResponsiveNavbarProps> = ({
  config,
  onMenuToggle,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const { animateEntrance } = useAnimations();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement search logic here
  };

  return (
    <nav className={`bg-white shadow-sm border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left section */}
          <div className="flex items-center">
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="ml-4">
              <h1 className="text-xl font-semibold text-gray-900">{config.title}</h1>
              {config.subtitle && (
                <p className="text-sm text-gray-500">{config.subtitle}</p>
              )}
            </div>
          </div>

          {/* Center section - Search */}
          {config.search?.enabled && (
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder={config.search.placeholder || 'Search...'}
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          )}

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {config.userMenu?.showNotifications && (
              <button className="relative p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Bell className="h-6 w-6" />
                {config.userMenu.notificationCount && config.userMenu.notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                    {config.userMenu.notificationCount}
                  </span>
                )}
              </button>
            )}
            
            <button className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <User className="h-8 w-8 rounded-full bg-gray-300 p-1" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
