import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
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
import LandingPage from './pages/LandingPage';
import ResponsiveLayout from './components/ResponsiveLayout';
import DemoPage from './pages/DemoPage';
import ModernFooter from './components/ModernFooter';
import LanguageChangeNotification from './components/LanguageChangeNotification';

const AppContent = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <LanguageChangeNotification />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<ResponsiveLayout><Index /></ResponsiveLayout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/customer-dashboard" element={<ResponsiveLayout><CustomerDashboard /></ResponsiveLayout>} />
        <Route path="/inventory" element={<ResponsiveLayout><Inventory /></ResponsiveLayout>} />
        <Route path="/item-tracking" element={<ResponsiveLayout><ItemTracking /></ResponsiveLayout>} />
        <Route path="/live-map" element={<ResponsiveLayout><LiveMap /></ResponsiveLayout>} />
        <Route path="/reports" element={<ResponsiveLayout><Reports /></ResponsiveLayout>} />
        <Route path="/route-optimization" element={<ResponsiveLayout><RouteOptimization /></ResponsiveLayout>} />
        <Route path="/settings" element={<ResponsiveLayout><Settings /></ResponsiveLayout>} />
        <Route path="/support" element={<ResponsiveLayout><Support /></ResponsiveLayout>} />
        <Route path="/team" element={<ResponsiveLayout><Team /></ResponsiveLayout>} />
        <Route path="/enhanced-dashboard" element={<ResponsiveLayout><EnhancedDashboard /></ResponsiveLayout>} />
        <Route path="/contact" element={<ResponsiveLayout><Support /></ResponsiveLayout>} />
        <Route path="/demo" element={<ResponsiveLayout><DemoPage /></ResponsiveLayout>} />
        
        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'DRIVER', 'CLIENT']} />}>
          <Route path="/portal" element={<CustomerPortalLayout />}>
            <Route index element={<PortalDashboard />} />
            <Route path="dashboard" element={<PortalDashboard />} />
            <Route path="profile" element={<PortalProfile />} />
            <Route path="shipments" element={<PortalShipments />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* Only show ModernFooter on non-landing and non-auth pages */}
      {!isLandingPage && !isAuthPage && <ModernFooter />}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
