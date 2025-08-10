export interface LayoutComponent {
  id: string;
  type: string;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  props?: Record<string, any>;
  minSize?: { width: number; height: number };
  maxSize?: { width: number; height: number };
  isResizable?: boolean;
  isDraggable?: boolean;
  zIndex?: number;
}

export interface ResponsiveBreakpoint {
  name: string;
  minWidth: number;
  columns: number;
  containerPadding?: number;
}

export interface GridConfig {
  columns: number;
  gap: number;
  minItemWidth: number;
  breakpoints: ResponsiveBreakpoint[];
}

export interface LayoutTemplate {
  name: string;
  components: LayoutComponent[];
  config: GridConfig;
}

export interface DragDropState {
  isDragging: boolean;
  draggedItem: LayoutComponent | null;
  draggedOverId: string | null;
  dragOffset: { x: number; y: number };
}
