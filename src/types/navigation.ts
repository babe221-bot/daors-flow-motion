// Navigation-related TypeScript definitions
import { Role } from '@/lib/types';

export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href?: string;
  badge?: string | number;
  color?: string;
  allowedRoles: Role[];
  children?: NavigationItem[];
  isCollapsible?: boolean;
  isExternal?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<any>;
  isActive?: boolean;
}

export interface NavigationState {
  activeItem: string | null;
  expandedItems: string[];
  searchQuery: string;
  searchResults: NavigationItem[];
  recentItems: NavigationItem[];
}

export interface UserMenuConfig {
  showAvatar: boolean;
  showName: boolean;
  showRole: boolean;
  showNotifications: boolean;
  notificationCount?: number;
}

export interface SearchConfig {
  enabled: boolean;
  placeholder: string;
  showSuggestions: boolean;
  maxSuggestions: number;
  searchableFields: ('label' | 'href' | 'id')[];
}

export interface MobileNavConfig {
  swipeGestures: boolean;
  bottomNavigation: boolean;
  collapsibleSections: boolean;
  quickActions: NavigationItem[];
}

export interface NavbarConfig {
  logo: {
    src: string;
    alt: string;
    href: string;
    showText: boolean;
  };
  title?: string;
  subtitle?: string;
  search: SearchConfig;
  userMenu: UserMenuConfig;
  sticky: boolean;
  transparent: boolean;
}