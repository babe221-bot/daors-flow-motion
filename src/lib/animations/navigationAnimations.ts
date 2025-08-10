import anime from 'animejs';
import { AnimationConfig } from '@/types/animations';

export const navigationAnimationPresets = {
  sidebarToggle: {
    duration: 300,
    easing: 'easeOutQuad',
  },
  menuItemHover: {
    duration: 200,
    easing: 'easeOutBack',
  },
  dropdownSlide: {
    duration: 250,
    easing: 'easeOutCubic',
  },
  breadcrumbTransition: {
    duration: 150,
    easing: 'easeInOutQuad',
  },
};

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
      const children = element.querySelectorAll('[data-animate-child]');
      if (children.length > 0) {
        anime({
          targets: children,
          opacity: isExpanded ? [0, 1] : [1, 0],
          translateX: isExpanded ? [-20, 0] : [0, -20],
          duration: (config.duration || 300) * 0.6,
          delay: anime.stagger(30),
          easing: 'easeOutQuad',
        });
      }
    },
  });
};

export const animateMenuItemHover = (
  element: HTMLElement,
  isHovering: boolean,
  config: AnimationConfig = navigationAnimationPresets.menuItemHover
) => {
  return anime({
    targets: element,
    translateX: isHovering ? 4 : 0,
    backgroundColor: isHovering ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
    duration: config.duration,
    easing: config.easing,
  });
};

export const animateDropdownSlide = (
  element: HTMLElement,
  isOpen: boolean,
  config: AnimationConfig = navigationAnimationPresets.dropdownSlide
) => {
  return anime({
    targets: element,
    opacity: isOpen ? [0, 1] : [1, 0],
    translateY: isOpen ? [-10, 0] : [0, -10],
    duration: config.duration,
    easing: config.easing,
  });
};

export const animateBreadcrumbTransition = (
  elements: HTMLElement[],
  config: AnimationConfig = navigationAnimationPresets.breadcrumbTransition
) => {
  return anime({
    targets: elements,
    opacity: [0, 1],
    translateX: [-10, 0],
    duration: config.duration,
    delay: anime.stagger(50),
    easing: config.easing,
  });
};
