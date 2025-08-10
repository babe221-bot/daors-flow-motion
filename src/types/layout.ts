// Layout-related types
export interface LayoutComponent {
  id: string;
  type: string;
  props?: Record<string, unknown>;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
}

export interface LayoutTemplate {
  id: string;
  name: string;
  components: LayoutComponent[];
  breakpoints?: ResponsiveBreakpoint[];
}

export interface ResponsiveBreakpoint {
  name: string;
  minWidth: number;
  columns: number;
  containerPadding: string;
}

export interface GridItem {
  id: string;
  component: React.ComponentType<unknown>;
  props?: Record<string, unknown>;
  gridArea?: string;
}

export interface DragDropConfig {
  enableGridSnapping?: boolean;
  showDropZones?: boolean;
  animationDuration?: number;
}
