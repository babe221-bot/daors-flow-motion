// Animation configuration types
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
  searchExpand: AnimationConfig;
  userMenuSlide: AnimationConfig;
}

export interface LayoutAnimations {
  gridReorder: AnimationConfig;
  componentEnter: AnimationConfig;
  componentExit: AnimationConfig;
  resize: AnimationConfig;
}

export interface InteractionAnimations {
  buttonHover: AnimationConfig;
  cardHover: AnimationConfig;
  ripple: AnimationConfig;
  shake: AnimationConfig;
}

export type AnimationPreset = 'subtle' | 'medium' | 'intense' | 'custom';
