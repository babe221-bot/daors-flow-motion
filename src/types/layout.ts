export interface LayoutComponent {
  id: string;
  type: string;
  title: string;
  description?: string;
  width?: number;
  height?: number;
  position: { x: number; y: number };
  data?: any;
}

export interface GridConfig {
  columns: number;
  gap: number;
  minItemWidth: number;
  breakpoints: Breakpoint[];
}

export interface Breakpoint {
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
