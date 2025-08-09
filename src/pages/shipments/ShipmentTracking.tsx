import React from 'react';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import MapView from '@/components/MapView';

const ShipmentTracking: React.FC = () => {
  return (
    <ResponsiveLayout>
      <div className="p-6 space-y-6">
        <Card className="glass">
          <CardHeader>
            <CardTitle>Shipment Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[480px]">
              <MapView vehicles={[{ id:'trk-1', position:[44.787197,20.457273], driver:'Marko', status:'In Transit' }]} />
            </div>
          </CardContent>
        </Card>
      </div>
    </ResponsiveLayout>
  );
};

export default ShipmentTracking;