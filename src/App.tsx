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
import EnhancedDashboard from './pages/EnhancedDashboard';
import PortalDashboard from './pages/portal/Dashboard';
import PortalProfile from './pages/portal/Profile';
import PortalShipments from './pages/portal/Shipments';
import CustomerPortalLayout from './components/CustomerPortalLayout';
import ProtectedRoute from './components/ProtectedRoute';
import NaviBar from './components/NaviBar';
import LandingPage from './pages/LandingPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<><NaviBar /><Index /></>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/customer-dashboard" element={<><NaviBar /><CustomerDashboard /></>} />
        <Route path="/inventory" element={<><NaviBar /><Inventory /></>} />
        <Route path="/item-tracking" element={<><NaviBar /><ItemTracking /></>} />
        <Route path="/live-map" element={<><NaviBar /><LiveMap /></>} />
        <Route path="/reports" element={<><NaviBar /><Reports /></>} />
        <Route path="/route-optimization" element={<><NaviBar /><RouteOptimization /></>} />
        <Route path="/settings" element={<><NaviBar /><Settings /></>} />
        <Route path="/support" element={<><NaviBar /><Support /></>} />
        <Route path="/team" element={<><NaviBar /><Team /></>} />
        <Route path="/enhanced-dashboard" element={<><NaviBar /><EnhancedDashboard /></>} />
        <Route path="/contact" element={<><NaviBar /><Support /></>} />
        
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
