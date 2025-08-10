import anime from 'anime.js';
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
  searchExpand: {
    duration: 400,
    easing: 'easeOutExpo',
  },
  userMenuSlide: {
    duration: 300,
    easing: 'easeOutQuart',
  },
};

export const animateSidebarToggle = (
  element: HTMLElement,
  isOpen: boolean,
  config: AnimationConfig = navigationAnimationPresets.sidebarToggle
) => {
  return anime({
    targets: element,
    translateX: isOpen ? 0 : '-100%',
    opacity: isOpen ? 1 : 0,
    duration: config.duration,
    easing: config.easing,
  });
};

export const animateMenuItemHover = (
  element: HTMLElement,
  config: AnimationConfig = navigationAnimationPresets.menuItemHover
) => {
  return anime({
    targets: element,
    translateX: 4,
    scale: 1.02,
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
    translateY: isOpen ? 0 : -10,
    opacity: isOpen ? 1 : 0,
    duration: config.duration,
    easing: config.easing,
  });
};

export const animateSearchExpand = (
  element: HTMLElement,
  isExpanded: boolean,
  config: AnimationConfig = navigationAnimationPresets.searchExpand
) => {
  return anime({
    targets: element,
    width: isExpanded ? 300 : 200,
    duration: config.duration,
    easing: config.easing,
  });
};
