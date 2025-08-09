// Animation configuration types for anime.js integration
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
  direction?: 'normal' | 'reverse' | 'alternate';
  loop?: boolean | number;
  autoplay?: boolean;
}

export interface TransitionConfig extends AnimationConfig {
  enter: {
    from: Record<string, any>;
    to: Record<string, any>;
  };
  exit: {
    from: Record<string, any>;
    to: Record<string, any>;
  };
}

export interface NavigationAnimations {
  sidebarToggle: AnimationConfig;
  menuItemHover: AnimationConfig;
  breadcrumbTransition: AnimationConfig;
  mobileMenuSlide: AnimationConfig;
  searchExpand: AnimationConfig;
}

export interface LayoutAnimations {
  gridReorder: AnimationConfig;
  componentDrag: AnimationConfig;
  headerSticky: AnimationConfig;
  footerReveal: AnimationConfig;
  responsiveReflow: AnimationConfig;
}

export interface InteractionAnimations {
  buttonPress: AnimationConfig;
  cardHover: AnimationConfig;
  modalOpen: AnimationConfig;
  tooltipShow: AnimationConfig;
  loadingSpinner: AnimationConfig;
}

export interface AnimationPresets {
  navigation: NavigationAnimations;
  layout: LayoutAnimations;
  interaction: InteractionAnimations;
}

export type AnimationTrigger = 
  | 'hover' 
  | 'click' 
  | 'focus' 
  | 'scroll' 
  | 'resize' 
  | 'mount' 
  | 'unmount';

export interface AnimatedElementConfig {
  trigger: AnimationTrigger;
  animation: AnimationConfig;
  threshold?: number; // For scroll-triggered animations
  once?: boolean; // Play animation only once
}