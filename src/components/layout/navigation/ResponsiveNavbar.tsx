import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, Menu, X } from 'lucide-react';
import { NavigationConfig, SearchSuggestion } from '@/types/navigation';
import { cn } from '@/lib/utils';

interface ResponsiveNavbarProps {
  config: NavigationConfig;
  onMenuToggle?: () => void;
  className?: string;
}

export const ResponsiveNavbar: React.FC<ResponsiveNavbarProps> = ({
  config,
  onMenuToggle,
  className,
}) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (config.search?.onSearch) {
      config.search.onSearch(query);
    }
    
    // Mock suggestions - replace with actual API call
    if (query.length > 2) {
      setSuggestions([
        { id: '1', label: `Route ${query}`, type: 'route' },
        { id: '2', label: `Order ${query}`, type: 'order' },
        { id: '3', label: `Customer ${query}`, type: 'customer' },
      ]);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  return (
    <nav className={cn(
      'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b',
      config.sticky && 'sticky top-0 z-50',
      className
    )}>
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-md hover:bg-accent transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          
          <div>
            <h1 className="text-xl font-bold">{config.title}</h1>
            {config.subtitle && (
              <p className="text-sm text-muted-foreground">{config.subtitle}</p>
            )}
          </div>
        </div>

        {/* Center Section - Search */}
        {config.search?.enabled && (
          <div ref={searchRef} className="relative hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={config.search.placeholder || 'Search...'}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setIsSearchExpanded(true)}
                className={cn(
                  'pl-10 pr-4 py-2 rounded-lg border bg-background transition-all',
                  isSearchExpanded ? 'w-80' : 'w-64'
                )}
              />
            </div>
            
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-popover border rounded-lg shadow-lg z-50">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    className="w-full px-4 py-2 text-left hover:bg-accent transition-colors"
                    onClick={() => {
                      setSearchQuery(suggestion.label);
                      setShowSuggestions(false);
                    }}
                  >
                    <span className="text-sm">{suggestion.label}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {suggestion.type}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {config.userMenu?.showNotifications && (
            <button className="relative p-2 rounded-md hover:bg-accent transition-colors">
              <Bell className="h-5 w-5" />
              {config.userMenu.notificationCount && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-white text-xs rounded-full flex items-center justify-center">
                  {config.userMenu.notificationCount}
                </span>
              )}
            </button>
          )}
          
          <div ref={userMenuRef} className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent transition-colors"
            >
              <User className="h-5 w-5" />
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-popover border rounded-lg shadow-lg z-50">
                <div className="py-1">
                  <button className="w-full px-4 py-2 text-left hover:bg-accent transition-colors">
                    Profile
                  </button>
                  <button className="w-full px-4 py-2 text-left hover:bg-accent transition-colors">
                    Settings
                  </button>
                  <hr className="my-1" />
                  <button className="w-full px-4 py-2 text-left hover:bg-accent transition-colors text-destructive">
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
