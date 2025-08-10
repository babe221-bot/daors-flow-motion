import { ComponentType } from 'react';

export interface NavigationItem {
  id: string;
  label: string;
  icon?: ComponentType<{ className?: string }>;
  href?: string;
  children?: NavigationItem[];
  allowedRoles?: string[];
  badge?: number;
  isExternal?: boolean;
  target?: string;
  onClick?: () => void;
}

export interface NavigationConfig {
  title: string;
  subtitle?: string;
  search?: {
    enabled: boolean;
    placeholder?: string;
    showSuggestions?: boolean;
  };
  userMenu?: {
    showNotifications?: boolean;
    notificationCount?: number;
    showProfile?: boolean;
  };
  sticky?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ComponentType<{ className?: string }>;
}

export interface MobileNavigationConfig {
  swipeGestures?: boolean;
  bottomNavigation?: boolean;
  collapsibleSections?: boolean;
  quickActions?: NavigationItem[];
}
