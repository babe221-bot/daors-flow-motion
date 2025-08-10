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
}
