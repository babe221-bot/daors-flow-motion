import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OfflineIndicator from "./components/OfflineIndicator";
import Index from "./pages/Index";
import LiveMap from "./pages/LiveMap";
import ItemTracking from "./pages/ItemTracking";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import Inventory from "./pages/Inventory";
import ProtectedRoute from "./components/ProtectedRoute";
import { ROLES } from "./lib/types";
import CustomerPortalLayout from "./components/CustomerPortalLayout";
import PortalDashboard from "./pages/portal/Dashboard";
import PortalShipments from "./pages/portal/Shipments";
import PortalProfile from "./pages/portal/Profile";
import Reports from "./pages/Reports";
import SignUp from "./pages/SignUp";
import RouteOptimization from "./pages/RouteOptimization";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <OfflineIndicator />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/not-found" element={<NotFound />} />

          {/* Protected routes for internal staff */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]} />}>
            <Route path="/" element={<Index />} />
            <Route path="/route-optimization" element={<RouteOptimization />} />
            <Route path="/reports" element={<Reports />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.DRIVER]} />}>
            <Route path="/live-map" element={<LiveMap />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Protected routes accessible by all authenticated users */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.DRIVER, ROLES.CLIENT]} />}>
            <Route path="/item-tracking" element={<ItemTracking />} />
            <Route path="/support" element={<Support />} />
          </Route>

          {/* Customer Portal Routes */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.CLIENT]} />}>
            <Route path="/portal" element={<CustomerPortalLayout />}>
              <Route index element={<PortalDashboard />} />
              <Route path="dashboard" element={<PortalDashboard />} />
              <Route path="shipments" element={<PortalShipments />} />
              <Route path="profile" element={<PortalProfile />} />
            </Route>
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;