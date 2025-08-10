import React, { useEffect, useRef } from 'react';
import { Home, BarChart3, Package, Truck, Settings, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { useAnimations } from '@/hooks/useAnimations';

interface CollapsibleSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onAlertsClick?: () => void;
  alertsCount?: number;
  className?: string;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/analytics' },
  { id: 'shipments', label: 'Shipments', icon: Package, href: '/shipments' },
  { id: 'fleet', label: 'Fleet', icon: Truck, href: '/fleet' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
];

export const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({
  isOpen,
  onToggle,
  onAlertsClick,
  alertsCount = 0,
  className = '',
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { animateSidebarToggle } = useAnimations();

  useEffect(() => {
    if (sidebarRef.current) {
      animateSidebarToggle(sidebarRef.current, isOpen);
    }
  }, [isOpen, animateSidebarToggle]);

  return (
    <div
      ref={sidebarRef}
      className={`fixed left-0 top-0 h-full bg-white shadow-lg border-r border-gray-200 transition-all duration-300 z-40 ${className}`}
      style={{ width: isOpen ? '256px' : '64px' }}
    >
      <div className="flex flex-col h-full">
        {/* Toggle button */}
        <div className="flex justify-end p-4">
          <button
            onClick={onToggle}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            {isOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-2 space-y-1">
          {navigationItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <item.icon
                className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                aria-hidden="true"
              />
              {isOpen && (
                <span className="ml-3" data-animate-child>
                  {item.label}
                </span>
              )}
            </a>
          ))}
        </nav>

        {/* Alerts section */}
        {onAlertsClick && (
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={onAlertsClick}
              className="w-full flex items-center justify-center px-2 py-2 text-sm font-medium rounded-md text-red-700 hover:bg-red-50"
            >
              <AlertTriangle className="h-5 w-5" />
              {isOpen && (
                <span className="ml-3" data-animate-child>
                  Alerts {alertsCount > 0 && `(${alertsCount})`}
                </span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
