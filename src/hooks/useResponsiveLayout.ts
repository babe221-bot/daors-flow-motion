// Custom hook for responsive layout management
import { useState, useEffect, useCallback } from 'react';
import { ResponsiveBreakpoint, LayoutState, LayoutComponent } from '@/types/layout';
import { getCurrentBreakpoint, defaultBreakpoints } from '@/lib/layout/gridSystem';

interface UseResponsiveLayoutOptions {
  breakpoints?: ResponsiveBreakpoint[];
  debounceMs?: number;
  initialComponents?: LayoutComponent[];
}

export const useResponsiveLayout = (options: UseResponsiveLayoutOptions = {}) => {
  const {
    breakpoints = defaultBreakpoints,
    debounceMs = 150,
    initialComponents = [],
  } = options;

  const [layoutState, setLayoutState] = useState<LayoutState>(() => {
    const initialWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const currentBreakpoint = getCurrentBreakpoint(initialWidth, breakpoints);
    
    return {
      isMobile: currentBreakpoint.name === 'xs' || currentBreakpoint.name === 'sm',
      currentBreakpoint: currentBreakpoint.name,
      sidebarCollapsed: currentBreakpoint.name === 'xs' || currentBreakpoint.name === 'sm',
      components: initialComponents,
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
  });

  const [windowSize, setWindowSize] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  }));

  // Debounced resize handler
  const handleResize = useCallback(() => {
    let timeoutId: NodeJS.Timeout;
    
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        const newBreakpoint = getCurrentBreakpoint(newWidth, breakpoints);
        
        setWindowSize({ width: newWidth, height: newHeight });
        setLayoutState(prev => ({
          ...prev,
          isMobile: newBreakpoint.name === 'xs' || newBreakpoint.name === 'sm',
          currentBreakpoint: newBreakpoint.name,
          sidebarCollapsed: prev.sidebarCollapsed || newBreakpoint.name === 'xs',
        }));
      }, debounceMs);
    };
    
    return debouncedResize;
  }, [breakpoints, debounceMs]);

  // Set up resize listener
  useEffect(() => {
    const resizeHandler = handleResize();
    window.addEventListener('resize', resizeHandler);
    
    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, [handleResize]);

  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    setLayoutState(prev => ({
      ...prev,
      sidebarCollapsed: !prev.sidebarCollapsed,
    }));
  }, []);

  // Update component position
  const updateComponentPosition = useCallback((
    componentId: string,
    newPosition: LayoutComponent['position']
  ) => {
    setLayoutState(prev => ({
      ...prev,
      components: prev.components.map(component =>
        component.id === componentId
          ? { ...component, position: newPosition }
          : component
      ),
    }));
  }, []);

  // Add component
  const addComponent = useCallback((component: LayoutComponent) => {
    setLayoutState(prev => ({
      ...prev,
      components: [...prev.components, component],
    }));
  }, []);

  // Remove component
  const removeComponent = useCallback((componentId: string) => {
    setLayoutState(prev => ({
      ...prev,
      components: prev.components.filter(c => c.id !== componentId),
    }));
  }, []);

  // Update drag-drop configuration
  const updateDragDropConfig = useCallback((
    updates: Partial<LayoutState['dragDropConfig']>
  ) => {
    setLayoutState(prev => ({
      ...prev,
      dragDropConfig: { ...prev.dragDropConfig, ...updates },
    }));
  }, []);

  // Get current breakpoint info
  const getCurrentBreakpointInfo = useCallback(() => {
    return breakpoints.find(bp => bp.name === layoutState.currentBreakpoint) || breakpoints[0];
  }, [breakpoints, layoutState.currentBreakpoint]);

  // Check if current breakpoint matches
  const isBreakpoint = useCallback((breakpointName: ResponsiveBreakpoint['name']) => {
    return layoutState.currentBreakpoint === breakpointName;
  }, [layoutState.currentBreakpoint]);

  // Check if current breakpoint is at least the specified one
  const isBreakpointUp = useCallback((breakpointName: ResponsiveBreakpoint['name']) => {
    const currentIndex = breakpoints.findIndex(bp => bp.name === layoutState.currentBreakpoint);
    const targetIndex = breakpoints.findIndex(bp => bp.name === breakpointName);
    return currentIndex >= targetIndex;
  }, [breakpoints, layoutState.currentBreakpoint]);

  // Check if current breakpoint is at most the specified one
  const isBreakpointDown = useCallback((breakpointName: ResponsiveBreakpoint['name']) => {
    const currentIndex = breakpoints.findIndex(bp => bp.name === layoutState.currentBreakpoint);
    const targetIndex = breakpoints.findIndex(bp => bp.name === breakpointName);
    return currentIndex <= targetIndex;
  }, [breakpoints, layoutState.currentBreakpoint]);

  // Get responsive value based on current breakpoint
  const getResponsiveValue = useCallback(<T>(values: Partial<Record<ResponsiveBreakpoint['name'], T>>): T | undefined => {
    // Try current breakpoint first
    if (values[layoutState.currentBreakpoint]) {
      return values[layoutState.currentBreakpoint];
    }
    
    // Fall back to smaller breakpoints
    const currentIndex = breakpoints.findIndex(bp => bp.name === layoutState.currentBreakpoint);
    for (let i = currentIndex - 1; i >= 0; i--) {
      const bp = breakpoints[i];
      if (values[bp.name]) {
        return values[bp.name];
      }
    }
    
    return undefined;
  }, [breakpoints, layoutState.currentBreakpoint]);

  return {
    // State
    layoutState,
    windowSize,
    
    // Actions
    toggleSidebar,
    updateComponentPosition,
    addComponent,
    removeComponent,
    updateDragDropConfig,
    
    // Utilities
    getCurrentBreakpointInfo,
    isBreakpoint,
    isBreakpointUp,
    isBreakpointDown,
    getResponsiveValue,
    
    // Computed values
    isMobile: layoutState.isMobile,
    currentBreakpoint: layoutState.currentBreakpoint,
    sidebarCollapsed: layoutState.sidebarCollapsed,
    components: layoutState.components,
    dragDropConfig: layoutState.dragDropConfig,
  };
};