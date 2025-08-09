import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const DashboardLayout = lazy(() => import('./components/layout/DashboardLayout'));

// New Dashboard Pages
const MainDashboard = lazy(() => import('./pages/dashboard/MainDashboard'));
const DriverDashboard = lazy(() => import('./pages/driver/DriverDashboard'));
const ManagerDashboard = lazy(() => import('./pages/manager/ManagerDashboard'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const OrderManagement = lazy(() => import('./pages/orders/OrderManagement'));
const ShipmentTracking = lazy(() => import('./pages/shipments/ShipmentTracking'));
const VehicleTracking = lazy(() => import('./pages/vehicles/VehicleTracking'));
const InvoiceGeneration = lazy(() => import('./pages/invoices/InvoiceGeneration'));
const PaymentProcessing = lazy(() => import('./pages/payments/PaymentProcessing'));
const DocumentManagement = lazy(() => import('./pages/documents/DocumentManagement'));
const ReportGeneration = lazy(() => import('./pages/reports/ReportGeneration'));
const Chatbot = lazy(() => import('./pages/chatbot/Chatbot'));

const AppContent = () => {
  const location = useLocation();
  
  // Pages where footer should be hidden
  const hideFooterPaths = ['/login', '/signup'];
  const shouldHideFooter = hideFooterPaths.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <LanguageChangeNotification />
      <AnimatePresence mode="wait" initial={false}>
        <Suspense fallback={<LoadingScreen />}>
          <Routes location={location}>
            <Route
              path="/"
              element={
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="min-h-screen bg-gradient-to-b from-background via-background to-background"
                >
                  <LandingPage />
                </motion.div>
              }
            />

            {/* Logistics-themed slide/fade for key app sections */}
            {[
              // Original routes
              { path: '/dashboard', element: <Index /> },
              { path: '/customer-dashboard', element: <CustomerDashboard /> },
              { path: '/inventory', element: <Inventory /> },
              { path: '/item-tracking', element: <ItemTracking /> },
              { path: '/live-map', element: <LiveMap /> },
              { path: '/reports', element: <Reports /> },
              { path: '/route-optimization', element: <RouteOptimization /> },
              { path: '/settings', element: <Settings /> },
              { path: '/support', element: <Support /> },
              { path: '/team', element: <Team /> },
              { path: '/enhanced-dashboard', element: <EnhancedDashboard /> },
              { path: '/contact', element: <Support /> },
              { path: '/demo', element: <DemoPage /> },
              { path: '/profile', element: <ProfilePage /> },
              
              // New dashboard pages
              { path: '/main-dashboard', element: <MainDashboard /> },
              { path: '/driver-dashboard', element: <DriverDashboard /> },
              { path: '/manager-dashboard', element: <ManagerDashboard /> },
              { path: '/admin-dashboard', element: <AdminDashboard /> },
              { path: '/order-management', element: <OrderManagement /> },
              { path: '/shipment-tracking', element: <ShipmentTracking /> },
              { path: '/vehicle-tracking', element: <VehicleTracking /> },
              { path: '/invoice-generation', element: <InvoiceGeneration /> },
              { path: '/payment-processing', element: <PaymentProcessing /> },
              { path: '/document-management', element: <DocumentManagement /> },
              { path: '/report-generation', element: <ReportGeneration /> },
              { path: '/chatbot', element: <Chatbot /> },
            ].map(({ path, element }) => (
              <Route
                key={path}
                path={path}
                element={
                  <DashboardLayout>
                    <motion.div
                      key={location.pathname}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -24 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="min-h-screen"
                    >
                      {element}
                    </motion.div>
                  </DashboardLayout>
                }
              />
            ))}

            {/* Auth pages: subtle fade to keep focus on form with transport vibe */}
            <Route
              path="/login"
              element={
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="min-h-screen"
                >
                  <AuthPage />
                </motion.div>
              }
            />
            <Route
              path="/signup"
              element={
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="min-h-screen"
                >
                  <AuthPage />
                </motion.div>
              }
            />

            {/* Portal with nested routes: fade/slide container while children render */}
            <Route
              element={<ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'DRIVER', 'CLIENT', 'GUEST']} />}
            >
              <Route
                path="/portal"
                element={
                  <CustomerPortalLayout />
                }
              >
                <Route
                  index
                  element={
                    <motion.div
                      key={location.pathname}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <PortalDashboard />
                    </motion.div>
                  }
                />
                <Route
                  path="dashboard"
                  element={
                    <motion.div
                      key={location.pathname}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <PortalDashboard />
                    </motion.div>
                  }
                />
                <Route
                  path="profile"
                  element={
                    <motion.div
                      key={location.pathname}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <PortalProfile />
                    </motion.div>
                  }
                />
                <Route
                  path="shipments"
                  element={
                    <motion.div
                      key={location.pathname}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <PortalShipments />
                    </motion.div>
                  }
                />
              </Route>
            </Route>

            <Route
              path="*"
              element={
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <NotFound />
                </motion.div>
              }
            />
          </Routes>
        </Suspense>
      </AnimatePresence>

      {/* ModernFooter on all pages except auth pages */}
      {!shouldHideFooter && (
        <Suspense fallback={<div className="h-20" />}>
          <ModernFooter />
        </Suspense>
      )}
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
