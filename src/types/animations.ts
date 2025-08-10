export interface AnimationConfig {
  duration?: number;
  easing?: string;
  delay?: number;
  autoplay?: boolean;
  loop?: boolean;
  direction?: 'normal' | 'reverse' | 'alternate';
}

export interface NavigationAnimations {
  sidebarToggle: AnimationConfig;
  menuItemHover: AnimationConfig;
  dropdownSlide: AnimationConfig;
  breadcrumbTransition: AnimationConfig;
}

export interface LayoutAnimations {
  gridReorder: AnimationConfig;
  componentAdd: AnimationConfig;
  componentRemove: AnimationConfig;
  componentUpdate: AnimationConfig;
}

export interface InteractionAnimations {
  buttonHover: AnimationConfig;
  cardHover: AnimationConfig;
  inputFocus: AnimationConfig;
  modalSlide: AnimationConfig;
}

export type AnimationPreset = 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'fadeIn' | 'scaleIn' | 'bounce' | 'pulse';

export interface AnimationContextValue {
  createAnimation: (element: HTMLElement, config: AnimationConfig) => any;
  animateEntrance: (element: HTMLElement, preset: AnimationPreset, config?: AnimationConfig) => any;
  createHoverAnimation: (element: HTMLElement, hoverConfig: AnimationConfig, normalConfig: AnimationConfig) => any;
  cleanup: () => void;
}
