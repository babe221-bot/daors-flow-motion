import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Truck, 
  Package, 
  BarChart3, 
  MapPin, 
  Users, 
  Settings,
  DollarSign,
  AlertTriangle,
  Clock,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const location = useLocation();
  const menuItems = [
    { path: "/", label: "Kontrolna tabla", icon: Home, color: "text-primary" },
    { path: "/item-tracking", label: "Praćenje artikala", icon: Package, color: "text-green-400" },
    { path: "/shipments", label: "Pošiljke", icon: Truck, color: "text-blue-400" },
    { path: "/analytics", label: "Analitika", icon: BarChart3, color: "text-purple-400" },
    { path: "/tracking", label: "Praćenje", icon: MapPin, color: "text-orange-400" },
    { path: "/finance", label: "Finansije", icon: DollarSign, color: "text-yellow-400" },
    { path: "/alerts", label: "Upozorenja", icon: AlertTriangle, color: "text-red-400" },
    { path: "/reports", label: "Izvještaji", icon: TrendingUp, color: "text-pink-400" },
  ];

  const bottomItems = [
    { id: "team", label: "Tim", icon: Users },
    { id: "settings", label: "Postavke", icon: Settings },
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-header bottom-0 z-40 glass border-r border-border/50 backdrop-blur-xl transition-all duration-300 ease-smooth",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex flex-col h-full p-4">
        {/* Main Navigation */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link to={item.path} key={item.path}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 text-left transition-all duration-200 hover-lift",
                    isActive
                      ? "bg-primary/20 text-primary border border-primary/30 shadow-glow"
                      : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground",
                    !isOpen && "justify-center px-2"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-primary" : item.color)} />
                  {isOpen && (
                    <span className={cn("transition-opacity duration-200", isActive && "font-semibold")}>
                      {item.label}
                    </span>
                  )}
                  {!isOpen && isActive && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-card border border-border rounded-md text-sm whitespace-nowrap animate-slide-in-right">
                      {item.label}
                    </div>
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="space-y-2 pt-4 border-t border-border/50">
          {bottomItems.map((item) => {
            const isActive = false; // Not used for navigation
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 text-left transition-all duration-200",
                  "hover:bg-secondary/50 text-muted-foreground hover:text-foreground",
                  !isOpen && "justify-center px-2"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {isOpen && <span>{item.label}</span>}
              </Button>
            );
          })}
        </div>

        {/* Status indicator */}
        <div className={cn("mt-4 pt-4 border-t border-border/50", !isOpen && "text-center")}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse-glow"></div>
            {isOpen && (
              <span className="text-xs text-muted-foreground">Sistem Online</span>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;