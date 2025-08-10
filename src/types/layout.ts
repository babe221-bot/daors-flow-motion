export interface LayoutComponent {
  id: string;
  type: string;
  props: Record<string, any>;
  position: { x: number; y: number };
  size: { width: number; height: number };
  minSize?: { width: number; height: number };
  maxSize?: { width: number; height: number };
  isDraggable?: boolean;
  isResizable?: boolean;
  zIndex?: number;
}

export interface ResponsiveBreakpoint {
  name: string;
  minWidth: number;
  columns: number;
  containerPadding: string;
}

export interface GridConfig {
  gap: number;
  minItemWidth: number;
  maxItemWidth?: number;
  breakpoints?: ResponsiveBreakpoint[];
}

export interface LayoutState {
  components: LayoutComponent[];
  sidebarOpen: boolean;
  isMobile: boolean;
  currentBreakpoint: string;
}

export interface LayoutActions {
  addComponent: (component: LayoutComponent) => void;
  removeComponent: (id: string) => void;
  updateComponent: (id: string, updates: Partial<LayoutComponent>) => void;
  reorderComponents: (newOrder: string[]) => void;
  toggleSidebar: () => void;
  setMobile: (isMobile: boolean) => void;
  setBreakpoint: (breakpoint: string) => void;
  loadLayout: (layout: LayoutState) => void;
}
