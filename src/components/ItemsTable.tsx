import { useState } from "react";
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
import ItemDetails from "./ItemDetails";
import { Item } from "@/lib/types";

const ItemsTable = () => {
  const { t } = useTranslation();

  const initialItems: Item[] = [
    {
      id: "ITM-001",
      name: "Industrial Machinery Parts",
      status: t("shipment.status.inTransit"),
      location: "Port of Koper, Slovenia",
      coordinates: { lat: 45.5462, lng: 13.7295 },
      history: [
        { status: "Created", timestamp: "2023-10-01 09:00" },
        { status: "Picked up", timestamp: "2023-10-01 14:00" },
        { status: "In Transit", timestamp: "2023-10-02 08:30" },
      ],
      documents: [
        { name: "Bill_of_Lading_ITM-001.pdf", url: "#" },
        { name: "Customs_Declaration_ITM-001.pdf", url: "#" },
      ],
    },
    {
      id: "ITM-002",
      name: "Pharmaceutical Supplies",
      status: t("shipment.status.delivered"),
      location: "Clinical Center, Belgrade",
      coordinates: { lat: 44.7965, lng: 20.4507 },
      history: [{ status: "Delivered", timestamp: "2023-10-03 11:00" }],
      documents: [{ name: "Proof_of_Delivery_ITM-002.pdf", url: "#" }],
    },
    {
      id: "ITM-003",
      name: "Automotive Components",
      status: t("shipment.status.pending"),
      location: "Factory, Kragujevac",
      coordinates: { lat: 44.0167, lng: 20.9167 },
      history: [{ status: "Order confirmed", timestamp: "2023-10-04 16:20" }],
      documents: [],
    },
    {
      id: "ITM-004",
      name: "Tech Electronics",
      status: t("shipment.status.delayed"),
      location: "Customs, Batrovci Border",
      coordinates: { lat: 45.1094, lng: 19.1122 },
      history: [{ status: "Customs Hold", timestamp: "2023-10-05 09:00" }],
      documents: [
        { name: "Commercial_Invoice_ITM-004.pdf", url: "#" },
      ],
    },
  ];

  const [items, setItems] = useState<Item[]>(initialItems);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const handleRowClick = (item: Item) => {
    setSelectedItem(item);
  };

  const handleCloseDetails = () => {
    setSelectedItem(null);
  };

  const handleItemChange = (updatedItem: Item) => {
    setItems(currentItems =>
      currentItems.map(item => (item.id === updatedItem.id ? updatedItem : item))
    );
    setSelectedItem(updatedItem); // Keep the modal open with updated data
  };

  return (
    <>
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
            <TableRow key={item.id} onClick={() => handleRowClick(item)} className="cursor-pointer hover:bg-muted/50">
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

      <ItemDetails
        item={selectedItem}
        onClose={handleCloseDetails}
        onItemChange={handleItemChange}
      />
    </>
  );
};

export default ItemsTable;
