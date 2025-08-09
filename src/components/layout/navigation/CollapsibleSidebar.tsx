// Enhanced collapsible sidebar with role-based navigation and animations
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Home,
  Package,
  Truck,
  BarChart3,
  MapPin,
  Settings,
  Users,
  LifeBuoy,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  Warehouse,
  Route,
  User,
  DollarSign,
  FileText,
  ClipboardList,
  TrendingUp,
  TrafficCone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Logo from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';
import { useAnimations } from '@/hooks/useAnimations';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import {
  animateSidebarToggle,
  animateMenuItemHover,
  animateActiveNavItem,
  animateMenuItemsEntrance,
} from '@/lib/animations/navigationAnimations';
import { cn } from '@/lib/utils';
import { NavigationItem } from '@/types/navigation';
import { ROLES, Role } from '@/lib/types';

interface CollapsibleSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onAlertsClick?: () => void;
  alertsCount?: number;
  className?: string;
}

export const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({
  isOpen,
  onToggle,
  onAlertsClick,
  alertsCount = 0,
  className,
}) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { hasRole } = useAuth();
  const { isMobile } = useResponsiveLayout();
  const { createAnimation, createHoverAnimation } = useAnimations();

  const sidebarRef = useRef<HTMLElement>(null);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // Navigation items configuration
  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: t('sidebar.dashboard'),
      icon: Home,
      href: '/',
      color: 'text-primary',
      allowedRoles: [ROLES.ADMIN, ROLES.MANAGER],
    },
    {
      id: 'item-tracking',
      label: t('sidebar.itemTracking'),
      icon: Package,
      href: '/item-tracking',
      color: 'text-green-400',
      allowedRoles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.CLIENT, ROLES.DRIVER],
    },
    {
      id: 'route-optimization',
      label: 'Route Optimization',
      icon: Route,
      href: '/route-optimization',
      color: 'text-teal-400',
      allowedRoles: [ROLES.ADMIN, ROLES.MANAGER],
    },
    {
      id: 'inventory',
      label: t('sidebar.inventory'),
      icon: Warehouse,
      href: '/inventory',
      color: 'text-orange-400',
      allowedRoles: [ROLES.ADMIN],
    },
    {
      id: 'shipments',
      label: t('sidebar.shipments'),
      icon: Truck,
      href: '/shipments',
      color: 'text-blue-400',
      allowedRoles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.DRIVER],
    },
    {
      id: 'analytics',
      label: t('sidebar.analytics'),
      icon: BarChart3,
      color: 'text-purple-400',
      allowedRoles: [ROLES.ADMIN, ROLES.MANAGER],
      isCollapsible: true,
      children: [
        {
          id: 'analytics-traffic',
          label: t('sidebar.analytics.traffic'),
          icon: TrafficCone,
          href: '/analytics/traffic',
          allowedRoles: [ROLES.ADMIN, ROLES.MANAGER],
        },
        {
          id: 'analytics-revenue',
          label: t('sidebar.analytics.revenue'),
          icon: DollarSign,
          href: '/analytics/revenue',
          allowedRoles: [ROLES.ADMIN, ROLES.MANAGER],
        },
        {
          id: 'analytics-reports',
          label: t('sidebar.analytics.reports'),
          icon: FileText,
          href: '/reports',
          allowedRoles: [ROLES.ADMIN, ROLES.MANAGER],
        },
      ],
    },
    {
      id: 'tracking',
      label: t('sidebar.tracking'),
      icon: MapPin,
      href: '/live-map',
      color: 'text-orange-400',
      allowedRoles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.DRIVER],
    },
    {
      id: 'finance',
      label: t('sidebar.finance'),
      icon: DollarSign,
      color: 'text-yellow-400',
      allowedRoles: [ROLES.ADMIN, ROLES.MANAGER],
      isCollapsible: true,
      children: [
        {
          id: 'finance-invoices',
          label: t('sidebar.finance.invoices'),
          icon: ClipboardList,
          href: '/finance/invoices',
          allowedRoles: [ROLES.ADMIN, ROLES.MANAGER],
        },
        {
          id: 'finance-expenses',
          label: t('sidebar.finance.expenses'),
          icon: TrendingUp,
          href: '/finance/expenses',
          allowedRoles: [ROLES.ADMIN, ROLES.MANAGER],
        },
      ],
    },
    {
      id: 'alerts',
      label: t('sidebar.alerts'),
      icon: AlertTriangle,
      color: 'text-red-400',
      badge: alertsCount > 0 ? alertsCount.toString() : undefined,
      allowedRoles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.DRIVER],
    },
  ];

  const bottomItems: NavigationItem[] = [
    {
      id: 'profile',
      label: t('sidebar.profile'),
      icon: User,
      href: '/portal/profile',
      color: 'text-gray-400',
      allowedRoles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.CLIENT, ROLES.DRIVER],
    },
    {
      id: 'team',
      label: t('sidebar.team'),
      icon: Users,
      href: '/team',
      color: 'text-gray-400',
      allowedRoles: [ROLES.ADMIN, ROLES.MANAGER],
    },
    {
      id: 'support',
      label: t('sidebar.support'),
      icon: LifeBuoy,
      href: '/support',
      color: 'text-gray-400',
      allowedRoles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.CLIENT, ROLES.DRIVER],
    },
    {
      id: 'settings',
      label: t('sidebar.settings'),
      icon: Settings,
      href: '/settings',
      color: 'text-gray-400',
      allowedRoles: [ROLES.ADMIN],
    },
  ];

  // Filter items based on user roles
  const filteredNavigationItems = navigationItems.filter(item => hasRole(item.allowedRoles));
  const filteredBottomItems = bottomItems.filter(item => hasRole(item.allowedRoles));

  // Handle sidebar toggle animation
  useEffect(() => {
    if (sidebarRef.current && mounted) {
      animateSidebarToggle(sidebarRef.current, isOpen);
    }
  }, [isOpen, mounted]);

  // Animate menu items on mount
  useEffect(() => {
    setMounted(true);
    if (sidebarRef.current) {
      const menuItems = sidebarRef.current.querySelectorAll('[data-menu-item]');
      animateMenuItemsEntrance(menuItems as NodeListOf<HTMLElement>);
    }
  }, []);

  // Toggle collapsible item
  const toggleCollapsible = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Check if item is active
  const isItemActive = (item: NavigationItem): boolean => {
    if (item.href && location.pathname === item.href) return true;
    if (item.children) {
      return item.children.some(child => child.href && location.pathname === child.href);
    }
    return false;
  };

  // Render navigation item
  const renderNavigationItem = (item: NavigationItem, isChild = false) => {
    const isActive = isItemActive(item);
    const isExpanded = expandedItems.includes(item.id);
    const IconComponent = item.icon;

    // Handle special cases
    if (item.id === 'alerts' && onAlertsClick) {
      return (
        <TooltipProvider key={item.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={onAlertsClick}
                className={cn(
                  'w-full justify-start gap-3 text-left transition-all duration-200 hover:bg-secondary/50',
                  isActive && 'bg-primary/20 text-primary border-l-2 border-primary',
                  !isOpen && 'justify-center px-2'
                )}
                data-menu-item
              >
                <IconComponent className={cn('h-5 w-5 flex-shrink-0', isActive ? 'text-primary' : item.color)} />
                {isOpen && (
                  <>
                    <span className={cn('flex-1', isActive && 'font-semibold')}>{item.label}</span>
                    {item.badge && (
                      <Badge variant="destructive" className="animate-pulse">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            </TooltipTrigger>
            {!isOpen && (
              <TooltipContent side="right">
                <p>{item.label}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      );
    }

    // Collapsible item
    if (item.isCollapsible && item.children && isOpen) {
      return (
        <Collapsible
          key={item.id}
          open={isExpanded}
          onOpenChange={() => toggleCollapsible(item.id)}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start gap-3 text-left transition-all duration-200 hover:bg-secondary/50',
                isActive && 'bg-primary/20 text-primary',
                !isOpen && 'justify-center px-2'
              )}
              data-menu-item
            >
              <IconComponent className={cn('h-5 w-5 flex-shrink-0', isActive ? 'text-primary' : item.color)} />
              {isOpen && (
                <>
                  <span className={cn('flex-1', isActive && 'font-semibold')}>{item.label}</span>
                  <ChevronRight
                    className={cn(
                      'h-4 w-4 transition-transform duration-200',
                      isExpanded && 'rotate-90'
                    )}
                  />
                </>
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-6 space-y-1 mt-1">
            {item.children.map(child => renderNavigationItem(child, true))}
          </CollapsibleContent>
        </Collapsible>
      );
    }

    // Regular item
    const content = (
      <Button
        variant="ghost"
        className={cn(
          'w-full justify-start gap-3 text-left transition-all duration-200 hover:bg-secondary/50',
          isActive && 'bg-primary/20 text-primary border-l-2 border-primary',
          !isOpen && 'justify-center px-2',
          isChild && 'text-sm'
        )}
        data-menu-item
      >
        <IconComponent className={cn('h-5 w-5 flex-shrink-0', isActive ? 'text-primary' : item.color)} />
        {isOpen && (
          <>
            <span className={cn('flex-1', isActive && 'font-semibold')}>{item.label}</span>
            {item.badge && (
              <Badge variant={item.id === 'alerts' ? 'destructive' : 'secondary'}>
                {item.badge}
              </Badge>
            )}
          </>
        )}
      </Button>
    );

    if (item.href) {
      return (
        <TooltipProvider key={item.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to={item.href}>{content}</Link>
            </TooltipTrigger>
            {!isOpen && (
              <TooltipContent side="right">
                <p>{item.label}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <TooltipProvider key={item.id}>
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          {!isOpen && (
            <TooltipContent side="right">
              <p>{item.label}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <aside
      ref={sidebarRef}
      className={cn(
        'fixed left-0 top-16 bottom-0 z-40 bg-card/95 backdrop-blur-xl border-r border-border/50 transition-all duration-300 ease-out',
        isOpen ? 'w-64' : 'w-16',
        isMobile && !isOpen && '-translate-x-full',
        className
      )}
      data-sidebar
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          {isOpen && (
            <div className="flex items-center gap-2" data-animate-child>
              <Logo size="sm" showText={false} />
              <span className="font-semibold text-sm">Navigation</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="hover:bg-primary/10 transition-colors"
          >
            {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>

        {/* Main Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-2">
            {filteredNavigationItems.map(item => renderNavigationItem(item))}
          </nav>
        </ScrollArea>

        {/* Bottom Items */}
        <div className="border-t border-border/50 p-3 space-y-2">
          {filteredBottomItems.map(item => renderNavigationItem(item))}
        </div>

        {/* Status Indicator */}
        <div className="border-t border-border/50 p-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            {isOpen && (
              <span className="text-xs text-muted-foreground" data-animate-child>
                {t('sidebar.systemOnline')}
              </span>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};