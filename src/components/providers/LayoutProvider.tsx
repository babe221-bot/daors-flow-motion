import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { LayoutComponent, GridConfig } from '@/types/layout';
import { generateLayoutTemplate, validateLayout, normalizeLayout } from '@/lib/layout/layoutUtils';

interface LayoutState {
  components: LayoutComponent[];
  config: GridConfig;
  isLoading: boolean;
  error: string | null;
}

interface LayoutContextType extends LayoutState {
  loadLayout: (template: string) => void;
  updateComponent: (id: string, updates: Partial<LayoutComponent>) => void;
  addComponent: (component: LayoutComponent) => void;
  removeComponent: (id: string) => void;
  reorderComponents: (newOrder: LayoutComponent[]) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

const defaultGridConfig: GridConfig = {
  columns: 12,
  gap: 16,
  minItemWidth: 200,
  breakpoints: [
    { name: 'xs', minWidth: 0, columns: 1 },
    { name: 'sm', minWidth: 640, columns: 2 },
    { name: 'md', minWidth: 768, columns: 3 },
    { name: 'lg', minWidth: 1024, columns: 4 },
    { name: 'xl', minWidth: 1280, columns: 6 },
  ],
};

const initialState: LayoutState = {
  components: [],
  config: defaultGridConfig,
  isLoading: false,
  error: null,
};

type LayoutAction =
  | { type: 'LOAD_LAYOUT_REQUEST' }
  | { type: 'LOAD_LAYOUT_SUCCESS'; payload: LayoutComponent[] }
  | { type: 'LOAD_LAYOUT_FAILURE'; payload: string }
  | { type: 'UPDATE_COMPONENT'; payload: { id: string; updates: Partial<LayoutComponent> } }
  | { type: 'ADD_COMPONENT'; payload: LayoutComponent }
  | { type: 'REMOVE_COMPONENT'; payload: string }
  | { type: 'REORDER_COMPONENTS'; payload: LayoutComponent[] }
  | { type: 'SET_CONFIG'; payload: GridConfig };

const layoutReducer = (state: LayoutState, action: LayoutAction): LayoutState => {
  switch (action.type) {
    case 'LOAD_LAYOUT_REQUEST':
      return { ...state, isLoading: true, error: null };
    
    case 'LOAD_LAYOUT_SUCCESS':
      return {
        ...state,
        components: normalizeLayout(action.payload),
        isLoading: false,
        error: null,
      };
    
    case 'LOAD_LAYOUT_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    
    case 'UPDATE_COMPONENT':
      return {
        ...state,
        components: state.components.map(comp =>
          comp.id === action.payload.id
            ? { ...comp, ...action.payload.updates }
            : comp
        ),
      };
    
    case 'ADD_COMPONENT':
      return {
        ...state,
        components: [...state.components, normalizeLayout([action.payload])[0]],
      };
    
    case 'REMOVE_COMPONENT':
      return {
        ...state,
        components: state.components.filter(comp => comp.id !== action.payload),
      };
    
    case 'REORDER_COMPONENTS':
      return {
        ...state,
        components: normalizeLayout(action.payload),
      };
    
    case 'SET_CONFIG':
      return { ...state, config: action.payload };
    
    default:
      return state;
  }
};

interface LayoutProviderProps {
  children: ReactNode;
  initialLayout?: string;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({
  children,
  initialLayout = 'dashboard',
}) => {
  const [state, dispatch] = useReducer(layoutReducer, initialState);

  const loadLayout = useCallback((template: string) => {
    dispatch({ type: 'LOAD_LAYOUT_REQUEST' });
    
    try {
      const components = generateLayoutTemplate(template);
      dispatch({ type: 'LOAD_LAYOUT_SUCCESS', payload: components });
    } catch (error) {
      dispatch({ type: 'LOAD_LAYOUT_FAILURE', payload: 'Failed to load layout' });
    }
  }, []);

  const updateComponent = useCallback((id: string, updates: Partial<LayoutComponent>) => {
    dispatch({ type: 'UPDATE_COMPONENT', payload: { id, updates } });
  }, []);

  const addComponent = useCallback((component: LayoutComponent) => {
    dispatch({ type: 'ADD_COMPONENT', payload: component });
  }, []);

  const removeComponent = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_COMPONENT', payload: id });
  }, []);

  const reorderComponents = useCallback((newOrder: LayoutComponent[]) => {
    dispatch({ type: 'REORDER_COMPONENTS', payload: newOrder });
  }, []);

  const contextValue: LayoutContextType = {
    ...state,
    loadLayout,
    updateComponent,
    addComponent,
    removeComponent,
    reorderComponents,
  };

  return (
    <LayoutContext.Provider value={contextValue}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};
