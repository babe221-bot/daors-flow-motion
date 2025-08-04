import { useState, useEffect, useMemo } from "react";
import { AlertTriangle, CheckCircle, Clock, X, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Alert {
  id: string;
  type: "warning" | "error" | "info" | "success";
  title: string;
  description: string;
  timestamp: string;
  priority: "high" | "medium" | "low";
}

const initialAlerts: Alert[] = [
    { id: "1", type: "warning", title: "Zakašnjela pošiljka", description: "Pošiljka BG-2024-001 kasni 2 sata.", timestamp: "prije 2 min", priority: "high" },
    { id: "2", type: "error", title: "Blokirana ruta", description: "Potrebna alternativna ruta za Sarajevo.", timestamp: "prije 15 min", priority: "high" },
    { id: "3", type: "info", title: "CEFTA dokumentacija", description: "Ažurirane promjene trgovinskog sporazuma.", timestamp: "prije 1 sat", priority: "medium" },
    { id: "4", type: "success", title: "Dostava završena", description: "Pošiljka MK-2024-089 isporučena.", timestamp: "prije 2 sata", priority: "low" },
    { id: "5", type: "warning", title: "Niska temperatura", description: "Temperatura u hladnjači #3 pala ispod praga.", timestamp: "prije 3 sata", priority: "medium" },
];

const AlertsPanel = () => {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">("all");

  const filteredAlerts = useMemo(() => {
    if (filter === "all") return alerts;
    return alerts.filter(alert => alert.priority === filter);
  }, [alerts, filter]);

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const clearAll = () => {
    setAlerts([]);
  };

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "warning": return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "error": return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "success": return <CheckCircle className="h-4 w-4 text-success" />;
      default: return <Clock className="h-4 w-4 text-primary" />;
    }
  };

  const getAlertColor = (type: Alert["type"]) => {
    switch (type) {
      case "warning": return "border-l-warning bg-warning/5";
      case "error": return "border-l-destructive bg-destructive/5";
      case "success": return "border-l-success bg-success/5";
      default: return "border-l-primary bg-primary/5";
    }
  };

  const getPriorityBadge = (priority: Alert["priority"]) => {
    const variant = { high: 'destructive', medium: 'secondary', low: 'outline' }[priority] as const;
    return <Badge variant={variant}>{priority}</Badge>
  };

  return (
    <Card className="glass flex flex-col h-[28rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          Uživo upozorenja
          <Badge className="ml-auto">{alerts.length} aktivnih</Badge>
        </CardTitle>
        <div className="flex items-center gap-2 pt-2">
            <Button size="sm" variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>Sve</Button>
            <Button size="sm" variant={filter === 'high' ? 'destructive' : 'outline'} onClick={() => setFilter('high')}>Visok</Button>
            <Button size="sm" variant={filter === 'medium' ? 'secondary' : 'outline'} onClick={() => setFilter('medium')}>Srednji</Button>
            <Button size="sm" variant={filter === 'low' ? 'outline' : 'outline'} onClick={() => setFilter('low')}>Nizak</Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3 overflow-y-auto custom-scrollbar">
        {filteredAlerts.map((alert, index) => (
          <div key={alert.id} className={cn("p-3 rounded-lg border-l-4 transition-all duration-300 hover-lift animate-slide-in-right group", getAlertColor(alert.type))} style={{ animationDelay: `${index * 100}ms` }}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                {getAlertIcon(alert.type)}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{alert.title}</h4>
                    {getPriorityBadge(alert.priority)}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{alert.description}</p>

                  <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeAlert(alert.id)} className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 hover:bg-destructive/20">
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
        
        {filteredAlerts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center h-full">
            <CheckCircle className="h-8 w-8 text-success mb-2" />
            <p className="text-sm text-muted-foreground">Nema aktivnih upozorenja</p>
            {filter !== 'all' && <p className="text-xs text-muted-foreground">za odabrani filter</p>}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" onClick={clearAll} disabled={alerts.length === 0}>
            <Trash2 className="h-3 w-3 mr-2" />
            Očisti sve
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AlertsPanel;