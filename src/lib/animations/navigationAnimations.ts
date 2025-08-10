// Navigation-specific animations using anime.js
import anime from '@/lib/anime';
import { AnimationConfig, NavigationAnimations } from '@/types/animations';

// Default animation configurations for navigation
export const navigationAnimationPresets: NavigationAnimations = {
  sidebarToggle: {
    duration: 300,
    easing: 'easeOutCubic',
    autoplay: false,
  },
  menuItemHover: {
    duration: 200,
    easing: 'easeOutQuad',
    autoplay: false,
  },
  breadcrumbTransition: {
    duration: 250,
    easing: 'easeOutQuart',
    delay: 50,
    autoplay: false,
  },
  mobileMenuSlide: {
    duration: 350,
    easing: 'easeOutExpo',
    autoplay: false,
  },
  searchExpand: {
    duration: 300,
    easing: 'easeOutBack',
    autoplay: false,
  },
};

// Sidebar toggle animation
export const animateSidebarToggle = (
  element: HTMLElement,
  isExpanded: boolean,
  config: AnimationConfig = navigationAnimationPresets.sidebarToggle
) => {
  return anime({
    targets: element,
    width: isExpanded ? '256px' : '64px',
    duration: config.duration,
    easing: config.easing,
    complete: () => {
      // Trigger reflow for child elements
      const children = element.querySelectorAll('[data-animate-child]');
      if (children.length > 0) {
        anime({
          targets: children,
          opacity: isExpanded ? [0, 1] : [1, 0],
          translateX: isExpanded ? [-20, 0] : [0, -20],
          duration: config.duration * 0.6,
          delay: anime.stagger(30),
          easing: 'easeOutQuad',
        });
      }
    },
  });
};

// Menu item hover animation
export const animateMenuItemHover = (
  element: HTMLElement,
  isHovering: boolean,
  config: AnimationConfig = navigationAnimationPresets.menuItemHover
) => {
  const icon = element.querySelector('[data-menu-icon]');
  const text = element.querySelector('[data-menu-text]');
  
  return anime({
    targets: element,
    backgroundColor: isHovering ? 'rgba(var(--primary), 0.1)' : 'transparent',
    scale: isHovering ? 1.02 : 1,
    duration: config.duration,
    easing: config.easing,
    complete: () => {
      if (icon) {
        anime({
          targets: icon,
          translateX: isHovering ? 4 : 0,
          duration: config.duration * 0.8,
          easing: 'easeOutBack',
        });
      }
      if (text) {
        anime({
          targets: text,
          color: isHovering ? 'rgb(var(--primary))' : 'rgb(var(--foreground))',
          duration: config.duration,
          easing: config.easing,
        });
      }
    },
  });
};

// Breadcrumb transition animation
export const animateBreadcrumbTransition = (
  elements: NodeListOf<HTMLElement>,
  config: AnimationConfig = navigationAnimationPresets.breadcrumbTransition
) => {
  return anime({
    targets: elements,
    opacity: [0, 1],
    translateY: [-10, 0],
    duration: config.duration,
    delay: anime.stagger(config.delay || 50),
    easing: config.easing,
  });
};

// Mobile menu slide animation
export const animateMobileMenuSlide = (
  element: HTMLElement,
  isOpen: boolean,
  config: AnimationConfig = navigationAnimationPresets.mobileMenuSlide
) => {
  const menuItems = element.querySelectorAll('[data-mobile-menu-item]');
  
  return anime({
    targets: element,
    translateX: isOpen ? 0 : '100%',
    duration: config.duration,
    easing: config.easing,
    complete: () => {
      if (isOpen && menuItems.length > 0) {
        anime({
          targets: menuItems,
          opacity: [0, 1],
          translateX: [30, 0],
          duration: config.duration * 0.7,
          delay: anime.stagger(50),
          easing: 'easeOutQuart',
        });
      }
    },
  });
};

// Search expand animation
export const animateSearchExpand = (
  element: HTMLElement,
  isExpanded: boolean,
  config: AnimationConfig = navigationAnimationPresets.searchExpand
) => {
  const input = element.querySelector('input');
  const suggestions = element.querySelector('[data-search-suggestions]');
  
  return anime({
    targets: element,
    width: isExpanded ? '320px' : '240px',
    duration: config.duration,
    easing: config.easing,
    complete: () => {
      if (input) {
        anime({
          targets: input,
          paddingLeft: isExpanded ? '16px' : '12px',
          paddingRight: isExpanded ? '16px' : '12px',
          duration: config.duration * 0.6,
          easing: 'easeOutQuad',
        });
      }
      if (suggestions && isExpanded) {
        anime({
          targets: suggestions,
          opacity: [0, 1],
          translateY: [-10, 0],
          duration: config.duration * 0.8,
          delay: config.duration * 0.3,
          easing: 'easeOutBack',
        });
      }
    },
  });
};

// Navigation item active state animation
export const animateActiveNavItem = (element: HTMLElement) => {
  const indicator = element.querySelector('[data-active-indicator]');
  
  if (indicator) {
    anime({
      targets: indicator,
      scaleX: [0, 1],
      duration: 300,
      easing: 'easeOutBack',
    });
  }
  
  return anime({
    targets: element,
    backgroundColor: 'rgba(var(--primary), 0.15)',
    borderLeft: '3px solid rgb(var(--primary))',
    duration: 250,
    easing: 'easeOutQuart',
  });
};

// Staggered menu items entrance animation
export const animateMenuItemsEntrance = (
  elements: NodeListOf<HTMLElement>,
  config: Partial<AnimationConfig> = {}
) => {
  return anime({
    targets: elements,
    opacity: [0, 1],
    translateX: [-20, 0],
    duration: config.duration || 400,
    delay: anime.stagger(80),
    easing: config.easing || 'easeOutQuart',
  });
};