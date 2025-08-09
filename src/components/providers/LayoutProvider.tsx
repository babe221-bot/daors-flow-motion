// Layout provider for managing global layout state
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { LayoutState, LayoutComponent, DragDropConfig } from '@/types/layout';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

interface LayoutContextType {
  state: LayoutState;
  actions: {
    toggleSidebar: () => void;
    setSidebarCollapsed: (collapsed: boolean) => void;
    addComponent: (component: LayoutComponent) => void;
    removeComponent: (componentId: string) => void;
    updateComponent: (componentId: string, updates: Partial<LayoutComponent>) => void;
    reorderComponents: (components: LayoutComponent[]) => void;
    updateDragDropConfig: (config: Partial<DragDropConfig>) => void;
    resetLayout: () => void;
    loadLayout: (layout: Partial<LayoutState>) => void;
  };
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

// Layout actions
type LayoutAction =
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR_COLLAPSED'; payload: boolean }
  | { type: 'ADD_COMPONENT'; payload: LayoutComponent }
  | { type: 'REMOVE_COMPONENT'; payload: string }
  | { type: 'UPDATE_COMPONENT'; payload: { id: string; updates: Partial<LayoutComponent> } }
  | { type: 'REORDER_COMPONENTS'; payload: LayoutComponent[] }
  | { type: 'UPDATE_DRAG_DROP_CONFIG'; payload: Partial<DragDropConfig> }
  | { type: 'SET_BREAKPOINT'; payload: { isMobile: boolean; currentBreakpoint: string } }
  | { type: 'RESET_LAYOUT' }
  | { type: 'LOAD_LAYOUT'; payload: Partial<LayoutState> };

// Initial layout state
const initialState: LayoutState = {
  isMobile: false,
  currentBreakpoint: 'lg',
  sidebarCollapsed: false,
  components: [
    {
      id: 'dashboard-metrics',
      type: 'widget',
      position: { x: 0, y: 0, width: 2, height: 1 },
      isDraggable: true,
      isResizable: false,
    },
    {
      id: 'revenue-chart',
      type: 'chart',
      position: { x: 2, y: 0, width: 2, height: 1 },
      isDraggable: true,
      isResizable: false,
    },
    {
      id: 'recent-orders',
      type: 'table',
      position: { x: 0, y: 1, width: 3, height: 2 },
      isDraggable: true,
      isResizable: false,
    },
    {
      id: 'quick-actions',
      type: 'form',
      position: { x: 3, y: 1, width: 1, height: 2 },
      isDraggable: true,
      isResizable: false,
    },
  ],
  dragDropConfig: {
    enabled: true,
    snapToGrid: true,
    gridSize: 24,
    constraints: {
      minWidth: 200,
      minHeight: 120,
    },
  },
};

// Layout reducer
const layoutReducer = (state: LayoutState, action: LayoutAction): LayoutState => {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebarCollapsed: !state.sidebarCollapsed,
      };

    case 'SET_SIDEBAR_COLLAPSED':
      return {
        ...state,
        sidebarCollapsed: action.payload,
      };

    case 'ADD_COMPONENT':
      return {
        ...state,
        components: [...state.components, action.payload],
      };

    case 'REMOVE_COMPONENT':
      return {
        ...state,
        components: state.components.filter(c => c.id !== action.payload),
      };

    case 'UPDATE_COMPONENT':
      return {
        ...state,
        components: state.components.map(c =>
          c.id === action.payload.id
            ? { ...c, ...action.payload.updates }
            : c
        ),
      };

    case 'REORDER_COMPONENTS':
      return {
        ...state,
        components: action.payload,
      };

    case 'UPDATE_DRAG_DROP_CONFIG':
      return {
        ...state,
        dragDropConfig: { ...state.dragDropConfig, ...action.payload },
      };

    case 'SET_BREAKPOINT':
      return {
        ...state,
        isMobile: action.payload.isMobile,
        currentBreakpoint: action.payload.currentBreakpoint as any,
      };

    case 'RESET_LAYOUT':
      return initialState;

    case 'LOAD_LAYOUT':
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};

// Layout provider component
export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(layoutReducer, initialState);
  const { isMobile, currentBreakpoint } = useResponsiveLayout();

  // Update breakpoint in layout state
  useEffect(() => {
    dispatch({
      type: 'SET_BREAKPOINT',
      payload: { isMobile, currentBreakpoint },
    });
  }, [isMobile, currentBreakpoint]);

  // Load layout from localStorage on mount
  useEffect(() => {
    const savedLayout = localStorage.getItem('daorsforge-layout');
    if (savedLayout) {
      try {
        const parsedLayout = JSON.parse(savedLayout);
        dispatch({ type: 'LOAD_LAYOUT', payload: parsedLayout });
      } catch (error) {
        console.warn('Failed to load saved layout:', error);
      }
    }
  }, []);

  // Save layout to localStorage when it changes
  useEffect(() => {
    const layoutToSave = {
      components: state.components,
      dragDropConfig: state.dragDropConfig,
      sidebarCollapsed: state.sidebarCollapsed,
    };
    localStorage.setItem('daorsforge-layout', JSON.stringify(layoutToSave));
  }, [state.components, state.dragDropConfig, state.sidebarCollapsed]);

  // Action creators
  const actions = {
    toggleSidebar: () => dispatch({ type: 'TOGGLE_SIDEBAR' }),
    
    setSidebarCollapsed: (collapsed: boolean) =>
      dispatch({ type: 'SET_SIDEBAR_COLLAPSED', payload: collapsed }),
    
    addComponent: (component: LayoutComponent) =>
      dispatch({ type: 'ADD_COMPONENT', payload: component }),
    
    removeComponent: (componentId: string) =>
      dispatch({ type: 'REMOVE_COMPONENT', payload: componentId }),
    
    updateComponent: (componentId: string, updates: Partial<LayoutComponent>) =>
      dispatch({ type: 'UPDATE_COMPONENT', payload: { id: componentId, updates } }),
    
    reorderComponents: (components: LayoutComponent[]) =>
      dispatch({ type: 'REORDER_COMPONENTS', payload: components }),
    
    updateDragDropConfig: (config: Partial<DragDropConfig>) =>
      dispatch({ type: 'UPDATE_DRAG_DROP_CONFIG', payload: config }),
    
    resetLayout: () => dispatch({ type: 'RESET_LAYOUT' }),
    
    loadLayout: (layout: Partial<LayoutState>) =>
      dispatch({ type: 'LOAD_LAYOUT', payload: layout }),
  };

  return (
    <LayoutContext.Provider value={{ state, actions }}>
      {children}
    </LayoutContext.Provider>
  );
};

// Hook to use layout context
export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};

// Layout persistence utilities
export const layoutUtils = {
  // Export current layout
  exportLayout: (state: LayoutState) => {
    const exportData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      layout: {
        components: state.components,
        dragDropConfig: state.dragDropConfig,
      },
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daorsforge-layout-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // Import layout from file
  importLayout: (file: File): Promise<Partial<LayoutState>> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content);
          
          if (data.version && data.layout) {
            resolve(data.layout);
          } else {
            reject(new Error('Invalid layout file format'));
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  },

  // Generate layout template
  generateTemplate: (type: 'dashboard' | 'analytics' | 'minimal'): LayoutComponent[] => {
    const templates = {
      dashboard: [
        {
          id: 'metrics-overview',
          type: 'widget' as const,
          position: { x: 0, y: 0, width: 3, height: 1 },
          isDraggable: true,
          isResizable: false,
        },
        {
          id: 'performance-chart',
          type: 'chart' as const,
          position: { x: 3, y: 0, width: 3, height: 2 },
          isDraggable: true,
          isResizable: false,
        },
        {
          id: 'recent-activity',
          type: 'table' as const,
          position: { x: 0, y: 1, width: 3, height: 2 },
          isDraggable: true,
          isResizable: false,
        },
        {
          id: 'quick-actions',
          type: 'form' as const,
          position: { x: 0, y: 3, width: 2, height: 1 },
          isDraggable: true,
          isResizable: false,
        },
      ],
      analytics: [
        {
          id: 'kpi-metrics',
          type: 'widget' as const,
          position: { x: 0, y: 0, width: 2, height: 1 },
          isDraggable: true,
          isResizable: false,
        },
        {
          id: 'trend-analysis',
          type: 'chart' as const,
          position: { x: 2, y: 0, width: 4, height: 2 },
          isDraggable: true,
          isResizable: false,
        },
        {
          id: 'data-breakdown',
          type: 'chart' as const,
          position: { x: 0, y: 1, width: 2, height: 2 },
          isDraggable: true,
          isResizable: false,
        },
        {
          id: 'detailed-report',
          type: 'table' as const,
          position: { x: 0, y: 3, width: 6, height: 2 },
          isDraggable: true,
          isResizable: false,
        },
      ],
      minimal: [
        {
          id: 'main-widget',
          type: 'widget' as const,
          position: { x: 0, y: 0, width: 3, height: 1 },
          isDraggable: true,
          isResizable: false,
        },
        {
          id: 'primary-chart',
          type: 'chart' as const,
          position: { x: 0, y: 1, width: 3, height: 2 },
          isDraggable: true,
          isResizable: false,
        },
      ],
    };

    return templates[type] || templates.dashboard;
  },
};