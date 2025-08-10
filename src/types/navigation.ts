export interface NavigationItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  href?: string;
  children?: NavigationItem[];
  allowedRoles?: string[];
  isActive?: boolean;
  isExpanded?: boolean;
  badge?: {
    count: number;
    variant?: 'default' | 'destructive' | 'warning';
  };
  tooltip?: string;
  onClick?: () => void;
}

export interface NavbarConfig {
  title: string;
  subtitle?: string;
  logo?: string;
  search?: {
    enabled: boolean;
    placeholder?: string;
    showSuggestions?: boolean;
    onSearch?: (query: string) => void;
  };
  userMenu?: {
    showNotifications?: boolean;
    notificationCount?: number;
    showProfile?: boolean;
    onProfileClick?: () => void;
    onNotificationsClick?: () => void;
    onLogout?: () => void;
  };
  sticky?: boolean;
  themeToggle?: boolean;
}

export interface SidebarConfig {
  isOpen: boolean;
  onToggle: () => void;
  navigationItems: NavigationItem[];
  userRole?: string;
  alertsCount?: number;
  onAlertsClick?: () => void;
}

export interface MobileNavigationConfig {
  swipeGestures?: boolean;
  bottomNavigation?: boolean;
  collapsibleSections?: boolean;
  quickActions?: NavigationItem[];
  onItemClick?: (item: NavigationItem) => void;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}
