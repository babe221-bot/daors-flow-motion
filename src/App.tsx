import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LiveMap from "./pages/LiveMap";
import ItemTracking from "./pages/ItemTracking";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import Inventory from "./pages/Inventory";
 feat/inventory-real-time-updates
import CustomerDashboard from "./pages/CustomerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

 main

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
 feat/inventory-real-time-updates
          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route path="/" element={<Index />} />
            <Route path="/item-tracking" element={<ItemTracking />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/support" element={<Support />} />
          </Route>
          <Route element={<ProtectedRoute requiredRole="customer" />}>
            <Route path="/customer-dashboard" element={<CustomerDashboard />} />
          </Route>

          <Route path="/" element={<Index />} />
          <Route path="/live-map" element={<LiveMap />} />
          <Route path="/item-tracking" element={<ItemTracking />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/support" element={<Support />} />
 main
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;