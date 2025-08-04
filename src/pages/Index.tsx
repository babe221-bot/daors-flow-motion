import { useState } from "react";
import { 
  Truck, 
  Package, 
  DollarSign, 
  TrendingUp, 
  MapPin, 
  Clock, 
  Shield,
  BarChart3,
  Users,
  Globe
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import MetricCard from "@/components/MetricCard";
import AnimatedChart from "@/components/AnimatedChart";
import ParticleBackground from "@/components/ParticleBackground";
import AlertsPanel from "@/components/AlertsPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import heroImage from "@/assets/hero-logistics.jpg";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  const shipmentData = [
    { label: "In Transit", value: 156, color: "bg-primary" },
    { label: "Delivered", value: 243, color: "bg-success" },
    { label: "Pending", value: 67, color: "bg-warning" },
    { label: "Delayed", value: 12, color: "bg-destructive" }
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
    { label: "Serbia-Bosnia", value: 35, color: "bg-blue-500" },
    { label: "Croatia-Slovenia", value: 28, color: "bg-green-500" },
    { label: "North Macedonia-Albania", value: 22, color: "bg-purple-500" },
    { label: "Montenegro-Kosovo", value: 15, color: "bg-orange-500" }
  ];

  const liveRoutes = [
    { 
      id: "RT-001", 
      from: "Belgrade", 
      to: "Sarajevo", 
      status: "active", 
      progress: 67,
      eta: "2h 15m",
      driver: "Miloš P."
    },
    { 
      id: "RT-002", 
      from: "Zagreb", 
      to: "Ljubljana", 
      status: "completed", 
      progress: 100,
      eta: "Delivered",
      driver: "Ana K."
    },
    { 
      id: "RT-003", 
      from: "Skopje", 
      to: "Tirana", 
      status: "delayed", 
      progress: 23,
      eta: "4h 30m",
      driver: "Stefan V."
    },
    { 
      id: "RT-004", 
      from: "Podgorica", 
      to: "Pristina", 
      status: "active", 
      progress: 89,
      eta: "45m",
      driver: "Marko D."
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-primary text-primary-foreground";
      case "completed": return "bg-success text-success-foreground";
      case "delayed": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ParticleBackground />
      
      {/* Hero section with background image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.3) contrast(1.2)',
        }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/80 to-background/90 z-10" />
      
      <div className="relative z-20">
        <Navbar 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          sidebarOpen={sidebarOpen} 
        />
        
        <Sidebar 
          isOpen={sidebarOpen} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        
        <main className={cn(
          "transition-all duration-300 pt-header",
          sidebarOpen ? "ml-64" : "ml-16"
        )}>
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="space-y-2 animate-slide-up-fade">
              <h1 className="text-3xl font-bold gradient-text">
                Western Balkans Supply Chain Intelligence
              </h1>
              <p className="text-muted-foreground">
                Real-time logistics optimization powered by AI across CEFTA trade routes
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Active Shipments"
                value={478}
                change="+12% from last week"
                changeType="positive"
                icon={Truck}
                delay={100}
              />
              <MetricCard
                title="Total Revenue"
                value={125840}
                change="+8.2% from last month"
                changeType="positive"
                icon={DollarSign}
                delay={200}
                currency="€"
              />
              <MetricCard
                title="On-Time Delivery"
                value="94.8"
                change="+2.1% improvement"
                changeType="positive"
                icon={Clock}
                delay={300}
                currency="%"
              />
              <MetricCard
                title="Border Crossings"
                value={1247}
                change="23 active checkpoints"
                changeType="neutral"
                icon={Shield}
                delay={400}
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatedChart
                title="Shipment Status Distribution"
                data={shipmentData}
                type="donut"
                delay={500}
              />
              <AnimatedChart
                title="Monthly Revenue Trend (€000)"
                data={revenueData}
                type="line"
                delay={600}
              />
              <AnimatedChart
                title="Popular Trade Routes"
                data={routeData}
                type="bar"
                delay={700}
              />
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Live Routes */}
              <Card className="glass hover-lift transition-all duration-300 animate-slide-up-fade" style={{ animationDelay: "800ms" }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Live Route Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {liveRoutes.map((route, index) => (
                    <div 
                      key={route.id} 
                      className="p-3 rounded-lg border border-border/50 bg-gradient-card hover-lift transition-all duration-200"
                      style={{ animationDelay: `${900 + index * 100}ms` }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(route.status)}>
                            {route.status}
                          </Badge>
                          <span className="font-medium text-sm">{route.id}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{route.eta}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>{route.from} → {route.to}</span>
                        <span className="text-muted-foreground">Driver: {route.driver}</span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Progress</span>
                          <span>{route.progress}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-primary rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${route.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Alerts Panel */}
              <div className="animate-slide-up-fade" style={{ animationDelay: "900ms" }}>
                <AlertsPanel />
              </div>
            </div>

            {/* Regional Stats */}
            <Card className="glass hover-lift transition-all duration-300 animate-slide-up-fade" style={{ animationDelay: "1000ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Western Balkans Trade Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-primary">7</div>
                    <div className="text-sm text-muted-foreground">CEFTA Countries</div>
                    <div className="text-xs text-muted-foreground">Serbia, Bosnia, Montenegro, N. Macedonia, Albania, Moldova, Kosovo</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-success">€2.8B</div>
                    <div className="text-sm text-muted-foreground">Annual Trade Volume</div>
                    <div className="text-xs text-muted-foreground">Processed through DaorsLink network</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-warning">145</div>
                    <div className="text-sm text-muted-foreground">Border Crossings</div>
                    <div className="text-xs text-muted-foreground">AI-optimized customs processing</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;