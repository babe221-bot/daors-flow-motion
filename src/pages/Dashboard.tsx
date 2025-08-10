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
    <div className="min-h-screen bg-background text-foreground">
      <NaviBar />
      
      {/* Hero Section with Video Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          src="/Whisk_cauajde4m2myzdrmlwfkyzutnduzyi1hngqzltk.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-background/90 via-background/70 to-background/50 z-10"></div>
        
        <div className="relative z-20 container mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              {t('dashboard.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
              {t('dashboard.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300">
                {t('dashboard.hero.cta.primary')}
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-full border-2 border-primary/70 hover:bg-primary/10 transition-all duration-300">
                {t('dashboard.hero.cta.secondary')}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12 text-center"
          >
            {t('dashboard.features.title')}
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Real-time Analytics', description: 'Monitor your business performance with live data visualization' },
              { title: 'Smart Automation', description: 'Streamline workflows with AI-powered automation tools' },
              { title: 'Collaborative Tools', description: 'Work seamlessly with team members across locations' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full backdrop-blur-sm bg-card/80 hover:bg-card/95 transition-all duration-300 border-0 shadow-lg hover:shadow-xl">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      {/* Icon placeholder */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12 text-center"
          >
            {t('dashboard.metrics.title')}
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Monthly Revenue', value: '$42,328', change: '+12.5%' },
              { label: 'Active Users', value: '12,843', change: '+8.2%' },
              { label: 'Conversion Rate', value: '7.2%', change: '+0.5%' }
            ].map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">{metric.label}</span>
                  <span className="text-3xl font-bold mt-1">{metric.value}</span>
                  <span className="text-sm text-green-500 mt-2">{metric.change}</span>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 bg-card rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-6">Revenue Overview</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ChartContainer config={{
                  revenue: {
                    label: "Revenue",
                    color: "hsl(var(--chart-1))",
                  },
                }}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip />
                    <ChartLegend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2} 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ChartContainer>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t('dashboard.cta.title')}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {t('dashboard.cta.description')}
            </p>
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
              {t('dashboard.cta.button')}
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
