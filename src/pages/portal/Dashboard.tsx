import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, CheckCircle, AlertTriangle } from 'lucide-react';
import MetricCard from '@/components/MetricCard';

const PortalDashboard = () => {
  const { user } = useAuth();

  // Mock data for a client's perspective
  const activeShipments = user?.associatedItemIds?.length || 0;
  const deliveredShipments = 5; // mock value
  const alerts = 1; // mock value

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Welcome, {user?.username}!</h1>
        <p className="text-muted-foreground">Here's a summary of your account and shipments.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Active Shipments"
          value={activeShipments}
          icon={Truck}
          change="+1 this week"
          changeType="positive"
        />
        <MetricCard
          title="Delivered This Month"
          value={deliveredShipments}
          icon={CheckCircle}
          change="+5%"
          changeType="positive"
        />
        <MetricCard
          title="Active Alerts"
          value={alerts}
          icon={AlertTriangle}
          change="1 requires attention"
          changeType="negative"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Your most recent shipment updates will appear here.</p>
          {/* In a real app, this would be a list of recent shipment events */}
        </CardContent>
      </Card>
    </div>
  );
};

export default PortalDashboard;
