import { useState, useEffect } from 'react';
import { NavigationItem } from '@/types/navigation';

interface UseNavigationReturn {
  filteredItems: NavigationItem[];
  activeItem: string | null;
  setActiveItem: (id: string) => void;
  hasRole: (roles: string[]) => boolean;
}

export const useNavigation = (items: NavigationItem[]): UseNavigationReturn => {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [userRoles] = useState<string[]>(['admin', 'user']); // Mock roles

  const hasRole = (roles: string[] = []): boolean => {
    if (roles.length === 0) return true;
    return roles.some(role => userRoles.includes(role));
  };

  const filteredItems = items.filter(item => hasRole(item.allowedRoles));

  useEffect(() => {
    const currentPath = window.location.pathname;
    const active = filteredItems.find(item => item.href === currentPath);
    if (active) {
      setActiveItem(active.id);
    }
  }, [filteredItems]);

  return {
    filteredItems,
    activeItem,
    setActiveItem,
    hasRole,
  };
};
