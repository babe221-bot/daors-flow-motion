import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import NaviBar from '@/components/NaviBar';
import ParticleBackground from '@/components/ParticleBackground';
import VideoBackground from '@/components/VideoBackground';
import ModernFooter from '@/components/ModernFooter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartLegend } from '@/components/ui/chart';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Bar, BarChart } from 'recharts';
import { 
  BarChart3, 
  Zap, 
  Users, 
  Radar, 
  Route, 
  Shield,
  Package,
  FileText,
  BarChart4,
  UserCheck,
  ArrowUp,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const Dashboard = () => {
  const { t } = useTranslation();

  // Sample data for charts
  const revenueData = [
    { month: 'Jan', revenue: 450, deliveries: 120 },
    { month: 'Feb', revenue: 620, deliveries: 180 },
    { month: 'Mar', revenue: 580, deliveries: 165 },
    { month: 'Apr', revenue: 740, deliveries: 200 },
    { month: 'May', revenue: 820, deliveries: 235 },
    { month: 'Jun', revenue: 950, deliveries: 290 },
  ];

  const deliveryData = [
    { day: 'Mon', onTime: 85, delayed: 15 },
    { day: 'Tue', onTime: 92, delayed: 8 },
    { day: 'Wed', onTime: 88, delayed: 12 },
    { day: 'Thu', onTime: 95, delayed: 5 },
    { day: 'Fri', onTime: 90, delayed: 10 },
    { day: 'Sat', onTime: 78, delayed: 22 },
    { day: 'Sun', onTime: 82, delayed: 18 },
  ];

  const features = [
    {
      icon: BarChart3,
      title: t('dashboard.features.analytics.title'),
      description: t('dashboard.features.analytics.description'),
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Zap,
      title: t('dashboard.features.automation.title'),
      description: t('dashboard.features.automation.description'),
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Users,
      title: t('dashboard.features.collaboration.title'),
      description: t('dashboard.features.collaboration.description'),
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Radar,
      title: t('dashboard.features.tracking.title'),
      description: t('dashboard.features.tracking.description'),
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Route,
      title: t('dashboard.features.optimization.title'),
      description: t('dashboard.features.optimization.description'),
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Shield,
      title: t('dashboard.features.security.title'),
      description: t('dashboard.features.security.description'),
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  const metrics = [
    {
      label: 'Monthly Revenue',
      value: '$48,328',
      change: '+15.2%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-500'
    },
    {
      label: 'Active Shipments',
      value: '1,847',
      change: '+8.5%',
      trend: 'up',
      icon: Package,
      color: 'text-blue-500'
    },
    {
      label: 'On-Time Delivery',
      value: '94.2%',
      change: '+2.1%',
      trend: 'up',
      icon: CheckCircle,
      color: 'text-green-500'
    },
    {
      label: 'Active Drivers',
      value: '287',
      change: '+5.8%',
      trend: 'up',
      icon: UserCheck,
      color: 'text-purple-500'
    },
    {
      label: 'Fleet Efficiency',
      value: '87.6%',
      change: '+3.4%',
      trend: 'up',
      icon: Activity,
      color: 'text-orange-500'
    },
    {
      label: 'Avg Response Time',
      value: '2.3min',
      change: '-12%',
      trend: 'down',
      icon: Clock,
      color: 'text-green-500'
    }
  ];

  const quickAccessItems = [
    {
      title: t('dashboard.quickAccess.inventory'),
      description: 'Manage stock levels',
      href: '/inventory',
      icon: Package,
      color: 'from-blue-500/20 to-blue-600/20',
      iconColor: 'text-blue-600'
    },
    {
      title: t('dashboard.quickAccess.shipments'),
      description: 'Track deliveries',
      href: '/item-tracking',
      icon: Route,
      color: 'from-green-500/20 to-green-600/20',
      iconColor: 'text-green-600'
    },
    {
      title: t('dashboard.quickAccess.reports'),
      description: 'View analytics',
      href: '/reports',
      icon: BarChart4,
      color: 'from-purple-500/20 to-purple-600/20',
      iconColor: 'text-purple-600'
    },
    {
      title: t('dashboard.quickAccess.team'),
      description: 'Manage drivers',
      href: '/team',
      icon: Users,
      color: 'from-orange-500/20 to-orange-600/20',
      iconColor: 'text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background Elements */}
      <ParticleBackground />
      
      <NaviBar />
      
      {/* Hero Section with Video Background */}
      <section className="relative min-h-screen flex items-center justify-center">
        <VideoBackground 
          videoSrc="/Whisk_cauajde4m2myzdrmlwfkyzutnduzyi1hngqzltk.mp4"
          fallbackClass="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10"
        />
        
        <div className="relative z-20 container mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-secondary">
              {t('dashboard.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              {t('dashboard.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="text-lg px-10 py-7 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white shadow-2xl hover:shadow-primary/25 transition-all duration-500 transform hover:scale-105">
                {t('dashboard.hero.cta.primary')}
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-10 py-7 rounded-full border-2 border-primary/70 hover:bg-primary/10 backdrop-blur-sm transition-all duration-500 transform hover:scale-105">
                {t('dashboard.hero.cta.secondary')}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Features Grid */}
      <section className="py-24 bg-gradient-to-br from-muted/20 to-muted/40 relative">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              {t('dashboard.features.title')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive logistics solutions powered by cutting-edge AI technology
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group"
                >
                  <Card className="h-full backdrop-blur-xl bg-card/60 hover:bg-card/80 transition-all duration-500 border border-border/50 hover:border-primary/30 shadow-lg hover:shadow-2xl hover:shadow-primary/10">
                    <CardContent className="p-8">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-lg leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Metrics Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t('dashboard.metrics.title')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real-time insights into your logistics operations
            </p>
          </motion.div>
          
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {metrics.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <Card className="bg-card/60 backdrop-blur-sm border border-border/50 hover:border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-primary/10 ${metric.iconColor}`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div className={`flex items-center text-sm font-medium ${metric.color}`}>
                          <ArrowUp className={`h-4 w-4 mr-1 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                          {metric.change}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{metric.label}</p>
                        <p className="text-3xl font-bold mt-1">{metric.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
          
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Revenue Chart */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Card className="bg-card/60 backdrop-blur-sm border border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Revenue & Deliveries Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ChartContainer config={{
                        revenue: {
                          label: "Revenue ($K)",
                          color: "hsl(var(--primary))",
                        },
                        deliveries: {
                          label: "Deliveries",
                          color: "hsl(var(--secondary))",
                        },
                      }}>
                        <LineChart data={revenueData}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                          <XAxis dataKey="month" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <ChartTooltip />
                          <ChartLegend />
                          <Line 
                            yAxisId="left"
                            type="monotone" 
                            dataKey="revenue" 
                            stroke="hsl(var(--primary))" 
                            strokeWidth={3} 
                            activeDot={{ r: 6, fill: "hsl(var(--primary))" }} 
                          />
                          <Line 
                            yAxisId="right"
                            type="monotone" 
                            dataKey="deliveries" 
                            stroke="hsl(var(--secondary))" 
                            strokeWidth={3}
                            strokeDasharray="5 5"
                            activeDot={{ r: 6, fill: "hsl(var(--secondary))" }}
                          />
                        </LineChart>
                      </ChartContainer>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Delivery Performance Chart */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="bg-card/60 backdrop-blur-sm border border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Weekly Delivery Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ChartContainer config={{
                        onTime: {
                          label: "On Time (%)",
                          color: "hsl(var(--success))",
                        },
                        delayed: {
                          label: "Delayed (%)",
                          color: "hsl(var(--destructive))",
                        },
                      }}>
                        <BarChart data={deliveryData}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <ChartTooltip />
                          <ChartLegend />
                          <Bar dataKey="onTime" fill="#22c55e" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="delayed" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ChartContainer>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-24 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t('dashboard.quickAccess.title')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Navigate to essential features with one click
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickAccessItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -8, scale: 1.05 }}
                >
                  <Link to={item.href}>
                    <Card className="h-full bg-card/60 backdrop-blur-sm border border-border/50 hover:border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
                      <CardContent className="p-8 text-center">
                        <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className={`h-8 w-8 ${item.iconColor}`} />
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              {t('dashboard.cta.title')}
            </h2>
            <p className="text-xl md:text-2xl mb-12 opacity-90 leading-relaxed">
              {t('dashboard.cta.description')}
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-lg px-12 py-8 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 bg-white text-primary hover:bg-white/90"
            >
              {t('dashboard.cta.button')}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Modern Footer */}
      <ModernFooter />
    </div>
  );
};

export default Dashboard;
