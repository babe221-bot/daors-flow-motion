import anime from 'animejs';
import { AnimationConfig } from '@/types/animations';

export const layoutAnimationPresets = {
  gridReorder: {
    duration: 400,
    easing: 'easeOutBack',
  },
  componentResize: {
    duration: 300,
    easing: 'easeInOutQuad',
  },
  layoutTransition: {
    duration: 500,
    easing: 'easeOutExpo',
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
      easing: config.easing || 'easeOutBack',
      autoplay: false,
    });
  });

  animations.forEach(animation => animation.play());
  return animations;
};

export const animateComponentResize = (
  element: HTMLElement,
  newSize: { width: number; height: number },
  config: AnimationConfig = layoutAnimationPresets.componentResize
) => {
  return anime({
    targets: element,
    width: newSize.width,
    height: newSize.height,
    duration: config.duration || 300,
    easing: config.easing || 'easeInOutQuad',
  });
};

export const animateLayoutTransition = (
  elements: HTMLElement[],
  config: AnimationConfig = layoutAnimationPresets.layoutTransition
) => {
  return anime({
    targets: elements,
    opacity: [0, 1],
    scale: [0.9, 1],
    duration: config.duration || 500,
    delay: anime.stagger(100),
    easing: config.easing || 'easeOutExpo',
  });
};
