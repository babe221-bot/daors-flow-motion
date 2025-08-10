// Layout-specific animations using anime.js
import anime from '@/lib/anime';
import { AnimationConfig, LayoutAnimations } from '@/types/animations';

// Default animation configurations for layout
export const layoutAnimationPresets: LayoutAnimations = {
  gridReorder: {
    duration: 400,
    easing: 'easeOutQuart',
    autoplay: false,
  },
  componentDrag: {
    duration: 200,
    easing: 'easeOutCubic',
    autoplay: false,
  },
  headerSticky: {
    duration: 300,
    easing: 'easeOutQuad',
    autoplay: false,
  },
  footerReveal: {
    duration: 350,
    easing: 'easeOutExpo',
    autoplay: false,
  },
  responsiveReflow: {
    duration: 500,
    easing: 'easeOutQuint',
    autoplay: false,
  },
};

// Grid reorder animation for drag-and-drop
export const animateGridReorder = (
  elements: HTMLElement[],
  newPositions: { x: number; y: number }[],
  config: AnimationConfig = layoutAnimationPresets.gridReorder
) => {
  const animations = elements.map((element, index) => {
    const newPos = newPositions[index];
    return anime({
      targets: element,
      translateX: newPos.x,
      translateY: newPos.y,
      duration: config.duration,
      easing: config.easing,
      autoplay: false,
    });
  });

  // Play all animations simultaneously
  animations.forEach(animation => animation.play());
  return animations;
};

// Component drag animation
export const animateComponentDrag = (
  element: HTMLElement,
  isDragging: boolean,
  config: AnimationConfig = layoutAnimationPresets.componentDrag
) => {
  return anime({
    targets: element,
    scale: isDragging ? 1.05 : 1,
    boxShadow: isDragging 
      ? '0 20px 40px rgba(0, 0, 0, 0.15)' 
      : '0 4px 8px rgba(0, 0, 0, 0.1)',
    zIndex: isDragging ? 1000 : 'auto',
    duration: config.duration,
    easing: config.easing,
  });
};

// Header sticky animation
export const animateHeaderSticky = (
  element: HTMLElement,
  isSticky: boolean,
  config: AnimationConfig = layoutAnimationPresets.headerSticky
) => {
  return anime({
    targets: element,
    backgroundColor: isSticky 
      ? 'rgba(var(--background), 0.95)' 
      : 'transparent',
    backdropFilter: isSticky ? 'blur(12px)' : 'blur(0px)',
    borderBottom: isSticky 
      ? '1px solid rgba(var(--border), 0.5)' 
      : '1px solid transparent',
    paddingTop: isSticky ? '8px' : '16px',
    paddingBottom: isSticky ? '8px' : '16px',
    duration: config.duration,
    easing: config.easing,
  });
};

// Footer reveal animation
export const animateFooterReveal = (
  element: HTMLElement,
  isVisible: boolean,
  config: AnimationConfig = layoutAnimationPresets.footerReveal
) => {
  return anime({
    targets: element,
    translateY: isVisible ? 0 : '100%',
    opacity: isVisible ? 1 : 0,
    duration: config.duration,
    easing: config.easing,
  });
};

// Responsive reflow animation
export const animateResponsiveReflow = (
  container: HTMLElement,
  newLayout: 'mobile' | 'tablet' | 'desktop',
  config: AnimationConfig = layoutAnimationPresets.responsiveReflow
) => {
  const children = container.querySelectorAll('[data-layout-item]');
  
  return anime({
    targets: children,
    opacity: [1, 0.7, 1],
    scale: [1, 0.95, 1],
    duration: config.duration,
    easing: config.easing,
    delay: anime.stagger(50),
    complete: () => {
      // Apply new layout classes after animation
      container.setAttribute('data-layout', newLayout);
    },
  });
};

// Drag drop placeholder animation
export const animateDragDropPlaceholder = (
  element: HTMLElement,
  isActive: boolean
) => {
  return anime({
    targets: element,
    opacity: isActive ? 0.6 : 0,
    scale: isActive ? 1 : 0.9,
    borderWidth: isActive ? '2px' : '0px',
    duration: 200,
    easing: 'easeOutQuad',
  });
};

// Grid item entrance animation
export const animateGridItemEntrance = (
  elements: NodeListOf<HTMLElement>,
  config: Partial<AnimationConfig> = {}
) => {
  return anime({
    targets: elements,
    opacity: [0, 1],
    scale: [0.8, 1],
    translateY: [20, 0],
    duration: config.duration || 500,
    delay: anime.stagger(100),
    easing: config.easing || 'easeOutBack',
  });
};

// Layout transition between breakpoints
export const animateBreakpointTransition = (
  container: HTMLElement,
  fromBreakpoint: string,
  toBreakpoint: string,
  config: AnimationConfig = layoutAnimationPresets.responsiveReflow
) => {
  const items = container.querySelectorAll('[data-grid-item]');
  
  // First phase: fade out
  return anime({
    targets: items,
    opacity: 0.3,
    scale: 0.95,
    duration: config.duration * 0.4,
    easing: 'easeOutQuad',
    complete: () => {
      // Apply new breakpoint classes
      container.setAttribute('data-breakpoint', toBreakpoint);
      
      // Second phase: fade in with new layout
      anime({
        targets: items,
        opacity: 1,
        scale: 1,
        duration: config.duration * 0.6,
        delay: anime.stagger(30),
        easing: 'easeOutBack',
      });
    },
  });
};

// Sticky element scroll animation
export const animateStickyScroll = (
  element: HTMLElement,
  scrollProgress: number,
  config: Partial<AnimationConfig> = {}
) => {
  const opacity = Math.max(0.7, 1 - scrollProgress * 0.3);
  const blur = scrollProgress * 8;
  
  return anime({
    targets: element,
    opacity,
    backdropFilter: `blur(${blur}px)`,
    duration: config.duration || 100,
    easing: config.easing || 'linear',
  });
};