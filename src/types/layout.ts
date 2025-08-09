// Layout-related TypeScript definitions
export interface GridConfig {
  columns: number;
  gap: string;
  breakpoints: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

export interface LayoutComponent {
  id: string;
  type: 'widget' | 'chart' | 'table' | 'form';
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  props?: Record<string, any>;
  isDraggable?: boolean;
  isResizable?: boolean;
}

export interface ResponsiveBreakpoint {
  name: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  minWidth: number;
  columns: number;
  containerPadding: string;
}

export interface StickyConfig {
  top?: number;
  bottom?: number;
  zIndex?: number;
  backgroundColor?: string;
  backdropBlur?: boolean;
}

export interface DragDropConfig {
  enabled: boolean;
  snapToGrid: boolean;
  gridSize: number;
  constraints?: {
    minWidth: number;
    minHeight: number;
    maxWidth?: number;
    maxHeight?: number;
  };
}

export interface LayoutState {
  isMobile: boolean;
  currentBreakpoint: ResponsiveBreakpoint['name'];
  sidebarCollapsed: boolean;
  components: LayoutComponent[];
  dragDropConfig: DragDropConfig;
}