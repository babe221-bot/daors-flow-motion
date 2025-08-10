import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { LayoutComponent, GridConfig } from '@/types/layout';
import { generateLayoutTemplate } from '@/lib/layout/layoutUtils';

interface LayoutState {
  components: LayoutComponent[];
  config: GridConfig;
  isLoading: boolean;
  error: string | null;
}

interface LayoutContextType {
  state: LayoutState;
  actions: {
    loadLayout: (template: string) => void;
    updateComponent: (id: string, updates: Partial<LayoutComponent>) => void;
    addComponent: (component: LayoutComponent) => void;
    removeComponent: (id: string) => void;
    reorderComponents: (newOrder: LayoutComponent[]) => void;
  };
}

const initialState: LayoutState = {
  components: [],
  config: {
    columns: 12,
    gap: 16,
    minItemWidth: 200,
    breakpoints: [
      { name: 'xs', minWidth: 0, columns: 1, containerPadding: 8 },
      { name: 'sm', minWidth: 640, columns: 2, containerPadding: 12 },
      { name: 'md', minWidth: 768, columns: 3, containerPadding: 16 },
      { name: 'lg', minWidth: 1024, columns: 4, containerPadding: 20 },
      { name: 'xl', minWidth: 1280, columns: 6, containerPadding: 24 },
    ],
  },
  isLoading: false,
  error: null,
};

type LayoutAction =
  | { type: 'LOAD_LAYOUT_START' }
  | { type: 'LOAD_LAYOUT_SUCCESS'; payload: LayoutComponent[] }
  | { type: 'LOAD_LAYOUT_ERROR'; payload: string }
  | { type: 'UPDATE_COMPONENT'; payload: { id: string; updates: Partial<LayoutComponent> } }
  | { type: 'ADD_COMPONENT'; payload: LayoutComponent }
  | { type: 'REMOVE_COMPONENT'; payload: string }
  | { type: 'REORDER_COMPONENTS'; payload: LayoutComponent[] };

const layoutReducer = (state: LayoutState, action: LayoutAction): LayoutState => {
  switch (action.type) {
    case 'LOAD_LAYOUT_START':
      return { ...state, isLoading: true, error: null };
    case 'LOAD_LAYOUT_SUCCESS':
      return { ...state, components: action.payload, isLoading: false };
    case 'LOAD_LAYOUT_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'UPDATE_COMPONENT':
      return {
        ...state,
        components: state.components.map(comp =>
          comp.id === action.payload.id ? { ...comp, ...action.payload.updates } : comp
        ),
      };
    case 'ADD_COMPONENT':
      return {
        ...state,
        components: [...state.components, action.payload],
      };
    case 'REMOVE_COMPONENT':
      return {
        ...state,
        components: state.components.filter(comp => comp.id !== action.payload),
      };
    case 'REORDER_COMPONENTS':
      return {
        ...state,
        components: action.payload,
      };
    default:
      return state;
  }
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(layoutReducer, initialState);

  const actions = {
    loadLayout: (template: string) => {
      dispatch({ type: 'LOAD_LAYOUT_START' });
      try {
        const components = generateLayoutTemplate(template);
        dispatch({ type: 'LOAD_LAYOUT_SUCCESS', payload: components });
      } catch (error) {
        dispatch({ type: 'LOAD_LAYOUT_ERROR', payload: 'Failed to load layout' });
      }
    },
    updateComponent: (id: string, updates: Partial<LayoutComponent>) => {
      dispatch({ type: 'UPDATE_COMPONENT', payload: { id, updates } });
    },
    addComponent: (component: LayoutComponent) => {
      dispatch({ type: 'ADD_COMPONENT', payload: component });
    },
    removeComponent: (id: string) => {
      dispatch({ type: 'REMOVE_COMPONENT', payload: id });
    },
    reorderComponents: (newOrder: LayoutComponent[]) => {
      dispatch({ type: 'REORDER_COMPONENTS', payload: newOrder });
    },
  };

  return (
    <LayoutContext.Provider value={{ state, actions }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = (): LayoutContextType => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};
