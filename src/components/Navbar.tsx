import { useState, useMemo } from "react";
import { Menu, X, BarChart3, Settings, Search, User, LogOut, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getNotifications } from "@/lib/api";
import NotificationCenter from "./NotificationCenter";
import MobileNav from "./MobileNav";
import GlobalSearch from "./GlobalSearch";
import { useAuth } from "@/context/AuthContext";
import { Notification } from "@/lib/types";

interface NavbarProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

const Navbar = ({ onToggleSidebar, sidebarOpen }: NavbarProps) => {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme() ?? { theme: 'dark', setTheme: () => {} };
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: getNotifications,
  });

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  const handleMarkAllAsRead = () => {
    queryClient.setQueryData(['notifications'], (oldData: Notification[] = []) =>
      oldData.map(n => ({ ...n, read: true }))
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50 backdrop-blur-xl">
      <div className="flex items-center justify-between px-6 py-4 h-header">
        {/* Left section */}
        <div className="flex items-center gap-4">
          {/* Desktop sidebar toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="hidden md:flex hover:bg-primary/10 transition-colors"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          
          {/* Mobile navigation */}
          <MobileNav />
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <img 
                src="/lovable-uploads/logo.jpg"
                alt="DaorsForge AI Systems"
                className="w-10 h-10 object-contain mix-blend-plus-lighter"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold gradient-text">DaorsForge</h1>
              <p className="text-xs text-muted-foreground">{t('navbar.logisticsAiSystems')}</p>
            </div>
          </div>
        </div>

        {/* Middle section - Search */}
        <div className="hidden md:flex flex-1 justify-center px-8">
          <GlobalSearch 
            className="w-full max-w-md"
            placeholder={t('navbar.search.placeholder', 'Search packages, locations, pages...')}
          />
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="hidden md:flex hover:bg-primary/10">
            <BarChart3 className="h-4 w-4 mr-2" />
            {t('navbar.analytics')}
          </Button>
          
          <NotificationCenter
            notifications={notifications}
            unreadCount={unreadCount}
            onMarkAllAsRead={handleMarkAllAsRead}
          />

          <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="hover:bg-primary/10">
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center cursor-pointer">
                <span className="text-sm font-semibold text-primary-foreground">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass">
              <DropdownMenuLabel>
                {user?.username || t('navbar.myAccount')}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>{t('navbar.profile')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>{t('navbar.settings')}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t('navbar.logout')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;