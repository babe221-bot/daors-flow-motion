export interface LayoutComponent {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'widget' | 'text';
  title: string;
  size: { width: number; height: number };
  position: { x: number; y: number };
  data?: any;
  config?: any;
}

export interface GridConfig {
  columns: number;
  gap: number;
  minItemWidth: number;
  breakpoints: ResponsiveBreakpoint[];
}

export interface ResponsiveBreakpoint {
  name: string;
  minWidth: number;
  columns: number;
  containerPadding: number;
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
