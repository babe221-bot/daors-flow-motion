import anime from 'animejs';
import { AnimationConfig } from '@/types/animations';

export const interactionAnimationPresets = {
  buttonHover: {
    duration: 200,
    easing: 'easeOutBack',
  },
  cardHover: {
    duration: 300,
    easing: 'easeOutCubic',
  },
  inputFocus: {
    duration: 150,
    easing: 'easeInOutQuad',
  },
  modalSlide: {
    duration: 400,
    easing: 'easeOutCubic',
  },
};

export const animateButtonHover = (
  element: HTMLElement,
  isHovering: boolean,
  config: AnimationConfig = interactionAnimationPresets.buttonHover
) => {
  return anime({
    targets: element,
    scale: isHovering ? 1.05 : 1,
    duration: config.duration || 200,
    easing: config.easing || 'easeOutBack',
  });
};

export const animateCardHover = (
  element: HTMLElement,
  isHovering: boolean,
  config: AnimationConfig = interactionAnimationPresets.cardHover
) => {
  return anime({
    targets: element,
    translateY: isHovering ? -4 : 0,
    boxShadow: isHovering 
      ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    duration: config.duration || 300,
    easing: config.easing || 'easeOutCubic',
  });
};

export const animateInputFocus = (
  element: HTMLElement,
  isFocused: boolean,
  config: AnimationConfig = interactionAnimationPresets.inputFocus
) => {
  return anime({
    targets: element,
    borderColor: isFocused ? 'rgb(59, 130, 246)' : 'rgb(209, 213, 219)',
    scale: isFocused ? 1.02 : 1,
    duration: config.duration || 150,
    easing: config.easing || 'easeInOutQuad',
  });
};

export const animateModalSlide = (
  element: HTMLElement,
  isOpen: boolean,
  config: AnimationConfig = interactionAnimationPresets.modalSlide
) => {
  return anime({
    targets: element,
    opacity: isOpen ? [0, 1] : [1, 0],
    translateY: isOpen ? [50, 0] : [0, 50],
    duration: config.duration || 400,
    easing: config.easing || 'easeOutCubic',
  });
};
