import { useState, useEffect } from "react";
import { Bell, MessageCircle, Phone, Calendar, Users, Zap, Target, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const EnhancedFeatures = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: "urgent", message: "Novo upozorenje za granični prelaz Šid-Bosanska Rača", time: "2 min" },
    { id: 2, type: "info", message: "CEFTA dokumentacija ažurirana", time: "15 min" },
    { id: 3, type: "success", message: "AI optimizacija rute završena uspješno", time: "30 min" }
  ]);

  const [activeConnections, setActiveConnections] = useState(247);

  const allAiInsights = [
    "Predviđeno kašnjenje na ruti Zagreb-Ljubljana: 30min",
    "Optimalna ruta Beograd-Sarajevo: preko Bijeljine",
    "Carinski promet povećan za 15% u odnosu na prošlu sedmicu",
    "Preporučuje se inspekcija vozila sa registracijom BG-123-456",
    "Visok rizik od gužve na graničnom prelazu Batrovci sutra u 10h",
    "Smanjena potrošnja goriva za 5% na ruti Podgorica-Tirana",
    "Novi propisi za transport opasnih materija stupaju na snagu 01.09.2024.",
    "Najopterećeniji vozač ove sedmice: Petar Petrović (52 sata vožnje)"
  ];

  const [aiInsights, setAiInsights] = useState(allAiInsights.slice(0, 3));


  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setActiveConnections(prev => prev + Math.floor(Math.random() * 10) - 5);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Real-time Communication Hub */}
      <Card className="glass hover-lift transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            Komunikacijski centar uživo
            <Badge className="ml-auto animate-pulse bg-success text-success-foreground">
              {activeConnections} aktivnih
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="flex items-center gap-2 h-16 bg-gradient-primary hover:scale-105 transition-transform" onClick={() => toast.info("Pozivanje 24/7 podrške...")}>
              <Phone className="h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">Hitni kontakt</div>
                <div className="text-xs opacity-80">24/7 podrška</div>
              </div>
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2 h-16 hover:scale-105 transition-transform" onClick={() => toast.success("Sastanak sa logističkim timom je uspješno zakazan!")}>
              <Calendar className="h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">Zakaži sastanak</div>
                <div className="text-xs text-muted-foreground">Logistički tim</div>
              </div>
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2 h-16 hover:scale-105 transition-transform" onClick={() => toast.message("Otvaranje timskog chata...")}>
              <Users className="h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">Timski chat</div>
                <div className="text-xs text-muted-foreground">12 članova online</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="glass hover-lift transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-warning animate-pulse" />
            AI Uvidi i preporuke
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {aiInsights.map((insight, index) => (
            <div 
              key={index}
              className="p-3 rounded-lg bg-gradient-card border border-border/50 hover-lift transition-all duration-200"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex items-start gap-3">
                <Target className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                <span className="text-sm">{insight}</span>
              </div>
            </div>
          ))}
          
          <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full mt-4 hover:bg-primary/10">
                    Prikaži sve AI preporuke
                </Button>
            </DialogTrigger>
            <DialogContent className="glass">
              <DialogHeader>
                <DialogTitle>Sve AI preporuke</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                {allAiInsights.map((insight, index) => (
                    <div key={index} className="p-3 rounded-lg bg-gradient-card border border-border/50">
                        <div className="flex items-start gap-3">
                            <Target className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                            <span className="text-sm">{insight}</span>
                        </div>
                    </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card className="glass hover-lift transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-success" />
            Performanse sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center space-y-2 p-4 rounded-lg bg-gradient-card">
              <div className="text-2xl font-bold text-primary">99.8%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            
            <div className="text-center space-y-2 p-4 rounded-lg bg-gradient-card">
              <div className="text-2xl font-bold text-success">&lt; 2s</div>
              <div className="text-sm text-muted-foreground">Vrijeme odgovora</div>
            </div>
            
            <div className="text-center space-y-2 p-4 rounded-lg bg-gradient-card">
              <div className="text-2xl font-bold text-warning">15,847</div>
              <div className="text-sm text-muted-foreground">Obrađene pošiljke</div>
            </div>
            
            <div className="text-center space-y-2 p-4 rounded-lg bg-gradient-card">
              <div className="text-2xl font-bold text-primary">97.2%</div>
              <div className="text-sm text-muted-foreground">Zadovoljstvo korisnika</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Feed */}
      <Card className="glass hover-lift transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Najnovija obavještenja
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
          {notifications.map((notification, index) => (
            <div 
              key={notification.id}
              className={cn(
                "p-3 rounded-lg border-l-4 transition-all duration-300 hover-lift",
                notification.type === "urgent" && "border-l-destructive bg-destructive/5",
                notification.type === "info" && "border-l-primary bg-primary/5",
                notification.type === "success" && "border-l-success bg-success/5"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm flex-1">{notification.message}</span>
                <span className="text-xs text-muted-foreground whitespace-nowrap">prije {notification.time}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedFeatures;