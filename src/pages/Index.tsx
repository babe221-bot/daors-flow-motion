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
import heroImage from "@/assets/hero-logistics.jpg";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Simulate login after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => setIsAuthenticated(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Mock data for charts
  const shipmentData = [
    { label: t("shipment.status.inTransit"), value: 156, color: "bg-primary" },
    { label: t("shipment.status.delivered"), value: 243, color: "bg-success" },
    { label: t("shipment.status.pending"), value: 67, color: "bg-warning" },
    { label: t("shipment.status.delayed"), value: 12, color: "bg-destructive" }
  ];

  const revenueData = [
    { label: "Jan", value: 65, color: "bg-primary" },
    { label: "Feb", value: 78, color: "bg-primary" },
    { label: "Mar", value: 92, color: "bg-primary" },
    { label: "Apr", value: 85, color: "bg-primary" },
    { label: "May", value: 99, color: "bg-primary" },
    { label: "Jun", value: 105, color: "bg-primary" }
  ];

  const routeData = [
    { label: "Srbija-Bosna", value: 35, color: "bg-blue-500" },
    { label: "Hrvatska-Slovenija", value: 28, color: "bg-green-500" },
    { label: "S.Makedonija-Albanija", value: 22, color: "bg-purple-500" },
    { label: "Crna Gora-Kosovo", value: 15, color: "bg-orange-500" }
  ];

  const liveRoutes = [
    { id: "RT-001", from: "Beograd", to: "Sarajevo", status: "aktivna", progress: 67, eta: "2s 15m", driver: "Miloš P." },
    { id: "RT-002", from: "Zagreb", to: "Ljubljana", status: "završena", progress: 100, eta: "Dostavljeno", driver: "Ana K." },
    { id: "RT-003", from: "Skoplje", to: "Tirana", status: "kašnjenje", progress: 23, eta: "4s 30m", driver: "Stefan V." },
    { id: "RT-004", from: "Podgorica", to: "Pristina", status: "aktivna", progress: 89, eta: "45m", driver: "Marko D." }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case t("route.status.active"): return "bg-primary text-primary-foreground";
      case t("route.status.finished"): return "bg-success text-success-foreground";
      case t("route.status.delayed"): return "bg-destructive text-destructive-foreground";
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
              <h1 className="text-3xl font-bold gradient-text">{t('index.title')}</h1>
              <p className="text-muted-foreground">{t('index.description')}</p>
            </div>

            {/* ... rest of the component remains unchanged ... */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Dialog>
                <DialogTrigger asChild>
                  <div>
                    <MetricCard title={t('index.activeShipments')} value={478} change={t('index.activeShipments.change')} changeType="positive" icon={Truck} delay={100} />
                  </div>
                </DialogTrigger>
                <DialogContent className="glass">
                  <DialogHeader>
                    <DialogTitle>{t('index.historicalDataFor')}: {t('index.activeShipments')}</DialogTitle>
                  </DialogHeader>
                  <AnimatedChart title={t('index.last30days')} data={generateHistoricalData(478)} type="line" />
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <div>
                    <MetricCard title={t('index.totalRevenue')} value={125840} change={t('index.totalRevenue.change')} changeType="positive" icon={DollarSign} delay={200} currency="€" />
                  </div>
                </DialogTrigger>
                <DialogContent className="glass">
                  <DialogHeader>
                    <DialogTitle>{t('index.historicalDataFor')}: {t('index.totalRevenue')}</DialogTitle>
                  </DialogHeader>
                  <AnimatedChart title={t('index.last30days')} data={generateHistoricalData(125840)} type="line" />
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <div>
                    <MetricCard title={t('index.onTimeDelivery')} value="94.8" change={t('index.onTimeDelivery.change')} changeType="positive" icon={Clock} delay={300} currency="%" />
                  </div>
                </DialogTrigger>
                <DialogContent className="glass">
                  <DialogHeader>
                    <DialogTitle>{t('index.historicalDataFor')}: {t('index.onTimeDelivery')}</DialogTitle>
                  </DialogHeader>
                  <AnimatedChart title={t('index.last30days')} data={generateHistoricalData(94.8)} type="line" />
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <div>
                    <MetricCard title={t('index.borderCrossings')} value={1247} change={t('index.borderCrossings.change')} changeType="neutral" icon={Shield} delay={400} />
                  </div>
                </DialogTrigger>
                <DialogContent className="glass">
                  <DialogHeader>
                    <DialogTitle>{t('index.historicalDataFor')}: {t('index.borderCrossings')}</DialogTitle>
                  </DialogHeader>
                  <AnimatedChart title={t('index.last30days')} data={generateHistoricalData(1247)} type="line" />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatedChart title={t('index.shipmentStatusDistribution')} data={shipmentData} type="donut" delay={500} />
              <AnimatedChart title={t('index.monthlyRevenueTrend')} data={revenueData} type="line" delay={600} />
              <AnimatedChart title={t('index.popularTradeRoutes')} data={routeData} type="bar" delay={700} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass hover-lift transition-all duration-300 animate-slide-up-fade" style={{ animationDelay: "800ms" }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" /> {t('index.liveRouteTracking')}
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
                        <span className="text-muted-foreground">{t('route.driver')}: {route.driver}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>{t('route.progress')}</span>
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
                  <Globe className="h-5 w-5 text-primary" /> {t('index.westernBalkanTradeOverview')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-primary">7</div>
                    <div className="text-sm text-muted-foreground">{t('index.ceftaCountries')}</div>
                    <div className="text-xs text-muted-foreground">{t('index.ceftaCountries.list')}</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-success">€2.8B</div>
                    <div className="text-sm text-muted-foreground">{t('index.annualTradeVolume')}</div>
                    <div className="text-xs text-muted-foreground">{t('index.annualTradeVolume.description')}</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-warning">145</div>
                    <div className="text-sm text-muted-foreground">{t('index.borderCrossings.count')}</div>
                    <div className="text-xs text-muted-foreground">{t('index.borderCrossings.description')}</div>
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