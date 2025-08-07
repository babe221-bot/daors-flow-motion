import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CustomerDashboard from './pages/CustomerDashboard';
import Index from './pages/Index';
import Inventory from './pages/Inventory';
import ItemTracking from './pages/ItemTracking';
import LiveMap from './pages/LiveMap';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Reports from './pages/Reports';
import RouteOptimization from './pages/RouteOptimization';
import Settings from './pages/Settings';
import SignUp from './pages/SignUp';
import Support from './pages/Support';
import Team from './pages/Team';
import PortalDashboard from './pages/portal/Dashboard';
import PortalProfile from './pages/portal/Profile';
import PortalShipments from './pages/portal/Shipments';
import CustomerPortalLayout from './components/CustomerPortalLayout';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/item-tracking" element={<ItemTracking />} />
        <Route path="/live-map" element={<LiveMap />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/route-optimization" element={<RouteOptimization />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/support" element={<Support />} />
        <Route path="/team" element={<Team />} />
        
        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'DRIVER', 'CLIENT']} />}>
          <Route path="/portal" element={<CustomerPortalLayout />}>
            <Route index element={<PortalDashboard />} />
            <Route path="profile" element={<PortalProfile />} />
            <Route path="shipments" element={<PortalShipments />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
