import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map, List, FileText } from "lucide-react";
import MapView from './MapView';


interface Item {
    id: string;
    name: string;
    status: string;
    location: string;
    history: { status: string; timestamp: string }[];
    coordinates: { lat: number; lng: number };
}

interface ItemDetailsProps {
    item: Item | null;
    onClose: () => void;
}


const ItemDetails = ({ item, onClose }: ItemDetailsProps) => {
  if (!item) return null;

  return (
    <Dialog open={!!item} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{item.name}</DialogTitle>
          <DialogDescription>
            Details for item ID: {item.id}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center">
            <span className="font-semibold mr-2">Status:</span>
            <Badge>{item.status}</Badge>
          </div>
          <div className="flex items-center">
            <span className="font-semibold mr-2">Location:</span>
            <span>{item.location}</span>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-2">
              <Map className="w-5 h-5" />
              <CardTitle>Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 rounded-md">
                <MapView coordinates={item.coordinates} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-2">
              <List className="w-5 h-5" />
              <CardTitle>History Log</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {item.history.map((entry, index) => (
                  <li key={index} className="text-sm">
                    {entry.status} - {entry.timestamp}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-2">
              <FileText className="w-5 h-5" />
              <CardTitle>Associated Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="text-sm text-blue-500 hover:underline cursor-pointer">invoice-123.pdf</li>
                <li className="text-sm text-blue-500 hover:underline cursor-pointer">customs-form-abc.pdf</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ItemDetails;
