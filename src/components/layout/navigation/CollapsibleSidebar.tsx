import React, { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, AlertTriangle, Home, Package, Truck, BarChart3, Settings } from 'lucide-react';
import { useNavigation } from '@/hooks/useNavigation';
import { NavigationItem } from '@/types/navigation';
import { useAnimations } from '@/hooks/useAnimations';

interface CollapsibleSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onAlertsClick?: () => void;
  alertsCount?: number;
  className?: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    href: '/',
  },
  {
    id: 'shipments',
    label: 'Shipments',
    icon: Package,
    href: '/shipments',
  },
  {
    id: 'tracking',
    label: 'Tracking',
    icon: Truck,
    href: '/tracking',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    href: '/analytics',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    href: '/settings',
  },
];

export const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({
  isOpen,
  onToggle,
  onAlertsClick,
  alertsCount = 0,
  className = '',
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { filteredItems, setActiveItem, activeItem } = useNavigation(navigationItems);
  const { createAnimation } = useAnimations();

  useEffect(() => {
    if (sidebarRef.current) {
      createAnimation(sidebarRef.current, {
        width: isOpen ? '256px' : '64px',
        duration: 300,
        easing: 'easeOutQuad',
      });
    }
  }, [isOpen, createAnimation]);

  return (
    <aside
      ref={sidebarRef}
      className={`bg-white border-r border-gray-200 h-screen fixed left-0 top-0 z-40 transition-all duration-300 ${className}`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {isOpen && <span className="font-semibold text-gray-900">Menu</span>}
          <button
            onClick={onToggle}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {filteredItems.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  onClick={() => setActiveItem(item.id)}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    activeItem === item.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.icon && <item.icon className="h-5 w-5 flex-shrink-0" />}
                  {isOpen && <span className="text-sm font-medium">{item.label}</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t">
          {onAlertsClick && (
            <button
              onClick={onAlertsClick}
              className="flex items-center space-x-3 p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full"
            >
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              {isOpen && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Alerts</span>
                  {alertsCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {alertsCount}
                    </span>
                  )}
                </div>
              )}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
