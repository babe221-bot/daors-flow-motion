import anime from 'animejs';
import { AnimationConfig } from '@/types/animations';

export const layoutAnimationPresets = {
  gridReorder: {
    duration: 400,
    easing: 'easeOutCubic',
  },
  componentAdd: {
    duration: 300,
    easing: 'easeOutBack',
  },
  componentRemove: {
    duration: 250,
    easing: 'easeInCubic',
  },
  componentUpdate: {
    duration: 200,
    easing: 'easeInOutQuad',
  },
};

export const animateGridReorder = (
  elements: HTMLElement[],
  newPositions: { x: number; y: number }[],
  config: AnimationConfig = layoutAnimationPresets.gridReorder
) => {
  const animations = elements.map((element, index) => {
    const newPos = newPositions[index];
    return anime({
      targets: element,
      translateX: newPos.x,
      translateY: newPos.y,
      duration: config.duration || 400,
      easing: config.easing || 'easeOutCubic',
      autoplay: false,
    });
  });

  animations.forEach(animation => animation.play());
  return animations;
};

export const animateComponentAdd = (
  element: HTMLElement,
  config: AnimationConfig = layoutAnimationPresets.componentAdd
) => {
  return anime({
    targets: element,
    opacity: [0, 1],
    scale: [0.8, 1],
    duration: config.duration || 300,
    easing: config.easing || 'easeOutBack',
  });
};

export const animateComponentRemove = (
  element: HTMLElement,
  config: AnimationConfig = layoutAnimationPresets.componentRemove
) => {
  return anime({
    targets: element,
    opacity: [1, 0],
    scale: [1, 0.8],
    duration: config.duration || 250,
    easing: config.easing || 'easeInCubic',
  });
};

export const animateComponentUpdate = (
  element: HTMLElement,
  config: AnimationConfig = layoutAnimationPresets.componentUpdate
) => {
  return anime({
    targets: element,
    opacity: [0.5, 1],
    duration: config.duration || 200,
    easing: config.easing || 'easeInOutQuad',
  });
};
