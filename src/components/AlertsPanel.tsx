import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, Clock, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  type: "warning" | "error" | "info" | "success";
  title: string;
  description: string;
  timestamp: string;
  priority: "high" | "medium" | "low";
}

const AlertsPanel = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      type: "warning",
      title: "Zakašnjela pošiljka",
      description: "Pošiljka BG-2024-001 kasni 2 sata zbog granične kontrole u Dimitrovgradu",
      timestamp: "prije 2 min",
      priority: "high"
    },
    {
      id: "2",
      type: "error",
      title: "Blokirana ruta",
      description: "Predložena alternativna ruta za pošiljku u Sarajevo. Potrebna EU carinska dokumentacija.",
      timestamp: "prije 15 min",
      priority: "high"
    },
    {
      id: "3",
      type: "info",
      title: "CEFTA dokumentacija",
      description: "Nove promjene trgovinskog sporazuma za RS-BA koridor. Potreban pregled.",
      timestamp: "prije 1 sat",
      priority: "medium"
    },
    {
      id: "4",
      type: "success",
      title: "Dostava završena",
      description: "Pošiljka MK-2024-089 uspješno isporučena u logistički centar Skopje",
      timestamp: "prije 2 sata",
      priority: "low"
    }
  ]);

  const [visibleAlerts, setVisibleAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Stagger alert animations
    alerts.forEach((alert, index) => {
      setTimeout(() => {
        setVisibleAlerts(prev => [...prev, alert]);
      }, index * 150);
    });
  }, [alerts]);

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
    setVisibleAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-success" />;
      default:
        return <Clock className="h-4 w-4 text-primary" />;
    }
  };

  const getAlertColor = (type: Alert["type"]) => {
    switch (type) {
      case "warning":
        return "border-l-warning bg-warning/5";
      case "error":
        return "border-l-destructive bg-destructive/5";
      case "success":
        return "border-l-success bg-success/5";
      default:
        return "border-l-primary bg-primary/5";
    }
  };

  const getPriorityColor = (priority: Alert["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-destructive";
      case "medium":
        return "bg-warning";
      default:
        return "bg-primary";
    }
  };

  return (
    <Card className="glass h-96">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          Uživo upozorenja
          <span className="ml-auto text-sm font-normal text-muted-foreground">
            {alerts.length} aktivnih
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
        {visibleAlerts.map((alert, index) => (
          <div
            key={alert.id}
            className={cn(
              "p-3 rounded-lg border-l-4 transition-all duration-300 hover-lift animate-slide-in-right group",
              getAlertColor(alert.type)
            )}
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                {getAlertIcon(alert.type)}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{alert.title}</h4>
                    <div className={cn("w-2 h-2 rounded-full", getPriorityColor(alert.priority))} />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {alert.description}
                  </p>
                  <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeAlert(alert.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 hover:bg-destructive/20"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
        
        {alerts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="h-8 w-8 text-success mb-2" />
            <p className="text-sm text-muted-foreground">Nema aktivnih upozorenja</p>
            <p className="text-xs text-muted-foreground">Svi sistemi operativni</p>
          </div>
        )}
      </CardContent>
      
    </Card>
  );
};

export default AlertsPanel;