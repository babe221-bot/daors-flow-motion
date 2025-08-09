import React, { useState } from 'react';
import { ResponsiveNavbar } from '@/components/layout/navigation/ResponsiveNavbar';
import { CollapsibleSidebar } from '@/components/layout/navigation/CollapsibleSidebar';
import { MobileNavigation } from '@/components/layout/navigation/MobileNavigation';
import { StickyHeader } from '@/components/layout/headers/StickyHeader';
import { InteractiveBackground } from '@/components/ui/react-bits/InteractiveBackground';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, className }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isMobile } = useResponsiveLayout();

  return (
    <div className="min-h-screen bg-background">
      {/* Interactive Background */}
      <InteractiveBackground
        variant="dots"
        intensity="low"
        className="fixed inset-0 pointer-events-none"
      />

      {/* Mobile Navigation */}
      <MobileNavigation />

      {/* Sticky Header */}
      <StickyHeader threshold={20} showProgress>
        <ResponsiveNavbar
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          config={{
            title: 'DaorsForge',
            subtitle: 'AI Logistics Platform',
            search: { enabled: true },
            userMenu: { showNotifications: true },
          }}
        />
      </StickyHeader>

      {/* Sidebar */}
      <CollapsibleSidebar
        isOpen={sidebarOpen && !isMobile}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <main
        className={`transition-all duration-300 pt-16 ${
          !isMobile && sidebarOpen ? 'ml-64' : !isMobile ? 'ml-16' : 'ml-0'
        } ${className ?? ''}`}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;