import { useState } from "react";
import { Menu, X, BarChart3, Settings, Bell, Search, User, LogOut, Sun, Moon } from "lucide-react";
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
import { useTheme } from "next-themes"; // Assuming next-themes is used for theme switching
import { useTranslation } from "react-i18next";

interface NavbarProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

const Navbar = ({ onToggleSidebar, sidebarOpen }: NavbarProps) => {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme() ?? { theme: 'dark', setTheme: () => {} };

  const notifications = [
    { id: "1", type: "warning", title: t("navbar.notifications.delayedShipment"), description: t("navbar.notifications.delayedShipment.description"), time: "2m" },
    { id: "2", type: "error", title: t("navbar.notifications.blockedRoute"), description: t("navbar.notifications.blockedRoute.description"), time: "15m" },
    { id: "3", type: "info", title: t("navbar.notifications.ceftaDocumentation"), description: t("navbar.notifications.ceftaDocumentation.description"), time: "1h" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50 backdrop-blur-xl">
      <div className="flex items-center justify-between px-6 py-4 h-header">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="hover:bg-primary/10 transition-colors"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          
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
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t('navbar.search.placeholder')} className="pl-10 w-full glass" />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="hidden md:flex hover:bg-primary/10">
            <BarChart3 className="h-4 w-4 mr-2" />
            {t('navbar.analytics')}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative hover:bg-primary/10">
                <Bell className="h-4 w-4" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-xs text-destructive-foreground rounded-full flex items-center justify-center animate-pulse">
                    {notifications.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 glass">
              <DropdownMenuLabel>{t('navbar.notifications')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map(notif => (
                <DropdownMenuItem key={notif.id} className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {notif.type === 'warning' && <Bell className="h-4 w-4 text-warning" />}
                    {notif.type === 'error' && <X className="h-4 w-4 text-destructive" />}
                    {notif.type === 'info' && <Bell className="h-4 w-4 text-primary" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notif.title}</p>
                    <p className="text-xs text-muted-foreground">{notif.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{notif.time}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="hover:bg-primary/10">
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center cursor-pointer">
                <span className="text-sm font-semibold text-primary-foreground">JD</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass">
              <DropdownMenuLabel>{t('navbar.myAccount')}</DropdownMenuLabel>
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
              <DropdownMenuItem>
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