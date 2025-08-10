import { AnimeInstance } from 'animejs';

export interface AnimationConfig {
  duration?: number;
  easing?: string;
  delay?: number;
  autoplay?: boolean;
}

export type AnimationPreset = 
  | 'fadeIn' 
  | 'slideUp' 
  | 'slideDown' 
  | 'slideLeft' 
  | 'slideRight' 
  | 'scaleIn' 
  | 'rotateIn';

export interface NavigationAnimations {
  sidebarToggle: AnimationConfig;
  menuItemHover: AnimationConfig;
  breadcrumbTransition: AnimationConfig;
  mobileSlide: AnimationConfig;
}

export interface LayoutAnimations {
  gridReorder: AnimationConfig;
  componentResize: AnimationConfig;
  layoutTransition: AnimationConfig;
}

export interface InteractionAnimations {
  buttonHover: AnimationConfig;
  cardHover: AnimationConfig;
  modalOpen: AnimationConfig;
  modalClose: AnimationConfig;
}

export interface AnimationContextType {
  createAnimation: (element: HTMLElement, config: AnimationConfig) => AnimeInstance;
  animateEntrance: (element: HTMLElement, preset: AnimationPreset, config?: AnimationConfig) => AnimeInstance;
  createHoverAnimation: (
    element: HTMLElement, 
    hoverConfig: AnimationConfig, 
    normalConfig: AnimationConfig
  ) => () => void;
  cleanupAnimations: () => void;
}
