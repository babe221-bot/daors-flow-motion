import { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  href: string;
  children?: NavigationItem[];
  allowedRoles?: string[];
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
    showNotifications: boolean;
    notificationCount?: number;
  };
  sticky?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: LucideIcon;
}
