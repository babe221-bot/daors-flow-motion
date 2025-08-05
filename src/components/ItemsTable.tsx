import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

const ItemsTable = () => {
  const { t } = useTranslation();

  const items = [
    {
      id: "ITM-001",
      name: "Laptop",
      status: t("shipment.status.inTransit"),
      location: "Warehouse A",
    },
    {
      id: "ITM-002",
      name: "Monitor",
      status: t("shipment.status.delivered"),
      location: "Customer",
    },
    {
      id: "ITM-003",
      name: "Keyboard",
      status: t("shipment.status.pending"),
      location: "Warehouse B",
    },
    {
      id: "ITM-004",
      name: "Mouse",
      status: t("shipment.status.inTransit"),
      location: "Warehouse A",
    },
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("itemsTable.id")}</TableHead>
          <TableHead>{t("itemsTable.name")}</TableHead>
          <TableHead>{t("itemsTable.status")}</TableHead>
          <TableHead>{t("itemsTable.location")}</TableHead>
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
