import { Package, AlertTriangle } from "lucide-react";
import ItemsTable from "@/components/ItemsTable";
import AlertsPanel from "@/components/AlertsPanel";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const ItemTracking = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Praćenje pošiljki</h1>
        <p className="text-muted-foreground">
          Pretražite, filtrirajte i upravljajte svim pošiljkama u lancu snabdijevanja.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2" />
                Sve pošiljke
              </CardTitle>
              <CardDescription>
                Pregled svih pošiljki sa statusom i lokacijom.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ItemsTable />
            </CardContent>
          </Card>
        </div>

        <div>
            <AlertsPanel />
        </div>
      </div>
    </div>
  );
};

export default ItemTracking;
