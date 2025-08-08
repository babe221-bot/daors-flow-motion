import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import LoadingScreen from './components/LoadingScreen';
import LanguageChangeNotification from './components/LanguageChangeNotification';

// Lazy load components to improve initial load time
const CustomerDashboard = lazy(() => import('./pages/CustomerDashboard'));
const Index = lazy(() => import('./pages/Index'));
const Inventory = lazy(() => import('./pages/Inventory'));
const ItemTracking = lazy(() => import('./pages/ItemTracking'));
const LiveMap = lazy(() => import('./pages/LiveMap'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Reports = lazy(() => import('./pages/Reports'));
const RouteOptimization = lazy(() => import('./pages/RouteOptimization'));
const Settings = lazy(() => import('./pages/Settings'));
const Support = lazy(() => import('./pages/Support'));
const Team = lazy(() => import('./pages/Team'));
const EnhancedDashboard = lazy(() => import('./pages/EnhancedDashboard'));
const PortalDashboard = lazy(() => import('./pages/portal/Dashboard'));
const PortalProfile = lazy(() => import('./pages/portal/Profile'));
const PortalShipments = lazy(() => import('./pages/portal/Shipments'));
const CustomerPortalLayout = lazy(() => import('./components/CustomerPortalLayout'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const ResponsiveLayout = lazy(() => import('./components/ResponsiveLayout'));
const DemoPage = lazy(() => import('./pages/DemoPage'));
const ModernFooter = lazy(() => import('./components/ModernFooter'));

const AppContent = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <LanguageChangeNotification />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<ResponsiveLayout><Index /></ResponsiveLayout>} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
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
      </Suspense>
      {/* ModernFooter on all pages */}
      <Suspense fallback={<div className="h-20" />}>
        <ModernFooter />
      </Suspense>
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
