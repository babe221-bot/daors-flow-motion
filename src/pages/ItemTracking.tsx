import { Package } from "lucide-react";
import ItemsTable from "@/components/ItemsTable";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const ItemTracking = () => {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="mr-2" />
            Item Tracking
          </CardTitle>
          <CardDescription>
            Search, filter, and manage all items in the supply chain.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ItemsTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default ItemTracking;
