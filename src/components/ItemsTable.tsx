import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ItemDetails from "./ItemDetails";

const allItems = [
    { id: "ITM-001", name: "Laptop", status: "In Transit", location: "Warehouse A" },
    { id: "ITM-002", name: "Monitor", status: "Delivered", location: "Customer" },
    { id: "ITM-003", name: "Keyboard", status: "Pending", location: "Warehouse B" },
    { id: "ITM-004", name: "Mouse", status: "In Transit", location: "Warehouse A" },
    { id: "ITM-005", name: "Webcam", status: "Delivered", location: "Customer" },
    { id: "ITM-006", name: "Docking Station", status: "Pending", location: "Warehouse C" },
    { id: "ITM-007", name: "Power Adapter", status: "In Transit", location: "Warehouse B" },
    { id: "ITM-008", name: "USB Hub", status: "Delivered", location: "Customer" },
    { id: "ITM-009", name: "External HDD", status: "Pending", location: "Warehouse A" },
    { id: "ITM-010", name: "Speakers", status: "In Transit", location: "Warehouse C" },
    { id: "ITM-011", name: "Microphone", status: "Delivered", location: "Customer" },
    { id: "ITM-012", name: "Printer", status: "Pending", location: "Warehouse B" },
];

const ItemsTable = () => {
  const [items, setItems] = useState(allItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [selectedItem, setSelectedItem] = useState(null);

  const uniqueStatuses = ["All", ...Array.from(new Set(allItems.map((item) => item.status)))];
  const uniqueLocations = ["All", ...Array.from(new Set(allItems.map((item) => item.location)))];

  const filteredItems = useMemo(() => {
    return items
      .filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((item) =>
        statusFilter === "All" ? true : item.status === statusFilter
      )
      .filter((item) =>
        locationFilter === "All" ? true : item.location === locationFilter
      );
  }, [items, searchTerm, statusFilter, locationFilter]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div>
      <div className="flex items-center space-x-4 mb-4">
        <Input
          placeholder="Search by name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {uniqueStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by location" />
          </SelectTrigger>
          <SelectContent>
            {uniqueLocations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
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
          {paginatedItems.map((item) => (
            <TableRow key={item.id} onClick={() => setSelectedItem(item)} className="cursor-pointer">
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
      <ItemDetails item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
};

export default ItemsTable;
