export interface AnimationConfig {
  duration?: number;
  easing?: string;
  delay?: number;
  autoplay?: boolean;
  loop?: boolean;
  direction?: 'normal' | 'reverse' | 'alternate';
  [key: string]: unknown;
}

export type AnimationPreset = 
  | 'slideUp' 
  | 'slideDown' 
  | 'slideLeft' 
  | 'slideRight' 
  | 'fadeIn' 
  | 'scaleIn' 
  | 'bounce' 
  | 'pulse';

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
  inputFocus: AnimationConfig;
  modalSlide: AnimationConfig;
}
