// Mobile-optimized navigation with gestures and animations
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Menu,
  X,
  Home,
  Package,
  MapPin,
  BarChart3,
  Settings,
  ChevronRight,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Logo from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';
import { useAnimations } from '@/hooks/useAnimations';
import { animateMobileMenuSlide } from '@/lib/animations/navigationAnimations';
import { cn } from '@/lib/utils';
import { NavigationItem, MobileNavConfig } from '@/types/navigation';
import { ROLES } from '@/lib/types';

interface MobileNavigationProps {
  config?: Partial<MobileNavConfig>;
  onItemClick?: (item: NavigationItem) => void;
  className?: string;
}

const defaultConfig: MobileNavConfig = {
  swipeGestures: true,
  bottomNavigation: true,
  collapsibleSections: true,
  quickActions: [],
};

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  config = {},
  onItemClick,
  className,
}) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { hasRole } = useAuth();
  const { createAnimation, createStaggeredAnimation } = useAnimations();

  const mergedConfig = { ...defaultConfig, ...config };
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const menuRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Navigation items for mobile
  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: t('sidebar.dashboard'),
      icon: Home,
      href: '/',
      allowedRoles: [ROLES.ADMIN, ROLES.MANAGER],
    },
    {
      id: 'tracking',
      label: t('sidebar.itemTracking'),
      icon: Package,
      href: '/item-tracking',
      allowedRoles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.CLIENT, ROLES.DRIVER],
    },
    {
      id: 'map',
      label: t('sidebar.tracking'),
      icon: MapPin,
      href: '/live-map',
      allowedRoles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.DRIVER],
    },
    {
      id: 'analytics',
      label: t('sidebar.analytics'),
      icon: BarChart3,
      href: '/reports',
      allowedRoles: [ROLES.ADMIN, ROLES.MANAGER],
    },
    {
      id: 'settings',
      label: t('sidebar.settings'),
      icon: Settings,
      href: '/settings',
      allowedRoles: [ROLES.ADMIN],
    },
  ];

  const filteredItems = navigationItems.filter(item => hasRole(item.allowedRoles));

  // Handle menu open/close animations
  useEffect(() => {
    if (menuRef.current) {
      if (isOpen) {
        animateMobileMenuSlide(menuRef.current, true);
        
        // Stagger menu items animation
        setTimeout(() => {
          const items = menuRef.current?.querySelectorAll('[data-mobile-menu-item]');
          if (items) {
            createStaggeredAnimation(
              items as NodeListOf<HTMLElement>,
              {
                opacity: [0, 1],
                translateX: [30, 0],
                duration: 300,
                easing: 'easeOutQuart',
              },
              80
            );
          }
        }, 100);
      } else {
        animateMobileMenuSlide(menuRef.current, false);
      }
    }
  }, [isOpen, createStaggeredAnimation]);

  // Swipe gesture handling
  useEffect(() => {
    if (!mergedConfig.swipeGestures) return;

    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      currentX = e.touches[0].clientX;
      currentY = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      const deltaX = currentX - startX;
      const deltaY = Math.abs(currentY - startY);
      
      // Swipe right to open (from left edge)
      if (deltaX > 50 && deltaY < 100 && startX < 50 && !isOpen) {
        setIsOpen(true);
      }
      
      // Swipe left to close
      if (deltaX < -50 && deltaY < 100 && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isOpen, mergedConfig.swipeGestures]);

  const handleItemClick = (item: NavigationItem) => {
    setIsOpen(false);
    onItemClick?.(item);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  return (
    <>
      {/* Mobile Menu Trigger */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className={cn('md:hidden', className)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={() => setIsOpen(false)}
          data-mobile-overlay
        />
      )}

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={cn(
          'fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-background border-r border-border z-50 transform -translate-x-full md:hidden',
          'transition-transform duration-300 ease-out'
        )}
        data-mobile-menu
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Logo size="sm" showText />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('navigation.search', 'Search...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Navigation Items */}
          <ScrollArea className="flex-1 p-4">
            <nav className="space-y-2">
              {filteredItems
                .filter(item =>
                  !searchQuery ||
                  item.label.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((item, index) => {
                  const isActive = location.pathname === item.href;
                  const IconComponent = item.icon;

                  return (
                    <div key={item.id} data-mobile-menu-item style={{ opacity: 0 }}>
                      {item.href ? (
                        <Link
                          to={item.href}
                          onClick={() => handleItemClick(item)}
                          className={cn(
                            'flex items-center gap-3 p-3 rounded-lg transition-all duration-200',
                            'hover:bg-secondary/50 active:bg-secondary',
                            isActive && 'bg-primary/10 text-primary border border-primary/20'
                          )}
                        >
                          <IconComponent className="h-5 w-5 flex-shrink-0" />
                          <span className="flex-1 font-medium">{item.label}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {item.badge}
                            </Badge>
                          )}
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      ) : (
                        <button
                          onClick={() => toggleSection(item.id)}
                          className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-secondary/50 w-full text-left"
                        >
                          <IconComponent className="h-5 w-5 flex-shrink-0" />
                          <span className="flex-1 font-medium">{item.label}</span>
                          <ChevronRight
                            className={cn(
                              'h-4 w-4 text-muted-foreground transition-transform duration-200',
                              expandedSections.includes(item.id) && 'rotate-90'
                            )}
                          />
                        </button>
                      )}

                      {/* Collapsible children */}
                      {item.children && expandedSections.includes(item.id) && (
                        <div className="ml-8 mt-2 space-y-1">
                          {item.children.map(child => {
                            const isChildActive = location.pathname === child.href;
                            const ChildIcon = child.icon;

                            return (
                              <Link
                                key={child.id}
                                to={child.href || '#'}
                                onClick={() => handleItemClick(child)}
                                className={cn(
                                  'flex items-center gap-3 p-2 rounded-md transition-all duration-200',
                                  'hover:bg-secondary/30 text-sm',
                                  isChildActive && 'bg-primary/5 text-primary'
                                )}
                              >
                                <ChildIcon className="h-4 w-4 flex-shrink-0" />
                                <span>{child.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
            </nav>
          </ScrollArea>

          {/* Quick Actions */}
          {mergedConfig.quickActions.length > 0 && (
            <div className="p-4 border-t border-border">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                {t('navigation.quickActions', 'Quick Actions')}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {mergedConfig.quickActions.map(action => {
                  const ActionIcon = action.icon;
                  return (
                    <Link
                      key={action.id}
                      to={action.href || '#'}
                      onClick={() => handleItemClick(action)}
                      className="flex flex-col items-center gap-2 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                    >
                      <ActionIcon className="h-5 w-5" />
                      <span className="text-xs font-medium text-center">
                        {action.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation (if enabled) */}
      {mergedConfig.bottomNavigation && (
        <BottomNavigation items={filteredItems.slice(0, 4)} />
      )}
    </>
  );
};

// Bottom navigation component
const BottomNavigation: React.FC<{ items: NavigationItem[] }> = ({ items }) => {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border z-40 md:hidden">
      <div className="flex items-center justify-around p-2">
        {items.map(item => {
          const isActive = location.pathname === item.href;
          const IconComponent = item.icon;

          return (
            <Link
              key={item.id}
              to={item.href || '#'}
              className={cn(
                'flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200',
                'hover:bg-secondary/50 min-w-0 flex-1',
                isActive && 'text-primary'
              )}
            >
              <IconComponent className="h-5 w-5 flex-shrink-0" />
              <span className="text-xs font-medium truncate max-w-full">
                {item.label}
              </span>
              {item.badge && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 text-xs p-0 flex items-center justify-center">
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};