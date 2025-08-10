import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, AlertTriangle, Home, Package, Truck, Users, BarChart3, Settings } from 'lucide-react';
import { NavigationItem } from '@/types/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

interface CollapsibleSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onAlertsClick?: () => void;
  alertsCount?: number;
  className?: string;
}

const defaultNavigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    href: '/',
    allowedRoles: ['admin', 'manager', 'driver', 'customer'],
  },
  {
    id: 'shipments',
    label: 'Shipments',
    icon: Package,
    href: '/shipments',
    allowedRoles: ['admin', 'manager', 'driver', 'customer'],
  },
  {
    id: 'routes',
    label: 'Routes',
    icon: Truck,
    href: '/routes',
    allowedRoles: ['admin', 'manager', 'driver'],
  },
  {
    id: 'customers',
    label: 'Customers',
    icon: Users,
    href: '/customers',
    allowedRoles: ['admin', 'manager'],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    href: '/analytics',
    allowedRoles: ['admin', 'manager'],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    href: '/settings',
    allowedRoles: ['admin', 'manager', 'driver', 'customer'],
  },
];

export const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({
  isOpen,
  onToggle,
  onAlertsClick,
  alertsCount = 0,
  className,
}) => {
  const { user } = useAuth();
  const [activeItem, setActiveItem] = useState('dashboard');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const userRoles = user?.user_metadata?.roles || ['customer'];
  
  const filteredItems = defaultNavigationItems.filter(item => 
    !item.allowedRoles || item.allowedRoles.some(role => userRoles.includes(role))
  );

  const handleItemClick = (item: NavigationItem) => {
    setActiveItem(item.id);
    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      // Handle navigation
      window.history.pushState({}, '', item.href);
    }
  };

  return (
    <aside className={cn(
      'fixed left-0 top-0 h-full bg-background border-r transition-all duration-300 z-40',
      isOpen ? 'w-64' : 'w-16',
      className
    )}>
      <div className="flex flex-col h-full">
        {/* Toggle Button */}
        <div className="flex items-center justify-between p-4 border-b">
          {isOpen && <span className="font-semibold">Navigation</span>}
          <button
            onClick={onToggle}
            className="p-2 rounded-md hover:bg-accent transition-colors"
          >
            {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="relative">
              <button
                onClick={() => handleItemClick(item)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={cn(
                  'w-full flex items-center px-4 py-3 text-sm transition-colors',
                  activeItem === item.id
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-accent',
                  !isOpen && 'justify-center'
                )}
              >
                {item.icon && <item.icon className="h-5 w-5" />}
                {isOpen && <span className="ml-3">{item.label}</span>}
              </button>
              
              {/* Tooltip for collapsed state */}
              {!isOpen && hoveredItem === item.id && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-sm rounded-md shadow-lg whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Alerts Section */}
        {onAlertsClick && (
          <div className="border-t p-4">
            <button
              onClick={onAlertsClick}
              className={cn(
                'w-full flex items-center px-4 py-3 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors',
                !isOpen && 'justify-center'
              )}
            >
              <AlertTriangle className="h-5 w-5" />
              {isOpen && (
                <span className="ml-3 flex items-center">
                  Alerts
                  {alertsCount > 0 && (
                    <span className="ml-2 px-2 py-1 bg-destructive text-white text-xs rounded-full">
                      {alertsCount}
                    </span>
                  )}
                </span>
              )}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
