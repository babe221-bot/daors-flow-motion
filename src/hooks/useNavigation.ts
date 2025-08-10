import { useState, useCallback, useMemo } from 'react';
import { NavigationItem } from '@/types/navigation';

interface NavigationState {
  activeItem: string | null;
  expandedItems: string[];
  searchQuery: string;
}

export const useNavigation = (
  items: NavigationItem[],
  userRole?: string
) => {
  const [state, setState] = useState<NavigationState>({
    activeItem: null,
    expandedItems: [],
    searchQuery: '',
  });

  const filteredItems = useMemo(() => {
    let filtered = items;

    if (userRole) {
      filtered = items.filter(item => 
        !item.allowedRoles || item.allowedRoles.includes(userRole)
      );
    }

    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.label.toLowerCase().includes(query) ||
        (item.children && item.children.some(child => 
          child.label.toLowerCase().includes(query)
        ))
      );
    }

    return filtered;
  }, [items, userRole, state.searchQuery]);

  const setActiveItem = useCallback((itemId: string | null) => {
    setState(prev => ({ ...prev, activeItem: itemId }));
  }, []);

  const toggleExpanded = useCallback((itemId: string) => {
    setState(prev => ({
      ...prev,
      expandedItems: prev.expandedItems.includes(itemId)
        ? prev.expandedItems.filter(id => id !== itemId)
        : [...prev.expandedItems, itemId],
    }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const isExpanded = useCallback((itemId: string) => {
    return state.expandedItems.includes(itemId);
  }, [state.expandedItems]);

  return {
    ...state,
    filteredItems,
    setActiveItem,
    toggleExpanded,
    setSearchQuery,
    isExpanded,
  };
};
