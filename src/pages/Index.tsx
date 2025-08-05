import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { 
  Truck, 
  DollarSign, 
  Clock, 
  Shield,
  MapPin,
  Globe
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import MetricCard from "@/components/MetricCard";
import AnimatedChart from "@/components/AnimatedChart";
import VideoBackground from "@/components/VideoBackground";
import AlertsPanel from "@/components/AlertsPanel";
import EnhancedFeatures from "@/components/EnhancedFeatures";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { getMetricData, getShipmentData, getRevenueData, getRouteData, getLiveRoutes } from "@/lib/api";
import { MetricData, ChartData, LiveRoute } from "@/lib/types";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [metricData, setMetricData] = useState<MetricData | null>(null);
  const [shipmentData, setShipmentData] = useState<ChartData[]>([]);
  const [revenueData, setRevenueData] = useState<ChartData[]>([]);
  const [routeData, setRouteData] = useState<ChartData[]>([]);
  const [liveRoutes, setLiveRoutes] = useState<LiveRoute[]>([]);

  // Simulate login after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => setIsAuthenticated(true), 2000);
    getMetricData().then((data) => setMetricData(data));
    getShipmentData().then((data) => setShipmentData(data));
    getRevenueData().then((data) => setRevenueData(data));
    getRouteData().then((data) => setRouteData(data));
    getLiveRoutes().then((data) => setLiveRoutes(data));
    return () => clearTimeout(timer);
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aktivna": return "bg-primary text-primary-foreground";
      case "završena": return "bg-success text-success-foreground";
      case "kašnjenje": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const generateHistoricalData = (baseValue: number, days = 30) => {
    return Array.from({ length: days }, (_, i) => ({
      label: `Dan ${i + 1}`,
      value: baseValue + (Math.random() - 0.5) * baseValue * 0.2 + i * Math.random() * 2,
      color: 'bg-primary'
    }));
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <VideoBackground videoSrc="https://www.w3schools.com/html/mov_bbb.mp4" />
      <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/80 to-background/90 z-10" />
      
      <div className="relative z-20">
        <Navbar 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          sidebarOpen={sidebarOpen} 
        />
        
        <Sidebar 
          isOpen={sidebarOpen} 
        />
        
        <main className={cn("transition-all duration-300 pt-header", sidebarOpen ? "ml-64" : "ml-16")}>
          <div className="p-6 space-y-6">
            <div className="space-y-2 animate-slide-up-fade">
              <h1 className="text-3xl font-bold gradient-text">Logistička inteligencija Zapadnog Balkana</h1>
              <p className="text-muted-foreground">Optimizacija logistike u realnom vremenu pomoću AI-ja kroz CEFTA trgovinske rute</p>
            </div>

            {/* ... rest of the component remains unchanged ... */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metricData && (
                <>
                  <Dialog>
                    <DialogTrigger asChild>
                      <div>
                        <MetricCard title="Aktivne pošiljke" value={metricData.activeShipments.value} change={metricData.activeShipments.change} changeType={metricData.activeShipments.changeType} icon={Truck} delay={100} />
                      </div>
                    </DialogTrigger>
                    <DialogContent className="glass">
                      <DialogHeader>
                        <DialogTitle>Istorijski podaci za: Aktivne pošiljke</DialogTitle>
                      </DialogHeader>
                      <AnimatedChart title="Posljednjih 30 dana" data={generateHistoricalData(metricData.activeShipments.value)} type="line" />
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <div>
                        <MetricCard title="Ukupni prihod" value={metricData.totalRevenue.value} change={metricData.totalRevenue.change} changeType={metricData.totalRevenue.changeType} icon={DollarSign} delay={200} currency="€" />
                      </div>
                    </DialogTrigger>
                    <DialogContent className="glass">
                      <DialogHeader>
                        <DialogTitle>Istorijski podaci za: Ukupni prihod</DialogTitle>
                      </DialogHeader>
                      <AnimatedChart title="Posljednjih 30 dana" data={generateHistoricalData(metricData.totalRevenue.value)} type="line" />
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <div>
                        <MetricCard title="Dostava na vrijeme" value={metricData.onTimeDelivery.value} change={metricData.onTimeDelivery.change} changeType={metricData.onTimeDelivery.changeType} icon={Clock} delay={300} currency="%" />
                      </div>
                    </DialogTrigger>
                    <DialogContent className="glass">
                      <DialogHeader>
                        <DialogTitle>Istorijski podaci za: Dostava na vrijeme</DialogTitle>
                      </DialogHeader>
                      <AnimatedChart title="Posljednjih 30 dana" data={generateHistoricalData(metricData.onTimeDelivery.value)} type="line" />
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <div>
                        <MetricCard title="Granični prelazi" value={metricData.borderCrossings.value} change={metricData.borderCrossings.change} changeType={metricData.borderCrossings.changeType} icon={Shield} delay={400} />
                      </div>
                    </DialogTrigger>
                    <DialogContent className="glass">
                      <DialogHeader>
                        <DialogTitle>Istorijski podaci za: Granični prelazi</DialogTitle>
                      </DialogHeader>
                      <AnimatedChart title="Posljednjih 30 dana" data={generateHistoricalData(metricData.borderCrossings.value)} type="line" />
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatedChart title="Distribucija statusa pošiljki" data={shipmentData} type="donut" delay={500} />
              <AnimatedChart title="Mjesečni trend prihoda (€000)" data={revenueData} type="line" delay={600} />
              <AnimatedChart title="Popularne trgovinske rute" data={routeData} type="bar" delay={700} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass hover-lift transition-all duration-300 animate-slide-up-fade" style={{ animationDelay: "800ms" }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" /> Praćenje ruta uživo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {liveRoutes.map((route, index) => (
                    <div key={route.id} className="p-3 rounded-lg border border-border/50 bg-gradient-card hover-lift transition-all duration-200" style={{ animationDelay: `${900 + index * 100}ms` }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(route.status)}>{route.status}</Badge>
                          <span className="font-medium text-sm">{route.id}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{route.eta}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>{route.from} → {route.to}</span>
                        <span className="text-muted-foreground">Vozač: {route.driver}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Napredak</span>
                          <span>{route.progress}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-primary rounded-full transition-all duration-1000 ease-out" style={{ width: `${route.progress}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <div className="animate-slide-up-fade" style={{ animationDelay: "900ms" }}>
                <AlertsPanel />
              </div>
            </div>

            <Card className="glass hover-lift transition-all duration-300 animate-slide-up-fade" style={{ animationDelay: "1000ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" /> Pregled trgovine Zapadnog Balkana
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-primary">7</div>
                    <div className="text-sm text-muted-foreground">CEFTA države</div>
                    <div className="text-xs text-muted-foreground">Srbija, Bosna, Crna Gora, S. Makedonija, Albanija, Moldavija, Kosovo</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-success">€2.8B</div>
                    <div className="text-sm text-muted-foreground">Godišnji obim trgovine</div>
                    <div className="text-xs text-muted-foreground">Obrađeno kroz DaorsForge mrežu</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-warning">145</div>
                    <div className="text-sm text-muted-foreground">Granični prelazi</div>
                    <div className="text-xs text-muted-foreground">AI-optimizovana carinska obrada</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8">
              <EnhancedFeatures />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;