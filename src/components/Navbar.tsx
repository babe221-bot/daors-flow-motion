import { useState } from "react";
import { Menu, X, Truck, BarChart3, Settings, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

const Navbar = ({ onToggleSidebar, sidebarOpen }: NavbarProps) => {
  const [notifications] = useState(3);

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
                src="/lovable-uploads/f1d022d5-0fd3-4e59-bb9b-5e6cfe58fd7e.png" 
                alt="DaorsForge AI Systems"
                className="w-10 h-10 object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold gradient-text">DaorsForge</h1>
              <p className="text-xs text-muted-foreground">AI Sistemi za Logistiku</p>
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="hidden md:flex hover:bg-primary/10">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analitika
          </Button>
          
          <Button variant="ghost" size="sm" className="relative hover:bg-primary/10">
            <Bell className="h-4 w-4" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-xs text-destructive-foreground rounded-full flex items-center justify-center animate-pulse">
                {notifications}
              </span>
            )}
          </Button>
          
          <Button variant="ghost" size="sm" className="hover:bg-primary/10">
            <Settings className="h-4 w-4" />
          </Button>
          
          <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
            <span className="text-sm font-semibold text-primary-foreground">JD</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;