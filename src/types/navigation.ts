// Navigation types
export interface NavigationItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  href?: string;
  onClick?: () => void;
  allowedRoles?: string[];
  children?: NavigationItem[];
  badge?: {
    count: number;
    color?: string;
  };
  tooltip?: string;
}

export interface UserMenuItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  separator?: boolean;
}

export interface SearchSuggestion {
  id: string;
  label: string;
  type: 'route' | 'shipment' | 'customer' | 'location';
  icon?: React.ComponentType<{ className?: string }>;
  action?: () => void;
}

export interface NavigationConfig {
  title?: string;
  subtitle?: string;
  search?: {
    enabled: boolean;
    placeholder?: string;
    showSuggestions?: boolean;
    onSearch?: (query: string) => void;
  };
  userMenu?: {
    showNotifications: boolean;
    notificationCount?: number;
    onNotificationsClick?: () => void;
    menuItems?: UserMenuItem[];
  };
  sticky?: boolean;
  mobile?: {
    showBottomNav?: boolean;
    swipeGestures?: boolean;
  };
}
