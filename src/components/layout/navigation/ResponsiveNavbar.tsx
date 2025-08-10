import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, Menu, X } from 'lucide-react';
import { useAnimations } from '@/hooks/useAnimations';
import { NavigationConfig } from '@/types/navigation';

interface ResponsiveNavbarProps {
  config: NavigationConfig;
  onMenuToggle?: () => void;
  className?: string;
}

export const ResponsiveNavbar: React.FC<ResponsiveNavbarProps> = ({
  config,
  onMenuToggle,
  className = '',
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navbarRef = useRef<HTMLDivElement>(null);
  const { animateEntrance } = useAnimations();

  useEffect(() => {
    if (navbarRef.current) {
      animateEntrance(navbarRef.current, 'slideDown', {
        duration: 400,
        easing: 'easeOutBack',
      });
    }
  }, [animateEntrance]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement search logic here
  };

  return (
    <nav
      ref={navbarRef}
      className={`bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3 ${className}`}
    >
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div>
            <h1 className="text-xl font-bold text-gray-900">{config.title}</h1>
            {config.subtitle && (
              <p className="text-sm text-gray-600">{config.subtitle}</p>
            )}
          </div>
        </div>

        {/* Center Section - Search */}
        {config.search?.enabled && (
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={config.search.placeholder || 'Search...'}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {config.userMenu?.showNotifications && (
            <button className="relative p-2 rounded-md hover:bg-gray-100 transition-colors">
              <Bell className="h-5 w-5" />
              {config.userMenu.notificationCount && config.userMenu.notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {config.userMenu.notificationCount}
                </span>
              )}
            </button>
          )}
          
          <button className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors">
            <User className="h-5 w-5" />
            <span className="hidden md:block">Profile</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
