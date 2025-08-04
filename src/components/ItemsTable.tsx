import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

const items = [
  {
    id: "ITM-001",
    name: "Laptop",
    status: "In Transit",
    location: "Warehouse A",
  },
  {
    id: "ITM-002",
    name: "Monitor",
    status: "Delivered",
    location: "Customer",
  },
  {
    id: "ITM-003",
    name: "Keyboard",
    status: "Pending",
    location: "Warehouse B",
  },
  {
    id: "ITM-004",
    name: "Mouse",
    status: "In Transit",
    location: "Warehouse A",
  },
];

const ItemsTable = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Location</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.id}</TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell>
              <Badge>{item.status}</Badge>
            </TableCell>
            <TableCell>{item.location}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ItemsTable;
