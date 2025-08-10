// Enhanced responsive navbar with search, user menu, and animations
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Logo from '@/components/Logo';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useAuth } from '@/context/AuthContext';
import { useAnimations } from '@/hooks/useAnimations';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { animateSearchExpand } from '@/lib/animations/navigationAnimations';
import { animateHeaderSticky } from '@/lib/animations/layoutAnimations';
import { cn } from '@/lib/utils';
import { NavbarConfig, SearchConfig } from '@/types/navigation';

interface ResponsiveNavbarProps {
  config?: Partial<NavbarConfig>;
  onMenuToggle?: () => void;
  className?: string;
}

const defaultConfig: NavbarConfig = {
  logo: {
    src: '/daorsforge-new-logo.jpg',
    alt: 'DaorsForge Logo',
    href: '/',
    showText: true,
  },
  title: 'DaorsForge',
  subtitle: 'AI Logistics Platform',
  search: {
    enabled: true,
    placeholder: 'Search...',
    showSuggestions: true,
    maxSuggestions: 5,
    searchableFields: ['label', 'href'],
  },
  userMenu: {
    showAvatar: true,
    showName: true,
    showRole: true,
    showNotifications: true,
    notificationCount: 3,
  },
  sticky: true,
  transparent: false,
};

export const ResponsiveNavbar: React.FC<ResponsiveNavbarProps> = ({
  config = {},
  onMenuToggle,
  className,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isMobile } = useResponsiveLayout();
  const { createAnimation, createHoverAnimation } = useAnimations();

  const mergedConfig = { ...defaultConfig, ...config };
  const navbarRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Handle scroll for sticky navbar
  useEffect(() => {
    if (!mergedConfig.sticky) return;

    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled);
        if (navbarRef.current) {
          animateHeaderSticky(navbarRef.current, scrolled);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled, mergedConfig.sticky]);

  // Search functionality
  const handleSearchFocus = () => {
    setSearchExpanded(true);
    setShowSuggestions(true);
    if (searchRef.current) {
      animateSearchExpand(searchRef.current, true);
    }
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setSearchExpanded(false);
      setShowSuggestions(false);
      if (searchRef.current) {
        animateSearchExpand(searchRef.current, false);
      }
    }, 200);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setShowSuggestions(false);
    }
  };

  // Mock search suggestions (replace with actual search logic)
  const searchSuggestions = [
    { label: 'Dashboard', href: '/', icon: 'home' },
    { label: 'Item Tracking', href: '/item-tracking', icon: 'package' },
    { label: 'Live Map', href: '/live-map', icon: 'map' },
    { label: 'Reports', href: '/reports', icon: 'chart' },
    { label: 'Settings', href: '/settings', icon: 'settings' },
  ].filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, mergedConfig.search.maxSuggestions);

  return (
    <header
      ref={navbarRef}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        mergedConfig.sticky && isScrolled
          ? 'bg-background/95 backdrop-blur-md shadow-sm border-b border-border/50'
          : mergedConfig.transparent
          ? 'bg-transparent'
          : 'bg-background border-b border-border/50',
        className
      )}
      data-navbar
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title Section */}
          <div className="flex items-center gap-4">
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onMenuToggle}
                className="hover:bg-primary/10 transition-colors"
                data-animate-child
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            
            <Link
              to={mergedConfig.logo.href}
              className="flex items-center gap-3 group"
              data-animate-child
            >
              <Logo
                size={isMobile ? 'sm' : 'md'}
                showText={!isMobile && mergedConfig.logo.showText}
              />
              {!isMobile && (mergedConfig.title || mergedConfig.subtitle) && (
                <div className="flex flex-col">
                  {mergedConfig.title && (
                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {mergedConfig.title}
                    </span>
                  )}
                  {mergedConfig.subtitle && (
                    <span className="text-xs text-muted-foreground">
                      {mergedConfig.subtitle}
                    </span>
                  )}
                </div>
              )}
            </Link>
          </div>

          {/* Search Section */}
          {mergedConfig.search.enabled && !isMobile && (
            <div className="flex-1 max-w-md mx-8" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={mergedConfig.search.placeholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                    className={cn(
                      'pl-10 pr-4 transition-all duration-300',
                      searchExpanded ? 'w-full' : 'w-64'
                    )}
                    data-search-input
                  />
                </div>

                {/* Search Suggestions */}
                {showSuggestions && searchQuery && searchSuggestions.length > 0 && (
                  <div
                    className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50"
                    data-search-suggestions
                  >
                    {searchSuggestions.map((suggestion, index) => (
                      <Link
                        key={index}
                        to={suggestion.href}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg"
                        onClick={() => {
                          setSearchQuery('');
                          setShowSuggestions(false);
                        }}
                      >
                        <span className="text-sm font-medium">{suggestion.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            {!isMobile && <LanguageSwitcher variant="compact" />}

            {/* Notifications */}
            {mergedConfig.userMenu.showNotifications && user && (
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-primary/10 transition-colors"
                data-animate-child
              >
                <Bell className="h-5 w-5" />
                {mergedConfig.userMenu.notificationCount && mergedConfig.userMenu.notificationCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs animate-pulse"
                  >
                    {mergedConfig.userMenu.notificationCount}
                  </Badge>
                )}
              </Button>
            )}

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 hover:bg-primary/10 transition-colors"
                    data-animate-child
                  >
                    {mergedConfig.userMenu.showAvatar && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    {!isMobile && mergedConfig.userMenu.showName && (
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">{user.name || user.email}</span>
                        {mergedConfig.userMenu.showRole && (
                          <span className="text-xs text-muted-foreground capitalize">
                            {user.role}
                          </span>
                        )}
                      </div>
                    )}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user.name || user.email}</span>
                      <span className="text-xs text-muted-foreground font-normal capitalize">
                        {user.role}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/portal/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {t('navbar.profile', 'Profile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      {t('navbar.settings', 'Settings')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="flex items-center gap-2 text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    {t('navbar.logout', 'Logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">{t('navbar.login', 'Login')}</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">{t('navbar.signup', 'Sign Up')}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};