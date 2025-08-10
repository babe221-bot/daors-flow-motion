import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { LayoutComponent, LayoutTemplate } from '@/types/layout';

interface LayoutState {
  components: LayoutComponent[];
  currentTemplate: string;
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
}

type LayoutAction =
  | { type: 'SET_COMPONENTS'; payload: LayoutComponent[] }
  | { type: 'ADD_COMPONENT'; payload: LayoutComponent }
  | { type: 'REMOVE_COMPONENT'; payload: string }
  | { type: 'UPDATE_COMPONENT'; payload: LayoutComponent }
  | { type: 'SET_TEMPLATE'; payload: string }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'TOGGLE_MOBILE_MENU' }
  | { type: 'RESET_LAYOUT' };

interface LayoutContextType {
  state: LayoutState;
  actions: {
    setComponents: (components: LayoutComponent[]) => void;
    addComponent: (component: LayoutComponent) => void;
    removeComponent: (id: string) => void;
    updateComponent: (component: LayoutComponent) => void;
    setTemplate: (template: string) => void;
    toggleSidebar: () => void;
    toggleMobileMenu: () => void;
    resetLayout: () => void;
  };
}

const initialState: LayoutState = {
  components: [],
  currentTemplate: 'dashboard',
  isSidebarOpen: true,
  isMobileMenuOpen: false,
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

const layoutReducer = (state: LayoutState, action: LayoutAction): LayoutState => {
  switch (action.type) {
    case 'SET_COMPONENTS':
      return { ...state, components: action.payload };
    case 'ADD_COMPONENT':
      return { ...state, components: [...state.components, action.payload] };
    case 'REMOVE_COMPONENT':
      return {
        ...state,
        components: state.components.filter((c) => c.id !== action.payload),
      };
    case 'UPDATE_COMPONENT':
      return {
        ...state,
        components: state.components.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case 'SET_TEMPLATE':
      return { ...state, currentTemplate: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, isSidebarOpen: !state.isSidebarOpen };
    case 'TOGGLE_MOBILE_MENU':
      return { ...state, isMobileMenuOpen: !state.isMobileMenuOpen };
    case 'RESET_LAYOUT':
      return initialState;
    default:
      return state;
  }
};

export const LayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(layoutReducer, initialState);

  const actions = {
    setComponents: (components: LayoutComponent[]) =>
      dispatch({ type: 'SET_COMPONENTS', payload: components }),
    addComponent: (component: LayoutComponent) =>
      dispatch({ type: 'ADD_COMPONENT', payload: component }),
    removeComponent: (id: string) =>
      dispatch({ type: 'REMOVE_COMPONENT', payload: id }),
    updateComponent: (component: LayoutComponent) =>
      dispatch({ type: 'UPDATE_COMPONENT', payload: component }),
    setTemplate: (template: string) =>
      dispatch({ type: 'SET_TEMPLATE', payload: template }),
    toggleSidebar: () => dispatch({ type: 'TOGGLE_SIDEBAR' }),
    toggleMobileMenu: () => dispatch({ type: 'TOGGLE_MOBILE_MENU' }),
    resetLayout: () => dispatch({ type: 'RESET_LAYOUT' }),
  };

  return (
    <LayoutContext.Provider value={{ state, actions }}>
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
