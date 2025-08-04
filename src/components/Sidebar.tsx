import { useState } from "react";
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
  TrendingUp,
  ChevronRight,
  ClipboardList,
  TrafficCone,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SubItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface MenuItem {
  id: string;
  label:string;
  icon: React.ElementType;
  color: string;
  subItems?: SubItem[];
}

interface SidebarProps {
  isOpen: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar = ({ isOpen, activeTab, onTabChange }: SidebarProps) => {
  const [openCollapsibles, setOpenCollapsibles] = useState<string[]>([]);

  const toggleCollapsible = (id: string) => {
    setOpenCollapsibles(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const menuItems: MenuItem[] = [
    { id: "dashboard", label: "Kontrolna tabla", icon: Home, color: "text-primary" },
    { id: "shipments", label: "Pošiljke", icon: Truck, color: "text-blue-400" },
    { id: "inventory", label: "Inventar", icon: Package, color: "text-green-400" },
    {
      id: "analytics",
      label: "Analitika",
      icon: BarChart3,
      color: "text-purple-400",
      subItems: [
        { id: "analytics-traffic", label: "Saobraćaj", icon: TrafficCone },
        { id: "analytics-revenue", label: "Prihodi", icon: DollarSign },
        { id: "analytics-reports", label: "Izvještaji", icon: FileText },
      ]
    },
    { id: "tracking", label: "Praćenje", icon: MapPin, color: "text-orange-400" },
    {
      id: "finance",
      label: "Finansije",
      icon: DollarSign,
      color: "text-yellow-400",
      subItems: [
        { id: "finance-invoices", label: "Fakture", icon: ClipboardList },
        { id: "finance-expenses", label: "Troškovi", icon: TrendingUp },
      ]
    },
    { id: "alerts", label: "Upozorenja", icon: AlertTriangle, color: "text-red-400" },
  ];

  const bottomItems = [
    { id: "team", label: "Tim", icon: Users },
    { id: "settings", label: "Postavke", icon: Settings },
  ];

  const renderMenuItem = (item: MenuItem, index: number) => {
    const isActive = activeTab === item.id || (item.subItems && item.subItems.some(sub => sub.id === activeTab));
    const isCollapsibleOpen = openCollapsibles.includes(item.id);

    if (item.subItems && isOpen) {
      return (
        <Collapsible key={item.id} open={isCollapsibleOpen} onOpenChange={() => toggleCollapsible(item.id)}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 text-left transition-all duration-200 hover-lift",
                isActive && "bg-primary/20 text-primary",
                !isOpen && "justify-center px-2"
              )}
            >
              <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-primary" : item.color)} />
              {isOpen && <span className={cn("flex-1", isActive && "font-semibold")}>{item.label}</span>}
              {isOpen && <ChevronRight className={cn("h-4 w-4 transition-transform", isCollapsibleOpen && "rotate-90")} />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-6 space-y-1 mt-1">
            {item.subItems.map(subItem => {
              const isSubActive = activeTab === subItem.id;
              return (
                <Button
                  key={subItem.id}
                  variant="ghost"
                  onClick={() => onTabChange(subItem.id)}
                  className={cn(
                    "w-full justify-start gap-3 text-left transition-all duration-200",
                    isSubActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <subItem.icon className="h-4 w-4 flex-shrink-0" />
                  <span>{subItem.label}</span>
                </Button>
              );
            })}
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <Button
        key={item.id}
        variant="ghost"
        onClick={() => onTabChange(item.id)}
        className={cn(
          "w-full justify-start gap-3 text-left transition-all duration-200 hover-lift",
          isActive ? "bg-primary/20 text-primary border border-primary/30 shadow-glow" : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground",
          !isOpen && "justify-center px-2"
        )}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-primary" : item.color)} />
        {isOpen && <span className={cn("transition-opacity duration-200", isActive && "font-semibold")}>{item.label}</span>}
        {!isOpen && isActive && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-card border border-border rounded-md text-sm whitespace-nowrap animate-slide-in-right">
            {item.label}
          </div>
        )}
      </Button>
    );
  };

  return (
    <aside 
      className={cn(
        "fixed left-0 top-header bottom-0 z-40 glass border-r border-border/50 backdrop-blur-xl transition-all duration-300 ease-smooth",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex flex-col h-full p-4">
        <nav className="flex-1 space-y-2">
          {menuItems.map(renderMenuItem)}
        </nav>

        <div className="space-y-2 pt-4 border-t border-border/50">
          {bottomItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full justify-start gap-3 text-left transition-all duration-200",
                  isActive ? "bg-primary/20 text-primary" : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground",
                  !isOpen && "justify-center px-2"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {isOpen && <span>{item.label}</span>}
              </Button>
            );
          })}
        </div>

        <div className={cn("mt-4 pt-4 border-t border-border/50", !isOpen && "text-center")}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse-glow"></div>
            {isOpen && <span className="text-xs text-muted-foreground">Sistem Online</span>}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;