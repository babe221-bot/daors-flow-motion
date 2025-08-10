export interface NavigationConfig {
  title: string;
  subtitle?: string;
  search?: {
    enabled: boolean;
    placeholder?: string;
    showSuggestions?: boolean;
  };
  userMenu?: {
    showNotifications: boolean;
    notificationCount?: number;
  };
  sticky?: boolean;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  allowedRoles?: string[];
  children?: NavigationItem[];
}

export interface MobileNavigationConfig {
  swipeGestures: boolean;
  bottomNavigation: boolean;
  collapsibleSections: boolean;
  quickActions: NavigationItem[];
}
